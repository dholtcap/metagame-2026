import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import BloodOnTheClocktowerDivider from "@/components/site/dividers/blood-on-the-clocktower";
import CardSuitsDivider from "@/components/site/dividers/card-suits";
import DiceDivider from "@/components/site/dividers/dice";
import DungeonCrawlDivider from "@/components/site/dividers/dungeon-crawl";
import SetCardDivider from "@/components/site/dividers/set-cards";
import { GLYPH, SHADOW } from "@/components/site/dividers/sizing";
import SiteHero from "@/components/site/SiteHero";
import { EYEBROW, HEADING, NEWSLETTER_LINK } from "@/components/site/styles";
import chess1 from "../../../public/images/chess1.png";
import chess2 from "../../../public/images/chess2.png";
import chess3 from "../../../public/images/chess3.png";
import weirdchess1 from "../../../public/images/weirdchess1.png";
import weirdchess2 from "../../../public/images/weirdchess2.png";
import weirdchess3 from "../../../public/images/weirdchess3.png";
import weirdchess4 from "../../../public/images/weirdchess4.png";

export const metadata: Metadata = {
  title: "Metagame — Nov 6-8, 2026",
  description:
    "A convention of games, designs, and puzzles. Nov 6-8, 2026 at Lighthaven, Berkeley, California.",
};

const CARDS = [
  {
    href: "https://2025.metagame.games#speakers",
    icon: chess1,
    title: "Speakers (2025)",
    cta: "Who came before →",
  },
  {
    href: "/schedule",
    icon: chess2,
    title: "Schedule (2025)",
    cta: "What came before →",
  },
  {
    href: "/faq",
    icon: chess3,
    title: "FAQ",
    cta: "What, where, and when →",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      '"By far the most fun I had was arriving on the first day and discovering the puzzle hunt stuff. As I explored the campus, I felt an amazing mixture of excitement and whimsy, in trying to discover all the secrets hidden about."',
    name: "A person, in attendence",
  },
  {
    quote:
      '"Metagame is pretty good for people who like games. All games there are fun and enjoyable. I liked playing Ultimate Tic-Tac-Toe. That is all the things I have to say."',
    name: "Vasili, Age 8",
  },
  {
    quote:
      '"Every person I interacted with on the team was amazing, there was so much enthusiasm and welcoming attitude, which really brought the conference to life."',
    name: "Another",
  },
] as const;

export default function Home() {
  return (
    <>
      <SiteHero />
      <section id="whats-on" className="pt-11 pb-[88px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <div className="mb-12 max-w-[600px]">
            <h2 className={`${HEADING} text-[clamp(28px,4vw,40px)]`}>
              Games, designs, puzzles.
            </h2>
            <p className="mt-3.5 text-base text-ink/70">
              This convention is a conundrum, sent to confound you. It is a
              puzzle. A riddle. There will be game designers in nooks and
              alcoves, whispering their secrets to knowing audiences. You will
              be competing, but you may not know against whom. And, above all
              else, there will be games.
            </p>
            <p className="mt-3.5 text-base text-ink/70">
              Still confused?{" "}
              <Link href="/faq#first-faq" className={NEWSLETTER_LINK}>
                Click here.
              </Link>
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-3 items-center justify-center gap-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {CARDS.map(({ href, icon, title, cta }) => (
              <Link
                key={href}
                href={href}
                className="relative flex min-h-[120px] min-w-0 flex-col items-start overflow-hidden rounded-[14px] border border-line-dark bg-navy px-[22px] pt-[26px] pb-3 text-cream transition-[transform,border-color] duration-[180ms] hover:-translate-y-1 hover:border-brand-blue"
              >
                <Image
                  src={icon}
                  alt=""
                  aria-hidden
                  className="absolute top-4 right-[18px] h-[42px] w-[42px] object-contain"
                />
                <h3 className={`${HEADING} mb-2.5 pr-[54px] text-[19px]`}>
                  {title}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#edb067]">
                  {cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-[22px] py-10">
        <span className="h-px max-w-40 flex-1 bg-line" />
        {[weirdchess1, weirdchess2, weirdchess3, weirdchess4].map(
          (piece, i) => (
            <Image
              key={i}
              src={piece}
              alt=""
              aria-hidden
              className={`${GLYPH} object-contain ${SHADOW}`}
            />
          ),
        )}
        <span className="h-px max-w-40 flex-1 bg-line" />
      </div>

      <section className="py-[72px]">
        <div className="mx-auto max-w-[720px] px-8 text-center">
          <h2 className={`${HEADING} text-[clamp(24px,3.4vw,34px)]`}>
            Join the mailing list
          </h2>
          <p className="mx-auto mt-3 mb-7 max-w-[520px] text-base text-ink/70">
            Get notified about ticket sales, updates, volunteer opportunities,
            and more.
          </p>
          <div className="mx-auto max-w-[600px]">
            <SignupForm light />
          </div>
        </div>
      </section>

      <DiceDivider />

      <SetCardDivider />

      <BloodOnTheClocktowerDivider />

      <DungeonCrawlDivider />

      <CardSuitsDivider />

      <section className="py-[88px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <div className="mb-12 max-w-[600px]">
            <p className={`${EYEBROW} mb-2.5 text-meeple`}>
              Last year&apos;s crowd
            </p>
            <h2 className={`${HEADING} text-[clamp(28px,4vw,40px)] text-navy`}>
              What people said
            </h2>
          </div>
          <div className="grid min-w-0 grid-cols-3 gap-5 max-[900px]:grid-cols-1">
            {TESTIMONIALS.map(({ quote, name }) => (
              <div
                key={name}
                className="min-w-0 rounded-[14px] border border-navy/[0.16] bg-white px-6 py-[26px] shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
              >
                <p className="mb-[18px] text-[15px] text-ink/80">{quote}</p>
                <p className="text-sm font-semibold text-meeple">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
