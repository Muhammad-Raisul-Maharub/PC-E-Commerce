"use client";

import React, { useState } from "react";
import Link from "next/link";
import WorkstationClay3DScene from "@/components/canvas/WorkstationClay3DScene";
import { TURNKEY_WORKSTATIONS, ENTERPRISE_ASSET_URLS, TurnkeyWorkstationPlatform } from "@/data/mockProducts";
import { useCartStore } from "@/store/useCartStore";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";

export default function AxiomHome() {
  const [activeWorkflow, setActiveWorkflow] = useState<"ai" | "davinci" | "cad" | "analytics">("ai");
  const [serialQuery, setSerialQuery] = useState("");
  const [serialResult, setSerialResult] = useState<{
    valid: boolean;
    model?: string;
    warrantyUntil?: string;
    sla?: string;
    distributor?: string;
  } | null>(null);

  const { addStandaloneItem } = useCartStore();

  const currentPlatform: TurnkeyWorkstationPlatform =
    TURNKEY_WORKSTATIONS.find((w) => w.targetWorkflow === activeWorkflow) ||
    TURNKEY_WORKSTATIONS[0];

  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialQuery.trim()) return;

    if (serialQuery.toUpperCase().startsWith("AXM") || serialQuery.toUpperCase().startsWith("TR") || serialQuery.length >= 6) {
      setSerialResult({
        valid: true,
        model: "Axiom R9600 Enterprise Node (SN: " + serialQuery.toUpperCase() + ")",
        warrantyUntil: "October 18, 2031 (5-Year Direct Replacement)",
        sla: "4-Hour On-Site Critical Mission Response (Dhaka / Ctg)",
        distributor: "Smart Technologies / Axiom Enterprise Direct BD",
      });
    } else {
      setSerialResult({
        valid: false,
      });
    }
  };

  const handleProcureTurnkey = (platform: TurnkeyWorkstationPlatform) => {
    // Add representative enterprise product to cart
    const refProduct = HARDWARE_PRODUCTS.find((p) => p.id === "cpu-threadripper-7995wx") || HARDWARE_PRODUCTS[0];
    addStandaloneItem(refProduct, 1);
    alert(`Added [${platform.name}] turn-key configuration to your corporate procurement cart.`);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans">
      {/* 1. Hero Tier: 55/45 Split with 3D Architectural Clay Viewer */}
      <section className="border-b border-[#E4E4E7] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Top Breadcrumb / Classification Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E4E4E7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#004F32]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#004F32]">
                Axiom Pro // System Platform Architecture
              </span>
              <span className="text-[#A1A1AA]">/</span>
              <span className="font-mono text-xs text-[#71717A]">ISO/IEC 27001 Certified Workstation Lab</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#52525B]">
              <span>ECC REGISTERED DDR5</span>
              <span>•</span>
              <span>128 PCIE 5.0 LANES</span>
              <span>•</span>
              <span className="font-semibold text-[#004F32]">WHISPER &lt;31 dBA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 55% Column: Architectural Typography & Enterprise Value */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] font-mono text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                <span>Next-Gen Threadripper PRO 7000WX &amp; Dual RTX Ada</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#18181B] leading-[1.12]">
                Architectural Computing For Mission-Critical Workloads.
              </h1>

              <p className="text-base sm:text-lg text-[#52525B] max-w-2xl leading-relaxed">
                Precision-machined enterprise workstations and studio render nodes. Custom built for generative AI fine-tuning, 8K DaVinci cinema finishing, and parametric BIM simulation in Dhaka &amp; Chittagong.
              </p>

              {/* Parametric Key Metric Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10.5px] uppercase text-[#71717A]">Compute Density</div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#18181B] mt-0.5">96 Cores</div>
                  <div className="font-mono text-[10px] text-[#004F32] font-semibold mt-0.5">192 Threads / sTR5</div>
                </div>
                <div className="p-3.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10.5px] uppercase text-[#71717A]">Memory Subsystem</div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#18181B] mt-0.5">2 TB Max</div>
                  <div className="font-mono text-[10px] text-[#004F32] font-semibold mt-0.5">8-Ch RDIMM ECC</div>
                </div>
                <div className="p-3.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10.5px] uppercase text-[#71717A]">PCIe Bandwidth</div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#18181B] mt-0.5">128 Lanes</div>
                  <div className="font-mono text-[10px] text-[#2563EB] font-semibold mt-0.5">PCIe 5.0 Direct Bus</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/pc-builder"
                  className="px-6 py-3 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">precision_manufacturing</span>
                  <span>[ Configure Custom Workstation ]</span>
                </Link>
                <Link
                  href="/catalog"
                  className="px-6 py-3 rounded bg-white hover:bg-slate-50 border border-[#E4E4E7] text-[#18181B] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  View Infrastructure Directory →
                </Link>
              </div>
            </div>

            {/* Right 45% Column: 3D CAD Clay Workstation Viewer */}
            <div className="lg:col-span-5 w-full h-[520px] sm:h-[580px]">
              <WorkstationClay3DScene heightClass="h-full w-full" showCameraToggle={true} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive "Workflow Switcher" Tab Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#004F32] mb-1">
              Engineered Workload Profiles
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18181B]">
              Interactive Workflow Switcher
            </h2>
          </div>
          <p className="text-sm text-[#71717A] max-w-md">
            Select an industry discipline to dynamically reconfigure the platform topology, PCIe lane budget, and memory fabric.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {[
            { id: "ai", label: "AI & Deep Learning", icon: "neurology", subtitle: "LLM Fine-Tuning & FP8" },
            { id: "davinci", label: "DaVinci 8K Post", icon: "movie", subtitle: "Raw Color & VFX" },
            { id: "cad", label: "SolidWorks & CAD", icon: "architecture", subtitle: "FEA Simulation & BIM" },
            { id: "analytics", label: "Data Analytics", icon: "query_stats", subtitle: "In-Memory HFT Cluster" },
          ].map((tab) => {
            const isActive = activeWorkflow === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkflow(tab.id as any)}
                className={`p-4 rounded border text-left transition-all relative ${
                  isActive
                    ? "bg-[#004F32] text-white border-[#004F32] shadow-md"
                    : "bg-white text-[#18181B] border-[#E4E4E7] hover:border-[#004F32] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-xl">
                    {tab.icon}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-[#ADF1C9]" : "bg-slate-300"
                    }`}
                  />
                </div>
                <div className="font-mono text-sm font-bold">{tab.label}</div>
                <div
                  className={`text-xs mt-0.5 ${
                    isActive ? "text-emerald-100" : "text-[#71717A]"
                  }`}
                >
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Workflow Platform Detail Panel */}
        <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Platform Specifications */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ECFDF5] text-[#004F32] font-bold border border-[#ADF1C9]">
                  {currentPlatform.codename}
                </span>
                <span className="font-mono text-xs text-[#71717A]">
                  ISV-Validated Turnkey Platform
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
                  {currentPlatform.name}
                </h3>
                <p className="text-sm text-[#52525B] mt-1">
                  {currentPlatform.tagline}
                </p>
              </div>

              {/* Hardware Spec Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">PROCESSOR</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">{currentPlatform.specs.cpu}</span>
                </div>
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">GRAPHICS / ACCELERATOR</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">{currentPlatform.specs.gpu}</span>
                </div>
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">SYSTEM MEMORY</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">{currentPlatform.specs.ram}</span>
                </div>
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">STORAGE SUBSYSTEM</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">{currentPlatform.specs.storage}</span>
                </div>
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">CHASSIS &amp; POWER</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">{currentPlatform.specs.chassis}</span>
                </div>
                <div className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7]">
                  <span className="font-mono text-[#71717A] block">PCIE TOPOLOGY</span>
                  <span className="font-semibold text-[#2563EB] mt-0.5 block">{currentPlatform.specs.pcieBandwidth}</span>
                </div>
              </div>

              {/* ISV Certifications */}
              <div>
                <span className="font-mono text-[11px] text-[#71717A] uppercase block mb-1.5 font-semibold">
                  Certified ISV Software Ecosystem:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPlatform.metrics.isvCertified.map((isv) => (
                    <span
                      key={isv}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-[#E4E4E7] font-mono text-[10.5px] font-semibold text-[#18181B]"
                    >
                      ✓ {isv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Turnkey Price & Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7]">
                <div>
                  <span className="font-mono text-[11px] text-[#71717A] block uppercase">Turnkey Base Price</span>
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#004F32]">
                    ৳{currentPlatform.basePrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#71717A] block font-mono">Includes 5-Year Enterprise SLA + 72h Burn-in</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleProcureTurnkey(currentPlatform)}
                    className="px-5 py-2.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Procure System
                  </button>
                  <Link
                    href="/pc-builder"
                    className="px-5 py-2.5 rounded border border-[#E4E4E7] bg-white hover:bg-slate-50 text-[#18181B] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Customize in Builder
                  </Link>
                </div>
              </div>
            </div>

            {/* Platform Visual & Telemetry Metrics */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl overflow-hidden border border-[#E4E4E7] bg-slate-900/5 aspect-[4/3] relative group">
                <img
                  src={currentPlatform.image}
                  alt={currentPlatform.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white font-mono text-xs">
                  <span>{currentPlatform.codename}</span>
                  <span className="px-2 py-0.5 rounded bg-[#004F32] text-white text-[10px] font-bold">
                    ACTIVE INVENTORY
                  </span>
                </div>
              </div>

              {/* 3 Metric Gauges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10px] text-[#71717A] uppercase">FP16 Compute</div>
                  <div className="font-mono text-base font-bold text-[#18181B]">{currentPlatform.metrics.fp16Tflops} TFLOPS</div>
                </div>
                <div className="p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10px] text-[#71717A] uppercase">Mem Bandwidth</div>
                  <div className="font-mono text-base font-bold text-[#2563EB]">{currentPlatform.metrics.memoryBandwidthGBs} GB/s</div>
                </div>
                <div className="p-2.5 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-[10px] text-[#71717A] uppercase">Noise Level</div>
                  <div className="font-mono text-base font-bold text-[#004F32]">{currentPlatform.metrics.acousticLevelDba} dBA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Authorized Distributor Credentials & Serial Warranty Verification Box */}
      <section className="border-t border-[#E4E4E7] bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Authorized Importer Credentials */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#004F32] mb-1">
                  Verified Tier-1 Channel Partners
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-[#18181B]">
                  Authorized Distributor Credentials
                </h3>
              </div>

              <p className="text-sm text-[#52525B] leading-relaxed">
                All Axiom Pro workstations are built with officially imported hardware through authorized national distributors (Smart Technologies BD, UCC, Excel Technologies). Every system is accompanied by official Mushak-6.3 VAT tax invoices and 3 to 5 years manufacturer replacement warranties.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-xs font-bold text-[#18181B]">AMD Enterprise</div>
                  <div className="text-[11px] text-[#71717A]">Threadripper Pro Partner</div>
                  <div className="font-mono text-[10px] text-[#004F32] mt-1 font-semibold">Tier-1 Direct</div>
                </div>
                <div className="p-3 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-xs font-bold text-[#18181B]">NVIDIA Elite</div>
                  <div className="text-[11px] text-[#71717A]">Workstation &amp; AI Provider</div>
                  <div className="font-mono text-[10px] text-[#004F32] mt-1 font-semibold">Authorized OEM</div>
                </div>
                <div className="p-3 rounded border border-[#E4E4E7] bg-[#FBFBFD]">
                  <div className="font-mono text-xs font-bold text-[#18181B]">Supermicro</div>
                  <div className="text-[11px] text-[#71717A]">Rack &amp; Server Infrastructure</div>
                  <div className="font-mono text-[10px] text-[#004F32] mt-1 font-semibold">Certified Integrator</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-[#18181B] block">Enterprise Corporate Desk (Motijheel HQ)</span>
                  <span className="text-[#71717A]">Ground Floor, 42 Dilkusha Commercial Area, Dhaka 1000</span>
                </div>
                <a
                  href="https://wa.me/8801700000000"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-[#004F32] text-white font-mono text-[11px] font-bold uppercase whitespace-nowrap"
                >
                  Contact Desk
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Serial Warranty Verification Box */}
            <div className="lg:col-span-6 rounded-xl border border-[#E4E4E7] bg-[#FBFBFD] p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#004F32]">verified</span>
                <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-[#18181B]">
                  Official Warranty &amp; SLA Verification
                </h4>
              </div>
              <p className="text-xs text-[#71717A] mb-4">
                Enter your Axiom Pro system serial number or component barcode to verify genuine importer origin and enterprise warranty coverage.
              </p>

              <form onSubmit={handleVerifySerial} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={serialQuery}
                    onChange={(e) => setSerialQuery(e.target.value)}
                    placeholder="e.g. AXM-7995-88219 or TR-96C-BD"
                    className="flex-1 h-10 px-3 rounded border border-[#E4E4E7] bg-white text-xs font-mono text-[#18181B] placeholder:text-[#A1A1AA] focus:border-[#004F32] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 h-10 rounded bg-[#18181B] hover:bg-[#27272A] text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </form>

              {/* Result Container */}
              {serialResult && (
                <div className="mt-4 p-4 rounded border text-xs animate-in fade-in duration-200">
                  {serialResult.valid ? (
                    <div className="space-y-2 border-[#ADF1C9] bg-[#ECFDF5] text-[#004F32] p-3 rounded">
                      <div className="flex items-center gap-1.5 font-bold font-mono">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span>OFFICIAL AUTHENTICATED SYSTEM</span>
                      </div>
                      <div className="text-slate-800 space-y-1 font-mono text-[11px]">
                        <div><span className="text-[#71717A]">Unit:</span> {serialResult.model}</div>
                        <div><span className="text-[#71717A]">Warranty:</span> {serialResult.warrantyUntil}</div>
                        <div><span className="text-[#71717A]">Channel:</span> {serialResult.distributor}</div>
                        <div><span className="text-[#71717A]">SLA Response:</span> {serialResult.sla}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 border-red-200 bg-red-50 text-red-700 p-3 rounded font-mono">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="material-symbols-outlined text-base">error</span>
                        <span>Serial Record Not Found</span>
                      </div>
                      <p className="text-[11px] text-red-600 font-sans">
                        Please check the serial tag affixed to your chassis rear I/O plate, or contact our Motijheel B2B hotline for manual lookup.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Sample serial helper */}
              <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                <span>Sample demo serial:</span>
                <button
                  onClick={() => setSerialQuery("AXM-7995-88219")}
                  className="text-[#004F32] hover:underline font-bold"
                >
                  AXM-7995-88219
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
