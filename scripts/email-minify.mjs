// Writes emails/announcement.min.html: the announcement email with its
// indentation collapsed. Same markup, renders identically, roughly half the
// bytes — Gmail clips messages past ~102 KB (hiding the footer and the
// unsubscribe link), and the readable source sits close to that once
// EmailOctopus adds link tracking. Paste the .min file into EmailOctopus;
// keep editing the readable one. Run:  pnpm email:min
import { readFileSync, writeFileSync } from "node:fs";

const src = "emails/announcement.html";
const out = "emails/announcement.min.html";

const html = readFileSync(src, "utf8");
// Newline + leading whitespace → one space. A single space (not nothing) so
// inline runs like `</b> <span>` keep their word gap.
const min = html.replace(/\n\s*/g, " ").trim() + "\n";
writeFileSync(out, min);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`${out}: ${kb(html)} KB → ${kb(min)} KB`);
