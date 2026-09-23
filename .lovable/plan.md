# Many Doors, One Platform — The Surface and Door Registry

The correction lands, and it corrects me as much as it corrects the chapter. My earlier
plan inherited the "retire the brand cards" reading, and ADR-028 recorded it. That was a
misread of the intention: the Doors were never meant to replace the house. Nothing gets
retired, redirected, renamed or rewritten in this work.

The real defect is not duplication. It is that no surface in the product declares what any
other surface is *for*. Intentional multiplicity, unlabelled, reads as accidental
duplication — which is exactly what happened to the founder in the Manual.

## 1. The Surface and Door Registry (the core of this work)

A founder-visible registry that names every public route and what job it performs. Built as
a content record plus one admin-side reading surface — no schema change, no route retired.

Each entry carries: route · surface type · audience · purpose · controlling source ·
call to action · destination · status · whether it captures arrival context · and its
relationship to other surfaces expressing the same venture.

Surface types, as the correction defines them:

| Type | Job |
|---|---|
| Movement | PrepareAmerica home — the mission, the event, the master invitation |
| Narrative | Briefing and case study — RRCA → correction → ClaimExpress → ClaimStore → USA |
| Architecture | Stakeholder geometry, roles, counties, governance |
| Brand card | `/b/<slug>` — the vertical, brand and domain *within* the architecture |
| Interest Door | `/claimstore` and its siblings — one market problem, one focused message |
| Capture | The Interested User routine — need and entry context |
| Platform | Kimosabe and App Home — the continuing relationship |
| Corpus | Manual, Screen Book, register — how the surfaces govern each other |

The registry states plainly where two surfaces share a venture name on purpose:
`/b/claimstore` is the architecture and financial-rails expression; `/claimstore` is the
market-positioning Interest Door. Both are correct. Both point into the same Interested
User routine. Neither supersedes the other.

## 2. The chapter — "Many Doors, One Platform"

A Manual chapter in the house style, carrying the founder's own words as the method:

> Many intentional Doors. Clearly named purposes. One continuing person. One shared platform.

It tells the story honestly: the founder published, went looking for the work, and could not
find it; the outside reading called it burial and recommended deletion; the founder
corrected both readers, because the assumption of duplication overrode the method. It
records the corrected completion rule:

> A new Door is complete when its distinct purpose is declared, its relationship to existing
> surfaces is documented, and it connects the Interested User to the shared platform without
> silently replacing another valid expression.

It also records what the seven positioning reports actually provide that the site did not:
a standalone market case per venture, a focused message for the person arriving through that
interest, a measurable acquisition Door, and a comparable foundation for later portfolio
valuation. They extend the site; they do not rewrite it.

## 3. Correct ADR-028 — without erasing it

ADR-028 recorded "brand cards retire into redirects." That was accepted in good faith and is
now superseded. Per the corpus rule, history is not edited to match the present: ADR-028
stays as written, and a new dated ADR-029 supersedes the retirement clause, records the
correction and the alternatives considered, and states the standing rule that no existing
public surface is retired, redirected or renamed without an explicit founder instruction.
`docs/strategy/SEVEN-DOORS.md` gets a correction note at the top and its route table
reworded from "retires into" to "coexists with, purposes declared."

## 4. File the source and the reading

- The attached chapter is filed verbatim as source material under `docs/history/`, with a
  header noting that its remedy was superseded by the founder's correction and that its
  observation — the new work was hard to find and its relationship unexplained — stands.
- The correction itself is filed alongside it as the ruling text.

## 5. Register and board

New lines in `docs/work/OPEN-ITEMS.md`, mirrored to the founder backlog board with the same
IDs in the same turn: the registry itself; the entry-context persistence still awaiting
authorization (the Doors cannot be measured until it lands); the naming question the
outside reading raised but did not settle — the five-message sequence, the seven venture
Doors, the founding stakeholder positions and the seventeen-role architecture are four
different things that currently borrow each other's numbers; and Buddy Claim held until the
registry is returned and reviewed.

## What is explicitly not done

No page is retired, redirected, renamed or rewritten. No navigation is changed. No brand
card is touched. No new Door is built. Nothing publishes. The Quantum Dashboard is untouched.
Buddy Claim waits for the registry to be reviewed first, as the correction instructs.

## Technical notes

- Registry: a new `src/content/surfaces.ts` content record (typed, no database), read by a
  founder-only page under the existing admin area, reusing existing table and badge
  components. No migration, no schema, no RLS change, no public route.
- Manual chapter: one row in the existing `manual_chapters` table via the established
  writing path — C1, part IV. Appears on the Manual index and print edition automatically.
- Docs: new `docs/history/` files for the source chapter and the correction; ADR-029
  appended to `docs/law/DECISIONS.md`; a correction note on `docs/strategy/SEVEN-DOORS.md`.
- `bunx tsgo --noEmit` must pass; the admin registry page verified to return 200.
