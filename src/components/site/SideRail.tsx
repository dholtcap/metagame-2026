"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "./sections";

// Flip the rail to the right edge: change this to "right" (and nothing else —
// label side + magnification are edge-agnostic).
const RAIL_SIDE: "left" | "right" = "left";

// Apple-dock magnification: an icon's scale falls off as a gaussian of the
// vertical distance between its center and the pointer. scale = 1 + AMP * e^(-(d/WIDTH)^2).
const MAG_AMP = 0.5; // nearest icon grows by ~50%
const MAG_WIDTH = 52; // px falloff radius — how far the bulge spreads

export default function SideRail() {
  const railRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [hovering, setHovering] = useState(false);
  // Per-icon magnification scales, driven by pointer Y via rAF.
  const [scales, setScales] = useState<number[]>(() => SECTIONS.map(() => 1));
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // Scroll-spy: the section whose center is nearest the viewport center wins.
  useEffect(() => {
    const els = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Shrink the root to a horizontal band across the vertical middle so the
      // "active" section is the one occupying the viewport center.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const applyMagnification = (pointerY: number) => {
    if (reducedMotion.current) return;
    const next = itemRefs.current.map((el) => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const d = pointerY - center;
      return 1 + MAG_AMP * Math.exp(-((d / MAG_WIDTH) ** 2));
    });
    setScales(next);
  };

  // Structured so a future touch layer can call the same handlers: press-and-
  // hold → onPointerEnter/Move (hover mode), release → click item under finger.
  const handlePointerMove = (e: React.PointerEvent) => {
    const y = e.clientY;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => applyMagnification(y));
  };

  const handlePointerEnter = () => setHovering(true);
  const handlePointerLeave = () => {
    setHovering(false);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setScales(SECTIONS.map(() => 1));
  };

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion.current ? "auto" : "smooth",
      block: "start",
    });
  };

  // TODO(mobile): rail is hidden below md. Intended touch analog to desktop
  // hover→click: press-and-HOLD the rail enters "hover" mode (set `hovering`,
  // feed touch.clientY to applyMagnification); RELEASE fires goTo() on the item
  // under the finger. State (hovering/active/scales) is already shared so a
  // touch layer can drive it — wire onTouchStart/Move/End to the handlers above.
  return (
    <nav
      ref={railRef}
      aria-label="Section navigation"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      // pointer-events-none on the fixed wrapper band; re-enabled on the rail
      // itself so only the rail is interactive, not the invisible column.
      className={`pointer-events-none fixed inset-y-0 z-40 hidden flex-col justify-center md:flex ${
        RAIL_SIDE === "left" ? "left-3 lg:left-5" : "right-3 lg:right-5"
      }`}
    >
      {/* Wash behind the rail: one gradient rectangle spanning the full page
          height (the nav is full-height; the icon list below is what's limited to
          75vh), fading in on hover so labels stay legible over page content, and
          tapering off to the side (opaque → ~60% → transparent). */}
      <span
        aria-hidden
        className={`absolute inset-y-0 -z-10 w-[240px] transition-opacity duration-200 ${
          RAIL_SIDE === "left"
            ? "left-0 bg-gradient-to-r"
            : "right-0 bg-gradient-to-l"
        } from-background/95 via-background/60 to-transparent ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      />
      <ul className="pointer-events-auto flex h-[75vh] flex-col items-start justify-between">
        {SECTIONS.map(({ id, label, icon: Icon }, i) => {
          const isActive = active === id;
          const scale = scales[i] ?? 1;
          return (
            <li key={id} className="contents">
              <button
                type="button"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => goTo(id)}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-center gap-2.5 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                  RAIL_SIDE === "right" ? "flex-row-reverse" : ""
                }`}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: RAIL_SIDE === "left" ? "left" : "right",
                  transition: hovering
                    ? "transform 60ms linear"
                    : "transform 200ms ease-out",
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 2}
                  // Resting: muted gray blending into the beige. Active: full ink
                  // and enlarged, legible even when the rail isn't hovered.
                  className={`shrink-0 transition-colors duration-200 ${
                    isActive
                      ? "scale-110 text-ink"
                      : "text-ink/35 group-hover:text-ink"
                  }`}
                />
                {/* Home (the MG2 die) is self-evident as the top item — no label.
                    Labels reveal on rail hover — fade + slide in beside icons;
                    the full-height wash above keeps them legible over content. */}
                {i !== 0 && (
                  <span
                    className={`text-sm font-medium whitespace-nowrap text-ink/60 transition-all duration-200 group-hover:text-ink ${
                      hovering
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none w-0 -translate-x-1 overflow-hidden opacity-0"
                    }`}
                  >
                    {label}
                  </span>
                )}
              </button>
              {/* Faint dot between consecutive icons: icon · icon · icon … */}
              {i < SECTIONS.length - 1 && (
                <span
                  aria-hidden
                  className="my-0.5 ml-2 h-1 w-1 rounded-full bg-ink/15"
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
