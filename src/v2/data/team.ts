import type { StaticImageData } from "next/image";
import ben from "../../../public/images/team/ben.jpg";
import brendan from "../../../public/images/team/brendan.jpg";
import brian from "../../../public/images/team/brian.jpg";
import jisk from "../../../public/images/team/jisk.jpg";
import patrick from "../../../public/images/team/patrick.jpg";
import ricki from "../../../public/images/team/ricki.jpg";
import sparr from "../../../public/images/team/sparr.jpg";
import tommy from "../../../public/images/team/tommy.jpg";

// The people running the con (TEAM: on /team and in the home page's team
// carousel) and the advisors (ADVISORS: /team only), in display order. To add someone: append an entry and import their
// photo from public/images/team/ (800px JPEGs). Omit `photo` for an initials
// placeholder, `email` if they'd rather not be contacted directly.
export type Person = {
  name: string;
  title: string;
  photo?: StaticImageData;
  email?: string;
};

export const TEAM: Person[] = [
  {
    name: "Ricki Heicklen",
    title: "Game and Conference Master",
    photo: ricki,
    email: "ricki@metagame.games",
  },
  {
    name: "Ben Karcher",
    title: "Chief of Staff",
    photo: ben,
    email: "ben@metagame.games",
  },
  {
    name: "Brian Smiley",
    title: "Operations Lead",
    photo: brian,
    email: "brian@metagame.games",
  },
  { name: "Jisk Kopczynski", title: "Megagame Chief of Staff", photo: jisk },
  { name: "Sparr Risher", title: "Generalist", photo: sparr },
];

export const ADVISORS: Person[] = [
  { name: "Brendan Hurst", title: "Advisor", photo: brendan },
  { name: "Tommy Honton", title: "Advisor", photo: tommy },
  { name: "Patrick McKenzie", title: "Advisor", photo: patrick },
];
