"use client";

import { useEffect, useState } from "react";
import UpdatesModal from "./UpdatesModal";

// Hashes that open the mailing-list modal on load. #mailing-list itself
// scrolls to the on-page section instead, so it stays out of this list.
const MODAL_HASHES = ["#updates"];

// Deep-link target for external links (e.g. https://metagame.games/#updates):
// opens the mailing-list modal when the page loads with a matching hash.
export default function UpdatesHashModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!MODAL_HASHES.includes(window.location.hash)) return;
    // Deferred: lint forbids synchronous setState in effects.
    const t = setTimeout(() => setOpen(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;
  return <UpdatesModal onClose={() => setOpen(false)} />;
}
