# The Progressive Knowledge Library and the Perception Library

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-10
> How meaning is stored once and rendered many ways without weakening what binds.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This document specifies. It does not build. No schema, table, index, or screen described
here exists, and none may be created ahead of the locked work order
(`Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping →
API / MCP`). What can proceed in parallel is the specification itself, because this is
presentation and knowledge architecture, not the operating object model.

---

## 1. The problem this solves

The system has one serious institutional face (PrepareAmerica) and a growing family of
simple, friendly, potentially viral front doors (Kimosabe.AI, Buddy Claim, and whatever
comes next). They share one codebase, one identity, one file, one wallet, one ledger.

`ASSERTION` — Without a deliberate structure, that arrangement decays in one of two
directions: either every door drifts into its own copy of the truth, or the copy is
frozen so hard that nothing can ever be said in a new voice. The library exists so the
obligation is preserved exactly *and* the expression is free to change.

## 2. The three layers

`DECISION` (ADR-020)

| Layer | Holds | Mutability | Binds? |
|---|---|---|---|
| **Source** | Original documents, screenshots, logic, narrative, legacy screens, dated correspondence — as written | Never edited. Corrections are new Source, dated. | Yes, as evidence |
| **Pattern** | The extracted purpose, workflow, rules, roles, permissions, states, obligations and lessons a Source carries | Revised only by a recorded decision | **Yes. Pattern is the obligation.** |
| **Expression** | Alternative copy, layouts, conversations, lessons, games, adaptive interfaces | Freely added; siblings accumulate | **Never** |

Three rules follow, and they are the whole point of the structure:

1. **Every Expression names the Pattern it expresses.** An Expression that cannot be
   traced to a Pattern is a defect, not a draft.
2. **An Expression may never contradict its Pattern.** It may shorten, dramatize,
   simplify, illustrate or gamify. It may not add an obligation, remove one, or restate
   one loosely enough to change it.
3. **Pattern does not overwrite Source; Expression does not overwrite Pattern.** The
   layers accumulate downward. Nothing above is edited to match anything below.

Legacy ClaimExpress / Siteforum material is the founding case: the screens are Source,
the operating rules they encode are Pattern, and whatever we build in 2026 is Expression.
*Preserve obligations exactly. Use historical interfaces as guidance. Let presentation
evolve.*

## 3. The Perception Library

`DECISION` (ADR-020) — Important ideas have more than one true rendering. The Perception
Library holds them as **siblings**. One never overwrites another, and none of them is
"the real one" — the Pattern is the real one.

### Variant facets

Each Expression variant carries:

| Facet | Example values |
|---|---|
| Audience | property owner · ISR · licensed contractor · counsel · capital · government · founder |
| Persona | kimosabe · buddy-claim · prepareamerica · (future) |
| Moment | first arrival · mid-task · after a loss · post-storm · review · closeout |
| Mood | plain · inviting · institutional · provocative · humorous · dramatic |
| Purpose | orient · instruct · persuade · reassure · warn · record |
| Intensity | 1 (understated) … 5 (loud) |

And, non-negotiably, the two the corpus already requires everywhere:

| Facet | Values |
|---|---|
| **Truth label** | `FACT` · `ASSERTION` · `DECISION` · `HYPOTHESIS` · `SIMULATION` · `OPEN` |
| **Confidentiality class** | `C0` · `C1` · `C2` · `C3` · `C4` |

### Selection rules

`DECISION` — Four rules govern which sibling is served.

1. **Class ceiling.** A variant is only servable into a surface at or above its class. A
   `C1` rendering never reaches a `C0` page. This is checked at selection, not at
   authoring.
2. **Band 3 is out of reach.** No variant of storm targeting, kill-zone or fringe
   tagging, carrier routes, ghost profiles, offer generation or outreach sequencing is
   servable to any non-founder surface, in any mood, at any intensity. An adaptive
   generator is the most likely thing in this system to leak method inside an inviting
   rendering; the ceiling is enforced on the variant, never on the wording.
3. **Truth labels survive the rendering.** A dramatized `HYPOTHESIS` is still a
   hypothesis and is presented as one.
4. **Selection is recorded.** Which variant, for whom, why, and when. Adaptive
   presentation is otherwise the only part of the system with no audit trail, which
   would contradict the append-only posture the whole platform is sold on.

### What is not settled

The three questions raised at the 2026-09-10 reconciliation are recorded as open
(C37–C39 in the register) and are **not** decided here:

- How far the "never performs personality" red line moves to admit humor and drama.
- Which adaptation signals may persist and which are session-local.
- Whether an Expression could ever become authoritative. The working position in this
  document is **no**; confirming it is a founder decision.

## 4. The authorized container

`DECISION` (ADR-021) — A page or view is not a fixed arrangement of content. It is an
**authorized container** with eight declared facets:

| Facet | Answers |
|---|---|
| Purpose | Why this container exists, in one line |
| Permitted roles | Which roles may open it |
| Permitted records | Which records may appear inside it |
| Permitted actions | What may be done here |
| Available tools | What the guide may operate on the person's behalf |
| Required context | What must be known before it can render |
| Presentation options | Which Expression variants are admissible |
| Completion event | What ends the work this container holds |

This is the shape of a decision the corpus already made: Nav, Search, Add, Role Settings
and Account Settings were deliberately left undefined as *extension points filled role by
role* (C14), and each role area is a proven lock with an unfurnished room behind it
(register D1). The container definition is the missing declaration format for those
rooms, not a redesign of them.

Two invariants ride with it:

- **Authority is unchanged.** Permitted roles and permitted records are evaluated under
  `Role + applicable Relationship + applicable Assignment`, record-scoped. A container
  declares intent; it never becomes the access check. Presentation must never bypass the
  permission model.
- **Completion events depend on the task engine.** `State + Need → Task` does not exist
  yet (register A25), so most containers have nothing to complete against today. The
  facet is declared now so the first task migration is cut with it in view.

## 5. Retrieval

`ASSERTION` — The corpus is already chunkable: `docs/00-START-HERE.md` is the manifest
and every document carries status, class and revision date. Nothing indexes, retrieves,
or serves it.

When a retrieval layer is built it inherits two constraints that already exist:

- **Class inheritance.** An index inherits each document's class; a `C4` document is
  never retrievable into a `C2` surface.
- **Partition scope.** A retrieval index is scoped to one Kimosabe memory partition and
  never spans them (ADR-016). Crossing a partition requires the person's act, never an
  inference — which is exactly the pressure point adaptive presentation puts on the rule.

## 6. Related

- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-016 (memory partitions), ADR-019 (one
  engine, many personas), ADR-020, ADR-021.
- [`law/PROTOCOL.md`](../law/PROTOCOL.md) — truth labels, confidentiality classes, the
  four-boundary redaction map.
- [`law/ARCHITECTURE.md`](../law/ARCHITECTURE.md) — agent surfaces, memory partitions.
- [`strategy/KIMOSABE-POSITIONING.md`](../strategy/KIMOSABE-POSITIONING.md) — voice and
  the red lines the Perception Library presses against.
- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) — A29–A35, C37–C39.
