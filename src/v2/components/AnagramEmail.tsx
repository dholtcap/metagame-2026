"use client";

import { useEffect, useRef } from "react";
import { TEAM_EMAIL } from "@/v2/lib/links";
import { cn } from "@/v2/lib/utils";

// team@metagame.games, where "team" and "meta" are anagrams. Hovering either
// word sends each letter arcing across the @ to the slot of the same letter
// in the other word, spinning once on the way; meanwhile the cursor repels
// nearby letters, so they dance away from it until it leaves and they settle.
// The swapped result reads identically, so once everything is at rest the
// transforms are dropped and the next hover starts a fresh swap.
const A = "team";
const B = "meta";
const REST = "game.games";
const FLIGHT_MS = 3000;
// Repulsion: full push at the cursor, fading to nothing at RADIUS px.
const RADIUS = 56;
const PUSH = 16;
// How quickly a letter closes on its target each frame (0–1).
const FOLLOW = 0.16;

// For each letter of one word, the index of the same letter in the other.
// Letters repeat nowhere in team/meta, so the mapping is one-to-one.
const toB = [...A].map((ch) => B.indexOf(ch));
const toA = [...B].map((ch) => A.indexOf(ch));

const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

type Letter = {
  el: HTMLElement;
  // Where the letter is (translate + rotate), chasing `target` each frame.
  x: number;
  y: number;
  r: number;
  // Flight to the partner slot, set when a swap starts.
  dx: number;
  arc: number;
  spin: number;
};

export default function AnagramEmail({ className }: { className?: string }) {
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const letters = useRef<Letter[]>([]);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  // null: at rest, transforms clear. Otherwise the swap's start time; the
  // flight is over once FLIGHT_MS have passed, but letters keep reacting to
  // the cursor until it leaves.
  const flightStart = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  function tick(now: number) {
    frame.current = null;
    const start = flightStart.current;
    if (start === null) return;
    const p = Math.min(1, (now - start) / FLIGHT_MS);
    const e = ease(p);
    const c = cursor.current;
    let settled = p >= 1 && !c;

    for (const l of letters.current) {
      let tx = l.dx * e;
      let ty = l.arc * Math.sin(Math.PI * e);
      let tr = l.spin * e;
      if (c) {
        const box = l.el.getBoundingClientRect();
        const cx = box.left + box.width / 2 - c.x;
        const cy = box.top + box.height / 2 - c.y;
        const dist = Math.hypot(cx, cy) || 1;
        if (dist < RADIUS) {
          const push = (PUSH * (RADIUS - dist)) / RADIUS;
          tx += (cx / dist) * push;
          ty += (cy / dist) * push;
          tr += (cx / dist) * push * 1.5;
        }
      }
      l.x += (tx - l.x) * FOLLOW;
      l.y += (ty - l.y) * FOLLOW;
      l.r += (tr - l.r) * FOLLOW;
      if (Math.abs(tx - l.x) > 0.1 || Math.abs(ty - l.y) > 0.1) settled = false;
      l.el.style.transform = `translate(${l.x}px, ${l.y}px) rotate(${l.r}deg)`;
    }

    if (settled) {
      // Every letter sits where the same glyph started (and a full turn is
      // upright), so clearing the transforms changes nothing visible.
      for (const l of letters.current) {
        l.el.style.transform = "";
        l.el.style.willChange = "";
      }
      letters.current = [];
      flightStart.current = null;
      return;
    }
    frame.current = requestAnimationFrame(tick);
  }

  function ensureLoop() {
    if (frame.current === null && flightStart.current !== null)
      frame.current = requestAnimationFrame(tick);
  }

  function start() {
    if (flightStart.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = aRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    const b = bRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    if (!a || !b || a.length !== 4 || b.length !== 4) return;

    // Transforms are clear here, so these are the resting slots.
    const make = (el: HTMLElement, to: HTMLElement, i: number): Letter => {
      el.style.willChange = "transform";
      return {
        el,
        x: 0,
        y: 0,
        r: 0,
        dx: to.getBoundingClientRect().left - el.getBoundingClientRect().left,
        // Alternate arc side and spin direction so crossing letters miss.
        arc: i % 2 ? -16 : 12,
        spin: i % 2 ? -360 : 360,
      };
    };
    letters.current = [
      ...[...a].map((el, i) => make(el, b[toB[i]], i)),
      ...[...b].map((el, i) => make(el, a[toA[i]], i + 1)),
    ];
    flightStart.current = performance.now();
    ensureLoop();
  }

  const word = (text: string, ref: React.RefObject<HTMLSpanElement | null>) => (
    <span ref={ref} onMouseEnter={start}>
      {[...text].map((ch, i) => (
        // inline-block so transforms apply.
        <span key={i} data-letter className="inline-block">
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    // The underline is a static rule under the whole address (text-decoration
    // wouldn't reach the inline-block letters, and would fly with them).
    <a
      href={`mailto:${TEAM_EMAIL}`}
      aria-label={TEAM_EMAIL}
      onMouseMove={(e) => {
        cursor.current = { x: e.clientX, y: e.clientY };
        ensureLoop();
      }}
      onMouseLeave={() => {
        cursor.current = null;
        ensureLoop();
      }}
      className={cn(
        className,
        "relative inline-block whitespace-nowrap no-underline after:absolute after:inset-x-0 after:bottom-[3px] after:h-px after:bg-current",
      )}
    >
      {word(A, aRef)}@{word(B, bRef)}
      {REST}
    </a>
  );
}
