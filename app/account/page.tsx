import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountDashboardClient, { AccountOrder, ProfileData } from "./AccountDashboardClient";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Fetch user profile and order history in parallel
  const [profileResult, ordersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, default_address, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("orders")
      .select(`
        id,
        tracking_code,
        status,
        total_amount,
        subtotal,
        shipping_fee,
        payment_status,
        payment_method,
        delivery_method,
        shipping_address,
        notes,
        created_at,
        order_items (
          id,
          product_id,
          unit_price,
          quantity,
          products (
            id,
            name,
            slug,
            image_url,
            category:categories ( name )
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const rawProfile = profileResult.data;
  const rawOrders = ordersResult.data || [];

  const profile: ProfileData | null = rawProfile
    ? {
        id: rawProfile.id,
        email: rawProfile.email || user.email || "",
        full_name: rawProfile.full_name,
        phone: rawProfile.phone,
        role: rawProfile.role || "customer",
        default_address: (rawProfile.default_address as Record<string, string>) || null,
        created_at: rawProfile.created_at,
      }
    : null;

  const orders: AccountOrder[] = rawOrders.map((ord: any) => {
    const items = (ord.order_items || []).map((item: any) => {
      const dbProd = Array.isArray(item.products) ? item.products[0] : item.products;
      const catalogMatch = HARDWARE_PRODUCTS.find(
        (p) => p.id === item.product_id || p.slug === item.product_id
      );

      return {
        id: item.id,
        productId: item.product_id,
        unitPrice: Number(item.unit_price || catalogMatch?.price || 0),
        quantity: Number(item.quantity || 1),
        name: dbProd?.name || catalogMatch?.name || "High-Performance Hardware Component",
        slug: dbProd?.slug || catalogMatch?.slug || "",
        imageUrl:
          dbProd?.image_url ||
          catalogMatch?.image ||
          "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
        category: dbProd?.category?.name || catalogMatch?.category || "Components",
        warranty: catalogMatch?.warranty || "36 Months Official Distributor Warranty",
      };
    });

    return {
      id: ord.id,
      trackingCode: ord.tracking_code,
      status: ord.status,
      totalAmount: Number(ord.total_amount),
      subtotal: Number(ord.subtotal || ord.total_amount),
      shippingFee: Number(ord.shipping_fee || 0),
      paymentStatus: ord.payment_status,
      paymentMethod: ord.payment_method,
      deliveryMethod: ord.delivery_method,
      shippingAddress: (ord.shipping_address as {
        district?: string;
        thana?: string;
        address?: string;
      }) || null,
      notes: ord.notes || null,
      createdAt: ord.created_at,
      items,
    };
  });

  return (
    <div className="w-full bg-[#030712] min-h-screen py-8 text-slate-100">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        <AccountDashboardClient
          profile={profile}
          orders={orders}
          userEmail={user.email || profile?.email || ""}
        />
      </div>
    </div>
  );
}
