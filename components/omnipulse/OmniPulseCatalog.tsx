"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore, BranchKey } from "@/store/useCartStore";
import { RETAIL_BRANCHES } from "./OmniPulse3DMap";

const AVAILABLE_SOCKETS = ["AM5", "LGA1851", "LGA1700", "AM4", "sTR5", "LGA4677"];

export default function OmniPulseCatalog() {
  const { deliveryDetails, updateDeliveryDetails, addStandaloneItem } = useCartStore();
  const currentBranch = (deliveryDetails.pickupBranch as BranchKey) || "idb";

  // Filter States
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(currentBranch);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSockets, setSelectedSockets] = useState<string[]>([]);
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [emiOnly, setEmiOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(600000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const activeBranchData =
    RETAIL_BRANCHES.find((b) => b.key === selectedBranchFilter) || RETAIL_BRANCHES[0];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "cpu", label: "Processors" },
    { id: "gpu", label: "Graphics Cards" },
    { id: "laptop", label: "Gaming Laptops" },
    { id: "monitor", label: "Monitors" },
    { id: "gadget", label: "Smartwatches & Gadgets" },
    { id: "audio", label: "ANC Audio" },
    { id: "motherboard", label: "Motherboards" },
    { id: "ram", label: "DDR5 Memory" },
    { id: "storage", label: "NVMe SSDs" },
    { id: "cooler", label: "Cooling Systems" },
    { id: "chassis", label: "Cases & Chassis" },
    { id: "psu", label: "Power Supplies" },
  ];

  // Extract all unique brands and their counts
  const { allBrands, brandCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    HARDWARE_PRODUCTS.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return {
      allBrands: Object.keys(counts).sort(),
      brandCounts: counts,
    };
  }, []);

  // Socket counts across hardware catalog
  const socketCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    AVAILABLE_SOCKETS.forEach((socket) => {
      counts[socket] = HARDWARE_PRODUCTS.filter((p) => {
        return (
          p.socket === socket ||
          p.specs.some((s) => s.value.toLowerCase().includes(socket.toLowerCase()))
        );
      }).length;
    });
    return counts;
  }, []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSocket = (socket: string) => {
    setSelectedSockets((prev) =>
      prev.includes(socket) ? prev.filter((s) => s !== socket) : [...prev, socket]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setSelectedSockets([]);
    setSelectedBranchFilter("all");
    setCodOnly(false);
    setEmiOnly(false);
    setInStockOnly(false);
    setPriceMin(0);
    setPriceMax(600000);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedBrands.length +
    selectedSockets.length +
    (selectedBranchFilter !== "all" ? 1 : 0) +
    (codOnly ? 1 : 0) +
    (emiOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceMin > 0 || priceMax < 600000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCTS.filter((product) => {
      // Branch filter check
      if (selectedBranchFilter !== "all") {
        const stockInBranch =
          (product.branchStock as Record<string, number>)[selectedBranchFilter] || 0;
        if (inStockOnly && stockInBranch <= 0) {
          return false;
        }
      } else if (inStockOnly) {
        const totalStock = Object.values(product.branchStock).reduce((sum, n) => sum + (n || 0), 0);
        if (totalStock <= 0) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Multi-brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Socket filter
      if (selectedSockets.length > 0) {
        const matchesSocket =
          (product.socket && selectedSockets.includes(product.socket)) ||
          product.specs.some((s) =>
            selectedSockets.some((sock) => s.value.toLowerCase().includes(sock.toLowerCase()))
          );
        if (!matchesSocket) return false;
      }

      // Price Filter
      if (product.price < priceMin || product.price > priceMax) {
        return false;
      }

      // 0% EMI Filter
      if (emiOnly && !product.emiPerMonth) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [
    selectedBranchFilter,
    inStockOnly,
    selectedCategory,
    selectedBrands,
    selectedSockets,
    priceMin,
    priceMax,
    emiOnly,
    searchQuery,
    sortBy,
  ]);

  const handleAddToCart = (product: HardwareProduct) => {
    addStandaloneItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleSwitchBranch = (key: string) => {
    setSelectedBranchFilter(key);
    if (key !== "all") {
      updateDeliveryDetails({ pickupBranch: key as BranchKey });
    }
  };

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen py-8">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        {/* Top Header & Telemetry Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0D47A1]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#0D47A1] font-bold">
                Store &amp; Online Product Catalog
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              OmniPulse BD Component &amp; Electronics Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Live shelf-synchronized hardware inventory ready for immediate store pickup or courier delivery.
            </p>
          </div>

          {/* Active Branch Display Pill */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="material-symbols-outlined text-[#0D47A1] text-xl">
              location_on
            </span>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Store Availability Hub</div>
              <div className="text-xs font-bold text-slate-900 font-sans">
                {selectedBranchFilter === "all" ? "All Bangladesh Hubs" : activeBranchData.name}
              </div>
            </div>
          </div>
        </div>

        {/* Category Horizontal Quick Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#0D47A1] text-white font-bold shadow-md shadow-blue-900/20"
                    : "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Filter Drawer Toggle Button */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-xs font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>{mobileFilterOpen ? "Hide Filters" : "Filter Products"}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#0D47A1] text-[10px] flex items-center justify-center font-bold font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Main Catalog Layout: Left Sticky 260px Sidebar Filters + Right Product Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sticky 260px Faceted Filter Sidebar */}
          <aside
            className={`${
              mobileFilterOpen ? "block" : "hidden"
            } lg:block w-full lg:w-[260px] lg:shrink-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-thin space-y-4`}
          >
            {/* Header & Reset */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D47A1] text-base">filter_alt</span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Faceted Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#0D47A1] text-white text-[10px] flex items-center justify-center font-mono font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Facet 1: Brand Multi-Select */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Brand ({allBrands.length})
                </span>
                {selectedBrands.length > 0 && (
                  <button
                    onClick={() => setSelectedBrands([])}
                    className="text-[10px] text-slate-400 hover:text-rose-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 text-xs pr-1 scrollbar-thin">
                {allBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-3.5 h-3.5"
                        />
                        <span className={`text-xs ${isChecked ? "font-bold text-[#0D47A1]" : ""}`}>
                          {brand}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {brandCounts[brand] || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Facet 2: Socket Architecture */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Platform Socket
                </span>
                {selectedSockets.length > 0 && (
                  <button
                    onClick={() => setSelectedSockets([])}
                    className="text-[10px] text-slate-400 hover:text-rose-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {AVAILABLE_SOCKETS.map((socket) => {
                  const isChecked = selectedSockets.includes(socket);
                  return (
                    <label
                      key={socket}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSocket(socket)}
                          className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-3.5 h-3.5"
                        />
                        <span className={`text-xs font-mono ${isChecked ? "font-bold text-[#0D47A1]" : ""}`}>
                          {socket}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {socketCounts[socket] || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Facet 3: Price Range & Quick Presets */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Price (BDT)
                </span>
                <span className="font-mono text-[11px] font-bold text-[#0D47A1]">
                  ৳{priceMax.toLocaleString()}
                </span>
              </div>

              {/* Min & Max Inputs */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Min (৳)</span>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    placeholder="0"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Max (৳)</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                    placeholder="600000"
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="600000"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0D47A1] cursor-pointer"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { label: "All", min: 0, max: 600000 },
                  { label: "< ৳30k", min: 0, max: 30000 },
                  { label: "৳30k-৳75k", min: 30000, max: 75000 },
                  { label: "৳75k-৳150k", min: 75000, max: 150000 },
                  { label: "৳150k+", min: 150000, max: 600000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setPriceMin(preset.min);
                      setPriceMax(preset.max);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                      priceMin === preset.min && priceMax === preset.max
                        ? "bg-[#0D47A1] text-white border-[#0D47A1] font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Facet 4: Stock & Physical Store Hub */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Stock &amp; Retail Branch
                </span>
                <span className="text-[10px] text-[#0D47A1] font-mono font-bold">2-HR PICKUP</span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleSwitchBranch("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                    selectedBranchFilter === "all"
                      ? "bg-[#0D47A1] text-white font-bold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>All Central Stock</span>
                  <span className="font-mono text-[10px] opacity-75">All Hubs</span>
                </button>

                {RETAIL_BRANCHES.map((branch) => (
                  <button
                    key={branch.key}
                    onClick={() => handleSwitchBranch(branch.key)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                      selectedBranchFilter === branch.key
                        ? "bg-[#0D47A1] text-white font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{branch.name.split(" ")[0]}</span>
                    <span className="font-mono text-[10px] opacity-75">{branch.location.split(",")[0]}</span>
                  </button>
                ))}
              </div>

              <label className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium text-xs">Immediate In-Stock Only</span>
              </label>
            </div>

            {/* Facet 5: Payment & Financing */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans block border-b border-slate-100 pb-2">
                Regional Payment
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={codOnly}
                    onChange={(e) => setCodOnly(e.target.checked)}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-3.5 h-3.5"
                  />
                  <div>
                    <span className="font-bold text-slate-800 text-xs">Cash on Delivery (COD)</span>
                    <p className="text-[10px] text-slate-400">Pay cash upon courier arrival</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-slate-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={emiOnly}
                    onChange={(e) => setEmiOnly(e.target.checked)}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-3.5 h-3.5"
                  />
                  <div>
                    <span className="font-bold text-slate-800 text-xs">0% Bank EMI Eligible</span>
                    <p className="text-[10px] text-slate-400">Up to 36 months interest-free</p>
                  </div>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* Search, Sorting, and Result Counter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[220px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by product name, brand, or item code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0D47A1] focus:bg-white text-slate-900 transition-colors"
                />
              </div>

              {/* Sorting, View Switcher and Count */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  <strong>{filteredProducts.length}</strong> items
                </span>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0D47A1]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>

                {/* Grid vs List View Toggle (Ryans Benchmark) */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-[#0D47A1] shadow-sm font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Grid View (4 Columns)"
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      viewMode === "list"
                        ? "bg-white text-[#0D47A1] shadow-sm font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                    title="Compact List View (Ryans Specification)"
                  >
                    <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dedicated Branch Quick Tabs Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-mono text-[11px] uppercase font-bold shrink-0">Branch Stock:</span>
              {[
                { key: "all", label: "All Hubs" },
                { key: "idb", label: "IDB Dhaka" },
                { key: "multiplan", label: "Multiplan Dhaka" },
                { key: "chittagong", label: "GEC Chittagong" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleSwitchBranch(tab.key)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                    selectedBranchFilter === tab.key
                      ? "bg-[#0D47A1] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => setCodOnly(!codOnly)}
                className={`ml-auto px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                  codOnly
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <span>🚚</span>
                <span>COD Only</span>
              </button>
            </div>

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-slate-300">
                  search_off
                </span>
                <h3 className="text-lg font-bold text-slate-800 font-sans">No products match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the maximum price, category, or branch availability selection.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              /* DENSE COMPACT LIST VIEW (Ryans Computers Benchmark) */
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const currentStock =
                    selectedBranchFilter === "all"
                      ? Object.values(product.branchStock as Record<string, number>).reduce(
                          (a, b) => a + b,
                          0
                        )
                      : (product.branchStock as Record<string, number>)[selectedBranchFilter] || 0;

                  const savings = product.regularPrice - product.price;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-[#0D47A1] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4 group"
                    >
                      {/* Left: Thumbnail & Badges */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {savings > 0 && (
                            <span className="absolute top-1 left-1 bg-[#D32F2F] text-white text-[9px] font-black px-1 rounded">
                              -৳{savings.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-bold text-[#0D47A1] uppercase">{product.brand}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">{product.sku}</span>
                            <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {currentStock > 0 ? `${currentStock} in stock` : "Transfer Available"}
                            </span>
                          </div>
                          <Link
                            href={`/product/${product.slug}`}
                            className="text-sm font-bold text-slate-900 hover:text-[#0D47A1] line-clamp-1 transition-colors block"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 truncate">
                            {product.specs.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="truncate">
                                {s.label}: <strong className="text-slate-700">{s.value}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Pricing & Action Buttons */}
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-left md:text-right">
                          <div className="text-base font-black text-slate-900">
                            ৳{product.price.toLocaleString()}
                          </div>
                          {product.regularPrice > product.price && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ৳{product.regularPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="text-[10px] text-[#0D47A1] font-mono font-semibold">
                            Monthly: ৳{product.emiPerMonth?.toLocaleString() || Math.round(product.price / 12).toLocaleString()}/mo (0% Interest)
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
                              addedProductId === product.id
                                ? "bg-emerald-600 text-white"
                                : "bg-[#0D47A1] hover:bg-[#0a387e] text-white shadow-sm"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {addedProductId === product.id ? "check" : "shopping_cart"}
                            </span>
                            <span>{addedProductId === product.id ? "Added" : "Add"}</span>
                          </button>
                          <a
                            href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                              `Hello OmniPulse BD, inquiring about ${product.name} (Item Code: ${product.sku}). In stock?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs transition-colors"
                            title="WhatsApp Specialist"
                          >
                            <span>💬</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* DENSE 4-COLUMN RETAIL PRODUCT GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const currentStock =
                    selectedBranchFilter === "all"
                      ? Object.values(product.branchStock as Record<string, number>).reduce(
                          (a, b) => a + b,
                          0
                        )
                      : (product.branchStock as Record<string, number>)[selectedBranchFilter] || 0;

                  const savings = product.regularPrice - product.price;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-[#0D47A1] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Image Preview & Badges */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Savings Tag */}
                          {savings > 0 && (
                            <div className="absolute top-2 left-2 bg-[#D32F2F] text-white px-2 py-0.5 rounded text-[10px] font-extrabold shadow">
                              SAVE ৳{savings.toLocaleString()}
                            </div>
                          )}

                          {/* Branch Inventory Pill */}
                          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200 text-[10px] flex items-center justify-between">
                            <span className="text-emerald-700 font-bold flex items-center gap-1 truncate max-w-[130px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {currentStock > 0 ? (
                                selectedBranchFilter === "all" ? (
                                  `${currentStock} in stock`
                                ) : (
                                  `In Stock @ ${activeBranchData.name.split(" ")[0]}`
                                )
                              ) : (
                                "Transfer from Central"
                              )}
                            </span>
                            <span className="font-mono text-slate-500 font-semibold text-[10px]">
                              {currentStock > 0 ? `${currentStock} pcs` : "1 Day"}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-bold uppercase text-[#0D47A1]">{product.brand}</span>
                            <span className="font-mono text-[9px]">{product.sku}</span>
                          </div>

                          <Link
                            href={`/product/${product.slug}`}
                            className="text-xs font-bold text-slate-900 hover:text-[#0D47A1] line-clamp-2 transition-colors font-sans"
                          >
                            {product.name}
                          </Link>

                          {/* Quick Specs bullets */}
                          <div className="pt-1 text-[10.5px] text-slate-500 space-y-0.5">
                            {product.specs.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="flex items-center gap-1 truncate">
                                <span className="text-slate-400">•</span>
                                <span className="truncate">{s.label}:</span>
                                <strong className="text-slate-700 truncate">{s.value}</strong>
                              </div>
                            ))}
                          </div>

                          {/* Price & EMI block */}
                          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                              <div className="text-base font-black text-slate-900 font-sans">
                                ৳{product.price.toLocaleString()}
                              </div>
                              {product.regularPrice > product.price && (
                                <div className="text-[10px] text-slate-400 line-through">
                                  ৳{product.regularPrice.toLocaleString()}
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-[9px] text-slate-400 uppercase">0% EMI</div>
                              <div className="text-[11px] font-bold text-[#0D47A1] font-mono">
                                ৳{product.emiPerMonth?.toLocaleString() || Math.round(product.price / 12).toLocaleString()}/mo
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-3.5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 active:scale-95 ${
                            addedProductId === product.id
                              ? "bg-emerald-600 text-white"
                              : "bg-[#0D47A1] hover:bg-[#0a387e] text-white shadow-sm"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {addedProductId === product.id ? "check" : "shopping_cart"}
                          </span>
                          <span>{addedProductId === product.id ? "Added" : "Add to Cart"}</span>
                        </button>

                        <a
                          href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                            `Hello OmniPulse BD, I'm inquiring about ${product.name} (SKU: ${product.sku}). Is it in stock for immediate branch pickup?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-all flex items-center justify-center gap-1 active:scale-95"
                        >
                          <span>💬</span>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
