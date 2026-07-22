import type { Metadata } from "next";
import TicketsPanel from "@/components/site/TicketsPanel";

export const metadata: Metadata = {
  title: "Tickets — Metagame 2026",
  description: "Tickets for Metagame 2026, Nov 6-8 in Berkeley, California.",
};

// Standalone, linkable version of the tickets modal — same panel in the same
// navy box, no overlay. The box mirrors the modal's DialogContent skin.
export default function TicketsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col items-center px-6 py-16 sm:py-24">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-[22px] rounded-xl border border-cream/15 bg-navy px-9 py-8 text-cream shadow-2xl">
        <TicketsPanel />
      </div>
    </section>
  );
}
