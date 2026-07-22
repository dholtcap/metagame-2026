import { HEADING } from "./styles";

// The mock's "coming soon" card used by the schedule and speakers pages.
export default function HoldingPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[420px] place-items-center px-8 pt-16 pb-[88px]">
      <section
        aria-labelledby="page-title"
        className="w-full max-w-[720px] rounded-2xl border border-navy/[0.16] bg-sky p-[clamp(40px,7vw,72px)] text-center shadow-[0_12px_32px_rgba(23,48,89,0.1)]"
      >
        <p className="mb-3 font-space-mono text-[13px] tracking-[0.12em] text-meeple uppercase">
          Metagame 2026
        </p>
        <h1
          id="page-title"
          className={`${HEADING} mb-[18px] text-[clamp(32px,5vw,52px)] text-navy`}
        >
          {title}
        </h1>
        {children}
      </section>
    </div>
  );
}
