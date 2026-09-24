"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { HARDWARE_PRODUCTS, getProductBySlug, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";
import { useBuilderStore, BuilderSlotKey } from "@/store/useBuilderStore";

// Dynamically import 3D WebGL component
const ComponentViewer3D = dynamic(
  () => import("@/components/canvas/ComponentViewer3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 bg-slate-950 rounded flex items-center justify-center text-slate-400 font-mono text-[12px]">
        Loading Interactive 3D Component Orbit Engine...
      </div>
    ),
  }
);

const Hardware3DViewer = dynamic(
  () => import("@/components/canvas/Hardware3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 sm:h-96 bg-slate-950 rounded flex items-center justify-center text-slate-400 font-mono text-[12px]">
        Loading Interactive 3D Model...
      </div>
    ),
  }
);

export default function VoltMatrixPDP({ product: propProduct }: { product?: HardwareProduct } = {}) {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "amd-ryzen-7-7800x3d";

  const product = propProduct || getProductBySlug(slug) || HARDWARE_PRODUCTS[0];

  const { addStandaloneItem } = useCartStore();
  const { setSlot } = useBuilderStore();

  const [activeTab, setActiveTab] = useState<
    "specs" | "clearance" | "benchmarks" | "pairings" | "reviews"
  >("specs");
  const [selectedGalleryThumb, setSelectedGalleryThumb] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddToCart = () => {
    addStandaloneItem(product, 1);
    setFeedback("Added to Modular Cart!");
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleInstantCod = () => {
    addStandaloneItem(product, 1);
    router.push("/checkout");
  };

  const handleInsertIntoBuilder = () => {
    const catMap: Record<string, BuilderSlotKey> = {
      cpu: "cpu",
      motherboard: "motherboard",
      cooler: "cooler",
      ram: "ram",
      storage: "storage",
      gpu: "gpu",
      psu: "psu",
      chassis: "chassis",
      peripherals: "peripherals",
    };
    const slot = catMap[product.category] || "cpu";
    setSlot(slot, product);
    router.push("/pc-builder");
  };

  const galleryImages = [
    { label: "3D CAD Model", type: "3d" },
    {
      label: "Front IHS Ortho",
      img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "LGA1718 Pinout",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Exploded Silicon",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1000&q=80",
    },
    {
      label: "Retail Package",
      img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-32 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl font-mono text-[12px] flex items-center gap-2 border border-slate-700 animate-pulse">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT 6 COLS: 3D CAD ORBIT & MEDIA GALLERY ================= */}
          <div className="xl:col-span-6 space-y-4">
            {/* Primary Viewport Display: Pure 3D Hardware Model Viewport (Full-bleed, Always Loaded) */}
            <div className="w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <Hardware3DViewer
                concept="voltmatrix"
                modelPath={
                  product.category === "gpu"
                    ? "/models/gpu-rtx4090.glb"
                    : product.category === "ram"
                      ? "/models/ram-corsair.glb"
                      : product.category === "chassis"
                        ? "/models/chassis-gaming.glb"
                        : product.category === "motherboard"
                          ? "/models/motherboard-atx.glb"
                          : "/models/cpu-threadripper.glb"
                }
                accentColor="#EF4444"
                className="w-full h-full"
              />
            </div>

            {/* Thumbnail & CAD Geometry Selectors */}
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedGalleryThumb(idx)}
                  className={`p-1 bg-white rounded border text-left transition-all flex flex-col gap-1 shadow-sm ${
                    selectedGalleryThumb === idx
                      ? "border-[#EF4444] ring-1 ring-red-400"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="aspect-square bg-slate-50 rounded flex items-center justify-center overflow-hidden">
                    {idx === 0 ? (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white p-1">
                        <span className="material-symbols-outlined text-[18px] text-[#EF4444]">360</span>
                        <span className="font-mono text-[7.5px]">3D CAD</span>
                      </div>
                    ) : idx === 1 ? (
                      <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-white p-1">
                        <span className="material-symbols-outlined text-[18px] text-emerald-400 animate-pulse">view_in_ar</span>
                        <span className="font-mono text-[7.5px] text-emerald-400">.GLB 3D</span>
                      </div>
                    ) : (
                      <img src={thumb.img} alt={thumb.label} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-slate-700 truncate px-0.5">
                    {thumb.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Mechanical PDF Drawing Action */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-800 text-[12px]">
                <span className="material-symbols-outlined text-[#b61722] text-[18px]">
                  download_for_offline
                </span>
                <span>
                  Technical Drawings &amp; Thermal Envelope: <strong>MD-AMD-7800X3D-REV3.pdf</strong>
                </span>
              </div>
              <a
                href="#specs"
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-mono text-[10.5px] rounded border border-slate-200 transition-colors flex items-center gap-1"
              >
                <span>2.8 MB PDF</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          {/* ================= RIGHT 6 COLS: COMMERCIAL & TRANSACTION CONTAINER ================= */}
          <div className="xl:col-span-6 space-y-4">
            {/* Breadcrumb Path */}
            <div className="flex items-center flex-wrap gap-1 font-mono text-[10.5px] text-slate-500 uppercase">
              <Link href="/catalog" className="hover:text-[#EF4444] transition-colors">Catalog</Link>
              <span>/</span>
              <span className="hover:text-[#EF4444] cursor-pointer">Microprocessors</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">{product.name}</span>
            </div>

            {/* Product Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-[10.5px] rounded border border-slate-200">
                Item Code: <strong className="text-slate-900 font-bold">{product.sku}</strong>
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono text-[10.5px] rounded border border-slate-200 flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">verified</span>
                <span>Genuine S/N Verified</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10.5px] rounded border border-emerald-200 font-bold">
                {product.warranty}
              </span>
            </div>

            {/* Ratings & Technical Questions */}
            <div className="flex items-center gap-3 py-1 text-[12px]">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500">
                  {"★★★★★"}
                </div>
                <span className="font-mono text-[13px] font-bold text-slate-900">4.9</span>
                <span className="text-slate-500 text-[11px]">(142 verified benchmark logs)</span>
              </div>
              <span className="text-slate-300">•</span>
              <a href="#qa" className="text-[#b61722] hover:underline flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[15px]">forum</span>
                <span>38 Answered Tech Questions</span>
              </a>
            </div>

            {/* Pricing Card & Financing */}
            <div className="p-4 bg-white rounded border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[28px] text-[#b61722] font-bold">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-[14px] text-slate-400 line-through">
                    ৳{product.regularPrice.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-[#b61722] font-mono text-[10.5px] rounded font-bold">
                    SAVE ৳{(product.regularPrice - product.price).toLocaleString()} (-5%)
                  </span>
                </div>
                <div className="font-mono text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>SPECIAL CASH/BANK TARIFF</span>
                </div>
              </div>

              {/* Monthly Installment Calculator Matrix */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">credit_card</span>
                  <span className="text-slate-800">
                    Or <strong>৳{Math.round(product.price / 12).toLocaleString()}/mo</strong> (12-Month Zero-Interest Installments on 18 partner banks)
                  </span>
                </div>
                <button
                  onClick={() => alert("18 Partner Banks Supported: City Bank, EBL, SCB, BRAC, MTB, Prime Bank, etc.")}
                  className="font-mono text-[11px] text-[#b61722] font-bold hover:underline whitespace-nowrap"
                >
                  Installment Calculator &gt;
                </button>
              </div>
            </div>

            {/* Omnichannel Real-Time Regional Branch Stock */}
            <div className="bg-white rounded border border-slate-200 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-headline font-semibold text-[13px] text-slate-900 uppercase tracking-tight">
                  Real-Time Regional Stock Verification
                </span>
                <span className="font-mono text-[10px] text-slate-400">UPDATED 3 MINS AGO</span>
              </div>

              {/* Node 1 */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-800">Central Logistics Hub (Savar)</span>
                </div>
                <div className="font-mono text-[11px] flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">{product.branchStock.central} UNITS IN STOCK</span>
                  <span className="text-slate-400">Dispatches &lt; 24h</span>
                </div>
              </div>

              {/* Node 2 */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium text-slate-800">Dhaka IDB Bhaban Branch</span>
                </div>
                <div className="font-mono text-[11px] flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">{product.branchStock.idb} UNITS</span>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                    Ready for 2-Hr Express Pickup
                  </span>
                </div>
              </div>

              {/* Node 3 */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-medium text-slate-800">Multiplan Center, Elephant Rd</span>
                </div>
                <div className="font-mono text-[11px] flex items-center gap-2">
                  <span className="text-amber-700 font-bold">{product.branchStock.multiplan} UNITS LEFT</span>
                  <span className="text-slate-500">Counter Pickup</span>
                </div>
              </div>

              {/* Node 4 */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-medium text-slate-800">Chittagong GEC Sanmar Branch</span>
                </div>
                <div className="font-mono text-[11px] flex items-center gap-2">
                  <span className="text-amber-700 font-bold">{product.branchStock.chittagong} UNIT LEFT</span>
                  <span className="text-slate-500">Floor Display</span>
                </div>
              </div>
            </div>

            {/* Action Cluster Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="h-11 px-4 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-[13px] uppercase font-bold tracking-tight flex items-center justify-center gap-2 shadow transition-all active:translate-y-px"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleInstantCod}
                  className="h-11 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-mono text-[13px] uppercase font-bold tracking-tight flex items-center justify-center gap-2 shadow transition-all active:translate-y-px"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Instant COD Order</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleInsertIntoBuilder}
                  className="h-9 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded font-mono text-[11px] font-bold border border-slate-200 flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#EF4444]">developer_board</span>
                  <span>Configure in Custom PC Builder</span>
                </button>

                <a
                  href={`https://wa.me/8801700000000?text=Hello%20VoltMatrix%20Engineer,%20I%20have%20a%20technical%20question%20regarding%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 px-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-800 rounded font-mono text-[11px] font-bold border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                  <span>WhatsApp Lead Engineer</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOWER SECTION: TABBED ENGINEERING MATRIX ================= */}
        <div className="w-full bg-white rounded border border-slate-200 mt-12 shadow-sm" id="specs">
          {/* Sticky Tab Navigation */}
          <div className="sticky top-28 z-40 bg-white border-b border-slate-200 px-4 flex items-center overflow-x-auto py-2 gap-4 text-[12px] font-mono">
            {[
              { id: "specs", label: "Full Specifications & Performance" },
              { id: "clearance", label: "Motherboard Fit & Cooler Sizing" },
              { id: "benchmarks", label: "Real-World Benchmarks & Heat Tests" },
              { id: "pairings", label: "Verified Motherboard & Memory Pairings" },
              { id: "reviews", label: "Verified Customer Reviews (142)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Parametric Specs */}
          {activeTab === "specs" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <h2 className="font-headline font-bold text-lg text-slate-900 uppercase tracking-tight">
                      Detailed Hardware &amp; Performance Specs
                    </h2>
                    <p className="text-[12px] text-slate-500 font-mono">
                      Exact performance measurements verified for compatibility and build stability.
                    </p>
                  </div>

                  {/* Dense Specification Grid Table */}
                  <div className="rounded border border-slate-200 overflow-hidden text-[12px]">
                    <div className="divide-y divide-slate-100">
                      {[
                        { label: "Processor Architecture", val: "Zen 4 (High-Efficiency Core Design)" },
                        { label: "Physical Cores & Multi-Tasks", val: "8 Cores / 16 Multi-Tasking Channels" },
                        { label: "Base Speed", val: "4.20 GHz" },
                        { label: "Peak Burst Speed", val: "Up to 5.00 GHz (Single Core Peak)" },
                        { label: "Game-Boosting Instant Memory (L3 Cache)", val: "96 MB 3D V-Cache (Directly Bonded)" },
                        { label: "Total On-Chip Cache Memory", val: "512 KB (L1) + 8 MB (L2) + 96 MB (L3) = 104.5 MB" },
                        { label: "Power & Heat Output (Watts)", val: `${product.tdp}W (Package Power Target: 162W)` },
                        { label: "Maximum Safe Operating Temp", val: "89°C (Automatic Thermal Guard)" },
                        { label: "Microscopic Silicon Process", val: "TSMC 5nm High-Efficiency Process" },
                        { label: "Supported System Memory (RAM)", val: "DDR5 Dual Channel up to 5200 MT/s Native (6000+ EXPO)" },
                        { label: "High-Speed Expansion Slots (PCIe)", val: "PCIe 5.0 (28 total lanes: 24 usable for GPU & NVMe)" },
                        { label: "Built-In Display Graphics", val: "AMD Radeon RDNA 2 (2 CU, 2200 MHz)" },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-12 p-2.5 items-center ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <span className="col-span-5 text-slate-500 font-sans">{row.label}</span>
                          <span className="col-span-7 font-mono font-bold text-slate-900">{row.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Callout Card */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-headline font-semibold text-[14px]">
                      <span className="material-symbols-outlined text-[#EF4444]">memory</span>
                      <span>3D V-Cache Game Memory Architecture</span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed font-sans">
                      The game cache memory is stacked directly on top of the processor cores, giving the chip instant 2.5 TB/s data access with zero waiting time during intense gaming.
                    </p>
                    <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-[11px] space-y-1">
                      <div className="text-slate-500">SRAM Layer Thickness: <strong>~20 Microns</strong></div>
                      <div className="text-slate-500">Structural Silicon Balance: <strong>Equilateral</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Clearance Validator */}
          {activeTab === "clearance" && (
            <div className="p-6 space-y-4">
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Motherboard Fit &amp; Cooler Sizing Validator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px]">
                <div className="p-4 bg-emerald-50 text-emerald-950 rounded border border-emerald-200">
                  <div className="font-bold text-[13px] flex items-center gap-1.5 mb-1 text-emerald-800">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Cooler Mounting</span>
                  </div>
                  <span>100% AM4 bracket backwards compatibility verified. Fits all standard 240mm/360mm liquid and air coolers.</span>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-950 rounded border border-emerald-200">
                  <div className="font-bold text-[13px] flex items-center gap-1.5 mb-1 text-emerald-800">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Memory Module Clearance</span>
                  </div>
                  <span>Compatible with low-profile and tall RGB heatsinks (up to 44mm height).</span>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-950 rounded border border-emerald-200">
                  <div className="font-bold text-[13px] flex items-center gap-1.5 mb-1 text-emerald-800">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>PCIe Slot Clearance</span>
                  </div>
                  <span>No interference with Top Gen5 M.2 heatsinks on B650 and X870 motherboards.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Benchmarks */}
          {activeTab === "benchmarks" && (
            <div className="p-6 space-y-4">
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Real-World Gaming &amp; Power Benchmarks
              </h3>
              <div className="space-y-3 font-mono text-[12px]">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Cyberpunk 2077 (1080p Ultra RT)</span>
                    <span className="font-bold text-[#b61722]">148 FPS Avg</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                    <div className="bg-[#EF4444] h-full w-[96%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Counter-Strike 2 (1440p Competitive)</span>
                    <span className="font-bold text-[#b61722]">485 FPS Avg</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                    <div className="bg-[#EF4444] h-full w-[98%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Full-Load Maximum Power Draw</span>
                    <span className="font-bold text-emerald-600">82W (Extremely Efficient)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[42%]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Pairings */}
          {activeTab === "pairings" && (
            <div className="p-6 space-y-4">
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Verified Motherboard &amp; Memory Pairings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="font-headline font-semibold text-[14px]">Recommended Motherboard:</div>
                  <div className="font-mono text-[13px] text-[#b61722] font-bold">MSI MAG B650 TOMAHAWK WIFI</div>
                  <div className="text-[12px] text-slate-600">Heavy-duty clean power delivery handles 7800X3D without exceeding safe operating temperatures.</div>
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="font-headline font-semibold text-[14px]">Recommended Memory (RAM) Kit:</div>
                  <div className="font-mono text-[13px] text-[#b61722] font-bold">Corsair Vengeance 32GB DDR5-6000 CL30</div>
                  <div className="text-[12px] text-slate-600">Optimal synchronized speed ratio for ultra-low response times and smooth frame rates.</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Reviews */}
          {activeTab === "reviews" && (
            <div className="p-6 space-y-3">
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Verified Customer Reviews (142)
              </h3>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[12px] space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <strong className="text-slate-900">Nabil Rahman (Dhaka IDB In-Store Pickup)</strong>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-slate-600">
                  &ldquo;Collected from IDB shop in 40 minutes. Tested on bench with Furmark and Cinebench. Ambient idle is 38C on DeepCool LS720. Flawless silicon.&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
