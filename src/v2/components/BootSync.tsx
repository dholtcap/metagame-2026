"use client";

import { useEffect } from "react";
import { applyCurrency } from "@/v2/lib/currency-store";
import { applyGame, getSnapshot } from "@/v2/puzzle/store";

// Safety net for the before-first-paint boot scripts (root layout). They
// stamp attributes on <html> — the puzzle's image variable and the ticket
// currency — but React removes every attribute from <html> if it has to
// client-render the root (a failed hydration, common in dev with browser
// extensions). Re-applying on mount restores them; on a normal hydrated
// load this is a no-op.
export default function BootSync() {
  useEffect(() => {
    applyGame(getSnapshot().current);
    applyCurrency();
  }, []);
  return null;
}
