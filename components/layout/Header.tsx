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

  const [mounted, setMounted] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("all");

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
      ).slice(0, 6)
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
    (activeConcept === "axiom" ? "Motijheel Corporate Center (HQ)" : "IDB Bhaban Flagship, Dhaka");

  // =========================================================================
  // CONCEPT 2: NEONFORGE FLOATING GLASSMORPHIC ISLAND HEADER
  // =========================================================================
  if (activeConcept === "neonforge") {
    const neonLinks = [
      { href: "/", label: "Battlestation Showroom" },
      { href: "/catalog", label: "Modder's Armory" },
      { href: "/product/amd-ryzen-7-7800x3d", label: "3D Modding Lab" },
      { href: "/pc-builder", label: "Liquid Loop Architect" },
      { href: "/checkout", label: "Cyber Checkout" },
    ];

    return (
      <header className="sticky top-0 z-40 w-full py-2.5 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="w-full max-w-[1536px] mx-auto">
          <div className="bg-[#0A0A0F]/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.15)] px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                <span className="material-symbols-outlined text-[#0A0A0F] text-lg font-black">water_drop</span>
              </div>
              <div className="flex flex-col">
                <span className="font-chakra font-bold text-[17px] tracking-wider text-white leading-none">
                  NEON<span className="text-[#00F0FF]">FORGE</span>
                </span>
                <span className="font-mono text-[8px] tracking-[0.18em] text-cyan-400 uppercase mt-0.5 hidden sm:block">
                  LIQUID HARDWARE LAB
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-5">
              {neonLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-chakra text-[13px] uppercase tracking-wider transition-all py-1 ${
                      isActive
                        ? "text-[#00F0FF] font-bold border-b border-[#00F0FF] shadow-[0_2px_8px_rgba(0,240,255,0.3)]"
                        : "text-slate-300 hover:text-[#00F0FF] font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              {/* Autocomplete Search */}
              <div className="relative hidden md:block w-52 lg:w-64" ref={searchRef}>
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-cyan-400">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search water blocks, radiators..."
                  className="w-full h-8 pl-8 pr-3 bg-[#12121A] border border-cyan-500/30 text-white placeholder:text-slate-500 rounded-lg text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {isSearchFocused && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-[#0A0A0F]/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center justify-between p-2 hover:bg-white/10 rounded-lg transition-colors text-xs"
                      >
                        <span className="text-white truncate font-medium">{item.name}</span>
                        <span className="text-[#00F0FF] font-mono font-bold">৳{item.price.toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/checkout"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12121A] hover:bg-[#161622] border border-cyan-500/40 text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
              >
                <span className="material-symbols-outlined text-[17px] text-[#00F0FF]">shopping_cart</span>
                <span className="font-mono text-xs font-bold text-[#00F0FF]">
                  {mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}
                </span>
                <span className="text-[11px] font-mono text-slate-400">({mounted ? getTotalItemCount() : 0})</span>
              </Link>

              {/* Builder CTA */}
              <Link
                href="/pc-builder"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">water_drop</span>
                <span>Loop Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // CONCEPT 3: AXIOM PRO MINIMALIST ARCHITECTURAL STRIP HEADER
  // =========================================================================
  if (activeConcept === "axiom") {
    const axiomLinks = [
      { href: "/", label: "Enterprise Showroom" },
      { href: "/catalog", label: "Infrastructure Directory" },
      { href: "/product/amd-ryzen-threadripper-pro-7995wx", label: "Architectural Blueprint" },
      { href: "/pc-builder", label: "Platform Architect" },
    ];

    return (
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
                AX
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-[16px] tracking-tight text-[#18181B] leading-none">
                  AXIOM<span className="text-[#004F32] font-semibold">PRO</span>
                </span>
                <span className="font-mono text-[8px] tracking-widest text-[#71717A] uppercase mt-0.5 hidden sm:block">
                  ENTERPRISE COMPUTING
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F4F4F5] text-[#52525B] rounded text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004F32]" />
              Tier-1 Authorized Enterprise Distributor
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {axiomLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-medium transition-colors py-1 ${
                    isActive ? "text-[#004F32] font-semibold border-b-2 border-[#004F32]" : "text-[#52525B] hover:text-[#18181B]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: B2B Procurement, Cart, Builder CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/checkout"
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-mono text-[#004F32] bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-emerald-300 rounded transition-colors"
            >
              <span>🏛️ Corporate Procurement &amp; Quotations</span>
            </Link>

            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] hover:bg-white text-[#18181B] text-xs font-mono font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[17px] text-[#004F32]">shopping_bag</span>
              <span>{mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}</span>
              <span className="text-[#71717A] text-[10.5px]">/ {mounted ? getTotalItemCount() : 0}</span>
            </Link>

            <Link
              href="/pc-builder"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">precision_manufacturing</span>
              <span className="hidden sm:inline">[ Configure Workstation ]</span>
              <span className="sm:hidden">Build</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // CONCEPT 4: SYNAPSECAD INTEGRATED HUD TELEMETRY HEADER
  // =========================================================================
  if (activeConcept === "synapse") {
    const synapseLinks = [
      { href: "/", label: "Schematic Home" },
      { href: "/catalog", label: "Hardware Directory" },
      { href: "/product/amd-ryzen-7-7800x3d", label: "Product Specifications" },
      { href: "/pc-builder", label: "3D Workbench" },
      { href: "/checkout", label: "Checkout Staging" },
    ];

    return (
      <header className="sticky top-0 z-40 w-full bg-[#0F172A]/98 backdrop-blur-md border-b border-[#334155] text-slate-100 shadow-xl transition-colors">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Telemetry Identity & Realtime Coordinates */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded bg-[#1E293B] border border-[#06B6D4]/40 flex items-center justify-center font-mono text-[#06B6D4] font-bold text-xs">
                CAD
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-[15px] tracking-wider text-slate-100 leading-none">
                  SYNAPSE<span className="text-[#06B6D4]">CAD</span>
                </span>
                <span className="font-mono text-[8px] text-[#84CC16] tracking-widest mt-0.5 hidden sm:block">
                  SYSTEM ARCHITECT V12.8
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-3 px-3 py-1 bg-[#131B2E] border border-[#334155] font-mono text-[10px] text-slate-400">
              <span className="text-[#06B6D4] font-bold">HUD:</span>
              <span>RULESET: ISO-9001</span>
              <span>BUS: PCIE 5.0</span>
              <span className="text-[#84CC16]">COLLISION: 0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            {synapseLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-wider transition-colors py-1 ${
                    isActive ? "text-[#06B6D4] font-bold border-b-2 border-[#06B6D4]" : "text-slate-300 hover:text-[#06B6D4]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/8801700000000?text=Hello%20SynapseCAD%20Engineering%20Desk,%20I%20need%20a%20workstation%20schematic%20review."
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#06B6D4]/10 text-cyan-400 border border-cyan-500/40 rounded font-mono text-[11px] font-bold hover:bg-[#06B6D4] hover:text-[#0F172A] transition-colors"
            >
              <span>💬</span>
              <span className="hidden md:inline">CAD Architect</span>
            </a>

            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-100 rounded font-mono text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-[#06B6D4]">inventory_2</span>
              <span>{mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}</span>
            </Link>

            <Link
              href="/pc-builder"
              className="flex items-center gap-1.5 px-3 py-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#0F172A] rounded font-mono text-xs font-extrabold uppercase shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">architecture</span>
              <span>[ 📐 3D Workbench ]</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // CONCEPT 5: OMNIPULSE BD (RYANS COMPUTERS & STAR TECH BENCHMARK 3-TIER)
  // =========================================================================
  if (activeConcept === "omnipulse") {
    return (
      <header className="sticky top-0 z-40 w-full bg-[#0A2558] text-white shadow-xl transition-colors">
        {/* Tier 1: Retail Top Contact & Trust Bar (h-9) */}
        <div className="w-full bg-[#06183B] border-b border-blue-900/60 text-xs py-1.5">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11.5px] font-sans">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <span className="material-symbols-outlined text-[15px]">phone_in_talk</span>
                Hotline: <strong className="text-white">16xxx / 09612-RYANS-BD</strong>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-blue-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Physical Hubs Open (10 AM - 8:30 PM): IDB, Multiplan, Chittagong
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-amber-300 font-semibold">
                🚚 64 Districts Courier COD | 0% EMI up to 36 Months
              </span>
              <a
                href="https://wa.me/8801700000000?text=Hello%20OmniPulse%20BD%20Retail%20Team"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <span>💬 WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tier 2: Commercial Action & Universal Search Bar (h-16) */}
        <div className="w-full border-b border-blue-800/80 py-2.5">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded bg-[#FFB300] flex items-center justify-center text-[#0D47A1] font-black text-base shadow-md font-sans">
                OP
              </div>
              <div className="flex flex-col">
                <div className="font-sans font-extrabold text-[20px] tracking-tight text-white leading-none flex items-center gap-1">
                  OMNI<span className="text-[#FFB300]">PULSE</span>
                  <span className="text-[10px] font-bold bg-[#FFB300] text-[#0D47A1] px-1.5 py-0.5 rounded leading-none">BD</span>
                </div>
                <span className="font-sans text-[9px] tracking-wider text-blue-200 uppercase mt-0.5 hidden sm:block">
                  HYPER-LOCAL RETAIL NETWORK
                </span>
              </div>
            </Link>

            {/* Universal Search Bar with Category Dropdown (Ryans Benchmark) */}
            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
              <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <select
                  value={selectedSearchCategory}
                  onChange={(e) => setSelectedSearchCategory(e.target.value)}
                  className="hidden md:block bg-slate-100 text-slate-800 text-xs px-3 py-2 border-r border-slate-300 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="laptop">Laptops</option>
                  <option value="cpu">Processors</option>
                  <option value="gpu">Graphics Cards</option>
                  <option value="motherboard">Motherboards</option>
                  <option value="monitor">Monitors</option>
                  <option value="gadget">Gadgets &amp; Gear</option>
                </select>

                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search 50,000+ Genuine BD Products, Sockets, GPUs, Laptops..."
                    className="w-full h-10 pl-9 pr-3 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <button className="bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] px-4 py-2 text-xs font-bold font-sans flex items-center gap-1 transition-colors">
                  <span>Search</span>
                </button>
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    Retail Catalog Matches
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="flex items-center justify-between p-2.5 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain rounded bg-slate-100 p-0.5" />
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-xs">{item.name}</div>
                          <div className="text-[10px] text-slate-500">{item.brand} • In Stock at IDB &amp; Multiplan</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#0D47A1]">৳{item.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Buttons: System Builder & Cart */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/pc-builder"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFB300] hover:bg-[#ffa000] text-[#0D47A1] font-bold text-xs uppercase tracking-tight shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>PC Builder</span>
              </Link>

              <Link
                href="/checkout"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#FFB300]">shopping_cart</span>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] text-blue-200">Total Cart</span>
                  <span className="text-xs font-bold text-amber-300">
                    {mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}
                  </span>
                </div>
                <span className="bg-[#FFB300] text-[#0D47A1] text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                  {mounted ? getTotalItemCount() : 0}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 3: Horizontal Mega Category Menu Rail (h-10) */}
        <div className="w-full bg-[#0D3882] border-b border-blue-900/60 hidden md:block">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-sans overflow-x-auto">
            <div className="flex items-center gap-5 py-2 whitespace-nowrap">
              <Link href="/catalog" className="text-white hover:text-amber-300 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">laptop_mac</span>
                Laptop &amp; Mac
              </Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Desktop PC</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">PC Components</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Gaming &amp; Rigs</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Monitors</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Storage &amp; RAM</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Gadgets &amp; Office</Link>
              <Link href="/catalog" className="text-white hover:text-amber-300 font-medium">Printers &amp; Ink</Link>
              <Link href="/catalog" className="text-[#FFB300] hover:text-amber-200 font-bold flex items-center gap-0.5">
                <span>🔥 Star Offers %</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0 py-2">
              <span className="text-[11px] text-blue-200">
                Selected Branch: <strong className="text-white font-bold">{currentBranchLabel.split(",")[0]}</strong>
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // CONCEPT 6: KRYPTON BRUTALIST HEAVY-BORDERED INDUSTRIAL HEADER
  // =========================================================================
  if (activeConcept === "krypton") {
    const kryptonLinks = [
      { href: "/", label: "01 // Depot Manifest" },
      { href: "/catalog", label: "02 // Parts Catalog" },
      { href: "/product/gateron-oil-king-linear-pack-90", label: "03 // Switch Specifications" },
      { href: "/pc-builder", label: "04 // Dual Workbench" },
      { href: "/checkout", label: "05 // Checkout Cart" },
    ];

    return (
      <header className="sticky top-0 z-40 w-full bg-[#EBEAE5] border-b-2 border-black text-black shadow-[0_4px_0px_#000000] transition-colors">
        {/* Upper Status Ticker Strip */}
        <div className="bg-black text-[#FACC15] font-mono text-[10.5px] font-bold uppercase py-1 border-b-2 border-black px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[1536px] mx-auto flex items-center justify-between">
            <span>⚡ KRYPTON INDUSTRIAL DEPOT // ISO-9001 CALIBRATION RIG // 4 DEPOTS ACTIVE</span>
            <span className="hidden sm:inline">NATIONWIDE COD READY • DISPATCH WITHIN 4 HOURS</span>
          </div>
        </div>

        {/* Main Action Bar */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-[#FACC15] border-2 border-black flex items-center justify-center text-black font-extrabold text-sm shadow-[2px_2px_0px_#000000] font-mono">
              KP
            </div>
            <div className="flex flex-col">
              <div className="font-heading font-extrabold text-[17px] tracking-tight text-black leading-none flex items-center gap-1" style={{ fontFamily: "Syne, sans-serif" }}>
                KRYPTON<span className="text-[#EA580C]">DEPOT</span>
                <span className="text-[9px] font-bold bg-black text-[#FACC15] px-1 py-0.5 leading-none">06</span>
              </div>
              <span className="font-mono text-[8.5px] tracking-wider text-slate-700 uppercase mt-0.5 hidden sm:block">
                TACTILE HARDWARE FOUNDRY
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4">
            {kryptonLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-xs font-bold uppercase tracking-tight py-1 px-2 border transition-all ${
                    isActive
                      ? "bg-[#FACC15] text-black border-black shadow-[2px_2px_0px_#000000]"
                      : "border-transparent text-slate-800 hover:text-black hover:border-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FACC15] hover:bg-[#FDE047] text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-mono text-xs font-extrabold transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
              <span>{mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}</span>
              <span className="text-black/70">/ {mounted ? getTotalItemCount() : 0}</span>
            </Link>

            <Link
              href="/pc-builder"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-900 text-[#FACC15] border-2 border-black shadow-[2px_2px_0px_#000000] font-mono text-xs font-bold uppercase transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">handyman</span>
              <span>[ 🔨 Workbench ]</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // CONCEPT 1: VOLTMATRIX (DEFAULT) HIGH-DENSITY DUAL-TIER STICKY HEADER
  // =========================================================================
  const voltLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Parametric Catalog" },
    { href: "/product/amd-ryzen-7-7800x3d", label: "Interactive PDP" },
    { href: "/pc-builder", label: "System Architect" },
    { href: "/checkout", label: "Modular Cart" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-b border-slate-200 text-slate-900 transition-colors">
      {/* Tier 1: Utility & Branch Selector (h-14) */}
      <div className="w-full border-b border-slate-100">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Logo & Hub */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shadow-sm">
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
            </Link>

            {/* Branch Selector */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[12px] font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-[#EF4444]">location_on</span>
                <span>Hub: {currentBranchLabel.split(",")[0]}</span>
                <span className="material-symbols-outlined text-[14px] text-slate-400">
                  {isBranchDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isBranchDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 rounded-xl shadow-2xl border border-slate-200 bg-white py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-mono uppercase font-bold text-slate-500">
                    Select Importer Hub
                  </div>
                  {branches.map((b) => (
                    <button
                      key={b.key}
                      onClick={() => {
                        updateDeliveryDetails({ pickupBranch: b.key });
                        setIsBranchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[12px] flex items-center justify-between transition-colors ${
                        deliveryDetails.pickupBranch === b.key ? "bg-red-50 text-[#b61722] font-semibold" : "hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div>
                        <div>{b.label}</div>
                        <div className="text-[10px] font-mono text-emerald-600">{b.status}</div>
                      </div>
                      {deliveryDetails.pickupBranch === b.key && (
                        <span className="material-symbols-outlined text-[16px] text-[#b61722]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment Status Banner */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10.5px] uppercase tracking-wide font-bold">
              COD in 64 Districts • 2-Hour Express Pickup IDB / Multiplan
            </span>
          </div>

          {/* Right Actions: WhatsApp Specialist & Cart */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/8801700000000?text=Hello%20VoltMatrix%20Specialist"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded text-[11px] font-mono font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              <span>💬</span>
              <span className="hidden md:inline">Tech Specialist</span>
            </a>

            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#EF4444]">shopping_cart</span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {mounted ? `৳${getGrandTotal().toLocaleString()}` : "৳0"}
              </span>
              <span className="text-[11px] font-mono text-slate-500">/ {mounted ? getTotalItemCount() : 0}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tier 2: Category Mega Menu & Search Input (h-14) */}
      <div className="w-full">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <nav className="hidden lg:flex items-center gap-6 overflow-x-auto py-1">
            {voltLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] font-sans whitespace-nowrap transition-colors py-1 ${
                    isActive ? "text-[#EF4444] font-bold border-b-2 border-[#EF4444]" : "text-slate-600 hover:text-slate-900 font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Autocomplete Search & Builder CTA */}
          <div className="flex items-center gap-3 flex-1 lg:max-w-xl justify-end">
            <div className="relative w-full max-w-md" ref={searchRef}>
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search 50,000+ parts, sockets, or GPUs..."
                className="w-full h-8 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-colors"
              />

              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase font-bold text-slate-500 border-b border-slate-100">
                    Hardware Matches
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-8 h-8 object-contain rounded bg-slate-100 p-0.5" />
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-xs">{item.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item.brand} • {item.sku}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-[#EF4444]">
                        ৳{item.price.toLocaleString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/pc-builder"
              className="flex items-center gap-1.5 px-3 sm:px-4 h-8 bg-[#EF4444] hover:bg-[#dc2626] text-white rounded font-mono text-xs font-bold uppercase tracking-tight shadow-sm whitespace-nowrap transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>[ Launch PC Builder ]</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
