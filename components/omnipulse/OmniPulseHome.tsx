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

  // Category quick-pills
  const categories = [
    { id: "all", label: "All Showcase", icon: "dashboard" },
    { id: "cpu", label: "Processors", icon: "memory", img: OMNIPULSE_ASSET_URLS.processors },
    { id: "gpu", label: "Graphics Cards", icon: "videogame_asset", img: OMNIPULSE_ASSET_URLS.gpus },
    { id: "laptop", label: "Gaming Laptops", icon: "laptop_chromebook", img: OMNIPULSE_ASSET_URLS.laptops },
    { id: "monitor", label: "High-Refresh Monitors", icon: "monitor", img: OMNIPULSE_ASSET_URLS.displays },
    { id: "gadget", label: "Smartwatches & Gear", icon: "watch", img: OMNIPULSE_ASSET_URLS.gadgets },
    { id: "audio", label: "Wireless ANC Audio", icon: "headphones", img: OMNIPULSE_ASSET_URLS.audio },
    { id: "motherboard", label: "Motherboards", icon: "developer_board", img: OMNIPULSE_ASSET_URLS.motherboards },
    { id: "ram", label: "DDR5 Memory", icon: "storage", img: OMNIPULSE_ASSET_URLS.ram },
    { id: "storage", label: "NVMe SSDs", icon: "dns", img: OMNIPULSE_ASSET_URLS.storage },
  ];

  // Filter deals and products: branch-filtered deals
  const filteredProducts = HARDWARE_PRODUCTS.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Hot deals (products with discount between regularPrice and price)
  const hotDeals = HARDWARE_PRODUCTS.filter(
    (p) => (p.regularPrice > p.price) && ((p.branchStock as Record<string, number>)[currentBranch] || 0) > 0
  ).slice(0, 6);

  const handleAddToCart = (product: HardwareProduct) => {
    addStandaloneItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen">
      {/* 1. Hero Masthead: Omnichannel Hyper-Local Retail Authority */}
      <section className="relative bg-gradient-to-r from-[#071E4A] via-[#0D47A1] to-[#0A387E] text-white overflow-hidden py-12 lg:py-16">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-5">
              {/* Trust Badge Bar */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#FFB300] animate-ping" />
                <span>BANGLADESH&apos;S #1 OMNICHANNEL TECH &amp; RIG RETAIL NETWORK</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-sans leading-tight tracking-tight text-white">
                Physical Stock. <br />
                <span className="text-[#FFB300]">Immediate 2-Hour Pickup.</span> <br />
                Official BD Warranty.
              </h1>

              <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
                Connect directly with physical showroom inventory across <strong>IDB Bhaban</strong>, <strong>Multiplan Center</strong>, <strong>Motijheel HQ</strong>, <strong>Uttara</strong>, and <strong>Chittagong</strong>. Enjoy 0% EMI up to 36 months, nationwide Cash on Delivery, and live WhatsApp sales consultations.
              </p>

              {/* Action Buttons & Fast Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/catalog"
                  className="px-6 py-3 rounded-xl bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-extrabold text-sm transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">storefront</span>
                  <span>Explore Local Catalog</span>
                </Link>

                <Link
                  href="/pc-builder"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/25 flex items-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">tune</span>
                  <span>Custom PC Budget Wizard</span>
                </Link>

                <a
                  href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                    `Hello OmniPulse BD, I'm checking stock at ${activeBranchData.name}. Can you recommend the best gaming & workstation parts?`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-md active:scale-95"
                >
                  <span>💬</span>
                  <span>WhatsApp Sales Desk</span>
                </a>
              </div>

              {/* Fast Store Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-white font-sans">5</div>
                  <div className="text-[11px] text-blue-200">Flagship Showrooms</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#FFB300] font-sans">2-Hour</div>
                  <div className="text-[11px] text-blue-200">Express Dhaka Pickup</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-sans">0% EMI</div>
                  <div className="text-[11px] text-blue-200">36 Bank Partners</div>
                </div>
              </div>
            </div>

            {/* Hero Right: Active Branch Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/40 shadow-2xl text-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0D47A1]">location_on</span>
                    <span className="font-bold text-sm text-slate-900 font-sans">
                      Selected Pickup Hub
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ● READY IN 2 HOURS
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0D47A1]">{activeBranchData.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activeBranchData.location}</p>
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {activeBranchData.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-[#E3F2FD] p-2.5 rounded-xl border border-blue-100">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Live Inventory</div>
                    <div className="text-sm font-bold text-[#0D47A1] mt-0.5">
                      {activeBranchData.skusInStock.toLocaleString()} SKUs
                    </div>
                  </div>

                  <div className="bg-[#FFF8E1] p-2.5 rounded-xl border border-amber-100">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Store Hours</div>
                    <div className="text-xs font-bold text-amber-900 mt-0.5">
                      10 AM – 8:30 PM
                    </div>
                  </div>
                </div>

                {/* Branch Switcher Quick Select */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Switch Physical Hub:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {RETAIL_BRANCHES.map((b) => (
                      <button
                        key={b.key}
                        onClick={() => updateDeliveryDetails({ pickupBranch: b.key })}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                          currentBranch === b.key
                            ? "bg-[#0D47A1] text-white font-bold shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {b.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 3D Regional Map Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OmniPulse3DMap />
      </section>

      {/* 3. Category Quick-Pills Carousel */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Shop by Department &amp; Hardware Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a category to filter inventory currently ready at {activeBranchData.name}.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-[#0D47A1] hover:underline flex items-center gap-1"
          >
            <span>View All Catalog</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#0D47A1] border-[#0D47A1] text-white font-bold shadow-md shadow-blue-900/20"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Branch-Filtered Hot Deals */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
              Instant Pickup Deals at <span className="text-[#0D47A1]">{activeBranchData.name.split(" ")[0]}</span>
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline font-mono">
            {hotDeals.length} Verified Specials in Stock
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotDeals.map((product) => {
            const stockCount =
              (product.branchStock as Record<string, number>)[currentBranch] || 2;
            const savings = product.regularPrice - product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#0D47A1] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image with Tag & Stock Pill */}
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Savings Tag */}
                    {savings > 0 && (
                      <div className="absolute top-3 left-3 bg-[#D32F2F] text-white px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-md">
                        SAVE ৳{savings.toLocaleString()}
                      </div>
                    )}

                    {/* In-Stock Branch Badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between font-sans">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In Stock at {activeBranchData.name.split(" ")[0]}
                      </span>
                      <span className="font-mono text-slate-600 font-bold">
                        {stockCount} Units
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold uppercase text-[#0D47A1]">{product.brand}</span>
                      <span className="font-mono text-[11px]">{product.sku}</span>
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      className="text-base font-bold text-slate-900 hover:text-[#0D47A1] line-clamp-2 transition-colors font-sans"
                    >
                      {product.name}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price and EMI section */}
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <div className="text-xl font-black text-slate-900 font-sans">
                          ৳{product.price.toLocaleString()}
                        </div>
                        {product.regularPrice > product.price && (
                          <div className="text-xs text-slate-400 line-through">
                            ৳{product.regularPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase">0% EMI From</div>
                        <div className="text-xs font-bold text-[#0D47A1] font-mono">
                          ৳{product.emiPerMonth?.toLocaleString() || Math.round(product.price / 12).toLocaleString()}/mo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                      addedProductId === product.id
                        ? "bg-emerald-600 text-white"
                        : "bg-[#0D47A1] hover:bg-[#0a387e] text-white shadow-sm"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {addedProductId === product.id ? "check" : "shopping_cart"}
                    </span>
                    <span>{addedProductId === product.id ? "Added!" : "Add to Cart"}</span>
                  </button>

                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                      `Hello OmniPulse BD (${activeBranchData.name}), is ${product.name} (SKU: ${product.sku}) available for immediate pickup today at ৳${product.price}?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>💬</span>
                    <span>Order via WA</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Omnichannel Trust Guarantees Strip */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-sans">
              The OmniPulse BD Retail Promise
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Zero gray market risks. Official importer warranty with direct Mushak-6.3 VAT invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] text-[#0D47A1] flex items-center justify-center">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">100% Genuine Importer Stock</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct authorized distributor imports with official manufacturer replacement warranty.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#FFA000] flex items-center justify-center">
                <span className="material-symbols-outlined">electric_bolt</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">2-Hour Rapid Pickup</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Order online and collect within 2 hours from IDB, Multiplan, Uttara, Motijheel, or Ctg.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">COD &amp; 0% Bank EMI</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pay upon delivery across 64 districts or split payments into up to 36 months at 0% interest.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">Dedicated WhatsApp Care</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Talk directly with certified hardware engineers for assembly and part advice before ordering.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
