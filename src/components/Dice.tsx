"use client";

import dynamic from "next/dynamic";
import { useReducer, useState } from "react";
import { Pencil } from "lucide-react";

// True-3D dice (three.js + R3F). Client-only: the WebGL canvas can't render on the
// server, and ssr:false keeps three out of the initial HTML payload. (ssr:false is
// only allowed inside a Client Component — hence "use client" above.)
const Dice3D = dynamic(() => import("./dice3d/Dice3D"), { ssr: false });

// Dev-only curation panel; the conditional dynamic() keeps its chunk (which
// imports the full baked-takes file) out of production bundles entirely.
const DiceDevPanel =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./dice3d/DiceDevPanel"), { ssr: false })
    : null;

// Owns its own stage box so the page drops <Dice /> in regardless of how the dice render.
export default function Dice() {
  // Bumping the key remounts Dice3D, which re-reads ?sim/?record at mount —
  // that's how the dev panel rerolls without a page reload.
  const [diceKey, remount] = useReducer((k: number) => k + 1, 0);
  // Dev-only: the die is the whole hero, so the curation panel + its per-die
  // controls are gated behind an edit toggle rather than sitting on the page
  // every dev load.
  const [editing, setEditing] = useState(false);

  // Full-bleed canvas so the roll-in cubes launch from the true screen edges;
  // the resting dice hold a capped size (Dice3D), so the extra width is just
  // transparent runway. To span the real viewport it must escape the (site)
  // layout's LEFT RAIL (md:pl-20 / lg:pl-24) AND the hero's px-8: we opt out of
  // the hero's flex centering (self-start) and pull the left edge back to the
  // viewport edge with a negative margin = rail + px. w-screen then reaches the
  // right edge. SiteHero drops its overflow-hidden so this isn't clipped, and
  // the layout's overflow-x-clip hides the off-screen runway. META-447.
  return (
    <div className="relative -ml-[2rem] flex w-screen flex-col items-center self-start md:-ml-[7rem] lg:-ml-[8rem]">
      <div className="flex h-[clamp(160px,20vh,220px)] w-full items-center justify-center md:h-[clamp(330px,38vh,440px)]">
        <Dice3D key={diceKey} />
      </div>
      {/* dev-only edit toggle + panel, BELOW the canvas so they never cover the dice */}
      {DiceDevPanel && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            aria-label={editing ? "Close dice editor" : "Edit dice"}
            aria-pressed={editing}
            className={`rounded-md p-1.5 transition ${
              editing
                ? "bg-ink text-cream"
                : "bg-ink/10 text-ink/45 hover:bg-ink/20 hover:text-ink/80"
            }`}
          >
            <Pencil size={15} />
          </button>
          {editing && <DiceDevPanel onRemount={remount} />}
        </div>
      )}
    </div>
  );
}
