"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useBuilderStore } from "@/store/useBuilderStore";

export default function SynapseCheckout() {
  const router = useRouter();
  const { standaloneItems, getGrandTotal, clearCart } = useCartStore();
  const { slots } = useBuilderStore();

  // Combine cart items with filled builder slots
  const builderItems = Object.entries(slots)
    .filter(([_, item]) => item !== null)
    .map(([key, item]) => ({
      id: item!.id,
      product: item!,
      quantity: 1,
      slotKey: key,
    }));

  const allItems = [...builderItems, ...standaloneItems];

  // Bench Add-on Modules
  const [addThermalPaste, setAddThermalPaste] = useState<boolean>(true); // +Tk 650
  const [addEsdMat, setAddEsdMat] = useState<boolean>(false); // +Tk 950

  // Dispatch Vector
  const [dispatchVector, setDispatchVector] = useState<"courier" | "collect">("courier");

  // Recipient form fields
  const [recipientName, setRecipientName] = useState("Tanvir Ahmed");
  const [mobileNumber, setMobileNumber] = useState("+880 1712-345678");
  const [whatsappNumber, setWhatsappNumber] = useState("+880 1712-345678");
  const [district, setDistrict] = useState("Dhaka - Dhanmondi");
  const [streetAddress, setStreetAddress] = useState("House 42, Road 9/A, Dhanmondi R/A, Dhaka 1209");
  const [packagingDirectives, setPackagingDirectives] = useState(
    "Fragile high-end computer system. Ensure original component packaging boxes are bundled in shipping crate. Apply anti-shock foam inner brace."
  );

  // Promo Code
  const [couponInput, setCouponInput] = useState("SYNAPSEPRO");
  const [couponApplied, setCouponApplied] = useState(true);

  // Payment Channels
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "mfs" | "card" | "emi">("cod");

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  // Calculate financials
  const componentsSubtotal = allItems.reduce(
    (acc, it) => acc + it.product.price * it.quantity,
    0
  );

  const addOnsTotal = (addThermalPaste ? 650 : 0) + (addEsdMat ? 950 : 0);
  const freightFee = dispatchVector === "courier" ? 350 : 0;
  const occtFee = 1500;
  const promoDiscount = couponApplied ? 1600 : 0;

  const netAuthorizedTotal = Math.max(
    0,
    componentsSubtotal + addOnsTotal + freightFee + occtFee - promoDiscount
  );

  const handleApplyCoupon = () => {
    if (couponInput.trim().toUpperCase() === "SYNAPSEPRO") {
      setCouponApplied(true);
    } else {
      alert("Invalid promotional voucher code. Use SYNAPSEPRO for Tk 1,600 waiver.");
      setCouponApplied(false);
    }
  };

  const handleAuthorizeOrder = () => {
    setIsSubmitting(true);
    const generatedId = `SYN-WAYBILL-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1200);
  };

  return (
    <div className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased min-h-screen py-6">
      {/* Top Breadcrumb & Waybill Telemetry */}
      <div className="w-full bg-[#0B1326] border-b border-[#334155] py-3 mb-6">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Link href="/" className="hover:text-[#06B6D4]">SYNAPSECAD</Link>
            <span>/</span>
            <span className="text-[#06B6D4] font-bold">ASSEMBLY_STAGING</span>
            <span>/</span>
            <span className="text-[#84CC16]">TUNNEL_BATCH_09</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <span>STAGING: <strong className="text-[#84CC16]">IDB CLEANROOM</strong></span>
            <span>TRANSIT: <strong className="text-[#06B6D4]">64 DISTRICTS COD</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Checkout Grid */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Staging Ledger, Logistics, Recipient Manifest (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 01: Assembly Staging Ledger */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#06B6D4] text-base">precision_manufacturing</span>
                <span className="text-sm font-bold text-[#F8FAFC] uppercase">
                  01 // SILICON ASSEMBLY MANIFEST ({allItems.length} COMPONENTS)
                </span>
              </div>
              <span className="text-[#84CC16] text-[11px]">SERIALS ALLOCATED</span>
            </div>

            {allItems.length === 0 ? (
              <div className="py-8 text-center font-mono space-y-2">
                <p className="text-sm text-[#94A3B8]">Staging queue is currently empty.</p>
                <Link href="/catalog" className="text-xs text-[#06B6D4] underline font-bold">
                  Browse parts from Component Catalog
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 font-mono text-xs">
                {allItems.map((it, idx) => (
                  <div
                    key={`${it.product.id}-${idx}`}
                    className="p-3 bg-[#0B1326] border border-[#334155] hover:border-[#06B6D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-[10px] text-[#475569] font-bold w-8 shrink-0">
                        P-0{idx + 1}
                      </span>
                      <div className="w-10 h-10 bg-[#1E293B] p-1 shrink-0 flex items-center justify-center">
                        <img src={it.product.image} alt={it.product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[#F8FAFC] block truncate">
                          {it.product.name}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          SN: {it.product.sku.substring(0, 10)}-{idx + 1}01 // {it.product.warranty || "3Y Depot Warranty"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                      <span className="px-2 py-0.5 bg-[#1E293B] text-[10px] text-[#84CC16] font-bold">
                        QTY: {it.quantity}
                      </span>
                      <span className="text-sm font-bold text-[#06B6D4]">
                        Tk {(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Included Workshop Protocol Badge */}
            <div className="p-3 bg-[#0B1326] border border-[#84CC16] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#84CC16] text-base">verified</span>
                <span className="text-[#F8FAFC] font-bold">
                  WORKSHOP INTEGRATION PROTOCOL: COMPLETED
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-[#94A3B8]">24H OCCT THERMAL LOG: 0 ERRORS</span>
                <span className="px-1.5 py-0.5 bg-[#84CC16] text-[#0F172A] font-bold uppercase">
                  CALIBRATED
                </span>
              </div>
            </div>

            {/* Standalone Bench Accessories Module */}
            <div className="pt-2 border-t border-[#334155] space-y-2 font-mono text-xs">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                STANDALONE BENCH ACCESSORIES // OPTIONAL ADD-ONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3 bg-[#0B1326] border border-[#334155] hover:border-[#06B6D4] flex items-center justify-between cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addThermalPaste}
                      onChange={(e) => setAddThermalPaste(e.target.checked)}
                      className="accent-[#06B6D4] rounded-none"
                    />
                    <div>
                      <span className="text-[#F8FAFC] font-bold block text-[11px]">
                        Arctic MX-6 Thermal Paste 4g
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">1x Tube // 4.5 W/mK High Viscosity</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#06B6D4]">+Tk 650</span>
                </label>

                <label className="p-3 bg-[#0B1326] border border-[#334155] hover:border-[#06B6D4] flex items-center justify-between cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addEsdMat}
                      onChange={(e) => setAddEsdMat(e.target.checked)}
                      className="accent-[#06B6D4] rounded-none"
                    />
                    <div>
                      <span className="text-[#F8FAFC] font-bold block text-[11px]">
                        Anti-Static CAD Mat &amp; Strap
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Grounding Clip &amp; ESD Wristband</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#84CC16]">+Tk 950</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 02: Fulfillment Dispatch Vector */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#06B6D4] text-base">local_shipping</span>
                <span className="text-sm font-bold text-[#F8FAFC] uppercase">
                  02 // DISPATCH VECTOR SELECTION
                </span>
              </div>
              <span className="text-[#94A3B8] text-[11px]">[LOGISTICS ROUTE]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Courier Option */}
              <div
                onClick={() => setDispatchVector("courier")}
                className={`p-4 border cursor-pointer transition-all ${
                  dispatchVector === "courier"
                    ? "bg-[#1E293B] border-[#06B6D4] shadow-md shadow-cyan-950/30"
                    : "bg-[#0B1326] border-[#334155] hover:border-[#475569]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 border flex items-center justify-center ${
                      dispatchVector === "courier" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                    }`}>
                      {dispatchVector === "courier" && <span className="w-1.5 h-1.5 bg-[#0F172A]" />}
                    </span>
                    <span className="font-bold text-[#F8FAFC]">Nationwide Courier Express</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#84CC16]/20 text-[#84CC16] text-[10px] font-bold">
                    64 DISTRICTS
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  Pathao / Steadfast secure transport crate. Cash on Delivery (COD) valid across all divisions.
                </p>
                <div className="mt-2 pl-5 flex items-center gap-3 text-[10px] text-[#94A3B8]">
                  <span>TRANSIT: 24-48H</span>
                  <span>•</span>
                  <span className="text-[#06B6D4] font-bold">FREIGHT: Tk 350</span>
                </div>
              </div>

              {/* Click & Collect Option */}
              <div
                onClick={() => setDispatchVector("collect")}
                className={`p-4 border cursor-pointer transition-all ${
                  dispatchVector === "collect"
                    ? "bg-[#1E293B] border-[#06B6D4] shadow-md shadow-cyan-950/30"
                    : "bg-[#0B1326] border-[#334155] hover:border-[#475569]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 border flex items-center justify-center ${
                      dispatchVector === "collect" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                    }`}>
                      {dispatchVector === "collect" && <span className="w-1.5 h-1.5 bg-[#0F172A]" />}
                    </span>
                    <span className="font-bold text-[#F8FAFC]">Store Click &amp; Collect</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#1E293B] text-[#94A3B8] text-[10px]">
                    ZERO FEE
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  Physical handover &amp; bench inspection at IDB Bhaban Flagship or Multiplan Elephant Rd.
                </p>
                <div className="mt-2 pl-5 flex items-center gap-3 text-[10px] text-[#94A3B8]">
                  <span>STAGING: SAME DAY</span>
                  <span>•</span>
                  <span className="text-[#84CC16] font-bold">PICKUP: READY IN 3H</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 03: Recipient Manifest Form */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#06B6D4] text-base">badge</span>
                <span className="text-sm font-bold text-[#F8FAFC] uppercase">
                  03 // RECIPIENT TELEMETRY &amp; WAYBILL
                </span>
              </div>
              <span className="text-[#94A3B8] text-[11px]">[DHAKA GRID SPEC]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  RECIPIENT FULL NAME
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  PRIMARY MOBILE COMM (SMS TRACKING)
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  SECONDARY COMM (WHATSAPP ALERTS)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#25D366] text-[#25D366] px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  DIVISION &amp; ADMINISTRATIVE DISTRICT
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  <option value="Dhaka - Dhanmondi">Dhaka Division // Dhaka - Dhanmondi</option>
                  <option value="Dhaka - Gulshan">Dhaka Division // Dhaka - Gulshan / Banani</option>
                  <option value="Dhaka - Uttara">Dhaka Division // Dhaka - Uttara Sector 3</option>
                  <option value="Chittagong - Agrabad">Chittagong Division // Agrabad Commercial</option>
                  <option value="Sylhet - Zindabazar">Sylhet Division // Zindabazar Hub</option>
                  <option value="Rajshahi - Shaheb Bazar">Rajshahi Division // Shaheb Bazar</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  PHYSICAL BENCHMARK ADDRESS (STREET // SUITE // POSTCODE)
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-[#94A3B8] uppercase block mb-1">
                  TRANSIT PACKAGING NOTES &amp; WORKSHOP DIRECTIVES
                </label>
                <textarea
                  rows={2}
                  value={packagingDirectives}
                  onChange={(e) => setPackagingDirectives(e.target.value)}
                  className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] p-3 text-xs text-[#94A3B8] focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Financial Ledger & Payment Gateways (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Financial Summary Card */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <span className="text-sm font-bold text-[#06B6D4] uppercase">
                FINANCIAL LEDGER // BATCH-09
              </span>
              <span className="text-[#84CC16] font-bold">BDT [TK]</span>
            </div>

            <div className="space-y-2 text-[#94A3B8]">
              <div className="flex justify-between items-center">
                <span>Architecture Components ({allItems.length}x):</span>
                <span className="text-[#F8FAFC] font-bold">Tk {componentsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Selected Bench Add-ons:</span>
                <span className="text-[#F8FAFC] font-bold">Tk {addOnsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>24H OCCT Stress Testing Protocol:</span>
                <span className="text-[#F8FAFC] font-bold">Tk {occtFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Secure Freight Dispatch:</span>
                <span className="text-[#F8FAFC] font-bold">
                  {dispatchVector === "courier" ? `Tk ${freightFee.toLocaleString()}` : "FREE PICKUP"}
                </span>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-[#334155] space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="SYNAPSEPRO"
                    className="flex-1 bg-[#0B1326] border border-[#334155] px-2.5 py-1.5 text-xs font-mono text-[#06B6D4] uppercase focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-bold text-[#F8FAFC] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-[11px] text-[#84CC16]">
                    <span>PROMO CODE [SYNAPSEPRO]</span>
                    <span className="font-bold">-Tk {promoDiscount.toLocaleString()} (WAIVER)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Due Banner */}
            <div className="p-4 bg-[#0B1326] border border-[#06B6D4] space-y-1">
              <span className="text-[10px] text-[#94A3B8] uppercase block">
                AUTHORIZED NET PAYABLE AMOUNT
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-[#06B6D4]">
                  Tk {netAuthorizedTotal.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#84CC16]">VAT INCL.</span>
              </div>
            </div>
          </div>

          {/* Payment Settlement Method Selector */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <span className="font-bold text-[#06B6D4] uppercase">
                PAYMENT SETTLEMENT PROTOCOL
              </span>
              <span className="text-[10px] text-[#94A3B8]">[MODE SELECT]</span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Method 1: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "bg-[#1E293B] border-[#06B6D4]"
                    : "bg-[#0B1326] border-[#334155] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    paymentMethod === "cod" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                  }`}>
                    {paymentMethod === "cod" && <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                  </span>
                  <span className="font-bold text-[#06B6D4]">Cash on Delivery (COD)</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  Pay cash upon unboxing &amp; physical bench verification across all 64 districts.
                </p>
              </div>

              {/* Method 2: bKash / Nagad */}
              <div
                onClick={() => setPaymentMethod("mfs")}
                className={`p-3 border cursor-pointer transition-all ${
                  paymentMethod === "mfs"
                    ? "bg-[#1E293B] border-[#06B6D4]"
                    : "bg-[#0B1326] border-[#334155] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    paymentMethod === "mfs" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                  }`}>
                    {paymentMethod === "mfs" && <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                  </span>
                  <span className="font-bold text-[#F8FAFC]">bKash // Nagad Instant QR</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  Official Merchant Gateway with instant payment transaction voucher.
                </p>
              </div>

              {/* Method 3: Cards & SSLCommerz */}
              <div
                onClick={() => setPaymentMethod("card")}
                className={`p-3 border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "bg-[#1E293B] border-[#06B6D4]"
                    : "bg-[#0B1326] border-[#334155] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    paymentMethod === "card" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                  }`}>
                    {paymentMethod === "card" && <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                  </span>
                  <span className="font-bold text-[#F8FAFC]">Visa // Mastercard // Amex</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  256-bit SSL encrypted tokenized card processing gateway.
                </p>
              </div>

              {/* Method 4: 0% Bank EMI */}
              <div
                onClick={() => setPaymentMethod("emi")}
                className={`p-3 border cursor-pointer transition-all ${
                  paymentMethod === "emi"
                    ? "bg-[#1E293B] border-[#06B6D4]"
                    : "bg-[#0B1326] border-[#334155] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    paymentMethod === "emi" ? "border-[#06B6D4] bg-[#06B6D4]" : "border-[#334155]"
                  }`}>
                    {paymentMethod === "emi" && <span className="w-1.5 h-1.5 bg-[#0F172A] rounded-full" />}
                  </span>
                  <span className="font-bold text-[#84CC16]">Up to 12 Mo. 0% Bank EMI</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1 pl-5">
                  Available for City Bank, BRAC, Eastern Bank, SCB, DBBL credit cards.
                </p>
              </div>
            </div>

            {/* Authorize & Submit Button */}
            <button
              onClick={handleAuthorizeOrder}
              disabled={isSubmitting || allItems.length === 0}
              className="w-full py-4 bg-[#06B6D4] hover:bg-[#0891b2] disabled:opacity-50 text-[#0F172A] font-extrabold uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>
                {isSubmitting
                  ? "Transmitting Dispatch Waybill..."
                  : `Authorize Order (Tk ${netAuthorizedTotal.toLocaleString()})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Order Confirmation Receipt Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-[#84CC16] w-full max-w-xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center gap-3 border-b border-[#334155] pb-4">
              <div className="w-10 h-10 bg-[#84CC16]/20 border border-[#84CC16] flex items-center justify-center text-[#84CC16]">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">WAYBILL DISPATCH CONFIRMED</h3>
                <span className="text-xs text-[#84CC16]">{orderId}</span>
              </div>
            </div>

            <div className="bg-[#0B1326] p-4 border border-[#334155] space-y-2 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Recipient:</span>
                <span className="text-[#F8FAFC] font-bold">{recipientName}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Contact SMS:</span>
                <span className="text-[#F8FAFC]">{mobileNumber}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Destination Grid:</span>
                <span className="text-[#06B6D4]">{district}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Address:</span>
                <span className="text-[#F8FAFC] truncate max-w-[280px]">{streetAddress}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Payment Settlement:</span>
                <span className="text-[#84CC16] font-bold uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8] pt-2 border-t border-[#334155]">
                <span>Net Authorized Amount:</span>
                <span className="text-base font-bold text-[#06B6D4]">
                  Tk {netAuthorizedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Your workstation schematic is staged at the IDB Bhaban cleanroom. A systems engineer will contact you via WhatsApp with the 24H OCCT burn-in report before dispatch.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setOrderConfirmed(false);
                  router.push("/");
                }}
                className="flex-1 py-3 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-bold text-xs uppercase"
              >
                Return to CAD Home
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-3 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs text-[#F8FAFC]"
              >
                Print Waybill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
