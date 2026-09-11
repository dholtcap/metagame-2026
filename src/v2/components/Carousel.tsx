"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Photo strip. Native scroll-snap does the work — swipe on touch, arrows and
// dots on desktop — so it needs no gesture library and stays smooth on phones.
export default function Carousel({
  images,
}: {
  images: { src: StaticImageData; alt: string }[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

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
      const n = images.length;
      const next = ((i % n) + n) % n;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    },
    [images.length],
  );

  return (
    <div className="relative mx-auto w-full max-w-[960px] px-8">
      <div
        ref={track}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-2xl [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {images.map(({ src, alt }, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 960px) 896px, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* arrows — hidden on touch-only screens where swiping is the gesture */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir === "prev" ? "Previous photo" : "Next photo"}
          onClick={() => goTo(index + (dir === "prev" ? -1 : 1))}
          className={`absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-navy/15 bg-cream/90 text-navy shadow-md transition hover:bg-white [@media(hover:hover)]:flex ${
            dir === "prev" ? "left-10" : "right-10"
          }`}
        >
          {dir === "prev" ? <ChevronLeft /> : <ChevronRight />}
        </button>
      ))}

      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
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
