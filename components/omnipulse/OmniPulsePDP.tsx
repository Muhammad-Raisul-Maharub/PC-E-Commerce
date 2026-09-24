"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";
import { useBuilderStore } from "@/store/useBuilderStore";
import OmniPulse3DViewer from "./OmniPulse3DViewer";
import { RETAIL_BRANCHES } from "./OmniPulse3DMap";

interface OmniPulsePDPProps {
  product: HardwareProduct;
}

export default function OmniPulsePDP({ product }: OmniPulsePDPProps) {
  const router = useRouter();
  const { addStandaloneItem, updateDeliveryDetails } = useCartStore();
  const { setSlot } = useBuilderStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(12);

  // EMI tenures
  const emiOptions = [
    { months: 3, label: "3 Months (0% Interest)", perMonth: Math.round(product.price / 3) },
    { months: 6, label: "6 Months (0% Interest)", perMonth: Math.round(product.price / 6) },
    { months: 9, label: "9 Months (0% Interest)", perMonth: Math.round(product.price / 9) },
    { months: 12, label: "12 Months (0% Interest)", perMonth: Math.round(product.price / 12) },
    { months: 24, label: "24 Months (Bank Promo)", perMonth: Math.round((product.price * 1.05) / 24) },
    { months: 36, label: "36 Months (Bank Promo)", perMonth: Math.round((product.price * 1.08) / 36) },
  ];

  const handleAddToCart = () => {
    addStandaloneItem(product, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addStandaloneItem(product, quantity);
    router.push("/checkout");
  };

  const handleAddToBuilder = () => {
    switch (product.category) {
      case "cpu":
        setSlot("cpu", product);
        break;
      case "motherboard":
        setSlot("motherboard", product);
        break;
      case "ram":
        setSlot("ram", product);
        break;
      case "gpu":
        setSlot("gpu", product);
        break;
      case "cooler":
        setSlot("cooler", product);
        break;
      case "storage":
        setSlot("storage", product);
        break;
      case "psu":
        setSlot("psu", product);
        break;
      case "chassis":
        setSlot("chassis", product);
        break;
      default:
        addStandaloneItem(product, 1);
        break;
    }
    router.push("/pc-builder");
  };

  // WhatsApp consultation link
  const whatsappConsultUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(
    `Hello OmniPulse BD Specialist, I'm reviewing ${product.name} (Item Code: ${product.sku}, Price: ৳${product.price.toLocaleString()}). Can you confirm branch availability and compatibility with my build?`
  )}`;

  const savings = product.regularPrice - product.price;

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen py-8">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#0D47A1]">Home</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-[#0D47A1]">Catalog</Link>
            <span>/</span>
            <span className="uppercase text-slate-400">{product.category}</span>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Item Code: <strong className="text-slate-800">{product.sku}</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">100% GENUINE BD STOCK</span>
          </div>
        </div>

        {/* Main Product Hero Grid (Left: 3D / Media, Right: Price & Omnichannel Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Left Column: 3D WebGL Viewer & Media Switcher (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header: Pure 3D Engine Inspection Bay */}
            <div className="flex items-center justify-between pb-1">
              <span className="px-3 py-1.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FFB300] animate-ping" />
                <span className="material-symbols-outlined text-sm">view_in_ar</span>
                <span>Interactive 3D Hardware Inspection</span>
              </span>

              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Interactive 3D Preview // 1:1 Scale
              </span>
            </div>

            {/* Media Display Window - Pure 3D Always Loaded */}
            <OmniPulse3DViewer
              productName={product.name}
              category={product.category}
              brand={product.brand}
            />

            {/* Feature Badges below Viewer */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">360° Rotate View</div>
                <div className="text-[11px] text-slate-500">Inspect all sides</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Retail Box Mode</div>
                <div className="text-[11px] text-slate-500">Packaging authenticity</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Exploded View</div>
                <div className="text-[11px] text-slate-500">Internal chip structure</div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Branch Status, and Buy Tunnel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & SKU Header */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#E3F2FD] text-[#0D47A1] rounded-lg text-xs font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Item Code: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans leading-snug">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Pricing Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                      ৳{product.price.toLocaleString()}
                    </div>
                    {savings > 0 && (
                      <div className="text-xs text-slate-400 line-through">
                        Regular: ৳{product.regularPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {savings > 0 && (
                    <span className="bg-[#D32F2F] text-white px-2.5 py-1 rounded-lg text-xs font-extrabold shadow">
                      SAVE ৳{savings.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs flex items-center justify-between text-slate-600">
                  <span>Mushak-6.3 VAT:</span>
                  <span className="font-semibold text-emerald-700">Official 15% Included</span>
                </div>
                <div className="text-xs flex items-center justify-between text-slate-600">
                  <span>Official Warranty:</span>
                  <span className="font-semibold text-slate-900">{product.warranty}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-mono text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      isAddedToCart
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D47A1] hover:bg-[#0a387e] text-white shadow-md shadow-blue-900/20"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isAddedToCart ? "check" : "shopping_cart"}
                    </span>
                    <span>{isAddedToCart ? "Added to Cart!" : "Add to Cart"}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3 rounded-xl bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* WhatsApp Consultation Button */}
                <a
                  href={whatsappConsultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>💬</span>
                  <span>WhatsApp Live Sales Consultation</span>
                </a>

                {/* Stage to Custom PC Builder */}
                <button
                  onClick={handleAddToBuilder}
                  className="w-full py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">build</span>
                  <span>Stage into Custom PC Builder</span>
                </button>
              </div>
            </div>

            {/* Micro Delivery Guarantee */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 text-[#0D47A1] font-bold">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span>Nationwide Courier &amp; Express Branch Pickup</span>
              </div>
              <p>
                In Dhaka or Ctg? Select store pickup for immediate handover within 2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Physical Store Inventory Table Across Branches */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans">
                  Physical Store Stock Availability
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Current stock status verified at physical showroom counters.
              </p>
            </div>
            <span className="font-mono text-xs text-[#0D47A1] font-bold bg-[#E3F2FD] px-3 py-1 rounded-lg">
              Live Store Inventory Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                  <th className="p-3">Retail Store Branch</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Available Units</th>
                  <th className="p-3">Collection Readiness</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {RETAIL_BRANCHES.map((b) => {
                  const stock =
                    (product.branchStock as Record<string, number>)[b.key] || 0;
                  const isReady = stock > 0;

                  return (
                    <tr key={b.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isReady ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        <span>{b.name}</span>
                      </td>
                      <td className="p-3 text-slate-500">{b.location}</td>
                      <td className="p-3 font-mono font-bold">
                        {isReady ? (
                          <span className="text-emerald-700">{stock} Units Ready</span>
                        ) : (
                          <span className="text-amber-700">0 Units (Transfer 24h)</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                            isReady
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isReady ? "Ready in 2 Hours" : "Order from Central Hub"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            updateDeliveryDetails({ pickupBranch: b.key });
                            handleAddToCart();
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#0D47A1] hover:text-white rounded-lg text-[11px] font-bold transition-colors"
                        >
                          Reserve Here
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 0% EMI Calculator & Specs Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: 0% EMI Breakdown Table (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                0% Interest Monthly Installment Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Available through 36 major Bangladeshi banks including SCB, City Bank, BRAC, and EBL.
              </p>
            </div>

            <div className="space-y-2">
              {emiOptions.map((opt) => (
                <div
                  key={opt.months}
                  onClick={() => setSelectedEmiTenure(opt.months)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedEmiTenure === opt.months
                      ? "border-[#0D47A1] bg-[#E3F2FD]/40 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                    <div className="text-[11px] text-slate-500">Credit card instalment</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-[#0D47A1]">
                      ৳{opt.perMonth.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">per month</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              *Requires valid credit card with matching available credit limit. No hidden fees.
            </div>
          </div>

          {/* Right: Technical Specifications Matrix (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Full Hardware &amp; Performance Specifications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Factory certified data for {product.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {product.specs.map((spec, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-slate-500 uppercase font-mono">{spec.label}</span>
                  <span className="font-bold text-slate-900 text-xs mt-1">{spec.value}</span>
                </div>
              ))}

              {product.socket && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Motherboard Fit (Socket)</span>
                  <span className="font-bold text-[#0D47A1] text-xs mt-1">{product.socket}</span>
                </div>
              )}

              {product.tdp > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Power &amp; Heat Output (Watts)</span>
                  <span className="font-bold text-amber-900 text-xs mt-1">{product.tdp} Watts</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
