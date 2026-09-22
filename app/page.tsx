"use client";

import React from "react";
import { useConceptStore } from "@/store/useConceptStore";
import VoltMatrixHome from "@/components/voltmatrix/VoltMatrixHome";
import NeonForgeHome from "@/components/neonforge/NeonForgeHome";
import AxiomHome from "@/components/axiom/AxiomHome";
import SynapseHome from "@/components/synapse/SynapseHome";
import OmniPulseHome from "@/components/omnipulse/OmniPulseHome";
import KryptonHome from "@/components/krypton/KryptonHome";

export default function HomePage() {
  const { activeConcept } = useConceptStore();

  if (activeConcept === "neonforge") {
    return <NeonForgeHome />;
  }

  if (activeConcept === "axiom") {
    return <AxiomHome />;
  }

  if (activeConcept === "synapse") {
    return <SynapseHome />;
  }

  if (activeConcept === "omnipulse") {
    return <OmniPulseHome />;
  }

  if (activeConcept === "krypton") {
    return <KryptonHome />;
  }

  return <VoltMatrixHome />;
}

