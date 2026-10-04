"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface TrackedOrder {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  delivery_method: string;
  payment_method: string;
  payment_status: string;
  status: "pending" | "confirmed" | "processing" | "dispatched" | "delivered" | "cancelled";
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  created_at: string;
  shipping_address: {
    district?: string;
    thana?: string;
    address?: string;
  };
  pickup_branch?: {
    name: string;
    address: string;
    district: string;
    phone?: string;
  } | null;
  items: {
    id: string;
    unit_price: number;
    quantity: number;
    product_name: string;
  }[];
}

export async function getOrderByTrackingCode(
  trackingCode: string
): Promise<{ success: boolean; order?: TrackedOrder; error?: string }> {
  if (!trackingCode || trackingCode.trim().length === 0) {
    return { success: false, error: "Please enter a valid tracking code." };
  }

  try {
    const admin = createAdminClient();
    const cleanCode = trackingCode.trim().toUpperCase();

    // Query order
    const { data: order, error } = await admin
      .from("orders")
      .select("*, branches(name, address, district, phone)")
      .eq("tracking_code", cleanCode)
      .maybeSingle();

    if (error || !order) {
      // Also allow checking by UUID if user pasted ID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanCode)) {
        const { data: orderById } = await admin
          .from("orders")
          .select("*, branches(name, address, district, phone)")
          .eq("id", cleanCode)
          .maybeSingle();

        if (orderById) {
          return formatOrderResponse(admin, orderById);
        }
      }

      return {
        success: false,
        error: `No order found with tracking code "${cleanCode}". Please verify your invoice code or contact customer support.`,
      };
    }

    return formatOrderResponse(admin, order);
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Error retrieving tracking status",
    };
  }
}

async function formatOrderResponse(
  admin: ReturnType<typeof createAdminClient>,
  order: Record<string, unknown>
): Promise<{ success: boolean; order: TrackedOrder }> {
  // Query order items
  const { data: rawItems } = await admin
    .from("order_items")
    .select("id, unit_price, quantity, products(name)")
    .eq("order_id", String(order.id));

  const items = (
    (rawItems as unknown as Array<{
      id: string;
      unit_price: number | string;
      quantity: number;
      products?: { name?: string } | { name?: string }[] | null;
    }>) || []
  ).map((item) => {
    let productName = "Hardware Component";
    if (Array.isArray(item.products) && item.products[0]?.name) {
      productName = item.products[0].name;
    } else if (item.products && !Array.isArray(item.products) && item.products.name) {
      productName = item.products.name;
    }

    return {
      id: item.id,
      unit_price: Number(item.unit_price),
      quantity: item.quantity,
      product_name: productName,
    };
  });


  const tracked: TrackedOrder = {
    id: String(order.id),
    tracking_code: String(order.tracking_code),
    customer_name: String(order.customer_name),
    customer_phone: String(order.customer_phone),
    delivery_method: String(order.delivery_method),
    payment_method: String(order.payment_method),
    payment_status: String(order.payment_status),
    status: order.status as TrackedOrder["status"],
    subtotal: Number(order.subtotal),
    shipping_fee: Number(order.shipping_fee),
    total_amount: Number(order.total_amount),
    created_at: String(order.created_at),
    shipping_address: (order.shipping_address as TrackedOrder["shipping_address"]) || {},
    pickup_branch: (order.branches as TrackedOrder["pickup_branch"]) || null,
    items,
  };

  return { success: true, order: tracked };
}

