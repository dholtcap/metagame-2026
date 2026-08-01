"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";
import { SECTIONS } from "./sections";
import { useSectionSpy } from "./useSectionSpy";

// Mobile nav variant B: a left-edge handle showing the current section's icon
// between prev/next chevrons. Tap a chevron to step one section; press and drag
// the handle to fan the whole rail out, scrub with your finger, release to jump.
export default function MobileHandleRail() {
  const { active, goTo } = useSectionSpy();
  const [open, setOpen] = useState(false);
  // Index under the finger while dragging — drives the highlight and the jump.
  const [pending, setPending] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const activeIndex = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === active),
  );
  const ActiveIcon = SECTIONS[activeIndex].icon;

  const step = (delta: number) => {
    const next = activeIndex + delta;
    if (next < 0 || next >= SECTIONS.length) return;
    goTo(SECTIONS[next].id);
  };

  const nearestIndex = (y: number) => {
    let best = activeIndex;
    let bestDistance = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(y - (r.top + r.height / 2));
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    return best;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Capture on the handle so moves keep arriving once the finger slides off it.
    e.currentTarget.setPointerCapture(e.pointerId);
    setOpen(true);
    setPending(activeIndex);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!open) return;
    setPending(nearestIndex(e.clientY));
  };

  const handlePointerUp = () => {
    if (pending != null) goTo(SECTIONS[pending].id);
    setOpen(false);
    setPending(null);
  };

  return (
    <nav aria-label="Section navigation" className="md:hidden">
      {/* Fanned-out rail — mounted always so the drag has rects to measure
          against, but inert and invisible until the handle is pressed. */}
      <div
        aria-hidden={!open}
        className={`pointer-events-none fixed inset-y-0 left-0 z-40 flex flex-col justify-center transition-opacity duration-150 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 -z-10 w-[220px] bg-gradient-to-r from-background/95 via-background/70 to-transparent"
        />
        <ul className="flex h-[80vh] flex-col items-start justify-between pl-2">
          {SECTIONS.map(({ id, label, icon: Icon }, i) => {
            const isPending = pending === i;
            return (
              <li
                key={id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="flex items-center gap-2.5 py-0.5"
                style={{
                  transform: isPending ? "scale(1.35)" : "scale(1)",
                  transformOrigin: "left",
                  transition: "transform 80ms linear",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isPending ? 2.4 : 2}
                  className={`size-[20px] shrink-0 ${
                    isPending ? "text-ink" : "text-ink/35"
                  }`}
                />
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isPending ? "text-ink" : "text-ink/45"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        // touch-none keeps the page from scrolling under the drag.
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        // left-3, not the screen edge: a drag starting inside the OS back-swipe
        // strip (~first 20px) gets hijacked as a back navigation, never reaching us.
        className={`fixed top-1/2 left-3 z-50 flex -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl border border-ink/10 bg-background/90 px-1 py-1.5 shadow-[0_2px_10px_rgba(23,48,89,0.12)] backdrop-blur-sm transition-opacity duration-150 ${
          open ? "opacity-30" : "opacity-100"
        }`}
      >
        <button
          type="button"
          aria-label="Previous section"
          // Chevrons are taps, not drags — keep them out of the handle's gesture.
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(-1)}
          disabled={activeIndex === 0}
          className="flex h-9 w-9 items-center justify-center text-ink/40 disabled:opacity-25"
        >
          <ChevronUp size={16} strokeWidth={2.4} className="size-4" />
        </button>
        <ActiveIcon
          size={22}
          strokeWidth={2.2}
          className="size-[22px] text-ink"
        />
        <button
          type="button"
          aria-label="Next section"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => step(1)}
          disabled={activeIndex === SECTIONS.length - 1}
          className="flex h-9 w-9 items-center justify-center text-ink/40 disabled:opacity-25"
        >
          <ChevronDown size={16} strokeWidth={2.4} className="size-4" />
        </button>
      </div>
    </nav>
  );
}
