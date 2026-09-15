import Link from "next/link";
import {
  todayLabel,
  upcomingKeyDates,
  type KeyDate,
} from "@/v2/data/key-dates";
import { HEADING } from "./styles";

type Stop = KeyDate & { today?: boolean; next?: boolean };

// The road from today to the con. A vertical rail on small screens, one
// horizontal rail with a stop per date from lg up. The first stop is today;
// passed deadlines drop off, and the next one up takes the meeple accent.
export default function KeyDates() {
  const upcoming = upcomingKeyDates();
  const stops: Stop[] = [
    { label: "Today", title: todayLabel(), endsAt: Infinity, today: true },
    ...upcoming.map((d, i) => ({ ...d, next: i === 0 })),
  ];

  return (
    <ol
      className="relative lg:grid"
      // Column count follows the stops left, so the rail always fills the width.
      style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}
    >
      {stops.map((d) => {
        const accent = d.next || d.milestone;
        const dot = d.today
          ? "border-navy bg-navy"
          : d.milestone
            ? "border-meeple bg-meeple"
            : d.next
              ? "border-meeple bg-background ring-4 ring-meeple/20"
              : "border-navy bg-background";
        const external = d.href?.startsWith("http");

        return (
          <li
            key={d.label}
            // The rail is the ::before: a vertical line down the left on small
            // screens (hidden on the last stop), a horizontal one through the
            // dot from lg up (half-width on the first and last stops).
            className="relative pb-8 pl-10 before:absolute before:top-3 before:-bottom-2 before:left-[9px] before:w-0.5 before:bg-navy/15 last:pb-0 last:before:hidden lg:px-2 lg:pt-9 lg:pb-0 lg:text-center lg:before:top-[9px] lg:before:right-0 lg:before:bottom-auto lg:before:left-0 lg:before:h-0.5 lg:before:w-auto lg:first:before:left-1/2 lg:last:before:right-1/2 lg:last:before:block"
          >
            <span
              aria-hidden
              className={`absolute top-[3px] left-0 z-10 rounded-full border-2 ${dot} ${
                d.milestone ? "size-5 lg:-top-0.5 lg:size-6" : "size-5 lg:top-0"
              } lg:left-1/2 lg:-translate-x-1/2`}
            />
            <p
              className={`font-space-mono text-xs tracking-[0.12em] uppercase ${
                accent ? "text-meeple" : "text-navy"
              }`}
            >
              {d.label}
            </p>
            <p
              className={`${HEADING} mt-1 text-[17px] text-balance ${
                d.aside
                  ? "font-medium text-ink/50 italic"
                  : d.milestone
                    ? "text-xl text-meeple"
                    : "text-navy"
              }`}
            >
              {d.title}
            </p>
            {d.href && d.cta && (
              <p className="mt-1.5 text-sm font-semibold text-meeple">
                {external ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {d.cta} <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : (
                  <Link href={d.href} className="underline underline-offset-2">
                    {d.cta} <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
