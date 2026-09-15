import Image from "next/image";
import { HIGHLIGHTS_2025 } from "@/v2/data/highlights-2025";
import { EYEBROW, HEADING } from "./styles";

// One card per session type: a photo, then the picked sessions with hosts.
// Two columns from md so each photo keeps some size; one column on phones.
export default function Highlights2025() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {HIGHLIGHTS_2025.map((g) => (
        <div
          key={g.label}
          className="overflow-hidden rounded-2xl border border-navy/[0.16] bg-white shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
        >
          <Image
            src={g.photo}
            alt={g.alt}
            className="aspect-[3/2] w-full object-cover"
            sizes="(min-width: 768px) 570px, 100vw"
          />
          <div className="p-7">
            <h3 className={`${EYEBROW} text-base text-meeple`}>{g.label}</h3>
            <ul className="mt-4 flex flex-col gap-3">
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
