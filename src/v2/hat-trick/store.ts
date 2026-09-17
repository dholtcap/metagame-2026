"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isHatId, type HatId } from "./hats";

// Which hats the visitor has grabbed, in order. Lives in localStorage so the
// count survives navigating between the home page and the team page.
const KEY = "hat-trick";
const EMPTY: HatId[] = [];

let snapshot: HatId[] | null = null;
const listeners = new Set<() => void>();

function read(): HatId[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isHatId) : [];
  } catch {
    return [];
  }
}

function get() {
  if (snapshot === null) snapshot = read();
  return snapshot;
}

function set(next: HatId[]) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode etc.: the hats still show for this page view
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab grabbing a hat updates this one too.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      snapshot = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useHatTrick() {
  const collected = useSyncExternalStore(subscribe, get, () => EMPTY);
  const collect = useCallback((id: HatId) => {
    const current = get();
    if (!current.includes(id)) set([...current, id]);
  }, []);
  return { collected, collect };
}
