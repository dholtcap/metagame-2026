"use client";

import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Button } from "@/v2/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

// One-click join to the same newsletter list the signup form writes to. The
// email is already verified from the paid Checkout Session, so this is a
// single confirm button rather than an editable field — the click is the
// consent.
export default function ThanksOptIn({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function subscribe() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      // recordSignup upserts on email, so an already-subscribed buyer succeeds
      // here too — no duplicate, no error.
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-base text-ink">
        You&apos;re on the list &mdash; we&apos;ll keep you posted.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        onClick={subscribe}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          "…"
        ) : (
          <>
            Sign up for future Metagame updates
            <FaEnvelope size={14} aria-hidden />
          </>
        )}
      </Button>
      <p className="text-sm text-ink/60">{email}</p>
      {status === "error" && (
        <p className="text-sm text-meeple">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
