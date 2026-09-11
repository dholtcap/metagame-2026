import PersonCard from "./PersonCard";
import SnapCarousel from "./SnapCarousel";
import { TEAM } from "@/v2/data/team";

// The team, one card at a time — the home page's About Us companion.
export default function TeamCarousel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <SnapCarousel
      label="team member"
      // Gutters either side so the arrows sit beside the card, not on it.
      className={`px-12 ${className}`}
      arrowsOutside
      trackClassName="py-1"
      slides={TEAM.map((person) => (
        <PersonCard key={person.name} {...person} compact />
      ))}
    />
  );
}
