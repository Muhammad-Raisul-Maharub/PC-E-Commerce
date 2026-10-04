import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* LEFT NAVIGATION RAIL */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-[#b61722] flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/40">
              <span className="material-symbols-outlined text-lg">terminal</span>
            </div>
            <div>
              <div className="font-headline font-black text-sm tracking-wide text-white leading-tight">
                VOLT<span className="text-[#EF4444]">MATRIX</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                Admin Operating Hub
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 font-mono text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-base text-red-400">dashboard</span>
              <span>Overview &amp; Telemetry</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-base text-blue-400">inventory_2</span>
              <span>Product Manager</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-base text-emerald-400">local_shipping</span>
              <span>Orders &amp; Courier</span>
            </Link>

            <Link
              href="/track-order"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-base text-purple-400">radar</span>
              <span>Public Tracking Portal</span>
            </Link>
          </nav>
        </div>

        {/* Footer / Storefront link */}
        <div className="pt-6 border-t border-slate-800 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">Admin Session:</span>
            <span className="text-white text-[11px] truncate block font-bold">
              {user?.email || "admin@voltmatrix.bd"}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
              ● Singapore Cluster Live
            </span>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-bold text-[11px]"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span>Return to Live Store</span>
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 min-w-0 bg-slate-950 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Root Admin Console</span>
            <span>/</span>
            <span className="text-white font-bold">Chattogram Importer Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL ACID Active</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-[1536px] mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
