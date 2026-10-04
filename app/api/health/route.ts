import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/**
 * 24/7 Supabase Keep-Alive & Health Check Endpoint
 * Executes a lightweight ping against public.branches to keep Postgres awake.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing Supabase configuration in environment",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { count, error } = await supabase
      .from("branches")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          database: "error",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        service: "voltmatrix-commerce-telemetry",
        database: "connected",
        branches_count: count ?? 0,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: "error",
        error: err instanceof Error ? err.message : "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
