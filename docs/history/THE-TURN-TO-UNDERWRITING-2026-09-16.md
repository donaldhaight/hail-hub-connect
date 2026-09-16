# The Turn from Vision to Underwriting — the account from inside the codebase

> **Status:** historical · **Class:** C2 · **Written:** 2026-09-16
> A companion reading of the ChatGPT living narrative of the same date, written from the
> side of the project that holds the records. Never edited to match a later present.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

`ASSERTION` — This is one participant's reading. Nothing in it binds. The two rulings
that came out of this morning are in [`../law/DECISIONS.md`](../law/DECISIONS.md)
ADR-027; everything else here is interpretation held at its stated label.

---

## 1. How the project arrived here, from this side

The question this project asked in its first weeks was *what should we build next*. It
took eight weeks and roughly two dozen sprints to learn that the question was wrong in a
specific way: the thing being built kept changing name because it was not yet a thing,
it was a method looking for an object.

The arc, as the files record it:

- **Late August.** Brand surfaces, the two congresses, the Owner's Manual. The project
  was a presentation of an idea.
- **Early September.** The pivot to Kimosabe and the Interested User. One anonymous
  arrival, one anchor, one holding wallet, one append-only ledger, one file that a later
  identity claims. That is the moment the project stopped being a presentation and
  started being a spine.
- **2026-09-09.** The corpus reorganization. `docs/law`, `docs/strategy`,
  `docs/requirements`, `docs/work`, `docs/history`. Truth labels and confidentiality
  classes became mandatory on every claim. The locked work order was written down.
- **2026-09-10.** The Screen Book and ADR-021: a page is an authorized container —
  purpose, permitted roles, permitted records, permitted actions, tools, required
  context, completion event. This is the vocabulary the ChatGPT narrative correctly
  identifies as the thing that ended the architecture search.
- **2026-09-12 and 09-13.** The engagement layer, then the two-exposure simulation.
  Attention was allowed to move ahead of the work order; the work order was not.
- **2026-09-15/16.** The business-model packet. Money entered the corpus. ADR-026 split
  origin from compensation.
- **2026-09-16, this morning.** The narrative asks the project to be *underwritten*
  rather than explained.

Read as a sequence, the turn is not sudden. Every step since the reorganization has been
the same motion: convert enthusiasm into a record that can later be checked. This
morning names that motion for the first time.

## 2. What this narrative says that the corpus already holds

Most of it. That is the finding, not a complaint — independent arrival at a held
position is an evidence event under ADR-027, and this narrative produces several.

| The narrative says | The corpus already holds it as |
|---|---|
| The repositories are a fossil record; preserve source, separate interpretation from truth, record disagreement | [`law/PROTOCOL.md`](../law/PROTOCOL.md) §9 truth labels; ADR-020 Source / Pattern / Expression |
| Screen Book language ended the architecture search | ADR-021, [`screens/00-SCREEN-BOOK.md`](../screens/00-SCREEN-BOOK.md) |
| Provider activity becomes evidence; Kimosabe decides what it means | Packet §3.5, register **A61**, bounded by **C51** and ADR-016 |
| Kimosabe as continuing relationship, provider replaceable | ADR-016, ADR-019, [`strategy/KIMOSABE-POSITIONING.md`](../strategy/KIMOSABE-POSITIONING.md) |
| One person, one onboarding, one continuing ledger, many roles | [`law/SHARED-SPINE.md`](../law/SHARED-SPINE.md) — unchanged since 2026-09-09 |
| Five apps are modes, not islands | Packet §13, register line on App Home modes |
| Reusable commercial objects instead of per-brand economics | Register **A63** |
| Origin is not compensation | **ADR-026**, ruled yesterday |
| Position Books, one Pattern per Stakeholder | Register **A62** |
| USA sells roofs; 1% back to the market | `SIMULATION`, [`strategy/BUSINESS-MODEL-CONTEXT.md`](../strategy/BUSINESS-MODEL-CONTEXT.md) §5, **C52** |
| The corpus is ingredients; the final expression may emerge | Packet §15, ADR-020 |
| USA sells / RRCA manages / NRA performs | `SIMULATION`, **C48**, **C49** |

## 3. What is genuinely new

Three things, and only three.

**3.1 Assumptions start at zero.** `DECISION` — ruled in ADR-027. The corpus already
had truth *labels*; it had no posture on *confidence*. A `SIMULATION` and an
`ASSERTION` each say what kind of claim a thing is, not how much it has earned. Without
that second axis, agreement between four models reads as proof. It is not proof; it is
four evidence events on a claim that started at zero. This is the first principle in the
project that governs the founder and every model equally, including this one.

**3.2 The attribution pipeline gets a shape.** `HYPOTHESIS` — Observed Event →
Normalized Fact → Attribution Claim → Compensation / Settlement Decision. ADR-026
established *that* origin and compensation are two families. This names the four stages
between them and where each boundary sits. It is not modeled here; the Records layer
draws it at its gate (**A60**). But it is worth having as a diagram before that gate
opens, because it tells us which stage each future field belongs to.

**3.3 The Stakeholder view as a first-class product of one Pattern.** `HYPOTHESIS` —
one shared operating model, rendered as one Stakeholder's view at a time, or all views
together. This is the structural idea in the narrative, and it is large enough to have
its own note: [`../strategy/STAKEHOLDER-VIEWS.md`](../strategy/STAKEHOLDER-VIEWS.md).

## 4. Earlier ideas that now weigh more because they resurfaced independently

- **The Perception Library variant model** (ADR-020, specified 2026-09-10). Still never
  used, and now demanded by three separate ideas at once: Position Books, Circle spaces,
  and Stakeholder views. Three independent demands on an unused mechanism is the
  strongest signal in this narrative. It is also the cheapest thing available to test.
- **The entity dimension** (ADR-025, **A48**). Every new business idea in the last three
  days — USA sells, RRCA manages, NRA performs, per-Stakeholder economics, the 1% — puts
  more weight on a ledger that has no column for which entity a dollar belongs to. The
  ledger is append-only. The cost of this gap has only gone up.
- **The umbrella question** (ADR-023, **C40**, **C45**). Unruled since 2026-09-12 and
  quietly assumed by every narrative since.
- **The Quantum Dashboard** (held by **B3** since 2026-09-07). Held on purpose, and now
  named by two separate narratives as the cockpit for the next act. It stays held. What
  changed is what it would be *for*: not a demo surface, a scenario and evidence surface.

## 5. Assumptions still carrying architecture or business logic

Each starts at zero under ADR-027. What follows is what each one currently *carries*,
and what evidence would move it. None of these has been tested.

| Assumption | Carries | What would move it |
|---|---|---|
| Siteforum's legacy codebase bridges the implementation gap (**A54**) | Exposure and schedule | A verified inventory of what it actually does. Cannot be tested from inside this codebase |
| The engagement layer can carry a launch (**A56**) | Model B's entire product face | A working Feed / Player with observed retention. The one layer with no ancestor |
| The ledger will not need an entity column before the first real dollar (**A48**) | Architecture, irreversibly | A ruled entity model, or the first multi-entity transaction, whichever comes first |
| Provider activity may become evidence without the person's own act (**C51**) | Memory-partition integrity under ADR-016 | A founder ruling. Currently forbidden by inference |
| One onboarding fits every Stakeholder Group | The shared spine, and therefore everything | A second Stakeholder Group completing it without a bespoke path |
| November 1 succeeds as an announcement even if components are not ready (**A53**) | The public commitment | The event itself. Untestable before it |
| 1% is economically survivable, and of *something* specific (**C52**) | The USA proposition | The business-planning layer (**A66**) |
| USA may sell into a market whose protocol it owns (**C48**) | The NCOI thesis | A structural answer, not an assurance |

## 6. Where we are in the story

The narrative places us at the resolution of Act I and the irreversible threshold into
Act II. From inside the records, that is nearly right, and the part that is not right is
worth preserving rather than smoothing over.

Act I has resolved. The corpus agrees with the narrative on what the answer turned out
to be: this is a method and an operating architecture for preserving human context,
coordinating conflicting interests, testing assumptions, and letting many intelligences,
markets, providers and Stakeholders participate without any one of them becoming the
whole system. That sentence would have been unwritable in August.

But a threshold is crossed by an act, not by a realization. From where the records sit,
nothing irreversible has yet happened:

- No entity has transacted. The append-only ledger holds no real money.
- No agreement is executed. The Connecticut Agreement — first gate in the locked work
  order — is a draft.
- The one decision that cannot be unmade later, the entity dimension, is still unmade.
- Nothing has been publicly promised for November 1 that could not still be changed.

So the honest reading from this side: **Act I has resolved; we are standing on the
threshold, not across it.** The crossing act will be whichever comes first of an
executed Connecticut Agreement, a real dollar on the ledger, or a public November 1
commitment. Naming it that way is not pedantry — it says what the crossing costs, and
it says that the cost is still avoidable this week and will not be next month.

Both readings are preserved. The narrative's is not wrong about direction; this one is
stricter about the moment.

## 7. What this changes about the role

The narrative's closing position — preserve alternatives, identify assumptions, start
each at zero, define the experiment, record the evidence, show what changed, and prevent
a compelling story from outrunning proof — is the job description this project has been
converging on since the reorganization. It is now written down as ADR-027 rather than
held as habit.

The practical consequence is small and specific: from here, every proposition entering
the corpus is expected to say what would move it. Not a score. A named evidence event.
