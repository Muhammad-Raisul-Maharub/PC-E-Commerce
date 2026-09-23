"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";

export default function NeonForgeCatalog() {
  const { addStandaloneItem } = useCartStore();

  // Modding Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRadiator, setSelectedRadiator] = useState<string>("all");
  const [selectedThread, setSelectedThread] = useState<string>("all");
  const [selectedTubing, setSelectedTubing] = useState<string>("all");
  const [selectedSync, setSelectedSync] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCTS.filter((item) => {
      // 1. Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. Category
      if (selectedCategory !== "all") {
        if (selectedCategory === "modding") {
          if (!["waterblock", "radiator", "distro", "fittings"].includes(item.category)) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Radiator Size
      if (selectedRadiator !== "all" && item.moddingSpecs?.radiatorSize !== selectedRadiator) {
        return false;
      }

      // 4. Fitting Thread
      if (selectedThread !== "all" && item.moddingSpecs?.fittingThread !== selectedThread) {
        return false;
      }

      // 5. Tubing Type
      if (selectedTubing !== "all" && item.moddingSpecs?.tubingType !== selectedTubing) {
        return false;
      }

      // 6. ARGB Sync
      if (selectedSync !== "all" && item.moddingSpecs?.argbSync !== selectedSync) {
        return false;
      }

      // 7. Branch Availability
      if (branchFilter !== "all") {
        const stockCount = item.branchStock[branchFilter as keyof typeof item.branchStock] || 0;
        if (stockCount <= 0) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedRadiator, selectedThread, selectedTubing, selectedSync, searchQuery, branchFilter]);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-[#00F0FF] selection:text-[#0A0A0F] py-6">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <h1 className="font-chakra text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                Modder&apos;s Armory // Bare Hardware Directory
              </h1>
            </div>
            <p className="font-sans text-xs text-slate-400 mt-1">
              High-end custom liquid loop components, water blocks, distribution manifolds, and discrete processors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile/Tablet Off-Canvas Filter Terminal Trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-[#00F0FF] font-mono text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>FILTER TERMINAL</span>
            </button>

            <span className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[#12121A] border border-cyan-500/30 text-cyan-300 font-bold">
              {filteredProducts.length} ARMORED UNITS FOUND
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout (Filters Left, 3-Column Glass Cards Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Filters (Desktop sticky & Mobile off-canvas drawer) */}
          <aside className={`lg:col-span-3 space-y-5 ${isFilterDrawerOpen ? "fixed inset-0 z-50 bg-[#0A0A0F]/95 p-6 overflow-y-auto block" : "hidden lg:block"}`}>
            <div className="bg-[#12121A]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-chakra text-sm font-bold uppercase text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-cyan-400 text-base">tune</span>
                  <span>Modding Facets</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedRadiator("all");
                      setSelectedThread("all");
                      setSelectedTubing("all");
                      setSelectedSync("all");
                      setSearchQuery("");
                      setBranchFilter("all");
                    }}
                    className="font-mono text-[10px] text-slate-400 hover:text-cyan-400 uppercase underline"
                  >
                    Reset All
                  </button>
                  {isFilterDrawerOpen && (
                    <button
                      onClick={() => setIsFilterDrawerOpen(false)}
                      className="lg:hidden p-1 rounded bg-white/10 text-white font-mono text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Keyword Query
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., EKWB, 360mm, RTX 4090..."
                  className="w-full h-8 px-3 rounded-lg bg-[#0A0A0F] border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Component Categories */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Component Domain
                </label>
                <div className="space-y-1 font-mono text-xs">
                  {[
                    { id: "all", label: "All Hardware" },
                    { id: "modding", label: "Custom Liquid Cooling (All)" },
                    { id: "waterblock", label: "GPU & CPU Water Blocks" },
                    { id: "radiator", label: "High-Fin Radiators" },
                    { id: "distro", label: "Distro Plates & Pumps" },
                    { id: "fittings", label: "Fittings & Tubing" },
                    { id: "gpu", label: "Discrete GPUs" },
                    { id: "cpu", label: "Processors (CPUs)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? "bg-cyan-950/60 text-[#00F0FF] border border-cyan-500/40 font-bold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Radiator Dimension Facet */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Radiator Profile Size
                </label>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {["all", "240mm", "280mm", "360mm", "420mm"].map((rad) => (
                    <button
                      key={rad}
                      onClick={() => setSelectedRadiator(rad)}
                      className={`px-2 py-1 rounded border text-center transition-all uppercase ${
                        selectedRadiator === rad
                          ? "bg-[#00F0FF] text-[#0A0A0F] font-bold border-[#00F0FF]"
                          : "bg-[#0A0A0F] border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              {/* G1/4 Fitting Threads */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Port Thread Specification
                </label>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                  {["all", "G1/4", "G3/8"].map((th) => (
                    <button
                      key={th}
                      onClick={() => setSelectedThread(th)}
                      className={`px-2 py-1 rounded border text-center transition-all ${
                        selectedThread === th
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-[#0A0A0F] border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tubing Type */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Tubing Protocol
                </label>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                  {["all", "hardline", "soft"].map((tub) => (
                    <button
                      key={tub}
                      onClick={() => setSelectedTubing(tub)}
                      className={`px-2 py-1 rounded border text-center transition-all capitalize ${
                        selectedTubing === tub
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-[#0A0A0F] border-slate-800 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      {tub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Branch Stock Filter */}
              <div>
                <label className="block font-mono text-[11px] text-slate-400 uppercase font-semibold mb-1.5">
                  Physical Hub Stock
                </label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full h-8 px-2.5 rounded bg-[#0A0A0F] border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Any Regional Depot</option>
                  <option value="idb">Dhaka IDB Flagship</option>
                  <option value="multiplan">Multiplan Elephant Rd</option>
                  <option value="chittagong">Chittagong GEC Hub</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Product Grid (3-Column Dark Glass Cards) */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#12121A] border border-cyan-500/20 rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-cyan-400 mb-2">
                  search_off
                </span>
                <h3 className="font-chakra text-lg font-bold text-white uppercase">
                  No Armored Units Match Query
                </h3>
                <p className="font-sans text-xs text-slate-400 mt-1">
                  Adjust or clear active modding facets to display available custom loop hardware.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#12121A]/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/80 rounded-2xl p-4 shadow-xl transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,240,255,0.2)] flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Product Image Stage */}
                      <div className="w-full h-44 bg-[#0A0A0F] rounded-xl p-3 flex items-center justify-center relative overflow-hidden border border-white/5 mb-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] uppercase font-bold">
                          {p.brand}
                        </span>
                        {p.moddingSpecs?.radiatorSize && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00] font-mono text-[9px] uppercase font-bold">
                            {p.moddingSpecs.radiatorSize}
                          </span>
                        )}
                      </div>

                      {/* Header Title */}
                      <Link href={`/product/${p.slug}`}>
                        <h3 className="font-chakra text-sm font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {p.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-slate-400">
                        <span>SKU: {p.sku}</span>
                        {p.tdp > 0 && <span>• TDP: {p.tdp}W</span>}
                      </div>

                      {/* Specs Matrix */}
                      <div className="mt-3 grid grid-cols-2 gap-1.5 p-2 rounded bg-[#0A0A0F] border border-white/5 font-mono text-[10.5px]">
                        {p.specs.slice(0, 2).map((s, idx) => (
                          <div key={idx} className="truncate">
                            <span className="text-slate-500 block text-[9px] uppercase">{s.label}</span>
                            <span className="text-slate-200 font-bold truncate">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Pricing & CTA */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">
                          Modder Price
                        </span>
                        <span className="font-rajdhani text-2xl font-bold text-white tracking-tight">
                          ৳{p.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          className="px-2.5 py-1.5 rounded bg-[#0A0A0F] hover:bg-[#161622] border border-cyan-500/30 text-cyan-300 font-mono text-[11px] transition-colors"
                          title="View 3D Lab CAD"
                        >
                          <span className="material-symbols-outlined text-[15px]">view_in_ar</span>
                        </Link>

                        <button
                          onClick={() => addStandaloneItem(p, 1)}
                          className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-xs uppercase rounded transition-all shadow-md shadow-cyan-500/30"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
