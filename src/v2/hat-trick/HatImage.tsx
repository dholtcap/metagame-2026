"use client";

import Image, { type StaticImageData } from "next/image";
import { hatBox, polygon, type Hat } from "./hats";
import { useHatTrick } from "./store";

// A photo with hats hidden in it. Hover a hat and it grows a little; click it
// and it leaves the photo (a see-through hole where it was) for the head of
// the "You?" silhouette. The photo is object-fit: cover, done by hand so the
// hat outlines (percentages of the image) line up whatever the crop.
export default function HatImage({
  src,
  alt,
  hats,
  className = "",
  sizes,
  priority,
}: {
  src: StaticImageData;
  alt: string;
  hats: Hat[];
  // Sizes the frame: aspect / fill classes, plus anything cosmetic.
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { collected, collect } = useHatTrick();
  const taken = hats.filter((h) => collected.includes(h.id));
  const mask = taken.length ? holeMask(taken) : undefined;

  return (
    <div
      className={`[container-type:size] relative overflow-hidden ${className}`}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `max(100cqw, calc(100cqh * ${src.width / src.height}))`,
          aspectRatio: `${src.width} / ${src.height}`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={
            mask
              ? {
                  maskImage: mask,
                  WebkitMaskImage: mask,
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                }
              : undefined
          }
        />
        {hats
          .filter((h) => !collected.includes(h.id))
          .map((h) => {
            const b = hatBox(h);
            return (
              <button
                key={h.id}
                type="button"
                aria-label="A hat"
                onClick={() => collect(h.id)}
                className="absolute inset-0 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 focus:outline-none focus-visible:scale-110"
                style={{
                  clipPath: polygon(h.points),
                  transformOrigin: `${b.x + b.w / 2}% ${b.y + b.h / 2}%`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes={sizes}
                  draggable={false}
                  className="pointer-events-none object-cover"
                />
              </button>
            );
          })}
      </div>
    </div>
  );
}

// CSS mask that hides the taken hats: white everywhere, black (transparent)
// inside each outline.
function holeMask(hats: Hat[]) {
  const holes = hats
    .map(
      (h) =>
        `<polygon points="${h.points.map((p) => p.join(",")).join(" ")}" fill="black"/>`,
    )
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">` +
    `<mask id="m"><rect width="100" height="100" fill="white"/>${holes}</mask>` +
    `<rect width="100" height="100" fill="white" mask="url(#m)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
