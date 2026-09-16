"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/v2/components/ui/dialog";
import { Button } from "@/v2/components/ui/button";
import { Input } from "@/v2/components/ui/input";
import metaCryptics from "../../../public/images/meta_cryptics.jpg";

const ALT =
  "Whiteboard from the 2025 cryptic crossword contest, covered in handwritten clues whose answer is META";

type Status = "idle" | "submitting" | "error";

// The FAQ section's whiteboard photo: a button that opens the photo large
// beside a form that posts a clue to Airtable (/api/cryptic-clue), then
// optionally attaches a name/email to the same row.
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
      {/* The dialog shrinks to the photo, which is width-driven (880px or the
          viewport) so the handwriting is legible; taller than the screen, the
          dialog scrolls. The form row beneath is exactly as wide as the
          photo. No close button: click outside or press Escape. */}
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100vh-2rem)] w-auto max-w-[calc(100vw-2rem)] flex-col gap-4 overflow-y-auto p-4"
      >
        <DialogTitle className="sr-only">
          Cryptic Crossword Contest, 2025
        </DialogTitle>
        <DialogDescription className="sr-only">
          Every clue on the board resolves to META. Submit your own.
        </DialogDescription>
        <Image
          src={metaCryptics}
          alt={ALT}
          className="h-auto w-[min(880px,calc(100vw-4rem))] max-w-full"
          sizes="(min-width: 640px) 880px, 100vw"
        />
        <ClueForm />
      </DialogContent>
    </Dialog>
  );
}

const ERROR = "Something went wrong. Try again.";

// One status line over one 48px row, in every state, so the dialog never
// changes size: the line is blank until there's something to say, and the
// row swaps from clue + Submit to Name + Email + Add after the clue lands.
function ClueForm() {
  const [clue, setClue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  // null until the clue is stored; "" when Airtable wasn't configured (local
  // dev), in which case there's no row to attach a contact to.
  const [recordId, setRecordId] = useState<string | null>(null);
  const [contactDone, setContactDone] = useState(false);

  async function send(method: "POST" | "PATCH", body: unknown) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/cryptic-clue", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("idle");
      return (await res.json()) as { id?: string };
    } catch {
      setStatus("error");
      return null;
    }
  }

  async function submitClue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await send("POST", { clue });
    if (result) setRecordId(result.id ?? "");
  }

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await send("PATCH", { id: recordId, name, email });
    if (result) setContactDone(true);
  }

  const busy = status === "submitting";
  const message =
    status === "error"
      ? ERROR
      : contactDone
        ? "Got it. Good luck!"
        : recordId === null
          ? ""
          : recordId
            ? "Thanks! Add your name if you'd like credit."
            : "Thanks!";

  return (
    // w-0 + min-w-full: fills the dialog's width without contributing to it,
    // so the photo alone sets the size and swapping rows can't widen it.
    <div className="flex w-0 min-w-full flex-col gap-3">
      <p
        aria-live="polite"
        className={`h-6 text-base ${status === "error" ? "text-salmon" : "text-cream/90"}`}
      >
        {message}
      </p>
      {recordId === null ? (
        <form onSubmit={submitClue} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            required
            maxLength={300}
            value={clue}
            onChange={(e) => setClue(e.target.value)}
            placeholder="Submit your own cryptic clue"
            aria-label="Your cryptic clue"
            className="min-w-0 flex-1"
          />
          <Button
            type="submit"
            disabled={busy || !clue.trim()}
            className="h-12 px-7 text-base"
          >
            {busy ? "…" : "Submit"}
          </Button>
        </form>
      ) : (
        // Stays in the layout (invisible) once done or when there's no row,
        // so the dialog keeps its height.
        <form
          onSubmit={submitContact}
          className={`grid grid-cols-2 gap-3 sm:flex ${
            contactDone || !recordId ? "invisible" : ""
          }`}
        >
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            aria-label="Name"
            autoComplete="name"
            className="min-w-0 sm:flex-1"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email address"
            autoComplete="email"
            className="min-w-0 sm:flex-1"
          />
          <Button
            type="submit"
            variant="ghost"
            disabled={busy || (!name.trim() && !email.trim())}
            className="col-span-2 h-12 px-7 text-base sm:col-auto"
          >
            {busy ? "…" : "Add"}
          </Button>
        </form>
      )}
    </div>
  );
}
