"use client";

import { useEffect, useState } from "react";
import MobileHandleRail from "./MobileHandleRail";
import MobileTopBar from "./MobileTopBar";
import { useMobileNavVariant } from "./navVariant";
import SideRail from "./SideRail";

// Owns the nav variants and the content padding that keeps clear of them.
export default function SiteShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const variant = useMobileNavVariant();
  const [menuOpen, setMenuOpen] = useState(false);

  // The overlay rail is a mobile affordance; widening past md hands back to the
  // permanent desktop rail, so close rather than leave both on screen.
  //
  // Deliberately no body scroll-lock: the overlay releases by scrolling to the
  // picked section, and `overflow: hidden` blocks that same scroll — fatal for
  // an instant (prefers-reduced-motion) jump, which finishes before the menu
  // closes and the lock lifts. The overlay's touch-action: none already stops
  // the page moving under the finger.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [menuOpen]);

  return (
    <>
      {variant === "bar" && (
        <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />
      )}
      <SideRail
        showOnMobile={variant === "rail"}
        overlay={variant === "bar" && menuOpen}
        onClose={() => setMenuOpen(false)}
      />
      {variant === "handle" && <MobileHandleRail />}
      {/* The rails are fixed-position, so this padding only keeps content from
          sliding under them — symmetric so it never shifts the page's center. */}
      <main className="flex-1 overflow-x-clip md:px-20 lg:px-24">
        {children}
      </main>
    </>
  );
}
