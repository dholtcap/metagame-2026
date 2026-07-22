// SET cards rendered in the weirdchess/dice language: a solid charcoal card with
// the symbols punched out as negative space. Colour is the one SET attribute we
// drop in b/w — shape (diamond/oval/squiggle), count (1–3) and shading
// (solid = cut, open = cut outline, striped = cut stripes) carry it. Decorative;
// no wired-up use yet.
import { CARD as CARD_SIZE, SHADOW } from "../sizing";

const CHARCOAL = "#4d4d4d";

// portrait card, rounded corners, centred in the viewBox
const CARD =
  "M35 10 L65 10 A9 9 0 0 1 74 19 L74 81 A9 9 0 0 1 65 90 L35 90 A9 9 0 0 1 26 81 L26 19 A9 9 0 0 1 35 10 Z";

const HW = 16; // symbol half-width
const HH = 7; // symbol half-height

type Shape = "diamond" | "oval" | "squiggle";
type Shading = "solid" | "striped" | "open";

// A smooth squiggle: a sine centreline offset to a constant thickness with
// semicircle end-caps, so there are no sharp corners at any scale. Sampled as a
// fine polyline (the wave joins are shallow; only the caps need to be true arcs).
function squigglePath(cy: number): string {
  const x0 = 37,
    x1 = 63,
    amp = 5.2,
    ht = 4.6,
    N = 26;
  const f = (p: [number, number]) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const up: [number, number][] = [];
  const lo: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const cx = x0 + (x1 - x0) * s;
    const cyy = cy - amp * Math.sin(2 * Math.PI * s);
    const dy = -amp * 2 * Math.PI * Math.cos(2 * Math.PI * s);
    const len = Math.hypot(x1 - x0, dy);
    const nx = -dy / len,
      ny = (x1 - x0) / len;
    up.push([cx + nx * ht, cyy + ny * ht]);
    lo.push([cx - nx * ht, cyy - ny * ht]);
  }
  return (
    `M${f(up[0])} ` +
    up
      .slice(1)
      .map((p) => `L${f(p)}`)
      .join(" ") +
    ` A${ht} ${ht} 0 0 0 ${f(lo[N])} ` +
    lo
      .slice(0, N)
      .reverse()
      .map((p) => `L${f(p)}`)
      .join(" ") +
    ` A${ht} ${ht} 0 0 0 ${f(up[0])} Z`
  );
}

const SHAPES: Record<Shape, (cy: number) => string> = {
  diamond: (cy) =>
    `M${50 - HW} ${cy} L50 ${cy - HH} L${50 + HW} ${cy} L50 ${cy + HH} Z`,
  oval: (cy) =>
    `M41 ${cy - HH} L59 ${cy - HH} A${HH} ${HH} 0 0 1 59 ${cy + HH} L41 ${cy + HH} A${HH} ${HH} 0 0 1 41 ${cy - HH} Z`,
  squiggle: squigglePath,
};

// vertical centres of the symbols, evenly stacked, for each count
const COUNTS: Record<1 | 2 | 3, number[]> = {
  1: [50],
  2: [38, 62],
  3: [29, 50, 71],
};

type Card = { id: string; shape: Shape; count: 1 | 2 | 3; shading: Shading };

const CARDS: Card[] = [
  { id: "a", shape: "diamond", count: 1, shading: "solid" },
  { id: "b", shape: "oval", count: 2, shading: "striped" },
  { id: "c", shape: "squiggle", count: 3, shading: "open" },
  { id: "d", shape: "diamond", count: 2, shading: "solid" },
];

function CardGlyph({ id, shape, count, shading }: Card) {
  const maskId = `set-${id}`;
  const clips: React.ReactNode[] = [];
  const cut: React.ReactNode[] = [];

  COUNTS[count].forEach((cy, i) => {
    const d = SHAPES[shape](cy);
    if (shading === "solid") {
      cut.push(<path key={i} d={d} fill="#000" />);
    } else if (shading === "open") {
      // round joins on the squiggle only; the diamond keeps its sharp points
      cut.push(
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#000"
          strokeWidth={3.2}
          strokeLinejoin={shape === "squiggle" ? "round" : "miter"}
          strokeLinecap={shape === "squiggle" ? "round" : "butt"}
        />,
      );
    } else {
      // striped: clip a run of thin bars to the symbol so only it shows stripes
      const clipId = `${maskId}-c${i}`;
      const bars: React.ReactNode[] = [];
      for (let y = cy - HH; y <= cy + HH; y += 3.4) {
        bars.push(
          <rect key={y} x={26} y={y} width={48} height={1.8} fill="#000" />,
        );
      }
      clips.push(
        <clipPath key={i} id={clipId}>
          <path d={d} />
        </clipPath>,
      );
      cut.push(
        <g key={i} clipPath={`url(#${clipId})`}>
          {bars}
        </g>,
      );
    }
  });

  return (
    <svg viewBox="22 6 56 88" aria-hidden className={`${CARD_SIZE} ${SHADOW}`}>
      <defs>{clips}</defs>
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="100"
        height="100"
      >
        <path d={CARD} fill="#fff" />
        {cut}
      </mask>
      <path d={CARD} fill={CHARCOAL} mask={`url(#${maskId})`} />
    </svg>
  );
}

export default function SetCardDivider() {
  return (
    <div className="flex items-center justify-center gap-[22px] py-10">
      <span className="h-px max-w-40 flex-1 bg-line" />
      {CARDS.map((c) => (
        <CardGlyph key={c.id} {...c} />
      ))}
      <span className="h-px max-w-40 flex-1 bg-line" />
    </div>
  );
}
