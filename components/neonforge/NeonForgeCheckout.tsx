"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { HardwareProduct } from "@/data/hardwareDatabase";

export default function NeonForgeCheckout() {
  const {
    standaloneItems,
    bundledRigs,
    fulfillmentMode,
    setFulfillmentMode,
    paymentMethod,
    setPaymentMethod,
    deliveryDetails,
    updateDeliveryDetails,
    couponCode,
    applyCoupon,
    couponDiscount,
    getGrandTotal,
    clearCart,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedMfsProvider, setSelectedMfsProvider] = useState<"bkash" | "nagad">("bkash");

  // MFS Modal Simulation
  const [mfsModalOpen, setMfsModalOpen] = useState(false);
  const [mfsPhone, setMfsPhone] = useState("");
  const [mfsPin, setMfsPin] = useState("");
  const [mfsStep, setMfsStep] = useState<"phone" | "pin" | "done">("phone");

  const totalItemsCount = standaloneItems.length + bundledRigs.length;
  const grandTotal = getGrandTotal();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponMessage(`✓ ${res.message}`);
    } else {
      setCouponMessage("✕ Invalid or expired voucher token.");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "mfs") {
      setMfsModalOpen(true);
      setMfsStep("phone");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  const handleMfsConfirm = () => {
    setMfsStep("done");
    setTimeout(() => {
      setMfsModalOpen(false);
      setOrderComplete(true);
      clearCart();
    }, 1000);
  };

  if (orderComplete) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center p-4 bg-[#0A0A0F] text-white">
        <div className="max-w-xl w-full bg-[#12121A] border-2 border-cyan-400 p-6 md:p-8 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.25)] text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-cyan-950 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-400">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest block">
              DISPATCH PROTOCOL AUTHORIZED
            </span>
            <h2 className="font-chakra text-2xl font-bold uppercase text-white">
              Liquid Rig Order Confirmed
            </h2>
            <p className="font-mono text-xs text-slate-400">
              Cyber Invoice ID: <strong className="text-cyan-300">#NF-994102-BD</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/10 text-left font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Packaging Type:</span>
              <span className="text-cyan-300 font-bold">Reinforced Flight Crate</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Leak Test Status:</span>
              <span className="text-emerald-400 font-bold">Pneumatic 48h Passed</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">Courier Tracking:</span>
              <span className="text-white">REDX-CRATE-88491</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Total Charged:</span>
              <span className="font-bold text-lg text-white">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-xs uppercase rounded-lg shadow-md transition-colors"
            >
              Return to Battlestation Showroom
            </Link>
            <a
              href="https://wa.me/8801700000000?text=Hello%20Modding%20Lab,%20I%20just%20placed%20liquid%20rig%20order%20NF-994102-BD."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-[#12121A] hover:bg-white/10 border border-emerald-400/40 text-emerald-300 font-mono text-xs uppercase rounded-lg transition-colors"
            >
              WhatsApp Dispatch Concierge
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-[#00F0FF] selection:text-[#0A0A0F] py-6">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Terminal Header */}
        <div className="p-4 rounded-xl bg-[#12121A] border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#00F0FF] animate-pulse" />
            <div>
              <h1 className="font-chakra text-lg font-bold uppercase tracking-wider text-white">
                NeonForge Cyber Tunnel // Secure Checkout Terminal
              </h1>
              <p className="font-mono text-xs text-slate-400">
                Direct Dispatch Node: Dhaka Central Lab &bull; Real-Time Inventory Allocated
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg bg-cyan-950/40">
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>256-BIT ENCRYPTION ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Build Inspection & Consignee Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Itemized Modding Manifest */}
            <div className="bg-[#12121A] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-chakra text-sm font-bold uppercase text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">list_alt</span>
                  <span>Manifest Hardware ({totalItemsCount} Units)</span>
                </span>
                <span className="font-mono text-xs text-slate-400">STATUS: ALLOCATED</span>
              </div>

              {totalItemsCount === 0 ? (
                <div className="text-center py-8 font-mono text-xs text-slate-400 space-y-3">
                  <p>No active components in cyber cart manifest.</p>
                  <Link
                    href="/catalog"
                    className="inline-block px-4 py-2 bg-[#00F0FF] text-[#0A0A0F] font-chakra font-bold text-xs uppercase rounded"
                  >
                    Open Modder&apos;s Armory
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Bundled Rigs */}
                  {bundledRigs.map((rig) => (
                    <div
                      key={rig.id}
                      className="p-4 rounded-xl bg-[#0A0A0F] border border-cyan-500/30 space-y-2"
                    >
                      <div className="flex items-center justify-between font-chakra font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-cyan-400 text-base">
                            computer
                          </span>
                          <span>{rig.name}</span>
                        </div>
                        <span className="font-rajdhani text-xl text-[#00F0FF]">
                          ৳{rig.totalWithServices.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 pl-6 space-y-0.5">
                        {Object.values(rig.components)
                          .filter((c): c is HardwareProduct => Boolean(c))
                          .map((c, i) => (
                            <div key={i} className="truncate">
                              • {c.name}
                            </div>
                          ))}
                        {rig.totalWithServices > rig.rigSubtotal && (
                          <div className="text-cyan-300">
                            • Custom Loop Tube Bending &amp; Leak Testing (+৳
                            {(rig.totalWithServices - rig.rigSubtotal).toLocaleString()})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Standalone Items */}
                  {standaloneItems.map((it) => (
                    <div
                      key={it.product.id}
                      className="p-3 rounded-xl bg-[#0A0A0F] border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-10 h-10 object-contain rounded bg-[#12121A] p-1"
                        />
                        <div>
                          <div className="font-chakra text-xs font-bold text-white">
                            {it.product.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            QTY: {it.quantity} &bull; {it.product.brand}
                          </div>
                        </div>
                      </div>
                      <span className="font-rajdhani text-lg font-bold text-white">
                        ৳{(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Reinforced Crate Courier Logistics */}
            <div className="bg-[#12121A] border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="font-chakra text-sm font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">package_2</span>
                <span>Fulfillment &amp; Protective Crate Logistics</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <button
                  onClick={() => setFulfillmentMode("courier")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    fulfillmentMode === "courier"
                      ? "bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      : "bg-[#0A0A0F] border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="font-bold text-cyan-300">Reinforced Wooden Flight Crate</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Custom foam routing &bull; Shock sensors &bull; 64 Districts (+৳850)
                  </div>
                </button>

                <button
                  onClick={() => setFulfillmentMode("pickup")}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    fulfillmentMode === "pickup"
                      ? "bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      : "bg-[#0A0A0F] border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="font-bold text-cyan-300">Direct Modding Lab Collection</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Live air-leak audition at Dhaka IDB / Multiplan Lab (FREE)
                  </div>
                </button>
              </div>

              {/* Delivery Details Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Full Customer Name
                  </label>
                  <input
                    type="text"
                    value={deliveryDetails.fullName}
                    onChange={(e) => updateDeliveryDetails({ fullName: e.target.value })}
                    placeholder="e.g., Tawsif Rahman"
                    className="w-full h-8 px-3 rounded bg-[#0A0A0F] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Contact Phone (For Courier Dispatch)
                  </label>
                  <input
                    type="text"
                    value={deliveryDetails.phone}
                    onChange={(e) => updateDeliveryDetails({ phone: e.target.value })}
                    placeholder="+880 1700-000000"
                    className="w-full h-8 px-3 rounded bg-[#0A0A0F] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    District / Hub
                  </label>
                  <select
                    value={deliveryDetails.district}
                    onChange={(e) => updateDeliveryDetails({ district: e.target.value })}
                    className="w-full h-8 px-2 rounded bg-[#0A0A0F] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option>Dhaka Metro (North/South)</option>
                    <option>Chittagong (Chattogram)</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                    <option>Other Nationwide District</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Police Station / Thana
                  </label>
                  <input
                    type="text"
                    value={deliveryDetails.thana}
                    onChange={(e) => updateDeliveryDetails({ thana: e.target.value })}
                    placeholder="e.g., Agargaon / Mirpur"
                    className="w-full h-8 px-3 rounded bg-[#0A0A0F] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">
                    Delivery Address &amp; Sector
                  </label>
                  <input
                    type="text"
                    value={deliveryDetails.address}
                    onChange={(e) => updateDeliveryDetails({ address: e.target.value })}
                    placeholder="House, Road, Area, Thana..."
                    className="w-full h-8 px-3 rounded bg-[#0A0A0F] border border-slate-700 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Gateway & Terminal Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#12121A]/90 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-5">
              <span className="font-chakra text-sm font-bold uppercase text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">credit_card</span>
                <span>Payment Gateways</span>
              </span>

              {/* Payment Method Selector */}
              <div className="space-y-2 font-mono text-xs">
                {[
                  { id: "bkash", name: "bKash Instant Cyber Terminal", icon: "account_balance_wallet", type: "mfs" },
                  { id: "nagad", name: "Nagad Secure Checkout", icon: "payments", type: "mfs" },
                  { id: "cod", name: "Cash on Delivery (Nationwide COD)", icon: "local_shipping", type: "cod" },
                  { id: "card", name: "Credit / Debit Card (VISA / MC 3DS)", icon: "credit_card", type: "card" },
                ].map((pm) => {
                  const isSelected =
                    pm.type === "mfs"
                      ? paymentMethod === "mfs" && selectedMfsProvider === pm.id
                      : paymentMethod === pm.type;

                  return (
                    <button
                      key={pm.id}
                      onClick={() => {
                        if (pm.type === "mfs") {
                          setPaymentMethod("mfs");
                          setSelectedMfsProvider(pm.id as "bkash" | "nagad");
                        } else {
                          setPaymentMethod(pm.type as any);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                          : "bg-[#0A0A0F] border-slate-800 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-cyan-400 text-lg">
                          {pm.icon}
                        </span>
                        <span>{pm.name}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-cyan-400 text-base">
                          check_circle
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Cyber Voucher Input */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon: ARCHITECT10"
                    className="flex-1 h-8 px-3 rounded bg-[#0A0A0F] border border-slate-700 text-xs font-mono text-white uppercase focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 h-8 bg-[#1E1E2D] hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase rounded"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="font-mono text-[10.5px] text-cyan-400">{couponMessage}</p>
                )}
              </div>

              {/* Cost Summary Box */}
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/10 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Hardware Total:</span>
                  <span className="text-white">৳{(grandTotal + couponDiscount).toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Voucher Discount:</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Reinforced Packaging:</span>
                  <span className="text-white">{fulfillmentMode === "courier" ? "৳850" : "FREE"}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase">Encrypted Total:</span>
                  <span className="font-rajdhani text-3xl font-extrabold text-[#00F0FF]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                disabled={totalItemsCount === 0 || isProcessing}
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-[#00F0FF] hover:bg-[#00dbe9] disabled:bg-slate-800 disabled:text-slate-500 text-[#0A0A0F] font-chakra font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin"></span>
                    <span>Encrypting Order Manifest...</span>
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <span>Authorize &amp; Place Modder Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* bKash / Nagad Interactive Mock Modal */}
      {mfsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121A] border-2 border-cyan-400 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-400 inline-flex items-center justify-center text-cyan-400 mb-2">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </span>
              <h3 className="font-chakra text-lg font-bold text-white uppercase">
                {selectedMfsProvider === "bkash" ? "bKash Merchant Pay" : "Nagad Gateway"}
              </h3>
              <p className="font-mono text-xs text-slate-400">
                Amount: <strong className="text-white">৳{grandTotal.toLocaleString()}</strong>
              </p>
            </div>

            {mfsStep === "phone" && (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Your Mobile Wallet Number</label>
                  <input
                    type="text"
                    value={mfsPhone}
                    onChange={(e) => setMfsPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full h-9 px-3 rounded bg-[#0A0A0F] border border-cyan-500/40 text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setMfsStep("pin")}
                  className="w-full py-2 bg-[#00F0FF] text-[#0A0A0F] font-chakra font-bold uppercase rounded-lg"
                >
                  Next &rarr;
                </button>
              </div>
            )}

            {mfsStep === "pin" && (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Enter Secret Wallet PIN</label>
                  <input
                    type="password"
                    maxLength={5}
                    value={mfsPin}
                    onChange={(e) => setMfsPin(e.target.value)}
                    placeholder="•••••"
                    className="w-full h-9 px-3 rounded bg-[#0A0A0F] border border-cyan-500/40 text-white text-center tracking-widest text-lg focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleMfsConfirm}
                  className="w-full py-2 bg-emerald-400 text-[#0A0A0F] font-chakra font-bold uppercase rounded-lg shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                >
                  Authorize Payment
                </button>
              </div>
            )}

            {mfsStep === "done" && (
              <div className="py-6 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-400 animate-bounce">
                  check_circle
                </span>
                <p className="font-chakra text-white font-bold text-sm uppercase">
                  Payment Cleared Via MFS Node
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
