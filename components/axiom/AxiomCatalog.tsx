"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HARDWARE_PRODUCTS, HardwareProduct } from "@/data/hardwareDatabase";
import { useCartStore } from "@/store/useCartStore";

export default function AxiomCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyEcc, setOnlyEcc] = useState<boolean>(false);
  const [selectedIsv, setSelectedIsv] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { addStandaloneItem } = useCartStore();

  // Filter products
  const filteredProducts = useMemo(() => {
    return HARDWARE_PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "enterprise_only" && !product.isEnterprise) return false;
        if (selectedCategory !== "enterprise_only" && product.category !== selectedCategory) return false;
      }

      // ECC filter
      if (onlyEcc && !product.eccSupport) return false;

      // ISV filter
      if (selectedIsv !== "all") {
        if (!product.isvCertifications || !product.isvCertifications.some((c) => c.toLowerCase().includes(selectedIsv.toLowerCase()))) {
          return false;
        }
      }

      // Branch filter
      if (selectedBranch !== "all") {
        const stock = product.branchStock[selectedBranch as keyof typeof product.branchStock] || 0;
        if (stock <= 0) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesBrand) return false;
      }

      return true;
    });
  }, [selectedCategory, onlyEcc, selectedIsv, selectedBranch, searchQuery]);

  const categories = [
    { id: "all", label: "Full Infrastructure Catalog" },
    { id: "enterprise_only", label: "Workstation Grade Only" },
    { id: "cpu", label: "Processors (Threadripper & Xeon)" },
    { id: "motherboard", label: "Workstation Motherboards (WRX90)" },
    { id: "gpu", label: "Accelerators & Studio GPUs" },
    { id: "ram", label: "Registered ECC DDR5 Memory" },
    { id: "storage", label: "Enterprise NVMe & U.3 SSDs" },
    { id: "chassis", label: "4U Rack & Pedestal Enclosures" },
  ];

  const isvOptions = [
    { id: "all", label: "All ISV Certifications" },
    { id: "pytorch", label: "PyTorch / Deep Learning" },
    { id: "solidworks", label: "Dassault SolidWorks CAD" },
    { id: "davinci", label: "DaVinci Resolve Studio 8K" },
    { id: "autodesk", label: "Autodesk Revit & Maya" },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#18181B] font-sans">
      {/* Header Banner */}
      <div className="bg-white border-b border-[#E4E4E7] py-8">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#004F32]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#004F32]">
                  Axiom Pro // Hardware Infrastructure Directory
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
                Workstation Components &amp; Parametric Matrix
              </h1>
              <p className="text-xs sm:text-sm text-[#71717A] mt-1 max-w-2xl">
                Live workstation hardware inventory with verified self-healing memory (ECC), data transfer speeds, high-speed connection slots, and certified 3D CAD / AI software compatibility.
              </p>
            </div>

            {/* Quick Stats & View Switcher */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded border border-[#E4E4E7] bg-[#FBFBFD] font-mono text-xs">
                <span className="text-[#71717A]">IN-STOCK ITEMS:</span>
                <span className="font-bold text-[#004F32]">{filteredProducts.length}</span>
              </div>

              <div className="flex items-center rounded border border-[#E4E4E7] bg-white p-0.5">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === "table" ? "bg-[#18181B] text-white" : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                  title="Tabular Matrix"
                >
                  <span className="material-symbols-outlined text-base">table_rows</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    viewMode === "grid" ? "bg-[#18181B] text-white" : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                  title="Card Grid"
                >
                  <span className="material-symbols-outlined text-base">grid_view</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Parametric Filter Sidebar (3 Cols) */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Search Box */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wide text-[#18181B] block">
                Hardware &amp; Spec Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#71717A]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Part name, motherboard fit, model..."
                  className="w-full h-9 pl-8 pr-3 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] placeholder:text-[#A1A1AA] focus:bg-white focus:border-[#004F32] focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 space-y-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wide text-[#18181B] block">
                Hardware Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-[#004F32] text-white font-semibold"
                        : "text-[#52525B] hover:bg-slate-50 hover:text-[#18181B]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <span className="text-[10px]">●</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Enterprise Rules: ECC Memory & Reliability */}
            <div className="rounded-xl border border-[#E4E4E7] bg-white p-4 space-y-3">
              <label className="font-mono text-xs font-bold uppercase tracking-wide text-[#18181B] block">
                Reliability &amp; Business Filters
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#18181B]">
                <input
                  type="checkbox"
                  checked={onlyEcc}
                  onChange={(e) => setOnlyEcc(e.target.checked)}
                  className="rounded border-[#E4E4E7] text-[#004F32] focus:ring-[#004F32]"
                />
                <span className="font-medium">Self-Healing Crash-Proof Memory Only (ECC)</span>
              </label>

              {/* ISV Cert filter */}
              <div className="space-y-1.5 pt-2 border-t border-[#E4E4E7]">
                <label className="font-mono text-[11px] text-[#71717A] uppercase block">
                  Professional Software Certification
                </label>
                <select
                  value={selectedIsv}
                  onChange={(e) => setSelectedIsv(e.target.value)}
                  className="w-full h-8 px-2 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#004F32]"
                >
                  {isvOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Physical Branch Stock Filter */}
              <div className="space-y-1.5 pt-2 border-t border-[#E4E4E7]">
                <label className="font-mono text-[11px] text-[#71717A] uppercase block">
                  Branch On-Hand Store Stock
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full h-8 px-2 rounded border border-[#E4E4E7] bg-[#FBFBFD] text-xs font-mono text-[#18181B] focus:outline-none focus:border-[#004F32]"
                >
                  <option value="all">All Regional Depots</option>
                  <option value="motijheel">Motijheel Corporate Center (HQ)</option>
                  <option value="idb">IDB Bhaban Flagship Depot</option>
                  <option value="chittagong">Chittagong GEC Showroom</option>
                </select>
              </div>

              {/* Reset button */}
              {(selectedCategory !== "all" || onlyEcc || selectedIsv !== "all" || selectedBranch !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setOnlyEcc(false);
                    setSelectedIsv("all");
                    setSelectedBranch("all");
                    setSearchQuery("");
                  }}
                  className="w-full mt-2 py-1.5 rounded border border-[#E4E4E7] text-[11px] font-mono text-[#71717A] hover:text-[#18181B] hover:bg-slate-50 transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Right Product Listings (9 Cols) */}
          <main className="lg:col-span-9 space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-[#E4E4E7] bg-white p-12 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#A1A1AA]">search_off</span>
                <h3 className="font-mono text-base font-bold text-[#18181B]">
                  No matching hardware components found
                </h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  Try clearing your ECC filter or selecting &quot;Full Infrastructure Catalog&quot; to view all available components.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setOnlyEcc(false);
                    setSelectedIsv("all");
                    setSelectedBranch("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded bg-[#004F32] text-white font-mono text-xs font-bold uppercase"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "table" ? (
              /* High-Density Editorial Tabular Rows */
              <div className="rounded-xl border border-[#E4E4E7] bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E4E4E7] bg-[#FBFBFD] text-[11px] font-mono uppercase text-[#71717A]">
                        <th className="py-3 px-4 font-semibold">Hardware Item / Part Code</th>
                        <th className="py-3 px-3 font-semibold">Motherboard Fit &amp; Size</th>
                        <th className="py-3 px-3 font-semibold">Crash Protection</th>
                        <th className="py-3 px-3 font-semibold">Transfer Speed</th>
                        <th className="py-3 px-3 font-semibold">Certified Software</th>
                        <th className="py-3 px-3 font-semibold">Store Stock</th>
                        <th className="py-3 px-4 font-semibold text-right">Price (BDT)</th>
                        <th className="py-3 px-3 text-right">Cart</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E4E7] text-xs">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-[#FBFBFD] transition-colors group"
                        >
                          {/* Component / SKU with image */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-contain rounded bg-slate-50 border border-[#E4E4E7] p-1 flex-shrink-0"
                              />
                              <div>
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="font-semibold text-[#18181B] group-hover:text-[#004F32] transition-colors line-clamp-1 max-w-[240px]"
                                >
                                  {product.name}
                                </Link>
                                <div className="font-mono text-[10.5px] text-[#71717A] mt-0.5">
                                  {product.brand} • {product.sku}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Socket / Form */}
                          <td className="py-3 px-3 font-mono text-[11px] text-[#52525B]">
                            {product.socket || product.formFactor || "—"}
                          </td>

                          {/* ECC Status */}
                          <td className="py-3 px-3 font-mono text-[11px]">
                            {product.eccSupport ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#004F32] font-semibold border border-[#ADF1C9]">
                                ✓ Self-Healing (ECC)
                              </span>
                            ) : (
                              <span className="text-[#A1A1AA]">Standard Non-ECC</span>
                            )}
                          </td>

                          {/* Memory Bandwidth */}
                          <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#2563EB]">
                            {product.memoryBandwidthGBs ? `${product.memoryBandwidthGBs} GB/s` : "—"}
                          </td>

                          {/* ISV Badges */}
                          <td className="py-3 px-3">
                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                              {product.isvCertifications ? (
                                product.isvCertifications.slice(0, 2).map((isv) => (
                                  <span
                                    key={isv}
                                    className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-[#52525B]"
                                  >
                                    {isv}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[#A1A1AA] text-[10px]">—</span>
                              )}
                            </div>
                          </td>

                          {/* Regional Branch Stock */}
                          <td className="py-3 px-3 font-mono text-[10.5px]">
                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                                (product.branchStock.motijheel || 0) > 0
                                  ? "bg-[#004F32]"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span>
                              {(product.branchStock.motijheel || 0) > 0
                                ? `${product.branchStock.motijheel} in HQ`
                                : `${product.branchStock.idb || 0} in IDB`}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#18181B] whitespace-nowrap">
                            ৳{product.price.toLocaleString()}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                addStandaloneItem(product, 1);
                                alert(`Added ${product.name} to procurement cart.`);
                              }}
                              className="px-2.5 py-1 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-[11px] font-semibold transition-colors"
                              title="Add to Procurement Order"
                            >
                              + Cart
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-[#E4E4E7] bg-white p-4 space-y-3 hover:border-[#004F32] transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded bg-slate-50 border border-[#E4E4E7] overflow-hidden mb-3 p-2 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.eccSupport && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#004F32] font-mono text-[9px] font-bold border border-[#ADF1C9]">
                            SELF-HEALING (ECC)
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-[10px] text-[#71717A] uppercase">
                        {product.brand} • {product.category}
                      </div>

                      <Link
                        href={`/product/${product.slug}`}
                        className="font-semibold text-sm text-[#18181B] group-hover:text-[#004F32] transition-colors line-clamp-2 mt-1"
                      >
                        {product.name}
                      </Link>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#E4E4E7] text-[11px] font-mono text-[#52525B]">
                        <div>
                          <span className="text-[#71717A] block text-[9px]">MOTHERBOARD FIT</span>
                          <span>{product.socket || product.formFactor || "Standard"}</span>
                        </div>
                        <div>
                          <span className="text-[#71717A] block text-[9px]">TRANSFER SPEED</span>
                          <span className="text-[#2563EB]">
                            {product.memoryBandwidthGBs ? `${product.memoryBandwidthGBs} GB/s` : "Gen 5.0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-[#18181B]">
                        ৳{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          addStandaloneItem(product, 1);
                          alert(`Added ${product.name} to cart.`);
                        }}
                        className="px-3 py-1.5 rounded bg-[#004F32] hover:bg-[#003823] text-white font-mono text-xs font-bold uppercase transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
