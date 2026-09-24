"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import Hardware3DViewer from "@/components/canvas/Hardware3DViewer";
import jsPDF from "jspdf";

const SLOT_CONFIG: { key: BuilderSlotKey; label: string; icon: string; category: string }[] = [
  { key: "cpu", label: "Processor (CPU)", icon: "memory", category: "cpu" },
  { key: "motherboard", label: "Motherboard", icon: "developer_board", category: "motherboard" },
  { key: "cooler", label: "CPU Cooler", icon: "ac_unit", category: "cooler" },
  { key: "ram", label: "Memory (RAM)", icon: "storage", category: "ram" },
  { key: "gpu", label: "Graphics Card (GPU)", icon: "videogame_asset", category: "gpu" },
  { key: "storage", label: "Fast Storage (M.2 NVMe SSD)", icon: "dns", category: "storage" },
  { key: "psu", label: "Power Supply (PSU)", icon: "power", category: "psu" },
  { key: "chassis", label: "Computer Case", icon: "computer", category: "chassis" },
];

export default function OmniPulseBuilder() {
  const router = useRouter();
  const {
    slots,
    setSlot,
    clearSlot,
    services,
    toggleService,
    calculateEstimatedWattage,
    calculateRecommendedPsuWattage,
    calculateSubtotal,
    calculateTotalWithServices,
    checkCompatibility,
    resetBuild,
  } = useBuilderStore();

  const { addBundledRig, deliveryDetails } = useCartStore();

  const [budgetSlider, setBudgetSlider] = useState<number>(120000);
  const [activeSlotModal, setActiveSlotModal] = useState<BuilderSlotKey | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const estimatedWattage = calculateEstimatedWattage();
  const recommendedPsu = calculateRecommendedPsuWattage();
  const subtotal = calculateSubtotal();
  const totalWithServices = calculateTotalWithServices();
  const compatibility = checkCompatibility();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Budget Auto-Fill Wizard Engine
  const handleApplyBudgetPreset = (targetBudget: number) => {
    setBudgetSlider(targetBudget);

    // Filter available products
    const cpus = HARDWARE_PRODUCTS.filter((p) => p.category === "cpu");
    const gpus = HARDWARE_PRODUCTS.filter((p) => p.category === "gpu");
    const mobos = HARDWARE_PRODUCTS.filter((p) => p.category === "motherboard");
    const rams = HARDWARE_PRODUCTS.filter((p) => p.category === "ram");
    const storages = HARDWARE_PRODUCTS.filter((p) => p.category === "storage");
    const coolers = HARDWARE_PRODUCTS.filter((p) => p.category === "cooler");
    const psus = HARDWARE_PRODUCTS.filter((p) => p.category === "psu");
    const cases = HARDWARE_PRODUCTS.filter((p) => p.category === "chassis");

    if (targetBudget <= 75000) {
      // Esports / Entry Tier (50K - 75K)
      const cpu = cpus.find((p) => p.id === "cpu-14700k" || p.price < 35000) || cpus[0];
      const mobo = mobos.find((p) => p.socket === cpu.socket) || mobos[0];
      const ram = rams[0];
      const storage = storages[0];
      const cooler = coolers[0];
      const psu = psus[0];
      const chassis = cases[0];
      const gpu = gpus.find((p) => p.price < 50000) || gpus[0];

      if (cpu) setSlot("cpu", cpu);
      if (mobo) setSlot("motherboard", mobo);
      if (ram) setSlot("ram", ram);
      if (storage) setSlot("storage", storage);
      if (cooler) setSlot("cooler", cooler);
      if (psu) setSlot("psu", psu);
      if (chassis) setSlot("chassis", chassis);
      if (gpu) setSlot("gpu", gpu);
      showToast("Configured Esports 1080p Budget Tier!");
    } else if (targetBudget <= 140000) {
      // Mainstream 1440p High FPS (75K - 140K)
      const cpu = cpus.find((p) => p.id === "cpu-7800x3d") || cpus[0];
      const mobo = mobos.find((p) => p.socket === cpu.socket) || mobos[0];
      const ram = rams.find((p) => p.ramType === "DDR5") || rams[0];
      const gpu = gpus.find((p) => p.price >= 60000 && p.price <= 120000) || gpus[0];
      const storage = storages.find((p) => p.price > 12000) || storages[0];
      const cooler = coolers.find((p) => p.price > 8000) || coolers[0];
      const psu = psus.find((p) => p.price > 10000) || psus[0];
      const chassis = cases.find((p) => p.price > 8000) || cases[0];

      if (cpu) setSlot("cpu", cpu);
      if (mobo) setSlot("motherboard", mobo);
      if (ram) setSlot("ram", ram);
      if (gpu) setSlot("gpu", gpu);
      if (storage) setSlot("storage", storage);
      if (cooler) setSlot("cooler", cooler);
      if (psu) setSlot("psu", psu);
      if (chassis) setSlot("chassis", chassis);
      showToast("Configured Mainstream 1440p Gaming Rig!");
    } else {
      // Enthusiast 4K & Workstation (140K+)
      const cpu = cpus.find((p) => p.id === "cpu-7800x3d" || p.price > 40000) || cpus[0];
      const mobo = mobos.find((p) => p.socket === cpu.socket && p.price > 25000) || mobos[0];
      const ram = rams.find((p) => p.price > 20000) || rams[0];
      const gpu = gpus.find((p) => p.price > 100000) || gpus[0];
      const storage = storages.find((p) => p.price > 15000) || storages[0];
      const cooler = coolers.find((p) => p.price > 12000) || coolers[0];
      const psu = psus.find((p) => p.price > 15000) || psus[0];
      const chassis = cases.find((p) => p.price > 12000) || cases[0];

      if (cpu) setSlot("cpu", cpu);
      if (mobo) setSlot("motherboard", mobo);
      if (ram) setSlot("ram", ram);
      if (gpu) setSlot("gpu", gpu);
      if (storage) setSlot("storage", storage);
      if (cooler) setSlot("cooler", cooler);
      if (psu) setSlot("psu", psu);
      if (chassis) setSlot("chassis", chassis);
      showToast("Configured Enthusiast 4K & AI Creator Rig!");
    }
  };

  // Export PDF Quotation
  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF();
      const quoteNo = "OP-QT-" + Math.floor(100000 + Math.random() * 900000);
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      // Top Header: Royal Navy Banner
      doc.setFillColor(13, 71, 161); // Royal Navy #0D47A1
      doc.rect(0, 0, 210, 36, "F");

      // Company Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("OMNIPULSE BD // OFFICIAL HARDWARE QUOTATION", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 179, 0); // Amber
      doc.text("AUTHORISED TECH RETAIL HUB • MUSHAK-6.3 VAT COMPLIANT • 5 SHOWROOM DEPOTS", 14, 26);

      // Quotation Metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Quotation Ref: ${quoteNo}`, 14, 46);
      doc.text(`Date: ${dateStr}`, 14, 52);
      doc.text(`Pickup Branch: IDB Bhaban / Multiplan Depot`, 14, 58);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Customer: Valued Client (Retail Consultation)", 130, 46);
      doc.text("Valid For: 7 Days from Issue Date", 130, 52);
      doc.text("Helpline: +880 1711-234567 (WhatsApp)", 130, 58);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 63, 196, 63);

      // Table Headers
      doc.setFillColor(244, 246, 249);
      doc.rect(14, 66, 182, 8, "F");
      doc.setTextColor(13, 71, 161);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("SL", 16, 71.5);
      doc.text("Component Specification", 26, 71.5);
      doc.text("SKU", 115, 71.5);
      doc.text("Warranty", 148, 71.5);
      doc.text("Price (BDT)", 194, 71.5, { align: "right" });

      // Table Rows
      let y = 78;
      let count = 1;

      SLOT_CONFIG.forEach((cfg) => {
        const item = slots[cfg.key];
        if (item) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(30, 41, 59);
          doc.text(String(count), 16, y);

          doc.text(item.name.substring(0, 46), 26, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(item.sku.substring(0, 18), 115, y);
          doc.text(item.warranty ? item.warranty.substring(0, 18) : "Official Importer", 148, y);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(13, 71, 161);
          doc.text(`৳${item.price.toLocaleString()}`, 194, y, { align: "right" });

          doc.setDrawColor(241, 245, 249);
          doc.line(14, y + 2.5, 196, y + 2.5);
          y += 7.5;
          count++;
        }
      });

      // Lab Services
      y += 2;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text("Workshop Services Included:", 14, y);
      y += 6;

      if (services.assembly) {
        doc.setFont("helvetica", "normal");
        doc.text("• Expert Workshop Rig Assembly & Cable Management (FREE PROMO)", 16, y);
        doc.text("৳0", 194, y, { align: "right" });
        y += 5.5;
      }
      if (services.occtStressTest) {
        doc.setFont("helvetica", "normal");
        doc.text("• 24-Hour Full-Load Stability & Stress Testing", 16, y);
        doc.text("৳1,500", 194, y, { align: "right" });
        y += 5.5;
      }
      if (services.osBiosSetup) {
        doc.setFont("helvetica", "normal");
        doc.text("• Windows Setup & Motherboard Firmware Update", 16, y);
        doc.text("৳500", 194, y, { align: "right" });
        y += 5.5;
      }

      // Total Calculation
      y += 4;
      doc.setDrawColor(13, 71, 161);
      doc.setLineWidth(0.5);
      doc.line(14, y, 196, y);
      y += 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(13, 71, 161);
      doc.text("GRAND TOTAL (VAT INCLUSIVE):", 14, y);
      doc.text(`৳${totalWithServices.toLocaleString()}`, 194, y, { align: "right" });

      // Footer
      y += 12;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Terms: Prices include 15% Mushak-6.3 VAT. 0% EMI available for 3–36 months on credit cards. 100% official Bangladesh importer stock.",
        14,
        y
      );

      doc.save(`OmniPulse_Quotation_${quoteNo}.pdf`);
      showToast("Quotation PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      showToast("Error generating PDF quotation.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Copy Shareable Build Link
  const handleCopyShareableLink = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const slotIds: Record<string, string> = {};
      Object.entries(slots).forEach(([k, v]) => {
        if (v) slotIds[k] = v.id;
      });
      url.searchParams.set("build", btoa(JSON.stringify(slotIds)));
      url.searchParams.set("concept", "omnipulse");
      navigator.clipboard.writeText(url.toString());
      showToast("Build link copied to clipboard!");
    }
  };

  // Add Rig to Unified Cart
  const handleAddRigToCart = () => {
    const filledCount = Object.values(slots).filter(Boolean).length;
    if (filledCount === 0) {
      showToast("Please select components before adding to cart.");
      return;
    }

    addBundledRig({
      name: `OmniPulse Custom Rig (${filledCount} Components)`,
      components: { ...slots },
      services: { ...services },
      rigSubtotal: subtotal,
      totalWithServices: totalWithServices,
    });

    showToast("Rig added to cart! Redirecting to checkout...");
    setTimeout(() => router.push("/checkout"), 800);
  };

  return (
    <div className="w-full bg-[#F4F6F9] text-slate-900 font-sans antialiased min-h-screen py-8">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 bg-[#0D47A1] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-sm text-[#FFB300]">info</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Masthead & Telemetry */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB300] animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#0D47A1] font-bold">
                Custom PC Builder &amp; Parts Configurator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              OmniPulse BD Custom PC Builder &amp; Budget Wizard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Automated motherboard fit, memory, and power compatibility checks with quotation download.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyShareableLink}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              <span>Copy Build Link</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#0a387e] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              <span>{isExportingPdf ? "Exporting..." : "Export PDF Quotation"}</span>
            </button>
          </div>
        </div>

        {/* 1. Build by Budget Interactive Slider Wizard */}
        <div className="bg-gradient-to-r from-[#071E4A] via-[#0D47A1] to-[#0A387E] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#FFB300] font-sans">
                Interactive Wizard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans mt-0.5">
                Build by Budget Slider (৳50,000 to ৳200,000+)
              </h2>
              <p className="text-xs text-blue-100">
                Drag the slider to your desired budget and our algorithm will populate balanced, compatible hardware instantly.
              </p>
            </div>

            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-right">
              <div className="text-[10px] text-blue-200 uppercase font-mono">Target Budget</div>
              <div className="text-xl font-black text-[#FFB300] font-sans">
                ৳{budgetSlider.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="50000"
              max="220000"
              step="10000"
              value={budgetSlider}
              onChange={(e) => handleApplyBudgetPreset(Number(e.target.value))}
              className="w-full accent-[#FFB300] cursor-pointer h-2 bg-white/20 rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-blue-200 font-mono">
              <span>৳50,000 (Esports 1080p)</span>
              <span>৳120,000 (1440p Gaming)</span>
              <span>৳200,000+ (4K &amp; AI Studio)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-blue-200">Quick Tiers:</span>
            <button
              onClick={() => handleApplyBudgetPreset(65000)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium border border-white/20"
            >
              ৳65K Esports Rig
            </button>
            <button
              onClick={() => handleApplyBudgetPreset(120000)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium border border-white/20"
            >
              ৳120K 1440p Sweetspot
            </button>
            <button
              onClick={() => handleApplyBudgetPreset(180000)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium border border-white/20"
            >
              ৳180K 4K Extreme Rig
            </button>
          </div>
        </div>

        {/* Main Grid: Left Slots Selection + Right Summary & Validation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Component Slots (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 3D Hardware Digital Twin Viewport - Pure 3D Always Loaded */}
            <div className="w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-300 shadow-md relative bg-[#0B1329]">
              <Hardware3DViewer
                modelPath="/models/chassis-gaming.glb"
                concept="omnipulse"
                accentColor="#10B981"
                className="w-full h-full min-h-[380px]"
              />
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 font-sans">
                Rig Component Slots
              </h3>
              <button
                onClick={resetBuild}
                className="text-xs text-[#D32F2F] hover:underline font-bold"
              >
                Clear All Slots
              </button>
            </div>

            {SLOT_CONFIG.map((cfg) => {
              const item = slots[cfg.key];

              return (
                <div
                  key={cfg.key}
                  className={`bg-white rounded-2xl border p-4 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 ${
                    item
                      ? "border-[#0D47A1]/30 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item
                          ? "bg-[#E3F2FD] text-[#0D47A1]"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {cfg.icon}
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-500 uppercase font-mono">
                        {cfg.label}
                      </div>
                      {item ? (
                        <div className="font-bold text-xs sm:text-sm text-slate-900 font-sans line-clamp-1">
                          {item.name}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          No component selected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center gap-3 ml-auto">
                    {item && (
                      <div className="text-right">
                        <div className="font-mono text-sm font-bold text-slate-900">
                          ৳{item.price.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">{item.warranty}</div>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveSlotModal(cfg.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        item
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-[#0D47A1] hover:bg-[#0a387e] text-white"
                      }`}
                    >
                      {item ? "Change" : "Select Part"}
                    </button>

                    {item && (
                      <button
                        onClick={() => clearSlot(cfg.key)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Remove component"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Validation & Cost Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Compatibility Engine Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans">
                  Automated Compatibility
                </span>
                <span
                  className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                    compatibility.isCompatible
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {compatibility.isCompatible ? "✓ 100% COMPATIBLE" : "⚠ CONFLICT"}
                </span>
              </div>

              <div className="space-y-2">
                {compatibility.checks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span
                      className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 ${
                        check.passed ? "text-emerald-600" : "text-amber-500"
                      }`}
                    >
                      {check.passed ? "check_circle" : "warning"}
                    </span>
                    <div>
                      <span className="font-bold text-slate-800">{check.title}</span>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {check.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wattage Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Estimated Power Draw:</span>
                  <strong className="text-slate-900">{estimatedWattage} W</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Recommended PSU:</span>
                  <strong className="text-[#0D47A1]">{recommendedPsu} W+</strong>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0D47A1] h-full transition-all"
                    style={{
                      width: `${Math.min((estimatedWattage / (recommendedPsu || 750)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Workshop Services Checkboxes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 font-sans block border-b border-slate-100 pb-2.5">
                OmniPulse Workshop Add-Ons
              </span>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={services.assembly}
                    onChange={() => toggleService("assembly")}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Pro Workshop Assembly</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        FREE PROMO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Cable combs, thermal paste application &amp; airflow optimization.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={services.occtStressTest}
                    onChange={() => toggleService("occtStressTest")}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>24-Hour Thermal Stress Testing</span>
                      <span className="text-[11px] font-mono text-[#0D47A1] font-bold">
                        +৳1,500
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      OCCT / AIDA64 stability verification with physical printed benchmark certificate.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={services.osBiosSetup}
                    onChange={() => toggleService("osBiosSetup")}
                    className="rounded text-[#0D47A1] focus:ring-[#0D47A1] w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Windows 11 &amp; UEFI Optimization</span>
                      <span className="text-[11px] font-mono text-[#0D47A1] font-bold">
                        +৳500
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      EXPO / XMP memory profile loaded, Resizable BAR enabled, drivers installed.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Total Summary & Add to Cart */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Hardware Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Workshop Services:</span>
                  <span className="font-mono font-bold text-[#0D47A1]">
                    ৳{(totalWithServices - subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mushak-6.3 VAT:</span>
                  <span className="text-emerald-700 font-bold">15% Included</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900">Grand Total:</span>
                  <span className="text-2xl font-black text-[#0D47A1] font-sans">
                    ৳{totalWithServices.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  0% EMI from <strong>৳{Math.round(totalWithServices / 12).toLocaleString()}/mo</strong>
                </div>
              </div>

              <button
                onClick={handleAddRigToCart}
                className="w-full py-3.5 bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-black rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                <span>Add Complete Rig to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Component Selection Modal */}
        {activeSlotModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-sans">
                    Select {SLOT_CONFIG.find((c) => c.key === activeSlotModal)?.label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Filter by socket, form-factor, and current showroom stock.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  ✕
                </button>
              </div>

              {/* Product list */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
                {HARDWARE_PRODUCTS.filter(
                  (p) =>
                    p.category ===
                    SLOT_CONFIG.find((c) => c.key === activeSlotModal)?.category
                ).map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-[#0D47A1] hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {product.brand} • SKU: {product.sku}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right font-mono text-sm font-bold text-slate-900">
                        ৳{product.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => {
                          setSlot(activeSlotModal, product);
                          setActiveSlotModal(null);
                          showToast(`Selected ${product.name}`);
                        }}
                        className="px-3 py-1.5 bg-[#0D47A1] hover:bg-[#0a387e] text-white rounded-lg text-xs font-bold"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
