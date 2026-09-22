"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore, PaymentMethod, FulfillmentMode, BranchKey } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";

export default function VoltMatrixCheckout() {
  const {
    bundledRigs,
    standaloneItems,
    couponCode,
    couponDiscount,
    fulfillmentMode,
    deliveryDetails,
    paymentMethod,
    selectedEmiMonths,
    b2bDetails,
    isMfsModalOpen,
    orderCompleted,
    orderId,
    applyCoupon,
    removeCoupon,
    setFulfillmentMode,
    updateDeliveryDetails,
    setPaymentMethod,
    setSelectedEmiMonths,
    updateB2BDetails,
    setMfsModalOpen,
    submitOrder,
    loadSampleCart,
    updateStandaloneQuantity,
    removeStandaloneItem,
    removeBundledRig,
    getItemsSubtotal,
    getServicesSubtotal,
    getShippingFee,
    getInsuranceFee,
    getGrandTotal,
    getTotalItemCount,
  } = useCartStore();

  const [isRigCollapsed, setIsRigCollapsed] = useState(false);
  const [voucherInput, setVoucherInput] = useState(couponCode || "ARCHITECT10");
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfsStep, setMfsStep] = useState<"number" | "pin" | "success">("number");
  const [mfsNumber, setMfsNumber] = useState("01712449811");
  const [mfsPin, setMfsPin] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (bundledRigs.length === 0 && standaloneItems.length === 0) {
      loadSampleCart();
    }
  }, [bundledRigs.length, standaloneItems.length, loadSampleCart]);

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center font-mono text-[12px] text-slate-500">
        Loading VoltMatrix Modular Cart &amp; Checkout Tunnel...
      </div>
    );
  }

  const handleApplyVoucher = () => {
    const res = applyCoupon(voucherInput);
    setVoucherMsg(res.message);
    setTimeout(() => setVoucherMsg(null), 3000);
  };

  const handleOrderSubmit = async () => {
    if (paymentMethod === "mfs") {
      setMfsStep("number");
      setMfsModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      await submitOrder();
      setIsSubmitting(false);
    }, 1400);
  };

  const handleMfsSimulatePay = () => {
    if (mfsStep === "number") {
      setMfsStep("pin");
    } else if (mfsStep === "pin") {
      setMfsStep("success");
      setTimeout(async () => {
        setMfsModalOpen(false);
        await submitOrder();
      }, 1500);
    }
  };

  const grandTotal = getGrandTotal();

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen">
      {/* Sub-Header Breadcrumb & Telemetry */}
      <section className="w-full bg-slate-100 border-b border-slate-200 px-3 sm:px-4 py-2">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5 text-slate-500 text-[12px] font-mono">
            <Link href="/" className="hover:text-[#EF4444] transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/catalog" className="hover:text-[#EF4444] transition-colors">Directory</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-900 font-bold">Modular Cart &amp; Multi-Channel Checkout</span>
          </nav>

          <div className="hidden lg:flex items-center gap-4 font-mono text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              TRANSACTION SSL 256-BIT ENCRYPTED
            </span>
            <span className="text-slate-300">|</span>
            <span>DISPATCH REGION: DHAKA METRO (IDB BHABAN DEPOT)</span>
          </div>
        </div>
      </section>

      {/* Main Checkout Viewport Container */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT 8 COLS: ITEMIZED BOM RIG & FULFILLMENT ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* SECTION 1: Itemized Rig Build Bundle */}
            {bundledRigs.map((rig) => (
              <div
                key={rig.id}
                className="bg-white rounded border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#EF4444] text-white rounded flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-headline font-bold text-[16px] text-slate-900">
                          {rig.name} #{rig.id}
                        </h2>
                        <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                          VERIFIED CONFIG
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-500">
                        8 Core Hardware Components + Factory Certified Lab Stress Testing
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-[20px] text-[#b61722] font-bold">
                        ৳{rig.totalWithServices.toLocaleString()}
                      </div>
                      <div className="font-mono text-[10.5px] text-slate-400">
                        Inclusive of Assembly
                      </div>
                    </div>

                    <button
                      onClick={() => setIsRigCollapsed(!isRigCollapsed)}
                      className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-700 transition-colors"
                      title="Toggle Rig Breakdown"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isRigCollapsed ? "expand_more" : "expand_less"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Collapsible BOM Components Table */}
                {!isRigCollapsed && (
                  <div className="space-y-1 text-[12px]">
                    {Object.entries(rig.components).map(([slotKey, item]) => {
                      if (!item) return null;
                      return (
                        <div
                          key={slotKey}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-mono text-[10px] uppercase text-slate-500 font-bold w-12 shrink-0">
                              {slotKey}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate max-w-sm sm:max-w-md">
                                {item.name}
                              </div>
                              <div className="font-mono text-[10px] text-slate-500 truncate">
                                {item.specs.slice(0, 2).map((s) => s.value).join(" • ")}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 bg-white rounded border border-slate-200 text-slate-600">
                              {item.warranty.split(" ")[0]} Official
                            </span>
                            <span className="font-mono text-[13px] text-slate-900 font-bold">
                              ৳{item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Certified Lab Services Strip */}
                    <div className="p-3 bg-red-50/40 rounded border border-red-100 space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                          <span>Precision Cable Management &amp; BIOS Flash</span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase">
                          Included Free (Promo)
                        </span>
                      </div>
                      {rig.services.occtStressTest && (
                        <div className="flex items-center justify-between text-[11.5px]">
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <span className="material-symbols-outlined text-[16px] text-[#EF4444]">speed</span>
                            <span>24-Hour OCCT Silicon Thermal Stability &amp; Memory Test Certification</span>
                          </div>
                          <span className="font-mono text-[12px] text-slate-900 font-bold">+৳1,500</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Standalone Peripheral Items */}
            {standaloneItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded border border-slate-200 shadow-sm p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 bg-slate-50 rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline font-semibold text-[14px] text-slate-900">
                        {item.product.name}
                      </h3>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {item.product.brand}
                      </span>
                    </div>
                    <div className="text-[12px] text-slate-500 mt-0.5">
                      {item.product.specs.slice(0, 2).map((s) => s.value).join(" • ")}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-mono mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>In Stock @ IDB Depot (2-Yr Warranty)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-100 rounded border border-slate-200 p-0.5">
                    <button
                      onClick={() => updateStandaloneQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-[12px] font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateStandaloneQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-[18px] text-slate-900 font-bold">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeStandaloneItem(item.product.id)}
                      className="font-mono text-[10.5px] text-[#b61722] hover:underline uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* SECTION 2: Fulfillment Logistics Workflow Switcher */}
            <div className="bg-white rounded border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[20px]">local_shipping</span>
                  <h2 className="font-headline font-bold text-[16px] text-slate-900">
                    Fulfillment Logistics Workflow
                  </h2>
                </div>
                <span className="font-mono text-[10.5px] text-slate-500 uppercase">
                  CHOOSE DISPATCH CHANNEL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Courier Option */}
                <label
                  onClick={() => setFulfillmentMode("courier")}
                  className={`p-4 rounded border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    fulfillmentMode === "courier"
                      ? "border-[#EF4444] bg-red-50/30"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#EF4444]">
                        local_shipping
                      </span>
                      <span className="font-headline font-bold text-[14px] text-slate-900">
                        Nationwide Express Courier
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="checkout_fulfillment"
                      checked={fulfillmentMode === "courier"}
                      onChange={() => setFulfillmentMode("courier")}
                      className="accent-[#EF4444]"
                    />
                  </div>
                  <div className="mt-3 space-y-1.5 text-[12px] text-slate-600">
                    <p>
                      Nationwide surface delivery across all <strong>64 Districts</strong> via Pathao Freight, Steadfast &amp; RedX Heavy Van.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        Cash on Delivery (COD) Enabled
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                        Reinforced Wooden Crating
                      </span>
                    </div>
                  </div>
                </label>

                {/* Store Pickup Option */}
                <label
                  onClick={() => setFulfillmentMode("pickup")}
                  className={`p-4 rounded border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    fulfillmentMode === "pickup"
                      ? "border-[#EF4444] bg-red-50/30"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-slate-700">
                        storefront
                      </span>
                      <span className="font-headline font-bold text-[14px] text-slate-900">
                        Branch Click &amp; Collect
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="checkout_fulfillment"
                      checked={fulfillmentMode === "pickup"}
                      onChange={() => setFulfillmentMode("pickup")}
                      className="accent-[#EF4444]"
                    />
                  </div>
                  <div className="mt-3 space-y-1.5 text-[12px] text-slate-600">
                    <p>
                      Collect in person within <strong>2 Hours</strong> at IDB Bhaban, Multiplan Center, or Chittagong GEC Hub.
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        FREE Store Pickup
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                        Live On-Bench POST Demo
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Store Selection if pickup */}
              {fulfillmentMode === "pickup" && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <span className="font-mono text-[11px] font-bold text-slate-700 uppercase block">
                    Choose Pickup Showroom Location:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    {[
                      { key: "idb", label: "Dhaka IDB Bhaban Hub (Level 3)" },
                      { key: "multiplan", label: "Multiplan Center Hub (Level 9)" },
                      { key: "motijheel", label: "Motijheel Commercial Hub" },
                      { key: "chittagong", label: "Chittagong GEC Sanmar Depot" },
                    ].map((hub) => (
                      <button
                        key={hub.key}
                        onClick={() => updateDeliveryDetails({ pickupBranch: hub.key as BranchKey })}
                        className={`p-2 rounded text-left border transition-colors ${
                          deliveryDetails.pickupBranch === hub.key
                            ? "bg-white border-[#EF4444] text-[#b61722] font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {hub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Customer Consignee & Delivery Destination Form */}
            <div className="bg-white rounded border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h2 className="font-headline font-bold text-[16px] text-slate-900">
                  Consignee &amp; Delivery Destination
                </h2>
                <span className="font-mono text-[10px] text-slate-400">ALL FIELDS REQUIRED FOR COD</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Consignee Full Name *</label>
                  <input
                    type="text"
                    value={deliveryDetails.fullName}
                    onChange={(e) => updateDeliveryDetails({ fullName: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 rounded border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Active Mobile Number (SMS OTP) *</label>
                  <input
                    type="tel"
                    value={deliveryDetails.phone}
                    onChange={(e) => updateDeliveryDetails({ phone: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 rounded border border-slate-200 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800"
                  />
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Zila / District *</label>
                  <select
                    value={deliveryDetails.district}
                    onChange={(e) => updateDeliveryDetails({ district: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 rounded border border-slate-200 text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option>Dhaka District (North / South)</option>
                    <option>Chittagong (Chattogram)</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Khulna</option>
                    <option>Other 59 Districts...</option>
                  </select>
                </div>

                {/* Thana */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Thana / Upazila Hub *</label>
                  <select
                    value={deliveryDetails.thana}
                    onChange={(e) => updateDeliveryDetails({ thana: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 rounded border border-slate-200 text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option>Mirpur / Mirpur DOHS</option>
                    <option>Agargaon / Sher-e-Bangla</option>
                    <option>Dhanmondi / Mohammadpur</option>
                    <option>Gulshan / Banani / Baridhara</option>
                    <option>Uttara Hub</option>
                    <option>Motijheel / Old Dhaka</option>
                  </select>
                </div>

                {/* Doorstep Address */}
                <div className="md:col-span-2 space-y-1">
                  <label className="font-semibold text-slate-700 block">Precise Doorstep Address *</label>
                  <textarea
                    rows={2}
                    value={deliveryDetails.address}
                    onChange={(e) => updateDeliveryDetails({ address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-900 focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                {/* Handling Notes */}
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 block">Handling Directives</label>
                    <span className="font-mono text-[10px] text-slate-400">LAB CONCIERGE PACKING</span>
                  </div>
                  <input
                    type="text"
                    value={deliveryDetails.notes}
                    onChange={(e) => updateDeliveryDetails({ notes: e.target.value })}
                    className="w-full h-9 px-3 bg-slate-50 rounded border border-slate-200 text-slate-900 focus:bg-white focus:outline-none text-[11.5px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT 4 COLS: STICKY FINANCIAL SUMMARY & PAYMENT ================= */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
            {/* Financial Ledger Card */}
            <div className="bg-white rounded border border-slate-200 shadow-md p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-headline font-bold text-[15px] text-slate-900">
                  Financial Ledger
                </span>
                <span className="font-mono text-[10.5px] text-emerald-700 font-bold">
                  CURRENCY: BDT (৳)
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-[12px] font-mono">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Components Subtotal ({getTotalItemCount()} items)</span>
                  <span className="text-slate-900 font-bold">৳{getItemsSubtotal().toLocaleString()}</span>
                </div>

                {getServicesSubtotal() > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>24h OCCT Stress Testing</span>
                    <span className="text-slate-900 font-bold">+৳{getServicesSubtotal().toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-600">
                  <span>Wooden Crate &amp; Transit Insurance</span>
                  <span className="text-slate-900 font-bold">৳{getInsuranceFee().toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Express Courier Delivery</span>
                  <span className="text-emerald-700 font-bold">
                    {getShippingFee() === 0 ? "৳0 (Free over ৳50k)" : `৳${getShippingFee()}`}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-1.5 rounded font-bold">
                    <span>VOUCHER: {couponCode}</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Voucher Input */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="Enter coupon / promo code"
                    className="w-full h-8 px-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] uppercase text-slate-900 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="h-8 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded font-mono text-[11px] font-bold"
                  >
                    Apply
                  </button>
                </div>
                {voucherMsg && (
                  <div className="font-mono text-[10px] text-emerald-600">{voucherMsg}</div>
                )}
              </div>

              {/* Grand Total Calculation Block */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-headline font-bold text-[14px] text-slate-900 uppercase block">
                      Grand Total
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">AIT &amp; 5% VAT Included</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[24px] text-[#b61722] font-bold">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                    <span className="block font-mono text-[10px] text-emerald-700 font-bold">
                      Zero Processing Fees
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Payment Channel Selector */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500">
                    Select Payment Channel
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">INSTANT CLEARING</span>
                </div>

                <div className="space-y-2 text-[12px]">
                  {/* Option 1: COD */}
                  <label className="p-2.5 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-0.5 accent-[#EF4444]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>Cash on Delivery (COD)</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-mono text-[9px] rounded font-bold">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Pay upon doorstep inspection anywhere in Bangladesh.</p>
                    </div>
                  </label>

                  {/* Option 2: MFS (bKash/Nagad) */}
                  <label className="p-2.5 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentMethod === "mfs"}
                      onChange={() => setPaymentMethod("mfs")}
                      className="mt-0.5 accent-[#EF4444]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>bKash / Nagad / Upay</span>
                        <span className="font-mono text-[9px] text-slate-500">Instant QR</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Automated 1.2% cash-back reward applied instantly.</p>
                    </div>
                  </label>

                  {/* Option 3: Card */}
                  <label className="p-2.5 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mt-0.5 accent-[#EF4444]"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Visa / Mastercard / Amex</div>
                      <p className="text-[11px] text-slate-500">3D Secure 2.0 OTP verification via SSLCommerz.</p>
                    </div>
                  </label>

                  {/* Option 4: EMI */}
                  <label className="p-2.5 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="payment_channel"
                      checked={paymentMethod === "emi"}
                      onChange={() => setPaymentMethod("emi")}
                      className="mt-0.5 accent-[#EF4444]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>0% Bank EMI Financing</span>
                        <span className="font-mono text-[9.5px] bg-slate-100 px-1 rounded text-slate-700">
                          Up to 24 Mos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">City, EBL, SCB, BRAC Bank (starts from ৳{Math.round(grandTotal / 24).toLocaleString()}/mo).</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* B2B Corporate Tax Invoicing Module */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={b2bDetails.enabled}
                    onChange={(e) => updateB2BDetails({ enabled: e.target.checked })}
                    className="accent-[#EF4444]"
                  />
                  <span>Request Corporate Tax Invoice</span>
                </label>
                {b2bDetails.enabled && (
                  <div className="space-y-2 pl-5 pt-1 text-[11.5px]">
                    <input
                      type="text"
                      placeholder="Company Name (e.g. Apex Technologies Ltd)"
                      value={b2bDetails.companyName}
                      onChange={(e) => updateB2BDetails({ companyName: e.target.value })}
                      className="w-full h-8 px-2 bg-slate-50 rounded border border-slate-200 focus:bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="13-Digit VAT BIN: 002938174-0101"
                      value={b2bDetails.vatBin}
                      onChange={(e) => updateB2BDetails({ vatBin: e.target.value })}
                      className="w-full h-8 px-2 bg-slate-50 rounded border border-slate-200 font-mono focus:bg-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Primary Order Confirmation Button */}
              <button
                onClick={handleOrderSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#EF4444] hover:bg-[#dc2626] text-white font-mono text-[13px] uppercase font-bold tracking-tight rounded flex items-center justify-center gap-2 shadow-md active:translate-y-px transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSubmitting ? "sync" : "lock"}
                </span>
                <span>
                  {isSubmitting
                    ? "Transmitting Manifest to IDB Warehouse..."
                    : `Confirm Order (৳${grandTotal.toLocaleString()})`}
                </span>
              </button>

              <a
                href="https://wa.me/8801700000000?text=I%20need%20assistance%20with%20my%20checkout%20order."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-center block text-[11.5px] font-mono font-bold border border-emerald-300 transition-colors"
              >
                💬 Questions on EMI limits? Inquire on WhatsApp
              </a>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-slate-500">
                <div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] block">verified</span>
                  <span>100% Genuine</span>
                </div>
                <div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] block">sync_saved_locally</span>
                  <span>7-Day Swap</span>
                </div>
                <div>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] block">domain_verification</span>
                  <span>Tier-1 Importer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MFS (bKash / Nagad) SIMULATION MODAL */}
      {isMfsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 bg-[#b61722] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-[16px]">bKash / Nagad Direct Merchant</span>
              </div>
              <button
                onClick={() => setMfsModalOpen(false)}
                className="text-white hover:opacity-80 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <div className="text-[12px] text-slate-500">VoltMatrix Merchant ID: 01700-000000</div>
                <div className="font-mono text-[24px] text-slate-900 font-bold">৳{grandTotal.toLocaleString()}</div>
              </div>

              {mfsStep === "number" && (
                <div className="space-y-3">
                  <label className="font-mono text-[11px] uppercase font-bold text-slate-600 block">
                    Enter Wallet Mobile Number:
                  </label>
                  <input
                    type="tel"
                    value={mfsNumber}
                    onChange={(e) => setMfsNumber(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 rounded border border-slate-200 font-mono text-[14px] text-slate-900"
                  />
                  <button
                    onClick={handleMfsSimulatePay}
                    className="w-full h-10 bg-[#b61722] text-white font-mono text-[12px] font-bold rounded uppercase tracking-wide"
                  >
                    Proceed (Send OTP)
                  </button>
                </div>
              )}

              {mfsStep === "pin" && (
                <div className="space-y-3">
                  <label className="font-mono text-[11px] uppercase font-bold text-slate-600 block">
                    Enter 5-Digit Simulation PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={5}
                    placeholder="•••••"
                    value={mfsPin}
                    onChange={(e) => setMfsPin(e.target.value)}
                    className="w-full h-10 px-3 text-center tracking-widest bg-slate-50 rounded border border-slate-200 font-mono text-[18px] text-slate-900"
                  />
                  <button
                    onClick={handleMfsSimulatePay}
                    className="w-full h-10 bg-emerald-600 text-white font-mono text-[12px] font-bold rounded uppercase tracking-wide"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}

              {mfsStep === "success" && (
                <div className="py-6 text-center space-y-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[48px] animate-bounce">
                    check_circle
                  </span>
                  <div className="font-headline font-bold text-[18px] text-slate-900">
                    Payment Verified Successfully!
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    Generating order invoice and dispatch manifest...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {orderCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline font-bold text-2xl text-slate-900">
                Order Confirmed &amp; Dispatched!
              </h3>
              <p className="font-mono text-[12px] text-slate-500">
                Invoice &amp; Packing Slip: <strong className="text-slate-900">#{orderId}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-[12px] text-left space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Consignee:</span>
                <span className="font-bold text-slate-900">{deliveryDetails.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fulfillment Mode:</span>
                <span className="font-bold text-slate-900">
                  {fulfillmentMode === "courier" ? "Express Courier (Doorstep)" : "IDB Bhaban In-Store Pickup"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="text-emerald-600 font-bold">
                  {paymentMethod === "cod" ? "Pay upon Delivery (COD)" : "Authorized via Gateway"}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-[14px]">
                <span className="text-slate-700">Total Billed:</span>
                <span className="text-[#b61722] font-bold">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded font-mono text-[12px] uppercase font-bold flex items-center justify-center"
              >
                Return to Master Store
              </Link>
              <Link
                href="/pc-builder"
                className="flex-1 h-10 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[12px] uppercase font-bold flex items-center justify-center"
              >
                Configure Another Rig
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
