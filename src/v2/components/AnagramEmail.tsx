"use client";

import { useRef } from "react";
import { TEAM_EMAIL } from "@/v2/lib/links";
import { cn } from "@/v2/lib/utils";

// team@metagame.games, where "team" and "meta" are anagrams: hovering either
// word sends each letter arcing across the @ to the slot of the same letter
// in the other word, spinning once on the way. The result reads identically,
// so the transforms are dropped at the end and it can run again.
const A = "team";
const B = "meta";
const REST = "game.games";
const DURATION = 3000;
const STEPS = 12;

// For each letter of one word, the index of the same letter in the other.
// Letters repeat nowhere in team/meta, so the mapping is one-to-one.
const toB = [...A].map((ch) => B.indexOf(ch));
const toA = [...B].map((ch) => A.indexOf(ch));

// Ease-in-out, applied by hand so the arc and spin share one curve.
const ease = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

export default function AnagramEmail({ className }: { className?: string }) {
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const running = useRef(false);

  function run() {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = aRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    const b = bRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    if (!a || !b || a.length !== 4 || b.length !== 4) return;
    running.current = true;

    const fly = (from: HTMLElement, to: HTMLElement, i: number) => {
      const dx =
        to.getBoundingClientRect().left - from.getBoundingClientRect().left;
      // Alternate arc height and spin direction so crossing letters don't
      // overlap mid-flight. A full turn lands upright, so nothing jumps when
      // the transforms are dropped.
      const arc = i % 2 ? -16 : 12;
      const spin = i % 2 ? -360 : 360;
      const frames = Array.from({ length: STEPS + 1 }, (_, k) => {
        const p = k / STEPS;
        const e = ease(p);
        const x = dx * e;
        const y = arc * Math.sin(Math.PI * e);
        return {
          transform: `translate(${x}px, ${y}px) rotate(${spin * e}deg)`,
        };
      });
      from.style.willChange = "transform";
      return from.animate(frames, {
        duration: DURATION,
        easing: "linear",
        fill: "forwards",
      });
    };

    const anims = [
      ...[...a].map((el, i) => fly(el, b[toB[i]], i)),
      ...[...b].map((el, i) => fly(el, a[toA[i]], i + 1)),
    ];
    Promise.all(anims.map((an) => an.finished))
      .catch(() => undefined)
      .finally(() => {
        // Every letter now sits exactly where the same glyph started, so
        // dropping the transforms changes nothing visible.
        anims.forEach((an) => an.cancel());
        [...a, ...b].forEach((el) => (el.style.willChange = ""));
        running.current = false;
      });
  }

  const word = (text: string, ref: React.RefObject<HTMLSpanElement | null>) => (
    <span ref={ref} onMouseEnter={run}>
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
