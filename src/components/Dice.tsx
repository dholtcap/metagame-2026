"use client";

import dynamic from "next/dynamic";
import { useReducer } from "react";

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
  // Full-bleed: the canvas spans the whole viewport width (breaking out of the
  // page's centered, padded column via left-1/2 + -translate-x-1/2) so the
  // roll-in cubes can launch from the true screen edges. Height is unchanged, so
  // the resting dice keep their size — the extra width is transparent runway,
  // not bigger dice (Dice3D caps the resting size independently). META-447.
  // The dev curation panel renders BELOW the canvas (in flow, not a fixed
  // overlay) so it never covers the dice when its per-die controls expand.
  return (
    <div className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center">
      <div className="flex h-[clamp(120px,17vh,185px)] w-full items-center justify-center md:h-[clamp(250px,36vh,380px)]">
        <Dice3D key={diceKey} />
      </div>
      {DiceDevPanel && <DiceDevPanel onRemount={remount} />}
    </div>
  );
}
