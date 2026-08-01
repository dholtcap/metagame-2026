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
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => setMenuOpen(false);
    mq.addEventListener("change", close);
    document.body.style.overflow = "hidden";
    return () => {
      mq.removeEventListener("change", close);
      document.body.style.overflow = "";
    };
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
