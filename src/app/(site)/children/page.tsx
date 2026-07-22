import type { Metadata } from "next";
import { EYEBROW, HEADING } from "@/components/site/styles";

const BODY_LINK = "font-semibold text-navy underline underline-offset-2";

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
            kids got up to{" "}
            <a
              href="https://2025.metagame.games/schedule?locations=the-family-room&day=1"
              target="_blank"
              rel="noopener noreferrer"
              className={BODY_LINK}
            >
              last year
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
