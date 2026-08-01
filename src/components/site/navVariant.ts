"use client";

import { useSyncExternalStore } from "react";

// Mobile treatments under evaluation, chosen with `?nav=`:
//   rail   — compact always-visible icon rail (costs a left gutter)
//   handle — draggable edge handle that fans the rail out
//   bar    — top bar + hamburger sheet; claims no horizontal lane, so body
//            copy stays centered
export type MobileNav = "rail" | "handle" | "bar";

const VARIANTS: MobileNav[] = ["rail", "handle", "bar"];

// The URL never changes under us for this purpose, so there's nothing to
// subscribe to — useSyncExternalStore is here for its server/client snapshot
// split, which keeps the SSR pass on the default without a hydration mismatch.
const subscribe = () => () => {};
const serverSnapshot = (): MobileNav => "rail";
const clientSnapshot = (): MobileNav => {
  const v = new URLSearchParams(window.location.search).get("nav");
  return VARIANTS.includes(v as MobileNav) ? (v as MobileNav) : "rail";
};

export function useMobileNavVariant(): MobileNav {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
