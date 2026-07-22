import Image from "next/image";
// Blurred hero stands in until face-photo inclusion is approved.
import hero from "../../../public/images/hero_blurred.png";
import LogoDice from "./LogoDice";
import { EYEBROW } from "./styles";

// The homepage banner: event info and the METAGAME wordmark. Home-only
// (rendered from the page, not the shared layout) — content pages get just the
// nav above their own content.
export default function SiteHero() {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden text-cream">
      <Image
        src={hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%] brightness-125"
      />
      <div className="relative mx-auto w-full max-w-[1180px] px-8 pt-16 pb-12 text-center">
        <p className={`${EYEBROW} text-tan`}>
          Nov 6-8, 2026 &middot; Berkeley, California
        </p>
        <LogoDice
          highlight={true}
          className="mx-auto mt-[18px] h-[170px] w-auto max-w-[calc(100vw-64px)] max-[560px]:h-[90px]"
        />
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
