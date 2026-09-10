import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-8 text-ink/70">
      <div className="mx-auto max-w-[1180px] px-8 max-[760px]:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <a
            href="mailto:team@metagame.games"
            className="flex items-center gap-2.5 text-[15px] font-semibold text-navy hover:text-meeple"
          >
            <FaEnvelope aria-hidden />
            team@metagame.games
          </a>
          <div
            aria-label="Event details"
            className="flex items-center gap-3 font-space-mono text-xs tracking-[0.08em] text-ink/60 uppercase"
          >
            <span>November 6&ndash;8, 2026</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-brand-blue"
            />
            <span>Berkeley, California</span>
          </div>
        </div>
        <p className="mt-7 text-center text-[12.5px] text-ink/45">
          &copy; 2026 Metagame LLC{" · "}
          <Link href="/credits" className="underline hover:text-ink/70">
            Attributions
          </Link>
        </p>
      </div>
    </footer>
  );
}
