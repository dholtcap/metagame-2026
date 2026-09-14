import amy from "../../../public/images/speakers/amy_schneider.jpg";
import caro from "../../../public/images/speakers/caro_murphy.jpg";
import chris from "../../../public/images/speakers/chris_grace.jpg";
import lexi from "../../../public/images/speakers/lexi_kohanski.jpg";
import peihGee from "../../../public/images/speakers/peih_gee_law.jpg";
import tommy from "../../../public/images/team/tommy.jpg";
import type { Person } from "./team";

// Featured speakers, in display order on the home page.
// TODO(team): a title line for each speaker.
export const SPEAKERS: Person[] = [
  { name: "Chris Grace", title: "", photo: chris },
  { name: "Caro Murphy", title: "", photo: caro },
  { name: "Peih-Gee Law", title: "", photo: peihGee },
  { name: "Tommy Honton", title: "", photo: tommy },
  { name: "Lexi Kohanski", title: "", photo: lexi },
  { name: "Amy Schneider", title: "", photo: amy },
];
