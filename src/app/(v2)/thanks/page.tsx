import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import ContentPage from "@/v2/components/ContentPage";
import ThanksOptIn from "@/v2/components/tickets/ThanksOptIn";
import { Button } from "@/v2/components/ui/button";

export const metadata: Metadata = {
  title: "Thanks — Metagame 2026",
};

// film-grain texture, shared with the home page so /thanks sits on the same surface
// Pull the buyer's email from a completed Checkout Session. Returns null unless
// Stripe is configured, the session exists, and it actually paid — we never
// prefill the opt-in from an unverified or unpaid session (the id is attacker-supplied).
async function paidBuyer(
  sessionId: string | undefined,
): Promise<{ email: string; name?: string } | null> {
  if (!sessionId) return null;
  const stripe = getStripe();
  if (!stripe) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return null;
    const email = session.customer_details?.email;
    if (!email) return null;
    return { email, name: session.customer_details?.name ?? undefined };
  } catch {
    return null;
  }
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const { session_id } = await searchParams;
  const buyer = await paidBuyer(
    Array.isArray(session_id) ? session_id[0] : session_id,
  );

  return (
    <ContentPage
      eyebrow="Ticket confirmed"
      title="You're in."
      intro={
        <p>
          Thanks for grabbing a ticket to Metagame 2026 &mdash; your order is
          confirmed and a receipt is on its way. See you November 6&ndash;8 in
          Berkeley.
        </p>
      }
    >
      <div className="flex max-w-[640px] flex-col items-start gap-8">
        {buyer ? <ThanksOptIn email={buyer.email} name={buyer.name} /> : null}
        <Button asChild variant="navy">
          <Link href="/">Back to the site</Link>
        </Button>
      </div>
    </ContentPage>
  );
}
