# Reading the Business Model & Exposure Context Update (Sept 15) against the corpus

Documentation only. No code, schema, route, UI, Screen Book, canon, or work-order
change. The packet is read as Source, not instruction. Nothing is promoted.

## The short answer

`ASSERTION` — The architecture still supports every business model in this packet
without structural change, with **one exception that was already on the record**: the
missing entity dimension (ADR-025, `PLATFORM-GENERALIZATION.md` §1, verified against
the live schema). This packet does not create that gap — it raises the price of it.
USA sells / RRCA manages / NRA performs is a three-entity money flow. Nothing in the
database records which legal entity a dollar belongs to. Model B is cheap under that
gap; Section 6 is not.

## Already in the corpus

- One person → one file → many roles → many markets: `SHARED-SPINE.md`, ADR-019.
- Model A / Model B, unruled: `EXPOSURE-SIMULATION.md`, register A53–A56, C47.
- Doors are data, one engine many personas: ADR-019, `personas.ts`.
- Six-door working set, NRA named: `PLATFORM-GENERALIZATION.md` §1, §4.
- Market Applications structure unsettled: core memory, ADR-014.
- Kimosabe as continuing relationship, memory partitioned: ADR-016, ADR-024.
- Apps-as-modes vs separate applications: register A52, open.
- Source → Atomic unit → Feed → Player → Task → Ledger: `ENGAGEMENT-LAYER.md`
  (Feed and Player already in the Screen Book, honestly empty).
- Corpus as ingredients, Expression never the Source: ADR-020.
- Failure-safe posture: `EXPOSURE-SIMULATION.md` §2, ADR-023.
- Entity separation unbuilt: ADR-025, C44.

## Genuinely new

1. `SIMULATION` — **USA as a licensed roofing contractor / prime with an ordinary
   revenue heartbeat**, and the 1%-to-the-market proposition (figure explicitly a
   variable, not a commitment). The corpus has never had USA as an operator.
2. `SIMULATION` — **USA → RRCA → NRA functional separation** (sell / manage /
   perform), with NRA re-parented under USA rather than RRCA.
3. `SIMULATION` — **Network ownership of RRCA** as part of the No Conflicting
   Interest experiment rather than an exit. Ownership, securities, valuation,
   timing, voting, governance, eligibility all OPEN.
4. `ASSERTION` — **Origin is not compensation.** The ledger records what happened;
   the economic agreement decides what it pays. This is the sharpest idea in the
   packet and the one with the most direct data consequence.
5. `SIMULATION` — **Provider abstraction** (the Circle rehearsal): provider activity
   becomes evidence; provider IDs stay external mappings, never primary identities.
   Reconnects MarketAPI.
6. `SIMULATION` — **Founding Stakeholder Position Books**: one invariant Pattern,
   one book per Stakeholder Group, nine fixed questions each.
7. `SIMULATION` — **The reusable revenue-object catalog** — one product taxonomy
   across every brand instead of a bespoke economic model per brand.
8. `ASSERTION` — **Experienced Builders / Dragonslayers as a target audience**, with
   a usable acceptance test: would an experienced builder see the assumptions, find
   the dragons, and know how to plug in?
9. `ASSERTION` — **Geography as a dimension where territory does not imply
   exclusivity**; exclusivity is a separate, purchasable thing.

## Refinements of existing language

- **USA's plain description** ("builds and launches businesses designed around the
  interests of the people who actually participate in a market") is a C0-safe
  restatement of the Human Blockchain, not a replacement for it. Worth adopting as
  the public-facing sentence while the C2 framing stays intact.
- **No Conflicting Interest clarified**: not absence of self-interest, but absence of
  secret or structural control over rules, attribution, authority, data, pricing,
  access, dispute resolution and economics — binding on the founder equally. This
  tightens a principle the corpus used loosely.
- **Kimosabe** moves from door → product → persistent relationship layer. Third
  reposition in a week; the trend is consistent, so it is recorded as a trend.
- **Position Books** are a concrete answer to the Perception Library (ADR-020) and a
  direct use of the variant model that has been specified and never used.

## Conflicts, preserved not resolved

1. **Section 6 against the entity gap.** Three entities with distinct revenue and
   responsibility, on a ledger with no entity column. C44 becomes urgent, not
   theoretical. The ledger is append-only — this must be settled before the first
   real dollar, not after.
2. **USA as contractor against No Conflicting Interest.** If USA sells and also owns
   the protocol that governs attribution, pricing and lead routing, that is the exact
   structural control Section 8 forbids. Stated once, plainly, and left for the
   founder. It may be answered by the RRCA network-ownership idea — or made worse by it.
3. **NRA re-parenting against the ADR-023 / C45 umbrella question.** The packet moves
   a door without ruling the hierarchy. Not resolved by inference.
4. **Origin-not-compensation against the current ledger.** The ledger today records
   value movement, not contribution facts. Two record families, not one.
5. **Provider abstraction against ADR-016 memory partitions.** "Provider activity
   becomes evidence" is a partition crossing unless the person's own act moves it.
6. **Kimosabe-as-relationship-layer against the empty engagement layer.** Same gate
   as A56, arriving a third time.
7. **Market Applications' neutral-technology vs business-development split** is the
   same conflict as #2 one level up, and the packet says it is unresolved.

## Held outside canon

Everything in Sections 2, 5, 6, 7, 12, 13, 16, 17, 19, 20 stays `SIMULATION` or
`OPEN`. No ADR is written for a simulation. When the founder rules USA's operating
role, RRCA's ownership, or Model A/B, *that* ruling gets the ADR.

## Future Screen Book and data implications (if ruled)

- Entity dimension on every money-bearing and authority-bearing record; entity-scoped
  ledger views.
- A contribution/origin record family distinct from the ledger, with a separate
  compensation agreement object reading from it.
- A product-catalog object able to express every item in Section 16 uniformly.
- Geography object with territory, and exclusivity as a separable grant.
- Provider registry with external ID mapping and an evidence-ingest boundary.
- Screen Book branches: Position Books (one container per Stakeholder Group),
  Provider Settings, and the Market / Media / Kimosabe settings families as modes of
  App Home rather than new branches (bears on A52).

## Assumptions this codebase cannot verify

Siteforum's actual capability (A54, still unverified); Florida formation and banking
status of USA; licensing feasibility for USA as a contractor; securities viability of
network ownership of RRCA; whether Circle or any provider will accept the evidence-only
role; whether the 1% is economically survivable.

## Files this pass will write

- `docs/strategy/BUSINESS-MODEL-CONTEXT.md` — new C2 note holding this reconciliation,
  every claim labelled.
- `docs/law/DECISIONS.md` — **one** ADR recording only the two things the packet
  asserts rather than simulates: origin-is-not-compensation as a recording principle,
  and the clarified No Conflicting Interest test. Simulations stay out of it.
- `docs/work/OPEN-ITEMS.md` — new register lines for the USA operating ruling, the
  USA/RRCA/NRA separation, RRCA network ownership, the origin/compensation record
  split, provider abstraction, Position Books, the revenue-object catalog, geography
  and exclusivity, the Experienced Builder audience test, and the neutral-technology
  split. Same IDs mirrored to the founder backlog board in the same turn.
- `docs/00-START-HERE.md` — manifest line.
- `docs/work/SPRINTS.md` — Sprint 2.18, documentation only.

## Out of scope

No code, UI, route, schema, migration, domain, public copy, brand re-parenting, or
change to the locked work order (Draft Connecticut Agreement → Records / Object Model
→ SiteBMS → JobNimbus mapping → API / MCP).
