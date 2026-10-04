"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AdminProduct, updateAdminProduct } from "@/app/actions/adminProducts";

interface Props {
  initialProducts: AdminProduct[];
}

export default function ProductsManagerClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeSpecsProduct, setActiveSpecsProduct] = useState<AdminProduct | null>(null);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedProductForUpload, setSelectedProductForUpload] = useState<string | null>(null);

  const categories = ["all", "cpu", "gpu", "motherboard", "cooler", "chassis", "ram", "storage", "laptop"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleFieldChange = (id: string, field: keyof AdminProduct, value: string | number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveRow = async (product: AdminProduct) => {
    if (product.sale_price !== null && product.sale_price > product.regular_price) {
      alert(`Validation error: Sale price (৳${product.sale_price}) cannot exceed regular price (৳${product.regular_price}).`);
      return;
    }

    setSavingId(product.id);
    const res = await updateAdminProduct(product.id, {
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      stock_quantity: product.stock_quantity,
      specifications: product.specifications,
      images: product.images,
    });
    setSavingId(null);

    if (!res.success) {
      alert("Failed to update product: " + (res.error || "Unknown database error"));
    }
  };

  // Drag and Drop Image Handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            setUploadedImages((prev) => [...prev, url]);
            if (selectedProductForUpload) {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === selectedProductForUpload
                    ? { ...p, images: [...p.images, url] }
                    : p
                )
              );
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            setUploadedImages((prev) => [...prev, url]);
            if (selectedProductForUpload) {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === selectedProductForUpload
                    ? { ...p, images: [...p.images, url] }
                    : p
                )
              );
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAddSpec = () => {
    if (!activeSpecsProduct || !specKey.trim() || !specValue.trim()) return;

    const updatedSpecs = {
      ...activeSpecsProduct.specifications,
      [specKey.trim()]: specValue.trim(),
    };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === activeSpecsProduct.id ? { ...p, specifications: updatedSpecs } : p
      )
    );

    setActiveSpecsProduct({
      ...activeSpecsProduct,
      specifications: updatedSpecs,
    });

    setSpecKey("");
    setSpecValue("");
  };

  const handleRemoveSpec = (key: string) => {
    if (!activeSpecsProduct) return;
    const updatedSpecs = { ...activeSpecsProduct.specifications };
    delete updatedSpecs[key];

    setProducts((prev) =>
      prev.map((p) =>
        p.id === activeSpecsProduct.id ? { ...p, specifications: updatedSpecs } : p
      )
    );

    setActiveSpecsProduct({
      ...activeSpecsProduct,
      specifications: updatedSpecs,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight">
            Hardware Catalog &amp; Stock Inventory
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Spreadsheet-style inline editing with PostgreSQL ACID stock locks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
            {filteredProducts.length} Items Loaded
          </span>
        </div>
      </div>

      {/* DRAG AND DROP IMAGE UPLOADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">add_photo_alternate</span>
            <h3 className="font-headline font-bold text-sm text-white">
              Drag-and-Drop Hardware Photography Uploader
            </h3>
          </div>
          {selectedProductForUpload && (
            <span className="text-xs font-mono text-emerald-400">
              Attaching to: {products.find((p) => p.id === selectedProductForUpload)?.name}
            </span>
          )}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-red-500 bg-red-950/20 text-white"
              : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500"
          }`}
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
            <span className="material-symbols-outlined text-3xl text-slate-500">cloud_upload</span>
            <div className="text-xs font-mono">
              <strong className="text-white">Drag &amp; drop component photos</strong> or click to browse from desktop
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              PNG, JPG, WEBP • Auto-optimizes for 640px thumbnail resolution
            </div>
          </label>
        </div>

        {/* Thumbnail Tray */}
        {uploadedImages.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-1">
            {uploadedImages.map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-xl border border-slate-700 bg-slate-800 overflow-hidden shrink-0 group"
              >
                <Image
                  src={img}
                  alt="Uploaded"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH & CATEGORY FILTERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by part name, brand, or socket..."
            className="w-full h-10 pl-9 pr-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg uppercase font-bold transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#b61722] text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SPREADSHEET-STYLE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Regular Price (৳)</th>
                <th className="py-3 px-4">Sale Price (৳)</th>
                <th className="py-3 px-4">Branch Stock</th>
                <th className="py-3 px-4">Specs (JSONB)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Item Image & Title */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                      {p.images && p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-500 m-auto">memory</span>
                      )}
                    </div>
                    <div className="max-w-xs truncate">
                      <div className="text-white font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{p.brand} • {p.slug}</div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold uppercase">
                      {p.category}
                    </span>
                  </td>

                  {/* Regular Price Input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={p.regular_price}
                      onChange={(e) => handleFieldChange(p.id, "regular_price", Number(e.target.value))}
                      className="w-24 h-8 px-2 bg-slate-950 border border-slate-700 rounded text-right text-white font-bold focus:border-red-500 focus:outline-none"
                    />
                  </td>

                  {/* Sale Price Input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={p.sale_price ?? ""}
                      placeholder="None"
                      onChange={(e) =>
                        handleFieldChange(
                          p.id,
                          "sale_price",
                          e.target.value ? Number(e.target.value) : (null as unknown as number)
                        )
                      }
                      className="w-24 h-8 px-2 bg-slate-950 border border-slate-700 rounded text-right text-emerald-400 font-bold focus:border-red-500 focus:outline-none placeholder:text-slate-600"
                    />
                  </td>

                  {/* Branch Stock */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={p.stock_quantity}
                      onChange={(e) => handleFieldChange(p.id, "stock_quantity", Number(e.target.value))}
                      className="w-16 h-8 px-2 bg-slate-950 border border-slate-700 rounded text-center text-white font-bold focus:border-red-500 focus:outline-none"
                    />
                  </td>

                  {/* Specifications Modal Trigger */}
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => setActiveSpecsProduct(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">tune</span>
                      <span>{Object.keys(p.specifications || {}).length} Specs</span>
                    </button>
                  </td>

                  {/* Action Save */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      disabled={savingId === p.id}
                      onClick={() => handleSaveRow(p)}
                      className="px-3 py-1.5 bg-[#b61722] hover:bg-[#99131c] text-white rounded font-bold text-[11px] transition-all disabled:opacity-50 inline-flex items-center gap-1 shadow-sm"
                    >
                      {savingId === p.id ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xs">save</span>
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC SPECIFICATIONS JSONB EDITOR MODAL */}
      {activeSpecsProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-headline font-bold text-base text-white">
                  Hardware Specifications Editor
                </h3>
                <p className="text-xs text-slate-400 font-mono truncate max-w-xs">
                  {activeSpecsProduct.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSpecsProduct(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Current Specifications List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 font-mono text-xs">
              {Object.entries(activeSpecsProduct.specifications || {}).map(([key, val]) => (
                <div
                  key={key}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] block">{key}</span>
                    <span className="text-white font-bold">{String(val)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(key)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-slate-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add Specification Form */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block font-bold">
                Add Key-Value Spec:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. socket, vram)"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="h-9 px-3 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder:text-slate-600 font-mono focus:border-red-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. AM5, 16GB)"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="h-9 px-3 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder:text-slate-600 font-mono focus:border-red-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSpec}
                className="w-full h-9 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded transition-colors"
              >
                + Add Specification Parameter
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  handleSaveRow(activeSpecsProduct);
                  setActiveSpecsProduct(null);
                }}
                className="px-4 py-2 bg-[#b61722] hover:bg-[#99131c] text-white font-mono font-bold text-xs rounded-lg shadow-md"
              >
                Commit Specs to Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
