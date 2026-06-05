import { NextResponse } from "next/server";
import { recordSignup } from "@/lib/airtable";

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const result = await recordSignup(email.trim());
    return NextResponse.json({ ok: true, stored: result.stored });
  } catch (err) {
    console.error("[signup] failed to store email:", err);
    return NextResponse.json({ error: "Failed to save signup" }, { status: 500 });
  }
}
