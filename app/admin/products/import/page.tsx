"use client";

import React, { useState, useRef, useTransition } from "react";
import * as XLSX from "xlsx";
import Link from "next/link";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Download,
  Database,
  RefreshCw,
  Info,
  Check,
  X,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { bulkImportProducts, ImportedProductRow } from "@/app/actions/adminImport";

interface ParsedPreviewRow extends ImportedProductRow {
  rowId: number;
  isValid: boolean;
  validationError?: string;
}

export default function BulkProductImporterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message?: string;
    inserted?: number;
    updated?: number;
  }>({ status: "idle" });

  const [activeTab, setActiveTab] = useState<"all" | "valid" | "errors">("all");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize column name for flexible spreadsheet parsing
  const normalizeKey = (key: string) =>
    key.toLowerCase().trim().replace(/[\s_-]+/g, "");

  const parseSpreadsheet = async (uploadedFile: File) => {
    setIsParsing(true);
    setFileName(uploadedFile.name);
    setFile(uploadedFile);
    setImportStatus({ status: "idle" });

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: "",
      });

      const parsed: ParsedPreviewRow[] = rawJson.map((row, index) => {
        const rowId = index + 1;
        const normalizedRow: Record<string, unknown> = {};

        Object.keys(row).forEach((col) => {
          normalizedRow[normalizeKey(col)] = row[col];
        });

        // Smart column resolution
        const name = String(
          normalizedRow["name"] ||
          normalizedRow["model"] ||
          normalizedRow["productname"] ||
          normalizedRow["title"] ||
          normalizedRow["item"] ||
          ""
        ).trim();

        const brand = String(
          normalizedRow["brand"] ||
          normalizedRow["manufacturer"] ||
          normalizedRow["make"] ||
          "VoltMatrix"
        ).trim();

        const category = String(
          normalizedRow["category"] ||
          normalizedRow["categoryname"] ||
          normalizedRow["type"] ||
          "components"
        ).trim();

        const rawRegPrice = Number(
          normalizedRow["regularprice"] ||
          normalizedRow["price"] ||
          normalizedRow["mrp"] ||
          normalizedRow["retailprice"] ||
          normalizedRow["bdt"] ||
          0
        );

        const rawSalePrice = normalizedRow["saleprice"] || normalizedRow["discountprice"] || normalizedRow["offerprice"];
        const salePrice = rawSalePrice !== "" && rawSalePrice !== undefined && !isNaN(Number(rawSalePrice))
          ? Number(rawSalePrice)
          : null;

        const stock = Math.max(
          0,
          Math.floor(
            Number(
              normalizedRow["stock"] ||
              normalizedRow["stockquantity"] ||
              normalizedRow["quantity"] ||
              normalizedRow["qty"] ||
              10
            )
          )
        );

        const imageUrl = String(
          normalizedRow["image"] ||
          normalizedRow["imageurl"] ||
          normalizedRow["images"] ||
          normalizedRow["photo"] ||
          ""
        ).trim();

        // Parse specifications if present
        let specifications: Record<string, string | number | boolean> = {};
        const rawSpecs = normalizedRow["specifications"] || normalizedRow["specs"];
        if (typeof rawSpecs === "string" && rawSpecs.trim()) {
          try {
            specifications = JSON.parse(rawSpecs);
          } catch {
            // If comma-separated pairs like "Socket: AM5, TDP: 120W"
            const pairs = rawSpecs.split(",");
            pairs.forEach((p) => {
              const [k, v] = p.split(":");
              if (k && v) {
                specifications[k.trim()] = v.trim();
              }
            });
          }
        }

        // Row Validation Check
        let isValid = true;
        let validationError = "";

        if (!name) {
          isValid = false;
          validationError = "Missing product name";
        } else if (isNaN(rawRegPrice) || rawRegPrice <= 0) {
          isValid = false;
          validationError = "Regular price must be greater than ৳0";
        } else if (salePrice !== null && salePrice > rawRegPrice) {
          isValid = false;
          validationError = `Sale price (৳${salePrice}) exceeds regular price (৳${rawRegPrice})`;
        }

        return {
          rowId,
          name,
          brand,
          category,
          regular_price: rawRegPrice,
          sale_price: salePrice,
          stock_quantity: stock,
          specifications,
          image_url: imageUrl || undefined,
          isValid,
          validationError,
        };
      });

      setPreviewRows(parsed);
    } catch (err: unknown) {
      console.error("Failed to parse spreadsheet:", err);
      alert("Error parsing spreadsheet. Please verify it is a valid .xlsx or .csv file.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      parseSpreadsheet(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      parseSpreadsheet(e.target.files[0]);
    }
  };

  const handleCommitImport = () => {
    const validRows = previewRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert("No valid product rows available to import.");
      return;
    }

    setImportStatus({ status: "loading", message: `Ingesting ${validRows.length} hardware products to Supabase...` });

    startTransition(async () => {
      const payload: ImportedProductRow[] = validRows.map((r) => ({
        name: r.name,
        brand: r.brand,
        category: r.category,
        regular_price: r.regular_price,
        sale_price: r.sale_price,
        stock_quantity: r.stock_quantity,
        specifications: r.specifications,
        image_url: r.image_url,
      }));

      const res = await bulkImportProducts(payload);

      if (res.success) {
        setImportStatus({
          status: "success",
          message: `Successfully processed ${res.totalProcessed} items into Chattogram Showroom Catalog.`,
          inserted: res.insertedCount,
          updated: res.updatedCount,
        });
      } else {
        setImportStatus({
          status: "error",
          message: res.errors.length > 0 ? res.errors[0] : "Failed to import products.",
        });
      }
    });
  };

  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        Name: "AMD Ryzen 7 7800X3D Gaming Processor",
        Brand: "AMD",
        Category: "PC Components",
        "Regular Price": 48500,
        "Sale Price": 45900,
        Stock: 15,
        Specifications: '{"Socket": "AM5", "Cores": "8", "TDP": "120W"}',
      },
      {
        Name: "ASUS ROG Strix GeForce RTX 4070 Ti SUPER 16GB",
        Brand: "ASUS",
        Category: "PC Components",
        "Regular Price": 128000,
        "Sale Price": 124500,
        Stock: 8,
        Specifications: '{"Memory": "16GB GDDR6X", "Bus Width": "256-bit"}',
      },
      {
        Name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz",
        Brand: "G.Skill",
        Category: "PC Components",
        "Regular Price": 16500,
        "Sale Price": 15800,
        Stock: 25,
        Specifications: '{"Speed": "6000MHz", "Latency": "CL30"}',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProductsTemplate");
    XLSX.writeFile(workbook, "voltmatrix_hardware_import_template.xlsx");
  };

  const validCount = previewRows.filter((r) => r.isValid).length;
  const errorCount = previewRows.length - validCount;

  const filteredPreview = previewRows.filter((row) => {
    if (activeTab === "valid") return row.isValid;
    if (activeTab === "errors") return !row.isValid;
    return true;
  });

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-headline tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
            Non-Technical Bulk Catalog Importer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Drag and drop distributor Excel/CSV sheets to parse and batch-upsert products &amp; showroom inventory.
          </p>
        </div>

        <button
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Sample .xlsx</span>
        </button>
      </div>

      {/* DRAG AND DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.005]"
            : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            {isParsing ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {fileName ? (
                <span className="text-emerald-400 font-mono">{fileName}</span>
              ) : (
                "Drop distributor .xlsx or .csv spreadsheet here"
              )}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Auto-detects Name, Brand, Category, Regular Price, Sale Price, Stock, &amp; JSON Specs
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-300">
            Click to browse local files
          </span>
        </div>
      </div>

      {/* METRICS & SUMMARY CARDS (If files loaded) */}
      {previewRows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Total Parsed
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {previewRows.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">From {fileName}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Ready for Ingestion
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {validCount}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono block">Validated records</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400">
              Validation Issues
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {errorCount}
            </div>
            <span className="text-[10px] text-rose-500/80 font-mono block">Excluded from import</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
              Target Showroom
            </span>
            <div className="text-sm font-bold text-white truncate font-mono mt-1">
              Chattogram Main Hub
            </div>
            <span className="text-[10px] text-cyan-500/80 font-mono block">ACID Inventory Locked</span>
          </div>
        </div>
      )}

      {/* STATUS BANNER */}
      {importStatus.status === "loading" && (
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-xs sm:text-sm font-mono font-medium">{importStatus.message}</span>
        </div>
      )}

      {importStatus.status === "success" && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Bulk Ingestion Completed Successfully</span>
          </div>
          <p className="text-xs font-mono text-emerald-300/80">{importStatus.message}</p>
          <div className="flex items-center gap-4 text-xs font-mono pt-1">
            <span>● Inserted: {importStatus.inserted}</span>
            <span>● Updated: {importStatus.updated}</span>
            <Link
              href="/admin/products"
              className="text-white underline hover:text-emerald-300 font-bold ml-auto"
            >
              View in Product Catalog →
            </Link>
          </div>
        </div>
      )}

      {importStatus.status === "error" && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-mono font-medium">{importStatus.message}</span>
        </div>
      )}

      {/* PREVIEW TABLE */}
      {previewRows.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  activeTab === "all"
                    ? "bg-white text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                All Rows ({previewRows.length})
              </button>
              <button
                onClick={() => setActiveTab("valid")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  activeTab === "valid"
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                Ready ({validCount})
              </button>
              {errorCount > 0 && (
                <button
                  onClick={() => setActiveTab("errors")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                    activeTab === "errors"
                      ? "bg-rose-500 text-white font-bold"
                      : "bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  Issues ({errorCount})
                </button>
              )}
            </div>

            <button
              disabled={validCount === 0 || isPending || importStatus.status === "loading"}
              onClick={handleCommitImport}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-mono font-bold shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing {validCount} Products...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Import {validCount} Products to Supabase</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Regular Price</th>
                  <th className="py-3 px-4">Sale Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Specifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPreview.map((row) => (
                  <tr
                    key={row.rowId}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      !row.isValid ? "bg-rose-950/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-500">{row.rowId}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25"
                          title={row.validationError}
                        >
                          <X className="w-3 h-3" /> {row.validationError}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white max-w-[240px] truncate">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{row.brand}</td>
                    <td className="py-3 px-4 text-slate-400">{row.category}</td>
                    <td className="py-3 px-4 text-white font-bold">
                      ৳{row.regular_price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {row.sale_price ? (
                        <span className="text-emerald-400 font-bold">
                          ৳{row.sale_price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                        {row.stock_quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-400 text-[11px]">
                      {Object.keys(row.specifications || {}).length > 0
                        ? JSON.stringify(row.specifications)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
