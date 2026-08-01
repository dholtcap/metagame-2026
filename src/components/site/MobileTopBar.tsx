"use client";

import { Menu } from "lucide-react";
import Mg2Die from "./Mg2Die";
import { SECTIONS } from "./sections";
import { useSectionSpy } from "./useSectionSpy";

// Mobile nav variant C: a slim top bar, so the rail claims no horizontal lane
// and body copy stays centered. The bar doubles as the scroll-position readout
// the rail used to give — it names the section you're in. The hamburger summons
// the real rail as an overlay (see SideRail's `overlay` mode).
export default function MobileTopBar({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  const { active, goTo } = useSectionSpy();
  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  // No wrapper element: a sticky header can only travel within its parent's
  // box, so it has to sit directly in the page's tall flex column.
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-background/95 px-4 backdrop-blur-sm md:hidden">
      <button
        type="button"
        onClick={() => goTo(SECTIONS[0].id)}
        aria-label="Back to top"
        className="flex items-center gap-2 text-ink"
      >
        <Mg2Die size={24} strokeWidth={2.2} className="size-6" />
        <span className="text-sm font-medium text-ink/55">
          {activeSection.id === SECTIONS[0].id
            ? "Metagame"
            : activeSection.label}
        </span>
      </button>
      <button
        type="button"
        aria-label="Open section navigation"
        onClick={onOpenMenu}
        className="-mr-2 flex h-11 w-11 items-center justify-center text-ink"
      >
        <Menu size={24} strokeWidth={2.2} className="size-6" />
      </button>
    </header>
  );
}
