import type { Metadata } from "next";
import Image from "next/image";
import ContentPage from "@/v2/components/ContentPage";
import { HEADING } from "@/v2/components/styles";
import { TEAM, type Person } from "@/v2/data/team";
import { TEAM_EMAIL } from "@/v2/lib/links";

export const metadata: Metadata = {
  title: "Team — Metagame 2026",
  description: "The people running Metagame 2026.",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function PersonCard({ name, title, photo }: Person) {
  return (
    <li className="flex flex-col items-center rounded-2xl border border-navy/[0.16] bg-white px-6 py-8 text-center shadow-[0_8px_24px_rgba(23,48,89,0.08)]">
      {photo ? (
        <Image
          src={photo}
          alt={name}
          className="h-32 w-32 rounded-full object-cover"
          sizes="128px"
        />
      ) : (
        // Placeholder until there's a photo: initials on navy.
        <div
          aria-hidden
          className={`${HEADING} flex h-32 w-32 items-center justify-center rounded-full bg-navy text-4xl text-cream`}
        >
          {initials(name)}
        </div>
      )}
      <h2 className={`${HEADING} mt-5 text-xl text-navy`}>{name}</h2>
      <p className="mt-1 font-space-mono text-xs tracking-[0.08em] text-ink/60 uppercase">
        {title}
      </p>
    </li>
  );
}

export default function TeamPage() {
  return (
    <ContentPage
      eyebrow="Who's behind this?"
      title="The team"
      intro={
        // TODO(team): a line about the crew
        <p>
          [Placeholder] The people who plan, build, and run Metagame. Want to
          join them?{" "}
          <a
            href={`mailto:${TEAM_EMAIL}`}
            className="font-semibold text-navy underline underline-offset-2"
          >
            {TEAM_EMAIL}
          </a>
        </p>
      }
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((person) => (
          <PersonCard key={person.name} {...person} />
        ))}
      </ul>
    </ContentPage>
  );
}
