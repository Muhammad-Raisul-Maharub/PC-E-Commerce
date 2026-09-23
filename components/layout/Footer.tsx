"use client";

import React from "react";
import Link from "next/link";
import { useConceptStore } from "@/store/useConceptStore";

export default function Footer() {
  const { activeConcept } = useConceptStore();
  const isNeon = activeConcept === "neonforge";
  const isAxiom = activeConcept === "axiom";
  const isSynapse = activeConcept === "synapse";
  const isOmni = activeConcept === "omnipulse";
  const isKrypton = activeConcept === "krypton";

  return (
    <footer
      className={`w-full mt-16 transition-colors duration-300 border-t ${isKrypton
          ? "bg-[#1E1E24] border-t-4 border-black text-[#EBEAE5]"
          : isOmni
          ? "bg-[#061B3D] border-[#0D47A1] text-blue-100"
          : isNeon
            ? "bg-[#0A0A0F] border-cyan-500/30 text-slate-300"
            : isAxiom
              ? "bg-[#FBFBFD] border-[#E4E4E7] text-[#52525B]"
              : isSynapse
                ? "bg-[#0F172A] border-[#334155] text-slate-300"
                : "bg-white border-slate-200 text-slate-800"
        }`}
    >
      {/* Authorized Tier-1 Strip */}
      <div
        className={`w-full px-4 py-4 border-b ${isKrypton
            ? "bg-[#000000] border-b-2 border-black"
            : isOmni
            ? "bg-[#0A2558] border-[#0D47A1]"
            : isNeon
              ? "bg-[#12121A]/80 border-cyan-500/20"
              : isAxiom
                ? "bg-white border-[#E4E4E7]"
                : isSynapse
                  ? "bg-[#1E293B]/80 border-[#334155]"
                  : "bg-slate-50/60 border-slate-200"
          }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10.5px] uppercase font-bold ${isKrypton ? "text-[#FACC15]" : isOmni ? "text-[#FFB300]" : isNeon ? "text-cyan-400" : isAxiom ? "text-[#004F32]" : isSynapse ? "text-cyan-400" : "text-slate-500"
                }`}
            >
              {isKrypton
                ? "Authorized Maker & Tactile Foundry Alliance:"
                : isOmni
                ? "Official Authorized Bangladesh Retail Brands:"
                : isNeon
                  ? "Authorized Liquid Artisan Alliance:"
                  : isAxiom
                    ? "Authorized Enterprise Workstation Alliance:"
                    : isSynapse
                      ? "Authorized Technical CAD & Architecture Alliance:"
                      : "Authorized Tier-1 Foundry Partner:"}
            </span>
          </div>
          <div
            className={`flex items-center flex-wrap gap-2 sm:gap-3 font-mono text-[10.5px] ${isKrypton ? "text-[#EBEAE5]" : isOmni ? "text-blue-100" : isNeon ? "text-slate-200" : isAxiom ? "text-[#18181B]" : isSynapse ? "text-slate-200" : "text-slate-700"
              }`}
          >
            {isKrypton ? (
              <>
                <span className="px-2 py-1 bg-[#1E1E24] border border-[#FACC15] text-[#FACC15] font-mono font-bold rounded-none">GATERON SWITCH LABS</span>
                <span className="px-2 py-1 bg-[#1E1E24] border border-[#EA580C] text-[#EA580C] font-mono font-bold rounded-none">CHERRY MX OFFICIAL</span>
                <span className="px-2 py-1 bg-[#1E1E24] border border-white text-white font-mono font-bold rounded-none">KAILH BOX DEPOT</span>
                <span className="px-2 py-1 bg-[#1E1E24] border border-white text-white font-mono rounded-none">ASUS ROG HARDWARE</span>
                <span className="px-2 py-1 bg-[#1E1E24] border border-white text-white font-mono rounded-none">SAMSUNG MEMORY BD</span>
                <span className="px-2 py-1 bg-[#1E1E24] border border-[#84CC16] text-[#84CC16] font-mono font-bold rounded-none">RASPBERRY PI FOUNDATION</span>
              </>
            ) : isOmni ? (
              <>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-[#FFB300] font-bold">ASUS ROG OFFICIAL BD</span>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-white font-bold">MSI GAMING BD</span>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-white font-bold">GIGABYTE AORUS</span>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-white font-bold">SAMSUNG BD</span>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-white font-bold">SONY OFFICIAL</span>
                <span className="px-2 py-1 bg-[#061B3D] border border-[#0D47A1] rounded text-[#FFB300] font-bold">MUSHAK-6.3 VAT COMPLIANT</span>
              </>
            ) : isNeon ? (
              <>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">EKWB LIQUID SYSTEMS</span>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">LIAN LI DISTRO LABS</span>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">CORSAIR HYDRO X</span>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">ALPHACOOL NEXXXOS</span>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">BITSLPOWER FITTINGS</span>
                <span className="px-2 py-1 bg-[#0A0A0F] border border-cyan-500/40 rounded text-cyan-300">THERMAL GRIZZLY</span>
              </>
            ) : isAxiom ? (
              <>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded text-[#004F32] font-bold">AMD THREADRIPPER PRO</span>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded text-[#004F32] font-bold">NVIDIA RTX ADA ENTERPRISE</span>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded">ASUS PROART WRX90</span>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded">KINGSTON SERVER PREMIER</span>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded">MICRON ENTERPRISE NVME</span>
                <span className="px-2 py-1 bg-[#FBFBFD] border border-[#E4E4E7] rounded">SUPERMICRO FABRIC</span>
              </>
            ) : isSynapse ? (
              <>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded text-cyan-400 font-mono font-bold">AMD EPYC &amp; RYZEN ARCH</span>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded text-cyan-400 font-mono font-bold">NVIDIA ADA WORKBENCH</span>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded font-mono">ASUS PROART &amp; ROG CAD</span>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded font-mono">LIAN LI CAD CHASSIS</span>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded font-mono">NOCTUA INDUSTRIAL</span>
                <span className="px-2 py-1 bg-[#0F172A] border border-[#334155] rounded font-mono">SAMSUNG PRO ENTERPRISE</span>
              </>
            ) : (
              <>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">INTEL ARC &amp; CORE ARCH</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">AMD RYZEN &amp; RADEON</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">NVIDIA GEFORCE RTX</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">ASUS ROG ALLIANCE</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">GIGABYTE AORUS</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded">CORSAIR LABS</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid */}
      <div className={`w-full px-4 py-12 ${isKrypton ? "bg-[#1E1E24] text-[#EBEAE5]" : isNeon ? "bg-[#0A0A0F]" : isSynapse ? "bg-[#0F172A]" : "bg-white"}`}>
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Physical Branch Network */}
          <div className="space-y-3">
            <div
              className={`font-semibold text-[15px] uppercase tracking-tight ${isKrypton ? "font-syne text-[#FACC15] font-black" : isNeon ? "font-chakra text-white" : isSynapse ? "font-mono text-white" : "font-headline text-slate-900"
                }`}
            >
              {isKrypton ? "Heavy Maker & Depot Network" : isNeon ? "Bespoke Modding Depots" : isSynapse ? "Technical Assembly Depots" : "Physical Showroom Network"}
            </div>
            <ul className={`space-y-2 text-[12px] ${isKrypton ? "text-[#A1A1AA] font-mono" : isNeon ? "text-slate-400 font-sans" : isSynapse ? "text-slate-400 font-mono" : "text-slate-600 font-sans"}`}>
              <li>
                <strong className={`block ${isKrypton ? "text-white font-bold" : isNeon ? "text-cyan-300" : isSynapse ? "text-cyan-400" : "text-slate-900"}`}>
                  {isKrypton ? "Elephant Road Maker Depot:" : "Dhaka IDB Flagship Lab:"}
                </strong>
                {isKrypton ? "Suite 401, Multiplan Centre, New Elephant Rd, Dhaka" : "Shop 318-320, Level 3, IDB Bhaban, Agargaon, Dhaka 1207"}
              </li>
              <li>
                <strong className={`block ${isKrypton ? "text-white font-bold" : isNeon ? "text-cyan-300" : isSynapse ? "text-cyan-400" : "text-slate-900"}`}>
                  {isKrypton ? "IDB Hardware Depot Bay:" : "Multiplan Modder Studio:"}
                </strong>
                {isKrypton ? "Shop 112, Ground Fl, IDB Bhaban, Agargaon, Dhaka" : "Suite 902-904, Level 9, New Elephant Road, Dhaka"}
              </li>
              <li>
                <strong className={`block ${isKrypton ? "text-white font-bold" : isNeon ? "text-cyan-300" : isSynapse ? "text-cyan-400" : "text-slate-900"}`}>
                  {isKrypton ? "Agrabad Electronics Terminal:" : "Motijheel Enterprise Bay:"}
                </strong>
                {isKrypton ? "Level 3, Akhtaruzzaman Centre, Agrabad, Chattogram" : "Ground Floor, 42 Dilkusha C/A, Motijheel, Dhaka 1000"}
              </li>
              <li>
                <strong className={`block ${isKrypton ? "text-white font-bold" : isNeon ? "text-cyan-300" : isSynapse ? "text-cyan-400" : "text-slate-900"}`}>
                  {isKrypton ? "Rajshahi Maker Hub:" : "Chittagong GEC Showroom:"}
                </strong>
                {isKrypton ? "Shop 22, Alokar Mor, Station Rd, Rajshahi" : "Level 4, Sanmar Ocean City, GEC Circle, Chittagong"}
              </li>
            </ul>
          </div>

          {/* Column 2: Logistics & Fulfillment */}
          <div className="space-y-3">
            <div
              className={`font-semibold text-[15px] uppercase tracking-tight ${isKrypton ? "font-syne text-[#FACC15] font-black" : isNeon ? "font-chakra text-white" : isSynapse ? "font-mono text-white" : "font-headline text-slate-900"
                }`}
            >
              {isKrypton ? "Shockproof Industrial Freight" : isNeon ? "Cryo-Safe Logistics" : isSynapse ? "CAD Tolerance & Calibration" : "Logistics & Packaging"}
            </div>
            <p className={`text-[12px] leading-relaxed ${isKrypton ? "text-[#A1A1AA] font-mono" : isNeon ? "text-slate-400" : isSynapse ? "text-slate-400 font-mono" : "text-slate-600"}`}>
              {isKrypton
                ? "Heavy-gauge reinforced corrugated packaging with custom high-density EPE foam cutouts, anti-static ESD bags, and tamper-proof bolt seals."
                : isNeon
                ? "Reinforced wooden flight crates with internal foam CNC routing, pressure relief valves, and tilt/drop telemetry indicators for high-end custom loops."
                : isSynapse
                  ? "Every workstation undergoes millimetric 3D bounding box verification, laser plane leveling, and 24-hour OCCT thermal validation."
                  : "Nationwide high-security surface dispatch with real-time temperature, shock-sensor logging, and reinforced wooden crating for custom PC rigs."}
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
              {isKrypton ? (
                <>
                  <span className="px-2 py-1 bg-black border border-[#FACC15] text-[#FACC15] rounded-none">Steel Crate Strapped</span>
                  <span className="px-2 py-1 bg-black border border-[#EA580C] text-[#EA580C] rounded-none">ESD Moisture Bagged</span>
                  <span className="px-2 py-1 bg-black border border-white text-white rounded-none">Steadfast Heavy Cargo</span>
                  <span className="px-2 py-1 bg-black border border-white text-white rounded-none">Pathao 24H Air/Surface</span>
                </>
              ) : isNeon ? (
                <>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">Wooden Flight Crate</span>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">Drain &amp; Dry Prep</span>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">RedX Fragile Freight</span>
                </>
              ) : isSynapse ? (
                <>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">±0.15mm Jig Checked</span>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">24H OCCT Stress</span>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">Anti-Static Crate</span>
                </>
              ) : (
                <>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">Pathao Logistics</span>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">Steadfast Express</span>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">RedX Heavy Cargo</span>
                </>
              )}
            </div>
          </div>

          {/* Column 3: Payment Gateways */}
          <div className="space-y-3">
            <div
              className={`font-semibold text-[15px] uppercase tracking-tight ${isKrypton ? "font-syne text-[#FACC15] font-black" : isNeon ? "font-chakra text-white" : isSynapse ? "font-mono text-white" : "font-headline text-slate-900"
                }`}
            >
              {isKrypton ? "Heavy Settlement & Gateways" : isNeon ? "Cyber Gateway & EMI" : isSynapse ? "CAD Settlement & Payment" : "Payment Gateways & EMI"}
            </div>
            <p className={`text-[12px] leading-relaxed ${isKrypton ? "text-[#A1A1AA] font-mono" : isNeon ? "text-slate-400" : isSynapse ? "text-slate-400 font-mono" : "text-slate-600"}`}>
              {isKrypton
                ? "Instant bKash merchant integration, Nagad, nationwide Cash on Delivery across 64 districts, and up to 24 months 0% bank EMI."
                : "Instant checkout verification, 0% EMI financing up to 24 months, bKash/Nagad instant verification, and nationwide COD."}
            </p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
              {isKrypton ? (
                <>
                  <span className="px-2 py-1 bg-black border border-[#FACC15] text-[#FACC15] rounded-none">bKash Merchant</span>
                  <span className="px-2 py-1 bg-black border border-[#EA580C] text-[#EA580C] rounded-none">Nagad Instant</span>
                  <span className="px-2 py-1 bg-black border border-[#84CC16] text-[#84CC16] rounded-none">64 Districts COD</span>
                  <span className="px-2 py-1 bg-black border border-white text-white rounded-none">0% EMI (24 Mos)</span>
                </>
              ) : isNeon ? (
                <>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">bKash Merchant</span>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">Nagad Pay</span>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">VISA 3D-Secure</span>
                  <span className="px-2 py-1 bg-[#12121A] border border-cyan-500/30 text-cyan-300 rounded">0% EMI (24 Mos)</span>
                </>
              ) : isSynapse ? (
                <>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">bKash Merchant</span>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">Nagad Pay</span>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">Corporate PO / Wire</span>
                  <span className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-cyan-300 rounded">0% EMI (24 Mos)</span>
                </>
              ) : (
                <>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">bKash Merchant</span>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">Nagad Pay</span>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded">VISA / MC 3DS</span>
                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800">0% EMI (24 Mos)</span>
                </>
              )}
            </div>
          </div>

          {/* Column 4: Hardware Engineering Support */}
          <div className="space-y-3">
            <div
              className={`font-semibold text-[15px] uppercase tracking-tight ${isKrypton ? "font-syne text-[#FACC15] font-black" : isNeon ? "font-chakra text-white" : isSynapse ? "font-mono text-white" : "font-headline text-slate-900"
                }`}
            >
              {isKrypton ? "Depot Hardware Support" : isNeon ? "Modding Concierge" : isSynapse ? "CAD Engineering Support" : "Hardware Lab Support"}
            </div>
            <p className={`text-[12px] leading-relaxed ${isKrypton ? "text-[#A1A1AA] font-mono" : isNeon ? "text-slate-400" : isSynapse ? "text-slate-400 font-mono" : "text-slate-600"}`}>
              {isKrypton ? (
                <>Maker Depot Hotline: <strong className="text-[#FACC15]">+880 1700-KRYPTON-DEPOT</strong> (10:00 AM - 10:00 PM)</>
              ) : isNeon ? (
                <>Artisan Loop Hotline: <strong className="text-cyan-300">+880 1700-NEON-MOD</strong></>
              ) : isSynapse ? (
                <>CAD Hotline: <strong className="text-cyan-400">+880 1700-SYNAPSE-CAD</strong></>
              ) : (
                <>Central Foundry Hotline: <strong>+880 9612-VOLT-MX</strong> (10:00 AM - 9:00 PM)</>
              )}
            </p>
            <div
              className={`p-3 rounded-none space-y-1 border-2 ${isKrypton
                  ? "bg-black border-black text-[#EBEAE5]"
                  : isNeon
                  ? "bg-[#12121A] border-cyan-500/30 text-slate-300 rounded-xl"
                  : isSynapse
                    ? "bg-[#1E293B] border-[#334155] text-slate-200 rounded-xl"
                    : "bg-slate-50 border-slate-200 text-slate-700 rounded-xl"
                }`}
            >
              <div className="text-[11px] font-medium font-mono">
                {isKrypton ? "WhatsApp Depot Engineer Desk:" : isNeon ? "WhatsApp Modding Concierge:" : isSynapse ? "WhatsApp CAD Engineering Desk:" : "WhatsApp Hardware Specialist:"}
              </div>
              <a
                href={
                  isKrypton
                    ? "https://wa.me/8801700000000?text=Hello%20Krypton%20Hardware%20Depot"
                    : isSynapse
                    ? "https://wa.me/8801700000000?text=Hello%20SynapseCAD%20Engineering%20Desk"
                    : "https://wa.me/8801700000000"
                }
                target="_blank"
                rel="noreferrer"
                className={`font-mono text-[12px] font-bold block hover:underline ${isKrypton ? "text-[#25D366]" : isNeon ? "text-[#00F0FF]" : isSynapse ? "text-[#06B6D4]" : "text-emerald-600"
                  }`}
              >
                {isKrypton ? "+880 1700-KRYPTON-DEPOT" : isSynapse ? "+880 1700-SYNAPSE-CAD" : isNeon ? "+880 1700-NEON-MOD" : "+880 9612-VOLT-MX"}
              </a>
              <div className={`text-[10px] font-mono ${isKrypton ? "text-[#A1A1AA]" : isNeon ? "text-slate-400" : isSynapse ? "text-slate-400" : "text-slate-500"}`}>
                {isKrypton ? "Tactile switch consultation, pinout verification & keyboard staging" : isSynapse ? "Direct parametric schematic & clearance check" : "Live loop blueprint & laser engraving consultation"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Latency Bar */}
      <div
        className={`w-full px-4 py-3 border-t ${isKrypton
            ? "bg-black border-t-2 border-black text-[#A1A1AA]"
            : isNeon
            ? "bg-[#0A0A0F] border-cyan-500/20 text-slate-400"
            : isSynapse
              ? "bg-[#0F172A] border-[#334155] text-slate-400"
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            {isKrypton
              ? "© 2026 Krypton Brutalist Depot Ltd. Industrial Computing Hardware & Tactile Keyboard Lab. Mushak-6.3 VAT Registered."
              : isOmni
              ? "© 2026 OmniPulse BD Ltd. Omnichannel Hyper-Local Computing & Gadget Retail Hub. Mushak-6.3 VAT Registered."
              : isNeon
                ? "© 2026 NeonForge Labs Ltd. Cyberpunk Custom Liquid Cooling & Extreme Battlestation Division."
                : isSynapse
                  ? "© 2026 SynapseCAD Architectural Systems Ltd. Parametric PC Blueprint Foundry."
                  : "© 2026 VoltMatrix Bangladesh Ltd. Precision Hardware & Parametric Systems Foundry."}
          </div>
          <div className="font-mono text-[10px] flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isKrypton ? "bg-[#FACC15]" : isOmni ? "bg-[#FFB300]" : isNeon ? "bg-[#00F0FF]" : isSynapse ? "bg-[#06B6D4]" : "bg-emerald-500"}`}
            ></span>
            <span className={isKrypton ? "text-[#FACC15]" : isOmni ? "text-[#FFB300]" : isNeon ? "text-cyan-400" : isSynapse ? "text-cyan-400" : "text-slate-600"}>
              {isKrypton
                ? "DEPOT STATUS: READY FOR DISPATCH • 64 DISTRICTS COD ACTIVE • TACTILE LATENCY: 0.1MS"
                : isOmni
                ? "5 REGIONAL SHOWROOMS • 64 DISTRICTS COD ACTIVE • 0% EMI READY"
                : isNeon
                  ? "PRESSURE: 0.85 BAR • FLOW: 4.2 L/MIN • CHOPPER SENSOR ACTIVE"
                  : isSynapse
                    ? "TOLERANCE: ±0.15MM • CAD ENGINE V12.8 • ACTIVE"
                    : "LATENCY: 14MS • DHAKA HUB 01 • BTRC CERTIFIED"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

