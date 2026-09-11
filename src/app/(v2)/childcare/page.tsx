import type { Metadata } from "next";
import ContentPage from "@/v2/components/ContentPage";
import LastYearSchedule from "@/v2/components/schedule/LastYearSchedule";
import { HEADING } from "@/v2/components/styles";
import Testimonials from "@/v2/components/Testimonials";
import { CHILDCARE_TESTIMONIALS } from "@/v2/data/childcare-testimonials";
import { TEAM_EMAIL } from "@/v2/lib/links";

export const metadata: Metadata = {
  title: "Childcare — Metagame 2026",
  description: "Childcare and children's programming at Metagame 2026.",
};

export default function ChildcarePage() {
  return (
    <ContentPage
      eyebrow="What of the children?"
      title="Childcare"
      intro={
        // TODO(team): real childcare details (hours, ages, sign-up)
        <>
          <p>
            [Placeholder] Metagame welcomes your whole family. Childcare and
            children&apos;s programming will be available throughout the
            conference. The 2026 childcare schedule is coming soon.
          </p>
          <p className="mt-3">
            Questions or particular needs? Email{" "}
            <a
              href={`mailto:${TEAM_EMAIL}`}
              className="font-semibold text-navy underline underline-offset-2"
            >
              {TEAM_EMAIL}
            </a>
            .
          </p>
        </>
      }
    >
      <h2 className={`${HEADING} mb-6 text-[clamp(24px,3vw,34px)] text-navy`}>
        What the kids said
      </h2>
      <Testimonials items={CHILDCARE_TESTIMONIALS} className="mb-14" />

      <h2 className={`${HEADING} mb-6 text-[clamp(24px,3vw,34px)] text-navy`}>
        Last year in The Family Room
      </h2>
      <LastYearSchedule
        locationNames={["The Family Room"]}
        ages={["KIDS"]}
        variant="sequential"
        defaultView="list"
        showViewToggle={false}
      />
    </ContentPage>
  );
}
