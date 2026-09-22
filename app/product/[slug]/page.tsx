"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useConceptStore } from "@/store/useConceptStore";
import { getProductBySlug, HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import VoltMatrixPDP from "@/components/voltmatrix/VoltMatrixPDP";
import NeonForgePDP from "@/components/neonforge/NeonForgePDP";
import AxiomPDP from "@/components/axiom/AxiomPDP";
import SynapsePDP from "@/components/synapse/SynapsePDP";
import OmniPulsePDP from "@/components/omnipulse/OmniPulsePDP";
import KryptonPDP from "@/components/krypton/KryptonPDP";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "amd-ryzen-7-7800x3d";
  const product = getProductBySlug(slug) || HARDWARE_PRODUCTS[0];

  const { activeConcept } = useConceptStore();

  if (activeConcept === "neonforge") {
    return <NeonForgePDP product={product} />;
  }

  if (activeConcept === "axiom") {
    return <AxiomPDP product={product} />;
  }

  if (activeConcept === "synapse") {
    return <SynapsePDP product={product} />;
  }

  if (activeConcept === "omnipulse") {
    return <OmniPulsePDP product={product} />;
  }

  if (activeConcept === "krypton") {
    return <KryptonPDP product={product} />;
  }

  return <VoltMatrixPDP product={product} />;
}

