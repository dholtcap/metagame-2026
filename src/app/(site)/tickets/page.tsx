import type { Metadata } from "next";
import TicketsPanel from "@/components/site/TicketsPanel";

export const metadata: Metadata = {
  title: "Tickets — Metagame 2026",
  description: "Tickets for Metagame 2026, Nov 6-8 in Berkeley, California.",
};

// Standalone, linkable version of the tickets modal — same panel, no overlay.
export default function TicketsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 py-16 sm:py-24">
      <TicketsPanel />
    </section>
  );
}
