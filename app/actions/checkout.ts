"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { sendOrderReceiptEmail } from "@/lib/email/dispatcher";

export interface CheckoutItemInput {
  productId?: string;
  slug?: string;
  quantity: number;
  name?: string;
}

export interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    district: string;
    thana: string;
    address: string;
  };
  deliveryMethod: "courier_cod" | "store_pickup";
  pickupBranchId?: string;
  paymentMethod: "cod" | "bkash" | "nagad" | "card" | "emi";
  notes?: string;
  items: CheckoutItemInput[];
}

export interface CheckoutResult {
  success: boolean;
  trackingCode?: string;
  orderId?: string;
  error?: string;
}

export async function processCheckout(payload: CheckoutInput): Promise<CheckoutResult> {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // 1. Identify current authenticated user (if any)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 2. Validate Cart Items
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "Your shopping cart is empty." };
    }

    // 3. Resolve Branch ID (Default to Chattogram Main Hub if not provided or invalid)
    let branchId = payload.pickupBranchId;
    let pickupBranchName = "Chattogram Flagship Hub";
    const isValidUUID =
      branchId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        branchId
      );

    if (isValidUUID) {
      const { data: branchData } = await adminSupabase
        .from("branches")
        .select("id, name")
        .eq("id", branchId)
        .single();
      if (branchData?.name) {
        pickupBranchName = branchData.name;
      }
    } else {
      const { data: defaultBranch } = await adminSupabase
        .from("branches")
        .select("id, name")
        .eq("is_active", true)
        .order("is_main_hub", { ascending: false })
        .limit(1)
        .single();

      if (defaultBranch?.id) {
        branchId = defaultBranch.id;
        if (defaultBranch.name) {
          pickupBranchName = defaultBranch.name;
        }
      }
    }

    // 4. Server Security: Fetch product prices directly from database or catalog
    // Never trust client-sent subtotals or prices.
    let verifiedSubtotal = 0;
    const verifiedItems: {
      productId: string;
      unitPrice: number;
      quantity: number;
      name: string;
    }[] = [];

    for (const item of payload.items) {
      const qty = Math.max(1, Math.floor(item.quantity || 1));
      let dbProduct: {
        id: string;
        name: string;
        regular_price: number;
        sale_price: number | null;
      } | null = null;

      // Try lookup by UUID or slug in Supabase
      if (item.productId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.productId)) {
        const { data } = await adminSupabase
          .from("products")
          .select("id, name, regular_price, sale_price")
          .eq("id", item.productId)
          .single();
        dbProduct = data;
      } else if (item.slug) {
        const { data } = await adminSupabase
          .from("products")
          .select("id, name, regular_price, sale_price")
          .eq("slug", item.slug)
          .single();
        dbProduct = data;
      }

      // If product not yet seeded into Supabase products table, fallback to verified HARDWARE_PRODUCTS catalog
      let unitPrice = 0;
      let resolvedProductId = dbProduct?.id;
      let resolvedProductName = dbProduct?.name || item.name || "Hardware Component";

      if (dbProduct) {
        unitPrice = Number(dbProduct.sale_price ?? dbProduct.regular_price);
      } else {
        const catalogItem = HARDWARE_PRODUCTS.find(
          (p) => p.slug === item.slug || p.id === item.productId
        );
        if (catalogItem) {
          unitPrice = catalogItem.price ?? catalogItem.regularPrice;
          resolvedProductName = catalogItem.name;

          // Auto-sync product to database if table exists so foreign keys are satisfied
          const { data: newProd, error: insertProdErr } = await adminSupabase
            .from("products")
            .upsert(
              {
                slug: catalogItem.slug,
                name: catalogItem.name,
                brand: catalogItem.brand,
                regular_price: catalogItem.regularPrice,
                sale_price: catalogItem.price < catalogItem.regularPrice ? catalogItem.price : null,
                images: [catalogItem.image],
                specifications: {
                  socket: catalogItem.socket,
                  tdp: catalogItem.tdp,
                  ramType: catalogItem.ramType,
                  formFactor: catalogItem.formFactor,
                },
              },
              { onConflict: "slug" }
            )
            .select("id")
            .single();

          if (!insertProdErr && newProd) {
            resolvedProductId = newProd.id;
          }
        } else {
          return {
            success: false,
            error: `Unable to verify price for item: ${item.name || item.slug || "Unknown Item"}`,
          };
        }
      }

      // Ensure inventory row exists in showroom branch so atomic verification can lock and decrement
      if (resolvedProductId && branchId) {
        const { data: invRow } = await adminSupabase
          .from("inventory")
          .select("id")
          .eq("product_id", resolvedProductId)
          .eq("branch_id", branchId)
          .maybeSingle();

        if (!invRow) {
          await adminSupabase.from("inventory").insert({
            product_id: resolvedProductId,
            branch_id: branchId,
            stock_quantity: 25,
          });
        }
      }

      verifiedSubtotal += unitPrice * qty;
      verifiedItems.push({
        productId: resolvedProductId || "00000000-0000-0000-0000-000000000000",
        unitPrice,
        quantity: qty,
        name: resolvedProductName,
      });
    }

    // 5. Compute delivery fee
    const shippingFee = payload.deliveryMethod === "store_pickup" ? 0 : 150;
    const totalAmount = verifiedSubtotal + shippingFee;

    // 6. Generate unique human-readable tracking code (e.g. ORD-CTG-7892X)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingCode = `ORD-CTG-${Date.now().toString().slice(-4)}${randomSuffix}`;

    // 7. Insert Orders Header Record
    const orderInsertPayload = {
      tracking_code: trackingCode,
      user_id: user?.id || null,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      shipping_address: payload.shippingAddress,
      delivery_method: payload.deliveryMethod,
      pickup_branch_id: branchId || null,
      payment_method: payload.paymentMethod,
      payment_status: payload.paymentMethod === "cod" ? "unpaid" : "paid",
      status: "pending",
      subtotal: verifiedSubtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      notes: payload.notes || null,
    };

    const { data: createdOrder, error: orderErr } = await adminSupabase
      .from("orders")
      .insert(orderInsertPayload)
      .select("id, tracking_code")
      .single();

    if (orderErr || !createdOrder) {
      return {
        success: false,
        error: orderErr?.message || "Failed to create order. Please try again.",
      };
    }

    // 8. Execute Atomic Multi-Item Transaction (Row Lock, Stock Validation & Order Items Insertion)
    const itemsPayload = verifiedItems.map((vi) => ({
      product_id: vi.productId,
      quantity: vi.quantity,
      unit_price: vi.unitPrice,
    }));

    const { data: rpcResult, error: rpcErr } = await adminSupabase.rpc(
      "process_atomic_checkout",
      {
        p_order_id: createdOrder.id,
        p_branch_id: branchId,
        p_items: itemsPayload,
      }
    );

    // If RPC failed or returned success: false, delete pending order record and roll back cleanly
    if (rpcErr || (rpcResult && !rpcResult.success)) {
      console.warn("Atomic checkout failed, rolling back order:", rpcErr || rpcResult);
      await adminSupabase.from("orders").delete().eq("id", createdOrder.id);

      const errorMessage =
        rpcResult?.error ||
        rpcErr?.message ||
        "Stock verification failed. Multi-item transaction rolled back cleanly.";

      return {
        success: false,
        error: errorMessage,
      };
    }

    // 10. Dispatch Transactional Order Receipt Email (Resend / Dev Mock Fallback)
    try {
      await sendOrderReceiptEmail({
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        trackingCode: createdOrder.tracking_code,
        deliveryMethod: payload.deliveryMethod,
        totalAmount,
        subtotal: verifiedSubtotal,
        shippingFee,
        items: verifiedItems.map((vi) => ({
          name: vi.name,
          quantity: vi.quantity,
          unitPrice: vi.unitPrice,
        })),
        shippingAddress: payload.shippingAddress,
        pickupBranchName,
        paymentMethod: payload.paymentMethod,
      });
    } catch (emailErr) {
      // Non-blocking: customer checkout must succeed even if mail delivery service fails
      console.error("Non-blocking order receipt email error:", emailErr);
    }

    return {
      success: true,
      trackingCode: createdOrder.tracking_code,
      orderId: createdOrder.id,
    };
  } catch (err: unknown) {
    console.error("Checkout action exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal order processing error",
    };
  }
}
