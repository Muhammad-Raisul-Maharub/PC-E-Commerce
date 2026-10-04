"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^(\+8801|01)[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number (e.g. 01812345678)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setFormErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
          emailRedirectTo: `${siteUrl}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
        },
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Logged in immediately
        router.push(redirectPath);
        router.refresh();
      } else {
        // Confirmation email sent
        setSuccessMessage(
          "Registration successful! Please check your email to verify your account or proceed to login."
        );
        setLoading(false);
      }
    } catch {
      setAuthError("An unexpected error occurred during account creation. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-[#b61722] mb-3">
          <span className="material-symbols-outlined text-2xl">person_add</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
          Create Customer Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join Bangladesh&apos;s premier high-performance PC &amp; hardware network
        </p>
      </div>

      {authError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
          <span>{authError}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            <span>Account Registered!</span>
          </div>
          <p>{successMessage}</p>
          <Link
            href="/auth/login"
            className="inline-block mt-2 font-bold text-[#b61722] underline"
          >
            Go to Login
          </Link>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                badge
              </span>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Tanvir Chowdhury"
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                  formErrors.fullName
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 focus:border-[#EF4444] bg-white"
                }`}
              />
            </div>
            {formErrors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                mail
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@domain.com"
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                  formErrors.email
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 focus:border-[#EF4444] bg-white"
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number (Bangladesh)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                call
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="018XXXXXXXX"
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                  formErrors.phone
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 focus:border-[#EF4444] bg-white"
                }`}
              />
            </div>
            {formErrors.phone && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                key
              </span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 6 characters"
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                  formErrors.password
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 focus:border-[#EF4444] bg-white"
                }`}
              />
            </div>
            {formErrors.password && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                lock_reset
              </span>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                  formErrors.confirmPassword
                    ? "border-red-500 bg-red-50/30"
                    : "border-slate-300 focus:border-[#EF4444] bg-white"
                }`}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-[11px] text-red-600 mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#b61722] hover:bg-[#99131c] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirectPath !== "/" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-bold text-[#b61722] hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto text-center py-12 text-slate-500">
              Loading registration portal...
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
