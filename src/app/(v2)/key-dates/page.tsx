import type { Metadata } from "next";
import ContentPage from "@/v2/components/ContentPage";
import KeyDates from "@/v2/components/KeyDates";

// Re-render hourly so the "Today" stop advances and passed deadlines drop off
// without a deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Key dates — Metagame 2026",
  description:
    "Every deadline between now and Metagame 2026: tickets, proposals, childcare, financial aid, and volunteering.",
};

export default function KeyDatesPage() {
  return (
    <ContentPage
      eyebrow="When is what?"
      title="Key dates"
      intro={<p>Everything with a deadline between now and the con.</p>}
    >
      <KeyDates />
    </ContentPage>
  );
}
