"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import SignupForm from "@/components/SignupForm";
import { HEADING } from "./styles";

// The mailing-list signup, lifted out of the hero into a reusable modal so the
// "Stay Updated" button (hero) and the speakers page can share one flow.
export default function UpdatesModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock page scroll while open; close on Escape.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
    >
      <div className="relative flex w-full max-w-[540px] flex-col items-center gap-5 rounded-xl border border-cream/15 bg-navy px-9 py-8 text-cream shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/50 transition-colors hover:text-cream"
        >
          <FaTimes size={18} />
        </button>
        <div className="text-center">
          <h2
            id={titleId}
            className={`${HEADING} text-[clamp(22px,3vw,28px)] text-cream`}
          >
            Join the List
          </h2>
          <p className="mt-1.5 text-[15px] text-cream/80">
            Get notified about ticket sales, updates, volunteer opportunities,
            and more
          </p>
        </div>
        <SignupForm />
      </div>
    </div>,
    document.body,
  );
}
