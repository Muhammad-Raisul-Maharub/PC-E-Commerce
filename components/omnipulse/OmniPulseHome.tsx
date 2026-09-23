"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { OMNIPULSE_ASSET_URLS } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";
import OmniPulse3DMap, { RETAIL_BRANCHES } from "./OmniPulse3DMap";

export default function OmniPulseHome() {
  const { deliveryDetails, updateDeliveryDetails, addStandaloneItem } = useCartStore();
  const currentBranch = deliveryDetails.pickupBranch || "idb";
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const activeBranchData =
    RETAIL_BRANCHES.find((b) => b.key === currentBranch) || RETAIL_BRANCHES[0];

  // Horizontal Top Category Icon Rail
  const categoryIconRail = [
    { id: "laptop", label: "Laptop & Mac", icon: "laptop_chromebook", count: "124 Models" },
    { id: "cpu", label: "Processors", icon: "memory", count: "68 Models" },
    { id: "motherboard", label: "Motherboards", icon: "developer_board", count: "85 Models" },
    { id: "gpu", label: "Graphics Card", icon: "videogame_asset", count: "54 Models" },
    { id: "monitor", label: "Monitors", icon: "monitor", count: "92 Models" },
    { id: "gadget", label: "Smart Gadgets", icon: "watch", count: "110 Items" },
    { id: "storage", label: "SSD & Storage", icon: "dns", count: "74 Models" },
    { id: "peripherals", label: "Accessories", icon: "headphones", count: "140 Items" },
  ];

  // Filter products by selected category
  const filteredProducts = HARDWARE_PRODUCTS.filter((p) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "laptop") return p.category === "laptop" || p.tags?.includes("Laptop");
    return p.category === selectedCategory;
  });

  // Featured 4-column deals with authentic discounts
  const featuredDeals = filteredProducts.slice(0, 8);

  const handleAddToCart = (product: HardwareProduct) => {
    addStandaloneItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen">
      {/* 1. Ryans Benchmark: 3-Split Commercial Promo Grid (Hero) */}
      <section className="w-full pt-4 pb-3">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* 65% Main Consumer Promo Banner (8 cols on lg) */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden relative bg-gradient-to-r from-[#061C40] via-[#0D47A1] to-[#1565C0] text-white p-6 sm:p-10 flex flex-col justify-between shadow-lg min-h-[380px] lg:min-h-[420px]">
              {/* Decorative Background Glow & Grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 lg:opacity-45 pointer-events-none overflow-hidden">
                <img
                  src={OMNIPULSE_ASSET_URLS.laptops}
                  alt="High Performance Tech"
                  className="w-full h-full object-cover object-center transform scale-110"
                />
              </div>

              {/* Badge & Headlines */}
              <div className="relative z-10 space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-[#FFB300] text-[#0D47A1] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  <span>🔥 EID &amp; RAMADAN MEGA DEALS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]" />
                  <span>UP TO ৳15,000 SAVINGS</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans leading-tight tracking-tight text-white">
                  Next-Gen Laptops, <br />
                  <span className="text-[#FFB300]">Gaming Rigs &amp; Creator Gear.</span>
                </h1>

                <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-lg">
                  Genuine official Bangladesh warranty, 0% EMI up to 36 months, and immediate 2-hour pickup across <strong>IDB Bhaban</strong> &amp; <strong>Multiplan Center</strong> showrooms.
                </p>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/catalog"
                  className="px-6 py-3 rounded-xl bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Explore 50,000+ Products</span>
                </Link>

                <Link
                  href="/pc-builder"
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-all border border-white/25 flex items-center gap-2 backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Build Rig by Budget</span>
                </Link>

                <div className="hidden sm:flex items-center gap-3 pl-2 text-xs text-blue-100 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">verified</span>
                    100% Genuine BD Importer Stock
                  </span>
                </div>
              </div>
            </div>

            {/* 35% Dual Stacked Side Banners (4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Stacked Banner 1: Nationwide COD Courier */}
              <div className="flex-1 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-5 flex flex-col justify-between shadow-md border border-slate-700/50">
                <div className="flex items-start justify-between">
                  <span className="bg-[#25D366] text-slate-950 font-black text-[10.5px] px-2.5 py-0.5 rounded-full uppercase">
                    Nationwide Dispatch
                  </span>
                  <span className="material-symbols-outlined text-emerald-400 text-2xl">local_shipping</span>
                </div>

                <div className="space-y-1 my-2">
                  <h3 className="font-extrabold text-lg text-white font-sans">
                    64 Districts Courier COD
                  </h3>
                  <p className="text-xs text-slate-300 leading-snug">
                    Order online with zero risk. Pay upon inspection at your doorstep via Steadfast &amp; Pathao Express.
                  </p>
                </div>

                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FFB300] hover:underline"
                >
                  <span>Order with Cash on Delivery</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              {/* Stacked Banner 2: Portable Power & Workstation Drop */}
              <div className="flex-1 rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#FFB300] to-[#F59E0B] text-[#0D47A1] p-5 flex flex-col justify-between shadow-md">
                <div className="flex items-start justify-between">
                  <span className="bg-[#0D47A1] text-white font-bold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase">
                    Showroom Specials
                  </span>
                  <span className="material-symbols-outlined text-[#0D47A1] text-2xl">bolt</span>
                </div>

                <div className="space-y-1 my-2">
                  <h3 className="font-black text-lg text-[#0D47A1] font-sans">
                    Portable Power &amp; Office Rigs
                  </h3>
                  <p className="text-xs text-blue-950 font-medium leading-snug">
                    Pure sine-wave backup stations, gaming monitors &amp; productivity gear ready for pickup.
                  </p>
                </div>

                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1 text-xs font-black text-[#0D47A1] hover:underline"
                >
                  <span>View Stock at IDB &amp; Multiplan</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ryans Benchmark: 4-Column Commercial Trust Badge Bar */}
      <section className="w-full py-2">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0D47A1] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">credit_card</span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">0% Bank EMI</div>
                <div className="text-[11px] text-slate-500">Up to 36 Months on 30+ Banks</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">24/7 Support</div>
                <div className="text-[11px] text-slate-500">Dedicated WhatsApp Sales Desk</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">payments</span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">No Card Charges</div>
                <div className="text-[11px] text-slate-500">0% Extra on POS &amp; Online Pay</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">64 Districts COD</div>
                <div className="text-[11px] text-slate-500">Doorstep Cash on Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ryans Benchmark: Top Category Icon Rail */}
      <section className="w-full py-4">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0D47A1]" />
              Popular Hardware Categories
            </h2>
            <Link href="/catalog" className="text-xs font-bold text-[#0D47A1] hover:underline flex items-center gap-0.5">
              <span>View All Categories</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categoryIconRail.map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(selectedCategory === item.id ? "all" : item.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer ${
                    isSelected
                      ? "bg-[#0D47A1] border-[#0D47A1] text-white shadow-md shadow-blue-900/20"
                      : "bg-white border-slate-200 hover:border-[#0D47A1] text-slate-800 hover:bg-blue-50/50 shadow-sm"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-[#0D47A1]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="font-bold text-xs leading-tight">{item.label}</div>
                  <div className={`text-[10px] ${isSelected ? "text-blue-200" : "text-slate-400"}`}>
                    {item.count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Ryans Benchmark: 4-Column Featured Deals Grid with Real-time Branch Stock */}
      <section className="w-full py-4 pb-10">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans flex items-center gap-2">
                <span>Featured Deals at</span>
                <span className="text-[#0D47A1] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                  {activeBranchData.name.split(" ")[0]} Hub
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic prices in BDT with verified stock at physical showrooms and 64-district delivery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                Showing {featuredDeals.length} Verified SKUs
              </span>
              <Link
                href="/catalog"
                className="px-3.5 py-1.5 bg-[#0D47A1] hover:bg-[#0a387e] text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                View Full Catalog →
              </Link>
            </div>
          </div>

          {/* 4-Column Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredDeals.map((product) => {
              const stockCount =
                (product.branchStock as Record<string, number>)[currentBranch] || 3;
              const savings = product.regularPrice - product.price;
              const emi = product.emiPerMonth || Math.round(product.price / 12);
              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#0D47A1] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group p-4"
                >
                  <div>
                    {/* Image with Tag & Stock Pill */}
                    <div className="relative h-48 w-full bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Savings Badge */}
                      {savings > 0 && (
                        <div className="absolute top-2.5 left-2.5 bg-[#D32F2F] text-white px-2 py-0.5 rounded text-[11px] font-extrabold shadow-sm">
                          SAVE ৳{savings.toLocaleString()}
                        </div>
                      )}

                      {/* Branch Stock Status */}
                      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between font-sans">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Ready at {activeBranchData.name.split(" ")[0]}
                        </span>
                        <span className="font-mono text-slate-700 font-bold">
                          {stockCount} Units
                        </span>
                      </div>
                    </div>

                    {/* Category & Brand */}
                    <div className="text-[11px] text-slate-400 font-mono uppercase mb-1">
                      {product.brand} • {product.category.toUpperCase()}
                    </div>

                    {/* Title */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-bold text-sm text-slate-900 group-hover:text-[#0D47A1] transition-colors line-clamp-2 leading-snug"
                    >
                      {product.name}
                    </Link>

                    {/* 4-Point Specs */}
                    <div className="grid grid-cols-2 gap-1 my-3 bg-slate-50 p-2 rounded-lg text-[10.5px] border border-slate-100 font-mono text-slate-600">
                      {product.specs.slice(0, 4).map((spec, i) => (
                        <div key={i} className="truncate">
                          <span className="text-slate-400">{spec.label.split(" ")[0]}:</span>{" "}
                          <span className="font-semibold text-slate-800">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Conversions */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-1">
                      <div>
                        {savings > 0 && (
                          <span className="text-xs line-through text-slate-400 mr-1.5 font-mono">
                            ৳{product.regularPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-black text-[#0D47A1] font-sans">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Official Warranty
                      </span>
                    </div>

                    {/* EMI Calculation */}
                    <div className="text-[10.5px] text-slate-500 font-sans mb-3">
                      EMI from <strong>৳{emi.toLocaleString()}/mo</strong> (12 mos)
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`py-2 px-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-1 transition-all ${
                          isAdded
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-[#0D47A1] hover:bg-[#0a387e] text-white shadow-md active:scale-95"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isAdded ? "check" : "shopping_cart"}
                        </span>
                        <span>{isAdded ? "Added" : "Add to Cart"}</span>
                      </button>

                      <a
                        href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                          `Hello OmniPulse BD, is ${product.name} available for immediate pickup at ${activeBranchData.name}?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Physical Showroom Network & 3D Interactive Map */}
      <section className="w-full py-8 bg-white border-t border-slate-200">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider font-mono">
                Omnichannel Showroom Network
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">
                Physical Flagships Across Bangladesh
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Order online for immediate 2-hour express counter pickup or inspect hardware in-person at any of our regional depots.
            </p>
          </div>

          {/* 3D Map Component */}
          <OmniPulse3DMap />
        </div>
      </section>
    </div>
  );
}
