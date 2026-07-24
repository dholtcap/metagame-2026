import Dice from "@/components/Dice";
import HeroTicketsCta from "./HeroTicketsCta";
import { EYEBROW } from "./styles";

// The homepage banner: event info and the rolling-dice METAGAME wordmark. No
// background of its own — it shares the layout's cream so the page reads as one
// continuous surface. Home-only (rendered from the page, not the shared layout)
// — content pages get just the nav above their own content.
export default function SiteHero() {
  return (
    <section className="relative flex min-h-[320px] flex-col items-center justify-center px-8 pt-10 pb-8 text-center md:min-h-[400px]">
      <div className="flex w-full justify-center">
        <Dice />
      </div>
      <p className={`${EYEBROW} mt-4 text-meeple`}>
        Nov 6-8, 2026 &middot; Berkeley, California
      </p>
      <div className="mt-6">
        <HeroTicketsCta />
      </div>
      {/* Watched by the nav's IntersectionObserver to expand the logo past the hero. */}
      <span
        id="hero-end-sentinel"
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
      />
    </section>
  );
}
