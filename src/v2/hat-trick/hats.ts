import type { StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import election from "../../../public/images/carousel/2_election.jpg";
import roundRobin from "../../../public/images/misc_photos/board_game_round_robin_2.jpg";
import brendan from "../../../public/images/team/brendan.jpg";
import jisk from "../../../public/images/team/jisk.jpg";

// Hat Trick: hats hidden in photos around the site. Click one and it leaves
// its photo for the head of the "You?" silhouette in the speaker lineup.
// Three hats earns the coupon code.

export type HatId = "wizard" | "crown" | "pirate" | "sequin";

export type Hat = {
  id: HatId;
  name: string;
  image: StaticImageData;
  // Outline of the hat in its photo, as [x, y] percentages of the image.
  points: [number, number][];
  // How it sits on the silhouette: width as a percentage of the card square,
  // where its bottom edge lands (percent from the top) as the first hat worn,
  // and an optional tilt.
  wear: { width: number; bottom: number; rotate?: number; shiftX?: number };
};

export const HAT_TRICK_TARGET = 3;
export const HAT_TRICK_CODE = "HATTRICK";

export const HATS: Record<HatId, Hat> = {
  wizard: {
    id: "wizard",
    name: "wizard hat",
    image: roundRobin,
    points: [
      [69.1, 14.5],
      [71.6, 14.0],
      [73.5, 16.6],
      [75.7, 20.0],
      [78.4, 22.0],
      [82.4, 23.7],
      [85.1, 24.6],
      [85.7, 26.1],
      [82.4, 26.8],
      [78.7, 27.2],
      [76.2, 26.8],
      [74.0, 27.6],
      [72.1, 28.1],
      [70.2, 29.6],
      [68.4, 31.4],
      [66.8, 33.6],
      [64.4, 36.4],
      [63.7, 36.8],
      [64.3, 33.1],
      [65.2, 28.6],
      [65.9, 23.4],
      [67.3, 18.9],
    ],
    wear: { width: 46, bottom: 44, rotate: -8, shiftX: 2 },
  },
  crown: {
    id: "crown",
    name: "crown",
    image: election,
    points: [
      [59.2, 23.9],
      [60.7, 22.9],
      [62.6, 23.3],
      [64.3, 24.9],
      [66.1, 27.4],
      [67.8, 30.7],
      [67.6, 36.2],
      [65.5, 36.6],
      [63.4, 36.3],
      [61.2, 35.5],
      [59.2, 34.2],
      [58.4, 30.5],
      [58.6, 27.0],
    ],
    wear: { width: 32, bottom: 36, rotate: 4 },
  },
  pirate: {
    id: "pirate",
    name: "pirate hat",
    image: jisk,
    points: [
      [59.4, 17.1],
      [63.4, 15.8],
      [69.1, 15.0],
      [75.3, 15.0],
      [81.8, 16.3],
      [85.9, 19.5],
      [92.4, 23.5],
      [98.4, 26.1],
      [99.1, 28.3],
      [97.8, 30.3],
      [95.3, 31.0],
      [86.5, 30.8],
      [79.0, 30.6],
      [70.3, 30.1],
      [64.1, 29.5],
      [59.7, 28.8],
      [56.6, 27.1],
      [55.3, 24.5],
      [55.6, 21.4],
      [57.1, 18.8],
    ],
    wear: { width: 54, bottom: 38, rotate: -4 },
  },
  sequin: {
    id: "sequin",
    name: "sequin cap",
    image: brendan,
    points: [
      [53.0, 8.5],
      [45.5, 8.9],
      [38.6, 10.4],
      [31.8, 13.2],
      [26.8, 17.9],
      [24.3, 23.5],
      [24.3, 29.1],
      [25.5, 34.8],
      [28.0, 40.9],
      [32.4, 37.1],
      [38.6, 34.5],
      [46.1, 35.5],
      [53.0, 36.2],
      [61.8, 36.6],
      [69.9, 36.2],
      [76.8, 35.2],
      [80.5, 39.9],
      [83.0, 33.8],
      [83.6, 27.3],
      [82.4, 19.8],
      [78.6, 14.1],
      [73.0, 10.8],
      [65.5, 9.1],
    ],
    wear: { width: 48, bottom: 44 },
  },
};

export const isHatId = (v: unknown): v is HatId =>
  typeof v === "string" && v in HATS;

export const polygon = (pts: [number, number][]) =>
  `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;

// Bounding box of a hat's outline, in image percentages.
export function hatBox(hat: Hat) {
  const xs = hat.points.map((p) => p[0]);
  const ys = hat.points.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
}

// Pixel aspect ratio (width / height) of the hat's bounding box.
export function hatAspect(hat: Hat) {
  const b = hatBox(hat);
  return ((b.w / 100) * hat.image.width) / ((b.h / 100) * hat.image.height);
}

// Inline style that paints just the hat, cut from its photo, filling the
// element's box (size the element by width; the aspect ratio is set here).
export function hatCutoutStyle(hat: Hat): CSSProperties {
  const b = hatBox(hat);
  const pos = (v: number, size: number) =>
    size >= 100 ? 0 : (v / (100 - size)) * 100;
  return {
    backgroundImage: `url(${hat.image.src})`,
    backgroundSize: `${(100 / b.w) * 100}% ${(100 / b.h) * 100}%`,
    backgroundPosition: `${pos(b.x, b.w)}% ${pos(b.y, b.h)}%`,
    backgroundRepeat: "no-repeat",
    clipPath: polygon(
      hat.points.map(([x, y]) => [
        ((x - b.x) / b.w) * 100,
        ((y - b.y) / b.h) * 100,
      ]),
    ),
    aspectRatio: `${hatAspect(hat)}`,
  };
}
