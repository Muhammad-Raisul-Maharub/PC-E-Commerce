import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/email/dispatcher";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email address is required." },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("Newsletter API route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
