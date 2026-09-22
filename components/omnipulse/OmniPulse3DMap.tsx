"use client";

import React, { useState } from "react";
import { useCartStore, BranchKey } from "@/store/useCartStore";

interface BranchData {
  key: BranchKey;
  name: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  hours: string;
  stockStatus: string;
  stockBadgeColor: string;
  readyTime: string;
  x: number; // percentage in SVG coordinate map
  y: number;
  skusInStock: number;
}

export const RETAIL_BRANCHES: BranchData[] = [
  {
    key: "idb",
    name: "IDB Bhaban Flagship Depot",
    tagline: "Dhaka Central Showroom",
    location: "BCS Computer City, Agargaon, Dhaka",
    address: "Shop 124-128, Ground Floor, IDB Bhaban, E/8-A Rokeya Sarani, Dhaka 1207",
    phone: "+880 1711-234567",
    hours: "10:00 AM – 8:30 PM (Sun–Thu), Open Saturday",
    stockStatus: "High Stock (4,200+ Units)",
    stockBadgeColor: "bg-emerald-500",
    readyTime: "Instant 2-Hour Pickup",
    x: 48,
    y: 38,
    skusInStock: 4210,
  },
  {
    key: "multiplan",
    name: "Multiplan Center Hub",
    tagline: "Elephant Road Tech Center",
    location: "Level 9, Multiplan Center, Dhaka",
    address: "Shop 902-906, Multiplan Center, 69-71 New Elephant Road, Dhaka 1205",
    phone: "+880 1711-345678",
    hours: "10:00 AM – 8:00 PM (Closed Tuesday)",
    stockStatus: "Optimal Stock (3,850+ Units)",
    stockBadgeColor: "bg-emerald-500",
    readyTime: "Same-Day Collection",
    x: 52,
    y: 46,
    skusInStock: 3850,
  },
  {
    key: "uttara",
    name: "Uttara Tech Plaza",
    tagline: "North Dhaka Regional Depot",
    location: "Sector 3, Uttara Model Town, Dhaka",
    address: "Plot 18, Road 2, Sector 3, Uttara, Dhaka 1230",
    phone: "+880 1711-456789",
    hours: "10:00 AM – 8:00 PM (Open Daily)",
    stockStatus: "Active Stock (2,400+ Units)",
    stockBadgeColor: "bg-blue-500",
    readyTime: "Ready in 2 Hours",
    x: 46,
    y: 24,
    skusInStock: 2430,
  },
  {
    key: "motijheel",
    name: "Motijheel Commercial HQ",
    tagline: "B2B & Corporate Distribution Hub",
    location: "Dilkusha C/A, Motijheel, Dhaka",
    address: "City Centre, Level 14, 90/1 Motijheel C/A, Dhaka 1000",
    phone: "+880 1711-567890",
    hours: "9:30 AM – 6:30 PM (Fri/Sat Closed)",
    stockStatus: "Enterprise Warehouse (8,500+ Units)",
    stockBadgeColor: "bg-indigo-500",
    readyTime: "Corporate Dispatch",
    x: 55,
    y: 54,
    skusInStock: 8520,
  },
  {
    key: "chittagong",
    name: "Chittagong GEC Sanmar Showroom",
    tagline: "Port City Regional Mega Hub",
    location: "Sanmar Ocean City, GEC Circle, Chattogram",
    address: "Shop 401-405, 4th Floor, Sanmar Ocean City, Nasirabad, Chattogram 4000",
    phone: "+880 1711-678901",
    hours: "10:30 AM – 8:30 PM (Open 7 Days)",
    stockStatus: "Regional Hub (3,100+ Units)",
    stockBadgeColor: "bg-amber-500",
    readyTime: "Same-Day Collection",
    x: 78,
    y: 72,
    skusInStock: 3120,
  },
];

export default function OmniPulse3DMap() {
  const { deliveryDetails, updateDeliveryDetails } = useCartStore();
  const [selectedBranchKey, setSelectedBranchKey] = useState<BranchKey>(
    deliveryDetails.pickupBranch || "idb"
  );
  const [hoveredBranchKey, setHoveredBranchKey] = useState<BranchKey | null>(null);

  const activeBranch =
    RETAIL_BRANCHES.find((b) => b.key === selectedBranchKey) || RETAIL_BRANCHES[0];

  const handleSelectBranch = (key: BranchKey) => {
    setSelectedBranchKey(key);
    updateDeliveryDetails({ pickupBranch: key });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0A2558] to-[#0D47A1] text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB300] animate-ping" />
            <span className="font-sans text-xs uppercase font-bold tracking-wider text-[#FFB300]">
              Hyper-Local Retail Network
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-sans">
            Real-Time Physical Branch Telemetry
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
            Select your preferred physical store for instant 2-hour pickup or local express dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-right">
            <div className="text-[10px] text-blue-200 uppercase font-mono">Active Network Hub</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {activeBranch.name.split(" ")[0]} Hub
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Visual + Branch Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Interactive Regional SVG Map (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 bg-[#F4F6F9] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Map Grid Lines */}
          <div className="relative w-full h-[320px] sm:h-[380px] bg-gradient-to-b from-white to-[#F0F4F8] rounded-xl border border-slate-200 shadow-inner flex items-center justify-center p-4">
            {/* SVG Interactive Regional Map (Bangladesh Dhaka-Chattogram corridor) */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[360px] drop-shadow-sm select-none"
            >
              <defs>
                <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0D47A1" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.03" />
                </linearGradient>
                <radialGradient id="pulseBeacon">
                  <stop offset="0%" stopColor="#FFB300" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Stylized Regional Bangladesh Landmass Outline */}
              <path
                d="M 32 15 C 38 12, 52 14, 58 18 C 64 22, 68 28, 62 38 C 58 45, 60 52, 65 60 C 72 68, 85 68, 88 80 C 85 92, 70 94, 62 88 C 50 82, 45 74, 40 68 C 34 60, 32 50, 30 38 C 28 26, 26 18, 32 15 Z"
                fill="url(#mapGlow)"
                stroke="#CBD5E1"
                strokeWidth="0.8"
                strokeDasharray="1.5 1.5"
              />

              {/* Highway Corridor connection line from Dhaka to Chittagong */}
              <path
                d="M 48 38 Q 62 55, 78 72"
                fill="none"
                stroke="#0D47A1"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                className="opacity-40 animate-pulse"
              />

              {/* Express Delivery Radius Indicator for Selected Branch */}
              <circle
                cx={activeBranch.x}
                cy={activeBranch.y}
                r="10"
                fill="#FFB300"
                fillOpacity="0.15"
                stroke="#FFB300"
                strokeWidth="0.6"
              >
                <animate
                  attributeName="r"
                  values="6;14;6"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.2;0.8"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Branch Markers */}
              {RETAIL_BRANCHES.map((b) => {
                const isSelected = selectedBranchKey === b.key;
                const isHovered = hoveredBranchKey === b.key;

                return (
                  <g
                    key={b.key}
                    onClick={() => handleSelectBranch(b.key)}
                    onMouseEnter={() => setHoveredBranchKey(b.key)}
                    onMouseLeave={() => setHoveredBranchKey(null)}
                    className="cursor-pointer transition-transform duration-200"
                  >
                    {/* Outer target ring */}
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={isSelected ? "3.6" : "2.8"}
                      fill={isSelected ? "#0D47A1" : isHovered ? "#FFB300" : "#FFFFFF"}
                      stroke={isSelected ? "#FFB300" : "#0D47A1"}
                      strokeWidth={isSelected ? "1" : "0.8"}
                      className="transition-all"
                    />

                    {/* Center Dot */}
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r="1.2"
                      fill={isSelected ? "#FFB300" : "#0D47A1"}
                    />

                    {/* Branch Label Badge */}
                    <text
                      x={b.x + (b.x > 60 ? -3 : 3.5)}
                      y={b.y + (b.key === "multiplan" ? 3.5 : -1.5)}
                      fontSize="3.2"
                      fontWeight={isSelected ? "700" : "500"}
                      fill={isSelected ? "#0D47A1" : "#475569"}
                      textAnchor={b.x > 60 ? "end" : "start"}
                      className="font-sans pointer-events-none select-none"
                    >
                      {b.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 font-sans shadow-sm flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0D47A1]" /> Selected Depot
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FFB300]" /> Express Radius
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>

          {/* District timeline banner */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="material-symbols-outlined text-[#0D47A1] text-base">
                local_shipping
              </span>
              <span className="font-medium">
                Outside Dhaka &amp; Ctg? <strong>64 Districts Courier</strong> with Cash on Delivery (COD) arrives in 24–48 hours.
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#0D47A1] bg-[#E3F2FD] px-2 py-0.5 rounded shrink-0">
              Steadfast / Sundarban
            </span>
          </div>
        </div>

        {/* Right Side: Branch List Cards & Active Details (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between gap-4 bg-white">
          <div className="space-y-2.5">
            <div className="text-xs font-bold font-sans uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Select Physical Showroom</span>
              <span className="text-[#0D47A1] font-mono font-normal">5 Depots Available</span>
            </div>

            {RETAIL_BRANCHES.map((branch) => {
              const isSelected = selectedBranchKey === branch.key;

              return (
                <button
                  key={branch.key}
                  onClick={() => handleSelectBranch(branch.key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? "border-[#0D47A1] bg-[#E3F2FD]/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-[#0D47A1]" : "bg-slate-300"
                        }`}
                      />
                      <span
                        className={`font-sans text-sm font-bold ${
                          isSelected ? "text-[#0D47A1]" : "text-slate-800"
                        }`}
                      >
                        {branch.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 pl-4">
                      {branch.location}
                    </p>
                    <div className="flex items-center gap-2 pl-4 text-[11px]">
                      <span className="text-emerald-700 font-medium">
                        ✓ {branch.readyTime}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-mono">
                        {branch.skusInStock.toLocaleString()} SKUs
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="material-symbols-outlined text-[#0D47A1] text-base shrink-0 mt-0.5">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Branch Callout Footer */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{activeBranch.name}</span>
              <span className="text-emerald-600 font-mono text-[11px]">● OPEN TODAY</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {activeBranch.address}
            </p>
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              <span>📞 {activeBranch.phone}</span>
              <span className="text-[#0D47A1] font-medium font-sans">
                {activeBranch.hours}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
