"use client";

import React from "react";
import { useConceptStore } from "@/store/useConceptStore";
import VoltMatrixCatalog from "@/components/voltmatrix/VoltMatrixCatalog";
import NeonForgeCatalog from "@/components/neonforge/NeonForgeCatalog";
import AxiomCatalog from "@/components/axiom/AxiomCatalog";
import SynapseCatalog from "@/components/synapse/SynapseCatalog";
import OmniPulseCatalog from "@/components/omnipulse/OmniPulseCatalog";
import KryptonCatalog from "@/components/krypton/KryptonCatalog";

export default function CatalogPage() {
  const { activeConcept } = useConceptStore();

  if (activeConcept === "neonforge") {
    return <NeonForgeCatalog />;
  }

  if (activeConcept === "axiom") {
    return <AxiomCatalog />;
  }

  if (activeConcept === "synapse") {
    return <SynapseCatalog />;
  }

  if (activeConcept === "omnipulse") {
    return <OmniPulseCatalog />;
  }

  if (activeConcept === "krypton") {
    return <KryptonCatalog />;
  }

  return <VoltMatrixCatalog />;
}

