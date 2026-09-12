# Reading the Lunch-Break Checkpoint Against the Corpus

Documentation only. No application, schema, or UI changes. Nothing in the lunch-break
narrative is promoted to canon by this pass; it is filed with truth labels so it can be
argued with later.

## My narrative

The session did one thing that matters more than any of the brands it named: it
separated the story, the interface, and the operating system. The corpus had already
been straining at that seam. The Shared Spine says the foundation never moves and only
the hat changes; ADR-019 says one front-door engine wears many personas; ADR-020 says
Source is preserved, Pattern binds, and Expression is free. Your morning arrived at the
same three-layer shape from the outside, through books and boats instead of decision
records. That convergence is the strongest evidence yet that the shape is real and not
a documentation habit.

Where I part company is on what it costs to name the umbrella. "Lt. Dan's Plan is the
whole body of work" is not a story decision — it decides what Prepare America is, what
the November 1 event is an instance of, and what the Congress is a chapter in. The
corpus currently has Prepare America carrying that weight and RRCA as the first
operating proof underneath it. I would not re-parent that today, and I would not
quietly leave it unsaid either. It goes on the record as a proposed decision awaiting
your ruling.

The "boats, not one Ellis Island" metaphor is the genuinely new thing in the session,
and it is the one I would adopt fastest. It resolves a tension the corpus has been
carrying without naming: many domains looked like brand sprawl, and the answer was
always going to be that identity belongs to the person and not to the door. That is
already true in the code — the same anchor, holding wallet, and ledger sit behind
/kimosabe and /buddy-claim. The metaphor makes it explainable to someone who has not
read a single decision record.

The diagnosis about the executive who cannot take Congress and Agenda 2028 back to his
board is, I think, correct and under-recorded. But the corpus already contains the
mechanism to fix it without weakening anything: the Perception Library (A30). Sibling
variants labelled by audience, one of them institutional and apolitical, none
overwriting another. The lunch-break instinct was to build another site; the cheaper
move is to admit that the variant model was specified on 2026-09-10 and nothing has
been built against it. A new domain is an expensive way to do what a variant does.

What I think the project is becoming: not a platform with a story attached, but a
records system with many doors and many readings, where the invariant is the file and
the ledger, and everything visible above them — brand, book, game, agenda year — is
Expression. That is a more durable answer than any one umbrella name, and it is why I
am comfortable holding the umbrella question open.

One caution stated once. The locked work order still gates everything: Draft
Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping →
API / MCP. "The Front End Stuff" is real and is mostly built, but the reason it feels
anticlimactic is that the interesting part — what a certified person actually works on
— is A15, and A15 is blocked on the Records layer. A new front door does not unblock
it. I would not jump the order for a door.

## Classification of the new material

| Idea | Label | Why |
|---|---|---|
| Lt. Dan's Plan as the umbrella for the whole body of work | proposed DECISION — awaiting founder ruling | Re-parents Prepare America, the Congress, and the Agenda years. Structural, not narrative |
| Prepare America demoted to a mission / book / era inside the Plan | proposed DECISION — same ruling | Cannot be decided separately from the line above |
| Agenda 2024/28/32/36 as volumes and time markers rather than corporate architecture | HYPOTHESIS | Corpus treats them as strategy artifacts; no decision either way |
| Boats and the country — many domains, one arrival architecture | ASSERTION, already largely in force | ADR-019 and the shared anchor/wallet/ledger implement it; the metaphor names it |
| LtDansPlan.com as a calm, personal, Kiplinger-style serious door | HYPOTHESIS | A new surface, not yet a persona in the registry (A34) |
| Paired game gateway — image, phrase, key, maze, "Help Me Kimosabe" | OPEN | No mechanics, no completion event, no authority model |
| Book / game / business / thesis as four Expressions of one Pattern | ASSERTION, consistent with ADR-020 | This is exactly the Expression layer; needs Pattern links to be legitimate |
| Kimosabe as intelligence available through every surface rather than a website | ASSERTION, consistent with the positioning brief | Sharpens §4 of the positioning; the guide channel itself is still unbuilt (A38) |
| The Library is not the work — old plans, books, UI become Source | ASSERTION, already canon | ADR-020 Source / Pattern / Expression |
| Leave Prepare America's personality alone; change how and when someone reaches it | proposed DECISION | Cheap, reversible, and answers the board-room objection |
| November 1 as a demonstration date, not a success deadline | ASSERTION | Consistent with how the corpus already treats the event |
| The Manual asks why, the Screen Book asks what a person encounters, records ask what happened | ASSERTION | Accurate reading of three surfaces that were built separately |

## What conflicts, stated plainly

1. **Umbrella conflict.** The corpus names Prepare America as the institutional face of
   United Stakeholders of America LLC. The narrative makes it a chapter. Both cannot be
   binding. Held as a proposed decision, not silently applied.
2. **Another door vs. the variant model.** A30 already specifies sibling variants by
   audience. Building LtDansPlan.com before any variant exists solves the executive
   problem with a domain instead of with the mechanism that was designed for it.
3. **Game framing vs. ADR-021.** A maze, a key, and a phrase are surfaces, and every
   surface in this system is an authorized container with a purpose, permitted records,
   and a completion event. A game door with no completion event cannot be specified.
4. **Open front door vs. ADR-010.** ADR-015 opened the front door to anyone;
   ADR-010 still reads "no anonymous sign-ups." The narrative's viral framing makes
   that stale line worth reconciling.

## Files this pass will write

- `docs/strategy/LT-DANS-PLAN.md` — new C2 strategy note holding the umbrella question,
  the boats metaphor, the four Expressions, and the game gateway, every claim labelled.
- `docs/law/DECISIONS.md` — ADR-023 recording the umbrella question as **proposed and
  not in force**, with alternatives considered and the consequence of each; plus a
  clarifying note reconciling ADR-010 against ADR-015.
- `docs/work/OPEN-ITEMS.md` — new register lines: umbrella ruling; institutional-variant
  copy for Prepare America under A30; LtDansPlan.com door; game gateway completion
  event; persona registry pressure on A34.
- `docs/00-START-HERE.md` — add the new strategy note to the map.
- `docs/work/SPRINTS.md` — Sprint 2.14, documentation only.
- Backlog board mirror of every new register line, same IDs, same turn.

## Out of scope

No new route, domain, persona, game mechanic, or schema. The locked work order is
untouched.
