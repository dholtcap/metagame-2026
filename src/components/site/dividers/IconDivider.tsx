// Shared renderer for a divider built from game-icons.net glyphs. Each icon is a
// single-path SVG (its black background rect stripped) recoloured to the charcoal
// the piece-set dividers share. Per-set source + attribution lives in each set's
// icons.ts (game-icons.net art is CC BY 3.0 — keep the credit).
import { GLYPH, SHADOW } from "./sizing";

const CHARCOAL = "#4d4d4d";

export type GameIcon = {
  name: string;
  viewBox: string;
  d: string;
  fillRule?: "evenodd" | "nonzero";
};

export default function IconDivider({ icons }: { icons: GameIcon[] }) {
  return (
    <div className="flex items-center justify-center gap-[22px] py-10">
      <span className="h-px max-w-40 flex-1 bg-line" />
      {icons.map((ic) => (
        <svg
          key={ic.name}
          viewBox={ic.viewBox}
          aria-hidden
          className={`${GLYPH} ${SHADOW}`}
        >
          <path d={ic.d} fill={CHARCOAL} fillRule={ic.fillRule} />
        </svg>
      ))}
      <span className="h-px max-w-40 flex-1 bg-line" />
    </div>
  );
}
