import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import HoldingPage from "@/components/site/HoldingPage";
import { RFP_FORM_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Speakers — Metagame 2026",
  description:
    "We're working out the Metagame 2026 lineup and accepting session proposals. Propose a talk, workshop, or game — or see last year's speakers.",
};

export default function SpeakersPage() {
  return (
    <HoldingPage title="We are working out our 2026 lineup.">
      <p className="mx-auto mb-6 max-w-[520px] text-base text-ink/70">
        Got a talk, a workshop, a game, or something that defies category?
        We&rsquo;re accepting session proposals for 2026.
      </p>
      <Button asChild size="lg">
        <a href={RFP_FORM_URL} target="_blank" rel="noopener noreferrer">
          Propose a session <span aria-hidden="true">&rarr;</span>
        </a>
      </Button>
      <p className="mt-8">
        <a
          href="https://2025.metagame.games/#speakers"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline underline-offset-2 hover:text-navy/70"
        >
          See last year&apos;s speakers <span aria-hidden="true">&#8599;</span>
        </a>
      </p>
    </HoldingPage>
  );
}
