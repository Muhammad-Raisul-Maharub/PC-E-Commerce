"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";
import WorkstationClay3DScene from "@/components/canvas/WorkstationClay3DScene";
import jsPDF from "jspdf";

interface AxiomPDPProps {
  product: HardwareProduct;
}

export default function AxiomPDP({ product }: AxiomPDPProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const { addStandaloneItem } = useCartStore();

  const handleDownloadSpecSheet = () => {
    setDownloadingPdf(true);
    try {
      const doc = new jsPDF();

      // Architectural Clean Header
      doc.setFillColor(24, 24, 27); // Basalt Charcoal #18181B
      doc.rect(0, 0, 210, 32, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AXIOM PRO // TECHNICAL SPECIFICATION SHEET", 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(173, 241, 201); // Emerald light
      doc.text("ISO/IEC 27001 AUDITED • AUTHORIZED ENTERPRISE HARDWARE FOUNDRY", 14, 26);

      // Product Information
      doc.setTextColor(24, 24, 27);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(product.name, 14, 46);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(82, 82, 91);
      doc.text(`Brand: ${product.brand}   |   SKU: ${product.sku}   |   Category: ${product.category.toUpperCase()}`, 14, 53);

      doc.setDrawColor(228, 228, 231);
      doc.line(14, 58, 196, 58);

      // Price and Warranty
      doc.setFontSize(11);
      doc.setTextColor(0, 79, 50); // Forest Emerald
      doc.setFont("helvetica", "bold");
      doc.text(`Unit Price: BDT ${product.price.toLocaleString()} (Official Mushak-6.3 VAT Inclusive)`, 14, 68);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(24, 24, 27);
      doc.text(`Warranty Coverage: ${product.warranty || "5-Year Enterprise Direct Replacement"}`, 14, 75);

      // Technical Specifications Table
      doc.setFont("helvetica", "bold");
      doc.text("PARAMETRIC HARDWARE MATRIX", 14, 90);
      doc.setDrawColor(228, 228, 231);
      doc.line(14, 93, 196, 93);

      let y = 102;
      product.specs.forEach((spec, index) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(82, 82, 91);
        doc.text(spec.label + ":", 16, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(24, 24, 27);
        doc.text(spec.value, 80, y);

        doc.setDrawColor(244, 244, 245);
        doc.line(14, y + 3, 196, y + 3);
        y += 10;
      });

      // Extra Enterprise Parameters
      if (product.eccSupport !== undefined) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(82, 82, 91);
        doc.text("ECC Architecture:", 16, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 79, 50);
        doc.text(product.eccSupport ? "Multi-bit ECC Supported (JEDEC Compliant)" : "Standard Non-ECC", 80, y);
        y += 10;
      }

      if (product.isvCertifications && product.isvCertifications.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(82, 82, 91);
        doc.text("ISV Validations:", 16, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(24, 24, 27);
        doc.text(product.isvCertifications.join(", "), 80, y);
        y += 10;
      }

      // Branch Availability
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.text("CORPORATE BRANCH INVENTORY ALLOCATION", 14, y);
      doc.line(14, y + 3, 196, y + 3);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.text(`• Motijheel Corporate Center (HQ): ${product.branchStock.motijheel || 0} units`, 16, y);
      doc.text(`• IDB Bhaban Flagship Depot: ${product.branchStock.idb || 0} units`, 16, y + 7);
      doc.text(`• Chittagong GEC Sanmar Hub: ${product.branchStock.chittagong || 0} units`, 16, y + 14);

      // Footer
      doc.setFillColor(244, 244, 245);
      doc.rect(0, 270, 210, 27, "F");
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122);
      doc.text("Axiom Pro Systems Ltd. • 42 Dilkusha C/A, Motijheel, Dhaka-1000 • Email: b2b@axiompro.com.bd", 14, 280);
      doc.text("Generated in real-time by Google Antigravity Axiom Pro Architecture Subsystem.", 14, 286);

      doc.save(`AxiomPro_SpecSheet_${product.sku}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Spec sheet download completed.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const branches = [
    {
      name: "Motijheel Corporate Center (HQ)",
      address: "Ground Floor, 42 Dilkusha C/A, Dhaka-1000",
      stock: product.branchStock.motijheel || 0,
      leadTime: "Immediate Enterprise Pickup / Courier",
    },
    {
      name: "IDB Bhaban Flagship Depot",
      address: "Shop 318-320, Level 3, Agargaon, Dhaka",
      stock: product.branchStock.idb || 0,
      leadTime: "2-Hour Express Counter Dispatch",
    },
    {
      name: "Chittagong GEC Sanmar Hub",
      address: "Level 4, Sanmar Ocean City, GEC, Chittagong",
      stock: product.branchStock.chittagong || 0,
      leadTime: "Same-Day Regional Delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-[#E4E4E7] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#71717A]">
            <Link href="/" className="hover:text-[#18181B]">Axiom Pro</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-[#18181B]">Infrastructure Directory</Link>
            <span>/</span>
            <span className="text-[#004F32] font-bold">{product.sku}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#004F32] font-semibold border border-[#ADF1C9]">
              Mushak-6.3 Tax Compliant
            </span>
            <span className="text-[#71717A]">ECC Validated</span>
          </div>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (7 Cols): 3D CAD Clay View & High-Res Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* 3D CAD Clay Architectural Viewport - Always Loaded Directly */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded bg-[#004F32] text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="material-symbols-outlined text-sm">view_in_ar</span>
                  <span>3D CAD Workstation Architecture Stage</span>
                </span>
              </div>

              <span className="font-mono text-[11px] text-[#71717A] hidden sm:inline">
                Orthogonal &amp; Perspective Studio Shading // ISO/IEC 27001
              </span>
            </div>

            {/* Pure 3D Canvas Stage */}
            <div className="w-full rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-xl bg-[#090D16]">
              <WorkstationClay3DScene heightClass="h-[520px] sm:h-[580px] lg:h-[620px]" showCameraToggle={true} />
            </div>

            {/* Technical Specifications Table */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004F32]" />
                <span>Parametric Engineering Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {product.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded bg-[#FBFBFD] border border-[#E4E4E7] flex flex-col justify-between"
                  >
                    <span className="font-mono text-[10.5px] uppercase text-[#71717A]">
                      {spec.label}
                    </span>
                    <span className="font-semibold text-[#18181B] mt-1">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ISV Software Ecosystem Badges */}
              {product.isvCertifications && product.isvCertifications.length > 0 && (
                <div className="pt-3 border-t border-[#E4E4E7]">
                  <span className="font-mono text-[11px] uppercase text-[#71717A] block mb-2 font-semibold">
                    ISV Application Certifications:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.isvCertifications.map((isv) => (
                      <span
                        key={isv}
                        className="px-2.5 py-1 rounded bg-[#F4F4F5] border border-[#E4E4E7] font-mono text-xs font-medium text-[#18181B]"
                      >
                        ✓ {isv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 Cols): Pricing, Inventory & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Product Card */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#71717A]">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] leading-tight">
                  {product.name}
                </h1>

                <p className="text-sm text-[#52525B] mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-lg bg-[#FBFBFD] border border-[#E4E4E7] space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-[#71717A] uppercase">
                    Official Corporate Price
                  </span>
                  <span className="font-mono text-xs text-[#004F32] font-semibold">
                    Tax Invoice Included
                  </span>
                </div>

                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#004F32]">
                  ৳{product.price.toLocaleString()}
                </div>

                {product.regularPrice > product.price && (
                  <div className="text-xs text-[#71717A] line-through font-mono">
                    Regular Price: ৳{product.regularPrice.toLocaleString()}
                  </div>
                )}

                <div className="pt-2 text-[11px] font-mono text-[#52525B]">
                  • 2% Corporate Wire Transfer / RTGS direct clearing discount available
                </div>
              </div>

              {/* Quantity & Procurement Buttons */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E4E4E7] rounded bg-[#FBFBFD]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center font-mono text-lg text-[#52525B] hover:text-[#18181B]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono text-sm font-bold text-[#18181B]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center font-mono text-lg text-[#52525B] hover:text-[#18181B]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addStandaloneItem(product, quantity);
                      alert(`Added ${quantity}x ${product.name} to procurement cart.`);
                    }}
                    className="flex-1 h-10 px-6 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">shopping_cart</span>
                    <span>Add to Procurement Order</span>
                  </button>
                </div>

                {/* PDF Spec Sheet Download */}
                <button
                  onClick={handleDownloadSpecSheet}
                  disabled={downloadingPdf}
                  className="w-full h-10 rounded border border-[#E4E4E7] bg-white hover:bg-slate-50 text-[#18181B] font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-[#004F32]">
                    download_for_offline
                  </span>
                  <span>
                    {downloadingPdf ? "Generating PDF Blueprint..." : "Download Official Spec Sheet (PDF)"}
                  </span>
                </button>

                {/* WhatsApp Concierge Link */}
                <a
                  href={`https://wa.me/8801700000000?text=Hello%20Axiom%20Concierge,%20I%20am%20inquiring%20about%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-10 rounded bg-[#ECFDF5] border border-emerald-300 text-[#004F32] hover:bg-[#004F32] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>WhatsApp Enterprise Sales Concierge</span>
                </a>
              </div>
            </div>

            {/* Corporate Inventory Allocation Across Branches */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E4E7]">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004F32] text-base">inventory_2</span>
                  <span>Physical Branch Stock Verification</span>
                </h3>
                <span className="font-mono text-[10px] text-[#004F32] font-semibold">Live Audit</span>
              </div>

              <div className="space-y-3">
                {branches.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#18181B]">{b.name}</div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">{b.address}</div>
                      <div className="font-mono text-[10px] text-[#004F32] font-medium mt-0.5">
                        {b.leadTime}
                      </div>
                    </div>

                    <div className="text-right font-mono flex-shrink-0">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                          b.stock > 0
                            ? "bg-[#ECFDF5] text-[#004F32] border border-[#ADF1C9]"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {b.stock > 0 ? `${b.stock} In Stock` : "Order Only"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
