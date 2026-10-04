"use client";

import { useEffect, useState } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface Branch {
  id: string;
  name: string;
  district: string;
  address: string;
  phone?: string | null;
  is_main_hub: boolean;
  is_active: boolean;
  created_at?: string;
}

export const FALLBACK_CHATTOGRAM_BRANCH: Branch = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Chattogram Flagship Showroom",
  district: "Chattogram",
  address: "GEC Circle / Agrabad Commercial Area, Chattogram",
  phone: "+8801800000000",
  is_main_hub: true,
  is_active: true,
};

export interface BranchState {
  branches: Branch[];
  isSingleBranch: boolean;
  activeBranch: Branch;
  indicatorText: string;
  loading: boolean;
  setActiveBranchId: (id: string) => void;
}

/**
 * Direct async fetcher for server components or actions
 */
export async function getBranches(): Promise<{ branches: Branch[]; isSingleBranch: boolean }> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .eq("is_active", true)
      .order("is_main_hub", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        branches: [FALLBACK_CHATTOGRAM_BRANCH],
        isSingleBranch: true,
      };
    }

    const branches: Branch[] = data;
    return {
      branches,
      isSingleBranch: branches.length <= 1,
    };
  } catch {
    return {
      branches: [FALLBACK_CHATTOGRAM_BRANCH],
      isSingleBranch: true,
    };
  }
}

/**
 * Dynamic Store & Inventory React Hook
 * Automatically detects whether 1 store or multiple stores exist in Supabase
 */
export function useBranches(): BranchState {
  const [branches, setBranches] = useState<Branch[]>([FALLBACK_CHATTOGRAM_BRANCH]);
  const [activeBranchId, setActiveBranchId] = useState<string>(FALLBACK_CHATTOGRAM_BRANCH.id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBranches() {
      try {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
          .from("branches")
          .select("*")
          .eq("is_active", true)
          .order("is_main_hub", { ascending: false });

        if (isMounted) {
          if (!error && data && data.length > 0) {
            setBranches(data);
            setActiveBranchId(data[0].id);
          } else {
            setBranches([FALLBACK_CHATTOGRAM_BRANCH]);
            setActiveBranchId(FALLBACK_CHATTOGRAM_BRANCH.id);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setBranches([FALLBACK_CHATTOGRAM_BRANCH]);
          setLoading(false);
        }
      }
    }

    loadBranches();

    return () => {
      isMounted = false;
    };
  }, []);

  const isSingleBranch = branches.length <= 1;
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0] || FALLBACK_CHATTOGRAM_BRANCH;
  
  const indicatorText = isSingleBranch
    ? "Store Pickup: Chattogram Showroom | Courier Delivery across 64 Districts"
    : `Pickup Hub: ${activeBranch.name} | Courier across 64 Districts`;

  return {
    branches,
    isSingleBranch,
    activeBranch,
    indicatorText,
    loading,
    setActiveBranchId,
  };
}
