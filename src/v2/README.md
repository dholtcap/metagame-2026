# src/v2 — the site rewrite

Everything the new site renders lives here; the routes are in `src/app/(v2)/`.
The previous one-pager is untouched at `src/app/legacy/` (served at `/legacy`) and
its components still live in `src/components/`, `src/lib/`, `src/data/` — pull
things over from there as they're wanted, copying (not importing) so this folder
stays self-contained and the old tree can eventually be deleted.

Pulled over so far:

- `components/nav/` — the corner-die section nav (`ExpandingNav`, `LogoDice`,
  `Mg2Die`, `sections.ts`, `useMediaQuery`, `useSectionSpy`).
- `components/dice/` — the above-the-fold 3D dice wordmark (`Dice` + `dice3d/`).
  The dev-only take curation panel is included but switched off
  (`DICE_EDITOR` in `Dice.tsx`); when on, `/api/dev/keep-take` writes to this
  copy's `takes/` folder.
- `lib/dice-letter-paths.ts` — letter outlines shared by both of the above.

To add a section: add an entry to `components/nav/sections.ts` and give the
section's wrapper on the page a matching `id`.

## Stage: sprites, easter eggs, physics (`stage/`) — parked

**Puzzle in progress, not mounted.** Nothing imports `stage/`, so none of it
ships; the layout comment says how to re-enable it.

The page is a game board. `Stage` wraps the whole layout and owns two
full-document overlay layers — `behind` (under the content, for things that
pop out from behind a panel) and `sprites` (over it). Everything in them is
positioned in **document pixels**, the same space the physics colliders use, so
a sprite's `translate()` and a paragraph's line boxes always agree. DOM, not
canvas, on purpose: hitboxes come straight from layout, so wrapping, zoom,
hover swells and FAQ expansions are consistent for free.

- `physics.ts` — pure Verlet rigid square + axis-aligned rect colliders. No DOM.
- `solids.ts` — decides what is solid. One rule list (`SOLID_RULES`) by
  selector; headings/paragraphs/list items are `text` (one collider per
  rendered line), buttons/links/images/footer are `box`. Override on any
  element with `data-solid="box" | "text" | "none"`; `none` also prunes the
  subtree. Fixed UI (the corner nav) carries `none`.
- `useSolids.ts` — keeps the collider snapshot fresh: rescans on resize,
  DOM mutation, and size changes of solid elements, and bumps a `version`
  only when geometry actually changed (sprites wake on it).
- `ScrollDie.tsx` — the resident die. Rests on the footer, feels the page
  scroll as a pseudo-force (scroll fast and stop → it hops), lands on text
  lines, falls when a platform re-wraps away. Click flicks it. Knobs at the
  top of the file (`SCROLL_GAIN`, gravity in `DEFAULT_MATERIAL`).
- `StageDebug.tsx` — add `?stage=debug` to the URL to outline every collider.

To add a sprite: make a client component, mount it in the layout's
`sprites` (or `behind`) prop, read `useStage().solids.current` for colliders
if it needs them, and position it with `pageRect(el)` from `solids.ts` when it
should anchor to a piece of the page. Sprites are `pointer-events: none` by
default; opt back in on the element that wants clicks.
