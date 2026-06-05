@AGENTS.md

# Metagame 2026 site

The new Metagame site. Fresh start — **don't copy from the 2025 site** (it lives at
`../metagame_2025` as reference only; you don't need to go exploring it).

- **Stack:** Next.js 16 (App Router, `src/`) + Tailwind v4 + TypeScript, pnpm.
- **Repo:** standalone `git@github.com:tradingbootcamp/metagame-2026.git` (separate from the
  2025 repo `tradingbootcamp/metagame`).
- **Right now it's just a splash page** — `Metagame 2026` heading + email capture form.

## Email signup

The form posts to `/api/signup` (`src/app/api/signup/route.ts`), which currently **no-ops**
(validates + logs). The real destination is **Airtable** — wiring is a TODO pending the
base/table details from Brian.

## Worktrees & parallel work

This repo follows the shared `~/Arbor/` worktree convention (see `~/Arbor/CLAUDE.md`):
feature work goes in worktrees under the **shared** `~/Arbor/working-projects/<feature-slug>/`,
branched off `origin/main`, torn down with `~/Arbor/cleanup-worktree.sh`.

Metagame-specific setup that differs from the arbiter repos:

- Each worktree needs its own `pnpm install` (node_modules aren't shared).
- No env vars are required yet (none until Airtable is wired). Add an env template here and
  reference it in this file once that lands.
- `pnpm dev` starts the dev server, auto-incrementing from port 3000 if it's taken. Read the
  actual port from startup output before surfacing a localhost link.
