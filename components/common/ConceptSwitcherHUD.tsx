"use client";

import React, { useEffect, useState } from "react";
import { useConceptStore, CONCEPTS, ConceptId } from "@/store/useConceptStore";

export default function ConceptSwitcherHUD() {
  const { activeConcept, setConcept, initializeFromEnvironment } = useConceptStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initializeFromEnvironment();
    setMounted(true);
  }, [initializeFromEnvironment]);

  if (!mounted) return null;

  const currentMeta = CONCEPTS[activeConcept] || CONCEPTS.voltmatrix;
  const isNeon = activeConcept === "neonforge";
  const isAxiom = activeConcept === "axiom";
  const isSynapse = activeConcept === "synapse";
  const isOmni = activeConcept === "omnipulse";
  const isKrypton = activeConcept === "krypton";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto">
      {/* Floating HUD Container */}
      <div
        className={`px-3 py-2 border flex items-center gap-2 transition-all ${isKrypton
            ? "bg-[#EBEAE5] border-2 border-black shadow-[4px_4px_0px_#000000] text-black"
            : isOmni
              ? "bg-[#0A2558]/95 border-[#0D47A1] shadow-[0_8px_30px_rgba(13,71,161,0.35)] text-white rounded-full"
              : isSynapse
                ? "bg-[#0F172A]/95 border-[#334155] shadow-[0_8px_30px_rgba(6,182,212,0.25)] text-[#F8FAFC] rounded-full"
                : isNeon
                  ? "bg-[#0A0A0F]/90 border-cyan-500/40 shadow-cyan-950/40 text-white rounded-full"
                  : isAxiom
                    ? "bg-white/95 border-[#E4E4E7] shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-[#18181B] rounded-full"
                    : "bg-white/95 border-slate-300 shadow-slate-900/15 text-slate-800 rounded-full"
          }`}
      >
        {/* Active Concept Pill Trigger */}
        <div className="flex items-center gap-2 px-2 border-r border-current/20">
          <span
            className={`w-2.5 h-2.5 animate-pulse ${isKrypton ? "border border-black" : "rounded-full"}`}
            style={{
              backgroundColor: currentMeta.primaryColor,
              boxShadow: isKrypton ? "none" : `0 0 10px ${currentMeta.primaryColor}`,
            }}
          />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
            {currentMeta.name}
          </span>
          <span
            className={`font-mono text-[9px] px-1.5 py-0.5 uppercase font-semibold ${isKrypton
                ? "bg-[#FACC15] text-black border border-black font-extrabold"
                : isOmni
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded"
                  : isSynapse
                    ? "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 rounded"
                    : isNeon
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded"
                      : isAxiom
                        ? "bg-emerald-100 text-[#004F32] border border-emerald-300 rounded"
                        : "bg-red-100 text-red-700 rounded"
              }`}
          >
            {activeConcept === "neonforge"
              ? "Concept 2"
              : activeConcept === "axiom"
                ? "Concept 3"
                : activeConcept === "synapse"
                  ? "Concept 4"
                  : activeConcept === "omnipulse"
                    ? "Concept 5"
                    : activeConcept === "krypton"
                      ? "Concept 6"
                      : "Concept 1"}
          </span>
        </div>

        {/* Concept Selector Pills */}
        <div className="flex items-center gap-1">
          {/* Concept 1: VoltMatrix */}
          <button
            onClick={() => setConcept("voltmatrix")}
            className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "voltmatrix"
                ? "bg-[#EF4444] text-white shadow-md shadow-red-900/30"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            title="Switch to VoltMatrix: Clean Industrial Brutalist"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span className="hidden sm:inline">VoltMatrix</span>
            <span className="sm:hidden">1</span>
          </button>

          {/* Concept 2: NeonForge */}
          <button
            onClick={() => setConcept("neonforge")}
            className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "neonforge"
                ? "bg-[#00F0FF] text-[#0A0A0F] font-extrabold shadow-md shadow-cyan-500/40"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            title="Switch to NeonForge: Cyberpunk Liquid Cooling Showroom"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="hidden sm:inline">NeonForge</span>
            <span className="sm:hidden">2</span>
          </button>

          {/* Concept 3: Axiom Pro */}
          <button
            onClick={() => setConcept("axiom")}
            className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "axiom"
                ? "bg-[#004F32] text-white font-extrabold shadow-md shadow-emerald-950/40"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            title="Switch to Axiom Pro: Minimalist Enterprise Workstation & Studio Lab"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Axiom Pro</span>
            <span className="sm:hidden">3</span>
          </button>

          {/* Concept 4: SynapseCAD */}
          <button
            onClick={() => setConcept("synapse")}
            className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "synapse"
                ? "bg-[#06B6D4] text-[#0F172A] font-extrabold shadow-md shadow-cyan-500/40"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            title="Switch to SynapseCAD: Blueprint 3D Assembly Architect"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
            <span className="hidden sm:inline">SynapseCAD</span>
            <span className="sm:hidden">4</span>
          </button>

          {/* Concept 5: OmniPulse BD */}
          <button
            onClick={() => setConcept("omnipulse")}
            className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "omnipulse"
                ? "bg-[#FFB300] text-[#0D47A1] font-extrabold shadow-md shadow-amber-500/40"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            title="Switch to OmniPulse BD: Omnichannel Hyper-Local Retail Hub"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D47A1]"></span>
            <span className="hidden sm:inline">OmniPulse</span>
            <span className="sm:hidden">5</span>
          </button>

          {/* Concept 6: Krypton Brutalist */}
          <button
            onClick={() => setConcept("krypton")}
            className={`px-2 py-1 font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 ${activeConcept === "krypton"
                ? "bg-[#FACC15] text-black font-extrabold border-2 border-black shadow-[2px_2px_0px_#000000]"
                : isKrypton
                  ? "text-black/80 hover:text-black hover:bg-black/10"
                  : isSynapse || isNeon || isOmni
                    ? "text-slate-300 hover:text-white hover:bg-white/10 rounded-full"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
              }`}
            title="Switch to Krypton Brutalist: Industrial Hardware Depot & Custom Keyboard Lab"
          >
            <span className="w-1.5 h-1.5 bg-[#FACC15] border border-black"></span>
            <span className="hidden sm:inline">Krypton</span>
            <span className="sm:hidden">6</span>
          </button>

          {/* Expand More Concepts Drawer Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-7 h-7 flex items-center justify-center font-mono text-xs transition-colors ml-1 ${isKrypton
                ? "border border-black bg-white hover:bg-black hover:text-white text-black"
                : isSynapse || isNeon || isOmni
                  ? "rounded-full hover:bg-white/20 text-white"
                  : "rounded-full hover:bg-slate-200 text-slate-600"
              }`}
            title="All 6 Concepts"
          >
            <span className="material-symbols-outlined text-sm">
              {isExpanded ? "close" : "tune"}
            </span>
          </button>
        </div>
      </div>

      {/* Expanded 6-Concept Drawer Modal / Tray */}
      {isExpanded && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[360px] sm:w-[500px] p-4 border shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-200 ${isKrypton
              ? "bg-[#EBEAE5] border-2 border-black shadow-[6px_6px_0px_#000000] text-black rounded-none"
              : isNeon
                ? "bg-[#0A0A0F]/95 border-cyan-500/30 text-white shadow-cyan-950/50 rounded-2xl"
                : "bg-white/95 border-slate-300 text-slate-900 shadow-xl rounded-2xl"
            }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-base">
                palette
              </span>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
                Multi-Concept Switcher Matrix
              </h4>
            </div>
            <span className="font-mono text-[10px] opacity-60">
              STITCH ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(CONCEPTS) as ConceptId[]).map((cid) => {
              const meta = CONCEPTS[cid];
              const isCurrent = activeConcept === cid;

              return (
                <button
                  key={cid}
                  onClick={() => {
                    setConcept(cid);
                    if (meta.isAvailable) setIsExpanded(false);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all relative overflow-hidden ${isCurrent
                      ? isSynapse
                        ? "bg-[#06B6D4]/20 border-[#06B6D4] text-[#F8FAFC] shadow-inner shadow-cyan-500/30"
                        : isNeon
                          ? "bg-cyan-950/40 border-cyan-400 text-white shadow-inner shadow-cyan-500/20"
                          : "bg-red-50 border-red-500 text-slate-900 shadow-sm"
                      : isSynapse
                        ? "bg-[#1E293B] border-[#334155] hover:border-[#06B6D4] hover:bg-[#1E293B]/80 text-[#F8FAFC]"
                        : isNeon
                          ? "bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-white/10"
                          : "bg-slate-50 border-slate-200 hover:border-slate-400 hover:bg-slate-100"
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: meta.primaryColor }}
                      />
                      <span className="font-mono text-xs font-bold">
                        {meta.name}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[8px] px-1 py-0.5 rounded font-bold uppercase ${meta.isAvailable
                          ? isNeon
                            ? "bg-cyan-400/20 text-cyan-300"
                            : "bg-emerald-100 text-emerald-700"
                          : "bg-slate-500/20 text-slate-400"
                        }`}
                    >
                      {meta.isAvailable ? "Live" : "Preview"}
                    </span>
                  </div>

                  <p className="font-sans text-[10.5px] opacity-75 line-clamp-1 leading-snug">
                    {meta.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-current/15 flex items-center justify-between font-mono text-[10px] opacity-60">
            <span>Hardware configurations & cart persist dynamically.</span>
            <span>?concept=neonforge</span>
          </div>
        </div>
      )}
    </div>
  );
}
