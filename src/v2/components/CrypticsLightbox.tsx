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
      {/* The dialog shrinks to the photo (as tall as the viewport allows), so
          the form row beneath is exactly as wide as the photo. No close
          button: click outside or press Escape. */}
      <DialogContent
        showCloseButton={false}
        className="flex w-auto max-w-[calc(100vw-2rem)] flex-col gap-4 p-4"
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
          className="h-auto max-h-[calc(100vh-10rem)] w-auto max-w-full"
          sizes="(min-width: 640px) 700px, 100vw"
        />
        <ClueForm />
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
      <div className="flex flex-col gap-3">
        <p className="text-base text-cream/90">
          Thanks!{recordId && <> Add your name if you&apos;d like credit.</>}
        </p>
        {recordId && <ContactForm recordId={recordId} />}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
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
          disabled={status === "submitting" || !clue.trim()}
          className="h-12 px-7 text-base"
        >
          {status === "submitting" ? "…" : "Submit"}
        </Button>
      </div>
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
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          aria-label="Name"
          autoComplete="name"
          className="min-w-0 flex-1"
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          aria-label="Email address"
          autoComplete="email"
          className="min-w-0 flex-1"
        />
        <Button
          type="submit"
          variant="ghost"
          disabled={status === "submitting" || (!name.trim() && !email.trim())}
          className="h-12 px-7 text-base"
        >
          {status === "submitting" ? "…" : "Add"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-sm text-salmon">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
