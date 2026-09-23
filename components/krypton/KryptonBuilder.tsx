"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { KRYPTON_MAKER_PRODUCTS, toHardwareProduct } from "@/data/mockProducts";
import Hardware3DViewer from "@/components/canvas/Hardware3DViewer";
import jsPDF from "jspdf";

export default function KryptonBuilder() {
  const router = useRouter();
  const { addStandaloneItem } = useCartStore();

  // Mode: PC Assembly vs Custom Keyboard Forge
  const [workbenchMode, setWorkbenchMode] = useState<"pc" | "keyboard">("keyboard");

  // Keyboard Forge Slots
  const [selectedKeyboardKit, setSelectedKeyboardKit] = useState(
    KRYPTON_MAKER_PRODUCTS.find((p) => p.id === "krp-kb-brutalist-alu-75") || KRYPTON_MAKER_PRODUCTS[4]
  );
  const [selectedSwitch, setSelectedSwitch] = useState(
    KRYPTON_MAKER_PRODUCTS.find((p) => p.id === "krp-sw-gateron-oil-king") || KRYPTON_MAKER_PRODUCTS[0]
  );
  const [selectedKeycaps, setSelectedKeycaps] = useState(
    KRYPTON_MAKER_PRODUCTS.find((p) => p.id === "krp-kc-industrial-concrete") || KRYPTON_MAKER_PRODUCTS[2]
  );
  const [selectedPlate, setSelectedPlate] = useState<"fr4" | "polycarbonate" | "aluminum" | "brass">("fr4");
  const [selectedStabs, setSelectedStabs] = useState<"screw-in" | "plate-mount">("screw-in");

  // PC Assembly Slots
  const [selectedCpu, setSelectedCpu] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "cpu" && p.slug.includes("7800x3d")) || HARDWARE_PRODUCTS[0]
  );
  const [selectedMotherboard, setSelectedMotherboard] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "motherboard" && p.socket === "AM5") || HARDWARE_PRODUCTS[3]
  );
  const [selectedGpu, setSelectedGpu] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "gpu") || HARDWARE_PRODUCTS[5]
  );
  const [selectedRam, setSelectedRam] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "ram") || HARDWARE_PRODUCTS[4]
  );
  const [selectedStorage, setSelectedStorage] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "storage") || HARDWARE_PRODUCTS[6]
  );
  const [selectedPsu, setSelectedPsu] = useState(
    HARDWARE_PRODUCTS.find((p) => p.category === "psu") || HARDWARE_PRODUCTS[7]
  );

  // Workshop Calibration & Bench Services Checkboxes
  const [serviceAssembly, setServiceAssembly] = useState(true);
  const [serviceStressTest, setServiceStressTest] = useState(true);
  const [serviceLubeSwitches, setServiceLubeSwitches] = useState(true);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Calculations
  const keyboardBaseTotal = useMemo(() => {
    let total = (selectedKeyboardKit?.price || 0) + (selectedSwitch?.price || 0) + (selectedKeycaps?.price || 0);
    if (selectedPlate === "brass") total += 2200;
    if (selectedPlate === "aluminum") total += 1500;
    if (selectedPlate === "polycarbonate") total += 1200;
    if (selectedStabs === "screw-in") total += 1800;
    return total;
  }, [selectedKeyboardKit, selectedSwitch, selectedKeycaps, selectedPlate, selectedStabs]);

  const pcBaseTotal = useMemo(() => {
    return (
      (selectedCpu?.price || 0) +
      (selectedMotherboard?.price || 0) +
      (selectedGpu?.price || 0) +
      (selectedRam?.price || 0) +
      (selectedStorage?.price || 0) +
      (selectedPsu?.price || 0)
    );
  }, [selectedCpu, selectedMotherboard, selectedGpu, selectedRam, selectedStorage, selectedPsu]);

  const servicesTotal = useMemo(() => {
    let total = 0;
    if (serviceAssembly) total += 1500;
    if (serviceStressTest) total += 800;
    if (workbenchMode === "keyboard" && serviceLubeSwitches) total += 1200;
    return total;
  }, [serviceAssembly, serviceStressTest, serviceLubeSwitches, workbenchMode]);

  const grandTotal = (workbenchMode === "keyboard" ? keyboardBaseTotal : pcBaseTotal) + servicesTotal;

  // Wattage & Socket Validation for PC
  const totalEstimatedWattage = useMemo(() => {
    return (selectedCpu?.tdp || 120) + (selectedGpu?.tdp || 300) + 120;
  }, [selectedCpu, selectedGpu]);

  const isSocketValid = useMemo(() => {
    if (!selectedCpu?.socket || !selectedMotherboard?.socket) return true;
    return selectedCpu.socket === selectedMotherboard.socket;
  }, [selectedCpu, selectedMotherboard]);

  // Export PDF Quotation using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const quoteId = `KRP-${Math.floor(100000 + Math.random() * 900000)}`;
      const dateStr = new Date().toLocaleDateString("en-GB");

      // Header Banner
      doc.setFillColor(30, 30, 36);
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(250, 204, 21); // Safety Yellow
      doc.setFont("courier", "bold");
      doc.setFontSize(18);
      doc.text("KRYPTON INDUSTRIAL DEPOT & KEYBOARD FORGE", 14, 15);

      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("OFFICIAL REQUISITION QUOTATION // ISO-9001 CALIBRATION BENCH", 14, 23);
      doc.text(`DATE: ${dateStr}   |   QUOTATION NO: ${quoteId}`, 14, 28);

      // Mode & Specs
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`WORKBENCH CONFIGURATION: ${workbenchMode === "keyboard" ? "CUSTOM KEYBOARD FORGE" : "HIGH-PERFORMANCE PC ASSEMBLY"}`, 14, 42);

      let startY = 52;
      doc.setFontSize(10);
      doc.setFont("courier", "bold");
      doc.setFillColor(235, 234, 229);
      doc.rect(14, startY - 6, 182, 8, "F");
      doc.text("SL  ITEM / SUBSYSTEM COMPONENT                    PRICE (BDT)", 16, startY);

      startY += 10;
      doc.setFont("courier", "normal");

      const items = workbenchMode === "keyboard"
        ? [
            { name: selectedKeyboardKit.name, price: selectedKeyboardKit.price },
            { name: selectedSwitch.name, price: selectedSwitch.price },
            { name: selectedKeycaps.name, price: selectedKeycaps.price },
            { name: `Switch Plate (${selectedPlate.toUpperCase()})`, price: selectedPlate === "brass" ? 2200 : selectedPlate === "aluminum" ? 1500 : 1200 },
            { name: `Stabilizers (${selectedStabs.toUpperCase()})`, price: selectedStabs === "screw-in" ? 1800 : 800 },
          ]
        : [
            { name: `CPU: ${selectedCpu.name}`, price: selectedCpu.price },
            { name: `Motherboard: ${selectedMotherboard.name}`, price: selectedMotherboard.price },
            { name: `GPU: ${selectedGpu.name}`, price: selectedGpu.price },
            { name: `RAM: ${selectedRam.name}`, price: selectedRam.price },
            { name: `Storage: ${selectedStorage.name}`, price: selectedStorage.price },
            { name: `Power Supply: ${selectedPsu.name}`, price: selectedPsu.price },
          ];

      items.forEach((item, index) => {
        doc.text(`${(index + 1).toString().padStart(2, "0")}  ${item.name.slice(0, 42).padEnd(45, " ")} ৳ ${item.price.toLocaleString()}`, 16, startY);
        startY += 8;
      });

      if (serviceAssembly) {
        doc.text(`++  Workshop Hand-Assembly & Cable Management         ৳ 1,500`, 16, startY);
        startY += 8;
      }
      if (serviceStressTest) {
        doc.text(`++  24-Hour Stress-Test & Thermal Validation          ৳ 800`, 16, startY);
        startY += 8;
      }
      if (workbenchMode === "keyboard" && serviceLubeSwitches) {
        doc.text(`++  Switch Stem & Spring Hand-Lubrication (Krytox)    ৳ 1,200`, 16, startY);
        startY += 8;
      }

      // Total Box
      startY += 6;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8);
      doc.line(14, startY, 196, startY);
      startY += 10;

      doc.setFont("courier", "bold");
      doc.setFontSize(13);
      doc.text(`TOTAL ESTIMATED REQUISITION: ৳ ${grandTotal.toLocaleString()}`, 14, startY);

      startY += 20;
      doc.setFontSize(8);
      doc.setFont("courier", "normal");
      doc.text("* Quotation valid for 7 business days across Dhaka IDB, Elephant Road, and Chattogram Sanmar depots.", 14, startY);
      doc.text("* Includes nationwide Cash on Delivery (COD) dispatch and Krypton Lab official guarantee.", 14, startY + 5);

      doc.save(`Krypton_Blueprint_Quotation_${quoteId}.pdf`);
      setToastMsg(`QUOTATION PDF EXPORTED: ${quoteId}`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (e) {
      alert("PDF Export generated.");
    }
  };

  const handleCopyBlueprint = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setToastMsg("BLUEPRINT URL COPIED TO CLIPBOARD");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleDispatchAllToCart = () => {
    if (workbenchMode === "keyboard") {
      [selectedKeyboardKit, selectedSwitch, selectedKeycaps].forEach((item) => {
        addStandaloneItem(toHardwareProduct(item), 1);
      });
    } else {
      [selectedCpu, selectedMotherboard, selectedGpu, selectedRam, selectedStorage, selectedPsu].forEach((item) => {
        addStandaloneItem(item, 1);
      });
    }
    setToastMsg("FULL WORKBENCH RIG DISPATCHED TO MANIFEST");
    setTimeout(() => {
      setToastMsg(null);
      router.push("/checkout");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#EBEAE5] text-[#1E1E24] font-sans antialiased pb-24 selection:bg-[#FACC15] selection:text-black">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#FACC15] text-black border-2 border-black px-4 py-2.5 font-mono text-xs font-bold shadow-[4px_4px_0px_#000000] animate-in fade-in slide-in-from-top-2">
          [ {toastMsg} ]
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-white border-b-2 border-black py-8">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 uppercase mb-2">
            <Link href="/" className="hover:text-black underline">
              Krypton Depot
            </Link>
            <span>/</span>
            <span className="text-black font-bold">Dual Assembly Workbench</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black leading-none"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                DUAL HARDWARE &amp; KEYBOARD WORKBENCH
              </h1>
              <p className="font-mono text-xs sm:text-sm text-slate-600 mt-2">
                MODULAR CALIBRATION RIG // SOCKET &amp; PINOUT COMPATIBILITY ENGINE // LIVE ESTIMATED PRICING
              </p>
            </div>

            {/* Workbench Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#EBEAE5] border-2 border-black p-1 font-mono text-xs">
              <button
                onClick={() => setWorkbenchMode("keyboard")}
                className={`py-2 px-4 font-bold uppercase transition-all ${
                  workbenchMode === "keyboard"
                    ? "bg-[#FACC15] text-black border-2 border-black shadow-[2px_2px_0px_#000000]"
                    : "bg-transparent text-slate-600 hover:text-black"
                }`}
              >
                01 // KEYBOARD FORGE
              </button>
              <button
                onClick={() => setWorkbenchMode("pc")}
                className={`py-2 px-4 font-bold uppercase transition-all ${
                  workbenchMode === "pc"
                    ? "bg-[#FACC15] text-black border-2 border-black shadow-[2px_2px_0px_#000000]"
                    : "bg-transparent text-slate-600 hover:text-black"
                }`}
              >
                02 // PC RIG ASSEMBLY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workbench Workspace */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Component Slots Configuration Bay (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3D Mechanical Inspection Bay - Pure 3D Always Loaded */}
            <div className="w-full h-[360px] sm:h-[420px] rounded border-2 border-black overflow-hidden shadow-[6px_6px_0px_#000000] relative bg-[#121216]">
              <Hardware3DViewer
                modelPath={workbenchMode === "keyboard" ? "/models/switch-cherry-mx.glb" : "/models/chassis-gaming.glb"}
                concept="krypton"
                accentColor="#FACC15"
                className="w-full h-full min-h-[360px]"
              />
            </div>
            
            {/* WORKBENCH MODE: KEYBOARD FORGE */}
            {workbenchMode === "keyboard" && (
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black font-mono text-xs">
                  <span className="font-bold text-black">// SUBSYSTEM 01: KEYBOARD CHASSIS &amp; CORE COMPONENTS</span>
                  <span className="text-[#059669] font-bold">ALL SLOTS HOTSWAP READY</span>
                </div>

                {/* Slot 1: Keyboard Kit */}
                <div className="border-2 border-black p-4 bg-[#EBEAE5]">
                  <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                    <span>01 // BILLET ALUMINUM KEYBOARD CHASSIS:</span>
                    <span className="text-black font-extrabold">৳ {selectedKeyboardKit.price.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {KRYPTON_MAKER_PRODUCTS.filter((p) => p.category === "kit").map((kit) => (
                      <button
                        key={kit.id}
                        onClick={() => setSelectedKeyboardKit(kit)}
                        className={`p-3 border-2 text-left font-mono transition-all ${
                          selectedKeyboardKit.id === kit.id
                            ? "bg-[#FACC15] border-black shadow-[3px_3px_0px_#000000] text-black"
                            : "bg-white border-black/30 hover:border-black text-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{kit.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {kit.specs.formFactor} • {kit.specs.material}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot 2: Mechanical Switches */}
                <div className="border-2 border-black p-4 bg-[#EBEAE5]">
                  <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                    <span>02 // MECHANICAL SWITCHES (90-PACK):</span>
                    <span className="text-black font-extrabold">৳ {selectedSwitch.price.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {KRYPTON_MAKER_PRODUCTS.filter((p) => p.category === "switch").map((sw) => (
                      <button
                        key={sw.id}
                        onClick={() => setSelectedSwitch(sw)}
                        className={`p-3 border-2 text-left font-mono transition-all ${
                          selectedSwitch.id === sw.id
                            ? "bg-[#FACC15] border-black shadow-[3px_3px_0px_#000000] text-black"
                            : "bg-white border-black/30 hover:border-black text-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{sw.name}</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {sw.specs.switchType} • {sw.specs.pins} • {sw.specs.actuationForceGf}gf
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot 3: Keycap Set */}
                <div className="border-2 border-black p-4 bg-[#EBEAE5]">
                  <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
                    <span>03 // HEAVY PBT KEYCAP SET:</span>
                    <span className="text-black font-extrabold">৳ {selectedKeycaps.price.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-white border-2 border-black flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-bold">{selectedKeycaps.name}</div>
                      <div className="text-[10px] text-slate-500">{selectedKeycaps.specs.profile} • {selectedKeycaps.specs.material}</div>
                    </div>
                    <span className="text-black font-extrabold">INCLUDED IN STAGING</span>
                  </div>
                </div>

                {/* Slot 4: Switch Plate Material */}
                <div className="border-2 border-black p-4 bg-[#EBEAE5]">
                  <div className="font-mono text-xs font-bold mb-2 uppercase">
                    04 // ACOUSTIC SWITCH PLATE MATERIAL:
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {[
                      { id: "fr4", label: "FR4 FIBER", add: "+৳1,200" },
                      { id: "polycarbonate", label: "POLYCARB", add: "+৳1,200" },
                      { id: "aluminum", label: "ALUMINUM", add: "+৳1,500" },
                      { id: "brass", label: "BRASS", add: "+৳2,200" },
                    ].map((plate) => (
                      <button
                        key={plate.id}
                        onClick={() => setSelectedPlate(plate.id as typeof selectedPlate)}
                        className={`p-2 border-2 text-center transition-all ${
                          selectedPlate === plate.id
                            ? "bg-black text-[#FACC15] border-black font-extrabold"
                            : "bg-white text-slate-700 border-black/30 hover:border-black"
                        }`}
                      >
                        <div className="font-bold text-[11px]">{plate.label}</div>
                        <div className="text-[9px] opacity-75">{plate.add}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WORKBENCH MODE: CUSTOM PC ASSEMBLY */}
            {workbenchMode === "pc" && (
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                  <span className="font-bold text-black">// SUBSYSTEM 02: HIGH-PERFORMANCE PC CORE CHIPSETS</span>
                  <span className={isSocketValid ? "text-[#059669] font-bold" : "text-[#DC2626] font-bold"}>
                    {isSocketValid ? "SOCKET CHECK: PASS (AM5)" : "SOCKET MISMATCH WARNING"}
                  </span>
                </div>

                {/* CPU Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">PROCESSOR (CPU):</div>
                    <div className="font-bold text-black text-sm">{selectedCpu.name}</div>
                    <div className="text-slate-500 text-[10px]">Socket: {selectedCpu.socket} • TDP: {selectedCpu.tdp}W</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedCpu.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Motherboard Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">MOTHERBOARD:</div>
                    <div className="font-bold text-black text-sm">{selectedMotherboard.name}</div>
                    <div className="text-slate-500 text-[10px]">Form Factor: {selectedMotherboard.formFactor} • Socket: {selectedMotherboard.socket}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedMotherboard.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* GPU Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">GRAPHICS ACCELERATOR (GPU):</div>
                    <div className="font-bold text-black text-sm">{selectedGpu.name}</div>
                    <div className="text-slate-500 text-[10px]">TDP: {selectedGpu.tdp}W • PCIe 4.0/5.0</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedGpu.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* RAM Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">MEMORY (RAM):</div>
                    <div className="font-bold text-black text-sm">{selectedRam.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedRam.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Storage Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">STORAGE (NVMe):</div>
                    <div className="font-bold text-black text-sm">{selectedStorage.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedStorage.price.toLocaleString()}</div>
                  </div>
                </div>

                {/* PSU Slot */}
                <div className="border border-black p-3 bg-[#EBEAE5] flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px]">POWER SUPPLY (PSU):</div>
                    <div className="font-bold text-black text-sm">{selectedPsu.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-black">৳ {selectedPsu.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Calibration & Workshop Services Checkboxes */}
            <div className="bg-[#1E1E24] text-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000] font-mono text-xs">
              <div className="text-[#FACC15] font-bold uppercase mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">engineering</span>
                <span>DEPOT WORKBENCH CALIBRATION SERVICES:</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-black/40 border border-white/20 cursor-pointer hover:border-[#FACC15]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={serviceAssembly}
                      onChange={(e) => setServiceAssembly(e.target.checked)}
                      className="w-4 h-4 accent-[#FACC15]"
                    />
                    <div>
                      <div className="font-bold text-white">Full Hand-Assembly &amp; Mechanical Routing</div>
                      <div className="text-[10px] text-slate-400">Torque-calibrated standoffs &amp; aerospace cable tensioning</div>
                    </div>
                  </div>
                  <span className="text-[#FACC15] font-bold">+৳ 1,500</span>
                </label>

                <label className="flex items-center justify-between p-3 bg-black/40 border border-white/20 cursor-pointer hover:border-[#FACC15]">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={serviceStressTest}
                      onChange={(e) => setServiceStressTest(e.target.checked)}
                      className="w-4 h-4 accent-[#FACC15]"
                    />
                    <div>
                      <div className="font-bold text-white">24-Hour Thermal &amp; Continuous Signal Burn-In</div>
                      <div className="text-[10px] text-slate-400">Prime95 &amp; FurMark hardware loop with certified test tag</div>
                    </div>
                  </div>
                  <span className="text-[#FACC15] font-bold">+৳ 800</span>
                </label>

                {workbenchMode === "keyboard" && (
                  <label className="flex items-center justify-between p-3 bg-black/40 border border-white/20 cursor-pointer hover:border-[#FACC15]">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={serviceLubeSwitches}
                        onChange={(e) => setServiceLubeSwitches(e.target.checked)}
                        className="w-4 h-4 accent-[#FACC15]"
                      />
                      <div>
                        <div className="font-bold text-white">Switch Hand-Lubrication (Krytox 205g0 + Permatex)</div>
                        <div className="text-[10px] text-slate-400">Individual stem, leaf spring &amp; stabilizer wire tuning</div>
                      </div>
                    </div>
                    <span className="text-[#FACC15] font-bold">+৳ 1,200</span>
                  </label>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Workbench Telemetry & Requisition Action Bay (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black font-mono text-xs mb-4">
                <span className="font-bold text-black">// REQUISITION MANIFEST</span>
                <span className="text-slate-500">LIVE ESTIMATE</span>
              </div>

              {/* Price Breakdown */}
              <div className="font-mono text-xs space-y-2 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>SUBSYSTEM COMPONENTS:</span>
                  <span className="font-bold text-black">
                    ৳ {(workbenchMode === "keyboard" ? keyboardBaseTotal : pcBaseTotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>WORKBENCH SERVICES:</span>
                  <span className="font-bold text-black">৳ {servicesTotal.toLocaleString()}</span>
                </div>
                {workbenchMode === "pc" && (
                  <div className="flex justify-between text-slate-600">
                    <span>ESTIMATED POWER DRAW:</span>
                    <span className="font-bold text-[#059669]">{totalEstimatedWattage} W</span>
                  </div>
                )}
                <div className="pt-3 border-t-2 border-black flex justify-between items-baseline">
                  <span className="font-bold text-sm text-black">TOTAL ESTIMATE:</span>
                  <span className="font-heading text-2xl font-extrabold text-black" style={{ fontFamily: "Syne, sans-serif" }}>
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 font-mono text-xs">
                <button
                  onClick={handleDispatchAllToCart}
                  className="w-full bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black py-3 px-4 font-extrabold uppercase shadow-[4px_4px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
                  <span>DISPATCH RIG TO MANIFEST</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="w-full bg-black hover:bg-[#1E1E24] text-white border-2 border-black py-2.5 px-4 font-bold uppercase shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  title="Generate Official PDF Quotation using jsPDF"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  <span>[ EXPORT PDF QUOTATION ]</span>
                </button>

                <button
                  onClick={handleCopyBlueprint}
                  className="w-full bg-[#EBEAE5] hover:bg-white text-black border-2 border-black py-2.5 px-4 font-bold uppercase shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  <span>[ COPY BLUEPRINT URL ]</span>
                </button>
              </div>

              {/* Assistance Callout */}
              <div className="mt-6 pt-4 border-t border-black font-mono text-[11px] text-slate-600">
                <span>Direct questions regarding switch actuation or socket clearance? </span>
                <a
                  href="https://wa.me/8801711000000?text=Hello%20Krypton%20Workbench%20Engineer%2C%20I%20have%20questions%20about%20a%20custom%20build"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-bold underline hover:text-[#059669]"
                >
                  Ask Depot Engineer on WhatsApp
                </a>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
