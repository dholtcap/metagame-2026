import type { Metadata } from "next";
import ContentPage from "@/v2/components/ContentPage";
import LastYearSchedule from "@/v2/components/schedule/LastYearSchedule";
import { HEADING } from "@/v2/components/styles";
import { Button } from "@/v2/components/ui/button";
import { LAST_YEAR_SITE_URL } from "@/v2/lib/links";

export const metadata: Metadata = {
  title: "Last year — Metagame 2026",
  description:
    "What happened at Metagame 2025: the con, the schedule, and the archive.",
};

export default function LastYearPage() {
  return (
    <ContentPage
      eyebrow="What happened last year?"
      title="Metagame 2025"
      intro={
        // TODO(team): real recap of the 2025 con
        <p>
          [Placeholder] Metagame 2025 ran for three days at Lighthaven. The
          whole con was one large game: players found their team by solving a
          puzzle hidden in their swag, then spent the weekend competing while
          playing everything else on the program. Attendees built and ran an
          escape room from scratch, a secret second convention-wide game
          surfaced in the closing hours, and yes, there were tasers.
        </p>
      }
      wide
    >
      <h2 className={`${HEADING} mb-3 text-[clamp(24px,3vw,34px)] text-navy`}>
        The 2025 schedule
      </h2>
      <p className="mb-8 max-w-[640px] text-base text-ink/70">
        The complete program: talks, workshops, games, and megagames across
        three days. Tap any session for details.
      </p>
      <LastYearSchedule />

      <div className="mt-16 border-t border-line pt-10">
        <p className="mb-4 max-w-[640px] text-base text-ink/70">
          The 2025 site is still up, speakers and all.
        </p>
        <Button asChild variant="navy">
          <a
            href={LAST_YEAR_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit 2025.metagame.games <span aria-hidden="true">&#8599;</span>
          </a>
        </Button>
      </div>
    </ContentPage>
  );
}
