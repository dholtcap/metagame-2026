"use client";

import { useRef } from "react";
import { TEAM_EMAIL } from "@/v2/lib/links";

// team@metagame.games, where "team" and "meta" are anagrams: hovering either
// word scrambles both, then each letter flies across the @ to the slot of
// the same letter in the other word. The result reads identically, so the
// transforms are dropped at the end and it can run again.
const A = "team";
const B = "meta";
const REST = "game.games";
const DURATION = 6000;

// For each letter of one word, the index of the same letter in the other.
// Letters repeat nowhere in team/meta, so the mapping is one-to-one.
const toB = [...A].map((ch) => B.indexOf(ch));
const toA = [...B].map((ch) => A.indexOf(ch));

const rand = (n: number) => (Math.random() * 2 - 1) * n;

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
      // Alternate arc direction so crossing letters don't overlap mid-flight.
      const arc = i % 2 ? -18 : 14;
      const t = (x: number, y: number, r: number) =>
        `translate(${x}px, ${y}px) rotate(${r}deg)`;
      from.style.willChange = "transform";
      return from.animate(
        [
          { transform: t(0, 0, 0), offset: 0 },
          // Scramble: four jittery keyframes over the first ~40%.
          { transform: t(rand(9), rand(7), rand(35)), offset: 0.1 },
          { transform: t(rand(9), rand(7), rand(35)), offset: 0.2 },
          { transform: t(rand(9), rand(7), rand(35)), offset: 0.3 },
          { transform: t(rand(6), rand(5), rand(25)), offset: 0.4 },
          { transform: t(0, 0, rand(15)), offset: 0.47 },
          // Flight: an arc across the @ to the matching letter's slot.
          { transform: t(dx / 2, arc, rand(10)), offset: 0.7 },
          { transform: t(dx, 0, 0), offset: 0.9, easing: "ease-out" },
          // Settle.
          { transform: t(dx, -2, 0), offset: 0.94 },
          { transform: t(dx, 0, 0), offset: 1 },
        ],
        { duration: DURATION, easing: "ease-in-out", fill: "forwards" },
      );
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
    <span ref={ref} onMouseEnter={run} className="whitespace-nowrap">
      {[...text].map((ch, i) => (
        // inline-block so transforms apply; underline re-applied since it
        // doesn't propagate into inline-blocks.
        <span key={i} data-letter className="inline-block underline">
          {ch}
        </span>
      ))}
    </span>
  );

  return (
    <a
      href={`mailto:${TEAM_EMAIL}`}
      aria-label={TEAM_EMAIL}
      className={className}
    >
      {word(A, aRef)}@{word(B, bRef)}
      {REST}
    </a>
  );
}
