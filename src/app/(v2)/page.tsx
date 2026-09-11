import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/v2/components/Carousel";
import BloodOnTheClocktowerDivider from "@/v2/components/dividers/blood-on-the-clocktower";
import CardSuitsDivider from "@/v2/components/dividers/card-suits";
import CatanDivider from "@/v2/components/dividers/catan";
import ChessDivider from "@/v2/components/dividers/chess";
import DiceDivider from "@/v2/components/dividers/dice";
import MonopolyDivider from "@/v2/components/dividers/monopoly";
import SetCardDivider from "@/v2/components/dividers/set-cards";
import FaqItem from "@/v2/components/FaqItem";
import SectionHeading from "@/v2/components/SectionHeading";
import SignupForm from "@/v2/components/signup/SignupForm";
import SiteHero from "@/v2/components/SiteHero";
import TeamCarousel from "@/v2/components/TeamCarousel";
import Testimonials from "@/v2/components/Testimonials";
import {
  HEADING,
  NEWSLETTER_LINK,
  SECTION,
  SECTION_ANCHOR,
} from "@/v2/components/styles";
import TicketsPanel from "@/v2/components/tickets/TicketsPanel";
import { Button } from "@/v2/components/ui/button";
import { CAROUSEL } from "@/v2/data/carousel";
import { CHILDCARE_TESTIMONIALS } from "@/v2/data/childcare-testimonials";
import {
  HOUSING_URL,
  LIGHTHAVEN_URL,
  RFP_FORM_URL,
  TEAM_EMAIL,
} from "@/v2/lib/links";
import { EARLY_BIRD_DEADLINE } from "@/v2/lib/tickets";
import lighthavenMap from "../../../public/images/lighthaven.png";

export const metadata: Metadata = {
  title: "Metagame — Nov 6-8, 2026",
  description:
    "A convention of games, designs, and puzzles. Nov 6-8, 2026 at Lighthaven, Berkeley, California.",
};

const BODY_LINK = "font-semibold text-navy underline underline-offset-2";
const CONTAINER = "mx-auto max-w-[1180px] px-8";
const PROSE = "mt-3.5 text-base text-ink/70";

const FAQS: {
  id?: string;
  open?: boolean;
  question: string;
  answer: React.ReactNode;
}[] = [
  {
    id: "first-faq",
    question: "What is Metagame?",
    answer: (
      <>
        To be frank with you, it is hard to describe. Metagame has many of the
        typical trappings of a board game convention: gaming spaces, designers
        talking about their projects, as well games requiring more organization,
        such as Blood on the Clocktower. But it&apos;s a little weirder, too.
        <br />
        <br />
        Last year, the entire con was one large game. Players discovered their
        team by solving a puzzle on their swag, and spent three days competing
        against one another while still playing the other games.
        <br />
        <br />
        Attendees who took the escape room design course created their own
        escape room from scratch and ran it.
        <br />
        <br />
        A guest started a secret, second convention-wide game that staff only
        learned of in the closing hours. At one point, there were people
        knife-fighting with tasers.
        <br />
        <br />
        Come see what happens in 2026.
      </>
    ),
  },
  {
    question: "Where will it be?",
    answer: (
      <>
        <a href={LIGHTHAVEN_URL} className={BODY_LINK}>
          Lighthaven{" "}
        </a>
        <br />
        2740 Telegraph Ave, Berkeley, CA 94705
        <Image
          src={lighthavenMap}
          alt="Map of the Lighthaven campus"
          className="mt-4 h-auto w-full max-w-[560px] rounded-lg"
        />
      </>
    ),
  },
  {
    question: "Where can I stay?",
    answer: (
      <>
        On-site housing at Lighthaven is now available.{" "}
        <a
          href={HOUSING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={BODY_LINK}
        >
          Book a room here
        </a>
        .
      </>
    ),
  },
  {
    question: "When is Metagame?",
    answer: <>It begins at 2pm Friday, Nov 6. It will run to 9:00pm, Nov 8.</>,
  },
  {
    question: "What is the refund policy?",
    answer: (
      <>
        You may exchange your tickets for as much money as you paid for them
        until sunset in Berkeley on October 6th. After the sun has set, you must
        contact us.
        <br />
        <br />
        Bitcoin is ethereal and complicated to refund.
      </>
    ),
  },
  {
    question: "Can I transfer my ticket?",
    answer: (
      <>
        Yes, as long as your ticket wasn&apos;t a special personal comp. Email{" "}
        <a href={`mailto:${TEAM_EMAIL}`} className={BODY_LINK}>
          {TEAM_EMAIL}
        </a>{" "}
        if you&apos;d like to transfer your ticket to someone else.
      </>
    ),
  },
  {
    question: "What will I eat?",
    answer: (
      <>
        Snacks and beverages will be available for the taking. Food trucks will
        also be on-site with meals available for purchase.
      </>
    ),
  },
  {
    question: "Can I bring my kids?",
    answer: (
      <>
        There will be childcare and some children&apos;s programming available
        during the day! See the{" "}
        <Link href="/childcare" className={BODY_LINK}>
          childcare page
        </Link>{" "}
        for more. If you have particular questions or concerns feel free to{" "}
        <a href={`mailto:${TEAM_EMAIL}`} className={BODY_LINK}>
          reach out
        </a>
        .
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* Section ids are deep-link anchors (/#faq); the nav links to pages. */}
      <div id="home" className={SECTION_ANCHOR}>
        <SiteHero />
      </div>

      {/* about */}
      <section id="about" className={`${SECTION} md:pt-11 md:pb-12`}>
        <div className={CONTAINER}>
          <div className="max-w-[600px]">
            <SectionHeading
              eyebrow="What is all this?"
              title="Games, designs, puzzles."
            />
            <p className={PROSE}>
              This convention is a conundrum, sent to confound you. It is a
              puzzle. A riddle. There will be game designers in nooks and
              alcoves, whispering their secrets to knowing audiences. You will
              be competing, but you may not know against whom. And, above all
              else, there will be games.
            </p>
            <p className={PROSE}>
              <Link href="/last-year" className={NEWSLETTER_LINK}>
                See what happened last year &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      <div className="py-6">
        <Carousel images={CAROUSEL} />
      </div>

      <ChessDivider />

      {/* venue */}
      <section id="venue" className={`${SECTION} md:py-14`}>
        <div className={CONTAINER}>
          <SectionHeading eyebrow="Where is it?" title="Lighthaven" />
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <div className="max-w-[560px]">
              {/* TODO(team): real venue blurb */}
              <p className="text-base text-ink/70">
                [Placeholder] Lighthaven is a campus of connected buildings and
                gardens on Telegraph Avenue in Berkeley: lecture halls, nooks, a
                great lawn, and rooms enough to get lost in. Metagame takes over
                the whole thing for the weekend.
              </p>
              <p className={PROSE}>
                2740 Telegraph Ave, Berkeley, CA 94705 &middot;{" "}
                <a
                  href={LIGHTHAVEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={BODY_LINK}
                >
                  lighthaven.space
                </a>
              </p>
              <h3 className="mt-8 text-xl font-bold text-navy">
                Staying on site
              </h3>
              <p className={PROSE}>
                Housing is available on the Lighthaven campus for the weekend,
                so you can roll out of bed and into a game. Rooms are booked
                directly with Lighthaven.
              </p>
              <Button asChild variant="navy" className="mt-5">
                <a href={HOUSING_URL} target="_blank" rel="noopener noreferrer">
                  Book on-site housing <span aria-hidden="true">&rarr;</span>
                </a>
              </Button>
            </div>
            <Image
              src={lighthavenMap}
              alt="Map of the Lighthaven campus"
              className="h-auto w-full max-w-[560px] rounded-2xl border border-navy/10 shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </section>

      <CardSuitsDivider />

      {/* about us */}
      <section id="about-us" className={`${SECTION} md:py-14`}>
        <div
          className={`${CONTAINER} grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center`}
        >
          <div>
            <SectionHeading eyebrow="Who's behind this?" title="About us" />
            {/* TODO(team): real about-us blurb */}
            <p className={`${PROSE} max-w-[600px]`}>
              [Placeholder] Metagame is put on by a small crew of people who
              like games a little too much, with help from a lot of volunteers
              who like them just as much.
            </p>
            <p className={`${PROSE} max-w-[600px]`}>
              <Link href="/team" className={NEWSLETTER_LINK}>
                Meet the team &rarr;
              </Link>
            </p>
          </div>
          <TeamCarousel className="mx-auto w-full max-w-[400px]" />
        </div>
      </section>

      <SetCardDivider />

      {/* schedule */}
      <section id="schedule" className={`${SECTION} md:py-14`}>
        <div className={CONTAINER}>
          <SectionHeading
            eyebrow="What's going on?"
            title="Run something at Metagame"
          />
          <p className={`${PROSE} max-w-[600px]`}>
            The 2026 schedule is coming soon. In the meantime, you can{" "}
            <Link href="/last-year" className={BODY_LINK}>
              see last year&apos;s schedule here
            </Link>
            .
          </p>
          <p className={`${PROSE} max-w-[600px]`}>
            We&apos;re still taking proposals for things to add to it: talks,
            workshops, games, or something that defies category.
          </p>
          <Button asChild variant="default" className="mt-5">
            <a href={RFP_FORM_URL} target="_blank" rel="noopener noreferrer">
              Propose a session <span aria-hidden="true">&rarr;</span>
            </a>
          </Button>
        </div>
      </section>

      <DiceDivider />

      {/* childcare */}
      <section id="childcare" className={`${SECTION} md:py-14`}>
        <div className={CONTAINER}>
          <SectionHeading eyebrow="What of the children?" title="Childcare" />
          {/* TODO(team): real childcare blurb */}
          <p className={`${PROSE} max-w-[600px]`}>
            [Placeholder] Metagame welcomes your whole family. Childcare and
            children&apos;s programming will be provided throughout the
            conference, so the grown-ups can play too.
          </p>
          <p className={`${PROSE} max-w-[600px]`}>
            <Link href="/childcare" className={NEWSLETTER_LINK}>
              More about childcare &rarr;
            </Link>
          </p>
          <Testimonials items={CHILDCARE_TESTIMONIALS} className="mt-10" />
        </div>
      </section>

      <BloodOnTheClocktowerDivider />

      {/* tickets */}
      <section id="tickets" className={`${SECTION} md:py-14`}>
        <div className={CONTAINER}>
          <SectionHeading eyebrow="Ready to play?" title="Tickets" />
          <p className={`${PROSE} mb-7 max-w-[600px]`}>
            One ticket covers all three days. Early-bird pricing ends{" "}
            {EARLY_BIRD_DEADLINE}.
          </p>
          {/* The panel renders bare toggle + tiles; the column/gap is ours. */}
          <div className="flex max-w-[700px] flex-col items-start gap-6">
            <TicketsPanel showHeading={false} surface="light" align="start" />
          </div>

          <div className="mt-14 grid max-w-[820px] gap-8 sm:grid-cols-2">
            <div>
              <h3 className={`${HEADING} text-2xl text-navy`}>Sponsoring?</h3>
              <p className="mt-2 text-base text-ink/70">
                Sponsor tiers include tickets, booths, and talk slots.{" "}
                <Link href="/sponsor" className={BODY_LINK}>
                  See the sponsor page
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className={`${HEADING} text-2xl text-navy`}>
                Want to help run it?
              </h3>
              <p className="mt-2 text-base text-ink/70">
                Volunteer, run a session, or just stay in the loop.{" "}
                <Link href="/get-involved" className={BODY_LINK}>
                  Get involved
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <CatanDivider />

      {/* stay in the loop */}
      <section id="stay-in-the-loop" className={`${SECTION} md:py-14`}>
        <div className={CONTAINER}>
          <SectionHeading eyebrow="Want to keep up?" title="Stay in the loop" />
          <p className="mt-3 mb-7 max-w-[520px] text-base text-ink/70">
            Get notified about ticket sales, updates, volunteer opportunities,
            future events, and more.
          </p>
          <div className="max-w-[600px]">
            <SignupForm light />
          </div>
          <p className="mt-8 max-w-[600px] text-base text-ink/70">
            Want to do more than read about it? Volunteer, sponsor, or run
            something.{" "}
            <Link href="/get-involved" className={NEWSLETTER_LINK}>
              Get involved &rarr;
            </Link>
          </p>
        </div>
      </section>

      <MonopolyDivider />

      {/* faq */}
      <section id="faq" className={`${SECTION} md:pt-14 md:pb-[88px]`}>
        <div className={CONTAINER}>
          <SectionHeading
            eyebrow="But what about…"
            title="FAQ"
            className="mb-12"
          />
          <div className="flex max-w-[820px] flex-col gap-3.5">
            {FAQS.map(({ id, open, question, answer }) => (
              <FaqItem
                key={question}
                id={id}
                defaultOpen={open}
                question={question}
              >
                {answer}
              </FaqItem>
            ))}
          </div>
          <div className="mt-11">
            <p className="max-w-[620px] text-ink/70">
              Have more questions? Email{" "}
              <a href={`mailto:${TEAM_EMAIL}`} className={BODY_LINK}>
                {TEAM_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
