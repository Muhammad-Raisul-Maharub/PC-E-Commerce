"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PcBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    slots,
    services,
    setSlot,
    clearSlot,
    toggleService,
    loadDefaultBuild,
    loadFromEncodedString,
    getShareableUrl,
    calculateEstimatedWattage,
    calculateRecommendedPsuWattage,
    calculateSubtotal,
    calculateTotalWithServices,
    getFilledSlotCount,
    checkCompatibility,
  } = useBuilderStore();

  const { addBundledRig } = useCartStore();

  const [activeSlotModal, setActiveSlotModal] = useState<BuilderSlotKey | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState<"courier" | "pickup">("courier");

  const buildSummaryRef = useRef<HTMLDivElement>(null);

  // Load build from URL query if present, else default build
  useEffect(() => {
    const rigParam = searchParams.get("rig");
    if (rigParam) {
      loadFromEncodedString(rigParam);
    } else if (getFilledSlotCount() === 0) {
      loadDefaultBuild();
    }
  }, [searchParams, loadFromEncodedString, loadDefaultBuild, getFilledSlotCount]);

  const estimatedWattage = calculateEstimatedWattage();
  const recommendedPsu = calculateRecommendedPsuWattage();
  const subtotal = calculateSubtotal();
  const totalWithServices = calculateTotalWithServices();
  const filledCount = getFilledSlotCount();
  const compatibility = checkCompatibility();

  const psuRated = slots.psu ? slots.psu.tdp : recommendedPsu;
  const loadPercentage = Math.min(100, Math.round((estimatedWattage / psuRated) * 100));

  const slotDefinitions: { key: BuilderSlotKey; number: string; label: string; category: string }[] = [
    { key: "cpu", number: "01", label: "Processor (CPU)", category: "cpu" },
    { key: "motherboard", number: "02", label: "Motherboard", category: "motherboard" },
    { key: "cooler", number: "03", label: "CPU Cooler", category: "cooler" },
    { key: "ram", number: "04", label: "Memory (RAM)", category: "ram" },
    { key: "storage", number: "05", label: "Storage (M.2 NVMe)", category: "storage" },
    { key: "gpu", number: "06", label: "Graphics Card (GPU)", category: "gpu" },
    { key: "psu", number: "07", label: "Power Supply (PSU)", category: "psu" },
    { key: "chassis", number: "08", label: "Computer Chassis", category: "chassis" },
  ];

  // Filter candidates for active slot selection with compatibility checking
  const getCandidateProducts = (slotKey: BuilderSlotKey) => {
    const category = slotDefinitions.find((s) => s.key === slotKey)?.category;
    let list = HARDWARE_PRODUCTS.filter((p) => p.category === category);

    // Apply smart compatibility filters
    if (slotKey === "cpu" && slots.motherboard?.socket) {
      list = list.filter((p) => p.socket === slots.motherboard?.socket);
    }
    if (slotKey === "motherboard" && slots.cpu?.socket) {
      list = list.filter((p) => p.socket === slots.cpu?.socket);
    }
    if (slotKey === "ram" && slots.motherboard?.ramType) {
      list = list.filter((p) => p.ramType === slots.motherboard?.ramType);
    }

    return list;
  };

  const handleShareLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2200);
  };

  const handleExportPdf = async () => {
    if (!buildSummaryRef.current) return;
    setIsExportingPdf(true);

    try {
      const canvas = await html2canvas(buildSummaryRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VoltMatrix-Quotation-Rig-${Date.now().toString().slice(-4)}.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
      alert("Quotation generated successfully!");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleAddRigToCart = () => {
    addBundledRig({
      name: `VoltMatrix Custom PC (${slots.cpu?.name?.split(" ")[2] || "AM5"} + ${slots.gpu?.name?.split(" ")[1] || "RTX"})`,
      components: { ...slots },
      services: { ...services },
      rigSubtotal: subtotal,
      totalWithServices: totalWithServices,
    });
    router.push("/checkout");
  };

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen">
      {/* Top Banner & Telemetry Bar */}
      <section className="w-full bg-white border-b border-slate-200 py-6 px-3 sm:px-4">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded font-mono text-[10.5px] uppercase font-bold">
                  Silicon Architect Workbench
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  REAL-TIME VALIDATION ENGINE V5.1
                </span>
              </div>
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Custom PC System Architect &amp; Bill of Materials
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[11px] font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copySuccess ? "check" : "share"}
                </span>
                <span>{copySuccess ? "Share Link Copied!" : "Share Build"}</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-mono text-[11px] font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                <span>{isExportingPdf ? "Compiling PDF..." : "Export Quotation"}</span>
              </button>
            </div>
          </div>

          {/* 3 Top Telemetry Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Block 1: Power Gauge & Wattage Headroom */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 font-bold uppercase">
                  <span className="material-symbols-outlined text-[#EF4444] text-[16px]">bolt</span>
                  <span>ESTIMATED SYSTEM LOAD</span>
                </div>
                <div className="font-mono text-[22px] text-slate-900 font-bold">
                  {estimatedWattage}W{" "}
                  <span className="text-[14px] text-slate-500 font-normal">
                    / {psuRated}W ({loadPercentage}% LOAD)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Recommended: {recommendedPsu}W 80+ Gold (25% safety margin)
                </div>
              </div>

              {/* Sparkline Gauge */}
              <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray={`${loadPercentage}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute font-mono text-[10px] text-slate-900 font-bold">
                  {loadPercentage}%
                </span>
              </div>
            </div>

            {/* Block 2: Compatibility Engine Status */}
            <div
              className={`p-4 rounded border flex items-start gap-3 ${
                compatibility.isCompatible
                  ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                  : "bg-red-50 text-red-950 border-red-200"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                  compatibility.isCompatible ? "bg-emerald-600" : "bg-[#EF4444]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {compatibility.isCompatible ? "check" : "priority_high"}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="font-headline font-bold text-[14px]">
                  {compatibility.isCompatible
                    ? `Compatibility Verified (${compatibility.score}%)`
                    : "Compatibility Conflict Detected"}
                </div>
                <p className="text-[11.5px] leading-snug">
                  {compatibility.checks[0]?.description ||
                    "No socket or electrical conflicts detected in active matrix."}
                </p>
              </div>
            </div>

            {/* Block 3: Running Financial Total */}
            <div className="p-4 bg-slate-100 rounded border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] text-slate-500 uppercase font-bold">
                  Running Financial Total
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#b61722] text-white rounded font-bold">
                  {filledCount} OF 8 SLOTS FILLED
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="font-mono text-[24px] text-[#b61722] font-bold">
                  ৳{totalWithServices.toLocaleString()}
                </div>
                <div className="font-mono text-[11px] text-slate-600">
                  EMI FROM <strong className="text-slate-900">৳{Math.round(totalWithServices / 12).toLocaleString()}/mo</strong>
                </div>
              </div>
              <div className="text-[10.5px] text-slate-500 flex items-center justify-between mt-1">
                <span>Inclusive of VAT &amp; Lab Testing</span>
                <span className="text-emerald-700 font-semibold">COD Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Architecture Canvas */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= COMPONENT WORKBENCH LEFT RAIL (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-4" ref={buildSummaryRef}>
            {/* Table Header Bar */}
            <div className="p-3 bg-white rounded border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="font-headline font-bold text-[14px] text-slate-900 uppercase tracking-tight">
                  System Bill of Materials (BOM)
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">
                  MATRIX REV 4.2
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                EST. BUILD WEIGHT: <strong className="text-slate-900">14.8 KG</strong>
              </div>
            </div>

            {/* 8 Core BOM Slot Rows */}
            <div className="space-y-3">
              {slotDefinitions.map((def) => {
                const item = slots[def.key];

                return (
                  <div
                    key={def.key}
                    className="p-4 bg-white rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Thumbnail or Empty Slot Placeholder */}
                      <div className="w-14 h-14 bg-slate-50 rounded border border-slate-200 shrink-0 flex items-center justify-center p-1 overflow-hidden">
                        {item ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-[28px]">
                            devices
                          </span>
                        )}
                      </div>

                      {/* Slot Description */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10.5px] px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                            {def.number} // {def.label.toUpperCase()}
                          </span>
                          {item && (
                            <span className="font-mono text-[10px] text-emerald-600 font-bold">
                              ● IN STOCK ({item.branchStock.idb > 0 ? "IDB DEPOT" : "SAVAR CENTRAL"})
                            </span>
                          )}
                        </div>

                        {item ? (
                          <>
                            <h3 className="font-headline font-semibold text-[15px] text-slate-900 truncate">
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                              {item.socket && (
                                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                  {item.socket}
                                </span>
                              )}
                              {item.tdp > 0 && (
                                <span className="bg-red-50 text-[#b61722] font-bold px-1.5 py-0.5 rounded">
                                  {item.tdp}W TDP
                                </span>
                              )}
                              {item.specs.slice(0, 2).map((s, i) => (
                                <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                  {s.value}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-[13px] text-slate-400 italic">
                            No {def.label} selected. Choose a component to calibrate system.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                      <div className="font-mono text-[18px] text-slate-900 font-bold">
                        {item ? `৳${item.price.toLocaleString()}` : "—"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveSlotModal(def.key)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-[11px] font-bold rounded border border-slate-200 transition-colors"
                        >
                          {item ? "Change" : "Choose"}
                        </button>
                        {item && (
                          <button
                            onClick={() => clearSlot(def.key)}
                            className="p-1 bg-slate-100 hover:bg-red-50 hover:text-[#b61722] text-slate-400 rounded transition-colors"
                            title="Remove component"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT ARCHITECTURE SIDEBAR (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-4">
            {/* Validation Rule Logic Drawer */}
            <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-headline font-semibold text-[13px] text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                  Validation Engine (Active)
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                  PASSED {compatibility.checks.filter((c) => c.passed).length}/4
                </span>
              </div>

              <div className="space-y-2 text-[11.5px]">
                {compatibility.checks.map((rule, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-start gap-2">
                    <span
                      className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                        rule.passed ? "text-emerald-600" : "text-[#EF4444]"
                      }`}
                    >
                      {rule.passed ? "check_circle" : "error"}
                    </span>
                    <div className="text-slate-800 leading-snug">
                      <strong className="text-slate-900">{rule.title}: </strong>
                      {rule.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Lab Services Module */}
            <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-headline font-semibold text-[13px] text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#EF4444] text-[18px]">build_circle</span>
                  Professional Lab Services
                </span>
                <span className="font-mono text-[10px] text-slate-400">OPTIONAL ADD-ONS</span>
              </div>

              <div className="space-y-2 text-[12px]">
                {/* Service 1 */}
                <label className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={services.assembly}
                    onChange={() => toggleService("assembly")}
                    className="mt-0.5 accent-[#EF4444]"
                  />
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>Workshop Assembly &amp; Wiring</span>
                      <span className="font-mono text-[9.5px] px-1.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        FREE PROMO
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Concealed harness wiring, thermal pad seating &amp; anti-sag bracket.
                    </div>
                  </div>
                </label>

                {/* Service 2 */}
                <label className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={services.occtStressTest}
                    onChange={() => toggleService("occtStressTest")}
                    className="mt-0.5 accent-[#EF4444]"
                  />
                  <div className="space-y-0.5 w-full">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>24-Hour OCCT Stress-Testing</span>
                      <span className="font-mono text-[11.5px] text-[#b61722] font-bold">+৳1,500</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      AVX2 thermal loading, memtest86 4-cycle loop, &amp; signed bench certificate.
                    </div>
                  </div>
                </label>

                {/* Service 3 */}
                <label className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-100 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={services.osBiosSetup}
                    onChange={() => toggleService("osBiosSetup")}
                    className="mt-0.5 accent-[#EF4444]"
                  />
                  <div className="space-y-0.5 w-full">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>Operating System &amp; BIOS Flash</span>
                      <span className="font-mono text-[11.5px] text-[#b61722] font-bold">+৳500</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Latest AGESA BIOS patch, AMD EXPO profile tuned, test Windows install.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Fulfillment Mode Toggle */}
            <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-3">
              <span className="font-headline font-semibold text-[13px] text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-500 text-[18px]">local_shipping</span>
                Fulfillment &amp; Handover Mode
              </span>

              <div className="space-y-2 text-[12px]">
                <label className="flex items-start gap-2 p-2.5 bg-slate-50 rounded border border-slate-100 cursor-pointer">
                  <input
                    type="radio"
                    name="builder_fulfillment"
                    checked={selectedFulfillment === "courier"}
                    onChange={() => setSelectedFulfillment("courier")}
                    className="mt-1 accent-[#EF4444]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Express Courier (64 Districts)</div>
                    <div className="text-[11px] text-slate-500">
                      Reinforced wooden crating with foam-in-place GPU packaging.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2 p-2.5 bg-slate-50 rounded border border-slate-100 cursor-pointer">
                  <input
                    type="radio"
                    name="builder_fulfillment"
                    checked={selectedFulfillment === "pickup"}
                    onChange={() => setSelectedFulfillment("pickup")}
                    className="mt-1 accent-[#EF4444]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">In-Store Handover &amp; POST Demo</div>
                    <div className="text-[11px] text-slate-500">
                      Ready in <strong>4 Hours</strong> at <strong>Dhaka IDB Bhaban Hub</strong>.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Modular Action Dock */}
      <aside className="sticky bottom-0 w-full bg-white border-t border-slate-200 shadow-2xl z-40 py-3 px-3 sm:px-4">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div>
              <div className="font-mono text-[10.5px] text-slate-500 uppercase flex items-center gap-1.5">
                <span>READY RIG BOM TOTAL ({filledCount} ITEMS)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[28px] text-[#b61722] font-bold">
                  ৳{totalWithServices.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500">
                  {services.occtStressTest ? "incl. Stress Test" : "Standard Rig"}
                </span>
              </div>
            </div>

            <div className="hidden sm:block text-slate-500 text-[11.5px] pl-4 border-l border-slate-200">
              <div>Est. Delivery: <strong className="text-slate-900">Tomorrow, 3:00 PM</strong></div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1 font-mono text-[11px]">
                <span className="material-symbols-outlined text-[14px]">shield</span> 3-Year Standard Warranty
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <a
              href={`https://wa.me/8801700000000?text=VoltMatrix%20Build%20Audit%20Request%20for%20BOM%20Total:%20৳${totalWithServices}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11.5px] font-bold rounded border border-emerald-300 transition-all shadow-sm"
            >
              <span>💬 WhatsApp Audit</span>
            </a>

            <button
              onClick={handleAddRigToCart}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 h-11 bg-[#EF4444] hover:bg-[#dc2626] text-white font-mono text-[13px] uppercase font-bold tracking-tight rounded transition-all shadow-md active:translate-y-px"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              <span>Add Rig to Cart &amp; Checkout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* COMPONENT SELECTOR MODAL / SLIDE-OVER DRAWER */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444] text-[20px]">tune</span>
                <h3 className="font-headline font-bold text-[16px] text-slate-900">
                  Select Compatible {slotDefinitions.find((s) => s.key === activeSlotModal)?.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="w-7 h-7 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {getCandidateProducts(activeSlotModal).map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-3 rounded border border-slate-200 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={candidate.image} alt={candidate.name} className="w-12 h-12 object-contain bg-slate-50 rounded p-1 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-slate-500 uppercase">{candidate.brand} • {candidate.sku}</div>
                      <div className="font-headline font-semibold text-[13px] text-slate-900 truncate">{candidate.name}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5 font-mono text-[9.5px]">
                        {candidate.socket && <span className="bg-slate-100 px-1 rounded">{candidate.socket}</span>}
                        {candidate.tdp > 0 && <span className="bg-red-50 text-[#b61722] px-1 rounded">{candidate.tdp}W</span>}
                        {candidate.specs.slice(0, 2).map((s, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-1 rounded">{s.value}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="font-mono text-[16px] text-[#b61722] font-bold">
                      ৳{candidate.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => {
                        setSlot(activeSlotModal, candidate);
                        setActiveSlotModal(null);
                      }}
                      className="px-3 py-1 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[11px] font-bold uppercase transition-colors"
                    >
                      Select
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

export default function VoltMatrixBuilder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="flex items-center space-x-3 mb-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#EF4444] border-t-transparent animate-spin" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F172A]">
              INITIALIZING SYSTEM ARCHITECT WORKBENCH...
            </span>
          </div>
          <p className="font-mono text-[11px] text-slate-500">Loading hardware database & real-time telemetry</p>
        </div>
      }
    >
      <PcBuilderContent />
    </Suspense>
  );
}
