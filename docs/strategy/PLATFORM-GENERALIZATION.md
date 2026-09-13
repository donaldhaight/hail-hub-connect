# Platform Generalization — what kind of road we have been building

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-13
> Holds the 2026-09-13 "Part 3" material, read as Source and reconciled against the corpus.
> Nothing here binds except where it names an existing decision.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

---

## 1. The question, split three ways

The question put to this pass was whether the existing codebase can evolve into a
multi-site, multi-entity, multi-role platform without destroying the work already done.
It is really three questions with three different answers.

### Multi-site — yes, and it is already true

`FACT` — `src/content/personas.ts` holds a persona registry and
`src/components/frontdoor/FrontDoor.tsx` is one engine rendering many doors. `/kimosabe`
and `/buddy-claim` are two doors standing on one anchor, one holding wallet, one
append-only ledger, one file. A sixth door costs a persona record and a route.

`ASSERTION` — The six-door thought experiment (Kimosabe · LtDansPlan · Prepare America ·
ClaimStore · United Stakeholders · National Roofing Army) is ADR-019 restated from the
visitor's side rather than the architecture's. Nothing new is required to hold it — and
that absence of new requirement is the finding, not a disappointment.

### Multi-role — yes, with a known ceiling

`FACT` — The spine exists and runs: identity, `user_roles`, `has_role`, `role_catalog`,
`role_modules`, `role_enrollments`, `role_progress`, wallet, ledger, Role Store.

`FACT` — `app_role` is a flat Postgres enum of 21 values. Authority in this corpus is
**Role + applicable Relationship + applicable Assignment** (ADR-014, as corrected). Neither
Relationship nor Assignment has storage anywhere in the database.

`ASSERTION` — Therefore roles generalize; *record-scoped authority* does not exist yet and
cannot until the Records layer lands. That is the locked work order doing its job, not a
defect to be routed around.

### Multi-entity — no, not today

`FACT` — Verified against the live schema on 2026-09-13: there is no entity, tenant, DBA
or organization column on any table. `ledger_wallets` carries `kind`, `anchor`, `user_id`,
`label`. `ledger_entries` carries `wallet_id`, `token_code`, `direction`, `amount`,
`reason`, `ref`, `memo`, `counterparty_wallet_id`. Nothing records *which legal entity* a
movement belongs to.

`ASSERTION` — The corpus has held three administrations since ADR-014 and multiple DBAs
since the seed material. The database has never known about any of them. Part 3 found this
gap by reasoning forward from a real transaction; the schema confirms it independently.

### The answer

`ASSERTION` — **Generalization, not pivot — with one missing dimension.** Two of the three
"multis" are already load-bearing. The third is a single unowned concept, not a rewrite.

## 2. What is genuinely new

1. `ASSERTION` — **Entity as a missing dimension of the ledger.** The four-way separation
   of transaction rail / ledger / accounting / application UI is named nowhere else in the
   corpus. Because `ledger_entries_append_only` enforces ADR-018, the entity dimension has
   to exist *before* real money moves. It cannot be backfilled onto history that may not
   be rewritten.
2. `ASSERTION` — **Public websites are acquisition and interpretation surfaces; the
   operating architecture begins after the threshold.** Stronger and cleaner than ADR-019's
   "one engine, many personas," and consistent with it.
3. `HYPOTHESIS` — **Competing interpretations as method.** Give several platforms the same
   Source, goals, rules, assets and deadline; let each decide how to execute; treat
   divergence as information and convergence as evidence of a real Pattern. The corpus has
   a working method (the DH Method, `law/PROTOCOL.md`) but no multi-vendor epistemology.
4. `HYPOTHESIS` — **Agent teams are a governance question, not a capability question.**
   *Can* one model do the work and *should* one model be allowed to are different
   questions. Division of authority, independent review, dissent, continuity, auditing and
   succession survive even where raw capability makes a team unnecessary.

`ASSERTION` — The forty-eight-hour constraint is procedural rather than new: it argues for
a portable Source packet. The corpus largely *is* that packet already —
`docs/00-START-HERE.md`, the four law files, the register, the Screen Book. What is
missing is portability and an interpretation rule for disagreement, not content.

## 3. What the corpus already held

- One engine, many personas — ADR-019, running.
- One human, one continuing record — `law/SHARED-SPINE.md` §1–§2.
- Source / Pattern / Expression, Expression never authoritative — ADR-020, C39. Part 3's
  BooksForge insight (one Pattern, many audience Expressions — executive, attorney,
  contractor, course, screenplay) is ADR-020 rediscovered from the content side.
- Kimosabe as intelligence available through every surface rather than a website —
  `KIMOSABE-POSITIONING.md` §4; the same turn already filed in `ENGAGEMENT-LAYER.md` §4.
- Feed and Player — already in `04_App_Home`, honestly empty (A45, A46).
- Three administrations — ADR-014.

## 4. Conflicts, stated plainly

1. **Six doors against C40.** Part 3 lists Lt. Dan's Plan as one door among six. ADR-023
   holds open whether Lt. Dan's Plan is the umbrella *above* the whole body of work. Six
   peers and one umbrella are different structures. The peer reading is assumed here
   quietly; it is not ruled. C40 stays open.
2. **Shared users against unshared money.** "They may not share money, contracts or
   authority indiscriminately" versus one auth pool, one wallet table, one ledger with no
   entity column. Synergy is built; separation is not.
3. **A recommending Feed against ADR-016.** "The system learns more as the person
   interacts" is inference across a memory partition unless the person's own act moves it.
   This is C38 arriving a second time from an unrelated direction — evidence it is a real
   gate rather than a quibble.
4. **National Roofing Army operating through SiteBMS** touches the machinery, not the door
   layer. SiteBMS is gate three of five and RRCA is its first operator. A second operator
   is a Records-layer question.
5. **Competing platforms against single-source-of-truth.** The standing rule is that the
   corpus is truth. Several platforms producing divergent structures needs an arbitration
   rule, or the experiment yields four corpora and no canon.

## 5. Classification

| Idea | Label |
|---|---|
| Existing codebase is the first instance of a general platform | ASSERTION — holds for doors and roles, not for entities |
| Six doors, one shared arrival | ASSERTION — already in force under ADR-019 |
| Public sites are acquisition surfaces, not architecture | ASSERTION — new phrasing, consistent with canon |
| Kimosabe follows the user rather than guarding the gate | ASSERTION — already filed, ENGAGEMENT-LAYER §4 |
| BooksForge / MusicApp / MovieApp / MyGPT.TV may be modes, not applications | OPEN |
| Rail / ledger / accounting / UI as four separable layers | HYPOTHESIS — the highest-value item here |
| Entity dimension required before real money moves | ASSERTION — verified against the schema |
| Same Source to competing platforms; divergence as information | HYPOTHESIS |
| Agent teams as governance rather than capability | HYPOTHESIS |
| Forty-eight-hour portable Source packet | proposed DECISION on deliverable form |
| Generalization rather than pivot | ASSERTION |

## 6. Where the boundary is

`ASSERTION`, offered as the clear answer Part 3 asked for.

**Stays in this codebase.** Every door and persona, the Interested User arrival, App Home,
the guide, roles and certification, the Screen Book, the corpus, the shared file, the
founder surfaces. Cloning any of this into a second repository would fork the identity
model, which is the one thing that must never fork.

**Must become general before this platform can carry a second business.** The ledger's
entity dimension; storage for Relationship and Assignment so authority can be
record-scoped; and the role vocabulary, which is a hard-coded enum today.

**Should be separate from the first line of code.** The transaction rail. A bank, processor
or wallet provider belongs behind an interface and never inside the ledger. Accounting is a
third system, not a view of the ledger. The application UI is a fourth. Four layers, four
boundaries, no shortcuts — this is the architectural test a first real transaction
performs, and it is worth more than the payment it processes.

**Should stay a separate experiment.** The competing-platform trial. It is a method
experiment *about* this corpus, not a feature *of* it, and it needs an arbitration rule
before it starts.

## 7. What converges

`ASSERTION` — Three sessions now have arrived at the same shape from three directions:
the story layer (Part 1), the engagement layer (Part 2), and the platform layer (Part 3).
Each time the finding is the same — many surfaces, one file, one spine — and each time it
arrived without being argued for. The corpus should treat that repetition as evidence
rather than as repetition.
