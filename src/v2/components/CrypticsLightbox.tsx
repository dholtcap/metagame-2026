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
import { HEADING } from "./styles";
import metaCryptics from "../../../public/images/meta_cryptics.jpg";

const ALT =
  "Whiteboard from the 2025 cryptic crossword contest, covered in handwritten clues whose answer is META";

// Same look as <Input>, multi-line.
const TEXTAREA =
  "min-h-24 w-full resize-y rounded-lg border-[1.5px] border-cream/25 bg-navy2 px-4 py-3 text-base text-cream transition-colors outline-none placeholder:text-cream/40 focus:border-tan disabled:opacity-60";

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
      {/* Photo takes the height it needs (capped to the viewport); the form
          column sits beside it from md and below it on phones. */}
      <DialogContent className="grid max-h-[calc(100vh-2rem)] max-w-[min(1120px,calc(100vw-2rem))] grid-rows-[minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 md:grid-cols-[minmax(0,1fr)_360px] md:grid-rows-1">
        <Image
          src={metaCryptics}
          alt={ALT}
          className="h-full max-h-[52vh] w-full object-contain object-center md:max-h-[calc(100vh-2rem)]"
          sizes="(min-width: 768px) 720px, 100vw"
        />
        <div className="flex flex-col gap-5 overflow-y-auto p-6 md:justify-center md:p-8">
          <div>
            <DialogTitle className={`${HEADING} text-2xl text-cream`}>
              Cryptic Crossword Contest, 2025
            </DialogTitle>
            <DialogDescription className="mt-2 text-[15px] text-cream/70">
              Every clue on the board resolves to META. Think you can do better?
              Write a cryptic clue whose answer is META.
            </DialogDescription>
          </div>
          <ClueForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClueForm() {
  const [clue, setClue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  // Set once the clue is stored; the contact step patches this record.
  const [recordId, setRecordId] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/cryptic-clue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clue }),
      });
      if (!res.ok) throw new Error("Request failed");
      const { id } = (await res.json()) as { id?: string };
      setRecordId(id ?? "");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  // An empty id means Airtable wasn't configured (local dev): the clue was
  // accepted but there's no row to attach a contact to, so stop at thanks.
  if (recordId !== null) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base text-cream/90">
          Thanks, your clue is in.
          {recordId && <> Want credit if we use it?</>}
        </p>
        {recordId && <ContactForm recordId={recordId} />}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="sr-only" htmlFor="cryptic-clue">
        Your cryptic clue
      </label>
      <textarea
        id="cryptic-clue"
        required
        maxLength={300}
        value={clue}
        onChange={(e) => setClue(e.target.value)}
        placeholder="Your clue (4)"
        className={TEXTAREA}
      />
      <Button
        type="submit"
        disabled={status === "submitting" || !clue.trim()}
        className="w-fit"
      >
        {status === "submitting" ? "…" : "Submit your clue"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-salmon">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

function ContactForm({ recordId }: { recordId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status | "done">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/cryptic-clue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId, name, email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-base text-cream/90">Got it. Good luck!</p>;
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        aria-label="Name"
        autoComplete="name"
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        autoComplete="email"
      />
      <Button
        type="submit"
        variant="ghost"
        disabled={status === "submitting" || (!name.trim() && !email.trim())}
        className="w-fit"
      >
        {status === "submitting" ? "…" : "Add my details"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-salmon">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
