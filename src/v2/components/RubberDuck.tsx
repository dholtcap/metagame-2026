// Custom children's-programming rail glyph: a rubber duck drawn as a hollow
// outline (left-facing, jutting bill, up-flipped tail) with a filled dark eye —
// matching the stroked lucide icons in the rail. 24×24 viewBox + currentColor
// so it inherits the rail's stroke weight and resting/active states.
type IconProps = { size?: number; strokeWidth?: number; className?: string };

export default function RubberDuck({
  size = 22,
  strokeWidth = 2,
  className,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M12.7 2.2 C 10.6 2.2 8.4 3.6 7.9 6.5 C 5.8 5.8 2.4 6.5 1 8.2 C 2.6 9.8 5.8 10.6 8.2 10.3 C 6.7 11.8 5.3 13.4 5.3 15.4 C 5.3 19.2 8.6 21.6 12.7 21.6 C 16.8 21.6 20.2 19.2 20.6 15.4 C 20.9 14 20.4 12.7 19.9 12 C 21.4 10.8 22.8 9.1 23.8 7.2 C 22.6 9.6 20.2 11 17.8 11 C 18.7 9.6 18.7 7.2 18 5.8 C 17 3.4 14.9 2.2 12.7 2.2 Z" />
      <circle cx="10.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
