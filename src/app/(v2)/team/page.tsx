import type { Metadata } from "next";
import ContentPage from "@/v2/components/ContentPage";
import PersonCard from "@/v2/components/PersonCard";
import { HEADING } from "@/v2/components/styles";
import { ADVISORS, TEAM } from "@/v2/data/team";
import { TEAM_EMAIL } from "@/v2/lib/links";

export const metadata: Metadata = {
  title: "Team — Metagame 2026",
  description: "The people running Metagame 2026.",
};

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
          <li key={person.name}>
            <PersonCard {...person} />
          </li>
        ))}
      </ul>

      <h2
        className={`${HEADING} mt-16 mb-6 text-[clamp(24px,3vw,34px)] text-navy`}
      >
        Advisors
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ADVISORS.map((person) => (
          <li key={person.name}>
            <PersonCard {...person} />
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
