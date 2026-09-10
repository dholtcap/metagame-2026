import type { Metadata } from "next";
import SiteHero from "@/v2/components/SiteHero";

export const metadata: Metadata = {
  title: "Metagame — Nov 6-8, 2026",
  description:
    "A convention of games, designs, and puzzles. Nov 6-8, 2026 at Lighthaven, Berkeley, California.",
};

export default function Home() {
  return (
    <>
      {/* Each section's wrapper id must match an entry in src/v2/components/nav/sections.ts. */}
      <div id="home" className="scroll-mt-16 md:scroll-mt-24">
        <SiteHero />
      </div>
      {/* Placeholder scroll room so the corner nav (which reveals on scroll)
          can be seen; remove once real sections fill the page. */}
      <div aria-hidden className="min-h-[150dvh]" />
    </>
  );
}
