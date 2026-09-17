import { HEADING } from "./styles";

// The empty seat at the end of the speaker lineup: a silhouette in the same
// footprint as a PersonCard, inviting the reader to propose a session.
export default function SpeakerCtaCard({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-navy/40 bg-white shadow-[0_8px_24px_rgba(23,48,89,0.08)] transition-[border-color,box-shadow] hover:border-navy hover:shadow-[0_12px_28px_rgba(23,48,89,0.16)]"
    >
      <div
        aria-hidden
        className="relative flex aspect-square w-full items-end justify-center overflow-hidden bg-navy/[0.06]"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-[86%] w-[86%] fill-navy/15 transition-[fill] group-hover:fill-navy/25"
        >
          {/* head, neck, sloping shoulders: the classic anonymous-profile cutout */}
          <ellipse cx="50" cy="30" rx="17" ry="19" />
          <path d="M44 46h12v9c0 3 2 5 5 6 18 4 33 18 33 39H6c0-21 15-35 33-39 3-1 5-3 5-6z" />
        </svg>
        <span
          className={`${HEADING} absolute inset-0 flex items-center justify-center text-[8.5rem] leading-none text-navy/55 transition-colors group-hover:text-navy/80 sm:text-[11rem]`}
        >
          ?
        </span>
      </div>
      <div className="px-4 py-3 text-center">
        <h3 className={`${HEADING} text-lg text-navy`}>Your Name Here</h3>
        <p className="mt-1 font-space-mono text-xs tracking-[0.08em] text-ink/60 uppercase transition-colors group-hover:text-navy">
          <span className="underline underline-offset-2">
            Submit a proposal &rarr;
          </span>
        </p>
      </div>
    </a>
  );
}
