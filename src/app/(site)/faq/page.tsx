import type { Metadata } from "next";
import Image from "next/image";
import lighthavenMap from "../../../../public/images/lighthaven.png";
import UpdatesButton from "@/components/site/UpdatesButton";
import {
  BTN_PRIMARY,
  HEADING,
  NEWSLETTER_LINK,
} from "@/components/site/styles";

export const metadata: Metadata = {
  title: "Metagame FAQ — Nov 6-8, 2026",
  description:
    "Frequently asked questions about Metagame 2026: what it is, where it happens, lodging, food, refunds, and children's programming.",
};

const BODY_LINK = "font-semibold text-navy underline underline-offset-2";

const NewsletterCta = () => (
  <UpdatesButton className={`${NEWSLETTER_LINK} align-baseline`}>
    Subscribe to our newsletter
  </UpdatesButton>
);

const FAQS: {
  id?: string;
  open?: boolean;
  question: string;
  answer: React.ReactNode;
}[] = [
  {
    id: "first-faq",
    open: true,
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
        <a href="https://lighthaven.space/" className={BODY_LINK}>
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
        Rooms will be available to book at the venue, Lighthaven. Want to know
        when they are available?&nbsp;
        <NewsletterCta />
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
        until sunset in Berkeley on September 6th. After the sun has set, you
        must contact us.
        <br />
        <br />
        Bitcoin is ethereal and complicated to refund.
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
        during the day! If you have particular questions or concerns feel free
        to{" "}
        <a href="mailto:team@metagame.games" className={BODY_LINK}>
          reach out
        </a>
        .
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <section id="faq" className="pt-14 pb-[88px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mx-auto mb-12 max-w-[820px] text-center">
          <h2 className={`${HEADING} text-[clamp(28px,4vw,40px)]`}>
            Frequently asked questions
          </h2>
        </div>

        <div className="mx-auto flex max-w-[820px] flex-col gap-3.5">
          {FAQS.map(({ id, open, question, answer }) => (
            <details
              key={question}
              id={id}
              open={open}
              className="group overflow-hidden rounded-[14px] border border-navy/[0.22] bg-sky transition-[box-shadow,border-color] duration-[180ms] open:border-navy open:shadow-[0_6px_24px_rgba(23,48,89,0.12)]"
            >
              <summary
                className={`${HEADING} flex cursor-pointer list-none items-center justify-between gap-[18px] px-6 py-5 text-lg text-navy after:flex after:h-7 after:w-7 after:flex-none after:items-center after:justify-center after:rounded-full after:bg-white/55 after:font-space-mono after:text-lg after:font-normal after:text-navy after:transition-[background,color] after:duration-[180ms] after:content-['+'] group-open:after:bg-navy group-open:after:text-white group-open:after:content-['−'] hover:after:bg-navy hover:after:text-white [&::-webkit-details-marker]:hidden`}
              >
                {question}
              </summary>
              <div className="max-w-[660px] px-6 pb-[22px] text-[15.5px] text-ink/75">
                {answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-11 text-center">
          <p className="mx-auto mb-4 max-w-[620px] text-ink/70">
            Wish to read more words? Email{" "}
            <a href="mailto:team@metagame.games" className={BODY_LINK}>
              team@metagame.games
            </a>{" "}
            and we shall respond.
          </p>
          <a href="mailto:team@metagame.games" className={BTN_PRIMARY}>
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}
