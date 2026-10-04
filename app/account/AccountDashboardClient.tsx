"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

interface OrderSummary {
  id: string;
  tracking_code: string;
  status: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  delivery_method: string;
}

interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  default_address?: Record<string, unknown>;
}

interface Props {
  profile: ProfileData | null;
  orders: OrderSummary[];
  userEmail: string;
}

export default function AccountDashboardClient({ profile, orders, userEmail }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "rigs" | "warranty" | "addresses">("orders");
  const { loadSampleCart } = useCartStore();

  const savedRigs = [
    {
      id: "rig-custom-1",
      name: "VoltMatrix AI Modeler Pro (AM5 // Liquid Loop)",
      specSummary: "Ryzen 7 7800X3D • RTX 4070 Super • 32GB DDR5-6000 • 360mm AIO",
      dateSaved: "2026-09-28",
      estimatedPrice: 218500,
    },
    {
      id: "rig-custom-2",
      name: "Silent Workstation Studio 4U",
      specSummary: "Core Ultra 9 285K • RTX 4080 Super • 64GB DDR5 ECC • 2TB Gen5 NVMe",
      dateSaved: "2026-09-15",
      estimatedPrice: 345000,
    },
  ];

  const warrantyItems = [
    {
      component: "AMD Ryzen 7 7800X3D Boxed Processor",
      serial: "SN-AMD-7890214",
      period: "36 Months",
      expiryDate: "2029-10-01",
      status: "Active Official Warranty",
    },
    {
      component: "MSI MAG B650 Tomahawk WiFi",
      serial: "SN-MSI-B650-9941",
      period: "36 Months",
      expiryDate: "2029-10-01",
      status: "Active Official Warranty",
    },
    {
      component: "Corsair RM750e 750W 80+ Gold PSU",
      serial: "SN-CS-RM750E-102",
      period: "84 Months (7 Years)",
      expiryDate: "2033-10-01",
      status: "Active Official Warranty",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* LEFT NAVIGATION SIDEBAR */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-[#99131c] text-white flex items-center justify-center font-bold text-xl shadow-md">
              {(profile?.full_name || userEmail || "U")[0].toUpperCase()}
            </div>
            <div className="truncate">
              <h2 className="font-headline font-bold text-base text-slate-900 truncate">
                {profile?.full_name || "Customer Account"}
              </h2>
              <p className="text-xs text-slate-500 font-mono truncate">{userEmail}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-50 text-[#b61722] border border-red-200">
                  {profile?.role === "admin" ? "Admin" : "Verified Customer"}
                </span>
              </div>
            </div>
          </div>

          {profile?.phone ? (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono flex items-center gap-2 text-emerald-800">
              <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
              <span>{profile.phone}</span>
            </div>
          ) : (
            <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
              Phone: +880 1800-000000 (Default)
            </div>
          )}

          {/* Navigation Tabs */}
          <nav className="space-y-1 pt-2 border-t border-slate-100 font-medium text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "orders"
                  ? "bg-[#b61722] text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>Orders &amp; Consignments</span>
              </div>
              <span className="font-mono text-[10px] opacity-80">{orders.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("rigs")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "rigs"
                  ? "bg-[#b61722] text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">memory</span>
                <span>Saved PC Configurations</span>
              </div>
              <span className="font-mono text-[10px] opacity-80">{savedRigs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab("warranty")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "warranty"
                  ? "bg-[#b61722] text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">security</span>
                <span>Hardware Warranty Vault</span>
              </div>
              <span className="font-mono text-[10px] opacity-80">3 Active</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === "addresses"
                  ? "bg-[#b61722] text-white font-bold shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">pin_drop</span>
                <span>Saved Delivery Addresses</span>
              </div>
            </button>
          </nav>

          <form action="/auth/signout" method="POST" className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out of Account</span>
            </button>
          </form>
        </div>

        {/* Chattogram Showroom Assistance Badge */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-400">
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Chattogram Concierge Desk</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Pick up consignments or schedule laser engraving directly at our GEC Circle / Agrabad flagship hub.
          </p>
          <a
            href="tel:+8801800000000"
            className="inline-block text-[11px] font-mono font-bold text-white underline mt-1"
          >
            Direct Line: +880 1800-000000
          </a>
        </div>
      </div>

      {/* MAIN WORKSPACE CONTENT */}
      <div className="lg:col-span-3 space-y-6">
        {/* TAB 1: ORDERS & CONSIGNMENTS */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-headline font-bold text-xl text-slate-900">
                  Purchases &amp; Active Consignments
                </h3>
                <p className="text-xs text-slate-500">
                  Track and review hardware orders across courier dispatch and showroom pickup
                </p>
              </div>
              <Link
                href="/catalog"
                className="px-3.5 py-1.5 rounded-lg bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <span>Browse Catalog</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{ord.tracking_code}</strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(ord.created_at).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}{" "}
                        • {ord.delivery_method === "store_pickup" ? "Chattogram Showroom Pickup" : "Courier Doorstep"}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Total Billed</span>
                        <span className="font-bold text-slate-900 text-sm">
                          ৳{Number(ord.total_amount).toLocaleString()}
                        </span>
                      </div>

                      <Link
                        href={`/track-order?code=${ord.tracking_code}`}
                        className="px-4 py-2 rounded-lg bg-[#b61722] hover:bg-[#99131c] text-white font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">radar</span>
                        <span>Track Live</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">inventory_2</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">No orders recorded yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you configure a PC rig or purchase components, your tracking codes and invoices will be logged here.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/catalog"
                    className="px-4 py-2 bg-[#b61722] hover:bg-[#99131c] text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Explore Components
                  </Link>
                  <Link
                    href="/pc-builder"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Build Custom PC
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED PC BUILDS */}
        {activeTab === "rigs" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-headline font-bold text-xl text-slate-900">
                  Custom Rigs &amp; Architecture Blueprints
                </h3>
                <p className="text-xs text-slate-500">
                  Manage saved component configurations and re-order with single-click quotation sync
                </p>
              </div>
              <Link
                href="/pc-builder"
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <span>Launch PC Architect</span>
                <span className="material-symbols-outlined text-sm">add</span>
              </Link>
            </div>

            <div className="space-y-4">
              {savedRigs.map((rig) => (
                <div
                  key={rig.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-headline font-bold text-base text-slate-900">
                        {rig.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Saved: {rig.dateSaved} • Compatible Architecture Verified
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block font-mono uppercase">
                        Quotation Estimate
                      </span>
                      <span className="font-mono font-bold text-base text-[#b61722]">
                        ৳{rig.estimatedPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                    {rig.specSummary}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href="/checkout"
                      onClick={() => loadSampleCart()}
                      className="px-3.5 py-1.5 bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                      <span>Order This Rig</span>
                    </Link>
                    <Link
                      href="/pc-builder"
                      className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Modify in 3D Lab</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WARRANTY VAULT */}
        {activeTab === "warranty" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-headline font-bold text-xl text-slate-900">
                  Digital Warranty Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Paperless warranty registration with serial tracking and official distributor coverage
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Genuine Components
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {warrantyItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{item.component}</div>
                    <div className="text-[11px] text-slate-500">
                      Serial: {item.serial} • Coverage: {item.period}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                      <span className="font-bold text-slate-800">{item.expiryDate}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-[#b61722]">verified_user</span>
              <span>
                All warranties are honored nationwide through official vendor import channels and our Chattogram RMA desk.
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-headline font-bold text-xl text-slate-900">
                  Saved Delivery &amp; Showroom Addresses
                </h3>
                <p className="text-xs text-slate-500">
                  Pre-configured delivery destinations for rapid single-click checkout
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50/20 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">Chattogram Showroom Hub (Pickup)</strong>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                    Primary Pickup
                  </span>
                </div>
                <div className="text-slate-600">
                  GEC Circle / Agrabad Commercial Area, Chattogram
                </div>
                <div className="text-slate-500 text-[11px]">
                  Phone: +880 1800-000000 • Open 10:00 AM - 9:00 PM
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold text-sm">Doorstep Express Delivery</strong>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                    Secondary
                  </span>
                </div>
                <div className="text-slate-600">
                  Residential / Office Address across 64 Districts
                </div>
                <div className="text-slate-500 text-[11px]">
                  Carrier: Steadfast / Pathao Surface Cargo
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
