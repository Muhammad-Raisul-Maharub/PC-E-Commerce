"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  category: string;
  images: string[];
  specifications: Record<string, string | number | boolean>;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const admin = createAdminClient();
    const { data: dbProducts, error } = await admin
      .from("products")
      .select("*, inventory(stock_quantity)")
      .order("created_at", { ascending: false });

    if (!error && dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => {
        const stock = Array.isArray(p.inventory) && p.inventory.length > 0
          ? p.inventory.reduce((sum: number, inv: { stock_quantity: number }) => sum + (inv.stock_quantity || 0), 0)
          : 15;

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand || "VoltMatrix",
          regular_price: Number(p.regular_price),
          sale_price: p.sale_price ? Number(p.sale_price) : null,
          stock_quantity: stock,
          category: p.category_id || "components",
          images: p.images || [],
          specifications: p.specifications || {},
        };
      });
    }

    // Fallback seed from HARDWARE_PRODUCTS catalog if database is fresh
    return HARDWARE_PRODUCTS.slice(0, 15).map((hp) => ({
      id: hp.id,
      name: hp.name,
      slug: hp.slug,
      brand: hp.brand,
      regular_price: hp.regularPrice,
      sale_price: hp.price < hp.regularPrice ? hp.price : null,
      stock_quantity: 12,
      category: hp.category,
      images: [hp.image],
      specifications: {
        socket: hp.socket || "N/A",
        tdp: hp.tdp,
        ramType: hp.ramType || "N/A",
        formFactor: hp.formFactor || "ATX",
      },
    }));
  } catch (err) {
    console.error("Error fetching admin products:", err);
    return [];
  }
}

export async function updateAdminProduct(
  productId: string,
  updates: Partial<AdminProduct>
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = createAdminClient();
    
    // Check if UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);
    
    const dbPayload: Record<string, unknown> = {};
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.regular_price !== undefined) dbPayload.regular_price = updates.regular_price;
    if (updates.sale_price !== undefined) dbPayload.sale_price = updates.sale_price;
    if (updates.images !== undefined) dbPayload.images = updates.images;
    if (updates.specifications !== undefined) dbPayload.specifications = updates.specifications;

    if (isUUID) {
      const { error } = await admin
        .from("products")
        .update(dbPayload)
        .eq("id", productId);

      if (error) return { success: false, error: error.message };

      // If stock updated, update primary branch inventory
      if (updates.stock_quantity !== undefined) {
        const { data: branch } = await admin
          .from("branches")
          .select("id")
          .limit(1)
          .single();

        if (branch) {
          await admin
            .from("inventory")
            .upsert(
              {
                product_id: productId,
                branch_id: branch.id,
                stock_quantity: Math.max(0, updates.stock_quantity),
              },
              { onConflict: "product_id,branch_id" }
            );
        }
      }
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update product",
    };
  }
}
