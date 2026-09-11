"use client";

import { useState, useSyncExternalStore } from "react";
import BtcModal from "@/v2/components/tickets/BtcModal";
import SupporterModal from "@/v2/components/tickets/SupporterModal";
import { Button } from "@/v2/components/ui/button";
import {
  EARLY_BIRD_DEADLINE,
  fullPriceTicketUrl,
  getTicket,
  supporterTier,
  ticketUrl,
} from "@/v2/lib/tickets";
import UpdatesButton from "@/v2/components/signup/UpdatesButton";
import {
  subscribeCurrency,
  getCurrencySnapshot,
  getCurrencyServerSnapshot,
  setCurrency,
} from "@/v2/lib/currency-store";
import { HEADING } from "../styles";

// Square ticket tiles: mono uppercase label over a big grotesk price, rendered
// via the raised Button variant (bordered navy face with a salmon hard-shadow
// that grows and slides up-left on hover). Layout only; the visual lives in the
// variant.
const TILE = "min-w-[210px] flex-col gap-1 px-7 py-4 max-[460px]:w-full";
const TILE_LABEL =
  "font-space-mono text-[13px] tracking-[0.18em] uppercase whitespace-nowrap text-cream/85";
const TILE_NOTE =
  "font-space-mono text-[11px] tracking-[0.08em] uppercase whitespace-nowrap text-cream/60";

// The tickets UI for the home page's tickets section: a currency toggle over the early-bird ticket (USD → Stripe Payment Link;
// BTC → the OpenNode BtcModal) and the pay-what-you-want supporter tile, both
// driven by the shared currency store, with the supporter/BTC flows stacking on
// top. Renders bare inner content — the navy panel box comes from the modal's
// DialogContent or the section wrapper.
export default function TicketsPanel({
  showHeading = true,
  surface = "dark",
  align = "center",
}: {
  // Centred in the modal; the left-aligned tickets section ranges everything left.
  align?: "center" | "start";
  // The modal shows its own "Tickets" heading; the one-pager section supplies a
  // SectionHeading above the (now background-less) panel, so it hides this one.
  showHeading?: boolean;
  // The tiles carry their own navy face, but bare text has to match what's behind
  // the panel: navy in the modal, the cream page background in the section.
  surface?: "dark" | "light";
}) {
  const onDark = surface === "dark";
  const start = align === "start";
  const standard = getTicket("standard");
  const earlyBirdHref = standard ? ticketUrl(standard) : null;
  const standardHref = standard ? fullPriceTicketUrl(standard) : null;
  const [supporterOpen, setSupporterOpen] = useState(false);
  // Which tile opened the BTC modal decides whether the promo code is prefilled.
  const [btcOpen, setBtcOpen] = useState<"early-bird" | "standard" | null>(
    null,
  );

  const currency = useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot,
  );
  const isBtc = currency === "btc";

  return (
    <>
      {showHeading && (
        <p className={`${HEADING} text-[clamp(20px,2.6vw,26px)] text-cream`}>
          Tickets
        </p>
      )}

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

      <div
        className={`flex flex-wrap items-stretch gap-[18px] max-[460px]:*:w-full ${start ? "justify-start" : "justify-center"}`}
      >
        {standard &&
          (isBtc ? (
            <Button
              type="button"
              variant="raised"
              onClick={() => setBtcOpen("early-bird")}
              className={TILE}
            >
              <span className={TILE_LABEL}>Early-bird</span>
              <span className="flex items-baseline gap-2.5 leading-none">
                <span className="text-[18px] font-bold text-cream/40 line-through">
                  &#8383;{standard.prices.full.btc}
                </span>
                <span className={`${HEADING} text-[30px] text-tan`}>
                  &#8383;{standard.prices.earlyBird.btc}
                </span>
              </span>
              <span className={TILE_NOTE}>until {EARLY_BIRD_DEADLINE}</span>
            </Button>
          ) : (
            earlyBirdHref && (
              <Button asChild variant="raised" className={TILE}>
                <a
                  href={earlyBirdHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={TILE_LABEL}>Early-bird</span>
                  <span className="flex items-baseline gap-2.5 leading-none">
                    <span className="text-[18px] font-bold text-cream/40 line-through">
                      ${standard.prices.full.usd}
                    </span>
                    <span className={`${HEADING} text-[30px] text-tan`}>
                      ${standard.prices.earlyBird.usd}
                    </span>
                  </span>
                  <span className={TILE_NOTE}>until {EARLY_BIRD_DEADLINE}</span>
                </a>
              </Button>
            )
          ))}
        {/* Full price, no promo code: for after the deadline, or for anyone
            who'd rather not use one. */}
        {standard &&
          (isBtc ? (
            <Button
              type="button"
              variant="raised"
              onClick={() => setBtcOpen("standard")}
              className={TILE}
            >
              <span className={TILE_LABEL}>Standard</span>
              <span className={`${HEADING} text-[30px] leading-none text-tan`}>
                &#8383;{standard.prices.full.btc}
              </span>
            </Button>
          ) : (
            standardHref && (
              <Button asChild variant="raised" className={TILE}>
                <a
                  href={standardHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={TILE_LABEL}>Standard</span>
                  <span
                    className={`${HEADING} text-[30px] leading-none text-tan`}
                  >
                    ${standard.prices.full.usd}
                  </span>
                </a>
              </Button>
            )
          ))}
        <Button
          type="button"
          variant="raised"
          onClick={() => setSupporterOpen(true)}
          className={TILE}
        >
          <span className={TILE_LABEL}>Supporter tier</span>
          <span className={`${HEADING} text-[30px] leading-none text-tan`}>
            {isBtc ? (
              <>&#8383;{supporterTier.floor.btc}+</>
            ) : (
              <>${supporterTier.floor.usd}+</>
            )}
          </span>
        </Button>
        <span
          className={`text-sm ${start ? "text-left" : "text-center"} ${onDark ? "text-cream/70" : "text-ink/70"}`}
        >
          Volunteer and Financial Assistance ticket details coming soon!{" "}
          <UpdatesButton
            className={`font-bold underline underline-offset-2 ${onDark ? "text-tan" : "text-meeple"}`}
          >
            Sign up for updates
          </UpdatesButton>{" "}
          to hear when they do.
        </span>
      </div>
      {supporterOpen && (
        <SupporterModal onClose={() => setSupporterOpen(false)} />
      )}
      {btcOpen && standard && (
        <BtcModal
          ticket={standard}
          initialCode={btcOpen === "early-bird" ? "EARLYBIRD" : ""}
          onClose={() => setBtcOpen(null)}
        />
      )}
    </>
  );
}
