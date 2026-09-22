"use client";

import React from "react";
import { useConceptStore } from "@/store/useConceptStore";
import VoltMatrixCheckout from "@/components/voltmatrix/VoltMatrixCheckout";
import NeonForgeCheckout from "@/components/neonforge/NeonForgeCheckout";
import AxiomCheckout from "@/components/axiom/AxiomCheckout";
import SynapseCheckout from "@/components/synapse/SynapseCheckout";
import OmniPulseCheckout from "@/components/omnipulse/OmniPulseCheckout";
import KryptonCheckout from "@/components/krypton/KryptonCheckout";

export default function CheckoutPage() {
  const { activeConcept } = useConceptStore();

  if (activeConcept === "neonforge") {
    return <NeonForgeCheckout />;
  }

  if (activeConcept === "axiom") {
    return <AxiomCheckout />;
  }

  if (activeConcept === "synapse") {
    return <SynapseCheckout />;
  }

  if (activeConcept === "omnipulse") {
    return <OmniPulseCheckout />;
  }

  if (activeConcept === "krypton") {
    return <KryptonCheckout />;
  }

  return <VoltMatrixCheckout />;
}

