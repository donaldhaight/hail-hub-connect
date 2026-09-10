# The Keeper's Account — a chapter on holding the line

A documentation-only addition: one written account of what it has actually been like to
maintain this project's standing instructions across many turns, many pivots, and a second
AI at the table. No application, database schema, or UI changes.

## Why it belongs in the corpus

The project already records *what* was decided (ADRs), *what is open* (the register), and
*what happened when* (history and sprints). Nothing records the friction of keeping those
rules intact while the work evolved — where the instructions strained, where they were
almost broken, and what was done instead. That is exactly the kind of material the corpus
says it exists to hold: if it is not written, it did not happen.

## What gets written

### 1. A history document: `docs/history/KEEPING-THE-INSTRUCTIONS-2026-09-10.md`
Status: historical · Class: C2 · never edited to match a later present.

Sections, written as narrative prose, each claim carrying its truth label:

- **The standing orders.** The rules that bind every turn — locked work order, truth
  labels, confidentiality classes, the Band 3 line, the authority formula, register and
  board together, decisions written at the moment they are made.
- **Where they strained.** Named, honest episodes:
  - the pull to build ahead of the gate (Quantum Dashboard, the Records layer, the
    knowledge library) and why each was specified rather than built;
  - the Band 3 pressure — storm targeting is the most interesting thing in the system and
    the one thing that may never be shown;
  - reconciliation with a second AI: being corrected on the three-administration model and
    on "all three must be true," and taking the correction rather than defending the prior
    reading;
  - the adaptive-interface clarification landing directly against the "never performs
    personality" red line, and refusing to quietly narrow the red line to fit;
  - the exposed founder credentials in the README — a security fact stated plainly, with
    the part that could not be undone said out loud.
- **The method that survived it.** Read before asserting. State disagreement once, then
  execute as asked. Never promote an assertion to a fact by repetition. Never edit history
  to match the present.
- **What is genuinely hard.** Distinguishing a founder pivot from drift; knowing when
  "documentation only" is discipline and when it is avoidance; carrying a locked sequence
  while five newer ideas are more exciting than the gate.
- **What the record cannot show.** The turns where the right answer was to slow the
  founder down, and whether that was ever the wrong call.

### 2. A Saga chapter in the Owner's Manual
One chapter in Part VI, following "The Second Mind", written in the manual's established
voice — narrative, scene-first rather than a rules inventory. Working title: **"The Keeper
of the Order"** (owner may retitle). It tells the same material as story: the machine that
argues, files, and then does as it is told; the difference between an agent that obeys and
one that is accountable.

### 3. Register and sprint lines
- A row in `docs/work/OPEN-ITEMS.md` and the matching founder backlog row, opened and
  closed together in the same turn.
- A short sprint entry in `docs/work/SPRINTS.md`.

## Explicitly out of scope

- No route, component, database schema, or migration changes.
- No change to the locked work order: Draft Connecticut Agreement → Records / Object Model
  → SiteBMS → JobNimbus mapping → API / MCP.
- No reopening of ADR-020, ADR-021, or the open questions C37–C39; the chapter reports the
  tension, it does not resolve it.

## Technical notes

The history document is a new markdown file added to the manifest in
`docs/00-START-HERE.md`. The Saga chapter is a row in `manual_chapters` (slug, part
`saga`, position after the existing chapter, truth label, body) — content only, no schema
change.
