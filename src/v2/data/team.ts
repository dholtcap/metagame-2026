import type { StaticImageData } from "next/image";

// The people running the con, in display order on /team. To add someone:
// append an entry and import their photo from public/images/team/ (800px
// JPEGs; ben, jisk, ricki and sparr are already there). Omit `photo` for an
// initials placeholder.
export type Person = {
  name: string;
  title: string;
  photo?: StaticImageData;
};

export const TEAM: Person[] = [
  // TODO(team): titles and photos
  { name: "Ricki Heicklen", title: "[Placeholder title]" },
  { name: "Ben Karcher", title: "[Placeholder title]" },
];
