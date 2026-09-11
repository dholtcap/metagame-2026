import type { Metadata } from "next";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import ContentPage from "@/v2/components/ContentPage";
import SignupForm from "@/v2/components/signup/SignupForm";
import { HEADING } from "@/v2/components/styles";
import { Button } from "@/v2/components/ui/button";
import { RFP_FORM_URL, VOLUNTEER_FORM_URL } from "@/v2/lib/links";
import { SOCIAL_LINKS } from "@/v2/lib/urls";

export const metadata: Metadata = {
  title: "Get involved — Metagame 2026",
  description: "Volunteer, sponsor, or run something at Metagame 2026.",
};

const WAYS = [
  {
    title: "Volunteer",
    body: "Help run the con: registration, room hosting, wrangling games, and everything in between. Volunteers get in free.",
    cta: "Volunteer form",
    href: VOLUNTEER_FORM_URL,
    external: true,
  },
  {
    title: "Sponsor",
    body: "Put your name on the weekend. Tiers range from a credit on the site to a custom-built event of your own.",
    cta: "Sponsor tiers",
    href: "/sponsor",
    external: false,
  },
  {
    title: "Run something",
    body: "A talk, a workshop, a game, a megagame, a thing that defies category. Tell us what you want to run.",
    cta: "Propose a session",
    href: RFP_FORM_URL,
    external: true,
  },
];

export default function GetInvolvedPage() {
  return (
    <ContentPage
      eyebrow="Want to do more?"
      title="Get involved"
      intro="Metagame is made by the people who show up. Here's how to be one of them."
    >
      <section className="grid gap-6 min-[900px]:grid-cols-3">
        {WAYS.map(({ title, body, cta, href, external }) => (
          <div
            key={title}
            className="flex flex-col rounded-2xl border border-navy/[0.16] bg-white p-7 shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
          >
            <h2 className={`${HEADING} text-2xl text-navy`}>{title}</h2>
            <p className="mt-3 flex-1 text-[15px] text-ink/70">{body}</p>
            <Button asChild variant="default" className="mt-6 w-fit">
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {cta} <span aria-hidden="true">&rarr;</span>
                </a>
              ) : (
                <Link href={href}>
                  {cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              )}
            </Button>
          </div>
        ))}
      </section>
      <section className="mt-16 max-w-[640px]">
        <h2 className={`${HEADING} text-[clamp(24px,3vw,34px)] text-navy`}>
          Stay in the loop
        </h2>
        <p className="mt-3 mb-6 text-base text-ink/70">
          Ticket sales, updates, volunteer calls, future events.
        </p>
        <SignupForm light />
        <Button asChild variant="navy" className="mt-6">
          <a
            href={SOCIAL_LINKS.DISCORD}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord aria-hidden /> Join the Discord
          </a>
        </Button>
      </section>
    </ContentPage>
  );
}
