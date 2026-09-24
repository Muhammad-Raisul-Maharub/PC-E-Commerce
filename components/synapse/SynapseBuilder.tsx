"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import SynapseBoundingBox3DScene from "@/components/canvas/SynapseBoundingBox3DScene";

interface SlotConfig {
  key: BuilderSlotKey;
  label: string;
  category: HardwareProduct["category"];
  slotCode: string;
  required: boolean;
}

const BUILDER_SLOTS: SlotConfig[] = [
  { key: "cpu", label: "Processor (CPU)", category: "cpu", slotCode: "[SLOT-01]", required: true },
  { key: "motherboard", label: "Motherboard", category: "motherboard", slotCode: "[SLOT-02]", required: true },
  { key: "cooler", label: "CPU Cooler", category: "cooler", slotCode: "[SLOT-03]", required: true },
  { key: "ram", label: "System Memory (RAM)", category: "ram", slotCode: "[SLOT-04]", required: true },
  { key: "storage", label: "Fast Storage (M.2 NVMe SSD)", category: "storage", slotCode: "[SLOT-05]", required: true },
  { key: "gpu", label: "Graphics Card (GPU)", category: "gpu", slotCode: "[SLOT-06]", required: true },
  { key: "psu", label: "Power Supply Unit (PSU)", category: "psu", slotCode: "[SLOT-07]", required: true },
  { key: "chassis", label: "Computer Case", category: "chassis", slotCode: "[SLOT-08]", required: true },
];

export default function SynapseBuilder() {
  const router = useRouter();
  const { slots, setSlot, clearSlot, calculateSubtotal, getFilledSlotCount } = useBuilderStore();
  const { addStandaloneItem } = useCartStore();

  // Modal selector state
  const [activeSlotKey, setActiveSlotKey] = useState<BuilderSlotKey | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Workshop Lab Add-ons
  const [assemblyService, setAssemblyService] = useState<boolean>(true);
  const [occtTesting, setOcctTesting] = useState<boolean>(true); // +Tk 1,500
  const [osSetup, setOsSetup] = useState<boolean>(false); // +Tk 500
  const [dispatchMode, setDispatchMode] = useState<"courier" | "collect">("courier");

  // Sum raw components TDP
  const rawTdp = Object.values(slots).reduce((acc, part) => {
    if (!part) return acc;
    if (part.category === "psu" || part.category === "chassis") return acc;
    return acc + (part.tdp || 0);
  }, 0);

  // Live Wattage formula: P_system = Sum(P_parts) * 1.25
  const systemCalculatedPower = Math.round(rawTdp * 1.25);
  const selectedPsuCapacity = slots.psu?.tdp || 750;
  const powerHeadroom = Math.round(
    ((selectedPsuCapacity - systemCalculatedPower) / selectedPsuCapacity) * 100
  );
  const isPowerAdequate = selectedPsuCapacity >= systemCalculatedPower;

  // Physical Clearance Checks
  const gpuLen = slots.gpu?.cadSpecs?.lengthMm || 304;
  const caseGpuMax = slots.chassis?.cadSpecs?.maxGpuClearanceMm || 340;
  const gpuClearanceMargin = caseGpuMax - gpuLen;
  const isGpuClearanceSafe = gpuClearanceMargin >= 0;

  const coolerH = slots.cooler?.cadSpecs?.heightMm || (slots.cooler?.category === "cooler" ? 158 : 65);
  const caseCoolerMax = slots.chassis?.cadSpecs?.maxCoolerHeightMm || 165;
  const coolerClearanceMargin = caseCoolerMax - coolerH;
  const isCoolerClearanceSafe = coolerClearanceMargin >= 0;

  // Financial Subtotal
  const hardwareSubtotal = calculateSubtotal();
  const labServicesCost = (occtTesting ? 1500 : 0) + (osSetup ? 500 : 0);
  const grandTotal = hardwareSubtotal + labServicesCost;

  // Synapse Blueprint Hash
  const blueprintHash = `SYN-${slots.cpu?.brand || "SYS"}-${slots.gpu ? "GPU" : "IGPU"}-${Math.abs(grandTotal).toString(36).toUpperCase()}`;

  // Export PDF Quotation using jsPDF
  const exportPdfQuotation = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      // Header Banner
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, 210, 36, "F");

      doc.setFont("courier", "bold");
      doc.setTextColor(6, 182, 212); // Cyan
      doc.setFontSize(18);
      doc.text("SYNAPSECAD // SYSTEM SPECIFICATION QUOTATION", 15, 16);

      doc.setFontSize(9);
      doc.setTextColor(132, 204, 22); // Lime
      doc.text(`BLUEPRINT HASH: ${blueprintHash} · CAD v4.8`, 15, 24);

      doc.setTextColor(248, 250, 252);
      doc.setFontSize(8);
      doc.text(`ISSUED: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · DEPOT: IDB BHABAN DHAKA`, 15, 30);

      // System Telemetry Box
      doc.setDrawColor(51, 65, 85);
      doc.setFillColor(30, 41, 59);
      doc.rect(15, 42, 180, 22, "FD");

      doc.setFont("courier", "bold");
      doc.setFontSize(9);
      doc.setTextColor(6, 182, 212);
      doc.text("ELECTRICAL & MECHANICAL VALIDATION METRICS:", 20, 50);

      doc.setFontSize(8);
      doc.setTextColor(248, 250, 252);
      doc.text(`CALCULATED LOAD: ${rawTdp}W  |  P_SYSTEM (1.25x): ${systemCalculatedPower}W  |  PSU CAPACITY: ${selectedPsuCapacity}W  |  HEADROOM: +${powerHeadroom}%`, 20, 58);

      // Itemized Table Header
      let y = 74;
      doc.setFillColor(19, 27, 46);
      doc.rect(15, y, 180, 8, "F");
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(8);
      doc.text("SLOT", 18, y + 5.5);
      doc.text("COMPONENT DESCRIPTION", 42, y + 5.5);
      doc.text("WARRANTY", 140, y + 5.5);
      doc.text("AMOUNT (BDT)", 175, y + 5.5);

      // Table Rows
      y += 10;
      doc.setFont("courier", "normal");
      doc.setTextColor(15, 23, 42);

      BUILDER_SLOTS.forEach((slot) => {
        const item = slots[slot.key];
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(slot.slotCode, 18, y + 4);

        if (item) {
          const title = item.name.length > 50 ? item.name.substring(0, 47) + "..." : item.name;
          doc.text(title, 42, y + 4);
          doc.text(item.warranty || "3Y Official", 140, y + 4);
          doc.setFont("courier", "bold");
          doc.text(`Tk ${item.price.toLocaleString()}`, 175, y + 4);
          doc.setFont("courier", "normal");
        } else {
          doc.setTextColor(148, 163, 184);
          doc.text(`[Slot unpopulated // Optional]`, 42, y + 4);
          doc.text("—", 140, y + 4);
          doc.text("Tk 0", 175, y + 4);
        }

        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 6, 195, y + 6);
        y += 8;
      });

      // Lab Services
      if (labServicesCost > 0) {
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text("[LAB-SRV]", 18, y + 4);
        doc.text("24H OCCT Stress Testing & Lab Qualification Protocol", 42, y + 4);
        doc.text("Lab Certified", 140, y + 4);
        doc.setFont("courier", "bold");
        doc.text(`Tk ${labServicesCost.toLocaleString()}`, 175, y + 4);
        doc.setFont("courier", "normal");
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 6, 195, y + 6);
        y += 8;
      }

      // Total Box
      y += 6;
      doc.setFillColor(15, 23, 42);
      doc.rect(120, y, 75, 18, "F");
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(8);
      doc.text("NET AUTHORIZED TOTAL:", 125, y + 6);
      doc.setTextColor(132, 204, 22);
      doc.setFontSize(13);
      doc.setFont("courier", "bold");
      doc.text(`Tk ${grandTotal.toLocaleString()}`, 125, y + 13);

      // Terms
      y += 28;
      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("TERMS: Valid for 7 calendar days. Official invoice will include VAT and serial barcodes.", 15, y);
      doc.text("DEPOT: IDB Bhaban Flagship, Dhaka · HOTLINE: 017-XXXX-CAD · HTTPS://SYNAPSECAD.BD", 15, y + 4);

      doc.save(`SynapseCAD_Quotation_${blueprintHash}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy Blueprint URL to clipboard
  const copyBlueprintUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Copy Hash
  const copyHash = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(blueprintHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  // Deploy to Cart & Checkout
  const handleDeployToCart = () => {
    Object.values(slots).forEach((part) => {
      if (part) {
        addStandaloneItem(part, 1);
      }
    });
    router.push("/checkout");
  };

  return (
    <div className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased min-h-screen py-6">
      {/* Top Banner & Telemetry Bar */}
      <div className="w-full bg-[#0B1326] border-b border-[#334155] py-3 mb-6">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Link href="/" className="hover:text-[#06B6D4]">SYNAPSECAD</Link>
            <span>/</span>
            <span className="text-[#06B6D4] font-bold">3D_MASTER_WORKBENCH</span>
            <span>/</span>
            <span className="text-[#84CC16]">{blueprintHash}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyHash}
              className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[11px] font-mono text-[#06B6D4] flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">tag</span>
              <span>{copiedHash ? "HASH COPIED!" : "COPY HASH"}</span>
            </button>
            <button
              onClick={copyBlueprintUrl}
              className="px-2.5 py-1 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-[11px] font-mono text-[#84CC16] flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-xs">link</span>
              <span>{copiedUrl ? "URL COPIED!" : "COPY BLUEPRINT URL"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANE: 3D Assembly Visualizer & Live Formulas (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          {/* 3D Wireframe Scene */}
          <div className="bg-[#131B2E] border border-[#334155] p-3 shadow-2xl flex flex-col">
            <SynapseBoundingBox3DScene
              gpuLength={gpuLen}
              gpuMaxClearance={caseGpuMax}
              coolerHeight={coolerH}
              coolerMaxHeight={caseCoolerMax}
              showLabels={true}
            />
          </div>

          {/* Live Wattage Formula HUD Box */}
          <div className="bg-[#131B2E] border border-[#334155] p-4 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#06B6D4]">
                <span className="material-symbols-outlined text-sm">functions</span>
                <span>POWER DRAW &amp; SUPPLY SAFETY CALCULATOR</span>
              </div>
              <span className="text-[10px] text-[#84CC16]">P_SYS = Σ(P_PARTS) × 1.25</span>
            </div>

            <div className="bg-[#0B1326] p-3 border border-[#334155] text-xs space-y-2">
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span>Component Load Σ(P_parts):</span>
                <span className="text-[#F8FAFC] font-bold">{rawTdp} W</span>
              </div>
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span>Transient Safety Multiplier:</span>
                <span className="text-[#06B6D4] font-bold">1.25x Factor</span>
              </div>
              <div className="flex justify-between items-center text-[#94A3B8] pt-1 border-t border-[#334155]">
                <span>Calculated System Demand:</span>
                <span className="text-base text-[#06B6D4] font-bold">{systemCalculatedPower} W</span>
              </div>
              <div className="flex justify-between items-center text-[#94A3B8]">
                <span>PSU Rated Output:</span>
                <span className="text-[#F8FAFC] font-bold">{selectedPsuCapacity} W</span>
              </div>
              <div className="flex justify-between items-center text-[#94A3B8] pt-1 border-t border-[#334155]">
                <span>Power Safety Margin:</span>
                <span className={`text-xs font-bold ${isPowerAdequate ? "text-[#84CC16]" : "text-[#EF4444]"}`}>
                  {isPowerAdequate ? `+${powerHeadroom}% SAFE` : "INSUFFICIENT"}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Clearance Limits Verification Card */}
          <div className="bg-[#131B2E] border border-[#334155] p-4 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2 text-xs font-bold text-[#84CC16]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">straighten</span>
                <span>CASE SIZE &amp; FIT CHECKS</span>
              </span>
              <span className="text-[10px] text-[#94A3B8]">CAD ENVELOPE</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* GPU Length vs Chassis Max */}
              <div className="p-2.5 bg-[#0B1326] border border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#94A3B8] block">GRAPHICS CARD LENGTH VS CASE FIT</span>
                  <span className="text-[#F8FAFC]">
                    {gpuLen}mm vs {caseGpuMax}mm max
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${isGpuClearanceSafe ? "text-[#84CC16]" : "text-[#EF4444]"}`}>
                  {isGpuClearanceSafe ? `+${gpuClearanceMargin}mm CLEAR` : "COLLISION"}
                </span>
              </div>

              {/* Cooler Height vs Chassis Width */}
              <div className="p-2.5 bg-[#0B1326] border border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#94A3B8] block">CPU COOLER HEIGHT VS CASE FIT</span>
                  <span className="text-[#F8FAFC]">
                    {coolerH}mm vs {caseCoolerMax}mm max
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${isCoolerClearanceSafe ? "text-[#84CC16]" : "text-[#EF4444]"}`}>
                  {isCoolerClearanceSafe ? `+${coolerClearanceMargin}mm CLEAR` : "COLLISION"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: 8-Slot Component Architecture Rack (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header Bar */}
          <div className="bg-[#131B2E] border border-[#334155] p-4 flex items-center justify-between font-mono text-xs shadow-md">
            <div>
              <span className="text-base font-bold text-[#F8FAFC] block">
                Modular Silicon Assembly Rack
              </span>
              <span className="text-[#94A3B8] text-[11px]">
                {getFilledSlotCount()} of 8 Core Architecture Slots Configured
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#94A3B8] uppercase block">HARDWARE SUB-TOTAL</span>
              <span className="text-xl font-extrabold text-[#06B6D4]">
                Tk {hardwareSubtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 8 Component Slots */}
          <div className="flex flex-col gap-3">
            {BUILDER_SLOTS.map((slot) => {
              const part = slots[slot.key];

              return (
                <div
                  key={slot.key}
                  className={`bg-[#131B2E] border transition-all p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    part
                      ? "border-[#334155] hover:border-[#06B6D4]"
                      : "border-dashed border-[#334155] bg-[#0B1326]/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-mono text-xs text-[#06B6D4] font-bold w-20 shrink-0">
                      {slot.slotCode}
                    </span>

                    {part ? (
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-[#060E20] border border-[#334155] p-1.5 shrink-0 flex items-center justify-center">
                          <img
                            src={part.image}
                            alt={part.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono text-[#84CC16] uppercase font-bold block">
                            {slot.label}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#F8FAFC] block truncate">
                            {part.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#94A3B8]">
                            Power Draw: {part.tdp}W {part.socket ? `· Motherboard Fit: ${part.socket}` : ""} · Tk {part.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-[#475569] uppercase font-bold block">
                          {slot.label}
                        </span>
                        <span className="font-mono text-xs text-[#94A3B8]">
                          [Slot Empty // Click Select to Populate Hardware]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slot Action Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {part ? (
                      <>
                        <button
                          onClick={() => setActiveSlotKey(slot.key)}
                          className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-mono text-[#06B6D4] transition-colors"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => clearSlot(slot.key)}
                          className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#EF4444]/20 border border-[#334155] hover:border-[#EF4444] text-xs font-mono text-[#EF4444] transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveSlotKey(slot.key)}
                        className="px-4 py-2 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Select {slot.category.toUpperCase()}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Workshop Lab Bench Services */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2 text-[#06B6D4] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">engineering</span>
                <span>WORKSHOP LAB INTEGRATION SERVICES</span>
              </div>
              <span className="text-[10px] text-[#84CC16]">IDB CLEANROOM PROTOCOL</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-2.5 bg-[#0B1326] border border-[#334155] cursor-pointer hover:border-[#06B6D4] transition-colors">
                <input
                  type="checkbox"
                  checked={assemblyService}
                  onChange={(e) => setAssemblyService(e.target.checked)}
                  className="mt-0.5 accent-[#06B6D4] rounded-none"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-[#F8FAFC] font-bold block">
                      Precision Cleanroom Assembly &amp; Custom Cable Routing
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      Anti-static ESD environment assembly with thermal paste optimization.
                    </span>
                  </div>
                  <span className="text-[#84CC16] font-bold">[PROMO FREE]</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-[#0B1326] border border-[#334155] cursor-pointer hover:border-[#06B6D4] transition-colors">
                <input
                  type="checkbox"
                  checked={occtTesting}
                  onChange={(e) => setOcctTesting(e.target.checked)}
                  className="mt-0.5 accent-[#06B6D4] rounded-none"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-[#F8FAFC] font-bold block">
                      24-Hour OCCT Electrical &amp; Memory Stress-Testing
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      Zero-error qualification burn-in with thermal probe logs included in shipment.
                    </span>
                  </div>
                  <span className="text-[#06B6D4] font-bold">+Tk 1,500</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-2.5 bg-[#0B1326] border border-[#334155] cursor-pointer hover:border-[#06B6D4] transition-colors">
                <input
                  type="checkbox"
                  checked={osSetup}
                  onChange={(e) => setOsSetup(e.target.checked)}
                  className="mt-0.5 accent-[#06B6D4] rounded-none"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-[#F8FAFC] font-bold block">
                      Firmware Flashing &amp; Windows/Linux Driver Environment Setup
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      Latest UEFI BIOS, EXPO/XMP profile validation, chipset drivers installed.
                    </span>
                  </div>
                  <span className="text-[#06B6D4] font-bold">+Tk 500</span>
                </div>
              </label>
            </div>
          </div>

          {/* Master Bottom Command Dock */}
          <footer className="bg-[#0B1326] border border-[#334155] p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block">TOTAL BLUEPRINT VALUATION</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#06B6D4]">
                  Tk {grandTotal.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#84CC16]">VAT INCL.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={exportPdfQuotation}
                disabled={isExportingPdf}
                className="px-4 py-3 bg-[#1E293B] hover:bg-[#334155] border border-[#06B6D4] text-[#06B6D4] hover:text-[#F8FAFC] text-xs font-bold uppercase transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span>{isExportingPdf ? "Generating..." : "[ Export PDF Quotation ]"}</span>
              </button>

              <button
                onClick={handleDeployToCart}
                className="px-6 py-3.5 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                <span>Deploy Blueprint to Checkout</span>
              </button>
            </div>
          </footer>
        </div>
      </div>

      {/* Component Selection Modal Drawer */}
      {activeSlotKey && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-[#06B6D4] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#0B1326] border-b border-[#334155] flex items-center justify-between font-mono">
              <div>
                <span className="text-sm font-bold text-[#F8FAFC] block">
                  Select Hardware for {activeSlotKey.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  Showing qualified components pre-filtered for electrical &amp; socket compatibility.
                </span>
              </div>
              <button
                onClick={() => setActiveSlotKey(null)}
                className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Item List */}
            <div className="p-4 overflow-y-auto flex flex-col gap-2.5 font-mono text-xs">
              {HARDWARE_PRODUCTS.filter((p) => {
                const targetCat = BUILDER_SLOTS.find((s) => s.key === activeSlotKey)?.category;
                return p.category === targetCat;
              }).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSlot(activeSlotKey, item);
                    setActiveSlotKey(null);
                  }}
                  className="p-3 bg-[#0B1326] hover:bg-[#1E293B] border border-[#334155] hover:border-[#06B6D4] cursor-pointer flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-[#060E20] p-1 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#06B6D4] uppercase font-bold block">{item.brand}</span>
                      <span className="font-bold text-[#F8FAFC] block truncate">{item.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Power Draw: {item.tdp}W {item.socket ? `· Motherboard Fit: ${item.socket}` : ""} · Stock: {item.branchStock.idb} Units
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#06B6D4] block">
                      Tk {item.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#84CC16]">Select ⇢</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
