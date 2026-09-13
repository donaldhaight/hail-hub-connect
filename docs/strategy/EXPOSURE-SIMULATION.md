# The Two-Exposure Simulation — November 1 under both models

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-13
> A business-sequencing simulation run *outside* the build. Filed as `SIMULATION`
> per its own instruction: nothing here is canon, and the current plan — RRCA case
> study, Prepare America face, November 1 milestone — stands untouched.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

---

## 1. The question, answered

The simulation asks one question: **can the same platform architecture support both
launch strategies without structural change?**

`ASSERTION` — Yes. The reason is already in the corpus, three times over.

1. **The doors are data, not structure.** ADR-019: one engine, many personas. Model A
   and Model B differ only in *which doors are lit on November 1* — which persona
   records are published, which screens are exposed, which entity is visibly
   operating a workflow. Those are configuration and sequencing choices, not
   architecture.
2. **The Screen Book already separates a screen from its exposure.** Every page is an
   authorized container with permitted roles and variants (ADR-021). "Which screens
   are exposed first" is the Screen Book's own vocabulary. Model B is a *read* of the
   Screen Book, not a rewrite of it.
3. **Part 3's finding cuts in Model B's favor.** The missing entity dimension
   ([`PLATFORM-GENERALIZATION.md`](PLATFORM-GENERALIZATION.md) §1, verified against
   the live schema) means multi-entity money cannot move yet. Model A's public burden
   leans on exactly the dimension that does not exist. Model B — announcement, book,
   demonstration, Kimosabe-facing experience — requires *fewer* entities in public,
   so it asks less of the one thing the platform has not built.

`ASSERTION` — Same architecture, no structural change. What the simulation is
actually testing is the *exposure* layer — the one layer that was designed to vary.

## 2. The two models

`SIMULATION` — both, as instructed. Neither is canon; the founder has not ruled.

**Model A — current model.** Public RRCA case study + Prepare America event +
multi-entity / multi-brand rollout. November 1 carries operational dependency: RRCA,
multiple legal entities, multiple brands, multiple websites, apps, contracts,
banking and accounting structures, Siteforum integration, event production, and a
coherent explanation of the whole system, all publicly ready at once.

**Model B — alternate sequencing.** November 1 becomes primarily an announcement,
book, demonstration, challenge, opening chapter, or controlled reveal. Prepare
America functions strongly as a book / mission / media property even if the full
live operating architecture is not publicly exposed. RRCA remains a real case study
but does not carry the full public burden. Kimosabe becomes the product-facing
experience that carries users forward. The period after November 1 becomes
deliberate runway toward the next market-facing milestone rather than failure
recovery.

## 3. What is genuinely new

- `SIMULATION` — Model B as a named alternate, filed whole.
- `ASSERTION` — **The two assumptions carrying the risk are now named, which is
  itself the deliverable.** (a) *November 1 succeeds as an announcement even if the
  operating components are not ready* and (b) *the Siteforum codebase bridges the
  implementation gap*. Both were load-bearing and unexamined. The simulation's own
  text declares neither guaranteed. Naming them is the real work of this pass.
- `ASSERTION` — **Kimosabe has crossed from door to product.** Part 1 said the doors
  are not the architecture; this simulation says Kimosabe is becoming *easier to
  understand as a product-facing experience emerging from the platform*. That is a
  stronger claim than ADR-019's peer-of-doors framing, and it is recorded as such —
  noted, not ruled.

## 4. What the corpus already held

- One engine, many personas — ADR-019, running.
- Public sites are acquisition surfaces, not architecture —
  `PLATFORM-GENERALIZATION.md` §1.
- Prepare America as one Expression, never the Source — ADR-020.
- The umbrella question — ADR-023 (C40), still open and untouched by this pass.
- Entity dimension absent — `PLATFORM-GENERALIZATION.md` §1, verified against the
  schema 2026-09-13.

## 5. Conflicts, stated plainly

1. **Model B against the current public narrative.** The site today implies RRCA +
   event + multi-brand rollout. Model B does not change the architecture, but it
   changes what the public surfaces *promise*. If B were ever chosen, the public
   copy is the thing that moves — a C0/C1 exposure decision, not a build decision.
2. **"Kimosabe as product" against the engagement-layer gaps.**
   [`ENGAGEMENT-LAYER.md`](ENGAGEMENT-LAYER.md) holds the Feed and Player honestly
   empty and the habit loop undesigned. A Kimosabe-carried November 1 leans on the
   one layer with no ancestor. This is the 2026-09-12 finding arriving a second
   time, now from the business side — evidence it is a real gate.
3. **Siteforum as bridge.** The corpus has no verified inventory of what Siteforum
   actually provides. Assumption (b) cannot be tested from inside this codebase.

## 6. Classification

| Idea | Label |
|---|---|
| Two exposure models, one platform | SIMULATION — as instructed |
| Architecture supports both without structural change | ASSERTION |
| Model B asks less of the missing entity dimension | ASSERTION — follows from the verified schema finding |
| Nov 1 succeeds as announcement even if components unready | HYPOTHESIS — now named as unguaranteed |
| Siteforum bridges the implementation gap | HYPOTHESIS — unverifiable from this corpus |
| Kimosabe as the product-facing experience | ASSERTION — stronger than ADR-019's framing |
| Post-Nov-1 as deliberate runway, not failure recovery | SIMULATION |

## 7. What this pass did not do

No ADR — a simulation is not a decision, and `docs/law/DECISIONS.md` is for
rulings. If and when the founder rules A, B, or a hybrid, *that* ruling gets the
ADR. No code, UI, route, schema, domain, or public-copy change. The locked work
order — Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus
mapping → API / MCP — did not move. The Screen Book and the application logic stand
exactly where they were; at most, a future ruling would choose *which* screens are
exposed first, which is the Screen Book's own dial.
