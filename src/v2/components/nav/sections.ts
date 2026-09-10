import type { ComponentType } from "react";
import Mg2Die from "./Mg2Die";

// Single source of truth shared by the one-pager sections and the nav, so
// their ids/labels/icons can never drift. Section wrappers use `id`; the nav
// uses `id` for scroll-spy + smooth-scroll and `label` for the links.
type IconProps = { size?: number; strokeWidth?: number; className?: string };
export type Section = {
  id: string;
  label: string;
  icon: ComponentType<IconProps>;
};

// Home is the logo itself (no link). Add a section here *and* give its
// wrapper on the page a matching `id` — the nav picks it up automatically.
export const SECTIONS: readonly Section[] = [
  { id: "home", label: "Home", icon: Mg2Die },
] as const;
