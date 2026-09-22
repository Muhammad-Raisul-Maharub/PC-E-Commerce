"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import SynapseBoundingBox3DScene from "@/components/canvas/SynapseBoundingBox3DScene";

export default function SynapseHome() {
  const router = useRouter();
  const { setSlot } = useBuilderStore();
  const { addStandaloneItem } = useCartStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [clonedTier, setClonedTier] = useState<string | null>(null);

  // Filter products for the showcase grid
  const filteredProducts = HARDWARE_PRODUCTS.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "cpu") return p.category === "cpu";
    if (selectedFilter === "motherboard") return p.category === "motherboard";
    if (selectedFilter === "ram") return p.category === "ram";
    if (selectedFilter === "gpu") return p.category === "gpu";
    if (selectedFilter === "cooler") return p.category === "cooler";
    if (selectedFilter === "storage") return p.category === "storage";
    return true;
  }).slice(0, 8);

  // Clone Starter Preset Schematics into unified Builder Store
  const clonePreset = (tier: "t1" | "t2" | "t3") => {
    const cpu = HARDWARE_PRODUCTS.find((p) => p.category === "cpu");
    const mobo = HARDWARE_PRODUCTS.find((p) => p.category === "motherboard");
    const ram = HARDWARE_PRODUCTS.find((p) => p.category === "ram");
    const gpu = HARDWARE_PRODUCTS.find((p) => p.category === "gpu");
    const cooler = HARDWARE_PRODUCTS.find((p) => p.category === "cooler");
    const storage = HARDWARE_PRODUCTS.find((p) => p.category === "storage");
    const psu = HARDWARE_PRODUCTS.find((p) => p.category === "psu");
    const chassis = HARDWARE_PRODUCTS.find((p) => p.category === "chassis");

    if (cpu) setSlot("cpu", cpu);
    if (mobo) setSlot("motherboard", mobo);
    if (ram) setSlot("ram", ram);
    if (gpu) setSlot("gpu", gpu);
    if (cooler) setSlot("cooler", cooler);
    if (storage) setSlot("storage", storage);
    if (psu) setSlot("psu", psu);
    if (chassis) setSlot("chassis", chassis);

    setClonedTier(tier);
    setTimeout(() => {
      router.push("/pc-builder");
    }, 600);
  };

  return (
    <div className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased min-h-screen pt-28">
      {/* 1. Live Component Inventory Ticker */}
      <section className="w-full bg-[#060E20] border-b border-[#334155] overflow-hidden">
        <div className="flex items-center px-4 md:px-8 py-2 gap-4 text-[#94A3B8] font-mono text-xs">
          <div className="flex items-center gap-1.5 shrink-0 text-[#06B6D4] font-bold">
            <span className="inline-block w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <span>DEPOT_STREAM //</span>
          </div>
          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="inline-flex gap-8 items-center animate-[marquee_28s_linear_infinite]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                IDB Bhaban Dhaka: <strong className="text-[#F8FAFC]">1,420 SKUs</strong> In Stock
              </span>
              <span className="text-[#334155]">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                Multiplan Center: <strong className="text-[#F8FAFC]">890 SKUs</strong> Available
              </span>
              <span className="text-[#334155]">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                Agrabad Chittagong: <strong className="text-[#F8FAFC]">640 SKUs</strong> Staged
              </span>
              <span className="text-[#334155]">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                Central Depot Savar: <strong className="text-[#06B6D4]">Express Dispatch Active (64 Districts COD)</strong>
              </span>
              <span className="text-[#334155]">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                Real-time RMA Telemetry: <strong className="text-[#84CC16]">0.12% Return Rate Nominal</strong>
              </span>
            </div>
          </div>
          <div className="hidden xl:flex items-center gap-2 shrink-0 text-[#94A3B8] pl-3 border-l border-[#334155]">
            <span>REFRESH:</span>
            <span className="text-[#84CC16] font-mono">1.2s</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Section: The Live System Schematic Canvas */}
      <section className="relative w-full px-4 md:px-8 py-10 bg-[#0B1326] border-b border-[#334155] overflow-hidden cad-grid-bg">
        {/* HUD Watermark Axis */}
        <div className="absolute top-4 left-8 pointer-events-none flex items-center gap-3 font-mono text-[11px] text-[#475569]">
          <span>[SYS_CANVAS_RENDER: ORTHO_V4.8]</span>
          <span>X: 002.48</span>
          <span>Y: 104.90</span>
          <span>Z: 088.11</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          {/* Left CAD Control & Telemetry Panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Header & Subtitle */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#1E293B] border border-[#06B6D4]/40 font-mono text-xs text-[#06B6D4] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#06B6D4] animate-pulse" />
                <span>CAD RULESET V12.8 ACTIVE</span>
              </div>
              <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
                Algorithmic System Architecture &amp; Component Compatibility Engine
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
                Real-time mechanical collision detection, TDP thermal envelope dissipation calculation, and bus topology validation engineered for precision workstation builds.
              </p>
            </div>

            {/* Real-Time Conflict Badge */}
            <div className="p-4 bg-[#131B2E] border-l-4 border-[#84CC16] border-y border-r border-[#334155] flex items-start gap-3">
              <div className="p-1.5 bg-[#84CC16]/10 text-[#84CC16] shrink-0">
                <span className="material-symbols-outlined text-xl leading-none">verified</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#84CC16]">COMPATIBILITY VERIFIED</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#84CC16]/20 text-[#84CC16] uppercase font-bold">Zero Interference</span>
                </div>
                <p className="font-mono text-xs text-[#94A3B8]">
                  AM5 Socket Confirmed · DDR5 JEDEC/EXPO Voltage Matched (1.35V) · PCIe Gen 5 Retimer Alignment Validated.
                </p>
              </div>
            </div>

            {/* Active Power & Headroom HUD */}
            <div className="bg-[#1E293B] border border-[#334155] p-4 flex flex-col gap-3 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#06B6D4] text-base">bolt</span>
                  <span className="font-mono text-xs font-bold text-[#F8FAFC] uppercase">Active Power &amp; Headroom Telemetry</span>
                </div>
                <span className="font-mono text-[11px] text-[#84CC16]">CALIBRATED: TRANSIENT SPIKE TOLERANT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1 font-mono text-xs">
                {/* Numerical Telemetry Readout */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#94A3B8] uppercase text-[11px]">Calculated TDP Load:</span>
                    <span className="text-base font-bold text-[#06B6D4]">420W</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#94A3B8] uppercase text-[11px]">Target PSU Margin:</span>
                    <span className="text-xs font-semibold text-[#F8FAFC]">&gt;= 650W (ATX 3.0)</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#94A3B8] uppercase text-[11px]">Headroom Reserved:</span>
                    <span className="text-xs font-bold text-[#84CC16]">+35.4% Margin</span>
                  </div>
                </div>

                {/* Segmented Gauge Visualization */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] text-[#94A3B8]">
                    <span>0W</span>
                    <span className="text-[#06B6D4] font-bold">420W [LOAD]</span>
                    <span className="text-[#84CC16]">650W [MIN]</span>
                    <span>850W</span>
                  </div>
                  {/* Segmented Bar */}
                  <div className="grid grid-cols-12 gap-1 h-3 p-0.5 bg-[#060E20] border border-[#334155]">
                    <div className="bg-[#06B6D4] col-span-2" />
                    <div className="bg-[#06B6D4] col-span-2" />
                    <div className="bg-[#06B6D4] col-span-2" />
                    <div className="bg-[#84CC16] col-span-1" />
                    <div className="bg-[#2D3449] col-span-1" />
                    <div className="bg-[#2D3449] col-span-1" />
                    <div className="bg-[#2D3449] col-span-1" />
                    <div className="bg-[#2D3449] col-span-1" />
                    <div className="bg-[#2D3449] col-span-1" />
                  </div>
                  <span className="text-[10px] text-[#94A3B8] text-right">Thermal Dissipation: Delta-T &lt; 14°C Nominal</span>
                </div>
              </div>
            </div>

            {/* Curated Starter Schematics (Quick-clone blueprint presets) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">// Curated Silicon Presets</span>
                <span className="font-mono text-[11px] text-[#06B6D4]">Instant Loadout Selection</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tier 1 Preset */}
                <div className="bg-[#131B2E] hover:bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4]/60 transition-all p-3 flex flex-col justify-between group">
                  <div>
                    <span className="font-mono text-[10px] text-[#94A3B8] block mb-0.5">[ID: T1-ESP]</span>
                    <h4 className="font-mono text-xs font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors">Tier 1: Esports 1080p</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">Ryzen 5 7600 · 16GB · RTX 4060</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#334155] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#84CC16] font-bold">Tk 62,000</span>
                    <button
                      onClick={() => clonePreset("t1")}
                      className="px-2 py-1 bg-[#1E293B] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#0F172A] border border-[#334155] hover:border-[#06B6D4] font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1"
                    >
                      <span>{clonedTier === "t1" ? "Cloned" : "Clone"}</span>
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </div>
                </div>

                {/* Tier 2 Preset */}
                <div className="bg-[#131B2E] hover:bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4]/60 transition-all p-3 flex flex-col justify-between group">
                  <div>
                    <span className="font-mono text-[10px] text-[#94A3B8] block mb-0.5">[ID: T2-QHD]</span>
                    <h4 className="font-mono text-xs font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors">Tier 2: 1440p Battlebox</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">Ryzen 7 7800X3D · 32GB · RTX 4070S</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#334155] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#84CC16] font-bold">Tk 145,000</span>
                    <button
                      onClick={() => clonePreset("t2")}
                      className="px-2 py-1 bg-[#1E293B] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#0F172A] border border-[#334155] hover:border-[#06B6D4] font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1"
                    >
                      <span>{clonedTier === "t2" ? "Cloned" : "Clone"}</span>
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </div>
                </div>

                {/* Tier 3 Preset */}
                <div className="bg-[#131B2E] hover:bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4]/60 transition-all p-3 flex flex-col justify-between group">
                  <div>
                    <span className="font-mono text-[10px] text-[#94A3B8] block mb-0.5">[ID: T3-4KW]</span>
                    <h4 className="font-mono text-xs font-bold text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors">Tier 3: 4K Workstation</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 font-mono">Core i9 14900K · 64GB · RTX 4090</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#334155] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#84CC16] font-bold">Tk 280,000</span>
                    <button
                      onClick={() => clonePreset("t3")}
                      className="px-2 py-1 bg-[#1E293B] hover:bg-[#06B6D4] text-[#06B6D4] hover:text-[#0F172A] border border-[#334155] hover:border-[#06B6D4] font-mono text-[10px] uppercase font-bold transition-all flex items-center gap-1"
                    >
                      <span>{clonedTier === "t3" ? "Cloned" : "Clone"}</span>
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pc-builder"
                className="px-6 py-3.5 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span className="material-symbols-outlined text-lg">memory</span>
                <span>[ Open Interactive CAD Workbench ]</span>
              </Link>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#1E293B] hover:bg-[#25D366]/10 border border-[#25D366]/50 hover:border-[#25D366] text-[#25D366] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                <span>Consult Systems Engineer on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Blueprint 3D Assembly Visual (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <SynapseBoundingBox3DScene
              gpuLength={304}
              gpuMaxClearance={340}
              coolerHeight={158}
              coolerMaxHeight={165}
              showLabels={true}
            />

            {/* Viewport Secondary Telemetry */}
            <div className="p-3 bg-[#131B2E] border border-[#334155] grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
              <div>
                <span className="text-[#94A3B8] block text-[9px] uppercase">AXIAL CHATTER</span>
                <span className="text-[#84CC16] font-bold">0.00 dB/A</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[9px] uppercase">CHASSIS MASS</span>
                <span className="text-[#F8FAFC] font-bold">14.65 KG</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[9px] uppercase">AIRFLOW BIAS</span>
                <span className="text-[#06B6D4] font-bold">+1.24 POSITIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Parametric Component Showcase Grid */}
      <section className="w-full px-4 md:px-8 py-12 bg-[#0F172A]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#334155] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#06B6D4] mb-1 font-mono text-xs font-bold">
              <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
              <span>// SILICON SPECIFICATION CATALOG</span>
            </div>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
              Verified Dynamic Parametric Hardware
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Pre-validated against the SynapseCAD mechanical clearance envelope and power curves.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center flex-wrap gap-1.5 font-mono text-xs">
            <span className="text-[#94A3B8] mr-2">FILTER:</span>
            {[
              { key: "all", label: "ALL" },
              { key: "cpu", label: "CPU" },
              { key: "motherboard", label: "MOBO" },
              { key: "gpu", label: "GPU" },
              { key: "ram", label: "RAM" },
              { key: "cooler", label: "COOLER" },
              { key: "storage", label: "STORAGE" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3 py-1 border transition-all text-xs font-bold ${
                  selectedFilter === f.key
                    ? "bg-[#06B6D4] text-[#0F172A] border-[#06B6D4]"
                    : "bg-[#1E293B] text-[#94A3B8] border-[#334155] hover:text-[#F8FAFC] hover:border-[#06B6D4]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Technical Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p, idx) => (
            <div
              key={p.id}
              className="bg-[#131B2E] border border-[#334155] hover:border-[#06B6D4] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Bar */}
                <div className="px-3 py-1.5 bg-[#1E293B] border-b border-[#334155] flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
                  <span>[SEC-{p.category.toUpperCase()} // 0{idx + 1}]</span>
                  <span className="text-[#84CC16] font-bold">VERIFIED FIT</span>
                </div>

                {/* Product Image */}
                <div className="relative w-full aspect-[16/10] bg-[#060E20] overflow-hidden flex items-center justify-center p-3 border-b border-[#334155]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-[#0F172A]/90 border border-[#334155] px-2 py-0.5 font-mono text-[9px] text-[#06B6D4]">
                    TDP: {p.tdp}W
                  </div>
                </div>

                {/* Specs Content */}
                <div className="p-3.5 space-y-2">
                  <div className="text-[10px] font-mono text-[#06B6D4] uppercase font-bold tracking-wider">
                    {p.brand} // {p.category.toUpperCase()}
                  </div>
                  <h3 className="font-mono text-sm font-bold text-[#F8FAFC] line-clamp-1 group-hover:text-[#06B6D4] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* CAD Millimetric Dimensions Badge */}
                  {p.cadSpecs?.dimensionsMm && (
                    <div className="bg-[#060E20] p-2 border border-[#334155] font-mono text-[10px] text-[#94A3B8] flex items-center justify-between">
                      <span>DIMENSIONS:</span>
                      <span className="text-[#06B6D4] font-bold">
                        {p.cadSpecs.dimensionsMm.length} x {p.cadSpecs.dimensionsMm.width} x {p.cadSpecs.dimensionsMm.height} mm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Price & Action Strip */}
              <div className="p-3.5 pt-0">
                <div className="pt-2.5 border-t border-[#334155] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">CASHOUT PRICE</span>
                    <span className="font-mono text-base font-extrabold text-[#06B6D4]">
                      Tk {p.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/product/${p.slug}`}
                      className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-mono text-[#F8FAFC] transition-colors"
                      title="Inspect 3D Clearance"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">straighten</span>
                    </Link>
                    <button
                      onClick={() => {
                        addStandaloneItem(p, 1);
                      }}
                      className="px-3 py-1.5 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-mono text-xs font-bold uppercase transition-all"
                    >
                      Stage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Full Directory CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1E293B] hover:bg-[#334155] border border-[#06B6D4] text-[#06B6D4] hover:text-[#F8FAFC] font-mono text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>[ Browse Full Parametric Component Directory ({HARDWARE_PRODUCTS.length} SKUs) ]</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
