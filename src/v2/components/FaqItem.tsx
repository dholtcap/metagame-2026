"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronRight } from "lucide-react";
import { HEADING } from "./styles";

// One line per question with a caret on the left; the parent draws the rules
// between items. Keeps the native <details> (so it still toggles before
// hydration) but takes over the click to animate the body via
// grid-template-rows: opening sets `open` first so the 0fr → 1fr transition
// has a start state; closing animates to 0fr and only drops `open` once the
// transition ends.
export default function FaqItem({
  id,
  defaultOpen = false,
  question,
  children,
}: {
  id?: string;
  defaultOpen?: boolean;
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [expanded, setExpanded] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (open) {
      setExpanded(false);
      if (reduceMotion) setOpen(false);
    } else {
      flushSync(() => setOpen(true));
      panelRef.current?.getBoundingClientRect();
      setExpanded(true);
    }
  };

  return (
    <details id={id} open={open} className="group">
      <summary
        onClick={toggle}
        className={`${HEADING} flex cursor-pointer list-none items-center gap-3 py-4 text-lg text-navy transition-colors hover:text-meeple [&::-webkit-details-marker]:hidden`}
      >
        {/* Keyed on `expanded`, not the open attribute, so the caret turns
            back as soon as the panel starts closing. */}
        <ChevronRight
          aria-hidden
          size={20}
          strokeWidth={2.25}
          className={`flex-none text-meeple transition-transform duration-200 motion-reduce:transition-none ${
            expanded ? "rotate-90" : ""
          }`}
        />
        {question}
      </summary>
      <div
        ref={panelRef}
        onTransitionEnd={(e) => {
          if (e.propertyName === "grid-template-rows" && !expanded)
            setOpen(false);
        }}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="max-w-[660px] pb-5 pl-8 text-[15.5px] text-ink/75">
            {children}
          </div>
        </div>
      </div>
    </details>
  );
}
