"use client";

import { createContext, useContext, useMemo, useRef } from "react";
import { useSolids, type Solids } from "./useSolids";

// The page as a game board. Wraps the whole layout so the overlay layers span
// the full document (not the viewport), and every sprite shares one document-
// pixel coordinate system with the physics colliders read from the DOM.
//
//   behind  — sprites painted under the content (pop out from behind a panel)
//   sprites — sprites painted over the content (the die bouncing on things)
//
// Both layers ignore the pointer; a sprite that wants clicks opts back in with
// `pointer-events-auto`. Neither is scanned for solids.

type StageContextValue = {
  solids: React.RefObject<Solids>;
  rescan: () => void;
};

const StageContext = createContext<StageContextValue | null>(null);

export function useStage(): StageContextValue {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside <Stage>");
  return ctx;
}

export default function Stage({
  children,
  sprites,
  behind,
  className = "",
}: {
  children: React.ReactNode;
  sprites?: React.ReactNode;
  behind?: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref: solids, rescan } = useSolids(rootRef);
  // Both are stable, so the context value never changes identity.
  const value = useMemo(() => ({ solids, rescan }), [solids, rescan]);

  return (
    <StageContext.Provider value={value}>
      {/* `isolate` so the -z-10 layer sits above this element's background
          but below its in-flow content. */}
      <div ref={rootRef} className={`relative isolate ${className}`}>
        <div
          data-stage-layer="behind"
          data-solid="none"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {behind}
        </div>
        {children}
        <div
          data-stage-layer="front"
          data-solid="none"
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          {sprites}
        </div>
      </div>
    </StageContext.Provider>
  );
}
