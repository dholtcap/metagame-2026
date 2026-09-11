import type { Metadata } from "next";
import ContentPage from "@/v2/components/ContentPage";
import { HEADING } from "@/v2/components/styles";
import { Button } from "@/v2/components/ui/button";
import { TEAM_EMAIL } from "@/v2/lib/links";

export const metadata: Metadata = {
  title: "Sponsor — Metagame 2026",
  description: "Sponsorship tiers for Metagame 2026.",
};

type Tier = {
  name: string;
  price: string;
  note?: string;
  perks: string[];
  blurb?: string;
};

const TIERS: Tier[] = [
  {
    name: "Patron",
    price: "$2k+",
    blurb:
      "You are excited about supporting Metagame and helping ensure it continues to exist; we'll credit you on our website and feel enormous gratitude!",
    perks: [],
  },
  {
    name: "Silver",
    price: "$15k",
    perks: [
      "Name/logo placement on website, swag, and all marketing opportunities",
      "Booth at the night market / career fair",
      "2 tickets",
      "Attendee careers database",
    ],
  },
  {
    name: "Gold",
    price: "$30k",
    perks: [
      "Slot for a main room talk",
      "Slot for office hours / a short event",
      "Name/logo placement",
      "Premier booth at the night market / career fair",
      '1 "Guest of Honor" ticket',
      "3 regular tickets",
      "Attendee careers database",
    ],
  },
  {
    name: "Platinum",
    price: "$60k",
    note: "3 slots available",
    perks: [
      "Premium branded event",
      "Option to supply your own custom swag to attendees",
      "Slot for a main room talk",
      "Slot for office hours / a short event",
      "Special name/logo placement",
      "Premier booth at the night market / career fair",
      '2 "Guest of Honor" tickets',
      "5 regular tickets",
      "Attendee careers database",
    ],
  },
  {
    name: "Headline",
    price: "Let's talk",
    note: "1 slot available",
    blurb:
      "Our main \"brought to you by\" sponsor, with all of the above perks and a decent amount of additional opportunities for creative direction (last year's headline sponsor ran a game custom-built for Metagame that lasted the duration of the conference). If you might be interested in this tier, let us know and we can discuss pricing and vision, since it's a highly customizable option and would involve more close collaboration.",
    perks: [],
  },
];

const contactHref = (tier: string) =>
  `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(`${tier} Sponsorship Inquiry`)}`;

export default function SponsorPage() {
  return (
    <ContentPage
      eyebrow="Want to put your name on it?"
      title="Sponsor Metagame"
      intro="Metagame runs on sponsors. Pick a tier, or tell us what you have in mind."
      wide
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {TIERS.map(({ name, price, note, perks, blurb }) => (
          <div
            key={name}
            className="flex flex-col rounded-2xl border border-navy/[0.16] bg-white p-6 shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
          >
            <h2 className={`${HEADING} text-2xl text-navy`}>{name}</h2>
            <p className="mt-1 font-space-mono text-lg text-meeple">{price}</p>
            {note && (
              <p className="font-space-mono text-xs tracking-[0.08em] text-ink/55 uppercase">
                {note}
              </p>
            )}
            <div className="mt-4 flex-1 text-[15px] text-ink/70">
              {blurb && <p>{blurb}</p>}
              {perks.length > 0 && (
                <ul className="flex list-disc flex-col gap-1.5 pl-5">
                  {perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              )}
            </div>
            <Button asChild variant="default" className="mt-6 w-fit">
              <a href={contactHref(name)}>Contact us</a>
            </Button>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
