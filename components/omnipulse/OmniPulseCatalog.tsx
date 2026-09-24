"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore, BranchKey } from "@/store/useCartStore";
import { RETAIL_BRANCHES } from "./OmniPulse3DMap";

export default function OmniPulseCatalog() {
  const { deliveryDetails, updateDeliveryDetails, addStandaloneItem } = useCartStore();
  const currentBranch = (deliveryDetails.pickupBranch as BranchKey) || "idb";

  // Filter States
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(currentBranch);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [codOnly, setCodOnly] = useState<boolean>(false);
  const [emiOnly, setEmiOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(300000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  // Extract all unique brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    HARDWARE_PRODUCTS.forEach((p) => set.add(p.brand));
    return ["all", ...Array.from(set)];
  }, []);

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
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== "all" && product.brand !== selectedBrand) {
        return false;
      }

      // Price Filter
      if (product.price > priceMax) {
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
    selectedBrand,
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
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Main Catalog Layout: Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Filters (3 cols) */}
          <aside className="lg:col-span-3 space-y-5">
            {/* 1. Branch Inventory Filter (Crucial Omnichannel Requirement) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Physical Store Filter
                </span>
                <span className="text-[10px] text-[#0D47A1] font-mono font-bold">2-HR PICKUP</span>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleSwitchBranch("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    selectedBranchFilter === "all"
                      ? "bg-[#0D47A1] text-white font-bold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>All Central Hubs</span>
                  <span className="font-mono text-[11px] opacity-75">All Stock</span>
                </button>

                {RETAIL_BRANCHES.map((branch) => (
                  <button
                    key={branch.key}
                    onClick={() => handleSwitchBranch(branch.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
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

              {/* In-stock toggle for branch */}
              <label className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                />
                <span className="font-medium">Show immediate branch stock only</span>
              </label>
            </div>

            {/* 2. Omnichannel Fast Facets (COD & 0% EMI) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans block border-b border-slate-100 pb-2.5">
                Regional Payment Facets
              </span>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer select-none p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={codOnly}
                    onChange={(e) => setCodOnly(e.target.checked)}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
                    <p className="text-[11px] text-slate-500">Pay cash upon courier arrival</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={emiOnly}
                    onChange={(e) => setEmiOnly(e.target.checked)}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-slate-800">0% Bank EMI Eligible</span>
                    <p className="text-[11px] text-slate-500">Up to 36 months interest-free</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Price Budget Slider */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Max Price Ceiling
                </span>
                <span className="font-mono text-xs font-bold text-[#0D47A1]">
                  ৳{priceMax.toLocaleString()}
                </span>
              </div>

              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0D47A1] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>৳5,000</span>
                <span>৳300,000</span>
              </div>
            </div>

            {/* 4. Brand Filter */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans block border-b border-slate-100 pb-2.5">
                Manufacturer Brands
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1 text-xs pr-1">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedBrand === b
                        ? "bg-[#E3F2FD] text-[#0D47A1] font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{b === "all" ? "All Brands" : b}</span>
                    {selectedBrand === b && <span className="text-[#0D47A1]">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Grid (9 cols) */}
          <main className="lg:col-span-9 space-y-5">
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
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedBrand("all");
                    setPriceMax(300000);
                    setSelectedBranchFilter("all");
                    setCodOnly(false);
                    setEmiOnly(false);
                    setInStockOnly(false);
                    setSearchQuery("");
                  }}
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
