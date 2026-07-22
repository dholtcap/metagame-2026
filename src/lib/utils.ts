import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn's class-merge helper: clsx resolves conditionals, tailwind-merge dedupes
// conflicting Tailwind classes so a caller's className reliably wins.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
