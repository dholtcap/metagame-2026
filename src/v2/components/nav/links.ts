import type { ComponentType } from "react";
import { Award, HeartHandshake, History, Ticket, Users } from "lucide-react";
import RubberDuck from "../RubberDuck";
import Mg2Die from "./Mg2Die";

// The nav's pages, in order. Home is the logo itself (no link); the rest
// unfold from it. The active page's icon shows on the die's top face.
type IconProps = { size?: number; strokeWidth?: number; className?: string };
export type NavLink = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
};

export const NAV_LINKS: readonly NavLink[] = [
  { id: "home", label: "Home", href: "/", icon: Mg2Die },
  { id: "tickets", label: "Tickets", href: "/#tickets", icon: Ticket },
  { id: "last-year", label: "Last Year", href: "/last-year", icon: History },
  {
    id: "get-involved",
    label: "Get Involved",
    href: "/#get-involved",
    icon: HeartHandshake,
  },
  { id: "sponsor", label: "Sponsor", href: "/sponsor", icon: Award },
  { id: "childcare", label: "Childcare", href: "/childcare", icon: RubberDuck },
  { id: "team", label: "Team", href: "/team", icon: Users },
] as const;
