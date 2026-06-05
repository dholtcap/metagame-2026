import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: forward to Airtable. No-op for now — see Brian for the base/table details.
  console.log("[signup] captured email:", email);

  return NextResponse.json({ ok: true });
}
