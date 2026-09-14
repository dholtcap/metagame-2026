import tommy from "../../../public/images/team/tommy.jpg";
import type { Person } from "./team";

// Featured speakers, in display order on the home page.
// TODO(team): photos (only Tommy's is in — the rest render initials
// placeholders) and a title line for each.
export const SPEAKERS: Person[] = [
  { name: "Chris Grace", title: "" },
  { name: "Caro Murphy", title: "" },
  { name: "Peih-Gee Law", title: "" },
  { name: "Tommy Honton", title: "", photo: tommy },
  { name: "Lexi Kohanski", title: "" },
  { name: "Amy Schneider", title: "" },
];
