"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { HardwareProduct, BRANCH_NAMES } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";

const WaterBlockExploded3D = dynamic(
  () => import("@/components/canvas/WaterBlockExploded3D"),
  {
    ssr: false,
        loading: () => (
          <div className="w-full h-80 sm:h-96 bg-[#0A0A0F] rounded-xl flex flex-col items-center justify-center border border-cyan-500/30 font-mono text-cyan-400 text-xs">
            <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></span>
            LOADING 3D INTERACTIVE PART ASSEMBLY...
          </div>
        ),
      }
    );

    interface NeonForgePDPProps {
      product: HardwareProduct;
    }

    export default function NeonForgePDP({ product }: NeonForgePDPProps) {
      const { addStandaloneItem } = useCartStore();

      // Modding Add-on Customizer States
      const [includeLiquidMetal, setIncludeLiquidMetal] = useState(false);
      const [includeFittings, setIncludeFittings] = useState(false);
      const [includeLaserEngraving, setIncludeLaserEngraving] = useState(false);
      const [laserText, setLaserText] = useState("");
      const [addedToast, setAddedToast] = useState(false);

      const liquidMetalPrice = 1200;
      const fittingsPrice = 2400;
      const engravingPrice = 800;

      const customizedTotalPrice =
        product.price +
        (includeLiquidMetal ? liquidMetalPrice : 0) +
        (includeFittings ? fittingsPrice : 0) +
        (includeLaserEngraving ? engravingPrice : 0);

      const handleAddToCart = () => {
        addStandaloneItem(product, 1);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 2500);
      };

      return (
        <div className="w-full min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-[#00F0FF] selection:text-[#0A0A0F] py-8">
          <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Top Breadcrumb */}
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Link href="/" className="hover:text-cyan-400">
                Showroom
              </Link>
              <span>/</span>
              <Link href="/catalog" className="hover:text-cyan-400">
                Custom Cooling &amp; Hardware Catalog
              </Link>
              <span>/</span>
              <span className="text-cyan-400 font-bold uppercase">{product.name}</span>
            </div>

            {/* 2-Column Upper Viewport: 3D CAD Exploded Stage + Commercial Buy Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: 3D Exploded Water Block Viewport */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#12121A]/90 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
                  <WaterBlockExploded3D />

                  <div className="mt-4 p-3 bg-[#0A0A0F] rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-slate-300">PRECISION MACHINE FIT: ±0.005 MM</span>
                    </div>
                    <div className="text-cyan-300">
                      WATER FLOW RESTRICTION: ULTRA-LOW (0.12 PSI)
                    </div>
                  </div>
                </div>

                {/* Product Overview Summary */}
                <div className="bg-[#12121A]/80 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="font-chakra text-base font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400">verified</span>
                    <span>Cooling Engineering &amp; Build Overview</span>
                  </h3>
                  <p className="font-sans text-sm text-slate-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Right Column: Commercial Buy Box & Modding Add-On Customizer */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[#12121A]/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
                  {/* Product Title & Brand */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                        {product.brand} • OFFICIAL ALLIANCE
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        Item Code: {product.sku}
                      </span>
                    </div>
                    <h1 className="font-chakra text-2xl font-bold text-white leading-snug">
                      {product.name}
                    </h1>
                  </div>

              {/* Dynamic Price Readout */}
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-cyan-500/30 flex items-baseline justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 block uppercase">
                    Total Price (Including Add-Ons)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-rajdhani text-3xl font-extrabold text-white">
                      ৳{customizedTotalPrice.toLocaleString()}
                    </span>
                    {product.regularPrice > product.price && (
                      <span className="font-mono text-sm text-slate-500 line-through">
                        ৳{product.regularPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                  IN STOCK DHAKA LAB
                </span>
              </div>

              {/* Modding Add-On Customizer Box */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-chakra text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-cyan-400 text-sm">build</span>
                    <span>Customization &amp; Installation Add-Ons</span>
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">OPTIONAL</span>
                </div>

                {/* Add-on 1: Liquid Metal Thermal Paste */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0F] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includeLiquidMetal}
                    onChange={(e) => setIncludeLiquidMetal(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#00F0FF] rounded"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-white font-mono">
                      <span>Extreme Heat Transfer Paste (Liquid Metal)</span>
                      <span className="text-[#00F0FF]">+৳1,200</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      73 W/mK ultra-high thermal conductivity liquid gallium alloy.
                    </p>
                  </div>
                </label>

                {/* Add-on 2: Dual Rotary 90-Degree G1/4 Fittings */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0A0A0F] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={includeFittings}
                    onChange={(e) => setIncludeFittings(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#00F0FF] rounded"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-white font-mono">
                      <span>Dual 90° Rotary Tube Connectors (Pair)</span>
                      <span className="text-[#00F0FF]">+৳2,400</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Dual rotatable leak-proof titanium connectors with rubber seals.
                    </p>
                  </div>
                </label>

                {/* Add-on 3: Custom Laser Engraving */}
                <div className="p-3 rounded-xl bg-[#0A0A0F] border border-slate-800 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLaserEngraving}
                        onChange={(e) => setIncludeLaserEngraving(e.target.checked)}
                        className="w-4 h-4 accent-[#00F0FF] rounded"
                      />
                      <span className="font-mono text-xs font-bold text-white">
                        Custom Laser Name/Text Engraving
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#00F0FF]">+৳800</span>
                  </label>

                  {includeLaserEngraving && (
                    <input
                      type="text"
                      value={laserText}
                      onChange={(e) => setLaserText(e.target.value)}
                      placeholder="e.g. CYBERNOVA-MK1 // CALLSIGN"
                      maxLength={24}
                      className="w-full h-8 px-3 rounded bg-[#12121A] border border-cyan-500/40 text-xs font-mono text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-300"
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#00F0FF] hover:bg-[#00dbe9] text-[#0A0A0F] font-chakra font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>Add Customized Setup to Cart</span>
                </button>

                {addedToast && (
                  <div className="p-2 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-300 font-mono text-xs text-center animate-in fade-in">
                    ✓ Custom hardware setup added to cart.
                  </div>
                )}

                <a
                  href="https://wa.me/8801700000000?text=Hello%20Modding%20Lab,%20I%20want%20to%20consult%20on%20fitting%20this%20waterblock."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#12121A] hover:bg-[#1E1E2D] border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>WhatsApp Custom Cooling Expert</span>
                </a>
              </div>

              {/* Physical Branch Stock Matrix */}
              <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs">
                <div className="text-slate-400 uppercase text-[10px] font-bold">
                  Store Pickup &amp; Stock Availability
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-[#0A0A0F] border border-white/5 flex items-center justify-between">
                    <span>IDB Flagship:</span>
                    <span className="text-emerald-400 font-bold">{product.branchStock.idb} Units</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0A0F] border border-white/5 flex items-center justify-between">
                    <span>Multiplan Lab:</span>
                    <span className="text-emerald-400 font-bold">{product.branchStock.multiplan} Units</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0A0F] border border-white/5 flex items-center justify-between">
                    <span>Chittagong:</span>
                    <span className="text-emerald-400 font-bold">{product.branchStock.chittagong} Units</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0A0F] border border-white/5 flex items-center justify-between">
                    <span>Motijheel Hub:</span>
                    <span className="text-emerald-400 font-bold">{product.branchStock.motijheel} Units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Technical Pinout & Fluid Dynamics Matrix */}
        <div className="bg-[#12121A]/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-chakra text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">microscope</span>
            <span>Detailed Liquid Cooling &amp; Material Specifications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-2">
              <span className="text-cyan-400 font-bold uppercase text-[11px] block">
                Water Flow &amp; Pressure Specs
              </span>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Jet Plate Thickness:</span>
                <span className="text-white">0.6 mm Stainless Steel</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Micro-Fin Width:</span>
                <span className="text-white">0.25 mm Precision Cut</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Pressure Limit:</span>
                <span className="text-white">2.0 Bar (29 PSI)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-2">
              <span className="text-orange-400 font-bold uppercase text-[11px] block">
                Heat Transfer &amp; Build Materials
              </span>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Cold Plate Purity:</span>
                <span className="text-white">99.99% Pure Copper Base</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Plating:</span>
                <span className="text-white">Nickel-Chrome Protective Alloy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Operating Temp:</span>
                <span className="text-white">-10°C to +85°C</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0A0F] border border-white/5 space-y-2">
              <span className="text-purple-400 font-bold uppercase text-[11px] block">
                Warranty &amp; Standards
              </span>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Manufacturer:</span>
                <span className="text-white">{product.brand} Slovenia/Global</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Domestic Warranty:</span>
                <span className="text-white">{product.warranty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Leak Test Certified:</span>
                <span className="text-emerald-400 font-bold">Factory Leak-Tested &amp; Certified Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
