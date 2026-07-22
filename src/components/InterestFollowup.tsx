"use client";

import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import {
  EMAIL_LIST_VALUE,
  INTEREST_OPTIONS,
  type InterestValue,
} from "@/lib/interests";
import { RFP_FORM_URL } from "@/lib/links";
import { BTN_PRIMARY } from "./site/styles";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_BASE =
  "h-12 w-full rounded-lg border-[1.5px] px-4 text-base outline-none transition-colors";
const FIELD_DARK =
  "border-cream/25 bg-navy2 text-cream placeholder:text-cream/40 focus:border-tan";
const FIELD_LIGHT =
  "border-navy/20 bg-white text-ink placeholder:text-ink/40 focus:border-meeple";

// Optional knock-on shown under the signup thank-you: re-posts to /api/signup with
// the email we just captured, so the upsert merges interests/notes onto the same row.
export default function InterestFollowup({
  email,
  light = false,
}: {
  email: string;
  light?: boolean;
}) {
  const field = `${FIELD_BASE} ${light ? FIELD_LIGHT : FIELD_DARK}`;
  const muted = light ? "text-ink/70" : "text-cream/75";
  const label = light ? "text-ink" : "text-cream";
  const [selected, setSelected] = useState<InterestValue[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // "Just the email list" and the specific interests are mutually exclusive.
  function toggle(value: InterestValue) {
    setSelected((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (value === EMAIL_LIST_VALUE) return [EMAIL_LIST_VALUE];
      return [...prev.filter((v) => v !== EMAIL_LIST_VALUE), value];
    });
  }

  const empty = selected.length === 0 && notes.trim() === "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (empty) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests: selected, notes }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className={`text-center text-sm ${muted}`}>
          Additional details submitted ✓
        </p>
        {/* Submitted "Speaking" → push them to the session-proposal (RFP) form. */}
        {selected.includes("speaking") && (
          <a
            href={RFP_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} gap-2 text-center whitespace-normal`}
          >
            Interested in speaking? Fill out the Session Proposal form!
            <FaArrowRight size={16} aria-hidden className="shrink-0" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className={`text-center text-sm ${muted}`}>
        Say more about your interest:
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <fieldset
          className="grid grid-cols-2 gap-2"
          aria-label="Nature of your interest"
        >
          {INTEREST_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2 text-base ${label}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className={`h-4 w-4 ${light ? "accent-meeple" : "accent-tan"}`}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>

        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else you want us to know"
          aria-label="Anything else you want us to know"
          className={field}
        />

        <button
          type="submit"
          disabled={empty || status === "submitting"}
          className={`${BTN_PRIMARY} h-12 self-center px-7 text-base disabled:opacity-60`}
        >
          {status === "submitting" ? "…" : "Send"}
        </button>

        {status === "error" && (
          <p className="text-sm text-salmon">
            Something went wrong. Try again.
          </p>
        )}
      </form>
    </div>
  );
}
