import dynamic from "next/dynamic";
import Dice from "./dice/Dice";

// Dev-only backdrop lab (drop an image, tune the wash); the conditional
// dynamic() keeps it out of production bundles entirely.
const HeroBackdropLab =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./dev/HeroBackdropLab"))
    : null;

// The above-the-fold banner: just the rolling-dice METAGAME wordmark for now.
// No background of its own — it shares the layout's cream so the page reads as
// one continuous surface. `isolate` so the lab's -z-10 backdrop stays inside
// this section's stacking context (behind the dice, above the page cream).
export default function SiteHero() {
  return (
    <section className="relative isolate flex min-h-[320px] flex-col items-center justify-center px-8 pt-10 pb-8 text-center md:min-h-[400px]">
      {HeroBackdropLab && <HeroBackdropLab />}
      <Dice />
    </section>
  );
}
