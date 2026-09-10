import type { Rect } from "./physics";

// What on the page is solid, decided here in one place so components never
// have to know the stage exists. Rules match by selector; a `data-solid`
// attribute on an element overrides the rule for it and its subtree:
//   data-solid="box"  — the element's border box is one collider
//   data-solid="text" — each rendered line of text inside is a collider
//                       (wrapping-accurate: rects come from the line boxes)
//   data-solid="none" — not solid, and nothing inside it is either
// Colliders are document-space rects, so fixed/sticky UI (the corner nav)
// must carry data-solid="none" or it becomes a wall that moves with scroll.
export type SolidMode = "box" | "text" | "none";

export const SOLID_RULES: { selector: string; mode: SolidMode }[] = [
  { selector: "h1, h2, h3, h4, p, li, blockquote", mode: "text" },
  { selector: "button, a, img, input, select, textarea, footer", mode: "box" },
];

// Rects smaller than this on either axis are noise (empty spans, zero-height
// line boxes around whitespace) and are dropped.
const MIN_SIZE = 2;

const isMode = (v: string | null): v is SolidMode =>
  v === "box" || v === "text" || v === "none";

function modeFor(el: Element): SolidMode | null {
  const own = el.getAttribute("data-solid");
  if (isMode(own)) return own;
  for (const rule of SOLID_RULES)
    if (el.matches(rule.selector)) return rule.mode;
  return null;
}

function pushRect(out: Rect[], r: DOMRect, sx: number, sy: number) {
  if (r.width < MIN_SIZE || r.height < MIN_SIZE) return;
  out.push({ x: r.left + sx, y: r.top + sy, w: r.width, h: r.height });
}

function textRects(el: Element, out: Rect[], sx: number, sy: number) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) pushRect(out, r, sx, sy);
  }
}

// Walk `root` once, top-down. The first matching ancestor claims a subtree:
// a solid box swallows its descendants (their rects would be redundant), a
// text element yields line rects, and `none` prunes the branch.
// `onSolid` receives each element that produced rects, so callers can watch
// exactly those for size changes.
export function collectSolids(
  root: Element,
  onSolid?: (el: Element) => void,
): Rect[] {
  const out: Rect[] = [];
  const sx = window.scrollX;
  const sy = window.scrollY;
  const visit = (el: Element) => {
    const mode = modeFor(el);
    if (mode === "none") return;
    if (mode === "box") {
      pushRect(out, el.getBoundingClientRect(), sx, sy);
      onSolid?.(el);
      return;
    }
    if (mode === "text") {
      textRects(el, out, sx, sy);
      onSolid?.(el);
      return;
    }
    for (const child of el.children) visit(child);
  };
  visit(root);
  return out;
}

// Rect of an element in document coordinates — for sprites that anchor to a
// piece of the page (pop out from behind this panel, perch on that heading).
export function pageRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + window.scrollX,
    y: r.top + window.scrollY,
    w: r.width,
    h: r.height,
  };
}
