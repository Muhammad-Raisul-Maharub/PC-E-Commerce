"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const errorParam = searchParams.get("error");

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [authError, setAuthError] = useState<string | null>(
    errorParam === "unauthorized"
      ? "You do not have administrative privileges to access that section."
      : errorParam === "auth_code_error"
      ? "Authentication session expired or invalid. Please sign in again."
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setFormErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setAuthError("An unexpected error occurred during sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-[#b61722] mb-3">
          <span className="material-symbols-outlined text-2xl">lock</span>
        </div>
        <h1 className="font-headline font-bold text-2xl text-slate-900 tracking-tight">
          Account Login
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your orders, saved component builds &amp; Chattogram showroom pickup passes
        </p>
      </div>

      {authError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <span className="text-[11px] text-slate-400">Min. 6 chars</span>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              key
            </span>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#b61722] hover:bg-[#99131c] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Account</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/auth/register${redirectPath !== "/" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="font-bold text-[#b61722] hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[1536px] mx-auto px-4 md:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto text-center py-12 text-slate-500">
              Loading authentication portal...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
