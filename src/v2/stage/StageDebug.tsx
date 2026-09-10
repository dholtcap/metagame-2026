"use client";

import { useEffect, useState } from "react";
import type { Rect } from "./physics";
import { useStage } from "./Stage";
import { RESCAN_INTERVAL_MS } from "./useSolids";

// Outlines every collider the stage currently knows about. Mount it in the
// front layer; it renders nothing unless the URL has ?stage=debug.
export default function StageDebug() {
  const { solids } = useStage();
  const [rects, setRects] = useState<Rect[] | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("stage") !== "debug")
      return;
    let seen = -1;
    const poll = () => {
      const s = solids.current;
      if (s.version !== seen) {
        seen = s.version;
        setRects([...s.rects]);
      }
    };
    poll();
    const id = setInterval(poll, RESCAN_INTERVAL_MS);
    return () => clearInterval(id);
  }, [solids]);

  if (!rects) return null;
  return (
    <>
      {rects.map((r, i) => (
        <div
          key={i}
          className="absolute border border-meeple/80 bg-meeple/10"
          style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
        />
      ))}
    </>
  );
}
