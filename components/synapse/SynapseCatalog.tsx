"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";

export default function SynapseCatalog() {
  const { slots, setSlot } = useBuilderStore();
  const { addStandaloneItem } = useCartStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [compatibilityLock, setCompatibilityLock] = useState<boolean>(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [viewMode, setViewMode] = useState<"rows" | "grid">("rows");
  const [selectedDepot, setSelectedDepot] = useState<"all" | "idb" | "multiplan" | "chittagong">("all");

  // Determine active build constraints from useBuilderStore
  const activeSocket = slots.cpu?.socket;
  const activeRamType = slots.cpu?.ramType;
  const activeCaseGpuMax = slots.chassis?.cadSpecs?.maxGpuClearanceMm || 360;

  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter products based on CAD criteria and compatibility constraints
  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.specs.some((s) => s.value.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Form factor filter
      if (
        selectedFormFactor !== "all" &&
        product.formFactor &&
        product.formFactor !== selectedFormFactor
      ) {
        return false;
      }

      // Depot stock filter
      if (selectedDepot !== "all") {
        if (product.branchStock[selectedDepot] <= 0) return false;
      }

      // Compatibility Lock Active Filter:
      if (compatibilityLock) {
        // If CPU selected, match motherboard socket
        if (product.category === "motherboard" && activeSocket && product.socket) {
          if (product.socket !== activeSocket) return false;
        }
        // If CPU selected, match RAM type
        if (product.category === "ram" && activeRamType && product.ramType) {
          if (product.ramType !== activeRamType) return false;
        }
        // If Chassis selected, match GPU length
        if (product.category === "gpu" && product.cadSpecs?.lengthMm) {
          if (product.cadSpecs.lengthMm > activeCaseGpuMax) return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedBrands,
    maxPrice,
    selectedFormFactor,
    selectedDepot,
    compatibilityLock,
    activeSocket,
    activeRamType,
    activeCaseGpuMax,
  ]);

  const hiddenCount = HARDWARE_PRODUCTS.length - filteredProducts.length;

  const handleStageToWorkbench = (product: HardwareProduct) => {
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
  };

  return (
    <div className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased min-h-screen py-6">
      {/* Top Banner / Breadcrumb & Telemetry */}
      <div className="w-full bg-[#0B1326] border-b border-[#334155] py-3 mb-6">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Link href="/" className="hover:text-[#06B6D4] transition-colors">SYNAPSECAD</Link>
            <span>/</span>
            <span className="text-[#06B6D4] font-bold">HARDWARE_CATALOG</span>
            <span>/</span>
            <span className="text-[#84CC16]">ALL_SPECS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <span>TOTAL PRODUCTS: <strong className="text-[#F8FAFC]">{HARDWARE_PRODUCTS.length}</strong></span>
            <span>MATCHES: <strong className="text-[#06B6D4]">{filteredProducts.length}</strong></span>
            <span>DEPOT: <strong className="text-[#84CC16]">DHAKA &amp; CHITTAGONG</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Directory Workspace */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT ASIDE: CAD Filter Tree & Active Constraint Controls (3 cols) */}
        <aside className="xl:col-span-3 flex flex-col gap-6 sticky top-24 bg-[#131B2E] border border-[#334155] p-5 shadow-xl">
          {/* Compatibility Lock Switch */}
          <div className="p-3.5 bg-[#0B1326] border border-[#334155] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#84CC16] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-ping" />
                AUTO-FIT COMPATIBILITY
              </span>
              <button
                onClick={() => setCompatibilityLock(!compatibilityLock)}
                className={`w-10 h-5 p-0.5 transition-colors border ${
                  compatibilityLock
                    ? "bg-[#84CC16] border-[#84CC16]"
                    : "bg-[#1E293B] border-[#334155]"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-[#0F172A] transition-transform ${
                    compatibilityLock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-mono leading-tight">
              {compatibilityLock
                ? `Hiding parts that won't fit your selected components (${hiddenCount} hidden).`
                : "Showing all parts without size or motherboard fit restrictions."}
            </p>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase text-[#94A3B8] tracking-wider block">
              SEARCH PARTS &amp; SPECS
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by processor fit, brand, model..."
                className="w-full bg-[#0B1326] border border-[#334155] focus:border-[#06B6D4] px-3 py-2 text-xs font-mono text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Component Category Filter Tree */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-[#06B6D4] uppercase tracking-wider block border-b border-[#334155] pb-1">
              // HARDWARE CATEGORIES
            </span>
            <div className="flex flex-col gap-1 font-mono text-xs">
              {[
                { key: "all", label: "All Hardware Components" },
                { key: "cpu", label: "Processors (CPU)" },
                { key: "motherboard", label: "Motherboards" },
                { key: "gpu", label: "Graphics Cards (GPU)" },
                { key: "cooler", label: "CPU Coolers (Liquid / Air)" },
                { key: "ram", label: "System Memory (RAM)" },
                { key: "storage", label: "Solid State Drives (SSD)" },
                { key: "psu", label: "Power Supply Units (PSU)" },
                { key: "chassis", label: "Computer Cases" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 text-left transition-colors flex items-center justify-between ${
                    selectedCategory === cat.key
                      ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75">
                    {cat.key === "all"
                      ? HARDWARE_PRODUCTS.length
                      : HARDWARE_PRODUCTS.filter((p) => p.category === cat.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Capital Envelope (Price Slider BDT) */}
          <div className="space-y-2 pt-2 border-t border-[#334155]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#94A3B8] uppercase">PRICE BUDGET</span>
              <span className="text-[#06B6D4] font-bold">Tk {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#06B6D4] bg-[#0B1326] h-1.5 rounded-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#475569]">
              <span>Tk 5,000</span>
              <span>Tk 75,000</span>
              <span>Tk 150,000</span>
            </div>
          </div>

          {/* Fabricator Brand Matrix */}
          <div className="space-y-2 pt-2 border-t border-[#334155]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#94A3B8] uppercase">MANUFACTURER BRAND</span>
              <span className="text-[10px] text-[#475569]">{selectedBrands.length} SELECTED</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {["AMD", "Intel", "ASUS", "MSI", "Gigabyte", "Corsair", "Samsung", "Fractal Design"].map((brand) => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`px-2 py-1.5 border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#1E293B] border-[#06B6D4] text-[#06B6D4] font-bold"
                        : "bg-[#0B1326] border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <span>{brand}</span>
                    <span className="text-[9px]">{isSelected ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Depot Logistics Filter */}
          <div className="space-y-2 pt-2 border-t border-[#334155]">
            <span className="font-mono text-xs text-[#94A3B8] uppercase block">LOCAL STORE BRANCH</span>
            <div className="flex flex-col gap-1 font-mono text-xs">
              {[
                { key: "all", label: "All Depots Nationwide" },
                { key: "idb", label: "In Stock at IDB Dhaka" },
                { key: "multiplan", label: "Multiplan Elephant Rd" },
                { key: "chittagong", label: "Agrabad Chittagong" },
              ].map((d) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDepot(d.key as any)}
                  className={`px-2.5 py-1 text-left transition-colors flex items-center justify-between ${
                    selectedDepot === d.key
                      ? "bg-[#1E293B] text-[#84CC16] border border-[#84CC16]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] bg-[#0B1326] border border-[#334155]"
                  }`}
                >
                  <span>{d.label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedBrands([]);
              setMaxPrice(150000);
              setSelectedDepot("all");
              setCompatibilityLock(true);
            }}
            className="w-full py-2 bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] font-mono text-xs uppercase tracking-wider transition-colors border border-[#334155]"
          >
            ↺ Reset Filter Matrix
          </button>
        </aside>

        {/* RIGHT CONTENT: Fluid Parametric Hardware Matrix (9 cols) */}
        <main className="xl:col-span-9 flex flex-col gap-6">
          {/* Top Utility Header & Active Constraint Chips */}
          <div className="bg-[#131B2E] border border-[#334155] p-4 flex flex-col gap-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-lg font-bold text-[#F8FAFC]">
                    Hardware Catalog &amp; Specifications
                  </h2>
                  <span className="px-2 py-0.5 bg-[#1E293B] border border-[#84CC16] text-[#84CC16] font-mono text-xs font-bold">
                    {filteredProducts.length} Matches
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Verified for computer case dimensions, motherboard fit, and power requirements.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#0B1326] border border-[#334155] p-1 font-mono text-xs">
                <button
                  onClick={() => setViewMode("rows")}
                  className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${
                    viewMode === "rows"
                      ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">table_rows</span>
                  <span>LIST</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                  <span>GRID</span>
                </button>
              </div>
            </div>

            {/* Active Constraint Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#334155] font-mono text-xs">
              <span className="text-[#94A3B8] text-[11px]">ACTIVE CONSTRAINTS:</span>
              {compatibilityLock && (
                <span className="px-2 py-0.5 bg-[#84CC16]/10 border border-[#84CC16] text-[#84CC16] text-[10px]">
                  ✓ LOCK ACTIVE
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-2 py-0.5 bg-[#06B6D4]/10 border border-[#06B6D4] text-[#06B6D4] text-[10px]">
                  CATEGORY: {selectedCategory.toUpperCase()}
                </span>
              )}
              {selectedBrands.map((b) => (
                <span
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="px-2 py-0.5 bg-[#1E293B] border border-[#334155] hover:border-[#EF4444] text-[#F8FAFC] text-[10px] cursor-pointer"
                >
                  {b} ✕
                </span>
              ))}
              {selectedBrands.length === 0 && selectedCategory === "all" && (
                <span className="text-[#475569] text-[10px]">None (Showing All Qualified SKUs)</span>
              )}
            </div>
          </div>

          {/* Component List / Matrix Render */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-[#131B2E] border border-[#334155] space-y-3 font-mono">
              <span className="material-symbols-outlined text-4xl text-[#EF4444]">search_off</span>
              <h3 className="text-base font-bold text-[#F8FAFC]">No Component Matches Current CAD Envelope</h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                No parts match the current compatibility lock and price filters. Disable compatibility lock or adjust the capital envelope.
              </p>
              <button
                onClick={() => {
                  setCompatibilityLock(false);
                  setMaxPrice(150000);
                  setSelectedBrands([]);
                }}
                className="px-4 py-2 bg-[#06B6D4] text-[#0F172A] font-bold text-xs uppercase"
              >
                Disable Constraints
              </button>
            </div>
          ) : viewMode === "rows" ? (
            /* Schematic Rows View */
            <div className="flex flex-col gap-3">
              {filteredProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-[#131B2E] border border-[#334155] hover:border-[#06B6D4] p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                >
                  {/* Part Identity & Image */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-16 bg-[#060E20] border border-[#334155] p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#06B6D4]">
                        <span>[SYS-{p.category.toUpperCase()} // 0{idx + 1}]</span>
                        <span className="text-[#334155]">•</span>
                        <span className="text-[#94A3B8]">{p.sku}</span>
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="font-mono text-sm font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-[#94A3B8]">
                        <span>Power Draw: <strong className="text-[#F8FAFC]">{p.tdp}W</strong></span>
                        {p.socket && <span>· Motherboard Fit: <strong className="text-[#06B6D4]">{p.socket}</strong></span>}
                        {p.cadSpecs?.dimensionsMm && (
                          <span>
                            · Size:{" "}
                            <strong className="text-[#F8FAFC]">
                              {p.cadSpecs.dimensionsMm.length}×{p.cadSpecs.dimensionsMm.width}×{p.cadSpecs.dimensionsMm.height}mm
                            </strong>
                          </span>
                        )}
                        {p.warranty && <span>· {p.warranty}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Branch Stock Badges */}
                  <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] shrink-0">
                    <div className="bg-[#0B1326] px-2 py-1 border border-[#334155] text-center">
                      <span className="text-[#94A3B8] block text-[8px]">IDB DHAKA</span>
                      <span className="text-[#84CC16] font-bold">{p.branchStock.idb} Units</span>
                    </div>
                    <div className="bg-[#0B1326] px-2 py-1 border border-[#334155] text-center">
                      <span className="text-[#94A3B8] block text-[8px]">MULTPLAN</span>
                      <span className="text-[#84CC16] font-bold">{p.branchStock.multiplan} Units</span>
                    </div>
                    <div className="bg-[#0B1326] px-2 py-1 border border-[#334155] text-center">
                      <span className="text-[#94A3B8] block text-[8px]">CHITTAGONG</span>
                      <span className="text-[#84CC16] font-bold">{p.branchStock.chittagong} Units</span>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#334155]">
                    <div className="text-left md:text-right">
                      <span className="font-mono text-base font-extrabold text-[#06B6D4] block">
                        Tk {p.price.toLocaleString()}
                      </span>
                      {p.regularPrice > p.price && (
                        <span className="font-mono text-[10px] text-[#475569] line-through">
                          Tk {p.regularPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/product/${p.slug}`}
                        className="px-3 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-mono text-[#F8FAFC] transition-colors"
                        title="3D Diagnostic Clearance"
                      >
                        <span className="material-symbols-outlined text-sm leading-none">straighten</span>
                      </Link>
                      <button
                        onClick={() => handleStageToWorkbench(p)}
                        className="px-4 py-2 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-mono text-xs font-bold uppercase transition-all flex items-center gap-1"
                      >
                        <span>Stage</span>
                        <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Technical Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-[#131B2E] border border-[#334155] hover:border-[#06B6D4] flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="px-3 py-1.5 bg-[#1E293B] border-b border-[#334155] flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
                      <span>[SYS-{p.category.toUpperCase()} // 0{idx + 1}]</span>
                      <span className="text-[#84CC16]">IN STOCK</span>
                    </div>

                    <div className="relative w-full aspect-[16/10] bg-[#060E20] p-3 flex items-center justify-center border-b border-[#334155]">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div className="font-mono text-[10px] text-[#06B6D4] uppercase font-bold">
                        {p.brand} · {p.category}
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="font-mono text-sm font-bold text-[#F8FAFC] line-clamp-1 group-hover:text-[#06B6D4] transition-colors"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      {p.cadSpecs?.dimensionsMm && (
                        <div className="bg-[#0B1326] p-2 border border-[#334155] font-mono text-[10px] text-[#94A3B8] flex items-center justify-between">
                          <span>DIM:</span>
                          <span className="text-[#06B6D4] font-bold">
                            {p.cadSpecs.dimensionsMm.length}×{p.cadSpecs.dimensionsMm.width}×{p.cadSpecs.dimensionsMm.height}mm
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 pt-0">
                    <div className="pt-2.5 border-t border-[#334155] flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#06B6D4]">
                        Tk {p.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/product/${p.slug}`}
                          className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-xs font-mono"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">straighten</span>
                        </Link>
                        <button
                          onClick={() => handleStageToWorkbench(p)}
                          className="px-3 py-1 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-mono text-xs font-bold uppercase"
                        >
                          Stage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
