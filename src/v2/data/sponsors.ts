import type { StaticImageData } from "next/image";
import franciscoSan from "../../../public/images/sponsors/francisco_san_logo.png";
import manifund from "../../../public/images/sponsors/manifund_logo.png";
import rogueSignal from "../../../public/images/sponsors/rogue_signal/rogue_signal_horiz.svg";

export type Sponsor = {
  name: string;
  url: string;
  logo: StaticImageData;
};

// Sponsors by tier, each tier in display order. Gold logos render larger
// than Patron ones on the home page's sponsors section.
export const GOLD_SPONSORS: Sponsor[] = [
  { name: "Rogue Signal", url: "https://roguesignal.io", logo: rogueSignal },
];

export const PATRON_SPONSORS: Sponsor[] = [
  {
    name: "Francisco San",
    url: "https://franciscosan.org",
    logo: franciscoSan,
  },
  { name: "Manifund", url: "https://manifund.org", logo: manifund },
];
