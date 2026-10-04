import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountDashboardClient from "./AccountDashboardClient";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch user orders
  const { data: rawOrders } = await supabase
    .from("orders")
    .select("id, tracking_code, status, total_amount, payment_status, created_at, delivery_method")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orders = (rawOrders || []).map((o) => ({
    id: o.id,
    tracking_code: o.tracking_code,
    status: o.status,
    total_amount: Number(o.total_amount),
    payment_status: o.payment_status,
    created_at: o.created_at,
    delivery_method: o.delivery_method,
  }));

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[85vh] py-8 sm:py-10">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        <AccountDashboardClient
          profile={profile}
          orders={orders}
          userEmail={user.email || ""}
        />
      </div>
    </div>
  );
}
