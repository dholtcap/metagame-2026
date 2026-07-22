"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import TicketsPanel from "./TicketsPanel";

// Modal wrapper around <TicketsPanel>: portal to <body>, blurred backdrop, and
// click-outside to close. Scroll-lock + Escape live in the panel (gated on the
// onClose it receives here). The /tickets page renders the same panel bare.
export default function TicketsModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tickets"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
    >
      <TicketsPanel onClose={onClose} />
    </div>,
    document.body,
  );
}
