import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Package,
  Truck,
  Building2,
  Database,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  PlusCircle,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Admin Console | VoltMatrix Chattogram Hub",
  description: "Central hardware repository, inventory control, and fulfillment telemetry.",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch quick metrics for admin overview
  const { count: branchCount } = await adminClient
    .from("branches")
    .select("id", { count: "exact", head: true });

  const { count: orderCount } = await adminClient
    .from("orders")
    .select("id", { count: "exact", head: true });

  const { count: productCount } = await adminClient
    .from("products")
    .select("id", { count: "exact", head: true });

  const { data: recentOrders } = await adminClient
    .from("orders")
    .select(
      "id, tracking_code, customer_name, total_amount, status, payment_status, created_at, delivery_method"
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: branches } = await adminClient
    .from("branches")
    .select("*")
    .order("is_main_hub", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Admin Hero Header */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-mono font-bold uppercase tracking-wider border border-red-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Root Operational Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Chattogram Flagship Control Console
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            Logged in as: <strong className="text-slate-200 font-mono">{user?.email || "admin@voltmatrix.bd"}</strong>.
            Centralized hub for inventory synchronization, price matrix adjustments, and consignment dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-900/30 transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Order Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Catalog Inventory</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {productCount ?? 8}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Hardware SKUs</span>
            <Link href="/admin/products" className="text-blue-400 hover:underline flex items-center gap-0.5 text-[11px]">
              View Table <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Recorded Orders</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {orderCount ?? recentOrders?.length ?? 2}
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
            <span>Customer Consignments</span>
            <Link href="/admin/orders" className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[11px]">
              Dispatch <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Showroom Hubs</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {branchCount ?? branches?.length ?? 1}
          </div>
          <div className="text-xs text-slate-400 pt-1">
            <span className="text-emerald-400 font-medium">Chattogram Flagship</span> active
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Postgres DB Cluster</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">
            32ms
          </div>
          <div className="text-xs text-slate-400 pt-1">
            <span>Singapore ap-southeast-1</span>
          </div>
        </div>
      </div>

      {/* Quick Action Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Quick Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Package className="w-6 h-6" />
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Open Manager <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Catalog & Inventory Grid</h2>
            <p className="text-xs text-slate-400 mt-1">
              Inline spreadsheet editing for pricing and stock quantity. Drag-and-drop hardware image dropzone and dynamic JSONB specifications editor.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-3 text-xs">
            <Link
              href="/admin/products"
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              Catalog Editor
            </Link>
          </div>
        </div>

        {/* Orders Quick Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Open Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Order Pipeline & Consignments</h2>
            <p className="text-xs text-slate-400 mt-1">
              Fulfillment state management (Pending → Confirmed → Processing → Dispatched → Delivered). Printable packing slips with barcode & QR code.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-3 text-xs">
            <Link
              href="/admin/orders"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
            >
              Dispatch Center
            </Link>
            <Link
              href="/track-order"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <span>Public Tracking</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Branch Hubs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Store Branches &amp; Fulfillment Hubs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chattogram Flagship Store with seamless future expansion to multiple hubs
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {branches?.length || 1} Registered Hub
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches && branches.length > 0 ? (
            branches.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white text-sm">{b.name}</strong>
                  {b.is_main_hub && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                      Primary Flagship
                    </span>
                  )}
                </div>
                <div className="text-slate-300">{b.address}</div>
                <div className="text-slate-500 text-[11px]">
                  District: {b.district} • Contact: {b.phone || "+880 1800-000000"}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-400 font-mono">
              Chattogram Flagship Store (GEC Circle / Agrabad)
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Consignments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live customer orders from checkout
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <span>Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-2.5 px-3">Tracking Code</th>
                  <th className="py-2.5 px-3">Consignee</th>
                  <th className="py-2.5 px-3">Delivery</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <Link
                        href={`/track-order?code=${ord.tracking_code}`}
                        className="text-red-400 hover:underline"
                        target="_blank"
                      >
                        {ord.tracking_code}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-slate-200">{ord.customer_name}</td>
                    <td className="py-3 px-3 text-slate-400">
                      {ord.delivery_method === "store_pickup" ? "Showroom Pickup" : "Courier Express"}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      ৳{Number(ord.total_amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-slate-400 text-[11px]">{ord.payment_status}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            <Package className="w-8 h-8 mx-auto text-slate-700 mb-2" />
            <p>No customer orders recorded yet. Placing a test order will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
