"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSteadfastConsignment } from "@/lib/services/steadfastCourier";

export interface AdminOrder {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_email: string;
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
  } | null;
  items_count: number;
  courier_consignment_id?: string | null;
  courier_tracking_code?: string | null;
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  try {
    const admin = createAdminClient();
    const { data: dbOrders, error } = await admin
      .from("orders")
      .select("*, branches(name, address), order_items(id)")
      .order("created_at", { ascending: false });

    if (!error && dbOrders && dbOrders.length > 0) {
      return dbOrders.map((o) => ({
        id: o.id,
        tracking_code: o.tracking_code,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        customer_phone: o.customer_phone,
        delivery_method: o.delivery_method,
        payment_method: o.payment_method,
        payment_status: o.payment_status,
        status: o.status,
        subtotal: Number(o.subtotal),
        shipping_fee: Number(o.shipping_fee),
        total_amount: Number(o.total_amount),
        created_at: o.created_at,
        shipping_address: o.shipping_address || {},
        pickup_branch: o.branches || null,
        items_count: Array.isArray(o.order_items) ? o.order_items.length : 1,
        courier_consignment_id: o.courier_consignment_id || null,
        courier_tracking_code: o.courier_tracking_code || null,
      }));
    }

    // Default sample orders if fresh database
    return [
      {
        id: "demo-ord-1",
        tracking_code: "ORD-CTG-8842K",
        customer_name: "Tanvir Hossain Chowdhury",
        customer_email: "tanvir@ctg-tech.com",
        customer_phone: "+8801812345678",
        delivery_method: "store_pickup",
        payment_method: "cod",
        payment_status: "unpaid",
        status: "processing",
        subtotal: 124500,
        shipping_fee: 0,
        total_amount: 124500,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        shipping_address: {
          district: "Chattogram",
          thana: "Panchlaish",
          address: "GEC Circle / Nasirabad",
        },
        pickup_branch: {
          name: "Chattogram Flagship Showroom",
          address: "GEC Circle / Agrabad Commercial Area, Chattogram",
        },
        items_count: 3,
      },
      {
        id: "demo-ord-2",
        tracking_code: "ORD-CTG-7190M",
        customer_name: "Nafis Imtiaz",
        customer_email: "nafis@devlab.io",
        customer_phone: "+8801711223344",
        delivery_method: "courier_cod",
        payment_method: "bkash",
        payment_status: "paid",
        status: "confirmed",
        subtotal: 68000,
        shipping_fee: 150,
        total_amount: 68150,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        shipping_address: {
          district: "Dhaka",
          thana: "Mirpur DOHS",
          address: "House 42, Road 9",
        },
        pickup_branch: null,
        items_count: 1,
      },
    ];
  } catch (err) {
    console.error("Error fetching admin orders:", err);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: AdminOrder["status"]
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);

    if (isUUID) {
      const { error } = await admin
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update order status",
    };
  }
}

export interface DispatchCourierResult {
  success: boolean;
  consignmentId?: string;
  trackingCode?: string;
  isMock?: boolean;
  message?: string;
  error?: string;
}

/**
 * 1-Click Courier Dispatch Server Action
 * Reads order details, books automated delivery consignment via Steadfast,
 * updates order status to 'dispatched', and saves the courier tracking ID.
 */
export async function dispatchOrderToCourier(
  orderId: string
): Promise<DispatchCourierResult> {
  try {
    const admin = createAdminClient();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);

    if (!isUUID) {
      // Simulate successful dispatch for demo orders
      const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
      const mockConsignmentId = `SF-CTG-${randomSuffix}`;
      return {
        success: true,
        consignmentId: mockConsignmentId,
        trackingCode: `SFTRK-${randomSuffix}`,
        isMock: true,
        message: "Demo order simulated dispatch successful.",
      };
    }

    // 1. Fetch complete order details
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return {
        success: false,
        error: orderErr?.message || "Order not found in database.",
      };
    }

    // 2. Format customer address
    const shipping = order.shipping_address || {};
    const formattedAddress = [
      shipping.address,
      shipping.thana,
      shipping.district || "Chattogram",
    ]
      .filter(Boolean)
      .join(", ");

    // 3. Determine COD amount: 0 if paid, full total if unpaid COD
    const codAmount =
      order.payment_method === "cod" && order.payment_status !== "paid"
        ? Number(order.total_amount)
        : 0;

    // 4. Call Courier Service (Steadfast with auto-mock fallback)
    const courierRes = await createSteadfastConsignment({
      invoice: order.tracking_code,
      recipient_name: order.customer_name || "Valued Customer",
      recipient_phone: order.customer_phone || "01800000000",
      recipient_address: formattedAddress || "Chattogram Commercial Area",
      cod_amount: codAmount,
      note: `VoltMatrix PC Component Delivery [Invoice: ${order.tracking_code}]`,
    });

    if (!courierRes.success) {
      return {
        success: false,
        error: courierRes.message || "Failed to create consignment with courier service.",
      };
    }

    // 5. Update order record in Supabase
    const { error: updateErr } = await admin
      .from("orders")
      .update({
        status: "dispatched",
        courier_consignment_id: courierRes.consignment_id,
        courier_tracking_code: courierRes.tracking_code,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateErr) {
      console.warn("Failed to persist courier consignment to database:", updateErr);
    }

    // 6. Invalidate admin orders cache for instant refresh
    revalidatePath("/admin/orders");

    return {
      success: true,
      consignmentId: courierRes.consignment_id,
      trackingCode: courierRes.tracking_code,
      isMock: courierRes.isMock,
      message: courierRes.message,
    };
  } catch (err: unknown) {
    console.error("Courier dispatch exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal courier dispatch failure.",
    };
  }
}

