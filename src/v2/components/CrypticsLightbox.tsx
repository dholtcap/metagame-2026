"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { TEAM_EMAIL } from "@/v2/lib/links";
import { HEADING } from "./styles";
import metaCryptics from "../../../public/images/meta_cryptics.jpg";

const ALT =
  "Whiteboard from the 2025 cryptic crossword contest, covered in handwritten clues whose answer is META";

// Body text is pre-encoded: the `%0A`s are line breaks in the opened draft.
const MAILTO = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent("A cryptic clue for META")}&body=${encodeURIComponent("My clue:\n\n\n\nHow it works (optional):\n\n")}`;

// The FAQ section's whiteboard photo: a button that opens the photo large,
// with a "send us your clue" prompt underneath.
export default function CrypticsLightbox({
  className,
}: {
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger
        className={`group cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-ring/60 ${className ?? ""}`}
        aria-label="Open the cryptic crossword contest whiteboard larger"
      >
        <Image
          src={metaCryptics}
          alt={ALT}
          className="h-auto w-full border border-navy/10 shadow-[0_8px_24px_rgba(23,48,89,0.08)] transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 380px, 0px"
        />
      </DialogTrigger>
      <DialogContent className="flex max-w-[600px] flex-col gap-5 p-4 sm:p-6">
        <Image
          src={metaCryptics}
          alt={ALT}
          className="mx-auto h-auto max-h-[68vh] w-auto"
          sizes="(min-width: 640px) 552px, 90vw"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <DialogTitle className={`${HEADING} text-xl text-cream`}>
              Cryptic Crossword Contest, 2025
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-[15px] text-cream/70">
              Every clue on the board resolves to META. Think you can do better?
            </DialogDescription>
          </div>
          <Button asChild variant="default" className="shrink-0">
            <a href={MAILTO}>
              Submit your clue <span aria-hidden="true">&rarr;</span>
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
