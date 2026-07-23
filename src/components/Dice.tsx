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
  // Dev-only: the die is the whole hero now, so the curation panel is gated
  // behind an edit toggle instead of sitting on the page every dev load.
  const [editing, setEditing] = useState(false);
  return (
    <div className="relative flex h-[clamp(140px,18vh,210px)] w-[96vw] items-center justify-center md:h-[clamp(280px,34vh,400px)] md:w-[min(1450px,90vw)]">
      <Dice3D key={diceKey} />
      {DiceDevPanel && (
        <>
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            aria-label={editing ? "Close dice editor" : "Edit dice"}
            aria-pressed={editing}
            className={`absolute top-2 right-2 z-10 rounded-md p-1.5 transition ${
              editing
                ? "bg-ink text-cream"
                : "bg-ink/10 text-ink/45 hover:bg-ink/20 hover:text-ink/80"
            }`}
          >
            <Pencil size={15} />
          </button>
          {editing && <DiceDevPanel onRemount={remount} />}
        </>
      )}
    </div>
  );
}
