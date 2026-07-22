"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaBitcoin, FaTimes } from "react-icons/fa";
import type { TicketTier } from "@/lib/tickets";
import { BTN_PRIMARY, HEADING } from "./site/styles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Defensive client-side guard: never navigate to a non-OpenNode host even if the
// API response is tampered with. The server already validates, this is belt-and-suspenders.
function isOpenNodeCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return host === "checkout.opennode.com" || host.endsWith(".opennode.com");
  } catch {
    return false;
  }
}

const FIELD =
  "h-12 w-full rounded-lg border-[1.5px] border-cream/25 bg-navy2 px-4 text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-tan";

// Mirrors the server cap so over-long input fails fast in the browser too.
const MAX_FIELD_LEN = 200;

export default function BtcModal({
  ticket,
  onClose,
}: {
  ticket: TicketTier;
  onClose: () => void;
}) {
  const { full } = ticket.prices;
  const titleId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  // Prefilled with the advertised early-bird code; validated live against the server.
  const [discountCode, setDiscountCode] = useState("EARLYBIRD");
  const [codeState, setCodeState] = useState<{
    validating: boolean;
    valid: boolean;
    test: boolean;
    btcPrice: number | null;
    label?: string;
    exhausted?: boolean; // code is real but has hit its redemption cap
  }>({ validating: true, valid: false, test: false, btcPrice: null });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Interruptive modal: lock page scroll while open, close on Escape.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Live-validate the discount code (on mount + on change, debounced) so the
  // displayed price reflects what the server would actually charge. The charge
  // itself is re-derived server-side — this is display-only.
  useEffect(() => {
    const code = discountCode.trim();
    const controller = new AbortController();
    // setState is deferred into the timer (not run synchronously in the effect
    // body) so the new-Next react-hooks linter doesn't flag a cascading render.
    const t = setTimeout(() => {
      if (!code) {
        setCodeState({
          validating: false,
          valid: false,
          test: false,
          btcPrice: null,
        });
        return;
      }
      setCodeState((s) => ({ ...s, validating: true }));
      fetch("/api/checkout/opennode/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id, code }),
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) =>
          setCodeState({
            validating: false,
            valid: Boolean(d.valid),
            test: Boolean(d.test),
            btcPrice: typeof d.btcPrice === "number" ? d.btcPrice : null,
            label: d.label,
            exhausted: Boolean(d.exhausted),
          }),
        )
        .catch((err) => {
          if (err?.name === "AbortError") return;
          setCodeState({
            validating: false,
            valid: false,
            test: false,
            btcPrice: null,
          });
        });
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [discountCode, ticket.id]);

  const codeEmpty = !discountCode.trim();
  const discounted = codeState.valid && codeState.btcPrice != null;
  const discountOff =
    codeState.btcPrice != null
      ? Number((full.btc - codeState.btcPrice).toFixed(8))
      : null;
  const isTestCode = !codeEmpty && !codeState.validating && codeState.test;
  const codeInvalid =
    !codeEmpty && !codeState.validating && !codeState.valid && !codeState.test;

  async function payWithBtc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (isTestCode) return setError("Remove the test promo code to continue.");
    if (!name.trim()) return setError("Please enter your name.");
    if (!EMAIL_RE.test(email)) return setError("Please enter a valid email.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/opennode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          name,
          email,
          // Optional — only send a non-empty handle.
          ...(discord.trim() ? { discord: discord.trim() } : {}),
          // Server re-validates and re-derives the price; an invalid code just
          // falls through to full price.
          ...(discountCode.trim() ? { discountCode: discountCode.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.hostedCheckoutUrl) {
        throw new Error(data.error || "Could not start Bitcoin checkout.");
      }
      if (!isOpenNodeCheckoutUrl(data.hostedCheckoutUrl)) {
        throw new Error("Could not start Bitcoin checkout.");
      }
      // Stash the charge id so the return page can poll status (no DB to look it up).
      try {
        if (data.orderId && data.chargeId) {
          localStorage.setItem(`btc-charge:${data.orderId}`, data.chargeId);
        }
      } catch {
        // localStorage unavailable — page falls back to the ?charge= query.
      }
      window.location.href = data.hostedCheckoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  // Portal to <body>: TicketsModal's backdrop-blur ancestor would otherwise
  // become the containing block for this fixed overlay and clip it; portaling
  // also lets this stack above the tickets modal.
  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
    >
      <div className="relative flex w-full max-w-[460px] flex-col gap-6 rounded-xl border border-cream/15 bg-navy p-6 text-cream shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/50 transition-colors hover:text-cream"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex items-center justify-between gap-2 pr-6">
          <h2
            id={titleId}
            className={`${HEADING} flex items-center gap-2 text-[clamp(24px,6vw,30px)]`}
          >
            <FaBitcoin aria-hidden className="text-tan" /> Pay with BTC
          </h2>
          <span className="flex items-center gap-2 text-lg">
            {discounted ? (
              <>
                <span className="text-cream/45 line-through">
                  &#8383;{full.btc}
                </span>
                <span className="font-semibold text-tan">
                  &#8383;{codeState.btcPrice}
                </span>
              </>
            ) : (
              <span className="font-semibold text-tan">&#8383;{full.btc}</span>
            )}
          </span>
        </div>

        <form onSubmit={payWithBtc} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name*"
            aria-label="Name"
            autoComplete="name"
            maxLength={MAX_FIELD_LEN}
            required
            className={FIELD}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com*"
            aria-label="Email address"
            autoComplete="email"
            maxLength={MAX_FIELD_LEN}
            required
            className={FIELD}
          />
          <input
            type="text"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="Discord handle (optional)"
            aria-label="Discord handle (optional)"
            maxLength={MAX_FIELD_LEN}
            className={FIELD}
          />
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code (optional)"
              aria-label="Discount code"
              autoCapitalize="characters"
              maxLength={MAX_FIELD_LEN}
              className={`${FIELD} ${discounted ? "border-[#22c55e]/60! text-[#4ade80]! focus:border-[#22c55e]!" : ""}`}
            />
            {!codeEmpty && codeState.validating && (
              <p className="text-xs text-cream/70">Checking</p>
            )}
            {discounted && !codeState.validating && (
              <p className="text-xs text-[#4ade80]">
                Valid Code: {codeState.label ?? "Discount applied"}{" "}
                &minus;&#8383;
                {discountOff}
              </p>
            )}
            {codeInvalid && (
              <p className="text-xs text-salmon">
                {codeState.exhausted
                  ? "This code has reached its redemption limit."
                  : "Code not found"}
              </p>
            )}
            {isTestCode && (
              <p className="text-xs text-salmon">
                That&rsquo;s a test code &mdash; it won&rsquo;t apply here.
              </p>
            )}
          </div>
          {error && <p className="text-sm text-salmon">{error}</p>}
          <button
            type="submit"
            disabled={submitting || isTestCode}
            className={`${BTN_PRIMARY} h-12 w-full text-base disabled:opacity-60`}
          >
            {submitting ? "Starting checkout…" : "Pay with BTC"}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
