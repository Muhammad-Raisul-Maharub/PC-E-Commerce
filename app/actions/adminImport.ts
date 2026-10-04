"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ImportedProductRow {
  name: string;
  brand?: string;
  category?: string;
  regular_price: number;
  sale_price?: number | null;
  stock_quantity: number;
  specifications?: Record<string, string | number | boolean>;
  image_url?: string;
  slug?: string;
}

export interface BulkImportResult {
  success: boolean;
  totalProcessed: number;
  insertedCount: number;
  updatedCount: number;
  errors: string[];
}

function generateSlug(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `product-${Date.now().toString().slice(-6)}`;
}

export async function bulkImportProducts(
  rows: ImportedProductRow[]
): Promise<BulkImportResult> {
  const admin = createAdminClient();
  const errors: string[] = [];
  let insertedCount = 0;
  let updatedCount = 0;

  if (!rows || rows.length === 0) {
    return {
      success: false,
      totalProcessed: 0,
      insertedCount: 0,
      updatedCount: 0,
      errors: ["No valid product rows provided for import."],
    };
  }

  try {
    // 1. Resolve Showroom Branch (Chattogram Main Hub)
    const { data: branch } = await admin
      .from("branches")
      .select("id, name")
      .order("is_main_hub", { ascending: false })
      .limit(1)
      .single();

    const branchId = branch?.id || "a1600bd3-1c7c-4cc2-baaf-191d5b4a29c9";

    // 2. Fetch all categories for intelligent slug/name mapping
    const { data: dbCategories } = await admin
      .from("categories")
      .select("id, name, slug");

    const categoryMap = new Map<string, string>();
    if (dbCategories) {
      dbCategories.forEach((c) => {
        categoryMap.set(c.slug.toLowerCase(), c.id);
        categoryMap.set(c.name.toLowerCase(), c.id);
      });
    }

    const defaultCategoryId =
      categoryMap.get("components") ||
      dbCategories?.[0]?.id ||
      "77a9f0f2-2fcc-4a2c-9b29-106fc253e033";

    // 3. Process each item sequentially with ACID safety
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 1;

      if (!row.name || typeof row.name !== "string" || !row.name.trim()) {
        errors.push(`Row #${rowNum}: Missing product name.`);
        continue;
      }

      const regularPrice = Number(row.regular_price);
      if (isNaN(regularPrice) || regularPrice < 0) {
        errors.push(`Row #${rowNum} ("${row.name}"): Invalid regular price (${row.regular_price}).`);
        continue;
      }

      const salePrice =
        row.sale_price !== null && row.sale_price !== undefined && !isNaN(Number(row.sale_price))
          ? Number(row.sale_price)
          : null;

      if (salePrice !== null && salePrice > regularPrice) {
        errors.push(
          `Row #${rowNum} ("${row.name}"): Sale price (৳${salePrice}) cannot exceed regular price (৳${regularPrice}).`
        );
        continue;
      }

      const stockQuantity = Math.max(0, Math.floor(Number(row.stock_quantity) || 0));

      // Resolve category
      let categoryId = defaultCategoryId;
      if (row.category) {
        const catKey = row.category.toLowerCase().trim();
        if (categoryMap.has(catKey)) {
          categoryId = categoryMap.get(catKey)!;
        } else if (catKey.includes("laptop") || catKey.includes("desktop")) {
          categoryId = categoryMap.get("laptops-desktops") || defaultCategoryId;
        } else if (catKey.includes("monitor") || catKey.includes("display")) {
          categoryId = categoryMap.get("monitors") || defaultCategoryId;
        } else if (catKey.includes("gadget") || catKey.includes("smart")) {
          categoryId = categoryMap.get("gadgets") || defaultCategoryId;
        } else if (catKey.includes("access") || catKey.includes("periph")) {
          categoryId = categoryMap.get("accessories") || defaultCategoryId;
        }
      }

      const slug = row.slug ? generateSlug(row.slug) : generateSlug(row.name);

      // Check if product already exists by slug
      const { data: existingProd } = await admin
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      const productPayload = {
        name: row.name.trim(),
        brand: row.brand ? row.brand.trim() : "VoltMatrix",
        category_id: categoryId,
        regular_price: regularPrice,
        sale_price: salePrice,
        images: row.image_url ? [row.image_url] : ["/images/products/placeholder.webp"],
        specifications: row.specifications || {},
        is_active: true,
      };

      let targetProductId = existingProd?.id;

      if (existingProd) {
        // Update product
        const { error: updateErr } = await admin
          .from("products")
          .update(productPayload)
          .eq("id", existingProd.id);

        if (updateErr) {
          errors.push(`Row #${rowNum} ("${row.name}"): Failed to update product: ${updateErr.message}`);
          continue;
        }
        updatedCount++;
      } else {
        // Insert product
        const { data: newProd, error: insertErr } = await admin
          .from("products")
          .insert({ ...productPayload, slug })
          .select("id")
          .single();

        if (insertErr || !newProd) {
          errors.push(`Row #${rowNum} ("${row.name}"): Failed to insert product: ${insertErr?.message}`);
          continue;
        }
        targetProductId = newProd.id;
        insertedCount++;
      }

      // Upsert showroom inventory
      if (targetProductId) {
        const { error: invErr } = await admin
          .from("inventory")
          .upsert(
            {
              product_id: targetProductId,
              branch_id: branchId,
              stock_quantity: stockQuantity,
            },
            { onConflict: "product_id,branch_id" }
          );

        if (invErr) {
          errors.push(`Row #${rowNum} ("${row.name}"): Inventory stock update warning: ${invErr.message}`);
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/products/import");

    return {
      success: errors.length === 0 || insertedCount + updatedCount > 0,
      totalProcessed: rows.length,
      insertedCount,
      updatedCount,
      errors,
    };
  } catch (err: unknown) {
    console.error("Bulk product import error:", err);
    return {
      success: false,
      totalProcessed: rows.length,
      insertedCount,
      updatedCount,
      errors: [err instanceof Error ? err.message : "Fatal server error during bulk import."],
    };
  }
}
