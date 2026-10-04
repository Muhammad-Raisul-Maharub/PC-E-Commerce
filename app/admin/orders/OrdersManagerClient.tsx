"use client";

import React, { useState, useTransition } from "react";
import {
  AdminOrder,
  updateOrderStatus,
} from "@/app/actions/adminOrders";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Barcode,
  QrCode,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface OrdersManagerClientProps {
  initialOrders: AdminOrder[];
}

export default function OrdersManagerClient({ initialOrders }: OrdersManagerClientProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const statuses = [
    { key: "all", label: "All Orders", icon: Package },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { key: "processing", label: "Processing", icon: Package },
    { key: "dispatched", label: "Dispatched", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: AdminOrder["status"]) => {
    setUpdatingId(orderId);
    startTransition(async () => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      const res = await updateOrderStatus(orderId, newStatus);
      setUpdatingId(null);
      if (!res.success) {
        alert("Failed to update status: " + res.error);
      }
    });
  };

  const getStatusBadge = (status: AdminOrder["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "confirmed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "dispatched":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-primary" />
            Orders & Consignment Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track customer orders, manage fulfillment stages, and generate instant Chattogram hub dispatch slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/track-order"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/60 hover:bg-accent/40 text-foreground transition-colors"
          >
            <span>Public Tracking Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {statuses.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.key === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? "bg-black/30 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ORD-CTG..., name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/30 border border-border/50 rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/30 text-muted-foreground uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Order / Tracking</th>
                <th className="py-3 px-4">Consignee & Phone</th>
                <th className="py-3 px-4">Fulfillment / Route</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Fulfillment Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-foreground">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Package className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium">No orders found matching the filter.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-accent/20 transition-colors group"
                    >
                      {/* Tracking & Date */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono font-bold text-primary flex items-center gap-1.5">
                          <span>{order.tracking_code}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-1">
                          {order.items_count} item{order.items_count > 1 ? "s" : ""}
                        </div>
                      </td>

                      {/* Consignee */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-medium text-foreground">{order.customer_name}</div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <Phone className="w-3 h-3 text-muted-foreground/70" />
                          <span>{order.customer_phone}</span>
                        </div>
                        {order.customer_email && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-0.5">
                            <Mail className="w-3 h-3 text-muted-foreground/50" />
                            <span>{order.customer_email}</span>
                          </div>
                        )}
                      </td>

                      {/* Delivery Route */}
                      <td className="py-3.5 px-4 align-top max-w-[220px]">
                        {order.delivery_method === "store_pickup" ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <Building2 className="w-2.5 h-2.5" /> Showroom Pickup
                            </span>
                            <p className="text-[11px] text-muted-foreground font-medium truncate">
                              {order.pickup_branch?.name || "Chattogram Flagship Hub"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 truncate">
                              Agrabad / GEC, Chattogram
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Truck className="w-2.5 h-2.5" /> Courier Express
                            </span>
                            <p className="text-[11px] text-muted-foreground font-medium truncate">
                              {order.shipping_address.district || "Chattogram"},{" "}
                              {order.shipping_address.thana || "City"}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 truncate">
                              {order.shipping_address.address || "Standard Address"}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Total Amount & Payment */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-semibold text-foreground text-sm">
                          ৳{order.total_amount.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded border border-border/40">
                            {order.payment_method}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              order.payment_status === "paid"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>

                      {/* Status Changer Dropdown */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as AdminOrder["status"]
                              )
                            }
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            <option value="pending" className="bg-background text-foreground">
                              Pending
                            </option>
                            <option value="confirmed" className="bg-background text-foreground">
                              Confirmed
                            </option>
                            <option value="processing" className="bg-background text-foreground">
                              Processing
                            </option>
                            <option value="dispatched" className="bg-background text-foreground">
                              Dispatched
                            </option>
                            <option value="delivered" className="bg-background text-foreground">
                              Delivered
                            </option>
                            <option value="cancelled" className="bg-background text-foreground">
                              Cancelled
                            </option>
                          </select>
                          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current text-[10px]">
                            ▼
                          </div>
                        </div>
                        {isUpdating && (
                          <span className="text-[10px] text-primary block mt-1 animate-pulse">
                            Updating...
                          </span>
                        )}
                      </td>

                      {/* Dispatch & Packing Slip */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <button
                          onClick={() => setSelectedOrderForSlip(order)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Dispatch Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Dispatch Packing Slip Modal */}
      {selectedOrderForSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            {/* Modal Controls Bar */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm text-zinc-100">
                  Fulfillment Packing Slip & Dispatch Memo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForSlip(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-packing-slip" className="p-8 bg-zinc-950 text-zinc-100 space-y-6">
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-6">
                <div>
                  <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span>CHATTOGRAM TECH STORE</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Omnichannel PC Builder & Hardware Depot // Chattogram Flagship Hub
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    GEC Circle / Agrabad Commercial Area, Chattogram 4000, Bangladesh
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Helpline: +880 1800-000000 | Support: support@ctg-tech.com
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 bg-white rounded-lg mb-1">
                    {/* Visual QR Code Mock */}
                    <div className="w-16 h-16 bg-black flex flex-col justify-between p-1">
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-white" />
                        <div className="w-4 h-4 bg-white" />
                      </div>
                      <div className="w-2 h-2 bg-white self-center" />
                      <div className="flex justify-between">
                        <div className="w-4 h-4 bg-white" />
                        <div className="w-4 h-4 bg-white" />
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-xs font-bold text-primary">
                    {selectedOrderForSlip.tracking_code}
                  </div>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 h-10 w-full max-w-sm justify-center">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4].map(
                    (w, i) => (
                      <span
                        key={i}
                        className="bg-zinc-200 h-full inline-block"
                        style={{ width: `${w * 1.5}px` }}
                      />
                    )
                  )}
                </div>
                <span className="font-mono text-[11px] text-zinc-400 tracking-widest mt-1">
                  *{selectedOrderForSlip.tracking_code}*
                </span>
              </div>

              {/* Consignee & Order Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-primary">
                    Shipment Consignee
                  </div>
                  <div className="font-bold text-sm text-zinc-100">
                    {selectedOrderForSlip.customer_name}
                  </div>
                  <div className="text-zinc-400 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-zinc-500" />
                    <span>{selectedOrderForSlip.customer_phone}</span>
                  </div>
                  {selectedOrderForSlip.customer_email && (
                    <div className="text-zinc-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-zinc-500" />
                      <span>{selectedOrderForSlip.customer_email}</span>
                    </div>
                  )}
                  <div className="text-zinc-400 pt-1 border-t border-zinc-800/50">
                    <div className="font-semibold text-zinc-300">Delivery Address:</div>
                    <p className="mt-0.5">
                      {selectedOrderForSlip.shipping_address.address || "Showroom Collection"}
                    </p>
                    <p>
                      {selectedOrderForSlip.shipping_address.thana},{" "}
                      {selectedOrderForSlip.shipping_address.district || "Chattogram"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-1.5">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-primary">
                    Order Logistics
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Order Date:</span>
                    <span className="font-medium text-zinc-200">
                      {new Date(selectedOrderForSlip.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Delivery Type:</span>
                    <span className="font-medium text-zinc-200 uppercase">
                      {selectedOrderForSlip.delivery_method}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/50">
                    <span className="text-zinc-400">Payment Channel:</span>
                    <span className="font-medium text-zinc-200 uppercase">
                      {selectedOrderForSlip.payment_method} ({selectedOrderForSlip.payment_status})
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-zinc-400">Fulfillment Hub:</span>
                    <span className="font-medium text-zinc-200">
                      {selectedOrderForSlip.pickup_branch?.name || "Chattogram Central Flagship"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">
                        Custom Rig Hardware Component Package ({selectedOrderForSlip.items_count} items)
                      </td>
                      <td className="py-2.5 px-3 text-center">{selectedOrderForSlip.items_count}</td>
                      <td className="py-2.5 px-3 text-right">
                        ৳{selectedOrderForSlip.subtotal.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-white">
                        ৳{selectedOrderForSlip.subtotal.toLocaleString()}
                      </td>
                    </tr>
                    {selectedOrderForSlip.shipping_fee > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 px-3 text-right text-zinc-400">
                          Express Courier Delivery:
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-zinc-200">
                          ৳{selectedOrderForSlip.shipping_fee}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-zinc-900/40 text-sm font-bold">
                      <td colSpan={3} className="py-3 px-3 text-right text-zinc-300">
                        Net Payable:
                      </td>
                      <td className="py-3 px-3 text-right text-primary font-mono">
                        ৳{selectedOrderForSlip.total_amount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verification Stamp & Signature */}
              <div className="pt-4 flex items-end justify-between border-t border-zinc-800 text-[11px] text-zinc-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>QC & Showroom Dispatch Verified</span>
                  </div>
                  <p>Inspected by: QA Desk 01 // Flagship Store</p>
                </div>

                <div className="text-center">
                  <div className="w-40 border-b border-zinc-600 mb-1" />
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
