// Shared class strings for the mock design system (headings, eyebrows, fields).
// Buttons now live in the shadcn <Button> (src/components/ui/button.tsx) and the
// shared dark form field in the shadcn <Input> (src/components/ui/input.tsx).

export const HEADING =
  "font-grotesk font-bold leading-[1.05] tracking-[-0.01em]";

export const EYEBROW = "font-space-mono text-xl tracking-[0.12em] uppercase";

export const NEWSLETTER_LINK = "font-bold text-salmon";

// Light-background override for the shared <Input> (cream sections). The Input's
// own classes are the dark default; these win via tailwind-merge.
export const FIELD_LIGHT =
  "border-navy/20 bg-white text-ink placeholder:text-ink/40 focus:border-meeple";
