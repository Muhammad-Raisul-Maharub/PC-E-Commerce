"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrderByTrackingCode, TrackedOrder } from "@/app/actions/trackOrder";

const STAGES = [
  { key: "pending", label: "Order Placed", icon: "receipt_long", desc: "Recorded in master database" },
  { key: "confirmed", label: "Confirmed", icon: "verified", desc: "Payment / COD verified" },
  { key: "processing", label: "Packaging & QA", icon: "inventory_2", desc: "Stress-tested & packaged" },
  { key: "dispatched", label: "In Transit", icon: "local_shipping", desc: "Courier or ready at showroom" },
  { key: "delivered", label: "Delivered", icon: "task_alt", desc: "Customer received & signed" },
];

function getStageIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "processing":
      return 2;
    case "dispatched":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return phone;
  const start = phone.slice(0, 4);
  const end = phone.slice(-3);
  return `${start}****${end}`;
}

// Demo fallback order for immediate preview when no order has been placed yet
const DEMO_ORDER: TrackedOrder = {
  id: "demo-ctg-001",
  tracking_code: "ORD-CTG-8842K",
  customer_name: "Tanvir Hossain Chowdhury",
  customer_phone: "+8801812345678",
  delivery_method: "store_pickup",
  payment_method: "cod",
  payment_status: "unpaid",
  status: "processing",
  subtotal: 124500,
  shipping_fee: 0,
  total_amount: 124500,
  created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  shipping_address: {
    district: "Chattogram",
    thana: "Panchlaish / GEC",
    address: "Sanmar Ocean City, GEC Circle",
  },
  pickup_branch: {
    name: "Chattogram Flagship Showroom",
    address: "GEC Circle / Agrabad Commercial Area, Chattogram",
    district: "Chattogram",
    phone: "+8801800000000",
  },
  items: [
    {
      id: "item-1",
      unit_price: 43500,
      quantity: 1,
      product_name: "AMD Ryzen 7 7800X3D Gaming Processor",
    },
    {
      id: "item-2",
      unit_price: 68000,
      quantity: 1,
      product_name: "NVIDIA GeForce RTX 4070 Super 12GB OC",
    },
    {
      id: "item-3",
      unit_price: 13000,
      quantity: 1,
      product_name: "DeepCool LS720 360mm High-Performance Liquid Cooler",
    },
  ],
};

function TrackingPortalContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [inputCode, setInputCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = useCallback(async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    // If demo code
    if (codeToSearch.trim().toUpperCase() === "DEMO" || codeToSearch.trim().toUpperCase() === "ORD-CTG-DEMO") {
      setOrder(DEMO_ORDER);
      setLoading(false);
      return;
    }

    const res = await getOrderByTrackingCode(codeToSearch);
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      // If order not found in DB, also check if it matches demo format or provide clear guidance
      setErrorMsg(res.error || "Unable to locate consignment record. Try 'DEMO' for an interactive preview.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode, handleSearch]);

  const currentStageIdx = order ? getStageIndex(order.status) : 0;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="w-full py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-[#EF4444] text-xs font-mono font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">radar</span>
            <span>Real-Time Logistics Telemetry</span>
          </div>
          <h1 className="font-headline font-black text-3xl sm:text-4xl tracking-tight text-white">
            Track Order &amp; Consignment
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Enter your tracking code or invoice ID (e.g. <strong className="text-white font-mono">ORD-CTG-XXXX</strong>) to monitor warehouse inspection, courier dispatch, or Chattogram showroom pickup status.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(inputCode);
            }}
            className="pt-3 flex flex-col sm:flex-row gap-2 max-w-xl"
          >
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter tracking code (e.g. ORD-CTG-8842K or DEMO)"
                className="w-full h-12 pl-10 pr-4 bg-slate-800/90 border border-slate-600 rounded-xl text-white placeholder:text-slate-400 text-sm font-mono focus:outline-none focus:border-red-500 transition-colors shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 bg-[#b61722] hover:bg-[#99131c] text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Track Live</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Trigger for evaluation */}
          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 font-mono">
            <span>Quick test:</span>
            <button
              type="button"
              onClick={() => {
                setInputCode("ORD-CTG-8842K");
                setOrder(DEMO_ORDER);
                setErrorMsg(null);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Preview Demo Consignment (Chattogram Hub)
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <span className="material-symbols-outlined text-xl shrink-0 mt-0.5">warning</span>
          <div className="space-y-1">
            <div className="font-bold">Consignment Not Found</div>
            <p className="text-xs text-red-600">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* TRACKED ORDER DETAILS */}
      {order && (
        <div className="space-y-6">
          {/* Status Progress Bar Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                  Tracking Code
                </span>
                <span className="font-mono font-bold text-xl sm:text-2xl text-slate-900">
                  {order.tracking_code}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block">
                    Created At
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {new Date(order.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    isCancelled
                      ? "bg-red-100 text-red-700"
                      : order.status === "delivered"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isCancelled ? "Cancelled" : STAGES[currentStageIdx]?.label}
                </div>
              </div>
            </div>

            {/* 5-Step Visual Timeline */}
            {!isCancelled ? (
              <div className="relative py-4">
                {/* Horizontal Progress Line */}
                <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 transition-all duration-700"
                    style={{
                      width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div
                        key={stage.key}
                        className={`flex md:flex-col items-center md:text-center gap-3 p-3 md:p-2 rounded-xl transition-all ${
                          isCurrent
                            ? "bg-red-50/80 border border-red-200 shadow-sm"
                            : isCompleted
                            ? "bg-slate-50 md:bg-transparent"
                            : "opacity-40"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                            isCompleted
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {stage.icon}
                          </span>
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold leading-tight ${
                              isCurrent ? "text-[#b61722]" : "text-slate-900"
                            }`}
                          >
                            {stage.label}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                            {stage.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-50 text-red-800 text-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600">cancel</span>
                <span>This order was cancelled. Please contact support if you believe this was an error.</span>
              </div>
            )}
          </div>

          {/* Delivery & Billing Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Consignee & Shipping */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-red-600 text-lg">location_on</span>
                <span>Fulfillment Destination</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 font-mono">
                <div>
                  <span className="text-slate-400">Recipient:</span>{" "}
                  <strong className="text-slate-900">{order.customer_name}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>{" "}
                  <span>{maskPhone(order.customer_phone)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Method:</span>{" "}
                  <span className="font-bold text-slate-800">
                    {order.delivery_method === "store_pickup"
                      ? "Direct Showroom Collection"
                      : "Express Courier (Doorstep)"}
                  </span>
                </div>
                {order.delivery_method === "store_pickup" ? (
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl mt-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">
                      Pickup Hub Location:
                    </span>
                    <strong className="text-slate-900 block text-xs">
                      {order.pickup_branch?.name || "Chattogram Flagship Showroom"}
                    </strong>
                    <span className="text-[11px] text-slate-600 block">
                      {order.pickup_branch?.address || "GEC Circle / Agrabad, Chattogram"}
                    </span>
                    {order.pickup_branch?.phone && (
                      <span className="text-[10px] text-slate-500 block">
                        Hotline: {order.pickup_branch.phone}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 mt-2 text-[11px]">
                    <div>{order.shipping_address?.address || "Address on File"}</div>
                    <div className="text-slate-500">
                      {order.shipping_address?.thana}, {order.shipping_address?.district}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Security */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-emerald-600 text-lg">payments</span>
                <span>Payment &amp; Billing</span>
              </div>
              <div className="text-xs space-y-1.5 font-mono text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="font-bold uppercase text-slate-900">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Settlement Status:</span>
                  <span
                    className={`font-bold capitalize ${
                      order.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hardware Subtotal:</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Fee:</span>
                  <span>৳{order.shipping_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-[#b61722]">৳{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Consignment Items */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-blue-600 text-lg">inventory</span>
                <span>Packaged Components ({order.items.length})</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-slate-800 truncate">
                        {item.product_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Qty: {item.quantity} × ৳{item.unit_price.toLocaleString()}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                      ৳{(item.unit_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Help & Support */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500">support_agent</span>
          <span>Need rapid assistance with your consignment? Contact Chattogram Logistics Desk:</span>
        </div>
        <div className="flex items-center gap-3 font-bold text-slate-900">
          <a href="tel:+8801800000000" className="hover:text-red-600 transition-colors">
            Hotline: +880 1800-000000
          </a>
          <span>•</span>
          <Link href="/" className="text-red-600 hover:underline">
            Back to Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        <Suspense
          fallback={
            <div className="py-20 text-center text-slate-500 font-mono text-sm">
              Connecting to live logistics telemetry...
            </div>
          }
        >
          <TrackingPortalContent />
        </Suspense>
      </div>
    </div>
  );
}
