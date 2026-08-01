"use client";

import { Menu } from "lucide-react";

// Mobile section nav trigger: a floating corner button rather than a full bar,
// so nothing is spent on a permanent strip of screen. Sits on the same side the
// overlay rail opens from. No current-section readout — that lived on the bar.
export default function MobileNavCorner({
  onOpenMenu,
}: {
  onOpenMenu: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Open section navigation"
      onClick={onOpenMenu}
      className="fixed top-3 right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-background/85 text-ink shadow-[0_2px_10px_rgba(23,48,89,0.12)] backdrop-blur-sm md:hidden"
    >
      <Menu size={22} strokeWidth={2.2} className="size-[22px]" />
    </button>
  );
}
