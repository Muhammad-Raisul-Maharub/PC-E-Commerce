"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useConceptStore } from "@/store/useConceptStore";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";

export default function Header() {
  const pathname = usePathname();
  const { getGrandTotal, getTotalItemCount, deliveryDetails, updateDeliveryDetails } = useCartStore();
  const { activeConcept } = useConceptStore();

  const isNeon = activeConcept === "neonforge";
  const isAxiom = activeConcept === "axiom";
  const isSynapse = activeConcept === "synapse";
  const isOmni = activeConcept === "omnipulse";
  const isKrypton = activeConcept === "krypton";

  const [mounted, setMounted] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim().length > 1
    ? HARDWARE_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  const branches = [
    { key: "motijheel", label: "Motijheel Corporate Center (HQ)", status: "Enterprise Sales Active" },
    { key: "idb", label: "IDB Bhaban Flagship, Dhaka", status: "2-Hour Express Active" },
    { key: "multiplan", label: "Multiplan Center, Elephant Rd", status: "Open (Level 9)" },
    { key: "uttara", label: "Uttara Sector 3 Tech Plaza", status: "Northern Depot Active" },
    { key: "chittagong", label: "Chittagong GEC Sanmar Hub", status: "Regional Depot" },
  ] as const;

  const currentBranchLabel =
    branches.find((b) => b.key === deliveryDetails.pickupBranch)?.label ||
    (isAxiom ? "Motijheel Corporate Center (HQ)" : "IDB Bhaban Flagship, Dhaka");

  const navLinks = isKrypton
    ? [
      { href: "/", label: "Industrial Depot" },
      { href: "/catalog", label: "Component Bins" },
      { href: "/product/gateron-oil-king-linear-pack-90", label: "Tactile PDP" },
      { href: "/pc-builder", label: "Dual Workbench" },
      { href: "/checkout", label: "Staging Manifest" },
    ]
    : isNeon
    ? [
      { href: "/", label: "Battlestation Showroom" },
      { href: "/catalog", label: "Modder's Armory" },
      { href: "/product/amd-ryzen-7-7800x3d", label: "3D Modding Lab" },
      { href: "/pc-builder", label: "Liquid Loop Architect" },
      { href: "/checkout", label: "Cyber Checkout" },
    ]
    : isAxiom
      ? [
        { href: "/", label: "Enterprise Showroom" },
        { href: "/catalog", label: "Infrastructure Directory" },
        { href: "/product/amd-ryzen-threadripper-pro-7995wx", label: "Architectural Blueprint" },
        { href: "/pc-builder", label: "Platform Architect" },
        { href: "/checkout", label: "Corporate Procurement" },
      ]
      : isSynapse
        ? [
          { href: "/", label: "Schematic Home" },
          { href: "/catalog", label: "Parametric Directory" },
          { href: "/product/amd-ryzen-7-7800x3d", label: "Diagnostic PDP" },
          { href: "/pc-builder", label: "3D Workbench" },
          { href: "/checkout", label: "Assembly Staging" },
        ]
        : isOmni
          ? [
            { href: "/", label: "Retail Showroom" },
            { href: "/catalog", label: "Local Catalog" },
            { href: "/product/amd-ryzen-7-7800x3d", label: "Technical PDP" },
            { href: "/pc-builder", label: "Budget Rig Builder" },
            { href: "/checkout", label: "Express Checkout" },
          ]
          : [
            { href: "/", label: "Home" },
            { href: "/catalog", label: "Parametric Catalog" },
            { href: "/product/amd-ryzen-7-7800x3d", label: "Interactive PDP" },
            { href: "/pc-builder", label: "System Architect" },
            { href: "/checkout", label: "Modular Cart" },
          ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isKrypton
          ? "bg-[#EBEAE5] shadow-[0_4px_0px_#000000] border-b-2 border-black text-black"
          : isOmni
            ? "bg-[#0A2558] shadow-[0_4px_20px_rgba(10,37,88,0.4)] border-b border-[#0D47A1] text-white"
            : isNeon
              ? "bg-[#0A0A0F]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-b border-cyan-500/30 text-white"
              : isAxiom
                ? "bg-[#FFFFFF] shadow-[0_1px_4px_rgba(0,0,0,0.04)] border-b border-[#E4E4E7] text-[#18181B]"
                : isSynapse
                  ? "bg-[#0F172A]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-b border-[#334155] text-slate-100"
                  : "bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-b border-slate-200 text-slate-900"
        }`}
    >
      {/* Upper Utility Tier (h-14) */}
      <div
        className={`max-w-[1440px] mx-auto h-14 px-3 sm:px-4 flex items-center justify-between gap-3 border-b ${isKrypton ? "border-black" : isNeon ? "border-white/10" : isSynapse ? "border-[#334155]" : "border-slate-100"
          }`}
      >
        {/* Left: Brand Identity & Branch Selector */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            {isKrypton ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FACC15] border-2 border-black flex items-center justify-center text-black font-extrabold text-sm shadow-[2px_2px_0px_#000000] font-mono">
                  KP
                </div>
                <div className="flex flex-col">
                  <div className="font-heading font-extrabold text-[17px] tracking-tight text-black leading-none flex items-center gap-1" style={{ fontFamily: "Syne, sans-serif" }}>
                    KRYPTON<span className="text-[#EA580C]">DEPOT</span>
                    <span className="text-[9px] font-bold bg-black text-[#FACC15] px-1 py-0.5 leading-none">06</span>
                  </div>
                  <span className="font-mono text-[8.5px] tracking-wider text-slate-700 uppercase mt-0.5 hidden sm:block">
                    ISO-9001 HARDWARE LAB
                  </span>
                </div>
              </div>
            ) : isNeon ? (
              <img src="/neonforge-logo.svg" alt="NeonForge" className="h-8 w-auto" />
            ) : isAxiom ? (
              <img src="/axiom-logo.svg" alt="Axiom Pro" className="h-8 w-auto" />
            ) : isSynapse ? (
              <img src="/synapse-logo.svg" alt="SynapseCAD" className="h-8 w-auto" />
            ) : isOmni ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#FFB300] flex items-center justify-center text-[#0D47A1] font-black text-sm shadow-sm font-sans">
                  OP
                </div>
                <div className="flex flex-col">
                  <div className="font-sans font-extrabold text-[17px] tracking-tight text-white leading-none flex items-center gap-1">
                    OMNI<span className="text-[#FFB300]">PULSE</span>
                    <span className="text-[9px] font-bold bg-[#FFB300] text-[#0D47A1] px-1 py-0.5 rounded leading-none">BD</span>
                  </div>
                  <span className="font-sans text-[8.5px] tracking-wider text-blue-200 uppercase mt-0.5 hidden sm:block">
                    HYPER-LOCAL RETAIL HUB
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* SVG Logo Mark */}
                <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center relative overflow-hidden shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 240 50" fill="none">
                    <path d="M12 14L22 36H28L38 14H32L25 30L18 14H12Z" fill="#EF4444" />
                    <rect x="23" y="11" width="4" height="4" fill="#10B981" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-[17px] tracking-tight text-slate-900 leading-none">
                    VOLT<span className="text-[#EF4444]">MATRIX</span>
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.14em] text-slate-500 uppercase mt-0.5 hidden sm:block">
                    HARDWARE FOUNDRY
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Branch Dropdown */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[12px] font-medium transition-colors ${isNeon
                  ? "bg-[#12121A] border-cyan-500/30 text-slate-200 hover:border-cyan-400"
                  : isAxiom
                    ? "bg-white border-[#E4E4E7] text-[#18181B] hover:bg-[#FBFBFD]"
                    : isSynapse
                      ? "bg-[#1E293B] border-[#334155] text-slate-200 hover:border-cyan-500 font-mono"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                }`}
            >
              <span
                className={`material-symbols-outlined text-[15px] ${isNeon ? "text-[#00F0FF]" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-[#EF4444]"
                  }`}
              >
                location_on
              </span>
              <span>Hub: {currentBranchLabel.split(",")[0]}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">
                {isBranchDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {isBranchDropdownOpen && (
              <div
                className={`absolute left-0 mt-1 w-64 rounded-xl shadow-2xl border py-1.5 z-50 ${isNeon
                    ? "bg-[#0A0A0F]/95 border-cyan-500/40 text-white backdrop-blur-xl shadow-cyan-950/40"
                    : isAxiom
                      ? "bg-white border-[#E4E4E7] text-[#18181B] shadow-xl"
                      : isSynapse
                        ? "bg-[#0F172A]/98 border-[#334155] text-slate-200 shadow-2xl backdrop-blur-md"
                        : "bg-white border-slate-200 text-slate-800 shadow-xl"
                  }`}
              >
                <div
                  className={`px-3 py-1.5 border-b text-[10px] font-mono uppercase font-bold ${isNeon
                      ? "border-white/10 text-cyan-400"
                      : isAxiom
                        ? "border-[#E4E4E7] text-[#004F32]"
                        : isSynapse
                          ? "border-[#334155] text-cyan-400 font-mono"
                          : "border-slate-100 text-slate-500"
                    }`}
                >
                  {isAxiom ? "Corporate Inventory Hubs" : isSynapse ? "CAD Engineering Depots" : "Select Modding Lab & Depot"}
                </div>
                {branches.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => {
                      updateDeliveryDetails({ pickupBranch: b.key });
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between transition-colors ${deliveryDetails.pickupBranch === b.key
                        ? isNeon
                          ? "bg-cyan-950/60 text-[#00F0FF] font-bold"
                          : isAxiom
                            ? "bg-[#ECFDF5] text-[#004F32] font-semibold"
                            : isSynapse
                              ? "bg-cyan-950/60 text-[#06B6D4] font-bold font-mono"
                              : "bg-red-50 text-[#b61722] font-semibold"
                        : isNeon
                          ? "hover:bg-white/10 text-slate-300"
                          : isAxiom
                            ? "hover:bg-[#FBFBFD] text-[#18181B]"
                            : isSynapse
                              ? "hover:bg-[#1E293B] text-slate-300"
                              : "hover:bg-slate-50 text-slate-800"
                      }`}
                  >
                    <div>
                      <div>{b.label}</div>
                      <div
                        className={`text-[10px] font-mono ${isNeon ? "text-cyan-400" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-emerald-600"
                          }`}
                      >
                        {b.status}
                      </div>
                    </div>
                    {deliveryDetails.pickupBranch === b.key && (
                      <span
                        className={`material-symbols-outlined text-[16px] ${isNeon ? "text-[#00F0FF]" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-[#b61722]"
                          }`}
                      >
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Real-time Nationwide Fulfillment Badge */}
        <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1 border ${isKrypton
              ? "bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000]"
              : isNeon
                ? "bg-[#12121A] border-cyan-500/30 text-cyan-300 rounded"
                : isAxiom
                  ? "bg-[#FBFBFD] border-[#E4E4E7] text-[#52525B] rounded"
                  : isSynapse
                    ? "bg-[#1E293B] border-[#334155] text-cyan-300 rounded"
                    : "bg-slate-50 border-slate-200/80 text-slate-600 rounded"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${isKrypton ? "bg-[#FACC15] border border-black" : isOmni ? "bg-[#FFB300]" : isNeon ? "bg-[#00F0FF]" : isAxiom ? "bg-[#004F32]" : isSynapse ? "bg-[#06B6D4]" : "bg-emerald-500"
              }`}
          ></span>
          <span className="font-mono text-[10.5px] uppercase tracking-wide font-bold">
            {isKrypton
              ? "DIN CALIBRATION BENCH • SWITCH LUBRICATION • NATIONWIDE COD DISPATCH • 4 DEPOTS"
              : isOmni
                ? "5 STORE HUBS • 2-HR DHAKA PICKUP • 0% EMI UP TO 36 MO • 100% GENUINE BD WARRANTY"
                : isNeon
                  ? "REINFORCED CRATE COURIER • ZERO-LEAK TEST CERTIFIED • NATIONWIDE COD"
                  : isAxiom
                    ? "PRO-FORMA TAX INVOICES • 72-HOUR AIDA64 BURN-IN • NATIONWIDE COD & WIRE"
                    : isSynapse
                      ? "ISO 9001 CAD CERTIFIED • MILLIMETRIC CLEARANCE CHECK • NATIONWIDE COD"
                      : "COD in 64 Districts • 2-Hour Express Pickup IDB / Multiplan"}
          </span>
        </div>

        {/* Right Actions: Tech WhatsApp, Cart Indicator, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live WhatsApp Specialist */}
          <a
            href={
              isKrypton
                ? "https://wa.me/8801711000000?text=Hello%20Krypton%20Engineering%20Depot,%20I%20have%20an%20inquiry%20about%20components%20and%20stock."
                : isOmni
                  ? "https://wa.me/8801700000000?text=Hello%20OmniPulse%20BD%20Retail%20Team,%20I%20need%20product%20availability%20and%20branch%20pricing%20inquiry."
                  : isSynapse
                    ? "https://wa.me/8801700000000?text=Hello%20SynapseCAD%20Engineering%20Desk,%20I%20need%20a%20workstation%20schematic%20review."
                    : isAxiom
                      ? "https://wa.me/8801700000000?text=Hello%20Axiom%20Enterprise%20Concierge,%20I%20need%20a%20workstation%20pro-forma%20quotation."
                      : "https://wa.me/8801700000000?text=Hello%20VoltMatrix%20Specialist,%20I%20need%20build%20assistance."
            }
            target="_blank"
            rel="noreferrer"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 border transition-all text-[11px] font-mono font-bold ${isKrypton
                ? "bg-[#25D366] text-black border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#20ba59]"
                : isOmni
                  ? "bg-[#25D366] text-slate-900 border-[#25D366] hover:bg-[#20ba59] shadow-sm rounded"
                  : isNeon
                    ? "bg-[#25D366]/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600 hover:text-white rounded"
                    : isAxiom
                      ? "bg-[#ECFDF5] text-[#004F32] border-emerald-300 hover:bg-[#004F32] hover:text-white rounded"
                      : isSynapse
                        ? "bg-[#06B6D4]/15 text-cyan-400 border-cyan-500/40 hover:bg-[#06B6D4] hover:text-[#0F172A] rounded"
                        : "bg-[#25D366]/10 text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white rounded"
              }`}
          >
            <span>💬</span>
            <span className="hidden md:inline">{isKrypton ? "Depot Engineer" : isOmni ? "Retail WhatsApp" : isNeon ? "Modding Hotline" : isAxiom ? "Enterprise Concierge" : isSynapse ? "CAD Architect" : "Tech Specialist"}</span>
          </a>

          {/* Cart Capsule */}
          <Link
            href="/checkout"
            className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${isKrypton
                ? "bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black shadow-[2px_2px_0px_#000000]"
                : isNeon
                  ? "bg-[#12121A] hover:bg-[#161622] border-cyan-500/40 text-white rounded"
                  : isAxiom
                    ? "bg-[#FBFBFD] hover:bg-white border-[#E4E4E7] text-[#18181B] rounded"
                    : isSynapse
                      ? "bg-[#1E293B] hover:bg-[#334155] border-[#334155] text-slate-100 rounded"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 rounded"
              }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${isKrypton ? "text-black" : isNeon ? "text-[#00F0FF]" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-[#EF4444]"
                }`}
            >
              shopping_cart
            </span>
            <span
              className={`font-mono text-[12px] font-bold ${isKrypton ? "text-black font-extrabold" : isNeon ? "text-[#00F0FF]" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-slate-900"
                }`}
            >
              {mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}
            </span>
            <span
              className={`text-[11px] hidden sm:inline font-mono ${isKrypton ? "text-black/70 font-bold" : isNeon ? "text-slate-400" : isSynapse ? "text-slate-400" : "text-slate-500"
                }`}
            >
              / {mounted ? getTotalItemCount() : 0}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Lower Navigation & Search Tier (h-14) */}
      <div className="max-w-[1440px] mx-auto h-14 px-3 sm:px-4 flex items-center justify-between gap-4">
        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] whitespace-nowrap transition-colors py-1 ${isActive
                    ? isKrypton
                      ? "text-black font-extrabold border-b-2 border-black font-mono tracking-wide"
                      : isNeon
                        ? "text-[#00F0FF] font-bold border-b-2 border-[#00F0FF] font-chakra tracking-wide"
                        : isAxiom
                          ? "text-[#004F32] font-bold border-b-2 border-[#004F32] font-sans"
                          : isSynapse
                            ? "text-[#06B6D4] font-bold border-b-2 border-[#06B6D4] font-mono tracking-wide"
                            : "text-[#EF4444] font-bold border-b-2 border-[#EF4444] font-sans"
                    : isKrypton
                      ? "text-slate-700 hover:text-black font-bold font-mono"
                      : isNeon
                        ? "text-slate-300 hover:text-[#00F0FF] font-medium font-chakra"
                        : isAxiom
                          ? "text-[#52525B] hover:text-[#18181B] font-medium font-sans"
                          : isSynapse
                            ? "text-slate-300 hover:text-[#06B6D4] font-medium font-mono"
                            : "text-slate-600 hover:text-slate-900 font-medium font-sans"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar & Launch PC Builder CTA */}
        <div className="flex items-center gap-3 flex-1 lg:max-w-xl justify-end">
          {/* Autocomplete Search Input */}
          <div className="relative w-full max-w-md" ref={searchRef}>
            <span
              className={`material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] ${isKrypton ? "text-black font-bold" : isNeon ? "text-cyan-400" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-[#06B6D4]" : "text-slate-400"
                }`}
            >
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={
                isKrypton
                  ? "Search component bins, switches, keycaps, KiCad footprints, pinouts..."
                  : isNeon
                    ? "Search custom water blocks, radiators, pumps, GPUs..."
                    : isAxiom
                      ? "Search ECC RDIMM, Threadripper PRO, RTX Ada, NVMe U.3..."
                      : isSynapse
                        ? "Search schematic components, form factors, TDP, or dimensions..."
                        : "Search 50,000+ parts, sockets, or GPUs..."
              }
              className={`w-full h-8 pl-8 pr-3 text-[12px] transition-colors focus:outline-none ${isKrypton
                  ? "bg-white border-2 border-black text-black placeholder:text-slate-500 focus:border-black font-mono shadow-[2px_2px_0px_#000000]"
                  : isNeon
                    ? "bg-[#12121A] border border-cyan-500/30 text-white placeholder:text-slate-500 focus:border-cyan-400 font-mono rounded"
                    : isAxiom
                      ? "bg-[#FBFBFD] border border-[#E4E4E7] text-[#18181B] placeholder:text-[#71717A] focus:bg-white focus:border-[#004F32] font-sans rounded"
                      : isSynapse
                        ? "bg-[#1E293B] border border-[#334155] text-slate-100 placeholder:text-slate-500 focus:border-[#06B6D4] font-mono rounded"
                        : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 font-sans rounded"
                }`}
            />

            {/* Search Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div
                className={`absolute left-0 right-0 mt-1 rounded-xl shadow-2xl border py-2 z-50 ${isNeon
                    ? "bg-[#0A0A0F]/95 border-cyan-500/40 text-white backdrop-blur-xl"
                    : isSynapse
                      ? "bg-[#0F172A]/98 border-[#334155] text-slate-100 shadow-2xl backdrop-blur-md"
                      : "bg-white border-slate-200 text-slate-900 shadow-2xl"
                  }`}
              >
                <div
                  className={`px-3 py-1 text-[10px] font-mono uppercase font-bold border-b ${isNeon ? "border-white/10 text-cyan-400" : isSynapse ? "border-[#334155] text-[#06B6D4]" : "border-slate-100 text-slate-500"
                    }`}
                >
                  Hardware Directory Matches
                </div>
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className={`flex items-center justify-between px-3 py-2 transition-colors ${isNeon ? "hover:bg-white/10" : isSynapse ? "hover:bg-[#1E293B]" : "hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 object-contain rounded bg-slate-900/60 p-0.5"
                      />
                      <div>
                        <div className="text-[12px] font-semibold truncate max-w-[220px] sm:max-w-[280px]">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {item.brand} • {item.sku}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-right font-mono text-[12px] font-bold ${isNeon ? "text-[#00F0FF]" : isSynapse ? "text-[#06B6D4]" : "text-[#EF4444]"
                        }`}
                    >
                      ৳{item.price.toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* High-Intent Launch PC Builder CTA */}
          <Link
            href="/pc-builder"
            className={`flex items-center gap-1.5 px-3 sm:px-4 h-8 font-mono text-[12px] font-bold uppercase tracking-tight transition-all active:translate-y-px whitespace-nowrap ${isKrypton
                ? "bg-[#FACC15] hover:bg-[#FDE047] text-black font-extrabold border-2 border-black shadow-[2px_2px_0px_#000000]"
                : isOmni
                  ? "bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-extrabold shadow-[0_0_15px_rgba(255,179,0,0.4)] font-sans rounded"
                  : isNeon
                    ? "bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.4)] rounded"
                    : isAxiom
                      ? "bg-[#004F32] hover:bg-[#003823] text-white shadow-sm font-semibold rounded"
                      : isSynapse
                        ? "bg-[#06B6D4] hover:bg-[#0891B2] text-[#0F172A] font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.35)] rounded"
                        : "bg-[#EF4444] hover:bg-[#dc2626] text-white shadow-sm rounded"
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isKrypton ? "handyman" : isOmni ? "tune" : isNeon ? "water_drop" : isAxiom ? "precision_manufacturing" : isSynapse ? "architecture" : "bolt"}
            </span>
            <span>
              {isKrypton
                ? "[ 🔨 Dual Workbench ]"
                : isOmni
                  ? "[ 🛠️ Budget Rig Wizard ]"
                  : isNeon
                    ? "[ ⚡ Liquid Loop Builder ]"
                    : isAxiom
                      ? "[ Configure Station ]"
                      : isSynapse
                        ? "[ 📐 3D Workbench ]"
                        : "[ Launch PC Builder ]"}
            </span>
          </Link>
        </div>
      </div>


      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-3 space-y-2 shadow-xl ${isNeon
              ? "bg-[#0A0A0F]/95 border-cyan-500/30 text-white"
              : "bg-white border-slate-200 text-slate-900"
            }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-[14px] ${pathname === link.href
                  ? isNeon
                    ? "text-[#00F0FF] font-bold"
                    : "text-[#EF4444] font-bold"
                  : isNeon
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Store Depot: {currentBranchLabel.split(",")[0]}</span>
            <span className="text-emerald-400 font-bold">IDB OPEN</span>
          </div>
        </div>
      )}
    </header>
  );
}

