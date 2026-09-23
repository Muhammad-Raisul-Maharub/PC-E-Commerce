"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import KeyboardSoundboard from "./KeyboardSoundboard";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";

// Dynamically import Three.js scene client-side only
const LiquidChassis3DScene = dynamic(
  () => import("@/components/canvas/LiquidChassis3DScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] lg:h-[600px] bg-[#0A0A0F] rounded-2xl flex flex-col items-center justify-center border border-cyan-500/30 font-mono text-cyan-400 text-xs">
        <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></span>
        INITIALIZING REAL-TIME LIQUID SHADER...
      </div>
    ),
  }
);

const Hardware3DViewer = dynamic(
  () => import("@/components/canvas/Hardware3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] lg:h-[600px] bg-[#0A0A0F] rounded-2xl flex flex-col items-center justify-center border border-cyan-500/30 font-mono text-cyan-400 text-xs">
        <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></span>
        INITIALIZING 3D HARDWARE MODEL (.GLB)...
      </div>
    ),
  }
);

interface CoolantPreset {
  id: string;
  name: string;
  hex: string;
  glowClass: string;
  description: string;
}

const COOLANT_PRESETS: CoolantPreset[] = [
  {
    id: "cyan",
    name: "Cryo Electric Cyan",
    hex: "#00F0FF",
    glowClass: "shadow-cyan-500/50 border-cyan-400",
    description: "Sub-zero optical refraction • 0.85 CP Viscosity",
  },
  {
    id: "green",
    name: "Bio-Acid Emerald",
    hex: "#10B981",
    glowClass: "shadow-emerald-500/50 border-emerald-400",
    description: "UV-reactive conductive tracer • Anti-corrosion inhibitor",
  },
  {
    id: "purple",
    name: "Ultraviolet Plasma",
    hex: "#8B5CF6",
    glowClass: "shadow-purple-500/50 border-purple-400",
    description: "Bespoke dye suspension • High thermal mass",
  },
  {
    id: "red",
    name: "Overclock Blood Red",
    hex: "#EF4444",
    glowClass: "shadow-red-500/50 border-red-400",
    description: "Combustion-grade thermal transfer • Opaque pigment",
  },
];

const BATTLESTATION_RIGS = [
  {
    id: "rig-cybernova",
    name: "PROJECT CYBERNOVA 4090",
    tagline: "Hardline Dual 360mm • Ryzen 9 9950X + RTX 4090",
    timespy: "38,420 PTS",
    deltaT: "8.4°C ΔT",
    coolant: "Cryo Cyan Hardline",
    price: 585000,
    status: "Ready for In-Store Audition",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rig-obsidian",
    name: "OBSIDIAN CRYO-RIG V2",
    tagline: "Direct Die Monoblock • Core Ultra 9 + RTX 4080 Super",
    timespy: "31,900 PTS",
    deltaT: "9.2°C ΔT",
    coolant: "Ultraviolet Plasma",
    price: 435000,
    status: "3 Units in Dhaka Lab",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rig-phantom",
    name: "NEONFORGE PHANTOM FLUX",
    tagline: "Distro-Plate G1 • Ryzen 7 7800X3D + RX 7900 XTX",
    timespy: "29,650 PTS",
    deltaT: "10.1°C ΔT",
    coolant: "Acid Green Opaque",
    price: 365000,
    status: "Custom Build (48h)",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function NeonForgeHome() {
  const [selectedCoolant, setSelectedCoolant] = useState<CoolantPreset>(COOLANT_PRESETS[0]);
  const { addStandaloneItem } = useCartStore();

  const liquidProducts = HARDWARE_PRODUCTS.filter(
    (p) => p.category === "waterblock" || p.category === "radiator" || p.category === "distro"
  ).slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-100 font-sans selection:bg-[#00F0FF] selection:text-[#0A0A0F]">
      {/* Background Cyberpunk Subtle Isometric Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

      {/* 1. Hero Stage: Pure 3D Hardware Model Viewport */}
      <section className="relative w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Narrative & Fluid Controller */}
          <div className="lg:col-span-6 space-y-6 z-10">
            {/* Telemetry Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12121A] border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="font-mono text-[11px] uppercase font-bold text-cyan-300 tracking-wider">
                CONCEPT 2 // 3D LIQUID COOLING BATTLESTATIONS
              </span>
            </div>

            <h1 className="font-chakra text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.05] text-white">
              Bespoke Fluid <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#8B5CF6]">
                Architecture.
              </span>
            </h1>

            <p className="font-jakarta text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Engineered for extreme enthusiasts and professional modders. CNC-milled acrylic distribution waterways, sub-millimeter jet fin cold plates, and certified zero-leak liquid loops handcrafted in Dhaka and Chittagong.
            </p>

            {/* Interactive Coolant Color Switcher Box */}
            <div className="p-4 rounded-xl bg-[#12121A]/90 border border-cyan-500/30 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase font-bold text-slate-300 flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-base">opacity</span>
                  Select Dynamic Coolant Formulation:
                </span>
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                  {selectedCoolant.name}
                </span>
              </div>

              {/* Color Swatch Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COOLANT_PRESETS.map((preset) => {
                  const isCurrent = selectedCoolant.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedCoolant(preset)}
                      className={`p-2 rounded-lg border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        isCurrent
                          ? "bg-[#1E1E2D] border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)] text-white"
                          : "bg-[#0A0A0F] border-slate-800 hover:border-slate-600 text-slate-400"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="font-mono text-[11px] font-bold truncate">
                        {preset.name.split(" ")[1] || preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
                <span>{selectedCoolant.description}</span>
                <span className="text-cyan-400">PUMP SYNCED</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pc-builder"
                className="px-6 py-3.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-sm uppercase tracking-wider rounded-lg shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 chamfer-button"
              >
                <span className="material-symbols-outlined text-lg">water_drop</span>
                <span>Launch Liquid Loop Architect</span>
              </Link>

              <Link
                href="/catalog"
                className="px-6 py-3.5 bg-[#12121A] hover:bg-[#1E1E2D] border border-cyan-500/40 text-white font-chakra font-semibold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Browse Modder&apos;s Armory</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Stage: Pure 3D Hardware Model Viewport (Full-bleed, always loaded) */}
          <div className="lg:col-span-6 w-full h-[540px] lg:h-[620px] rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_35px_rgba(0,240,255,0.15)]">
            <Hardware3DViewer
              concept="neonforge"
              modelPath="/models/chassis-gaming.glb"
              accentColor="#00F0FF"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 2. Interactive Mechanical Switch Soundboard Studio */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KeyboardSoundboard />
      </section>

      {/* 3. Turnkey Liquid Battlestations (Concept 2 Showroom Rigs) */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse" />
              <h2 className="font-chakra text-2xl font-bold uppercase tracking-wide text-white">
                Turnkey Artisan Battlestations
              </h2>
            </div>
            <p className="font-sans text-xs text-slate-400 mt-1">
              Fully assembled, leak-tested for 48 hours, filled with custom coolant, and benchmarked.
            </p>
          </div>

          <Link
            href="/catalog"
            className="font-mono text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold uppercase"
          >
            <span>View All Custom Rigs</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BATTLESTATION_RIGS.map((rig) => (
            <div
              key={rig.id}
              className="bg-[#12121A] border border-cyan-500/20 hover:border-cyan-400/60 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between group"
            >
              <div>
                {/* Rig Image Container */}
                <div className="w-full h-48 bg-[#0A0A0F] rounded-xl mb-4 relative overflow-hidden border border-white/5">
                  <img
                    src={rig.image}
                    alt={rig.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] uppercase font-bold backdrop-blur-md shadow-md">
                    {rig.coolant}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-chakra text-lg font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                    {rig.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-400">{rig.tagline}</p>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 my-4 p-2.5 rounded-lg bg-[#0A0A0F] border border-white/5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Time Spy Extreme</span>
                    <span className="font-bold text-[#FF6B00]">{rig.timespy}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Cooling Delta-T</span>
                    <span className="font-bold text-emerald-400">{rig.deltaT}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Turnkey Rig Price</span>
                  <span className="font-rajdhani text-2xl font-bold text-white tracking-tight">
                    ৳{rig.price.toLocaleString()}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="px-4 py-2 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Order Rig
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Modder's Armory Fast Components Showcase */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div>
            <h2 className="font-chakra text-xl font-bold uppercase tracking-wide text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400">handyman</span>
              <span>Modder&apos;s Armory // Bare Components</span>
            </h2>
            <p className="font-sans text-xs text-slate-400 mt-0.5">
              Authentic EKWB, Lian Li, and Corsair water blocks and radiators with local manufacturer warranty.
            </p>
          </div>
          <Link
            href="/catalog"
            className="font-mono text-xs text-cyan-400 font-bold uppercase hover:underline"
          >
            All Components →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liquidProducts.map((p) => (
            <div
              key={p.id}
              className="bg-[#12121A] border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group"
            >
              <div>
                <div className="w-full h-44 bg-[#0A0A0F] rounded-lg overflow-hidden mb-3 border border-white/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 uppercase font-bold">
                  {p.brand} • {p.sku}
                </span>
                <h4 className="font-chakra text-sm font-bold text-white mt-1 line-clamp-2">
                  {p.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="font-rajdhani text-xl font-bold text-cyan-300">
                  ৳{p.price.toLocaleString()}
                </span>
                <button
                  onClick={() => addStandaloneItem(p, 1)}
                  className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-mono text-[11px] font-bold uppercase rounded transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
