// Quote cards, three across on wide screens and stacked on narrow ones.
export default function Testimonials({
  items,
  className = "",
}: {
  items: { quote: string; name: string }[];
  className?: string;
}) {
  return (
    <ul className={`grid min-w-0 gap-5 min-[900px]:grid-cols-3 ${className}`}>
      {items.map(({ quote, name }) => (
        <li
          key={name}
          className="min-w-0 rounded-[14px] border border-navy/[0.16] bg-white px-6 py-[26px] shadow-[0_8px_24px_rgba(23,48,89,0.08)]"
        >
          <blockquote className="mb-[18px] text-[15px] text-ink/80">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p className="text-sm font-semibold text-meeple">&mdash; {name}</p>
        </li>
      ))}
    </ul>
  );
}
