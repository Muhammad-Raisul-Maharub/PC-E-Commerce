"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore, BranchKey, FulfillmentMode, PaymentMethod } from "@/store/useCartStore";
import { RETAIL_BRANCHES } from "./OmniPulse3DMap";

export default function OmniPulseCheckout() {
  const {
    standaloneItems,
    bundledRigs,
    deliveryDetails,
    updateDeliveryDetails,
    fulfillmentMode,
    setFulfillmentMode,
    paymentMethod,
    setPaymentMethod,
    selectedEmiMonths,
    setSelectedEmiMonths,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getGrandTotal,
    getShippingFee,
    getItemsSubtotal,
    removeStandaloneItem,
    removeBundledRig,
    orderCompleted,
    orderId,
    submitOrder,
    clearCart,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");
  const [b2bEnabled, setB2bEnabled] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vatBin, setVatBin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localOrderCompleted, setLocalOrderCompleted] = useState(false);
  const [localOrderId, setLocalOrderId] = useState("");

  // bKash / Nagad Simulation Modal State
  const [mfsModalOpen, setMfsModalOpen] = useState(false);
  const [mfsPhone, setMfsPhone] = useState("");
  const [mfsPin, setMfsPin] = useState("");
  const [mfsProvider, setMfsProvider] = useState<"bkash" | "nagad">("bkash");

  const grandTotal = getGrandTotal();
  const deliveryFee = fulfillmentMode === "pickup" ? 0 : getShippingFee();
  const itemsSubtotal = getItemsSubtotal();

  const activeBranchData =
    RETAIL_BRANCHES.find((b) => b.key === deliveryDetails.pickupBranch) || RETAIL_BRANCHES[0];

  const totalItemCount =
    standaloneItems.reduce((sum, item) => sum + item.quantity, 0) + bundledRigs.length;

  const handlePlaceOrder = () => {
    if (paymentMethod === "mfs") {
      setMfsModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      setIsSubmitting(false);
      const res = await submitOrder();
      setLocalOrderId(res.orderId);
      setLocalOrderCompleted(true);
    }, 1200);
  };

  const handleCompleteMfsPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setMfsModalOpen(false);
    setIsSubmitting(true);
    setTimeout(async () => {
      setIsSubmitting(false);
      const res = await submitOrder();
      setLocalOrderId(res.orderId);
      setLocalOrderCompleted(true);
    }, 1000);
  };

  // Order Confirmed Celebratory Screen
  const isOrderDone = orderCompleted || localOrderCompleted;
  if (isOrderDone) {
    const displayOrderId = orderId || localOrderId || "OP-BD-894210";

    return (
      <div className="w-full bg-[#F4F6F9] min-h-screen py-16 text-slate-900 font-sans">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div>
              <span className="text-xs uppercase font-mono font-bold text-[#0D47A1] tracking-wider">
                OmniPulse Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-1">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Order Tracking ID: <strong className="font-mono text-slate-900">{displayOrderId}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment Type:</span>
                <strong className="text-slate-900 capitalize">
                  {fulfillmentMode === "pickup" ? "Showroom Collection (2 Hours)" : "Nationwide Courier"}
                </strong>
              </div>
              {fulfillmentMode === "pickup" && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Counter:</span>
                  <strong className="text-[#0D47A1]">{activeBranchData.name}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <strong className="text-slate-900 uppercase">{paymentMethod}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total BDT Paid / Due:</span>
                <strong className="text-base text-[#0D47A1] font-mono">
                  ৳{grandTotal.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `Hello OmniPulse BD Team, I just placed order ${displayOrderId} for ৳${grandTotal.toLocaleString()}. Please confirm branch pickup status!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>💬</span>
                <span>Send Order Receipt to WhatsApp Desk</span>
              </a>

              <Link
                href="/catalog"
                onClick={() => {
                  setLocalOrderCompleted(false);
                  clearCart();
                }}
                className="w-full py-3 bg-[#0D47A1] hover:bg-[#0a387e] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (totalItemCount === 0) {
    return (
      <div className="w-full bg-[#F4F6F9] min-h-screen py-16 text-slate-900 font-sans">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl">shopping_cart</span>
          </div>
          <h2 className="text-2xl font-bold font-sans">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse our catalog or use the custom PC builder to add hardware products.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/catalog"
              className="px-5 py-2.5 bg-[#0D47A1] text-white rounded-xl text-xs font-bold"
            >
              Explore Catalog
            </Link>
            <Link
              href="/pc-builder"
              className="px-5 py-2.5 bg-[#FFB300] text-[#0D47A1] rounded-xl text-xs font-bold"
            >
              PC Builder Wizard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen py-8">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#0D47A1] font-bold">
                256-bit SSL Secure Checkout Tunnel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              OmniPulse BD Regional Multi-Payment Checkout
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select in-store showroom collection or nationwide doorstep courier delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="material-symbols-outlined text-[#0D47A1]">shield</span>
            <span>Bank-Grade Encryption</span>
          </div>
        </div>

        {/* Main Two-Column Tunnel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Fulfillment & Payment Tunnels (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Fulfillment Mode Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0D47A1] text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Select Fulfillment Mode</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentMode("pickup")}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentMode === "pickup"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-[#0D47A1] text-2xl">
                    storefront
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">In-Store Collection</div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ready in 2 hours at your chosen branch showroom.
                    </p>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mt-2 inline-block">
                      FREE OF CHARGE
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMode("courier")}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentMode === "courier"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-[#0D47A1] text-2xl">
                    local_shipping
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Nationwide Courier</div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dhaka (24h), Chittagong &amp; 64 Districts (48h).
                    </p>
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-2 inline-block">
                      ৳150 Delivery Fee
                    </span>
                  </div>
                </button>
              </div>

              {/* Conditional Sub-panel based on fulfillment mode */}
              {fulfillmentMode === "pickup" ? (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase">
                    Select Collection Branch:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {RETAIL_BRANCHES.map((b) => (
                      <button
                        key={b.key}
                        type="button"
                        onClick={() => updateDeliveryDetails({ pickupBranch: b.key })}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          deliveryDetails.pickupBranch === b.key
                            ? "bg-[#0D47A1] text-white font-bold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <div>{b.name}</div>
                          <div className="text-[10px] opacity-75">{b.readyTime}</div>
                        </div>
                        {deliveryDetails.pickupBranch === b.key && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      value={deliveryDetails.fullName}
                      onChange={(e) => updateDeliveryDetails({ fullName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Mobile Phone (11 Digits)</label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={deliveryDetails.phone}
                      onChange={(e) => updateDeliveryDetails({ phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">District (64 Districts)</label>
                    <select
                      value={deliveryDetails.district}
                      onChange={(e) => updateDeliveryDetails({ district: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D47A1]"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Comilla">Comilla</option>
                      <option value="Gazipur">Gazipur</option>
                      <option value="Narayanganj">Narayanganj</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Thana / Upazila</label>
                    <input
                      type="text"
                      placeholder="e.g. Mirpur, Gulshan, Dhanmondi"
                      value={deliveryDetails.thana}
                      onChange={(e) => updateDeliveryDetails({ thana: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Detailed Street Address</label>
                    <input
                      type="text"
                      placeholder="House, Road, Area, Landmark"
                      value={deliveryDetails.address}
                      onChange={(e) => updateDeliveryDetails({ address: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0D47A1] text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Select Payment Gateway</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === "cod"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">
                    payments
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Cash on Delivery (COD)</div>
                    <p className="text-xs text-slate-500">
                      Pay cash upon delivery at your door or showroom.
                    </p>
                  </div>
                </button>

                {/* bKash / Nagad Direct */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mfs")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === "mfs"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ৳
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">bKash / Nagad Online</div>
                    <p className="text-xs text-slate-500">
                      Instant mobile wallet payment simulation.
                    </p>
                  </div>
                </button>

                {/* Bank Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === "card"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-[#0D47A1] text-2xl">
                    credit_card
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Debit / Credit Card</div>
                    <p className="text-xs text-slate-500">
                      Visa, Mastercard, Amex via SSLCommerz.
                    </p>
                  </div>
                </button>

                {/* 0% Bank EMI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("emi")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    paymentMethod === "emi"
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-[#FFA000] text-2xl">
                    calendar_month
                  </span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">0% Bank EMI Plan</div>
                    <p className="text-xs text-slate-500">
                      3 to 36 months interest-free instalments.
                    </p>
                  </div>
                </button>
              </div>

              {/* EMI Tenure Dropdown */}
              {paymentMethod === "emi" && (
                <div className="pt-3 border-t border-slate-100 p-3 bg-amber-50/60 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-800">Select EMI Months Tenure:</div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[3, 6, 9, 12, 24, 36].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedEmiMonths(m)}
                        className={`p-2 rounded-lg border text-center font-mono font-bold text-xs ${
                          selectedEmiMonths === m
                            ? "bg-[#0D47A1] text-white border-[#0D47A1]"
                            : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                  <div className="text-slate-600 pt-1">
                    Monthly instalment: <strong>৳{Math.round(grandTotal / selectedEmiMonths).toLocaleString()}/month</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Mushak-6.3 B2B VAT Invoice Request */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                <input
                  type="checkbox"
                  checked={b2bEnabled}
                  onChange={(e) => setB2bEnabled(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-bold text-slate-800">
                  Request Official Mushak-6.3 VAT Tax Invoice (For Corporate &amp; Registered Businesses)
                </span>
              </label>

              {b2bEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <label className="block text-slate-600 mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Technologies Ltd."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">13-Digit VAT BIN Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 001234567-0101"
                      value={vatBin}
                      onChange={(e) => setVatBin(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Placement (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  Order Summary ({totalItemCount} Items)
                </h3>
                <span className="text-xs font-mono text-[#0D47A1] font-bold">
                  {fulfillmentMode === "pickup" ? "Showroom Reserve" : "Courier Order"}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                {/* Standalone Items */}
                {standaloneItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-slate-500 font-mono">
                        Qty: {item.quantity} × ৳{item.product.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeStandaloneItem(item.product.id)}
                        className="text-slate-400 hover:text-red-600"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Bundled Custom Rigs */}
                {bundledRigs.map((rig) => (
                  <div
                    key={rig.id}
                    className="p-3 rounded-xl bg-[#E3F2FD]/50 border border-blue-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0D47A1]">{rig.name}</span>
                      <button
                        onClick={() => removeBundledRig(rig.id)}
                        className="text-slate-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex justify-between font-mono text-slate-700">
                      <span>Rig Subtotal:</span>
                      <strong>৳{rig.totalWithServices.toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. OMNI5)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (inputCoupon.trim()) {
                      applyCoupon(inputCoupon.trim());
                    }
                  }}
                  className="px-3.5 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                  <span>Coupon ({couponCode}):</span>
                  <span>-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Price Calculation Ticker */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono text-slate-900 font-bold">
                    ৳{itemsSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono text-slate-900">
                    {fulfillmentMode === "pickup"
                      ? "FREE (Showroom Pickup)"
                      : deliveryFee === 0
                      ? "FREE (Orders over ৳50,000)"
                      : `৳${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Mushak-6.3 VAT (15%):</span>
                  <span className="text-emerald-700 font-bold">Included</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900 font-sans">
                    Grand Total Payable:
                  </span>
                  <span className="text-2xl font-black text-[#0D47A1] font-sans">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>

                {paymentMethod === "emi" && (
                  <div className="text-right text-[11px] text-slate-500 font-mono">
                    ({selectedEmiMonths} Mo EMI: ৳{Math.round(grandTotal / selectedEmiMonths).toLocaleString()}/mo)
                  </div>
                )}
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-black rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined">verified</span>
                <span>
                  {isSubmitting
                    ? "Confirming Reservation..."
                    : fulfillmentMode === "pickup"
                    ? "Reserve for Immediate Pickup"
                    : "Confirm & Place Courier Order"}
                </span>
              </button>

              <div className="text-center text-[10.5px] text-slate-400">
                100% Genuine Importer Stock • 7-Day Replacement Policy • Official Warranty
              </div>
            </div>
          </div>
        </div>

        {/* bKash / Nagad Payment Simulation Modal */}
        {mfsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Masthead */}
              <div
                className={`p-5 text-white flex items-center justify-between ${
                  mfsProvider === "bkash" ? "bg-[#E2136E]" : "bg-[#F7931E]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    ৳
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-sans">
                      {mfsProvider === "bkash" ? "bKash Direct Gateway" : "Nagad Payment Gateway"}
                    </h3>
                    <p className="text-[11px] text-white/80">Merchant ID: OMNIPULSE_BD_01</p>
                  </div>
                </div>

                <button
                  onClick={() => setMfsModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleCompleteMfsPayment} className="p-6 space-y-4 text-xs">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMfsProvider("bkash")}
                    className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                      mfsProvider === "bkash"
                        ? "bg-[#E2136E] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    bKash Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setMfsProvider("nagad")}
                    className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                      mfsProvider === "nagad"
                        ? "bg-[#F7931E] text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Nagad Wallet
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="text-slate-500">Payable Amount:</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ৳{(grandTotal + deliveryFee).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your {mfsProvider === "bkash" ? "bKash" : "Nagad"} Account Number:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX"
                    value={mfsPhone}
                    onChange={(e) => setMfsPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Enter Wallet PIN (Simulated Sandbox):
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••••"
                    value={mfsPin}
                    onChange={(e) => setMfsPin(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                    mfsProvider === "bkash"
                      ? "bg-[#E2136E] hover:bg-[#c90f61]"
                      : "bg-[#F7931E] hover:bg-[#e07f0f]"
                  }`}
                >
                  Confirm &amp; Authorize ৳{(grandTotal + deliveryFee).toLocaleString()}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
