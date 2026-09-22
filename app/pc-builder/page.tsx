"use client";

import React, { Suspense } from "react";
import { useConceptStore } from "@/store/useConceptStore";
import VoltMatrixBuilder from "@/components/voltmatrix/VoltMatrixBuilder";
import NeonForgeBuilder from "@/components/neonforge/NeonForgeBuilder";
import AxiomBuilder from "@/components/axiom/AxiomBuilder";
import SynapseBuilder from "@/components/synapse/SynapseBuilder";
import OmniPulseBuilder from "@/components/omnipulse/OmniPulseBuilder";
import KryptonBuilder from "@/components/krypton/KryptonBuilder";

export default function PcBuilderPage() {
  const { activeConcept } = useConceptStore();

  if (activeConcept === "neonforge") {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-6 text-cyan-400 font-mono text-xs">
            <span className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
            <span>INITIALIZING NEONFORGE 3D RIG ARCHITECT...</span>
          </div>
        }
      >
        <NeonForgeBuilder />
      </Suspense>
    );
  }

  if (activeConcept === "axiom") {
    return <AxiomBuilder />;
  }

  if (activeConcept === "synapse") {
    return <SynapseBuilder />;
  }

  if (activeConcept === "omnipulse") {
    return <OmniPulseBuilder />;
  }

  if (activeConcept === "krypton") {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#EBEAE5] flex flex-col items-center justify-center p-6 text-black font-mono text-xs">
            <span className="w-6 h-6 border-2 border-black border-t-transparent animate-spin mb-3" />
            <span>[ INITIALIZING KRYPTON DUAL WORKBENCH... ]</span>
          </div>
        }
      >
        <KryptonBuilder />
      </Suspense>
    );
  }

  return <VoltMatrixBuilder />;
}

