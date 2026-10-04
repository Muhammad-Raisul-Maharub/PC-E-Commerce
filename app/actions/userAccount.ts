"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Bangladeshi phone regex: +8801..., 8801..., or 01... followed by 9 digits (operator 3-9)
const bdPhoneRegex = /^(?:\+?88|0088)?01[3-9]\d{8}$/;

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must not exceed 100 characters."),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || bdPhoneRegex.test(val),
      "Please provide a valid Bangladeshi phone number (e.g. +8801811223344 or 01811223344)."
    )
    .optional()
    .or(z.literal("")),
  district: z.string().min(2, "District is required (e.g. Chattogram or Dhaka)."),
  thana: z.string().min(2, "Thana / Area is required (e.g. GEC Circle or Panchlaish)."),
  streetAddress: z.string().min(3, "Street address must be at least 3 characters."),
});

export type UpdateProfileInput = z.infer<typeof profileSchema>;

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Updates customer profile and default shipping address in public.profiles.
 */
export async function updateCustomerProfile(
  input: UpdateProfileInput | FormData
): Promise<ActionResult> {
  try {
    let raw: Record<string, unknown> = {};

    if (input instanceof FormData) {
      raw = {
        fullName: input.get("fullName"),
        phone: input.get("phone") || "",
        district: input.get("district"),
        thana: input.get("thana"),
        streetAddress: input.get("streetAddress"),
      };
    } else {
      raw = input;
    }

    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed.",
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "Unauthorized session. Please log in to update your profile.",
      };
    }

    const defaultAddress = {
      district: parsed.data.district.trim(),
      thana: parsed.data.thana.trim(),
      address: parsed.data.streetAddress.trim(),
    };

    const updatePayload: {
      full_name: string;
      default_address: {
        district: string;
        thana: string;
        address: string;
      };
      updated_at: string;
      phone?: string;
    } = {
      full_name: parsed.data.fullName.trim(),
      default_address: defaultAddress,
      updated_at: new Date().toISOString(),
    };

    if (parsed.data.phone && parsed.data.phone.trim()) {
      updatePayload.phone = parsed.data.phone.trim();
    }

    const { error: updateErr } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id);

    if (updateErr) {
      console.error("Supabase profile update error:", updateErr);
      return {
        success: false,
        error: updateErr.message || "Failed to update profile.",
      };
    }

    revalidatePath("/account");
    return {
      success: true,
      message: "Customer profile and delivery address saved successfully.",
      data: {
        fullName: parsed.data.fullName.trim(),
        phone: parsed.data.phone?.trim() || null,
        defaultAddress,
      },
    };
  } catch (err: unknown) {
    console.error("updateCustomerProfile exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error.",
    };
  }
}

/**
 * Updates customer account password via Supabase Auth.
 */
export async function changeCustomerPassword(
  newPassword: string
): Promise<ActionResult> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "New password must be at least 6 characters long.",
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "Session expired or invalid. Please sign in again.",
      };
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateErr) {
      return {
        success: false,
        error: updateErr.message,
      };
    }

    return {
      success: true,
      message: "Security credentials updated. Your new password is now active.",
    };
  } catch (err: unknown) {
    console.error("changeCustomerPassword exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal password update error.",
    };
  }
}
