"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";

export default function VoltMatrixCatalog() {
  const { addStandaloneItem } = useCartStore();
  const { setSlot } = useBuilderStore();

  // Filter States
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVram, setSelectedVram] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(5000);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [idbOnly, setIdbOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"dense" | "grid">("dense");
  const [sortBy, setSortBy] = useState<string>("price-desc");

  // Comparison Tray State
  const [comparedProducts, setComparedProducts] = useState<HardwareProduct[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const toggleCompare = (product: HardwareProduct) => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      setComparedProducts(comparedProducts.filter((p) => p.id !== product.id));
    } else {
      if (comparedProducts.length >= 4) {
        alert("Maximum 4 products can be compared simultaneously in the side-by-side matrix.");
        return;
      }
      setComparedProducts([...comparedProducts, product]);
    }
  };

  const handleAddToCart = (product: HardwareProduct) => {
    addStandaloneItem(product, 1);
    showFeedback(`Added ${product.name} to Cart`);
  };

  const handleAddToBuilder = (product: HardwareProduct) => {
    const categoryToSlot: Record<string, BuilderSlotKey> = {
      cpu: "cpu",
      motherboard: "motherboard",
      cooler: "cooler",
      ram: "ram",
      storage: "storage",
      gpu: "gpu",
      psu: "psu",
      chassis: "chassis",
      peripherals: "peripherals",
    };
    const slot = categoryToSlot[product.category];
    if (slot) {
      setSlot(slot, product);
      showFeedback(`Configured ${product.name} in System Architect (${slot.toUpperCase()})`);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 2200);
  };

  const allBrands = Array.from(new Set(HARDWARE_PRODUCTS.map((p) => p.brand)));

  // Filtered and Sorted Hardware List
  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCTS.filter((product) => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (searchFilter && !product.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (idbOnly && product.branchStock.idb <= 0) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      if (selectedVram.length > 0) {
        const hasMatchingVram = selectedVram.some((v) =>
          product.specs.some((s) => s.value.includes(v))
        );
        if (!hasMatchingVram) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [selectedCategory, searchFilter, selectedBrands, idbOnly, minPrice, maxPrice, selectedVram, sortBy]);

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed top-32 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl font-mono text-[12px] flex items-center gap-2 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Sub-Header Breadcrumb & Telemetry Ticker */}
      <section className="w-full bg-slate-100 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2">
        <div className="w-full max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5 text-slate-500 text-[12px] font-mono">
            <Link href="/" className="hover:text-[#EF4444] transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-[#EF4444] cursor-pointer">Hardware Directory</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-900 font-bold">Parametric Catalog Matrix</span>
          </nav>

          <div className="hidden lg:flex items-center gap-4 font-mono text-[10.5px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              SYS-INDEX: {HARDWARE_PRODUCTS.length} ACTIVE SKUS
            </span>
            <span className="text-slate-300">|</span>
            <span>IDB INVENTORY: REALTIME SYNC (30s)</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#b61722] font-bold">EXPRESS ROUTE: DHAKA METRO &lt; 120M</span>
          </div>
        </div>
      </section>

      {/* Main Split Architecture */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT PARAMETRIC FILTER SIDEBAR (280px fixed width rail on desktop) */}
          <aside className="w-full lg:w-[280px] lg:shrink-0 flex flex-col gap-4 select-none">
            {/* Search within facet */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-headline font-semibold text-[14px] uppercase tracking-tight text-slate-900">
                  Parametric Tree
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  V4.2
                </span>
              </div>
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                  tune
                </span>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter name, socket, chip..."
                  className="w-full h-8 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded text-[11.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Category Selectors */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2">
              <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500 block">
                Component Hierarchy
              </span>
              <div className="flex flex-col gap-1 text-[12px]">
                {[
                  { id: "all", label: "All Silicon & Parts" },
                  { id: "gpu", label: "Discrete GPUs (Graphics)" },
                  { id: "cpu", label: "Processors (CPUs)" },
                  { id: "motherboard", label: "Motherboards (ATX/mATX)" },
                  { id: "ram", label: "DDR5 / DDR4 Memory" },
                  { id: "storage", label: "PCIe 4.0/5.0 NVMe SSD" },
                  { id: "psu", label: "ATX 3.0 Power Supplies" },
                  { id: "cooler", label: "AIO Liquid Cooling" },
                  { id: "chassis", label: "High-Airflow Chassis" },
                  { id: "peripherals", label: "Esports Peripherals" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-[#EF4444] text-white font-bold"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="font-mono text-[10px] opacity-80">
                      {cat.id === "all"
                        ? HARDWARE_PRODUCTS.length
                        : HARDWARE_PRODUCTS.filter((p) => p.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fulfillment & Branch Stock */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500">
                  Fulfillment Matrix
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="flex items-center justify-between p-2 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-[12px]">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={idbOnly}
                      onChange={(e) => setIdbOnly(e.target.checked)}
                      className="accent-[#EF4444]"
                    />
                    <span className="text-slate-900 font-medium">In Stock @ IDB Depot</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    28
                  </span>
                </label>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 text-[12px]">
                  <span className="text-slate-700">Nationwide COD Delivery</span>
                  <span className="font-mono text-[10px] text-slate-600 font-bold">Active</span>
                </div>
              </div>
            </div>

            {/* Price Range Slider Presets */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500">
                  Budget Filter (BDT ৳)
                </span>
                <button
                  onClick={() => {
                    setMinPrice(5000);
                    setMaxPrice(150000);
                  }}
                  className="text-[11px] text-[#b61722] hover:underline font-mono"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-mono text-[9px] block text-slate-400 uppercase">Min Price (৳)</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-[12px] text-slate-900 font-bold focus:outline-none"
                  />
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-mono text-[9px] block text-slate-400 uppercase">Max Price (৳)</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-transparent font-mono text-[12px] text-slate-900 font-bold focus:outline-none"
                  />
                </div>
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => { setMinPrice(5000); setMaxPrice(30000); }}
                  className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Entry Tier
                </button>
                <button
                  onClick={() => { setMinPrice(30000); setMaxPrice(80000); }}
                  className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Mid-Range 1440p
                </button>
                <button
                  onClick={() => { setMinPrice(80000); setMaxPrice(200000); }}
                  className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Ultra Workstation
                </button>
              </div>
            </div>

            {/* Manufacturer Brand Filter */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500">
                  Foundry Manufacturer
                </span>
                <span className="font-mono text-[10px] text-slate-400">{allBrands.length} Brands</span>
              </div>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {allBrands.map((brand) => (
                  <label key={brand} className="flex items-center justify-between text-[12px] hover:bg-slate-50 p-1 rounded cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
                          }
                        }}
                        className="accent-[#EF4444]"
                      />
                      <span>{brand}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {HARDWARE_PRODUCTS.filter((p) => p.brand === brand).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* VRAM Capacity Facet */}
            <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm space-y-2">
              <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500 block">
                Memory / VRAM Size
              </span>
              <div className="flex flex-wrap gap-1">
                {["8GB", "12GB", "16GB", "32GB"].map((vram) => {
                  const isSelected = selectedVram.includes(vram);
                  return (
                    <button
                      key={vram}
                      onClick={() => {
                        if (isSelected) setSelectedVram(selectedVram.filter((v) => v !== vram));
                        else setSelectedVram([...selectedVram, vram]);
                      }}
                      className={`px-2 py-1 rounded font-mono text-[10.5px] transition-colors ${
                        isSelected
                          ? "bg-[#EF4444] text-white font-bold"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {vram}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Telemetry Diagnostic Widget */}
            <div className="bg-slate-900 text-white p-3.5 rounded border border-slate-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                <span>VOLT POWER AUDIT</span>
                <span className="text-emerald-400">SAFE</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Ensure your 12V rail handles transient spikes of up to 450W with modern ATX 3.1 certified PSUs.
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[72%]"></div>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCT MATRIX (High-Density List / Grid Mode) */}
          <section className="flex-1 w-full space-y-4">
            {/* Category Top Bar & Controls */}
            <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-headline font-bold text-xl uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    Foundry Hardware Directory
                    <span className="font-mono text-[10.5px] px-2 py-0.5 rounded bg-red-100 text-[#b61722] font-bold">
                      {filteredProducts.length} ACTIVE SKUS
                    </span>
                  </h1>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    Displaying verified hardware matching parametric criteria. Live pricing aligned with authorized importer warranty.
                  </p>
                </div>

                {/* View Mode & Sort Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200">
                    <button
                      onClick={() => setViewMode("dense")}
                      className={`px-2.5 py-1 rounded text-[12px] font-medium flex items-center gap-1 ${
                        viewMode === "dense"
                          ? "bg-white text-slate-900 shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#EF4444]">view_list</span>
                      Dense Matrix
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-2.5 py-1 rounded text-[12px] font-medium flex items-center gap-1 ${
                        viewMode === "grid"
                          ? "bg-white text-slate-900 shadow-sm font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">grid_view</span>
                      Card Grid
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 pl-2 pr-7 bg-slate-50 rounded border border-slate-200 text-[12px] text-slate-900 font-sans appearance-none focus:outline-none cursor-pointer"
                    >
                      <option value="price-desc">Sort: Price (High to Low)</option>
                      <option value="price-asc">Sort: Price (Low to High)</option>
                      <option value="name">Sort: Alphabetical</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[16px] text-slate-400 pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills Strip */}
              {(selectedBrands.length > 0 || selectedVram.length > 0 || idbOnly || selectedCategory !== "all") && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="font-mono text-[10.5px] text-slate-500 uppercase font-bold">
                    Active Filters:
                  </span>
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-mono">
                      Category: {selectedCategory.toUpperCase()}
                      <button onClick={() => setSelectedCategory("all")} className="text-slate-400 hover:text-[#EF4444]">×</button>
                    </span>
                  )}
                  {idbOnly && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-mono">
                      In Stock @ IDB
                      <button onClick={() => setIdbOnly(false)} className="text-slate-400 hover:text-[#EF4444]">×</button>
                    </span>
                  )}
                  {selectedBrands.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-mono">
                      {b}
                      <button onClick={() => setSelectedBrands(selectedBrands.filter((x) => x !== b))} className="text-slate-400 hover:text-[#EF4444]">×</button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedVram([]);
                      setSelectedCategory("all");
                      setIdbOnly(false);
                      setSearchFilter("");
                    }}
                    className="font-mono text-[11px] text-[#b61722] font-bold hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* DENSE LIST VIEW MODE */}
            {viewMode === "dense" && (
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const isCompared = comparedProducts.some((p) => p.id === product.id);
                  const savings = product.regularPrice - product.price;

                  return (
                    <article
                      key={product.id}
                      className="bg-white rounded border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-stretch gap-4 group"
                    >
                      {/* Left: Product Thumbnail & Compare Checkbox */}
                      <div className="w-full md:w-44 shrink-0 flex flex-col justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 relative">
                        <div className="w-full flex items-center justify-between">
                          <label className="flex items-center gap-1 text-[11px] font-mono cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => toggleCompare(product)}
                              className="accent-[#EF4444] rounded"
                            />
                            <span className={isCompared ? "text-[#EF4444] font-bold" : "text-slate-600"}>
                              COMPARE
                            </span>
                          </label>
                          <span className="px-1.5 py-0.5 text-[9px] bg-slate-900 text-white font-mono font-bold rounded uppercase">
                            Tier 1
                          </span>
                        </div>

                        <Link
                          href={`/product/${product.slug}`}
                          className="my-2 relative w-28 h-28 flex items-center justify-center"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </Link>

                        <div className="w-full flex items-center justify-center gap-1 font-mono text-[10px] text-slate-600 bg-white py-0.5 rounded border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>IDB Stock: {product.branchStock.idb} Units</span>
                        </div>
                      </div>

                      {/* Middle: Technical Specifications & Telemetry */}
                      <div className="flex-1 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[10.5px] px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                              {product.brand}
                            </span>
                            <span className="font-mono text-[10.5px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-200">
                              SKU: {product.sku}
                            </span>
                            <span className="font-mono text-[10.5px] px-1.5 py-0.5 bg-red-50 text-[#b61722] font-semibold rounded">
                              {product.tdp}W TDP
                            </span>
                          </div>

                          <Link
                            href={`/product/${product.slug}`}
                            className="font-headline font-semibold text-[16px] text-slate-900 mt-1 block group-hover:text-[#EF4444] transition-colors"
                          >
                            {product.name}
                          </Link>
                        </div>

                        {/* Orthogonal Spec Chips Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[10.5px]">
                          {product.specs.map((spec, i) => (
                            <div key={i} className="flex flex-col">
                              <span className="text-slate-400 text-[9px] uppercase truncate">{spec.label}</span>
                              <span className="font-bold text-slate-800 truncate">{spec.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Branch Stock Telemetry */}
                        <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-500 font-sans">
                          <span className="flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <strong className="text-slate-800">IDB Depot:</strong> Ready Now
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <strong className="text-slate-800">Multiplan:</strong> {product.branchStock.multiplan} Units
                          </span>
                          <span className="font-mono text-[10.5px] text-emerald-700 font-bold ml-auto">
                            ✓ {product.warranty}
                          </span>
                        </div>
                      </div>

                      {/* Right: Commercial Actions & Pricing */}
                      <div className="w-full md:w-52 shrink-0 bg-slate-50 p-3 rounded border border-slate-200 flex flex-col justify-between items-end text-right">
                        <div>
                          <div className="flex items-baseline justify-end gap-1.5">
                            <span className="font-mono text-[11px] line-through text-slate-400">
                              ৳{product.regularPrice.toLocaleString()}
                            </span>
                            <span className="font-mono text-[18px] text-[#b61722] font-bold">
                              ৳{product.price.toLocaleString()}
                            </span>
                          </div>
                          {savings > 0 && (
                            <div className="font-mono text-[10.5px] text-emerald-600 font-bold">
                              Save ৳{savings.toLocaleString()} Instant
                            </div>
                          )}
                          <div className="mt-1 font-mono text-[10.5px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            EMI: ৳{Math.round(product.price / 12).toLocaleString()}/mo x 12m
                          </div>
                        </div>

                        <div className="w-full flex flex-col gap-1.5 mt-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full h-8 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[11.5px] uppercase font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
                            <span>Add to Cart</span>
                          </button>

                          <div className="grid grid-cols-2 gap-1 w-full">
                            <button
                              onClick={() => handleAddToBuilder(product)}
                              className="h-7 bg-white hover:bg-slate-100 text-slate-800 rounded font-mono text-[10px] uppercase font-bold border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[13px] text-[#EF4444]">tune</span>
                              <span>+ Build</span>
                            </button>
                            <a
                              href={`https://wa.me/8801700000000?text=Hardware%20Inquiry%20for%20${encodeURIComponent(product.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="h-7 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-mono text-[10px] font-bold border border-emerald-300 flex items-center justify-center gap-0.5 transition-colors"
                            >
                              <span>💬 WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* DENSE 4-COL CARD GRID VIEW MODE */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const isCompared = comparedProducts.some((p) => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white p-4 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                            {product.brand}
                          </span>
                          <label className="flex items-center gap-1 font-mono text-[10.5px] cursor-pointer text-slate-600">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => toggleCompare(product)}
                              className="accent-[#EF4444]"
                            />
                            <span>Compare</span>
                          </label>
                        </div>

                        <Link href={`/product/${product.slug}`} className="w-full h-40 bg-slate-50 rounded flex items-center justify-center p-2">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                        </Link>

                        <Link
                          href={`/product/${product.slug}`}
                          className="font-headline font-semibold text-[14px] text-slate-900 leading-snug line-clamp-2 hover:text-[#EF4444] transition-colors"
                        >
                          {product.name}
                        </Link>

                        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                          {product.specs.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                              {s.value}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-[18px] text-[#b61722] font-bold">
                            ৳{product.price.toLocaleString()}
                          </span>
                          <span className="font-mono text-[10.5px] text-slate-500">
                            ৳{Math.round(product.price / 12).toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="h-8 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[11px] font-bold uppercase transition-colors"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleAddToBuilder(product)}
                            className="h-8 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[11px] font-bold uppercase transition-colors"
                          >
                            + Build
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* DOCKED BOTTOM PERSISTENT COMPARISON DRAWER (Matches Stitch Design) */}
      {comparedProducts.length > 0 && (
        <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-900 shadow-2xl py-2 px-3 sm:px-4">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              </div>
              <div>
                <div className="font-headline font-bold text-[13px] uppercase text-slate-900 leading-none">
                  Side-By-Side Spec Matrix
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  {comparedProducts.length} Selected / Max 4 Products
                </div>
              </div>

              {/* Selected Mini Nodes */}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                {comparedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded border border-slate-200"
                  >
                    <img src={p.image} alt={p.name} className="w-6 h-6 object-contain rounded bg-white" />
                    <div className="text-left font-mono">
                      <div className="text-[10px] font-bold text-slate-900 truncate max-w-[110px]">
                        {p.name}
                      </div>
                      <div className="text-[10.5px] text-[#b61722] font-bold">
                        ৳{p.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompare(p)}
                      className="text-slate-400 hover:text-[#EF4444] font-bold text-[14px]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => setComparedProducts([])}
                className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-mono text-[11px] transition-colors"
              >
                Clear Tray
              </button>
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="h-9 px-4 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[12px] font-bold uppercase tracking-tight flex items-center gap-1.5 shadow transition-all active:translate-y-px"
              >
                <span className="material-symbols-outlined text-[16px]">difference</span>
                <span>Launch Full Comparison ({comparedProducts.length})</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* FULL COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444] text-[22px]">difference</span>
                <h3 className="font-headline font-bold text-lg text-slate-900">
                  Side-By-Side Technical Hardware Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                    <img src={p.image} alt={p.name} className="w-full h-32 object-contain bg-white rounded p-2" />
                    <div className="font-mono text-[10.5px] text-slate-500 uppercase">{p.brand}</div>
                    <div className="font-headline font-semibold text-[14px] text-slate-900 leading-snug">{p.name}</div>
                    <div className="font-mono text-[18px] text-[#b61722] font-bold">৳{p.price.toLocaleString()}</div>
                    <div className="font-mono text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div>TDP: <strong>{p.tdp}W</strong></div>
                      {p.socket && <div>Socket: <strong>{p.socket}</strong></div>}
                      {p.specs.map((s, i) => (
                        <div key={i}>
                          {s.label}: <strong>{s.value}</strong>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(p);
                        setIsCompareModalOpen(false);
                      }}
                      className="w-full h-8 bg-[#EF4444] text-white font-mono text-[11px] uppercase font-bold rounded"
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
