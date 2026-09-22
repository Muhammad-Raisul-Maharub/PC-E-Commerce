"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";

// Dynamically import Three.js scene with ssr: false for optimal client rendering
const Motherboard3DScene = dynamic(
  () => import("@/components/canvas/Motherboard3DScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 bg-slate-900 rounded flex items-center justify-center text-slate-400 font-mono text-[12px]">
        Initializing WebGL Motherboard Architecture...
      </div>
    ),
  }
);

const Hardware3DViewer = dynamic(
  () => import("@/components/canvas/Hardware3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 bg-slate-900 rounded flex items-center justify-center text-slate-400 font-mono text-[12px]">
        Mounting 3D Hardware Canvas...
      </div>
    ),
  }
);

export default function VoltMatrixHome() {
  const { addStandaloneItem } = useCartStore();

  // Parametric Finder State
  const [activeFinderTab, setActiveFinderTab] = useState<string>("custom-pc");
  const [selectedSocket, setSelectedSocket] = useState<string>("AM5");
  const [selectedWorkload, setSelectedWorkload] = useState<string>("gaming");
  const [selectedBudget, setSelectedBudget] = useState<string>("150-275");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [viewerMode, setViewerMode] = useState<"motherboard" | "models">("motherboard");

  const handleAddToCart = (product: (typeof HARDWARE_PRODUCTS)[0]) => {
    addStandaloneItem(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1800);
  };

  // 4 Featured Flash Deal Products
  const flashDealIds = [
    "gpu-rtx-4070-super",
    "cpu-7800x3d",
    "ram-corsair-ddr5-32gb",
    "ssd-samsung-990-pro-1tb",
  ];
  const flashDeals = HARDWARE_PRODUCTS.filter((p) => flashDealIds.includes(p.id));

  return (
    <main className="w-full bg-[#f8f9ff]">
      {/* 1. Live Component Stock Ticker */}
      <section className="w-full bg-slate-100 border-b border-slate-200 py-1.5 px-3 overflow-hidden shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#b61722] px-2 py-0.5 rounded text-white font-mono text-[10.5px] uppercase font-bold shrink-0">
            <span className="material-symbols-outlined text-[13px] animate-pulse">radar</span>
            <span>Telemetry Ticker</span>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-6 font-mono text-[11px] text-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="text-[#b61722] font-bold">⚡ RTX 5070 12GB:</span>
                <span>Incoming 40 units at IDB Showroom</span>
                <span className="text-slate-500 font-bold">| ETA 14:00</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">AMD Ryzen 7 7800X3D:</span>
                <span className="text-[#b61722] font-bold">৳45,500</span>
                <span className="text-emerald-700 font-bold">(15 units allocated)</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">Corsair DDR5-6000 32GB:</span>
                <span className="text-[#b61722] font-bold">৳14,200</span>
                <span className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded text-[10px]">
                  Flash Stock
                </span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>2-Hour Express Dispatch Active across 41 Dhaka Postcodes</span>
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-1 text-slate-500 font-mono text-[10px] shrink-0">
            <span className="material-symbols-outlined text-[13px]">sync</span>
            <span>FEED: LIVE (30s)</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Section: 60/40 Split Architecture */}
      <section className="w-full px-3 sm:px-4 py-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 60% (7 cols on 12-col desktop) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-100 text-red-950 px-2.5 py-0.5 rounded font-mono text-[10.5px] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Official Authorized Foundry Partner
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-[10px]">
                  TIER-1 SILICON ALLOCATION
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-headline font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                  Silicon Infrastructure <br />
                  <span className="text-[#EF4444]">&amp; Smart Electronics.</span>
                </h1>
                <p className="text-[14px] text-slate-600 max-w-2xl leading-relaxed">
                  Engineered for extreme high-throughput computing, enterprise AI workstations, competitive esports rigs, and mission-critical smart automation.
                </p>
              </div>

              {/* Parametric Quick-Finder Module */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4 mt-2">
                {/* Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveFinderTab("custom-pc")}
                    className={`px-3 py-1 rounded font-mono text-[11px] uppercase whitespace-nowrap transition-colors ${
                      activeFinderTab === "custom-pc"
                        ? "bg-[#EF4444] text-white shadow-sm font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    [ ⚡ Build Custom PC ]
                  </button>
                  <button
                    onClick={() => setActiveFinderTab("workload-laptop")}
                    className={`px-3 py-1 rounded font-mono text-[11px] uppercase whitespace-nowrap transition-colors ${
                      activeFinderTab === "workload-laptop"
                        ? "bg-[#EF4444] text-white shadow-sm font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Workload Laptop
                  </button>
                  <button
                    onClick={() => setActiveFinderTab("office-pos")}
                    className={`px-3 py-1 rounded font-mono text-[11px] uppercase whitespace-nowrap transition-colors ${
                      activeFinderTab === "office-pos"
                        ? "bg-[#EF4444] text-white shadow-sm font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Office &amp; POS
                  </button>
                  <button
                    onClick={() => setActiveFinderTab("peripherals")}
                    className={`px-3 py-1 rounded font-mono text-[11px] uppercase whitespace-nowrap transition-colors ${
                      activeFinderTab === "peripherals"
                        ? "bg-[#EF4444] text-white shadow-sm font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    Pro Peripherals
                  </button>
                </div>

                {/* Parametric Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-sans text-[10.5px] uppercase text-slate-500 font-bold block">
                      Platform / Socket
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSocket}
                        onChange={(e) => setSelectedSocket(e.target.value)}
                        className="w-full h-8 px-2 bg-white text-slate-900 font-mono text-[11px] rounded border border-slate-200 focus:outline-none focus:border-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="AM5">AMD AM5 (Zen 4 / Zen 5)</option>
                        <option value="LGA1851">Intel LGA 1851 (Arrow Lake)</option>
                        <option value="LGA1700">Intel LGA 1700 (14th Gen)</option>
                        <option value="sTR5">Threadripper sTR5 Pro</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10.5px] uppercase text-slate-500 font-bold block">
                      Workload Target
                    </label>
                    <div className="relative">
                      <select
                        value={selectedWorkload}
                        onChange={(e) => setSelectedWorkload(e.target.value)}
                        className="w-full h-8 px-2 bg-white text-slate-900 font-mono text-[11px] rounded border border-slate-200 focus:outline-none focus:border-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="cuda">LLM Inference &amp; CUDA ML</option>
                        <option value="gaming">4K Esports High-FPS</option>
                        <option value="vfx">VFX / 3D Parametric CAD</option>
                        <option value="office">Office Bulk Multi-Task</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans text-[10.5px] uppercase text-slate-500 font-bold block">
                      Budget (BDT ৳)
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-full h-8 px-2 bg-white text-slate-900 font-mono text-[11px] rounded border border-slate-200 focus:outline-none focus:border-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="80-150">৳80,000 - ৳150,000</option>
                        <option value="150-275">৳150,000 - ৳275,000</option>
                        <option value="275-500">৳275,000 - ৳500,000</option>
                        <option value="500+">৳500,000+ (Ultra Workstation)</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Status Line */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-2 font-mono text-[10.5px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>100% Sockets In-Stock</span>
                    </span>
                    <span>•</span>
                    <span>Calculated TDP Range: 450W - 1000W</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#b61722] font-bold">
                    5,412 Compatible Matrix Combos
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <Link
                href="/pc-builder"
                className="flex items-center gap-2 px-5 h-10 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[13px] uppercase font-bold tracking-tight shadow transition-all active:translate-y-px"
              >
                <span className="material-symbols-outlined text-[18px]">memory</span>
                <span>[ ⚡ Configure System Matrix ]</span>
              </Link>
              <Link
                href="/catalog"
                className="flex items-center gap-2 px-4 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[12px] uppercase font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Browse 50,000+ Parts</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-500 ml-auto">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">local_shipping</span>
                <span>Doorstep Courier Insured</span>
              </div>
            </div>
          </div>

          {/* Right 40% (5 cols on 12-col desktop): 3D Viewport with Switcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded border border-slate-200">
              <span className="font-mono text-[10.5px] text-slate-600 font-bold uppercase pl-1.5">
                3D Viewport Mode:
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewerMode("motherboard")}
                  className={`px-2.5 py-1 rounded font-mono text-[10.5px] uppercase font-bold transition-all cursor-pointer ${
                    viewerMode === "motherboard"
                      ? "bg-[#EF4444] text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  Motherboard CAD
                </button>
                <button
                  onClick={() => setViewerMode("models")}
                  className={`px-2.5 py-1 rounded font-mono text-[10.5px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewerMode === "models"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <span>Hardware Models (.GLB)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </div>
            </div>

            {viewerMode === "motherboard" ? (
              <Motherboard3DScene />
            ) : (
              <Hardware3DViewer
                concept="voltmatrix"
                modelPath="/models/gpu-rtx4090.glb"
                className="w-full h-80 sm:h-[480px]"
              />
            )}
          </div>
        </div>
      </section>

      {/* 3. High-Density Flash Deals: 4-Column Parametric Card Grid */}
      <section className="w-full px-3 sm:px-4 py-8">
        <div className="max-w-[1440px] mx-auto space-y-4">
          {/* Section Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 bg-slate-100 p-4 rounded border border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[#b61722] font-mono text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>Allocated Spot Pricing &amp; High-Flow Inventory</span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
                Parametric Flash Deals &amp; Silicon Drops
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                <span>REFRESHES IN:</span>
                <span className="bg-white px-2 py-0.5 rounded text-[#b61722] font-bold border border-slate-200">
                  03:42:19
                </span>
              </div>
              <Link
                href="/catalog"
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-mono text-[11px] uppercase rounded border border-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>View Complete Inventory ({HARDWARE_PRODUCTS.length})</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {flashDeals.map((product) => {
              const savings = product.regularPrice - product.price;
              const emi = product.emiPerMonth || Math.round(product.price / 12);
              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Badges & Compare */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#EF4444] text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        Save ৳{savings.toLocaleString()}
                      </span>
                      <label className="flex items-center gap-1 font-sans text-[11px] text-slate-500 cursor-pointer">
                        <input className="accent-[#EF4444] rounded" type="checkbox" />
                        <span>Compare</span>
                      </label>
                    </div>

                    {/* Product Image */}
                    <div className="w-full h-44 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-2 overflow-hidden relative">
                      <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </Link>
                      <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded font-mono text-[9.5px] text-slate-600 border border-slate-200">
                        {product.specs[0]?.label}: {product.specs[0]?.value}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <div className="font-mono text-[10.5px] text-slate-500 uppercase font-bold">
                        {product.brand}
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-headline font-semibold text-[15px] text-slate-900 leading-snug line-clamp-2 hover:text-[#EF4444] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </div>

                    {/* Spec Chips Matrix */}
                    <div className="flex flex-wrap gap-1">
                      {product.specs.slice(0, 4).map((spec, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 font-mono text-[10px] px-1.5 py-0.5 rounded"
                        >
                          {spec.value}
                        </span>
                      ))}
                    </div>

                    {/* Stock Breakdown */}
                    <div className="bg-slate-50 p-2 rounded border border-slate-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Central Savar Hub:</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock ({product.branchStock.central})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Dhaka IDB Showroom:</span>
                        <span className="text-[#b61722] font-bold font-mono">
                          {product.branchStock.idb > 0
                            ? `In Stock (${product.branchStock.idb})`
                            : "Pre-order"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-4 space-y-2 border-t border-slate-100 mt-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="font-mono text-[20px] text-[#b61722] font-bold">
                          ৳{product.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400 line-through font-mono">
                          ৳{product.regularPrice.toLocaleString()} Regular
                        </div>
                      </div>
                      <span className="font-mono text-[10.5px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        From ৳{emi.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full h-8 rounded font-mono text-[11px] uppercase font-bold flex items-center justify-center gap-1 transition-colors ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-[#EF4444] hover:bg-[#dc2626] text-white"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {isAdded ? "check" : "shopping_bag"}
                        </span>
                        <span>{isAdded ? "Added!" : "Add To Cart"}</span>
                      </button>

                      <a
                        href={`https://wa.me/8801700000000?text=I%20am%20interested%20in%20${encodeURIComponent(
                          product.name
                        )}%20for%20BDT%20${product.price}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-300 font-mono text-[11px] uppercase font-bold rounded flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Parametric Category Showcase: Core Hardware, Office Tech & Smart Gadgets */}
      <section className="w-full px-3 sm:px-4 py-8">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10.5px] text-[#b61722] uppercase font-bold tracking-wider">
                Orthogonal Catalog Tiers
              </span>
              <h2 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
                Parametric Category Infrastructure
              </h2>
            </div>
            <div className="font-mono text-[11px] text-slate-500 hidden md:block">
              STANDARDIZED WARRANTY: 3-YEAR REPLACEMENT ON FOUNDRY LINES
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Core Silicon & Hardware */}
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-red-50 text-[#b61722] p-2 rounded">
                    <span className="material-symbols-outlined text-[24px]">developer_board</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">14,230 SKUs</span>
                </div>
                <h3 className="font-headline font-semibold text-[18px] text-slate-900">
                  Core Hardware Architecture
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Foundry processors, ATX 3.1 titanium PSUs, high-airflow server chassis, and custom water cooling circuits.
                </p>
                <div className="space-y-1.5 pt-2">
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Motherboards (AM5, LGA 1851, WRX90)</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">2,140 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Discrete GPUs (RTX 40/50 Series, Radeon)</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">1,820 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Cooling: Custom Loops &amp; 360mm AIOs</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">980 SKU</span>
                  </Link>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="w-full h-8 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[11px] uppercase text-slate-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Open Hardware Hierarchy</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Pillar 2: Commercial Office Electronics & Automation */}
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-700 p-2 rounded">
                    <span className="material-symbols-outlined text-[24px]">print</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">6,840 SKUs</span>
                </div>
                <h3 className="font-headline font-semibold text-[18px] text-slate-900">
                  Enterprise &amp; Office Automation
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  High-duty laser printers, optical biometric access gates, continuous ink tanks, and network thermal barcode POS engines.
                </p>
                <div className="space-y-1.5 pt-2">
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Heavy-Duty Commercial Laser Printers</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">540 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Biometric Attendance &amp; RF Access Gates</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">310 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">POS Thermal Receipt &amp; Barcode Systems</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">890 SKU</span>
                  </Link>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="w-full h-8 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[11px] uppercase text-slate-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View Corporate Supply Tiers</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Pillar 3: Smart Gadgets, Robotics & Audio */}
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-700 p-2 rounded">
                    <span className="material-symbols-outlined text-[24px]">watch</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 font-bold">8,910 SKUs</span>
                </div>
                <h3 className="font-headline font-semibold text-[18px] text-slate-900">
                  Pro Gadgets &amp; Smart Devices
                </h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Parametric smartwatches with ECG logging, 3-axis cinema gimbals, audiophile DACs, and studio wireless monitors.
                </p>
                <div className="space-y-1.5 pt-2">
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Precision Biometric Smartwatches</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">720 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">3-Axis Handheld Gimbals &amp; Drones</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">410 SKU</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 rounded text-[12px] transition-colors"
                  >
                    <span className="text-slate-800">Active Noise Cancelling Wireless Audio</span>
                    <span className="font-mono text-[11px] text-[#b61722] font-bold">1,120 SKU</span>
                  </Link>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/catalog"
                  className="w-full h-8 bg-slate-100 hover:bg-slate-200 rounded font-mono text-[11px] uppercase text-slate-800 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Inspect Smart Portfolio</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Physical Branch Store Locator & Live Click & Collect Hub */}
      <section className="w-full px-3 sm:px-4 py-8">
        <div className="max-w-[1440px] mx-auto bg-white p-6 rounded border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Showrooms List (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-emerald-600 font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>2-Hour Express Click &amp; Collect Network</span>
                </div>
                <h2 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
                  Direct Physical Showrooms
                </h2>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Inspect silicon die revisions, test mechanical keyboard switches, and claim zero-latency hardware pickups directly from technician-backed depots.
                </p>
              </div>

              {/* Branch List */}
              <div className="space-y-2">
                {/* Branch 1: IDB Bhaban */}
                <div className="p-3 bg-red-50/50 rounded border border-red-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-headline font-semibold text-[14px] text-slate-900">
                        Dhaka IDB Flagship Depot
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#b61722] font-bold">READY IN 30 MIN</span>
                  </div>
                  <div className="text-[11.5px] text-slate-600">
                    Shop 318-320, Level 3, IDB Bhaban, Rokeya Sarani, Agargaon, Dhaka 1207
                  </div>
                  <div className="flex items-center justify-between pt-1 font-mono text-[10.5px]">
                    <span className="text-slate-500">Hours: 10:00 AM - 8:30 PM (Weekly Off: Sun)</span>
                    <a className="text-[#b61722] font-bold hover:underline" href="tel:+8801700000001">
                      +880 1700-000001
                    </a>
                  </div>
                </div>

                {/* Branch 2: Multiplan Center */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-headline font-semibold text-[14px] text-slate-900">
                        Multiplan Center Hub
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600 font-bold">READY IN 45 MIN</span>
                  </div>
                  <div className="text-[11.5px] text-slate-600">
                    Suite 902-904, Level 9, ECS Computer City, New Elephant Road, Dhaka
                  </div>
                  <div className="flex items-center justify-between pt-1 font-mono text-[10.5px]">
                    <span className="text-slate-500">Hours: 10:30 AM - 8:30 PM (Weekly Off: Tue)</span>
                    <a className="text-[#b61722] font-bold hover:underline" href="tel:+8801700000002">
                      +880 1700-000002
                    </a>
                  </div>
                </div>

                {/* Branch 3: Chittagong GEC */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-headline font-semibold text-[14px] text-slate-900">
                        Chittagong GEC Showroom
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600 font-bold">REGIONAL DISPATCH</span>
                  </div>
                  <div className="text-[11.5px] text-slate-600">
                    Level 4, Sanmar Ocean City, GEC Circle, Nasirabad, Chittagong
                  </div>
                  <div className="flex items-center justify-between pt-1 font-mono text-[10.5px]">
                    <span className="text-slate-500">Hours: 10:00 AM - 9:00 PM (Weekly Off: Fri)</span>
                    <a className="text-[#b61722] font-bold hover:underline" href="tel:+8801700000004">
                      +880 1700-000004
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/pc-builder"
                  className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded font-mono text-[11.5px] uppercase font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#EF4444]">navigation</span>
                  <span>Reserve Component for In-Store Calibration</span>
                </Link>
              </div>
            </div>

            {/* Right: Map Container & Logistics Telemetry (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div
                className="w-full h-80 bg-cover bg-center rounded border border-slate-200 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATQfepK1SH2AkHbyJXvhYykwotpixvKGgxQyR-jLSdSzToMu2t0n1h48TczF6HKolHd2L02Hyl6Q9R_ZS6dPSexSjHm3nFTHTzT6Eny4n1G94r4MEe-HcoZBnF5M8agMiL6N4niwRU__7Y46Z1h9_JPsseDpWLzu5aYB-OgqtqbpirTg6a9_Rqpv17tKlgzbUJ_N2Tf5PIPeOK-2ENScv7F0BUfvdKxpaJthR0xNfqrq9j9q8MYQeWQA')",
                }}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="bg-white/95 backdrop-blur px-2.5 py-1 rounded font-mono text-[10.5px] text-slate-900 font-bold flex items-center gap-1 shadow">
                    <span className="material-symbols-outlined text-[14px] text-[#EF4444]">pin_drop</span>
                    HQ Depot: Agargaon IDB Hub (23.7772° N, 90.3807° E)
                  </span>
                  <span className="bg-emerald-600 text-white font-mono text-[10.5px] px-2.5 py-1 rounded font-bold shadow">
                    COURIER FLEET READY
                  </span>
                </div>

                {/* Telemetry Overlay */}
                <div className="bg-white/95 backdrop-blur p-3 rounded border border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-2 z-10">
                  <div>
                    <div className="font-mono text-[9px] text-slate-500 uppercase">Surface Transit Lead Time</div>
                    <div className="font-mono text-[13px] text-slate-900 font-bold">Dhaka Metro: 120 Mins</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-slate-500 uppercase">Chittagong Courier</div>
                    <div className="font-mono text-[13px] text-slate-900 font-bold">Overnight Direct Van</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] text-slate-500 uppercase">Transit Insurance</div>
                    <div className="font-mono text-[13px] text-emerald-600 font-bold">100% Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
