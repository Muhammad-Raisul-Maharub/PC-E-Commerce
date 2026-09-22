"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function AxiomCheckout() {
  const {
    standaloneItems,
    getGrandTotal,
    getTotalItemCount,
    removeStandaloneItem,
    updateStandaloneQuantity,
    clearCart,
    deliveryDetails,
    updateDeliveryDetails,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<"wire" | "bkash" | "sslcommerz" | "cod">("wire");
  const [companyName, setCompanyName] = useState("");
  const [binNumber, setBinNumber] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [wireRefNumber, setWireRefNumber] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");

  const subtotal = getGrandTotal();
  // 2% discount for direct wire transfer / RTGS
  const wireDiscount = paymentMethod === "wire" ? Math.round(subtotal * 0.02) : 0;
  const grandTotal = Math.max(0, subtotal - wireDiscount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      alert("Please enter the designated corporate contact name and phone number.");
      return;
    }

    const orderNum = `AXM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderNumber(orderNum);
    setOrderConfirmed(true);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-xl border border-[#E4E4E7] bg-white p-6 sm:p-10 shadow-sm space-y-6">
          {/* Success Banner */}
          <div className="text-center space-y-2 pb-6 border-b border-[#E4E4E7]">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#ADF1C9] flex items-center justify-center mx-auto text-[#004F32]">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div className="font-mono text-xs uppercase font-bold text-[#004F32] tracking-wider">
              Procurement Order Registered
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
              Order Confirmation Docket
            </h1>
            <p className="font-mono text-sm text-[#71717A]">
              Tracking ID: <span className="font-bold text-[#18181B]">{confirmedOrderNumber}</span>
            </p>
          </div>

          {/* Corporate Entity Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-[#FBFBFD] border border-[#E4E4E7] text-xs font-mono">
            <div>
              <span className="text-[#71717A] block">CORPORATE ENTITY:</span>
              <span className="font-bold text-[#18181B]">{companyName || "Private Enterprise"}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">BIN / TIN REGISTRATION:</span>
              <span className="font-bold text-[#18181B]">
                {binNumber ? `BIN: ${binNumber}` : "Mushak-6.3 Standard"}
              </span>
            </div>
            <div>
              <span className="text-[#71717A] block">PURCHASE ORDER (PO):</span>
              <span className="font-bold text-[#18181B]">{poNumber || "PO-UNASSIGNED"}</span>
            </div>
            <div>
              <span className="text-[#71717A] block">CLEARING GATEWAY:</span>
              <span className="font-bold text-[#004F32] uppercase">
                {paymentMethod === "wire" ? "Corporate Wire / RTGS" : paymentMethod}
              </span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase text-[#71717A]">
              Procured Subsystems
            </h4>
            <div className="divide-y divide-[#E4E4E7] border-y border-[#E4E4E7] text-xs">
              {standaloneItems.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#18181B] block">{item.product.name}</span>
                    <span className="font-mono text-[10.5px] text-[#71717A]">
                      Qty: {item.quantity} • SKU: {item.product.sku}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#18181B]">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-4 rounded-lg bg-[#ECFDF5] border border-[#ADF1C9] flex items-center justify-between font-mono">
            <div>
              <span className="text-xs text-[#004F32] block">TOTAL PAYABLE (VAT INCLUSIVE):</span>
              <span className="text-2xl font-extrabold text-[#004F32]">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-[#004F32] font-bold">
              Mushak-6.3 Official Bill
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 h-11 rounded border border-[#E4E4E7] bg-white hover:bg-slate-50 text-[#18181B] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Official Docket</span>
            </button>
            <Link
              href="/"
              onClick={() => clearCart()}
              className="flex-1 h-11 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>Return to Showroom</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#E4E4E7] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#004F32]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#004F32]">
                Axiom Pro // Corporate Procurement Tunnel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
              Enterprise B2B Requisition &amp; Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
            <span>256-BIT ENCRYPTION</span>
            <span>•</span>
            <span className="text-[#004F32] font-semibold">MUSHAK-6.3 REGISTERED</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {standaloneItems.length === 0 ? (
          <div className="max-w-md mx-auto rounded-xl border border-[#E4E4E7] bg-white p-10 text-center space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#A1A1AA]">shopping_bag</span>
            <h3 className="font-mono text-base font-bold text-[#18181B]">
              Procurement Cart is Empty
            </h3>
            <p className="text-xs text-[#71717A]">
              Add workstation hardware components from our Infrastructure Directory or configure a custom system in the Platform Architect.
            </p>
            <Link
              href="/catalog"
              className="inline-block px-5 py-2.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 Cols): Corporate Credentials & Multi-Tier Payment Gateways */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Corporate Credentials */}
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E4E4E7]">
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center font-mono text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Corporate Entity &amp; Tax Registration (BIN / TIN)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Neural Systems Ltd."
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Company Purchase Order (PO) Number
                    </label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="e.g. PO-2026-AXM-089"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      13-Digit Business Identification No. (BIN)
                    </label>
                    <input
                      type="text"
                      value={binNumber}
                      onChange={(e) => setBinNumber(e.target.value)}
                      placeholder="00XXXXXXXXX-XXXX"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Tax Identification Number (TIN)
                    </label>
                    <input
                      type="text"
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      placeholder="12-Digit e-TIN"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Designated Contact *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Direct Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="w-full h-9 px-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <label className="font-mono text-[11px] text-[#71717A] block mb-1">
                    Deployment / Delivery Destination Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Floor, Building, Road, Thana, District"
                    className="w-full p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Multi-Tier Payment Gateways */}
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E4E4E7]">
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center font-mono text-xs font-bold">
                    2
                  </span>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Multi-Tier Clearing Gateway
                  </h3>
                </div>

                {/* Gateway Radio Options */}
                <div className="space-y-3">
                  {/* Wire Transfer / RTGS */}
                  <label
                    className={`block p-3.5 rounded border cursor-pointer transition-all ${
                      paymentMethod === "wire"
                        ? "border-[#004F32] bg-[#ECFDF5]"
                        : "border-[#E4E4E7] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "wire"}
                        onChange={() => setPaymentMethod("wire")}
                        className="mt-1 text-[#004F32] focus:ring-[#004F32]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#18181B]">
                            Corporate Wire Transfer / BEFTN / RTGS
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#004F32] text-white font-mono text-[10px] font-bold">
                            2% DISCOUNT APPLIED
                          </span>
                        </div>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Direct settlement into Axiom Pro Systems Ltd. City Bank Principal Branch account.
                        </p>

                        {paymentMethod === "wire" && (
                          <div className="mt-3 p-3 rounded bg-white border border-[#ADF1C9] space-y-1 font-mono text-[11px] text-[#18181B]">
                            <div><strong className="text-[#71717A]">Bank:</strong> City Bank PLC (Principal Branch, Motijheel)</div>
                            <div><strong className="text-[#71717A]">Account Name:</strong> Axiom Pro Systems Bangladesh Ltd.</div>
                            <div><strong className="text-[#71717A]">Account No:</strong> 108.120.0098442</div>
                            <div><strong className="text-[#71717A]">Routing No:</strong> 225261775</div>
                            <div className="pt-2">
                              <input
                                type="text"
                                value={wireRefNumber}
                                onChange={(e) => setWireRefNumber(e.target.value)}
                                placeholder="Enter Bank Transfer Reference / Deposit Slip No."
                                className="w-full h-8 px-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* bKash / Nagad Corporate Gateway */}
                  <label
                    className={`block p-3.5 rounded border cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "border-[#004F32] bg-[#ECFDF5]"
                        : "border-[#E4E4E7] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "bkash"}
                        onChange={() => setPaymentMethod("bkash")}
                        className="mt-1 text-[#004F32] focus:ring-[#004F32]"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-xs text-[#18181B]">
                          bKash / Nagad Merchant Direct Clearing
                        </span>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Instant automated transaction verification with 0% gateway fee for commercial accounts.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* SSLCommerz Gateway */}
                  <label
                    className={`block p-3.5 rounded border cursor-pointer transition-all ${
                      paymentMethod === "sslcommerz"
                        ? "border-[#004F32] bg-[#ECFDF5]"
                        : "border-[#E4E4E7] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "sslcommerz"}
                        onChange={() => setPaymentMethod("sslcommerz")}
                        className="mt-1 text-[#004F32] focus:ring-[#004F32]"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-xs text-[#18181B]">
                          SSLCommerz 3D-Secure Corporate Portal
                        </span>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Corporate VISA, MasterCard, American Express, and corporate credit cards.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Nationwide COD */}
                  <label
                    className={`block p-3.5 rounded border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-[#004F32] bg-[#ECFDF5]"
                        : "border-[#E4E4E7] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 text-[#004F32] focus:ring-[#004F32]"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-xs text-[#18181B]">
                          Nationwide Enterprise Cash on Delivery (COD)
                        </span>
                        <p className="text-[11px] text-[#71717A] mt-0.5">
                          Settlement upon physical crate inspection across 64 districts in Bangladesh.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols): Order Summary & Submit Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Requisition Summary ({getTotalItemCount()} Items)
                  </h3>
                  <span className="font-mono text-[10px] text-[#004F32] font-semibold">
                    ISO/IEC Verified
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#E4E4E7] max-h-[320px] overflow-y-auto pr-1">
                  {standaloneItems.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain rounded bg-slate-50 border border-[#E4E4E7] p-1 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-[#18181B] block truncate max-w-[200px]">
                            {item.product.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#71717A]">
                            SKU: {item.product.sku}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono flex-shrink-0">
                        <div className="text-xs font-bold text-[#18181B]">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#71717A]">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="pt-3 border-t border-[#E4E4E7] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#71717A]">
                    <span>Hardware Subtotal:</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>

                  {wireDiscount > 0 && (
                    <div className="flex items-center justify-between text-[#004F32] font-semibold">
                      <span>Wire Transfer Discount (2%):</span>
                      <span>-৳{wireDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#71717A]">
                    <span>Reinforced Crate Freight:</span>
                    <span className="text-[#004F32] font-semibold">FREE (Enterprise Tier)</span>
                  </div>

                  <div className="flex items-center justify-between text-[#71717A]">
                    <span>Mushak-6.3 VAT (15%):</span>
                    <span>Included</span>
                  </div>

                  <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between font-bold text-base text-[#004F32]">
                    <span>Net Investment:</span>
                    <span>৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Order CTA */}
                <button
                  type="submit"
                  className="w-full h-12 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Confirm Corporate Procurement Order</span>
                </button>

                <div className="text-center font-mono text-[10.5px] text-[#71717A] pt-1">
                  Official VAT invoice &amp; warranty certificate issued with consignment.
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
