import Image from "next/image";
import { HIGHLIGHTS_2025 } from "@/v2/data/highlights-2025";
import { HEADING } from "./styles";

// One row per session type: photo on one side, the picked sessions with hosts
// on the other, sides alternating down the page. Rows stack (photo first) on
// phones.
export default function Highlights2025() {
  return (
    <div className="mt-12 flex flex-col gap-14 md:gap-16">
      {HIGHLIGHTS_2025.map((g, i) => (
        <div
          key={g.label}
          className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
        >
          <Image
            src={g.photo}
            alt={g.alt}
            className={`aspect-[3/2] w-full rounded-2xl border border-navy/10 object-cover shadow-[0_8px_24px_rgba(23,48,89,0.08)] ${
              i % 2 ? "md:order-2" : ""
            }`}
            sizes="(min-width: 768px) 560px, 100vw"
          />
          <div>
            <h3 className={`${HEADING} text-[clamp(24px,3vw,32px)] text-navy`}>
              {g.label}
            </h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {g.sessions.map((s) => (
                <li key={s.title} className="leading-snug">
                  <span className={`${HEADING} text-[17px] text-navy`}>
                    {s.title}
                  </span>
                  {s.hosts && (
                    <span className="block text-sm text-ink/60">{s.hosts}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
