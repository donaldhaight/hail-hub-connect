# Reading Part 3 Against the Corpus — the platform hidden inside the project

Documentation only. No code, schema, route, domain, UI, or work-order change. Nothing in
Part 3 is promoted to canon by this pass; it is filed with truth labels so it can be
argued with later.

## The question you asked, answered first

**Can the existing codebase naturally evolve into a multi-site, multi-entity, multi-role
platform while preserving the work already done?**

Split the question, because the three "multis" have three different answers.

**Multi-site: yes, and it is already true.** `src/content/personas.ts` holds a persona
registry; `src/components/frontdoor/FrontDoor.tsx` is one engine rendering many doors;
`/kimosabe` and `/buddy-claim` are two doors on one anchor, one wallet, one ledger, one
file. A sixth door costs a persona record and a route, not a platform. This is ADR-019
already in force, and Part 3's six-door thought experiment is that decision restated from
the visitor's side. Nothing new is required — which is itself the finding.

**Multi-role: yes, with a known ceiling.** The spine exists — identity, `user_roles`,
`has_role`, `role_catalog`, modules, enrollments, progress, wallet, append-only ledger.
The ceiling is that `app_role` is a flat Postgres enum of 21 values, and authority in the
corpus is Role + applicable Relationship + applicable Assignment. Relationship and
Assignment have no storage anywhere. So roles generalize; *record-scoped authority* does
not yet exist, and it cannot until Records lands. That is the locked order doing its job,
not a defect.

**Multi-entity: no, not today — and this is the real finding of Part 3.** I checked. There
is no entity, tenant, DBA, or org column on any table in this database. `ledger_wallets`
carries `kind`, `anchor`, `user_id`; `ledger_entries` carries `wallet_id` and
`token_code`. Nothing anywhere records *which legal entity* a movement belongs to. The
corpus has held three administrations since ADR-014 and multiple DBAs since the seed
material, and the database has never known about any of them. Part 3 found the gap by
reasoning from money; the schema confirms it.

So the honest answer is: **generalization, not pivot — with one missing dimension.** Two
of the three "multis" are already load-bearing. The third is a single unowned concept, not
a rewrite.

## What is genuinely new

Four things.

1. **Entity as a missing dimension of the ledger.** `ASSERTION`, and verified against the
   schema. The corpus separates rail / ledger / accounting / application UI nowhere; Part 3
   names that four-way separation for the first time. The append-only rule (ADR-018,
   enforced by `ledger_entries_append_only`) means the entity dimension must be added
   *before* real money moves, not retrofitted after.
2. **Websites are acquisition and interpretation surfaces; the architecture begins after
   the threshold.** `ASSERTION`. ADR-019 said one engine, many personas. Part 3 says the
   public sites are not the architecture at all. That is a stronger and cleaner claim.
3. **Competing interpretations as method.** `HYPOTHESIS`. Giving several platforms the
   same Source and comparing divergence, with convergence treated as evidence. The corpus
   has a working method (the DH Method, the PROTOCOL) but no multi-vendor epistemology.
4. **Agent teams as a governance question, not a capability question.** `HYPOTHESIS`, and
   the sharpest line in Part 3: *can* one model do the work and *should* it are different
   questions. Division of authority, dissent, independent review and succession are
   governance requirements that survive even if one model is capable enough.

The forty-eight-hour constraint is a fifth item but a procedural one: it argues for a
portable Source packet. The corpus mostly already is that packet — `docs/00-START-HERE.md`,
the four law files, the register. What is missing is portability, not content.

## What the corpus already held

- One engine, many personas — ADR-019, running.
- One human, one continuing file — `law/SHARED-SPINE.md` §1–§2.
- Source / Pattern / Expression, and Expression never authoritative — ADR-020, C39. Part
  3's BooksForge insight (one Pattern, many audience Expressions) is ADR-020 rediscovered
  from the content side.
- Kimosabe as intelligence through every surface rather than a website —
  `strategy/KIMOSABE-POSITIONING.md` §4, and the Kimosabe turn already filed
  2026-09-12 in `strategy/ENGAGEMENT-LAYER.md` §4.
- Feed and Player — already in `04_App_Home`, honestly empty, A45/A46.
- Three administrations — ADR-014.

## Conflicts, stated plainly

1. **Six doors against C40.** Part 3 lists Lt. Dan's Plan as one door among six. ADR-023
   holds the umbrella question open — whether Lt. Dan's Plan is *above* the whole body of
   work. Six-peers and one-umbrella are different structures. Part 3 does not resolve C40;
   it quietly assumes the peer reading. Flagged, not resolved.
2. **Shared users against unshared money.** "They may not share money, contracts or
   authority indiscriminately" versus one auth pool, one wallet table and one ledger with
   no entity column. Synergy is built; separation is not.
3. **A recommending Feed against ADR-016.** Unchanged from 2026-09-12: "the system learns
   more as the person interacts" is inference across a partition unless the person's act
   moves it. C38, now arriving a second time from a different direction — which is
   evidence it is a real gate, not a quibble.
4. **National Roofing Army operating through SiteBMS** touches the machinery. SiteBMS is
   gate three of a five-gate order and RRCA is its first operator. A second operator is a
   Records-layer question, not a door question.
5. **Competing platforms against single-source-of-truth.** The corpus rule is that the
   corpus is truth. Several platforms producing divergent structures needs an arbitration
   rule, or the experiment produces four corpora and no canon.

## Classification

| Idea | Label |
|---|---|
| Existing codebase is the first instance of a general platform | ASSERTION — supported for doors and roles, not for entities |
| Six doors, one shared arrival | ASSERTION — already in force under ADR-019 |
| Public sites are acquisition surfaces, not architecture | ASSERTION — new phrasing, consistent with canon |
| Kimosabe follows the user rather than guarding the gate | ASSERTION — already filed, ENGAGEMENT-LAYER §4 |
| BooksForge / MusicApp / MovieApp / MyGPT.TV may be modes, not applications | OPEN |
| Rail / ledger / accounting / UI as four separable layers | HYPOTHESIS — and the highest-value one |
| Entity dimension required before real money moves | ASSERTION — verified against the schema |
| Same Source to competing platforms; divergence as information | HYPOTHESIS |
| Agent teams as governance rather than capability | HYPOTHESIS |
| Forty-eight-hour portable Source packet | proposed DECISION on deliverable form |
| Generalization rather than pivot | ASSERTION |

## Where the boundary is

Asked for a clear architectural boundary, here is mine, offered as ASSERTION.

**Stays in this codebase:** every door, every persona, the Interested User arrival, App
Home, the guide, roles and certification, the Screen Book, the corpus, the shared file.

**Must become general before it can carry a second business:** the ledger's entity
dimension, authority storage for Relationship and Assignment, and the role enum's
hard-coded shape.

**Should be separate from the start:** the transaction rail. A bank, processor or wallet
provider belongs behind an interface, never inside the ledger. And accounting is a third
system, not a view of the ledger.

**Should stay a separate experiment:** the competing-platform trial. It is a method
experiment about this corpus, not a feature of it.

## Files this pass will write

- `docs/strategy/PLATFORM-GENERALIZATION.md` — new C2 note holding the three-way answer,
  the schema finding, the four-layer money separation, the boundary, the competing-platform
  experiment and the governance question. Every claim labelled.
- `docs/law/DECISIONS.md` — ADR-025: generalization, not pivot. Records that doors and
  roles are already general, that the entity dimension is absent and must precede real
  money, and that the transaction rail sits behind an interface. Alternatives considered:
  a second codebase per door; a multi-tenant rewrite now; do nothing.
- `docs/work/OPEN-ITEMS.md` — new register lines: entity dimension on wallets and ledger;
  rail / ledger / accounting separation; Relationship and Assignment storage; the portable
  Source packet; the competing-platform experiment and its arbitration rule; agent teams as
  governance; whether BooksForge/MusicApp/MovieApp/MyGPT.TV are modes or applications; the
  six-doors-versus-umbrella tension against C40.
- `docs/law/ARCHITECTURE.md` — a short "what is general and what is not" section stating
  the verified schema finding.
- `docs/00-START-HERE.md` — manifest line for the new note.
- `docs/work/SPRINTS.md` — Sprint 2.16, documentation only.
- Backlog board mirror of every new register line, same IDs, same turn.

## Out of scope

No route, no door, no schema, no migration, no payment work, no agent team, no domain
change. The locked work order is untouched.
