# Business Model & Exposure Context — the September 15 synchronization packet

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-16
> A context synchronization packet read as Source, not instruction. Most of it is
> filed as `SIMULATION` or `OPEN`. Nothing here is promoted to canon; the locked
> work order did not move.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

---

## 1. The short answer

`ASSERTION` — The architecture still supports every business model in this packet
without structural change, with **one exception that was already on the record**: the
missing entity dimension (ADR-025, [`PLATFORM-GENERALIZATION.md`](PLATFORM-GENERALIZATION.md)
§1, verified against the live schema on 2026-09-13).

This packet does not create that gap. It raises the price of it. *USA sells / RRCA
manages / NRA performs* is a three-entity money flow, and no table anywhere records
which legal entity a dollar belongs to. Because the ledger is append-only (ADR-018),
the dimension cannot be added to history after the fact. Exposure Model B is cheap
under that gap; §6 of the packet is not.

## 2. What the corpus already held

| Packet section | Already recorded as |
|---|---|
| One person → one file → many roles, markets, providers | `law/SHARED-SPINE.md`; ADR-019 |
| Model A / Model B, unruled | [`EXPOSURE-SIMULATION.md`](EXPOSURE-SIMULATION.md); A53–A56, C47 |
| Doors are data, one engine many personas | ADR-019; `src/content/personas.ts` |
| Six-door working set, NRA among them | `PLATFORM-GENERALIZATION.md` §1, §4 |
| Market Applications structure TBD | Core memory; ADR-014 |
| Kimosabe as continuing relationship; partitioned memory | ADR-016; ADR-024 |
| Apps as modes vs separate applications | A52, open |
| Source → atomic unit → Feed → Player → Task → Ledger | [`ENGAGEMENT-LAYER.md`](ENGAGEMENT-LAYER.md) §3–4; Feed and Player honestly empty in the Screen Book |
| Corpus as ingredients; Expression never the Source | ADR-020 |
| Failure-safe posture | `EXPOSURE-SIMULATION.md` §2; ADR-023 |
| Entity separation unbuilt | ADR-025; C44 |

## 3. What is genuinely new

1. `SIMULATION` — **USA as a licensed roofing contractor / prime**, giving the venture
   an ordinary revenue heartbeat while the platform develops, with the
   1%-back-to-the-market proposition. The packet is explicit that 1% is a variable,
   not a commitment. The corpus has never had USA as an operator. (A57)
2. `SIMULATION` — **USA → RRCA → NRA functional separation**: USA sells, RRCA manages,
   NRA performs; NRA re-parented under USA rather than RRCA. (A58)
3. `SIMULATION` — **Network ownership of RRCA** framed as part of the No Conflicting
   Interest experiment rather than a founder exit. Ownership, securities structure,
   valuation, timing, voting, governance and eligibility all `OPEN`. (A59)
4. `ASSERTION` — **Origin is not compensation.** The record says what happened; the
   economic agreement says what it pays. The sharpest idea in the packet and the one
   with the most direct data consequence. Recorded in **ADR-026**. (A60)
5. `SIMULATION` — **Provider abstraction**, tested in the Circle rehearsal: provider
   activity becomes evidence, and provider IDs stay external mappings rather than
   primary identities. Reconnects the original MarketAPI concept. (A61)
6. `SIMULATION` — **Founding Stakeholder Position Books**: one invariant Pattern, one
   book per Stakeholder Group, the same nine questions in each. (A62)
7. `SIMULATION` — **A reusable revenue-object catalog** — one product taxonomy across
   every brand instead of a bespoke economic model per brand. (A63)
8. `ASSERTION` — **Experienced Builders / Dragonslayers as a named audience**, with a
   usable acceptance test: would an experienced builder understand the proposition,
   see the assumptions, identify the dragons, and know how to plug in? (A65)
9. `ASSERTION` — **Geography as a dimension in which territory does not imply
   exclusivity.** Sponsorship, operating rights, lead priority, license, designation,
   representation and exclusivity are separate grants. (A64)

## 4. What refines earlier language

- **USA's plain description** — "builds and launches businesses designed around the
  interests of the people who actually participate in a market" — is a C0-safe
  restatement of the Human Blockchain, not a replacement for it. It is the first
  sentence in the corpus that a stranger can hear without a glossary.
- **No Conflicting Interest, clarified.** Not the absence of self-interest, but the
  absence of secret or structural control over rules, attribution, authority, data,
  pricing, access, dispute resolution and economics — binding on the founder and
  founder-controlled entities equally. This tightens a principle the corpus has been
  using loosely. Recorded in **ADR-026**.
- **Kimosabe** moves from door → product → persistent relationship layer. That is the
  third reposition in a week and the direction is consistent, so the *trend* is
  recorded even though no single step has been ruled.
- **Position Books** are a concrete use of the Perception Library (ADR-020) and of the
  variant model, which has been specified since 2026-09-10 and never once used.
- **Failure-safe philosophy** restates ADR-023's boats-and-the-country reading in
  operating terms: each initiative must retain value if its most ambitious expression
  fails.

## 5. Conflicts, preserved rather than resolved

1. **§6 against the entity gap.** Three entities with distinct revenue and
   responsibility, on a ledger with no entity column. C44 is now urgent rather than
   theoretical, and append-only means it must be settled before the first real dollar.
2. **USA as contractor against No Conflicting Interest.** If USA sells into the market
   *and* owns the protocol governing attribution, pricing and lead routing, that is
   precisely the structural control §8 forbids. Stated once and left with the founder.
   The RRCA network-ownership idea may answer it — or compound it. (C48)
3. **NRA re-parenting against the umbrella question.** The packet moves a door without
   ruling the hierarchy that ADR-023 / C40 / C45 leave open. Not resolved by
   inference. (C49)
4. **Origin-not-compensation against the current ledger.** Today's ledger records value
   movement, not contribution facts. These are two record families, not one; collapsing
   them is what makes attribution arguments unwinnable later. (A60)
5. **Provider abstraction against ADR-016.** "Provider activity becomes evidence" is a
   memory-partition crossing unless the person's own act moves it. The rule does not
   bend for a provider. (C51)
6. **Kimosabe as relationship layer against the empty engagement layer.** Feed, Player
   and the habit loop remain undesigned. This is A56 arriving a third time — evidence
   it is a real gate, not a coincidence.
7. **Market Applications' neutral technology against its business-development
   interest.** The packet says the separation is unresolved. It is conflict #2 one
   level up. (C50)

## 6. Held outside canon

Packet sections 2, 5, 6, 7, 12, 13, 16, 17, 19 and 20 remain `SIMULATION` or `OPEN`.
No ADR is written for a simulation. When the founder rules USA's operating role,
RRCA's ownership, or exposure Model A/B, *that* ruling gets the ADR.

## 7. Future Screen Book and data implications, if any of this is ruled

- An **entity dimension** on every money-bearing and authority-bearing record, plus
  entity-scoped ledger views (A48 becomes load-bearing rather than anticipatory).
- A **contribution / origin record family** distinct from the ledger, with a separate
  compensation-agreement object that reads from it.
- A **product catalog object** able to express every item in packet §16 uniformly —
  access, transaction, technology, media — instead of one economic model per brand.
- A **geography object** carrying territory, with exclusivity as a separable grant.
- A **provider registry** with external-ID mapping and an evidence-ingest boundary.
- Screen Book: **Position Books** as one authorized container per Stakeholder Group;
  **Provider Settings**; and the Market / Media / Kimosabe settings families as modes
  of App Home rather than new branches — which bears directly on A52.

None of this is designed here. Each waits on its gate in the locked order.

## 8. Assumptions the codebase cannot verify

- What the Siteforum codebase actually provides (A54, still unverified).
- The Florida formation, banking posture and DBA tracking of United Stakeholders of
  America, LLC.
- Licensing feasibility and cost for USA to sell roofing or act as prime.
- Securities viability of network ownership of RRCA.
- Whether Circle or any provider will accept an evidence-only, non-identity role.
- Whether 1% of sold volume is economically survivable at the margins this market runs.

These are named so that nothing downstream quietly rests on them.
