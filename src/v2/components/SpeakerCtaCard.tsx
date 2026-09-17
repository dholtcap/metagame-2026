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
          {/* one cutout: a bob of hair around the head, flowing into the neck, on sloped shoulders */}
          <path d="M50 8c-16 0-23 11-23 24 0 11-1 22-5 30 3 4 12 4 18-1v4c-8 1-20 4-26 11-5 5-7 14-7 24h86c0-10-2-19-7-24-6-7-18-10-26-11v-4c6 5 15 5 18 1-4-8-5-19-5-30 0-13-7-24-23-24z" />
        </svg>
      </div>
      <div className="px-4 py-3 text-center">
        <h3 className={`${HEADING} text-lg text-navy`}>You?</h3>
        <p className="mt-1 font-space-mono text-xs tracking-[0.08em] text-ink/60 uppercase transition-colors group-hover:text-navy">
          <span className="underline underline-offset-2">
            Submit a proposal &rarr;
          </span>
        </p>
      </div>
    </a>
  );
}
