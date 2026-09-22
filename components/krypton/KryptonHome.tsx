"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  KRYPTON_MAKER_ASSET_URLS, 
  KRYPTON_MAKER_PRODUCTS, 
  KryptonMakerProduct,
  toHardwareProduct
} from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";

const Hardware3DViewer = dynamic(
  () => import("@/components/canvas/Hardware3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 bg-black border-2 border-black flex items-center justify-center font-mono text-[#FACC15] text-xs">
        INITIALIZING 3D HARDWARE MODEL (.GLB)...
      </div>
    ),
  }
);

export default function KryptonHome() {
  const { addStandaloneItem } = useCartStore();
  const [activeLabMode, setActiveLabMode] = useState<"pc" | "keyboard" | "iot">("keyboard");
  const [switchType, setSwitchType] = useState<"clicky" | "tactile" | "linear">("clicky");
  const [rigViewMode, setRigViewMode] = useState<"2d" | "3d">("2d");
  const [isDepressed, setIsDepressed] = useState(false);
  const [actuationCount, setActuationCount] = useState(0);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Audio synthesis for mechanical switch actuation
  const playSwitchSound = (type: "clicky" | "tactile" | "linear") => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Sharp click impulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      if (type === "clicky") {
        osc.type = "square";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else if (type === "tactile") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      } else {
        // linear thock
        osc.type = "triangle";
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      // Ignore audio failure if restricted by browser autoplay policy
    }
  };

  const handleSwitchClick = () => {
    setIsDepressed(true);
    setActuationCount((prev) => prev + 1);
    playSwitchSound(switchType);
    setTimeout(() => {
      setIsDepressed(false);
    }, 120);
  };

  const handleAddToCart = (product: KryptonMakerProduct) => {
    addStandaloneItem(toHardwareProduct(product), 1);
    setAddedToast(`BIN DISPATCH: ${product.name} ADDED`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const featuredParts = KRYPTON_MAKER_PRODUCTS.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#EBEAE5] text-[#1E1E24] font-sans antialiased pb-24 selection:bg-[#FACC15] selection:text-black">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#FACC15] text-black border-2 border-black px-4 py-2.5 font-mono text-xs font-bold shadow-[4px_4px_0px_#000000] animate-in fade-in slide-in-from-top-2">
          [ {addedToast} ]
        </div>
      )}

      {/* Industrial Machine Ticker Strip */}
      <div className="bg-black text-[#FACC15] font-mono text-[11px] font-bold uppercase py-2 border-b-2 border-black overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee tracking-widest">
          ⚡ KRYPTON INDUSTRIAL DEPOT // ISO-9001 TEST RIGS // DIRECT WHATSAPP ENGINEERING HOTLINE (+880 1711-KRYPTON) // 64 DISTRICTS COD DISPATCH // REAL-TIME STOCK BINS // CUSTOM KEYBOARD FORGE // HIGH-CURRENT IoT LAB // ⚡ KRYPTON INDUSTRIAL DEPOT // ISO-9001 TEST RIGS // DIRECT WHATSAPP ENGINEERING HOTLINE
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Industrial Manifesto & Lab Mode Switcher (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[11px]">
                <span className="bg-black text-[#FACC15] px-2 py-0.5 font-bold uppercase tracking-wider">
                  DEPOT CODE: KRP-BD-06
                </span>
                <span className="bg-[#EBEAE5] text-black border border-black px-2 py-0.5 font-bold uppercase">
                  CALIBRATION CERTIFIED
                </span>
                <span className="bg-[#25D366] text-black border border-black px-2 py-0.5 font-bold uppercase">
                  ONLINE TELEMETRY ACTIVE
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-black leading-none mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                INDUSTRIAL HARDWARE DEPOT &amp; KEYBOARD FORGE
              </h1>

              <p className="font-sans text-base sm:text-lg text-[#1E1E24] leading-relaxed mb-6 font-medium">
                Direct component sourcing for mechanical engineers, custom keyboard modders, and high-performance PC builders. Uncompromising utilitarian design, DIN-standard specs, and live inventory bins across Dhaka and Chattogram.
              </p>

              {/* Lab Mode Selector Strip */}
              <div className="mb-6">
                <div className="font-mono text-xs font-bold uppercase tracking-wider mb-2 text-slate-700">
                  // SELECT WORKBENCH LABORATORY DOMAIN:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActiveLabMode("keyboard")}
                    className={`py-2.5 px-3 border-2 border-black font-mono text-xs font-bold uppercase transition-all ${
                      activeLabMode === "keyboard"
                        ? "bg-[#FACC15] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-[#EBEAE5] text-black hover:bg-white"
                    }`}
                  >
                    01 // KEYBOARD FORGE
                  </button>
                  <button
                    onClick={() => setActiveLabMode("pc")}
                    className={`py-2.5 px-3 border-2 border-black font-mono text-xs font-bold uppercase transition-all ${
                      activeLabMode === "pc"
                        ? "bg-[#FACC15] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-[#EBEAE5] text-black hover:bg-white"
                    }`}
                  >
                    02 // PC ASSEMBLY
                  </button>
                  <button
                    onClick={() => setActiveLabMode("iot")}
                    className={`py-2.5 px-3 border-2 border-black font-mono text-xs font-bold uppercase transition-all ${
                      activeLabMode === "iot"
                        ? "bg-[#FACC15] text-black shadow-[3px_3px_0px_#000000] translate-x-[-1px] translate-y-[-1px]"
                        : "bg-[#EBEAE5] text-black hover:bg-white"
                    }`}
                  >
                    03 // IoT &amp; IC LAB
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Action Row */}
            <div className="pt-4 border-t-2 border-black flex flex-wrap items-center gap-3">
              <Link
                href="/catalog"
                className="bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black px-6 py-3 font-mono text-sm font-extrabold uppercase shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2"
              >
                <span>OPEN COMPONENT BINS</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                href="/pc-builder"
                className="bg-black hover:bg-[#1E1E24] text-white border-2 border-black px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-2"
              >
                <span>DUAL WORKBENCH</span>
                <span className="material-symbols-outlined text-base">build</span>
              </Link>
              <a
                href="https://wa.me/8801711000000?text=Hello%20Krypton%20Engineering%2C%20I%20need%20custom%20hardware%20advice"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#22c35e] text-black border-2 border-black px-4 py-3 font-mono text-sm font-extrabold uppercase shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-1.5 ml-auto"
                title="Direct WhatsApp Engineering Hotline"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>WHATSAPP SALES</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Mechanical Switch Calibration Rig (5 cols) */}
          <div className="lg:col-span-5 bg-[#1E1E24] text-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-white/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#FACC15]"></span>
                  <span className="font-mono text-xs font-bold uppercase text-[#FACC15] tracking-wider">
                    TEST RIG // {rigViewMode === "2d" ? "PHYSICS SWITCH BENCH" : "3D HARDWARE VIEWER"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRigViewMode("2d")}
                    className={`px-2 py-0.5 border font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      rigViewMode === "2d"
                        ? "bg-[#FACC15] text-black border-[#FACC15]"
                        : "bg-black/60 text-slate-400 border-white/20 hover:text-white"
                    }`}
                  >
                    2D Rig
                  </button>
                  <button
                    onClick={() => setRigViewMode("3d")}
                    className={`px-2 py-0.5 border font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                      rigViewMode === "3d"
                        ? "bg-[#FACC15] text-black border-[#FACC15]"
                        : "bg-black/60 text-slate-400 border-white/20 hover:text-white"
                    }`}
                  >
                    <span>3D .GLB</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </button>
                </div>
              </div>

              {rigViewMode === "3d" ? (
                <div className="mb-4">
                  <Hardware3DViewer
                    concept="krypton"
                    modelPath="/models/switch-cherry-mx.glb"
                    className="w-full h-80"
                  />
                </div>
              ) : (
                <>
                  {/* Switch Sound / Type Selector */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {(["clicky", "tactile", "linear"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSwitchType(type)}
                        className={`py-1.5 border border-white/30 font-mono text-[11px] font-bold uppercase transition-all ${
                          switchType === type
                            ? "bg-[#FACC15] text-black border-[#FACC15] font-extrabold"
                            : "bg-white/10 text-slate-300 hover:bg-white/20"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Physical Switch Graphic with Mechanical Depression Physics */}
                  <div className="relative h-64 bg-[#121216] border-2 border-black flex flex-col items-center justify-center p-4 mb-4 select-none">
                    {/* Background Spec Overlay */}
                    <div className="absolute top-2 left-3 font-mono text-[10px] text-slate-500">
                      PROFILE: MX-5PIN // TRAVEL: 4.0MM
                    </div>
                    <div className="absolute top-2 right-3 font-mono text-[10px] text-[#25D366]">
                      {switchType === "clicky" ? "60cN SPRING" : switchType === "tactile" ? "62cN PROGRESSIVE" : "55cN LINEAR"}
                    </div>

                    {/* The Interactive Switch Button Mechanism */}
                    <div className="flex flex-col items-center">
                      {/* Stem (Top Moving Part) */}
                      <div
                        onClick={handleSwitchClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSwitchClick(); }}
                        className={`w-28 h-24 border-4 border-black cursor-pointer flex flex-col items-center justify-center transition-all duration-75 select-none ${
                          switchType === "clicky"
                            ? "bg-[#0284C7] shadow-[0_8px_0_#0369A1]"
                            : switchType === "tactile"
                              ? "bg-[#7C3AED] shadow-[0_8px_0_#5B21B6]"
                              : "bg-[#DC2626] shadow-[0_8px_0_#991B1B]"
                        } ${
                          isDepressed
                            ? "translate-y-2 shadow-none"
                            : "hover:brightness-110 active:translate-y-2 active:shadow-none"
                        }`}
                        title="Click or press Space to test switch depression and acoustic feedback"
                      >
                        {/* Stem Cross + */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <div className="absolute w-7 h-2 bg-white/40 border border-black/40"></div>
                          <div className="absolute h-7 w-2 bg-white/40 border border-black/40"></div>
                        </div>
                        <span className="font-mono text-[10px] font-extrabold text-white mt-1 uppercase tracking-wider">
                          {isDepressed ? "[ BOTTOMED ]" : "[ CLICK ME ]"}
                        </span>
                      </div>

                      {/* Switch Base Housing */}
                      <div className="w-36 h-10 bg-[#2A2A32] border-4 border-black mt-1 flex items-center justify-between px-3 text-[9px] font-mono text-slate-400">
                        <span>PA66 BASE</span>
                        <span className="text-[#FACC15]">5-PIN GOLD LEAF</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2 font-mono text-[10px] text-slate-400 text-center">
                      CLICK TO TRIGGER AUDIO CLICK TEST (SYNTHESIZED WEB AUDIO API)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Telemetry Readout Table */}
            <div className="border border-white/20 p-2.5 font-mono text-[11px] bg-black/40">
              <div className="flex justify-between py-0.5 border-b border-white/10">
                <span className="text-slate-400">OPERATING FORCE:</span>
                <span className="text-[#FACC15] font-bold">
                  {switchType === "clicky" ? "50 gf ± 10" : switchType === "tactile" ? "62 gf ± 5" : "55 gf ± 5"}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/10">
                <span className="text-slate-400">PRE-TRAVEL:</span>
                <span className="text-white">2.0 mm</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">LIFESPAN:</span>
                <span className="text-[#25D366] font-bold">100,000,000 CYCLES</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Component Bins & Inventory Strip */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-black mb-6">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FACC15] border border-black"></span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black" style={{ fontFamily: 'Syne, sans-serif' }}>
              STOCK BINS // DISPATCH READY HARDWARE
            </h2>
          </div>
          <Link
            href="/catalog"
            className="font-mono text-xs font-bold uppercase underline hover:text-[#EA580C] flex items-center gap-1"
          >
            <span>VIEW ALL 42+ BINS IN DIRECTORY</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* 3-Column Brutalist Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredParts.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-black font-mono text-[10px]">
                  <span className="bg-[#EBEAE5] text-black px-1.5 py-0.5 font-bold border border-black">
                    {item.stockBinCode}
                  </span>
                  <span className="text-slate-500 font-bold">
                    SKU: {item.sku}
                  </span>
                  <span className="text-[#059669] font-bold">
                    ● {item.status.replace("_", " ")}
                  </span>
                </div>

                {/* Product Image Frame */}
                <div className="w-full h-44 bg-[#F4F4F0] border-2 border-black mb-4 relative overflow-hidden flex items-center justify-center p-2 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black text-[#FACC15] font-mono text-[10px] font-bold px-2 py-0.5">
                    {item.brand}
                  </div>
                </div>

                {/* Product Nomenclature & Domain */}
                <div className="font-mono text-[11px] text-[#EA580C] font-bold uppercase mb-1">
                  // {item.domain.toUpperCase()} • {item.category.toUpperCase()}
                </div>
                <h3 className="font-heading font-extrabold text-lg uppercase text-black leading-snug mb-2 line-clamp-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {item.name}
                </h3>
                <p className="font-sans text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Spec Matrix */}
                <div className="bg-[#EBEAE5] border border-black p-2 font-mono text-[11px] mb-4 space-y-1">
                  {item.specs.switchType && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">SWITCH TYPE:</span>
                      <span className="font-bold text-black">{item.specs.switchType}</span>
                    </div>
                  )}
                  {item.specs.pins && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">MOUNT PIN:</span>
                      <span className="font-bold text-black">{item.specs.pins}</span>
                    </div>
                  )}
                  {item.specs.actuationForceGf && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">FORCE:</span>
                      <span className="font-bold text-black">{item.specs.actuationForceGf} gf</span>
                    </div>
                  )}
                  {item.specs.formFactor && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">PROFILE:</span>
                      <span className="font-bold text-black">{item.specs.formFactor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t-2 border-black flex items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] text-slate-400 line-through">
                    ৳ {item.regularPrice.toLocaleString()}
                  </div>
                  <div className="font-mono text-xl font-extrabold text-black">
                    ৳ {item.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${item.slug}`}
                    className="p-2 border border-black bg-[#EBEAE5] hover:bg-white text-black font-mono text-xs font-bold"
                    title="View Technical Pinout & KiCad Spec"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black px-3.5 py-2 font-mono text-xs font-extrabold uppercase shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    <span>DISPATCH</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Depot Telemetry Strip */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#1E1E24] text-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b-2 border-white/20 mb-6 gap-3">
            <div>
              <div className="font-mono text-xs text-[#FACC15] font-bold uppercase">
                // REGIONAL PHYSICAL WAREHOUSE MATRIX
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                DIRECT COUNTER PICKUP &amp; BENCHTOP CALIBRATION
              </h3>
            </div>
            <div className="bg-black border border-white/20 px-3 py-1.5 font-mono text-xs text-[#25D366] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
              <span>ALL 4 LOCATIONS ACCEPTING CASH / CARDS / BKASH</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121216] border border-white/20 p-4 font-mono">
              <div className="text-[#FACC15] text-xs font-bold mb-1">01 // IDB BHABAN (FLAGSHIP)</div>
              <div className="text-white text-sm font-bold mb-1">Agargaon, Dhaka</div>
              <div className="text-slate-400 text-xs mb-2">Level 3, Shop 312-314</div>
              <div className="text-[11px] text-[#25D366]">HOTSWAP TEST BENCH: ACTIVE</div>
            </div>

            <div className="bg-[#121216] border border-white/20 p-4 font-mono">
              <div className="text-[#FACC15] text-xs font-bold mb-1">02 // MULTIPLAN CENTER</div>
              <div className="text-white text-sm font-bold mb-1">Elephant Road, Dhaka</div>
              <div className="text-slate-400 text-xs mb-2">Level 9, Suite 902</div>
              <div className="text-[11px] text-[#25D366]">LUBE STATION: AVAILABLE</div>
            </div>

            <div className="bg-[#121216] border border-white/20 p-4 font-mono">
              <div className="text-[#FACC15] text-xs font-bold mb-1">03 // MOTIJHEEL HQ</div>
              <div className="text-white text-sm font-bold mb-1">Corporate Depot, Dhaka</div>
              <div className="text-slate-400 text-xs mb-2">Pranti Bhaban, Level 5</div>
              <div className="text-[11px] text-[#25D366]">ENTERPRISE &amp; B2B BULK</div>
            </div>

            <div className="bg-[#121216] border border-white/20 p-4 font-mono">
              <div className="text-[#FACC15] text-xs font-bold mb-1">04 // GEC SANMAR DEPOT</div>
              <div className="text-white text-sm font-bold mb-1">Chittagong Coastal Hub</div>
              <div className="text-slate-400 text-xs mb-2">Sanmar Ocean City, Level 4</div>
              <div className="text-[11px] text-[#25D366]">EXPRESS COURIER ROUTE</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
