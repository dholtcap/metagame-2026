import type { Metadata } from "next";
import LastYearSchedule from "@/components/LastYearSchedule";
import UpdatesButton from "@/components/site/UpdatesButton";
import { HEADING, NEWSLETTER_LINK } from "@/components/site/styles";

export const metadata: Metadata = {
  title: "Schedule — Metagame 2026",
  description:
    "The Metagame 2026 schedule is still coming together. Until then, browse the full Metagame 2025 program — 140+ talks, workshops, games, and megagames across three days.",
};

export default function SchedulePage() {
  return (
    <section className="pt-14 pb-[88px]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-8">
        <header className="mx-auto max-w-[820px] text-center">
          <h1 className={`${HEADING} text-[clamp(28px,4vw,40px)]`}>
            Last year&rsquo;s schedule
          </h1>
          <p className="mt-3.5 text-base text-ink/70">
            The 2026 schedule is still coming together —{" "}
            <UpdatesButton className={NEWSLETTER_LINK}>
              subscribe to our newsletter
            </UpdatesButton>{" "}
            for updates. Until then, here is the complete program from Metagame
            2025: talks, workshops, games, and megagames across three days. Tap
            any session for details.
          </p>
        </header>
        <LastYearSchedule />
      </div>
    </section>
  );
}
