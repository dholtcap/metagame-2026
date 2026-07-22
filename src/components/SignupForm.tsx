"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import InterestFollowup from "./InterestFollowup";
import { FIELD_LIGHT } from "./site/styles";

type Status = "idle" | "submitting" | "success" | "error";

export default function SignupForm({ light = false }: { light?: boolean }) {
  // <Input> is dark by default; the `light` cream-section variant overrides it.
  // min-w-0 lets the fields shrink in the row; the row itself is a container
  // query (see the form) so it stacks in a narrow modal and only goes side-by-
  // side when its own width allows — not based on the viewport.
  const field = cn(light && FIELD_LIGHT, "min-w-0 @lg:w-auto @lg:flex-1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Remembered after success so the interest follow-up can patch the same row.
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmittedEmail(email);
      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p
          className={`text-center text-base ${light ? "text-ink/80" : "text-cream/90"}`}
        >
          Thanks — you&apos;re on the list. We&apos;ll be in touch.
        </p>
        <InterestFollowup email={submittedEmail} light={light} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="@container flex w-full flex-col gap-3"
    >
      <div className="flex flex-col gap-3 @lg:flex-row">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          aria-label="Name"
          autoComplete="name"
          className={field}
        />
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com*"
          aria-label="Email address"
          autoComplete="email"
          className={field}
        />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="h-12 px-7 text-base"
        >
          {status === "submitting" ? "…" : "Notify me"}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-sm text-salmon">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
