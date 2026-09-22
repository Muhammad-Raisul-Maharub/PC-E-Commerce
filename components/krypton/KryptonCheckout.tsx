"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export default function KryptonCheckout() {
  const router = useRouter();
  const { standaloneItems, removeStandaloneItem, updateStandaloneQuantity, clearCart, getGrandTotal } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad" | "card" | "emi">("cod");
  const [deliveryType, setDeliveryType] = useState<"courier" | "depot">("courier");
  const [selectedDepot, setSelectedDepot] = useState("idb");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = getGrandTotal();
  const deliveryCharge = deliveryType === "depot" ? 0 : district === "Dhaka" ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert("Please provide a valid contact phone number for dispatch verification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = `KRP-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(orderId);
      setIsSubmitting(false);
      clearCart();
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#EBEAE5] text-[#1E1E24] font-sans antialiased pb-24 selection:bg-[#FACC15] selection:text-black">
      {/* Order Confirmation Modal */}
      {confirmedOrderId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_#000000] animate-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
              <span className="font-extrabold uppercase text-black text-sm">
                // REQUISITION DISPATCH CONFIRMED
              </span>
              <span className="bg-[#25D366] text-black px-2 py-0.5 font-bold">
                STATUS: DISPATCH QUEUED
              </span>
            </div>

            <div className="bg-[#EBEAE5] border-2 border-black p-4 mb-4 space-y-2">
              <div className="text-slate-500 text-[10px]">TRACKING MANIFEST ID:</div>
              <div className="text-xl font-extrabold text-black">{confirmedOrderId}</div>
              <div className="text-slate-600 text-xs">
                Dispatched to {district} via {deliveryType === "depot" ? "Depot Counter Pickup" : "Nationwide Express Courier"}.
              </div>
            </div>

            <div className="space-y-1.5 text-slate-700 mb-6">
              <div>• Our depot operations team will telephone {phone || "your number"} for pre-dispatch confirmation.</div>
              <div>• Package is sealed in static-shielded bubble wrap with tamper-evident inspection tape.</div>
              <div>• Inspection permitted at depot counter or upon courier doorstep delivery.</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setConfirmedOrderId(null);
                  router.push("/");
                }}
                className="flex-1 bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black py-3 px-4 font-extrabold uppercase shadow-[2px_2px_0px_#000000]"
              >
                RETURN TO DEPOT
              </button>
              <a
                href={`https://wa.me/8801711000000?text=Hello%20Krypton%20Logistics%2C%20I%20am%20tracking%20requisition%20manifest%20${confirmedOrderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#22c35e] text-black border-2 border-black py-3 px-4 font-extrabold uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000000]"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>TRACK ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-white border-b-2 border-black py-8 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase mb-2">
            <Link href="/" className="hover:text-black underline">
              Krypton Depot
            </Link>
            <span>/</span>
            <span className="text-black font-bold">Staging Manifest &amp; Checkout Tunnel</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black leading-none"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                PARTS STAGING &amp; CHECKOUT MANIFEST
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-600 mt-2">
                VERIFIED PARTS REQUISITION // COD NATIONWIDE // DIRECT BKASH // BANK EMI GATEWAY
              </p>
            </div>
            <div className="font-mono text-xs text-black border-2 border-black bg-[#EBEAE5] px-3 py-1.5 font-bold">
              GATEWAY PROTOCOL: ENCRYPTED HTTPS
            </div>
          </div>
        </div>
      </section>

      {/* Main Checkout Layout */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8">
        {standaloneItems.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_#000000]">
            <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">production_quantity_limits</span>
            <h3 className="font-heading text-2xl font-bold uppercase text-black" style={{ fontFamily: "Syne, sans-serif" }}>
              YOUR REQUISITION MANIFEST IS CURRENTLY EMPTY
            </h3>
            <p className="font-mono text-xs text-slate-500 mt-2 mb-6">
              Browse component bins or launch the dual hardware workbench to stage parts.
            </p>
            <div className="flex justify-center gap-3 font-mono text-xs">
              <Link
                href="/catalog"
                className="bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black px-6 py-2.5 font-bold uppercase shadow-[2px_2px_0px_#000000]"
              >
                OPEN COMPONENT BINS
              </Link>
              <Link
                href="/pc-builder"
                className="bg-black hover:bg-[#1E1E24] text-white border-2 border-black px-6 py-2.5 font-bold uppercase shadow-[2px_2px_0px_#000000]"
              >
                DUAL WORKBENCH
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Requisition Manifest Table (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Manifest Itemized Table */}
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000]">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black font-mono text-xs mb-4">
                  <span className="font-bold text-black">// ITEM DISPATCH MANIFEST ({standaloneItems.length} HARDWARE UNITS)</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-slate-500 hover:text-[#EA580C] underline font-bold uppercase text-[10px]"
                  >
                    PURGE ALL
                  </button>
                </div>

                <div className="divide-y divide-black font-mono text-xs">
                  {standaloneItems.map((cartItem) => (
                    <div key={cartItem.product.id} className="py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cartItem.product.image}
                          alt={cartItem.product.name}
                          className="w-14 h-14 object-cover border border-black bg-[#EBEAE5] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-black text-sm truncate">{cartItem.product.name}</div>
                          <div className="text-[10px] text-slate-500">
                            SKU: {cartItem.product.sku || cartItem.product.id} • UNIT: ৳ {cartItem.product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Control & Line Total */}
                      <div className="flex items-center gap-4 shrink-0 ml-auto">
                        <div className="flex items-center border border-black bg-[#EBEAE5]">
                          <button
                            type="button"
                            onClick={() => updateStandaloneQuantity(cartItem.product.id, Math.max(1, cartItem.quantity - 1))}
                            className="px-2 py-1 font-bold hover:bg-white text-black"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-black">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateStandaloneQuantity(cartItem.product.id, cartItem.quantity + 1)}
                            className="px-2 py-1 font-bold hover:bg-white text-black"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-bold text-sm text-black min-w-[90px] text-right">
                          ৳ {(cartItem.product.price * cartItem.quantity).toLocaleString()}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeStandaloneItem(cartItem.product.id)}
                          className="text-slate-400 hover:text-[#EA580C] font-bold p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Bay */}
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] font-mono text-xs space-y-4">
                <div className="font-bold text-black text-sm pb-2 border-b-2 border-black">
                  // LOGISTICS ROUTING &amp; DISPATCH DESTINATION
                </div>

                {/* Delivery Mode Toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("courier")}
                    className={`p-2.5 border-2 text-left font-bold uppercase transition-all ${
                      deliveryType === "courier"
                        ? "bg-[#FACC15] text-black border-black shadow-[2px_2px_0px_#000000]"
                        : "bg-[#EBEAE5] text-slate-700 border-black/30 hover:border-black"
                    }`}
                  >
                    01 // NATIONWIDE EXPRESS COURIER
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("depot")}
                    className={`p-2.5 border-2 text-left font-bold uppercase transition-all ${
                      deliveryType === "depot"
                        ? "bg-[#FACC15] text-black border-black shadow-[2px_2px_0px_#000000]"
                        : "bg-[#EBEAE5] text-slate-700 border-black/30 hover:border-black"
                    }`}
                  >
                    02 // DIRECT DEPOT COUNTER PICKUP
                  </button>
                </div>

                {deliveryType === "depot" ? (
                  <div>
                    <label className="block font-bold uppercase mb-1">SELECT DEPOT LOCATION:</label>
                    <select
                      value={selectedDepot}
                      onChange={(e) => setSelectedDepot(e.target.value)}
                      className="w-full bg-[#EBEAE5] border-2 border-black p-2.5 font-mono text-xs focus:bg-white focus:outline-none"
                    >
                      <option value="idb">IDB Bhaban Flagship, Agargaon, Dhaka (Level 3)</option>
                      <option value="multiplan">Multiplan Center, Elephant Road, Dhaka (Level 9)</option>
                      <option value="motijheel">Motijheel Corporate Center, Dhaka (Level 5)</option>
                      <option value="chattogram">Sanmar Ocean City, GEC, Chattogram (Level 4)</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase mb-1">DISTRICT:</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#EBEAE5] border-2 border-black p-2.5 font-mono text-xs focus:bg-white focus:outline-none"
                      >
                        {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur", "Narayanganj"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold uppercase mb-1">DELIVERY ADDRESS:</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street / Thana..."
                        className="w-full bg-[#EBEAE5] border-2 border-black p-2.5 font-mono text-xs focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Recipient Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase mb-1">RECIPIENT NAME:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-[#EBEAE5] border-2 border-black p-2.5 font-mono text-xs focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1">PHONE NUMBER (REQUIRED):</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#EBEAE5] border-2 border-black p-2.5 font-mono text-xs focus:bg-white focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Payment Gateway & Summary Tunnel (5 cols) */}
            <aside className="lg:col-span-5 space-y-6">
              
              {/* Payment Methods Bay */}
              <div className="bg-[#1E1E24] text-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] font-mono text-xs space-y-4">
                <div className="font-bold text-[#FACC15] text-sm pb-2 border-b-2 border-white/20 uppercase flex items-center justify-between">
                  <span>// PAYMENT CHANNEL SELECTION</span>
                  <span className="text-[10px] text-slate-400">INSTANT DISPATCH</span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: "cod", label: "CASH ON DELIVERY (COD)", desc: "Pay upon physical parts inspection at counter or doorstep" },
                    { id: "bkash", label: "BKASH DIRECT GATEWAY", desc: "Automated merchant checkout with instant SMS token" },
                    { id: "nagad", label: "NAGAD INSTANT PAY", desc: "Fast payment with 1.2% instant cashback" },
                    { id: "card", label: "VISA / MASTERCARD / AMEX", desc: "3D Secure OTP authentication via local bank gateway" },
                    { id: "emi", label: "BANK EMI (UP TO 36 MONTHS)", desc: "0% interest financing with 18 partner banks in BD" },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`block p-3 border-2 cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? "bg-black text-[#FACC15] border-[#FACC15] shadow-[3px_3px_0px_#FACC15]"
                          : "bg-[#121216] text-slate-300 border-white/20 hover:border-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === pm.id}
                          onChange={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                          className="accent-[#FACC15]"
                        />
                        <span className="font-bold">{pm.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-5">{pm.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Totals & Execution Bay */}
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                  <span className="font-bold text-black">// REQUISITION TOTALS</span>
                  <span className="text-slate-500">BD TAKA (৳)</span>
                </div>

                <div className="space-y-2 mb-6 text-slate-600">
                  <div className="flex justify-between">
                    <span>HARDWARE SUB-TOTAL:</span>
                    <span className="font-bold text-black">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LOGISTICS ROUTING:</span>
                    <span className="font-bold text-black">
                      {deliveryCharge === 0 ? "FREE (COUNTER PICKUP)" : `৳ ${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t-2 border-black flex justify-between items-baseline">
                    <span className="font-bold text-sm text-black">GRAND TOTAL:</span>
                    <span className="font-heading text-2xl font-extrabold text-black" style={{ fontFamily: "Syne, sans-serif" }}>
                      ৳ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FACC15] hover:bg-[#FDE047] disabled:bg-slate-300 text-black border-2 border-black py-3 px-4 font-mono text-sm font-extrabold uppercase shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING REQUISITION...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span>CONFIRM &amp; DISPATCH REQUISITION</span>
                    </>
                  )}
                </button>

                <div className="mt-4 pt-3 border-t border-black text-[10px] text-slate-500 space-y-1">
                  <div>✓ Nationwide COD dispatch across all 64 districts</div>
                  <div>✓ 100% genuine components with official distributor warranty</div>
                </div>
              </div>

            </aside>

          </form>
        )}
      </section>
    </main>
  );
}
