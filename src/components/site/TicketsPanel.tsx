"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FaTimes } from "react-icons/fa";
import BtcModal from "@/components/BtcModal";
import SupporterModal from "@/components/SupporterModal";
import { getTicket, supporterTier, ticketUrl } from "@/lib/tickets";
import {
  subscribeCurrency,
  getCurrencySnapshot,
  getCurrencyServerSnapshot,
  setCurrency,
} from "@/lib/currency-store";
import { HEADING } from "./styles";

// Square ticket tiles: mono uppercase label over a big grotesk price. A raised
// salmon hard-shadow lifts them off the navy panel so they read clearly as
// buttons; the tile grows the shadow and slides up-left on hover.
const TILE = "group relative block min-w-[210px] text-left max-[460px]:w-full";
// h-full + justify-center: the row stretches tiles to equal height, and the
// face must fill its tile exactly so the shadow sits flush behind it.
const TILE_FACE =
  "relative flex h-full flex-col items-center justify-center gap-1 border-2 border-cream/30 bg-navy px-7 py-4 shadow-[0_0_0_0_#fa8072] transition-[transform,box-shadow] group-hover:-translate-x-[5px] group-hover:-translate-y-[5px] group-hover:border-cream/60 group-hover:shadow-[8px_8px_0_0_#fa8072]";
const TILE_LABEL =
  "font-space-mono text-[13px] tracking-[0.18em] uppercase whitespace-nowrap text-cream/85";

// The tickets UI shared by the modal (TicketsModal) and the standalone /tickets
// page: a currency toggle over the early-bird ticket (USD → Stripe Payment Link;
// BTC → the OpenNode BtcModal) and the pay-what-you-want supporter tile, both
// driven by the shared currency store, with the supporter/BTC flows stacking on
// top. Pass `onClose` when it lives in a modal — it adds the close button,
// scroll-lock and Escape-to-close (which yields to a stacked sub-modal); omit it
// on the page.
export default function TicketsPanel({ onClose }: { onClose?: () => void }) {
  const standard = getTicket("standard");
  const earlyBirdHref = standard ? ticketUrl(standard) : null;
  const [supporterOpen, setSupporterOpen] = useState(false);
  const [btcOpen, setBtcOpen] = useState(false);

  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot,
  );
  const isBtc = currency === "btc";

  // Modal-only behaviour: lock page scroll while open; close on Escape unless a
  // modal is stacked on top (the supporter or BTC modal owns Escape while open).
  useEffect(() => {
    if (!onClose) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !supporterOpen && !btcOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, supporterOpen, btcOpen]);

  return (
    <div className="relative flex w-full max-w-[560px] flex-col items-center gap-[22px] rounded-xl border border-cream/15 bg-navy px-9 py-8 text-cream shadow-2xl">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center text-cream/50 transition-colors hover:text-cream"
        >
          <FaTimes size={18} />
        </button>
      )}
      <p className={`${HEADING} text-[clamp(20px,2.6vw,26px)] text-cream`}>
        Tickets
      </p>

      {/* USD/BTC toggle: one currency governs both tiles + the supporter modal.
          The tan knob slides over the active half; the label under it darkens
          to navy for contrast. */}
      <button
        type="button"
        role="switch"
        aria-checked={isBtc}
        aria-label="Pay in USD or BTC"
        onClick={() => setCurrency(isBtc ? "usd" : "btc")}
        className="relative flex h-9 w-[136px] items-center rounded-full border border-cream/25 bg-navy2 p-1 font-space-mono text-[13px] tracking-[0.08em] uppercase select-none"
      >
        <span
          aria-hidden
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-tan transition-transform duration-200 ${
            isBtc ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <span
          className={`relative z-[1] flex-1 text-center transition-colors ${
            isBtc ? "text-cream/70" : "text-navy"
          }`}
        >
          USD
        </span>
        <span
          className={`relative z-[1] flex-1 text-center transition-colors ${
            isBtc ? "text-navy" : "text-cream/70"
          }`}
        >
          BTC
        </span>
      </button>

      <div className="flex flex-wrap items-stretch justify-center gap-[18px] max-[460px]:*:w-full">
        {standard &&
          (isBtc ? (
            <button
              type="button"
              onClick={() => setBtcOpen(true)}
              className={`${TILE} bg-transparent p-0`}
            >
              <span className={TILE_FACE}>
                <span className={TILE_LABEL}>Early-bird tickets</span>
                <span className="flex items-baseline gap-2.5 leading-none">
                  <span className="text-[18px] font-bold text-cream/40 line-through">
                    &#8383;{standard.prices.full.btc}
                  </span>
                  <span className={`${HEADING} text-[30px] text-tan`}>
                    &#8383;{standard.prices.earlyBird.btc}
                  </span>
                </span>
              </span>
            </button>
          ) : (
            earlyBirdHref && (
              <a
                href={earlyBirdHref}
                target="_blank"
                rel="noopener noreferrer"
                className={TILE}
              >
                <span className={TILE_FACE}>
                  <span className={TILE_LABEL}>Early-bird tickets</span>
                  <span className="flex items-baseline gap-2.5 leading-none">
                    <span className="text-[18px] font-bold text-cream/40 line-through">
                      ${standard.prices.full.usd}
                    </span>
                    <span className={`${HEADING} text-[30px] text-tan`}>
                      ${standard.prices.earlyBird.usd}
                    </span>
                  </span>
                </span>
              </a>
            )
          ))}
        <button
          type="button"
          onClick={() => setSupporterOpen(true)}
          className={`${TILE} bg-transparent p-0`}
        >
          <span className={TILE_FACE}>
            <span className={TILE_LABEL}>Supporter tier</span>
            <span className={`${HEADING} text-[30px] leading-none text-tan`}>
              {isBtc ? (
                <>&#8383;{supporterTier.floor.btc}+</>
              ) : (
                <>${supporterTier.floor.usd}+</>
              )}
            </span>
          </span>
        </button>
      </div>
      {supporterOpen && (
        <SupporterModal onClose={() => setSupporterOpen(false)} />
      )}
      {btcOpen && standard && (
        <BtcModal ticket={standard} onClose={() => setBtcOpen(false)} />
      )}
    </div>
  );
}
