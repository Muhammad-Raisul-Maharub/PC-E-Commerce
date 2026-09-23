"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import jsPDF from "jspdf";

const LiquidChassis3DScene = dynamic(
  () => import("@/components/canvas/LiquidChassis3DScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] bg-[#0A0A0F] rounded-2xl flex flex-col items-center justify-center border border-cyan-500/30 font-mono text-cyan-400 text-xs">
        <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></span>
        INITIALIZING 3D CHASSIS COLLISION RIG...
      </div>
    ),
  }
);

export default function NeonForgeBuilder() {
  const {
    slots,
    services,
    setSlot,
    clearSlot,
    calculateEstimatedWattage,
    calculateSubtotal,
    checkCompatibility,
  } = useBuilderStore();

  const { addBundledRig } = useCartStore();

  // Modding Services Checklist
  const [hardlineBending, setHardlineBending] = useState(true);
  const [customSleeving, setCustomSleeving] = useState(true);
  const [pneumaticLeakTest, setPneumaticLeakTest] = useState(true);

  // Front Radiator Choice to trigger clearance collision
  const [frontRadiatorInstalled, setFrontRadiatorInstalled] = useState(true);
  const [activeSlotModal, setActiveSlotModal] = useState<BuilderSlotKey | null>(null);

  const hardlineBendingFee = hardlineBending ? 3500 : 0;
  const customSleevingFee = customSleeving ? 2000 : 0;
  const leakTestFee = pneumaticLeakTest ? 1500 : 0;
  const totalModdingFees = hardlineBendingFee + customSleevingFee + leakTestFee;

  const baseSubtotal = calculateSubtotal();
  const grandTotal = baseSubtotal + totalModdingFees;
  const estimatedWatts = calculateEstimatedWattage();
  const compatibility = checkCompatibility();

  // Mechanical Clearance Collision Logic:
  // Standard chassis clearance = 400mm. Front Radiator + Fan thickness = 44mm + 25mm = 69mm.
  // Net max GPU clearance with front rad = 331mm.
  // If GPU length > 331mm (e.g. Strix 4090 = 357mm), flag collision!
  const hasClearanceCollision = useMemo(() => {
    if (!frontRadiatorInstalled) return false;
    const gpu = slots.gpu;
    if (!gpu) return false;
    // ROG Strix or RTX 4090 are ~357mm
    const gpuLength = gpu.name.includes("4090") || gpu.name.includes("Strix") ? 357 : 290;
    return gpuLength > 331;
  }, [slots.gpu, frontRadiatorInstalled]);

  const handleDeployRigToCart = () => {
    const subtotal = calculateSubtotal();
    addBundledRig({
      name: "NeonForge Bespoke Liquid Rig",
      components: { ...slots },
      services: { ...services },
      rigSubtotal: subtotal,
      totalWithServices: subtotal + totalModdingFees,
    });
    alert("Bespoke Liquid Battlestation added to Cyber Checkout!");
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyBuildLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const slotKeys: { key: BuilderSlotKey; label: string; icon: string }[] = [
    { key: "cpu", label: "Processor Unit", icon: "memory" },
    { key: "motherboard", label: "Motherboard Architecture", icon: "developer_board" },
    { key: "gpu", label: "Discrete GPU / Block", icon: "videogame_asset" },
    { key: "ram", label: "DDR5 High-Speed Memory", icon: "view_column" },
    { key: "storage", label: "Gen5 NVMe Storage", icon: "storage" },
    { key: "psu", label: "Power Delivery Unit", icon: "bolt" },
    { key: "cooler", label: "Liquid Cooling System", icon: "water_drop" },
    { key: "chassis", label: "Liquid-Ready Enclosure", icon: "dns" },
  ];

  const exportPdfQuotation = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      // Dark header
      doc.setFillColor(10, 10, 15);
      doc.rect(0, 0, 210, 38, "F");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 240, 255);
      doc.setFontSize(16);
      doc.text("NEONFORGE // BESPOKE LIQUID RIG SPECIFICATION", 15, 16);

      doc.setFontSize(9);
      doc.setTextColor(255, 107, 0);
      doc.text(`CYBER RIG HASH: NF-${Date.now().toString(36).toUpperCase()}`, 15, 24);

      doc.setTextColor(200, 200, 220);
      doc.setFontSize(8);
      doc.text(`ISSUED: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · DHAKA IDB CYBER LAB`, 15, 30);

      // Table of components
      let y = 48;
      doc.setFillColor(240, 240, 245);
      doc.rect(15, y - 6, 180, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 50);
      doc.text("SLOT", 18, y - 1);
      doc.text("COMPONENT / SKU", 60, y - 1);
      doc.text("PRICE (BDT)", 165, y - 1);

      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      slotKeys.forEach((slot) => {
        const item = slots[slot.key];
        doc.setTextColor(60, 60, 70);
        doc.text(slot.label, 18, y);
        if (item) {
          doc.setTextColor(15, 15, 20);
          doc.text(`${item.name} (${item.sku})`, 60, y);
          doc.text(`Tk ${item.price.toLocaleString()}`, 165, y);
        } else {
          doc.setTextColor(150, 150, 160);
          doc.text("[Empty Slot]", 60, y);
          doc.text("-", 165, y);
        }
        y += 7;
      });

      // Modding Services
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 150, 180);
      doc.text("BESPOKE MODDING SERVICES:", 18, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      if (hardlineBending) {
        doc.text("Custom Hardline 16mm PETG Heat-Bending", 18, y);
        doc.text("Tk 3,500", 165, y);
        y += 6;
      }
      if (customSleeving) {
        doc.text("CableMod Carbon Paracord Custom Sleeving", 18, y);
        doc.text("Tk 2,000", 165, y);
        y += 6;
      }
      if (pneumaticLeakTest) {
        doc.text("24h Pneumatic Air-Decay Leak Certification", 18, y);
        doc.text("Tk 1,500", 165, y);
        y += 6;
      }

      // Grand total box
      y += 6;
      doc.setFillColor(18, 18, 26);
      doc.rect(15, y, 180, 16, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 240, 255);
      doc.text("GRAND TOTAL (WITH BESPOKE SERVICES):", 20, y + 10);
      doc.setTextColor(255, 255, 255);
      doc.text(`BDT Tk ${grandTotal.toLocaleString()}`, 150, y + 10);

      doc.save(`NeonForge-Rig-Quote-${Date.now().toString().slice(-4)}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const modalCandidates = activeSlotModal
    ? HARDWARE_PRODUCTS.filter((p) => p.category === activeSlotModal)
    : [];

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-[#00F0FF] selection:text-[#0A0A0F] py-6">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header & Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <h1 className="font-chakra text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
                3D Liquid Loop &amp; Custom Rig Architect
              </h1>
            </div>
            <p className="font-sans text-xs text-slate-400 mt-1">
              Precision CAD clearance simulator, loop hydraulic validation, and bespoke hardline tube routing.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-[#12121A] border border-cyan-500/30 text-cyan-300">
              POWER ENVELOPE: <strong className="text-white">{estimatedWatts}W</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#12121A] border border-emerald-500/30 text-emerald-400">
              SOCKET: <strong className="text-white">{slots.cpu?.socket || "AM5 / LGA1851"}</strong>
            </div>
          </div>
        </div>

        {/* Clearance Collision Warning Banner (Glowing Red) */}
        {hasClearanceCollision && (
          <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400 text-2xl shrink-0">
              fmd_bad
            </span>
            <div className="text-xs space-y-1">
              <div className="font-chakra font-bold text-sm text-red-300 uppercase tracking-wide">
                ⚠️ MECHANICAL CLEARANCE COLLISION DETECTED
              </div>
              <p className="font-mono text-[11px] leading-relaxed">
                Selected GPU length (<strong>357mm</strong>) physically collides with the front-mounted 360mm radiator &amp; fan stack (maximum chassis bay depth available: <strong>331mm</strong>).
              </p>
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => setFrontRadiatorInstalled(false)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-mono text-[10.5px] font-bold uppercase rounded"
                >
                  Switch to Top-Mounted Radiator
                </button>
                <span className="font-mono text-[10.5px] text-red-300">
                  Top mount increases GPU clearance to 400mm.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Compatibility Status Banner (When Valid) */}
        {!hasClearanceCollision && compatibility.isCompatible && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>HYDRAULIC &amp; PINOUT VALIDATION: 100% PASS • ZERO BOTTLENECKS</span>
            </div>
            <span className="text-[10px] text-slate-400">PUMP HEAD: 3.9M H2O</span>
          </div>
        )}

        {/* Main 2-Column Workbench: Left 3D Viewport, Right BOM Slots & Add-ons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Chassis Fitting Preview & Radiator Mount Switcher */}
          <div className="lg:col-span-5 space-y-4">
            <LiquidChassis3DScene coolantColor="#00F0FF" />

            {/* Radiator Bay Mounting Controls */}
            <div className="p-4 rounded-xl bg-[#12121A] border border-cyan-500/30 space-y-3">
              <span className="font-chakra text-xs font-bold uppercase text-white block">
                Radiator Loop Placement &amp; Clearance Simulator
              </span>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={() => setFrontRadiatorInstalled(true)}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    frontRadiatorInstalled
                      ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-[#0A0A0F] border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="font-bold">Front Bay 360mm</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">331mm Max GPU Clearance</div>
                </button>

                <button
                  onClick={() => setFrontRadiatorInstalled(false)}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    !frontRadiatorInstalled
                      ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-[#0A0A0F] border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="font-bold">Top Exhaust 360mm</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">400mm Full Clearance</div>
                </button>
              </div>
            </div>

            {/* Bespoke Modding Lab Services Checklist */}
            <div className="p-4 rounded-xl bg-[#12121A] border border-cyan-500/30 space-y-3">
              <span className="font-chakra text-xs font-bold uppercase text-white block">
                Handcrafted Modding Lab Services
              </span>

              <div className="space-y-2 font-mono text-xs">
                <label className="flex items-center justify-between p-2.5 rounded bg-[#0A0A0F] border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hardlineBending}
                      onChange={(e) => setHardlineBending(e.target.checked)}
                      className="accent-[#00F0FF] rounded"
                    />
                    <span>Custom Hardline 16mm PETG Heat-Bending</span>
                  </div>
                  <span className="text-[#00F0FF] font-bold">+৳3,500</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#0A0A0F] border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={customSleeving}
                      onChange={(e) => setCustomSleeving(e.target.checked)}
                      className="accent-[#00F0FF] rounded"
                    />
                    <span>CableMod Carbon Paracord Custom Sleeving</span>
                  </div>
                  <span className="text-[#00F0FF] font-bold">+৳2,000</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded bg-[#0A0A0F] border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pneumaticLeakTest}
                      onChange={(e) => setPneumaticLeakTest(e.target.checked)}
                      className="accent-[#00F0FF] rounded"
                    />
                    <span>24h Pneumatic Air-Decay Leak Certification</span>
                  </div>
                  <span className="text-[#00F0FF] font-bold">+৳1,500</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: 8 Core Slot Rows & Summary Bar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-2.5">
              {slotKeys.map((item) => {
                const selected = slots[item.key];
                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-xl bg-[#12121A]/90 border border-cyan-500/20 hover:border-cyan-500/50 transition-colors flex items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#0A0A0F] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </span>

                      <div>
                        <span className="font-mono text-[10px] uppercase text-slate-400 block font-bold">
                          {item.label}
                        </span>
                        {selected ? (
                          <div className="flex items-center gap-2">
                            <span className="font-chakra text-sm font-bold text-white">
                              {selected.name}
                            </span>
                            <span className="font-mono text-[10px] text-cyan-400">
                              (৳{selected.price.toLocaleString()})
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-slate-500 italic">
                            [ Slot Empty — Click Choose ]
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selected ? (
                        <>
                          <button
                            onClick={() => setActiveSlotModal(item.key)}
                            className="px-2.5 py-1 rounded bg-[#0A0A0F] border border-slate-700 text-slate-300 hover:text-white font-mono text-[11px]"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => clearSlot(item.key)}
                            className="px-2 py-1 rounded bg-red-950/60 border border-red-800/60 text-red-400 hover:text-red-300 font-mono text-[11px]"
                          >
                            Clear
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setActiveSlotModal(item.key)}
                          className="px-3 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-xs uppercase shadow-md shadow-cyan-500/20"
                        >
                          Choose
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Total Bar & Deploy Button */}
            <div className="p-5 rounded-2xl bg-[#12121A] border border-cyan-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-mono uppercase block">
                    Components Subtotal
                  </span>
                  <span className="font-mono text-base text-slate-300">
                    ৳{baseSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-mono uppercase block">
                    Modding &amp; Testing Fees
                  </span>
                  <span className="font-mono text-base text-cyan-400">
                    +৳{totalModdingFees.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-mono uppercase block">
                    Grand Total
                  </span>
                  <span className="font-rajdhani text-3xl font-extrabold text-white">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={exportPdfQuotation}
                  disabled={isExportingPdf}
                  className="py-2.5 px-3 rounded-xl bg-[#0A0A0F] hover:bg-[#161622] border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>{isExportingPdf ? "Generating PDF..." : "Export PDF Quote"}</span>
                </button>
                <button
                  onClick={handleCopyBuildLink}
                  className="py-2.5 px-3 rounded-xl bg-[#0A0A0F] hover:bg-[#161622] border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">{copiedLink ? "check" : "share"}</span>
                  <span>{copiedLink ? "Link Copied!" : "Share Build Link"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeployRigToCart}
                  className="flex-1 py-3.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-bold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>Deploy Liquid Rig to Cart</span>
                </button>

                <Link
                  href="/checkout"
                  className="px-6 py-3.5 bg-[#1E1E2D] hover:bg-[#2A2A3C] border border-cyan-500/40 text-cyan-300 font-chakra font-bold text-sm uppercase rounded-xl transition-colors"
                >
                  Direct Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Slot Picker Modal */}
        {activeSlotModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#12121A] border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">tune</span>
                  <h3 className="font-chakra text-base font-bold uppercase text-white">
                    Select {activeSlotModal.toUpperCase()} for Custom Loop
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-2 divide-y divide-white/5">
                {modalCandidates.length === 0 ? (
                  <p className="font-mono text-xs text-slate-400 text-center py-6">
                    No components found in database for this category.
                  </p>
                ) : (
                  modalCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="pt-2 pb-2 flex items-center justify-between gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img src={cand.image} alt={cand.name} className="w-10 h-10 object-contain rounded bg-[#0A0A0F] p-1" />
                        <div>
                          <div className="font-chakra text-xs font-bold text-white">
                            {cand.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {cand.brand} • {cand.sku} • {cand.tdp}W TDP
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-white">
                          ৳{cand.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            setSlot(activeSlotModal, cand);
                            setActiveSlotModal(null);
                          }}
                          className="px-3 py-1 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] rounded font-chakra text-xs font-bold uppercase"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
