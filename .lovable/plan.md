# The Two-Exposure Simulation — November 1 under both models

Documentation only. No code, schema, route, UI, domain, canon, or work-order change.
The incoming material is filed as `SIMULATION` throughout — a business-sequencing
experiment run *outside* the build, per its own instruction. Nothing is promoted.

## The one question, answered first

**Can the same platform architecture support both launch strategies without
structural change?**

`ASSERTION` — Yes. And the reason is already in the corpus, three times over:

1. **The doors are data, not structure.** ADR-019: one engine, many personas. Model A
   and Model B differ only in *which doors are lit on November 1* — which persona
   records are published, which screens are exposed, which entity is visibly
   operating a workflow. Those are configuration and sequencing choices, not
   architecture.
2. **The Screen Book already separates a screen from its exposure.** Every page is an
   authorized container with permitted roles and variants. "Which screens are exposed
   first" is the Screen Book's own vocabulary. Model B is a *read* of the Screen Book,
   not a rewrite of it.
3. **Part 3's finding cuts in Model B's favor.** The missing entity dimension means
   multi-entity money cannot move yet. Model A's public burden leans on exactly the
   dimension that does not exist. Model B — announcement, book, demonstration,
   Kimosabe-facing experience — requires *fewer* entities in public, so it asks less
   of the one thing the platform hasn't built. The platform supports both; it
   supports B *today* more cheaply than A.

So: same architecture, no structural change, and the simulation is testing the
*exposure* layer — the one layer that was designed to vary.

## What is genuinely new

- `SIMULATION` — **Model B as a named alternate.** November 1 as controlled reveal
  (announcement / book / demonstration / challenge / opening chapter), Prepare
  America as book-mission-media property, RRCA relieved of carrying the full public
  burden, Kimosabe as the safer product-facing experience, post-November-1 as
  deliberate runway rather than failure recovery.
- `ASSERTION` — **The two assumptions carrying the risk are now named, which is
  itself the deliverable.** (a) "November 1 succeeds as announcement even if the
  operating components aren't ready" and (b) "the Siteforum codebase bridges the
  implementation gap." Both were load-bearing and unexamined. Naming them as
  unguaranteed is the real work of this message.
- `ASSERTION` — **Kimosabe has crossed from door to product.** Part 1 said the doors
  aren't the architecture; this message says Kimosabe is becoming *easier to
  understand as a product-facing experience emerging from the platform*. That is a
  stronger claim than ADR-019's peer-of-doors framing and worth recording as such.

## What the corpus already held

- One engine, many personas — ADR-019.
- Public sites are acquisition surfaces, not architecture — PLATFORM-GENERALIZATION §1.
- Prepare America as one Expression, never the Source — ADR-020.
- The umbrella question — ADR-023 (C40), still open and untouched here.
- Entity dimension absent — PLATFORM-GENERALIZATION §1, verified against the schema.

## Conflicts, stated plainly

1. **Model B against the current public narrative.** The site today implies RRCA +
   event + multi-brand rollout. Model B doesn't change the architecture but it does
   change what the public surfaces *promise*. If B were ever chosen, the public copy
   is the thing that moves — a C0/C1 exposure decision, not a build decision.
2. **"Kimosabe as product" against the engagement-layer gaps.** ENGAGEMENT-LAYER
   holds the Feed and Player honestly empty and the habit loop undesigned. A
   Kimosabe-carried November 1 leans on the one layer with no ancestor. Noted, not
   resolved — it is the same finding arriving from the business side now.
3. **Siteforum as bridge.** The corpus has no verified inventory of what Siteforum
   actually provides. Assumption (b) cannot be tested from inside this codebase.

## Classification

| Idea | Label |
|---|---|
| Two exposure models, one platform | SIMULATION — as instructed |
| Architecture supports both without structural change | ASSERTION |
| Model B asks less of the missing entity dimension | ASSERTION — follows from the verified schema finding |
| Nov 1 as announcement even if components unready | HYPOTHESIS — now named as unguaranteed |
| Siteforum bridges the implementation gap | HYPOTHESIS — unverifiable from this corpus |
| Kimosabe as the product-facing experience | ASSERTION — stronger than ADR-019's framing |
| Post-Nov-1 as deliberate runway | SIMULATION |

## Files this pass will write

- `docs/strategy/EXPOSURE-SIMULATION.md` — new C2 note: the two models, the answer,
  the named assumptions, the conflicts. Every claim labelled; the simulation held as
  SIMULATION, never canon.
- `docs/work/OPEN-ITEMS.md` — new register lines: the founder's ruling between Model
  A and Model B (or a hybrid); a verified inventory of what Siteforum actually
  provides; which screens/personas would be exposed under each model (a Screen Book
  read, not a rewrite); the Kimosabe-carried-launch dependency on the engagement layer.
- `docs/00-START-HERE.md` — manifest line for the new note.
- `docs/work/SPRINTS.md` — Sprint 2.17, documentation only.
- Backlog board mirror of every new register line, same IDs, same turn.

No ADR this pass: a simulation is not a decision, and DECISIONS.md is for rulings.
If and when the founder rules A, B, or hybrid, *that* ruling gets the ADR.

## Out of scope

No code, no UI, no route, no schema, no domain change, no copy change on any public
surface, no change to the locked work order, no re-parenting of any brand or entity.
The current plan — RRCA case study, Prepare America face, November 1 milestone —
remains exactly where it stands.
