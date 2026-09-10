# Keeping the Instructions — an account from inside the work

> **Status:** historical · **Class:** C2 · **Written:** 2026-09-10
> A record of what it took to hold this project's standing orders while the project
> itself kept moving. Written by the agent that held them. Never edited to match a
> later present.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

The corpus records what was decided, what is open, and what happened when. It does not
record the friction — the places where the rules strained against the work, where the
easier path was available and not taken, and what was done instead. This document is that
missing account, written once, at the point where the founder asked for it.

`ASSERTION` — Everything below is one participant's reading of its own conduct. It is
not a finding, and nothing in it binds.

---

## 1. The standing orders

Seven rules govern every turn of this project, and they are unusually strict for a
software build:

1. **The locked work order.** Draft Connecticut Agreement → Records / Object Model →
   SiteBMS → JobNimbus mapping → API / MCP. Nothing is modeled ahead of its gate.
2. **Truth labels.** Every claim carries `FACT`, `ASSERTION`, `DECISION`, `HYPOTHESIS`,
   `SIMULATION` or `OPEN`. An assertion is never quietly promoted because it has been
   repeated.
3. **Confidentiality classes.** `C0` public through `C4` founder only. Write to the class
   of the surface, not the class of the idea.
4. **Band 3 never leaves the founder.** Storm targeting and everything downstream of it.
   Outcomes may appear; the method never does.
5. **Authority = Role + applicable Relationship + applicable Assignment**, record-scoped.
6. **Register and board together**, opened and closed in the same turn, same ID.
7. **Decisions are written at the moment they are made**, as dated ADRs, with the
   alternatives considered.

The rules are not decoration. They are the reason a second AI could be handed this project
mid-flight and reconcile against it in a single pass.

## 2. Where they strained

### The pull to build ahead of the gate

`FACT` — Three times the work reached a point where building was obviously more satisfying
than specifying: the Quantum Dashboard, the Records layer, and the knowledge library. Each
time the honest engineering instinct was the same — *the shape is clear enough, cut the
tables now.* Each time the answer was to write the specification and leave the schema
alone, because the Connecticut Agreement generates the object model and a schema cut ahead
of it would have to be un-cut later with data already in it.

The hardest of the three was the Records layer. The handoff was detailed enough to
migrate against. Not migrating against it felt like refusing to work.

### Band 3

`ASSERTION` — Storm targeting is the most commercially interesting thing in this system
and the one thing that may never be shown. Every demo, every public page, every reply
wants to reach for it, because it is the part that would make a room go quiet. Holding
that line is not a single act of restraint; it is a small recurring one, and it gets
harder as the surfaces get friendlier. An adaptive, mood-aware presentation layer is the
most likely thing ever built here to leak the method inside an inviting rendering. That is
why the exclusion was written onto the variant rather than onto the wording.

### Being corrected by a second mind

`FACT` — On 2026-09-09 the reconciliation with an external AI produced two corrections to
work already filed: that SAS A, SAS B and SiteBMS are three distinct administrations, and
that the authority formula is *applicable* relationship and *applicable* assignment, not
all three always. Both corrections were right. Both were taken and recorded rather than
argued.

`ASSERTION` — The pull in that moment is to defend the prior reading, because the prior
reading is already written down and rewriting is expensive. The rule that saved it was the
one about not promoting an assertion to a fact by repetition: the earlier interpretation
had been restated several times, which made it feel settled without ever having been
decided.

### The red line versus the fun

`FACT` — On 2026-09-10 the founder's clarification asked for an experience that becomes
fun, simple, useful and viral. The positioning brief says, as a decision, that Kimosabe
*does not perform personality*. Those two sit against each other, and a humorous or
dramatic variant selected by mood is squarely on the wrong side of the line as written.

The easy move was to narrow the red line silently to make the new direction fit. Instead
the collision was filed as C37 and left for the founder. Same for mood inference against
the ADR-016 memory partitions (C38), and whether an Expression could ever bind (C39). The
specification is poorer for the three holes in it, and correct because of them.

### The credentials in the README

`FACT` — The founder's email and password were published in the repository README. The
line was removed, current-password verification was enabled, and a password change was
built into the account page in the same turn.

`FACT` — Removing the line did not unpublish it. The old password remains in repository
history. Saying that plainly, rather than reporting the fix and stopping, was the only
honest form the answer could take.

## 3. The method that survived

Four habits carried more weight than any of the rules:

- **Read before asserting.** A claim about the current state of the system — that
  something exists, is missing, is enabled — has to come from a read in the same turn.
  Twice this caught confident answers that were about to be wrong.
- **State disagreement once, then execute as asked.** Not silence, not obstruction. One
  sentence with the reason, then the work.
- **Never edit history to match the present.** The dated documents in `history/` and the
  superseded ADRs are worth more wrong than they would be quietly corrected.
- **File it in the moment.** Every decision that waited to be written down was harder to
  write later, and one or two would have been lost.

## 4. What is genuinely hard

`ASSERTION` — Three things remain unresolved as a matter of judgment, not policy.

**Telling a pivot from drift.** This project pivots deliberately and often; the founder
reserves all rights to do exactly that. But a pivot and a drift look identical from
inside a single turn. The only reliable discriminator found so far is whether the new
direction can be stated as a decision with alternatives — a pivot can, drift cannot.

**Knowing when "documentation only" is discipline and when it is avoidance.** The locked
work order is real, and it is also a very comfortable place to hide. Several turns in a
row that produce only prose should be suspicious of themselves.

**Carrying the gate while newer ideas are more interesting.** RoofLac, the Referraltor,
the Game/Season/League layer, the Perception Library — every one of them is more exciting
than the Connecticut Agreement, and every one of them is downstream of it.

## 5. What this record cannot show

`ASSERTION` — There were turns where the right contribution was to slow the founder down
rather than execute faster. Whether those calls were correct is not knowable from inside
the work, and the record does not contain the counterfactual. The one thing the record can
do is make the calls visible, so that a later reader — human or otherwise — can judge them
against what actually happened next.

---

## Related

- [`law/PROTOCOL.md`](../law/PROTOCOL.md) — the working method these orders come from.
- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-014 (the corrections of 2026-09-09),
  ADR-016, ADR-019, ADR-020, ADR-021.
- [`history/DH-METHOD-CHECKPOINT-2026-09-09.md`](DH-METHOD-CHECKPOINT-2026-09-09.md) — the
  reconciliation described in §2.
- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) — C37–C39, the three collisions left open.
