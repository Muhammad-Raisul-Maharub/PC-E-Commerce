"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { KRYPTON_MAKER_PRODUCTS, KryptonMakerProduct, toHardwareProduct } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";

export default function KryptonCatalog() {
  const { addStandaloneItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedSwitchType, setSelectedSwitchType] = useState<string>("all");
  const [selectedPinMount, setSelectedPinMount] = useState<string>("all");
  const [selectedForceRange, setSelectedForceRange] = useState<string>("all");
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleAddToCart = (product: KryptonMakerProduct) => {
    addStandaloneItem(toHardwareProduct(product), 1);
    setAddedToast(`BIN DISPATCH: ${product.name}`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return KRYPTON_MAKER_PRODUCTS.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.stockBinCode.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Domain
      if (selectedDomain !== "all" && item.domain !== selectedDomain) {
        return false;
      }

      // Switch Type
      if (selectedSwitchType !== "all" && item.specs.switchType !== selectedSwitchType) {
        return false;
      }

      // Pin Mount
      if (selectedPinMount !== "all" && item.specs.pins !== selectedPinMount) {
        return false;
      }

      // Actuation Force
      if (selectedForceRange !== "all" && item.specs.actuationForceGf) {
        const force = item.specs.actuationForceGf;
        if (selectedForceRange === "light" && force >= 45) return false;
        if (selectedForceRange === "medium" && (force < 45 || force > 60)) return false;
        if (selectedForceRange === "heavy" && force <= 60) return false;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, selectedSwitchType, selectedPinMount, selectedForceRange]);

  return (
    <main className="min-h-screen bg-[#EBEAE5] text-[#1E1E24] font-sans antialiased pb-24 selection:bg-[#FACC15] selection:text-black">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#FACC15] text-black border-2 border-black px-4 py-2.5 font-mono text-xs font-bold shadow-[4px_4px_0px_#000000] animate-in fade-in slide-in-from-top-2">
          [ {addedToast} ADDED TO CART ]
        </div>
      )}

      {/* Breadcrumb & Section Header */}
      <section className="bg-white border-b-2 border-black py-8">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase mb-2">
            <Link href="/" className="hover:text-black underline">
              Krypton Depot
            </Link>
            <span>/</span>
            <span className="text-black font-bold">Component Bins Directory</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black leading-none"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                COMPONENT BINS &amp; ENGINEERING DIRECTORY
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-600 mt-2">
                HEAVY GAUGE COMPONENT STORAGE // ACTIVE INVENTORY: {KRYPTON_MAKER_PRODUCTS.length} REGISTERED HARDWARE BINS
              </p>
            </div>

            {/* Live Stats */}
            <div className="flex items-center gap-3 bg-[#EBEAE5] border-2 border-black p-2 font-mono text-xs">
              <div>
                <span className="text-slate-500">FILTERED: </span>
                <span className="font-bold text-black">{filteredProducts.length} ITEMS</span>
              </div>
              <div className="border-l border-black pl-3">
                <span className="text-slate-500">DISPATCH: </span>
                <span className="text-[#059669] font-bold">SAME-DAY READY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout: Sidebar Filters + Product Grid */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Heavy Brutalist Filter Bay (3 cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
                <span className="font-mono text-xs font-bold uppercase text-black tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">filter_list</span>
                  <span>PARAMETER FILTER</span>
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDomain("all");
                    setSelectedSwitchType("all");
                    setSelectedPinMount("all");
                    setSelectedForceRange("all");
                  }}
                  className="font-mono text-[10px] uppercase text-slate-500 hover:text-black underline"
                >
                  RESET
                </button>
              </div>

              {/* Search Box */}
              <div className="mb-5">
                <label className="block font-mono text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  // 01 BIN OR SKU SEARCH:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Gateron, Oil King, 4090..."
                    className="w-full bg-[#EBEAE5] border-2 border-black px-3 py-2 text-xs font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none shadow-[2px_2px_0px_#000000]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 font-mono text-xs text-slate-400 hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Domain Filter */}
              <div className="mb-5">
                <label className="block font-mono text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  // 02 HARDWARE DOMAIN:
                </label>
                <div className="space-y-1 font-mono text-xs">
                  {[
                    { id: "all", label: "ALL DOMAINS" },
                    { id: "keyboard", label: "KEYBOARDS & SWITCHES" },
                    { id: "maker", label: "MAKER TOOLS & MCU" },
                    { id: "core-pc", label: "CORE PC HARDWARE" },
                  ].map((dom) => (
                    <button
                      key={dom.id}
                      onClick={() => setSelectedDomain(dom.id)}
                      className={`w-full text-left px-2.5 py-1.5 border transition-all flex items-center justify-between ${
                        selectedDomain === dom.id
                          ? "bg-[#FACC15] text-black font-extrabold border-black shadow-[2px_2px_0px_#000000]"
                          : "bg-transparent text-slate-700 border-transparent hover:bg-[#EBEAE5]"
                      }`}
                    >
                      <span>{dom.label}</span>
                      {selectedDomain === dom.id && <span>●</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Switch Type Filter */}
              <div className="mb-5">
                <label className="block font-mono text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  // 03 MECHANICAL SWITCH TYPE:
                </label>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {["all", "Linear", "Tactile", "Clicky", "Hall Effect Magnetic"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedSwitchType(st)}
                      className={`py-1.5 px-2 border text-[11px] font-bold uppercase text-center truncate ${
                        selectedSwitchType === st
                          ? "bg-black text-[#FACC15] border-black font-extrabold"
                          : "bg-[#EBEAE5] text-slate-700 border-black/30 hover:border-black"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Mount Filter */}
              <div className="mb-5">
                <label className="block font-mono text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  // 04 PCB PIN MOUNT:
                </label>
                <div className="space-y-1 font-mono text-xs">
                  {[
                    { id: "all", label: "ANY MOUNT SPEC" },
                    { id: "5-pin PCB Mount", label: "5-PIN PCB MOUNT" },
                    { id: "3-pin Plate Mount", label: "3-PIN PLATE MOUNT" },
                  ].map((pin) => (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedPinMount(pin.id)}
                      className={`w-full text-left px-2.5 py-1.5 border text-xs font-bold ${
                        selectedPinMount === pin.id
                          ? "bg-[#FACC15] text-black border-black"
                          : "bg-[#EBEAE5] text-slate-600 border-black/20 hover:border-black"
                      }`}
                    >
                      {pin.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actuation Force */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                  // 05 ACTUATION FORCE:
                </label>
                <div className="grid grid-cols-3 gap-1 font-mono text-xs">
                  {[
                    { id: "all", label: "ALL" },
                    { id: "light", label: "<45gf" },
                    { id: "medium", label: "45-60gf" },
                    { id: "heavy", label: ">60gf" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedForceRange(f.id)}
                      className={`py-1 border text-center text-[10px] font-bold uppercase ${
                        selectedForceRange === f.id
                          ? "bg-black text-white border-black"
                          : "bg-[#EBEAE5] text-slate-700 border-black/30 hover:border-black"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp Engineering Consultation Box */}
            <div className="bg-[#1E1E24] text-white border-2 border-black p-4 shadow-[4px_4px_0px_#000000] font-mono">
              <div className="text-[#25D366] text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">chat</span>
                <span>CUSTOM PINOUT INQUIRY</span>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Need bulk reel orders or custom CNC switch plate laser cutting? Connect with our workshop engineers directly.
              </p>
              <a
                href="https://wa.me/8801711000000?text=Hello%20Krypton%20Depot%2C%20I%20have%20an%20engineering%20parts%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#22c35e] text-black py-2 px-3 border border-black font-extrabold text-xs flex items-center justify-center gap-1 uppercase"
              >
                <span>OPEN WHATSAPP CHAT</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Component Bins Grid (9 cols) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_#000000]">
                <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">inventory_2</span>
                <h3 className="font-heading text-2xl font-bold uppercase text-black" style={{ fontFamily: "Syne, sans-serif" }}>
                  NO MATCHING COMPONENT BINS FOUND
                </h3>
                <p className="font-mono text-xs text-slate-500 mt-2 mb-4">
                  Adjust parameter filters or reset search terms to re-scan depot inventory.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDomain("all");
                    setSelectedSwitchType("all");
                    setSelectedPinMount("all");
                    setSelectedForceRange("all");
                  }}
                  className="bg-[#FACC15] text-black border-2 border-black px-4 py-2 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#000000]"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bin Rail */}
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-black font-mono text-[10px]">
                        <span className="bg-[#EBEAE5] text-black px-1.5 py-0.5 font-bold border border-black">
                          {product.stockBinCode}
                        </span>
                        <span className="text-slate-500 font-bold truncate max-w-[110px]">
                          {product.sku}
                        </span>
                        <span className="text-[#059669] font-bold">
                          ● {product.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Product Image */}
                      <div className="w-full h-44 bg-[#F4F4F0] border-2 border-black mb-3 relative overflow-hidden flex items-center justify-center p-2 group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-black text-[#FACC15] font-mono text-[10px] font-bold px-2 py-0.5">
                          {product.brand}
                        </div>
                      </div>

                      {/* Title & Domain */}
                      <div className="font-mono text-[10px] text-[#EA580C] font-bold uppercase mb-1">
                        // {product.domain.toUpperCase()} • {product.category.toUpperCase()}
                      </div>
                      <h3
                        className="font-heading font-extrabold text-base uppercase text-black leading-snug mb-2 line-clamp-2"
                        style={{ fontFamily: "Syne, sans-serif" }}
                      >
                        {product.name}
                      </h3>
                      <p className="font-sans text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Specs Matrix */}
                      <div className="bg-[#EBEAE5] border border-black p-2 font-mono text-[11px] mb-3 space-y-1">
                        {product.specs.switchType && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">TYPE:</span>
                            <span className="font-bold text-black">{product.specs.switchType}</span>
                          </div>
                        )}
                        {product.specs.pins && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">PINS:</span>
                            <span className="font-bold text-black">{product.specs.pins}</span>
                          </div>
                        )}
                        {product.specs.actuationForceGf && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">FORCE:</span>
                            <span className="font-bold text-black">{product.specs.actuationForceGf} gf</span>
                          </div>
                        )}
                        {product.specs.mcuCore && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">CORE:</span>
                            <span className="font-bold text-black truncate max-w-[130px]">{product.specs.mcuCore}</span>
                          </div>
                        )}
                        {product.specs.formFactor && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">FACTOR:</span>
                            <span className="font-bold text-black">{product.specs.formFactor}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
                      <div>
                        <div className="font-mono text-[10px] text-slate-400 line-through">
                          ৳ {product.regularPrice.toLocaleString()}
                        </div>
                        <div className="font-mono text-lg font-extrabold text-black">
                          ৳ {product.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/product/${product.slug}`}
                          className="p-2 border border-black bg-[#EBEAE5] hover:bg-white text-black font-mono text-xs font-bold"
                          title="View 3D Pinout & KiCad Spec"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black px-3 py-2 font-mono text-xs font-extrabold uppercase shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                          <span>DISPATCH</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
