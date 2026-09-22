"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HardwareProduct } from "@/data/hardwareDatabase";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useCartStore } from "@/store/useCartStore";
import SynapseBoundingBox3DScene from "@/components/canvas/SynapseBoundingBox3DScene";

interface SynapsePDPProps {
  product: HardwareProduct;
}

export default function SynapsePDP({ product }: SynapsePDPProps) {
  const router = useRouter();
  const { setSlot } = useBuilderStore();
  const { addStandaloneItem } = useCartStore();

  // Extract dimensions or supply calibrated defaults
  const productLength = product.cadSpecs?.lengthMm || 304;
  const productHeight = product.cadSpecs?.heightMm || 137;
  const productThickness = product.cadSpecs?.widthMm || 61;

  // Interactive Case Clearance Slider
  const [chassisMaxClearance, setChassisMaxClearance] = useState<number>(340);
  const remainingClearance = chassisMaxClearance - productLength;
  const isClearanceSafe = remainingClearance >= 0;

  // Active view tabs
  const [activeTab, setActiveTab] = useState<"cad" | "pinout" | "depots">("cad");
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  const handleStageToBuilder = () => {
    switch (product.category) {
      case "cpu":
        setSlot("cpu", product);
        break;
      case "motherboard":
        setSlot("motherboard", product);
        break;
      case "ram":
        setSlot("ram", product);
        break;
      case "gpu":
        setSlot("gpu", product);
        break;
      case "cooler":
        setSlot("cooler", product);
        break;
      case "storage":
        setSlot("storage", product);
        break;
      case "psu":
        setSlot("psu", product);
        break;
      case "chassis":
        setSlot("chassis", product);
        break;
      default:
        addStandaloneItem(product, 1);
        break;
    }
    router.push("/pc-builder");
  };

  const handleAddToCart = () => {
    addStandaloneItem(product, 1);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  // WhatsApp query text
  const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(
    `Hello SynapseCAD Engineering, I need technical qualification for: ${product.name} (SKU: ${product.sku}). Is it verified for my CAD workstation build?`
  )}`;

  const emiPerMonth = product.emiPerMonth || Math.round(product.price / 12);

  return (
    <div className="w-full bg-[#0F172A] text-[#F8FAFC] font-sans antialiased min-h-screen pt-28 pb-16">
      {/* Top Breadcrumb & Telemetry Navigation */}
      <div className="w-full bg-[#0B1326] border-b border-[#334155] px-4 md:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#94A3B8]">
            <Link href="/" className="hover:text-[#06B6D4] transition-colors">SYNAPSECAD</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-[#06B6D4] transition-colors">DIRECTORY</Link>
            <span>/</span>
            <span className="text-[#06B6D4] font-bold uppercase">{product.category}</span>
            <span>/</span>
            <span className="text-[#84CC16] truncate max-w-[200px]">{product.sku}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <span>STATUS: <strong className="text-[#84CC16]">CALIBRATED SPEC</strong></span>
            <span>DATUM: <strong className="text-[#06B6D4]">PCIe REF (0,0,0)</strong></span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid (7 cols Left CAD Viewer, 5 cols Right Engineering Console) */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 3D Diagnostic Clearance Inspector & Dimension Rulers (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main CAD Interactive Viewport Container */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 relative overflow-hidden shadow-2xl">
            {/* Viewport Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#334155] mb-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                <span className="font-bold text-[#06B6D4] uppercase">
                  DIAGNOSTIC CLEARANCE ENVELOPE // 3D RULER
                </span>
              </div>
              <span className="text-[#94A3B8] text-[11px]">TOLERANCE ±0.20 mm</span>
            </div>

            {/* Interactive Dimension Leader Ruler Overlay (Top X-Axis) */}
            <div className="relative w-full bg-[#0B1326] border border-[#334155] p-4 mb-4">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-[#06B6D4] px-3 py-1 bg-[#1E293B] border border-[#06B6D4]/40 shadow">
                <span className="text-[10px] text-[#94A3B8]">|◀ DIM_X (LENGTH)</span>
                <span className="tracking-wider">{productLength.toFixed(2)} mm</span>
                <span className="text-[10px] text-[#94A3B8]">TOL ±0.2 ▶|</span>
              </div>
              <div className="relative w-full flex items-center mt-2">
                <div className="w-0.5 h-3 bg-[#06B6D4]" />
                <div className="flex-1 h-[2px] bg-gradient-to-r from-[#06B6D4] via-[#84CC16] to-[#06B6D4]" />
                <div className="w-0.5 h-3 bg-[#06B6D4]" />
              </div>
            </div>

            {/* 3D Wireframe Scene */}
            <div className="relative w-full aspect-[4/3] bg-[#060E20] border border-[#334155] overflow-hidden">
              <SynapseBoundingBox3DScene
                gpuLength={productLength}
                gpuMaxClearance={chassisMaxClearance}
                coolerHeight={product.category === "cooler" ? productHeight : 158}
                coolerMaxHeight={165}
                showLabels={true}
              />
            </div>

            {/* 3D Coordinate Datum Origin Indicator */}
            <div className="mt-4 p-3 bg-[#0B1326] border border-[#334155] grid grid-cols-3 gap-2 font-mono text-xs text-center">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">X-LENGTH</span>
                <span className="text-[#06B6D4] font-bold">{productLength} mm</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Y-HEIGHT</span>
                <span className="text-[#84CC16] font-bold">{productHeight} mm</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase">Z-THICKNESS</span>
                <span className="text-[#F59E0B] font-bold">{productThickness} mm</span>
              </div>
            </div>

            {/* Case-Fitting Simulation Slider */}
            <div className="mt-6 p-4 bg-[#1E293B] border border-[#334155] space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#94A3B8] uppercase font-bold">
                  // CHASSIS FIT SIMULATION SLIDER
                </span>
                <span className="text-[#06B6D4] font-bold">
                  TEST CHASSIS CLEARANCE: {chassisMaxClearance} mm
                </span>
              </div>

              <input
                type="range"
                min={260}
                max={420}
                step={5}
                value={chassisMaxClearance}
                onChange={(e) => setChassisMaxClearance(Number(e.target.value))}
                className="w-full accent-[#06B6D4] bg-[#0B1326] h-2 rounded-none cursor-pointer"
              />

              <div className="flex justify-between font-mono text-[10px] text-[#475569]">
                <span>260mm (Compact ITX)</span>
                <span>340mm (Standard ATX)</span>
                <span>420mm (E-ATX Supertower)</span>
              </div>

              {/* Dynamic Fit Result Box */}
              <div
                className={`p-3 border flex items-center justify-between font-mono text-xs transition-all ${
                  isClearanceSafe
                    ? "bg-[#84CC16]/10 border-[#84CC16] text-[#84CC16]"
                    : "bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    {isClearanceSafe ? "verified" : "error"}
                  </span>
                  <div>
                    <span className="font-bold block">
                      {isClearanceSafe
                        ? `100% FIT CONFIRMED: ${remainingClearance}mm BUFFER`
                        : `COLLISION DETECTED: EXCEEDS CHASSIS BY ${Math.abs(remainingClearance)}mm`}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {isClearanceSafe
                        ? "Zero interference with front radiator/fans."
                        : "Component exceeds internal cavity limits. Select a larger enclosure."}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#0F172A] border border-current text-[10px] uppercase font-bold">
                  {isClearanceSafe ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>

            {/* Engineering Downloads Bar */}
            <div className="mt-4 pt-4 border-t border-[#334155] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <button
                onClick={() => alert(`Generating DXF / STEP vector package for ${product.sku}...`)}
                className="flex items-center gap-1.5 text-[#06B6D4] hover:underline"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>[ Download 2D DXF / 3D STEP Schematic (v4.8) ]</span>
              </button>
              <button
                onClick={() => alert(`Opening official bus & pinout datasheet for ${product.sku}...`)}
                className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>[ Factory Pinout &amp; PCIe Spec (PDF) ]</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Technical Spec Matrix & Ordering Console (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Product Card */}
          <div className="bg-[#131B2E] border border-[#334155] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2 py-0.5 bg-[#1E293B] border border-[#06B6D4] text-[#06B6D4] font-bold uppercase">
                {product.brand} // {product.category.toUpperCase()}
              </span>
              <span className="text-[#94A3B8] text-[11px]">{product.sku}</span>
            </div>

            <h1 className="font-mono text-2xl font-bold text-[#F8FAFC] tracking-tight leading-snug">
              {product.name}
            </h1>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {product.description}
            </p>

            {/* Micro Parameter Chips */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-[#F8FAFC]">
                TDP: <strong className="text-[#F59E0B]">{product.tdp}W</strong>
              </span>
              {product.socket && (
                <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-[#F8FAFC]">
                  Socket: <strong className="text-[#06B6D4]">{product.socket}</strong>
                </span>
              )}
              {product.ramType && (
                <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-[#F8FAFC]">
                  RAM: <strong className="text-[#84CC16]">{product.ramType}</strong>
                </span>
              )}
              <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-[#F8FAFC]">
                Warranty: <strong>{product.warranty}</strong>
              </span>
            </div>

            {/* Cash Price & Discount HUD */}
            <div className="p-4 bg-[#1E293B] border border-[#334155] space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#94A3B8] uppercase block">CASHOUT PRICE</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-extrabold text-[#06B6D4]">
                      Tk {product.price.toLocaleString()}
                    </span>
                    {product.regularPrice > product.price && (
                      <span className="font-mono text-xs text-[#475569] line-through">
                        Tk {product.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {product.regularPrice > product.price && (
                  <span className="px-2.5 py-1 bg-[#84CC16]/20 border border-[#84CC16] text-[#84CC16] font-mono text-xs font-bold">
                    SAVE TK {(product.regularPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Bank EMI Breakdown */}
              <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#94A3B8]">
                  <span className="material-symbols-outlined text-sm text-[#06B6D4]">credit_card</span>
                  <span>
                    Financing from <strong className="text-[#84CC16]">Tk {emiPerMonth.toLocaleString()}/mo</strong> (12 Mo. 0% EMI)
                  </span>
                </div>
                <span className="text-[10px] text-[#475569]">18 Partner Banks</span>
              </div>
            </div>

            {/* Omnichannel Physical Inventory Depot Disposition */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#94A3B8] uppercase block">
                // PHYSICAL DEPOT STOCK DISPOSITION
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="p-2.5 bg-[#0B1326] border border-[#334155] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
                    <div>
                      <span className="text-[#F8FAFC] font-bold block">IDB Bhaban Branch (Dhaka)</span>
                      <span className="text-[10px] text-[#94A3B8]">Level 3, East Wing Desk 312</span>
                    </div>
                  </div>
                  <span className="text-[#84CC16] font-bold">{product.branchStock.idb} UNITS</span>
                </div>

                <div className="p-2.5 bg-[#0B1326] border border-[#334155] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                    <div>
                      <span className="text-[#F8FAFC] font-bold block">Multiplan Center (Elephant Rd)</span>
                      <span className="text-[10px] text-[#94A3B8]">Level 5, Suite 508</span>
                    </div>
                  </div>
                  <span className="text-[#84CC16] font-bold">{product.branchStock.multiplan} UNITS</span>
                </div>

                <div className="p-2.5 bg-[#0B1326] border border-[#334155] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                    <div>
                      <span className="text-[#F8FAFC] font-bold block">Central Depot (Savar Express Hub)</span>
                      <span className="text-[10px] text-[#94A3B8]">64 Districts Cash on Delivery (COD)</span>
                    </div>
                  </div>
                  <span className="text-[#06B6D4] font-bold">{product.branchStock.central} UNITS</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5 font-mono text-xs">
              <button
                onClick={handleStageToBuilder}
                className="w-full py-3.5 bg-[#06B6D4] hover:bg-[#0891b2] text-[#0F172A] font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">architecture</span>
                <span>Stage to Schematic Workbench</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] border border-[#06B6D4] text-[#06B6D4] hover:text-[#F8FAFC] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                <span>{isAddedToCart ? "Added to Payload!" : "Add to Checkout Payload"}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#131B2E] hover:bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span>Consult Systems Engineer on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
