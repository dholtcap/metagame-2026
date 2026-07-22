import type { Metadata } from "next";
import HoldingPage from "@/components/site/HoldingPage";
import { ARCHIVE_BTN } from "@/components/site/styles";

export const metadata: Metadata = {
  title: "Speakers — Metagame 2026",
  description:
    "Metagame 2026 speakers are still being summoned. See last year's speakers or subscribe for updates.",
};

export default function SpeakersPage() {
  return (
    <HoldingPage title="We are still summoning our speakers.">
      <a
        href="https://2025.metagame.games/#speakers"
        target="_blank"
        rel="noopener noreferrer"
        className={ARCHIVE_BTN}
      >
        See last year&apos;s speakers <span aria-hidden="true">&#8599;</span>
      </a>
    </HoldingPage>
  );
}
