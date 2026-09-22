"use client";

import { create } from "zustand";

export type ConceptId =
  | "voltmatrix"
  | "neonforge"
  | "axiom"
  | "synapse"
  | "omnipulse"
  | "krypton";

export interface ConceptMetadata {
  id: ConceptId;
  name: string;
  tagline: string;
  badge: string;
  primaryColor: string;
  accentColor: string;
  themeClass: string;
  isAvailable: boolean;
}

export const CONCEPTS: Record<ConceptId, ConceptMetadata> = {
  voltmatrix: {
    id: "voltmatrix",
    name: "VoltMatrix",
    tagline: "Silicon Infrastructure & Technical Brutalism",
    badge: "Concept 1 // Production",
    primaryColor: "#EF4444",
    accentColor: "#0F172A",
    themeClass: "theme-voltmatrix",
    isAvailable: true,
  },
  neonforge: {
    id: "neonforge",
    name: "NeonForge",
    tagline: "Cyberpunk Liquid Cooling & Battlestation Showroom",
    badge: "Concept 2 // Active",
    primaryColor: "#00F0FF",
    accentColor: "#FF6B00",
    themeClass: "theme-neonforge",
    isAvailable: true,
  },
  axiom: {
    id: "axiom",
    name: "Axiom Pro",
    tagline: "Minimalist Enterprise Workstation & Studio Lab",
    badge: "Concept 3 // Active",
    primaryColor: "#004F32",
    accentColor: "#2563EB",
    themeClass: "theme-axiom",
    isAvailable: true,
  },
  synapse: {
    id: "synapse",
    name: "SynapseCAD",
    tagline: "Blueprint 3D Assembly Architect & Technical Workbench",
    badge: "Concept 4 // Active",
    primaryColor: "#06B6D4",
    accentColor: "#84CC16",
    themeClass: "theme-synapse",
    isAvailable: true,
  },
  omnipulse: {
    id: "omnipulse",
    name: "OmniPulse BD",
    tagline: "Omnichannel Hyper-Local Retail Hub",
    badge: "Concept 5 // Active",
    primaryColor: "#0D47A1",
    accentColor: "#FFB300",
    themeClass: "theme-omnipulse",
    isAvailable: true,
  },
  krypton: {
    id: "krypton",
    name: "Krypton Brutalist",
    tagline: "Industrial Hardware Depot & Custom Keyboard Lab",
    badge: "Concept 6 // Active",
    primaryColor: "#FACC15",
    accentColor: "#EA580C",
    themeClass: "theme-krypton",
    isAvailable: true,
  },
};

interface ConceptState {
  activeConcept: ConceptId;
  setConcept: (conceptId: ConceptId) => void;
  initializeFromEnvironment: () => void;
}

export const useConceptStore = create<ConceptState>((set, get) => ({
  activeConcept: "voltmatrix",

  setConcept: (conceptId: ConceptId) => {
    // Only switch if available (or allow preview alert)
    if (!CONCEPTS[conceptId]?.isAvailable) {
      alert(`${CONCEPTS[conceptId]?.name} is currently in design staging. Switching to NeonForge.`);
      conceptId = "neonforge";
    }

    set({ activeConcept: conceptId });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("voltmatrix_active_concept", conceptId);
      } catch (e) {
        // ignore localStorage error
      }

      // Update data-theme on root HTML
      document.documentElement.dataset.theme = conceptId;
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, "")
        .trim() + ` theme-${conceptId}`;

      // Sync URL parameter non-destructively
      const url = new URL(window.location.href);
      url.searchParams.set("concept", conceptId);
      window.history.replaceState({}, "", url.toString());
    }
  },

  initializeFromEnvironment: () => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const queryConcept = urlParams.get("concept") as ConceptId;

    let targetConcept: ConceptId = "voltmatrix";

    if (queryConcept && CONCEPTS[queryConcept]?.isAvailable) {
      targetConcept = queryConcept;
    } else {
      const stored = localStorage.getItem("voltmatrix_active_concept") as ConceptId;
      if (stored && CONCEPTS[stored]?.isAvailable) {
        targetConcept = stored;
      }
    }

    set({ activeConcept: targetConcept });
    document.documentElement.dataset.theme = targetConcept;
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, "")
      .trim() + ` theme-${targetConcept}`;
  },
}));
