import type { ComponentType } from "react";
import {
  CalendarDays,
  Mail,
  MessageCircleQuestion,
  MessageSquareQuote,
  Moon,
  Puzzle,
  Ticket,
  UserRound,
} from "lucide-react";
import Mg2Die from "./Mg2Die";
import RubberDuck from "./RubberDuck";

// Single source of truth shared by the one-pager sections and the SideRail, so
// their ids/labels/icons can never drift. Section wrappers use `id`; the rail
// uses `id` for scroll-spy + smooth-scroll and `label` on hover.
type IconProps = { size?: number; strokeWidth?: number; className?: string };
export type Section = {
  id: string;
  label: string;
  icon: ComponentType<IconProps>;
};

// Home uses the custom MG2 die; the rest are lucide placeholders to refine.
export const SECTIONS: readonly Section[] = [
  { id: "home", label: "Home", icon: Mg2Die },
  { id: "about", label: "About", icon: Puzzle },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "speakers", label: "Speakers", icon: UserRound },
  { id: "children", label: "Children", icon: RubberDuck },
  { id: "night-market", label: "Night Market", icon: Moon },
  { id: "mailing", label: "Mailing List", icon: Mail },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "faq", label: "FAQ", icon: MessageCircleQuestion },
] as const;
