// Card-suit symbols extracted from game-icons.net aussiesim/card-2-<suit>
// (CC BY 3.0) — the isolated pip subpath, no number. Drawn large & centred
// as negative space by the card-suits divider. Author: aussiesim. NOTE: the
// pip subpaths use relative coords, so their bbox (cx/cy/w/h) was measured in a
// padded canvas — the geometry extends to negative x.
export type Suit = {
  name: string;
  d: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
};

export const SUITS: Suit[] = [
  // https://game-icons.net/1x1/aussiesim/card-2-spades.html
  {
    name: "spades",
    cx: 26.0,
    cy: 65.0,
    w: 94,
    h: 114,
    d: "m26.654 8.045s46.338 33.84 47.271 63.07c.776 24.287-25.026 32.12-40.777 18.584l13.633 32.653h-40.115l13.613-32.633c-15.535 13.88-40.006 5.347-40.758-18.606-.88-28.01 47.133-63.066 47.133-63.066v-.002z",
  },
  // https://game-icons.net/1x1/aussiesim/card-2-hearts.html
  {
    name: "hearts",
    cx: 31.5,
    cy: 64.5,
    w: 105,
    h: 97,
    d: "m57.216 16.174c13.613-.319 26.504 9.854 27.075 28.043.976 31.09-47.74 52.945-52.313 70.015-4.997-18.649-51.413-37.573-52.45-70.015-.994-31.155 37.404-37.907 52.452-11.846 6.262-10.846 15.923-15.978 25.236-16.195z",
  },
  // https://game-icons.net/1x1/aussiesim/card-2-clubs.html
  {
    name: "clubs",
    cx: 26.0,
    cy: 64.5,
    w: 94,
    h: 113,
    d: "m26.832 8.408h.015c13.587.01 24.442 10.855 24.442 24.444 0 5.71-2.003 10.997-5.266 15.173 1.12-.158 2.232-.312 3.396-.312 13.595 0 24.458 11.16 24.458 24.754 0 13.594-10.863 24.75-24.458 24.75-5.76 0-11.08-2.046-15.294-5.42l12.609 30.191h-40.117l12.42-29.742c-4.12 3.115-9.233 4.97-14.776 4.97-13.594 0-24.752-11.159-24.752-24.753 0-13.595 11.158-24.75 24.752-24.75 1.059 0 2.058.184 3.082.312-3.215-4.16-5.248-9.509-5.248-15.173 0-13.589 11.15-24.434 24.737-24.444z",
  },
  // https://game-icons.net/1x1/aussiesim/card-2-diamonds.html
  {
    name: "diamonds",
    cx: 26.0,
    cy: 61.5,
    w: 94,
    h: 115,
    d: "m26.884 3.717l47.393 58.27-47.393 58.286-47.375-58.287 47.375-58.27z",
  },
];
