import { env } from "@/env";

export type SignupResult = { stored: boolean; reason?: string };

/**
 * Append an email to the Airtable signups table. If Airtable isn't configured
 * yet (no token / base / table), this no-ops with a warning so local dev still
 * works — the splash form succeeds, the email just isn't persisted.
 */
export async function recordSignup(email: string): Promise<SignupResult> {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, AIRTABLE_EMAIL_FIELD } = env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.warn(`[signup] Airtable not configured — not stored: ${email}`);
    return { stored: false, reason: "airtable-not-configured" };
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_ID)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: { [AIRTABLE_EMAIL_FIELD]: email } }],
        typecast: true,
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`Airtable responded ${res.status}: ${await res.text()}`);
  }

  return { stored: true };
}
