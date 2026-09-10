"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Rect } from "./physics";
import { collectSolids } from "./solids";

export type Solids = {
  rects: Rect[];
  bounds: Rect; // the stage root's document rect: floor + walls
  version: number; // bumps on every rescan so consumers can wake bodies
};

// While something is animating position (a hover translate, a scroll-linked
// effect) nothing observable fires, so awake consumers also poll at this rate.
export const RESCAN_INTERVAL_MS = 250;

function fingerprint(rects: Rect[], bounds: Rect): string {
  let s = `${bounds.x},${bounds.y},${bounds.w},${bounds.h}`;
  for (const r of rects) s += `|${r.x | 0},${r.y | 0},${r.w | 0},${r.h | 0}`;
  return s;
}

// Keeps a live snapshot of the page's solid rects. Reads layout only on
// change signals (resize, DOM mutation, element resize), never per frame —
// consumers read `ref.current` inside their own animation loop.
export function useSolids(rootRef: React.RefObject<HTMLElement | null>) {
  const ref = useRef<Solids>({
    rects: [],
    bounds: { x: 0, y: 0, w: 0, h: 0 },
    version: 0,
  });

  // Set by the effect; sprites call it to poll while they're moving.
  const rescanRef = useRef<() => void>(() => {});
  const rescan = useCallback(() => rescanRef.current(), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let lastFp = "";

    // Only newly solid elements get observed: observe() fires an initial
    // notification, so re-observing everything each scan would loop forever.
    const watched = new Set<Element>();
    const scan = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const seen = new Set<Element>();
      const rects = collectSolids(root, (el) => {
        seen.add(el);
        if (!watched.has(el)) {
          watched.add(el);
          ro.observe(el);
        }
      });
      for (const el of watched) {
        if (!seen.has(el)) {
          watched.delete(el);
          ro.unobserve(el);
        }
      }
      const bounds = {
        x: r.left + window.scrollX,
        y: r.top + window.scrollY,
        w: r.width,
        h: r.height,
      };
      // Version only moves when geometry did, so a polled rescan that finds
      // nothing new doesn't keep waking bodies.
      const fp = fingerprint(rects, bounds);
      const prev = ref.current;
      ref.current = {
        rects,
        bounds,
        version: fp === lastFp ? prev.version : prev.version + 1,
      };
      lastFp = fp;
    };
    // Coalesce bursts (a transition fires the ResizeObserver every frame) into
    // one layout read per frame.
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(scan);
    };

    // Root size covers content shifting below an expansion; each solid
    // element covers its own growth (hover swell, FAQ opening).
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    scan();
    const mo = new MutationObserver(schedule);
    mo.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "open", "hidden", "data-solid"],
    });
    window.addEventListener("resize", schedule);
    // Fonts landing reflow text line boxes.
    document.fonts?.ready.then(schedule);
    rescanRef.current = schedule;

    return () => {
      rescanRef.current = () => {};
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef]);

  return { ref, rescan };
}
