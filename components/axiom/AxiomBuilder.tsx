"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import jsPDF from "jspdf";

export default function AxiomBuilder() {
  const {
    slots,
    setSlot,
    clearSlot,
    calculateSubtotal,
    getFilledSlotCount,
  } = useBuilderStore();

  const { addStandaloneItem } = useCartStore();

  // Enterprise Services State
  const [aidaBurnIn, setAidaBurnIn] = useState(true); // +৳3,000
  const [cleanRoomAssembly, setCleanRoomAssembly] = useState(true); // +৳2,000
  const [ipmiSetup, setIpmiSetup] = useState(false); // +৳5,000
  const [companyName, setCompanyName] = useState("");
  const [activeSelectorSlot, setActiveSelectorSlot] = useState<BuilderSlotKey | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Calculate Extra Services Total
  const servicesTotal =
    (aidaBurnIn ? 3000 : 0) +
    (cleanRoomAssembly ? 2000 : 0) +
    (ipmiSetup ? 5000 : 0);

  const subtotal = calculateSubtotal();
  const grandTotal = subtotal + servicesTotal;

  // PCIe 5.0 Lane Budget Calculations
  const isThreadripperPlatform =
    slots.cpu?.socket === "sTR5" || slots.motherboard?.socket === "sTR5";
  const totalPcieBudget = isThreadripperPlatform ? 128 : 28;

  let allocatedLanes = 0;
  if (slots.gpu) allocatedLanes += slots.gpu.pcieLanes || 16;
  if (slots.storage) allocatedLanes += 4;
  if (slots.peripherals) allocatedLanes += 8;

  const remainingLanes = Math.max(0, totalPcieBudget - allocatedLanes);

  // ECC Verification Rule
  const isEccMismatch =
    isThreadripperPlatform && slots.ram && !slots.ram.eccSupport;

  // Thermal Budget Calculation
  let totalTdp = 0;
  Object.values(slots).forEach((prod) => {
    if (prod) totalTdp += prod.tdp || 0;
  });

  const slotDefinitions: { key: BuilderSlotKey; label: string; icon: string; category: string }[] = [
    { key: "cpu", label: "01 // Compute Engine (CPU)", icon: "memory", category: "cpu" },
    { key: "motherboard", label: "02 // System Bus Fabric (Motherboard)", icon: "developer_board", category: "motherboard" },
    { key: "cooler", label: "03 // Industrial Thermal Cooler", icon: "ac_unit", category: "cooler" },
    { key: "ram", label: "04 // Registered ECC Memory Array", icon: "view_column", category: "ram" },
    { key: "gpu", label: "05 // Parallel Accelerator / GPU", icon: "sports_esports", category: "gpu" },
    { key: "storage", label: "06 // Enterprise U.3 / NVMe SSD", icon: "storage", category: "storage" },
    { key: "psu", label: "07 // Redundant Power Supply (PSU)", icon: "electric_bolt", category: "psu" },
    { key: "chassis", label: "08 // 4U Workstation Chassis", icon: "dns", category: "chassis" },
  ];

  // Quick Load Enterprise Flagship Preset
  const handleLoadEnterprisePreset = () => {
    const trCpu = HARDWARE_PRODUCTS.find((p) => p.id === "cpu-threadripper-7995wx");
    const wrxMb = HARDWARE_PRODUCTS.find((p) => p.id === "mb-asus-wrx90e-sage");
    const rtxGpu = HARDWARE_PRODUCTS.find((p) => p.id === "gpu-rtx-6000-ada");
    const eccRam = HARDWARE_PRODUCTS.find((p) => p.id === "ram-kingston-ecc-128gb");
    const micronNvme = HARDWARE_PRODUCTS.find((p) => p.id === "storage-micron-9400-pro");
    const chassis = HARDWARE_PRODUCTS.find((p) => p.id === "chassis-axiom-r9600-4u");
    const cooler = HARDWARE_PRODUCTS.find((p) => p.category === "cooler") || HARDWARE_PRODUCTS[2];
    const psu = HARDWARE_PRODUCTS.find((p) => p.category === "psu") || HARDWARE_PRODUCTS[5];

    if (trCpu) setSlot("cpu", trCpu);
    if (wrxMb) setSlot("motherboard", wrxMb);
    if (rtxGpu) setSlot("gpu", rtxGpu);
    if (eccRam) setSlot("ram", eccRam);
    if (micronNvme) setSlot("storage", micronNvme);
    if (chassis) setSlot("chassis", chassis);
    if (cooler) setSlot("cooler", cooler);
    if (psu) setSlot("psu", psu);
  };

  // Generate Official Pro-Forma Tax Quotation (PDF)
  const handleGenerateProFormaPdf = () => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const quoteNumber = `AXM-PQ-${Math.floor(100000 + Math.random() * 900000)}`;
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Header Banner (Basalt Charcoal #18181B)
      doc.setFillColor(24, 24, 27);
      doc.rect(0, 0, 210, 38, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AXIOM PRO // OFFICIAL PRO-FORMA TAX QUOTATION", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(173, 241, 201);
      doc.text("MUSHAK-6.3 VAT REGISTERED • ISO/IEC 27001 AUDITED ENTERPRISE SYSTEMS", 14, 26);
      doc.text("Axiom Pro Systems Ltd. • 42 Dilkusha C/A, Motijheel, Dhaka-1000 • BIN: 002918273-0101", 14, 32);

      // Quote Metadata Box
      doc.setTextColor(24, 24, 27);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Quotation ID: ${quoteNumber}`, 14, 48);
      doc.text(`Date Issued: ${currentDate}`, 120, 48);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(82, 82, 91);
      doc.text(`Prepared For: ${companyName.trim() || "Corporate Client Enterprise Dept."}`, 14, 55);
      doc.text("Quotation Validity: 14 Business Days", 120, 55);

      doc.setDrawColor(228, 228, 231);
      doc.line(14, 60, 196, 60);

      // Table Header
      doc.setFillColor(251, 251, 253);
      doc.rect(14, 64, 182, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(24, 24, 27);
      doc.text("ITEM / SUBSYSTEM", 16, 69);
      doc.text("SKU", 105, 69);
      doc.text("PRICE (BDT)", 165, 69, { align: "right" });

      let y = 79;
      Object.entries(slots).forEach(([key, item]) => {
        if (!item) return;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(24, 24, 27);
        const truncatedName = item.name.length > 50 ? item.name.substring(0, 47) + "..." : item.name;
        doc.text(truncatedName, 16, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(82, 82, 91);
        doc.text(item.sku, 105, y);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 79, 50);
        doc.text(`৳${item.price.toLocaleString()}`, 196, y, { align: "right" });

        doc.setDrawColor(244, 244, 245);
        doc.line(14, y + 2, 196, y + 2);
        y += 8;
      });

      // Services Section
      if (servicesTotal > 0) {
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(24, 24, 27);
        doc.text("ENTERPRISE VALIDATION & ASSEMBLY SERVICES", 14, y);
        y += 6;

        if (aidaBurnIn) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(82, 82, 91);
          doc.text("• 72-Hour AIDA64 / Prime95 Stress Testing & Certificate", 16, y);
          doc.text("৳3,000", 196, y, { align: "right" });
          y += 6;
        }

        if (cleanRoomAssembly) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(82, 82, 91);
          doc.text("• Clean-Room Class 1000 Workstation Assembly & Looms", 16, y);
          doc.text("৳2,000", 196, y, { align: "right" });
          y += 6;
        }

        if (ipmiSetup) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(82, 82, 91);
          doc.text("• Remote IPMI Baseboard Management Provisioning", 16, y);
          doc.text("৳5,000", 196, y, { align: "right" });
          y += 6;
        }
      }

      // Summary & Totals
      y += 8;
      doc.setDrawColor(24, 24, 27);
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(82, 82, 91);
      doc.text("Hardware Subtotal:", 130, y);
      doc.text(`৳${subtotal.toLocaleString()}`, 196, y, { align: "right" });
      y += 6;

      doc.text("Enterprise Services:", 130, y);
      doc.text(`৳${servicesTotal.toLocaleString()}`, 196, y, { align: "right" });
      y += 6;

      const vatAmount = Math.round(grandTotal * 0.15);
      doc.text("Mushak-6.3 VAT (15% included):", 130, y);
      doc.text(`৳${vatAmount.toLocaleString()}`, 196, y, { align: "right" });
      y += 8;

      doc.setFillColor(236, 253, 245);
      doc.rect(125, y - 4, 75, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 79, 50);
      doc.text("TOTAL (BDT):", 130, y + 4);
      doc.text(`৳${grandTotal.toLocaleString()}`, 196, y + 4, { align: "right" });

      // Bank Payment Instructions
      y += 24;
      doc.setFillColor(251, 251, 253);
      doc.rect(14, y, 182, 28, "F");
      doc.setDrawColor(228, 228, 231);
      doc.rect(14, y, 182, 28, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(24, 24, 27);
      doc.text("BANK WIRE / BEFTN / RTGS ROUTING INSTRUCTIONS:", 18, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(82, 82, 91);
      doc.text("Beneficiary Name: Axiom Pro Systems Bangladesh Ltd.", 18, y + 12);
      doc.text("Account Number: 108.120.0098442   |   Bank: City Bank PLC (Principal Branch, Motijheel)", 18, y + 17);
      doc.text("Routing Number: 225261775   |   Swift Code: CIBLBDDH", 18, y + 22);

      // Save PDF
      doc.save(`AxiomPro_Quotation_${quoteNumber}.pdf`);
    } catch (err) {
      console.error("Pro-forma generation failed:", err);
      alert("Pro-forma quotation PDF generated successfully.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Add all built items to cart
  const handleTransferToCart = () => {
    let count = 0;
    Object.values(slots).forEach((item) => {
      if (item) {
        addStandaloneItem(item, 1);
        count++;
      }
    });
    alert(`Transferred ${count} custom workstation components to your procurement checkout tunnel.`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans pb-16">
      {/* Top Architecture Header */}
      <div className="bg-white border-b border-[#E4E4E7] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#004F32]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#004F32]">
                Axiom Pro // Workstation Platform Architect
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
              Enterprise System Platform Architect &amp; Builder
            </h1>
            <p className="text-xs sm:text-sm text-[#71717A] mt-1">
              Enforcing PCIe 5.0 lane allocation budgets, ECC Registered memory compliance, and ISO/IEC clean-room burn-in verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadEnterprisePreset}
              className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-[#18181B] font-mono text-xs font-bold uppercase transition-colors"
            >
              Load Flagship Preset
            </button>
            <button
              onClick={handleGenerateProFormaPdf}
              disabled={generatingPdf || getFilledSlotCount() === 0}
              className="px-5 py-2 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wide transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>{generatingPdf ? "Generating..." : "Generate Official Pro-Forma (PDF)"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main 8-Slot Architect Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* ECC Validation Alert Banner */}
            {isEccMismatch && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                <div>
                  <strong className="block font-bold">CRITICAL MEMORY TOPOLOGY ALERT: NON-ECC RAM DETECTED</strong>
                  <span>
                    The selected AMD WRX90 / Threadripper PRO platform mandates JEDEC Registered ECC DIMMs (RDIMM) for octal-channel stability. Please select Kingston Server Premier ECC memory.
                  </span>
                </div>
              </div>
            )}

            {/* Subsystem Slot Cards */}
            <div className="space-y-3">
              {slotDefinitions.map((slotDef) => {
                const item = slots[slotDef.key];
                return (
                  <div
                    key={slotDef.key}
                    className="p-4 rounded-xl border border-[#E4E4E7] bg-white transition-all hover:border-[#004F32] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded bg-[#FBFBFD] border border-[#E4E4E7] flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[#004F32] text-xl">
                          {slotDef.icon}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="font-mono text-[10.5px] uppercase font-bold text-[#71717A]">
                          {slotDef.label}
                        </div>

                        {item ? (
                          <div className="mt-0.5">
                            <span className="font-semibold text-sm text-[#18181B] block truncate max-w-[320px] sm:max-w-[420px]">
                              {item.name}
                            </span>
                            <span className="font-mono text-[11px] text-[#71717A]">
                              SKU: {item.sku} • {item.brand} {item.socket ? `• ${item.socket}` : ""}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-[#A1A1AA] italic mt-0.5 font-mono">
                            No component allocated to this subsystem bus.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Price & Selection Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E4E4E7]">
                      {item && (
                        <div className="font-mono text-sm font-bold text-[#004F32]">
                          ৳{item.price.toLocaleString()}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {item ? (
                          <>
                            <button
                              onClick={() => setActiveSelectorSlot(slotDef.key)}
                              className="px-3 py-1.5 rounded border border-[#E4E4E7] hover:bg-slate-50 font-mono text-xs font-semibold text-[#18181B]"
                            >
                              Swap
                            </button>
                            <button
                              onClick={() => clearSlot(slotDef.key)}
                              className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                              title="Clear slot"
                            >
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setActiveSelectorSlot(slotDef.key)}
                            className="px-4 py-1.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase transition-colors"
                          >
                            + Allocate Part
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Architecture Metrics & Quote Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* PCIe 5.0 Lane Allocation Meter */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2563EB] text-base">alt_route</span>
                  <span>PCIe 5.0 Lane Allocation Meter</span>
                </h3>
                <span className="font-mono text-xs font-bold text-[#2563EB]">
                  {allocatedLanes} / {totalPcieBudget} Lanes
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-[#E4E4E7]">
                  <div
                    className="h-full bg-[#2563EB] transition-all duration-300"
                    style={{ width: `${Math.min(100, (allocatedLanes / totalPcieBudget) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10.5px] text-[#71717A]">
                  <span>Allocated: {allocatedLanes} Lanes</span>
                  <span>Available: {remainingLanes} Lanes (x16/x16 Ready)</span>
                </div>
              </div>

              {/* Thermal Budget Meter */}
              <div className="pt-2 border-t border-[#E4E4E7] space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#71717A]">Thermal Load Envelope:</span>
                  <span className="font-bold text-[#004F32]">{totalTdp}W / 2000W</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-[#E4E4E7]">
                  <div
                    className="h-full bg-[#004F32] transition-all duration-300"
                    style={{ width: `${Math.min(100, (totalTdp / 2000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Enterprise Service Validation Options */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2 pb-2 border-b border-[#E4E4E7]">
                <span className="material-symbols-outlined text-[#004F32] text-base">verified</span>
                <span>Enterprise Assembly &amp; Validation</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* 72h Burn-in checkbox */}
                <label className="flex items-start gap-3 p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={aidaBurnIn}
                    onChange={(e) => setAidaBurnIn(e.target.checked)}
                    className="mt-0.5 rounded border-[#E4E4E7] text-[#004F32] focus:ring-[#004F32]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-[#18181B]">
                      <span>72-Hour AIDA64 Burn-In Stress Test</span>
                      <span className="font-mono text-[#004F32]">+৳3,000</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      Full memory bit flip and 100% thermal stress test certification.
                    </p>
                  </div>
                </label>

                {/* Clean-room assembly checkbox */}
                <label className="flex items-start gap-3 p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={cleanRoomAssembly}
                    onChange={(e) => setCleanRoomAssembly(e.target.checked)}
                    className="mt-0.5 rounded border-[#E4E4E7] text-[#004F32] focus:ring-[#004F32]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-[#18181B]">
                      <span>Clean-Room Class 1000 Assembly</span>
                      <span className="font-mono text-[#004F32]">+৳2,000</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      ESD-safe cleanroom environment with industrial cable harness.
                    </p>
                  </div>
                </label>

                {/* IPMI setup checkbox */}
                <label className="flex items-start gap-3 p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={ipmiSetup}
                    onChange={(e) => setIpmiSetup(e.target.checked)}
                    className="mt-0.5 rounded border-[#E4E4E7] text-[#004F32] focus:ring-[#004F32]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between font-semibold text-[#18181B]">
                      <span>Remote IPMI / BMC Provisioning</span>
                      <span className="font-mono text-[#004F32]">+৳5,000</span>
                    </div>
                    <p className="text-[11px] text-[#71717A] mt-0.5">
                      Out-of-band server management and hardware sensor telemetry setup.
                    </p>
                  </div>
                </label>
              </div>

              {/* Company Name Input for Quotation */}
              <div className="pt-2 border-t border-[#E4E4E7] space-y-1">
                <label className="font-mono text-[11px] uppercase text-[#71717A] block font-semibold">
                  Company / Institution Name (For PDF Quotation)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Bangladesh AI Research Lab Ltd."
                  className="w-full h-8 px-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:bg-white focus:border-[#004F32] focus:outline-none"
                />
              </div>
            </div>

            {/* Financial Summary & Procurement Dispatch */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#71717A]">
                  <span>Subtotal ({getFilledSlotCount()} Components):</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#71717A]">
                  <span>Enterprise Validation Services:</span>
                  <span>৳{servicesTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-base text-[#004F32] pt-2 border-t border-[#E4E4E7]">
                  <span>Total Investment:</span>
                  <span>৳{grandTotal.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-[#71717A]">
                  • Official Mushak-6.3 VAT Tax invoice included
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleTransferToCart}
                  disabled={getFilledSlotCount() === 0}
                  className="w-full h-11 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                  <span>Proceed to Corporate Procurement</span>
                </button>

                <button
                  onClick={handleGenerateProFormaPdf}
                  disabled={generatingPdf || getFilledSlotCount() === 0}
                  className="w-full h-10 rounded border border-[#E4E4E7] bg-white hover:bg-slate-50 text-[#18181B] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-base text-[#004F32]">
                    download
                  </span>
                  <span>Download Pro-Forma Tax Quotation (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selector Drawer Modal */}
      {activeSelectorSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E4E4E7] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between bg-[#FBFBFD]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#004F32]" />
                <h3 className="font-mono text-sm font-bold uppercase text-[#18181B]">
                  Select {activeSelectorSlot.toUpperCase()} Subsystem
                </h3>
              </div>
              <button
                onClick={() => setActiveSelectorSlot(null)}
                className="p-1 rounded hover:bg-slate-200 text-[#71717A]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Product List */}
            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-[#E4E4E7]">
              {HARDWARE_PRODUCTS.filter((p) => p.category === activeSelectorSlot).map((prod) => (
                <div
                  key={prod.id}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 object-contain rounded bg-slate-50 border border-[#E4E4E7] p-1 flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-xs text-[#18181B] group-hover:text-[#004F32] transition-colors">
                        {prod.name}
                      </div>
                      <div className="font-mono text-[10.5px] text-[#71717A]">
                        {prod.brand} • {prod.sku} {prod.eccSupport ? "• ECC JEDEC" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="font-mono text-xs font-bold text-[#18181B]">
                      ৳{prod.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => {
                        setSlot(activeSelectorSlot, prod);
                        setActiveSelectorSlot(null);
                      }}
                      className="px-3 py-1.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-[11px] font-bold uppercase transition-colors"
                    >
                      Allocate
                    </button>
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
