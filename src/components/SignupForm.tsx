"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-10 text-base text-foreground/80">
        Thanks — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="h-12 flex-1 rounded-full border border-foreground/15 bg-transparent px-5 text-base outline-none placeholder:text-foreground/40 focus:border-foreground/40"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="h-12 rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "…" : "Notify me"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-500 sm:absolute sm:mt-14">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
