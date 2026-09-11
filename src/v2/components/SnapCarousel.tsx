"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Generic one-slide-at-a-time strip. Native scroll-snap does the work — swipe
// on touch, arrows and dots on desktop — so it needs no gesture library and
// stays smooth on phones. Slides are whatever you pass; each fills the track.
export default function SnapCarousel({
  slides,
  label,
  className = "",
  trackClassName = "",
  arrowsOutside = false,
}: {
  slides: ReactNode[];
  label: string; // what a slide is, for the arrow/dot labels ("photo")
  className?: string;
  trackClassName?: string;
  // Arrows flush with the wrapper's edges instead of over the slide — pair
  // with horizontal padding on `className` to give them a gutter.
  arrowsOutside?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = slides.length;

  // Which slide is (mostly) in view, from the scroll position.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w) setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = ((i % n) + n) % n;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [n],
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={track}
        className={`flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden ${trackClassName}`}
        aria-roledescription="carousel"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* arrows — hidden on touch-only screens where swiping is the gesture */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir === "prev" ? `Previous ${label}` : `Next ${label}`}
          onClick={() => goTo(index + (dir === "prev" ? -1 : 1))}
          className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-navy/15 bg-cream/90 text-navy shadow-md transition hover:bg-white [@media(hover:hover)]:flex ${
            arrowsOutside
              ? dir === "prev"
                ? "left-0"
                : "right-0"
              : dir === "prev"
                ? "left-2"
                : "right-2"
          }`}
        >
          {dir === "prev" ? <ChevronLeft /> : <ChevronRight />}
        </button>
      ))}

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to ${label} ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
              i === index ? "bg-meeple" : "bg-navy/25 hover:bg-navy/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
