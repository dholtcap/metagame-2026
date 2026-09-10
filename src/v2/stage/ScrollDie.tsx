"use client";

import { useEffect, useRef } from "react";
import {
  angleOf,
  centerOf,
  createSquare,
  DEFAULT_MATERIAL,
  impulse,
  place,
  step,
  wake,
} from "./physics";
import { pageRect } from "./solids";
import { useStage } from "./Stage";
import { RESCAN_INTERVAL_MS } from "./useSolids";

// A small die that lives on the page and obeys it: it rests on whatever it
// lands on, tumbles off things that move, and feels the page scroll.
//
// The scroll coupling is the pseudo-force of a non-inertial frame: the page is
// the die's floor, so when scrolling stops abruptly the floor decelerates out
// from under it and the die keeps going. In document coordinates that is an
// acceleration of +d²(scrollY)/dt² on the die: scroll down fast and stop, and
// it hops up (scroll up and stop just presses it into the floor).
const SCROLL_GAIN = 0.35; // fraction of the real pseudo-force applied
const SCROLL_ACCEL_MAX = 30_000; // px/s², caps single-frame wheel jumps
const SCROLL_SMOOTHING = 0.3; // EMA on scroll velocity, spreads jumps over frames

export default function ScrollDie({
  size = 28,
  // Where to spawn: on top of the first element matching this selector, else
  // on the stage floor.
  perchOn = "footer",
}: {
  size?: number;
  perchOn?: string;
}) {
  const { solids, rescan } = useStage();
  const el = useRef<HTMLDivElement>(null);
  const bodyRef = useRef(createSquare(0, 0, size));

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    // Stays hidden (the JSX default) under reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const body = bodyRef.current;

    // Child effects run before the parent's, so the first solids scan hasn't
    // happened yet here — spawn from the first tick that sees one.
    let spawned = false;
    const spawn = () => {
      const { bounds } = solids.current;
      const perch = perchOn ? document.querySelector(perchOn) : null;
      const floor = perch ? pageRect(perch).y : bounds.y + bounds.h;
      place(body, bounds.x + bounds.w / 2, floor - size / 2 - 0.5);
      spawned = true;
    };

    let raf = 0;
    let lastT = performance.now();
    let lastScroll = window.scrollY;
    let smoothV = 0;
    let prevSmoothV = 0;
    let seenVersion = -1;
    let lastPoll = 0;

    const render = () => {
      const { x, y } = centerOf(body);
      node.style.transform = `translate3d(${(x - size / 2).toFixed(2)}px, ${(y - size / 2).toFixed(2)}px, 0) rotate(${angleOf(body).toFixed(4)}rad)`;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (t - lastT) / 1000);
      if (dt <= 0) return;
      lastT = t;

      // Scroll pseudo-force.
      const sy = window.scrollY;
      const v = (sy - lastScroll) / dt;
      lastScroll = sy;
      smoothV += (v - smoothV) * SCROLL_SMOOTHING;
      const accel = (smoothV - prevSmoothV) / dt;
      prevSmoothV = smoothV;
      const ay = Math.max(
        -SCROLL_ACCEL_MAX,
        Math.min(SCROLL_ACCEL_MAX, accel * SCROLL_GAIN),
      );
      // Only an upward push stronger than gravity can lift a resting die.
      if (-ay > DEFAULT_MATERIAL.gravity) wake(body);

      const s = solids.current;
      if (!spawned) {
        if (s.version === 0) return;
        spawn();
        seenVersion = s.version;
        node.hidden = false;
        render();
      }
      // The page changed shape under it: let it fall / get shoved.
      if (s.version !== seenVersion) {
        seenVersion = s.version;
        wake(body);
      }
      if (body.asleep) return;
      // Moving things (hover translates) don't fire observers — poll.
      if (t - lastPoll > RESCAN_INTERVAL_MS) {
        lastPoll = t;
        rescan();
      }

      if (step(body, dt, 0, ay, s.rects, s.bounds)) render();
    };
    raf = requestAnimationFrame(tick);

    // A click flicks it — handy for testing without scrolling.
    const onClick = () => {
      impulse(body, (Math.random() - 0.5) * 600, -900);
    };
    node.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("click", onClick);
    };
  }, [solids, rescan, size, perchOn]);

  return (
    <div
      ref={el}
      aria-hidden
      // Hidden until spawned so it never flashes at the page's top-left.
      hidden
      className="pointer-events-auto absolute top-0 left-0 cursor-pointer will-change-transform"
      style={{ width: size, height: size }}
    >
      {/* MG2 die: ink body, two white pips. */}
      <svg
        viewBox="0 0 28 28"
        className="h-full w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
      >
        <rect x="0.5" y="0.5" width="27" height="27" rx="6" fill="#141417" />
        <circle cx="9" cy="9" r="2.8" fill="#fff" />
        <circle cx="19" cy="19" r="2.8" fill="#fff" />
      </svg>
    </div>
  );
}
