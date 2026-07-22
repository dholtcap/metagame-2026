"use client";

import { useState } from "react";
import InterestFollowup from "./InterestFollowup";
import { BTN_PRIMARY } from "./site/styles";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_BASE =
  "h-12 w-full rounded-lg border-[1.5px] px-4 text-base outline-none transition-colors";
// Dark by default (navy modal / navy sections); `light` variant for cream backgrounds.
const FIELD_DARK =
  "border-cream/25 bg-navy2 text-cream placeholder:text-cream/40 focus:border-tan";
const FIELD_LIGHT =
  "border-navy/20 bg-white text-ink placeholder:text-ink/40 focus:border-meeple";

export default function SignupForm({ light = false }: { light?: boolean }) {
  const field = `${FIELD_BASE} ${light ? FIELD_LIGHT : FIELD_DARK}`;
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
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          aria-label="Name"
          autoComplete="name"
          className={`${field} sm:w-auto sm:flex-1`}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com*"
          aria-label="Email address"
          autoComplete="email"
          className={`${field} sm:w-auto sm:flex-1`}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`${BTN_PRIMARY} h-12 px-7 text-base disabled:opacity-60`}
        >
          {status === "submitting" ? "…" : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm text-salmon">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
