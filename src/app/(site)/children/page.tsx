import type { Metadata } from "next";
import LastYearSchedule from "@/components/LastYearSchedule";
import { EYEBROW, HEADING } from "@/components/site/styles";

export const metadata: Metadata = {
  title: "Children's Programming — Metagame 2026",
  description:
    "Children's programming at Metagame 2026: foam weapons, juggling, and the mysteries that underly reality.",
};

export default function ChildrensProgrammingPage() {
  return (
    <section className="pt-[72px] pb-[54px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mx-auto max-w-[820px]">
          <p className={`${EYEBROW} mb-3 text-meeple`}>What of the children?</p>
          <h1
            className={`${HEADING} mb-[22px] text-[clamp(36px,5vw,58px)] text-navy`}
          >
            Children&apos;s Programming
          </h1>
          <p className="mb-4 max-w-[680px] text-[17px] text-ink/70">
            Metagame welcomes your whole family! Childcare and activity for
            children will be available throughout the conference. Specifics to
            come later, but for now, you can take a look at some of what the
            kids got up to last year, below.
          </p>
        </div>

        <div className="mt-12">
          <p className={`${EYEBROW} mb-1 text-center text-meeple`}>
            The Family Room · Metagame 2025
          </p>
          <h2
            className={`${HEADING} mb-6 text-center text-[clamp(24px,3vw,34px)] text-navy`}
          >
            Last year in The Family Room
          </h2>
          <LastYearSchedule
            locationNames={["The Family Room"]}
            variant="sequential"
            defaultView="list"
            showViewToggle={false}
          />
        </div>
      </div>
    </section>
  );
}
