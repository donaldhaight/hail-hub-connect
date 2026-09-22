# Seven Doors — Rulings Accepted: Route Plan, Attribution Proposal, Reconciliation, ClaimStore

Audit accepted; all ten rulings taken as given. This returns the four things asked for and
nothing else. No Door is built until the ClaimStore pattern is approved.

## 1. Canonical route plan

Today there are two public systems: the real Door engine (ask box, holding file, wallet,
anchor) serving `/kimosabe` and `/buddy-claim` from persona records, and the static brand
card at `/b/<slug>` serving six ventures. The ruling makes the Door engine canonical.

Proposed target:

```text
/claimstore            canonical Door   (new persona record)
/selfinsurity          canonical Door   (new, message-only)
/rrca                  canonical Door   (new)
/national-roofing-army canonical Door   (new, visibly proposed)
/market-applications   canonical Door   (new, last)
/kimosabe              canonical Door   (exists)
/buddy-claim           canonical Door   (exists; track param wired in)
/b/<slug>              -> permanent redirect to the canonical Door
/b/united-stakeholders -> kept as the brand card, unchanged (eighth container)
```

Three points the founder should weigh before anything moves:

1. **The Door engine is longer than a brand card and shorter than a positioning page.** The
   venture instructions ask for ten sections. Rather than bloat the ask-first engine, the
   proposal is: the Door engine keeps its arrival behaviour, and the positioning sections
   render *beneath* it from the persona record — one new optional `sections` field on the
   persona shape, no new component family.
2. **Redirects preserve the published URLs.** `/b/<slug>` stays live and permanently
   redirects, so nothing already shared breaks. United Stakeholders is the one exception and
   keeps its card.
3. **Order of cutover:** ClaimStore ships first as a new canonical route while `/b/claimstore`
   still renders the old card. The redirect is flipped only after the pattern is approved.
   Nothing is retired before its replacement is accepted.

## 2. Minimal attribution record — proposal only, not implemented

One additive column. No redesign, no new table, no change to existing reads.

```sql
ALTER TABLE public.ledger_wallets
  ADD COLUMN entry_context jsonb;

ALTER TABLE public.briefing_requests
  ADD COLUMN entry_context jsonb;

COMMENT ON COLUMN public.ledger_wallets.entry_context IS
  'Door attribution captured at arrival. Non-authoritative marketing context. Never a role.';
```

Shape written on first arrival and never rewritten afterwards:

```json
{
  "entry_door": "ClaimStore",
  "campaign": "preseason_2026",
  "initial_intent": "explore_insurance_restoration_market",
  "interest": "property_owner",
  "promise_version": "ClaimStore Landing Page v0.1 — 2026-09-22",
  "referral_source": "utm or referrer, when present",
  "captured_at": "timestamp"
}
```

- **Privacy.** No name, email, address, IP or device data. The interest value is a
  self-declared marketing string, explicitly not a role, group, credential or permission —
  matching ruling three. It travels with the anonymous anchor and follows the person only if
  they claim the wallet themselves.
- **Permissions.** No new policy. The column inherits the existing rules on both tables; the
  person reads their own, the founder reads the queue. No public read.
- **Write path.** Set once by the existing server function that creates the wallet, and
  copied onto the briefing request when one is submitted. Nothing derives authority from it.
- **Rollback.** A nullable JSON column with no constraints and no code depending on it being
  present: the migration is reversible by ignoring the column, and destructively reversible
  by dropping it, with no data loss elsewhere.
- **Authorization still required.** This is the proposal the ruling asked for. It is not run
  until the founder says run it.

## 3. Decision reconciliation — package DEC-031–056 against our law

No renumbering, no merging. Read as: what each package decision does to our corpus.

**Equivalent — already ruled here, different words**

| Package | Ours |
|---|---|
| DEC-033 Many Doors, One System | ADR-019 one front-door engine, many personas |
| DEC-037 Lovable Boundary | ADR-021, ADR-022 authorized containers; the documentation-first rule |
| DEC-044 Provider memory is not canonical memory | ADR-016 memory partitions |
| DEC-043 Continuity and authority separation | Authority = Role + Relationship + Assignment |
| DEC-056 Seven comparable valuation records | ADR-012 hold the Quantum Dashboard |

**Compatible — new, and nothing here contradicts them**

DEC-035, DEC-036 (SelfInsurity entry and RoofLac placement), DEC-039 (foundry category),
DEC-040 (shared-slice proof before platform claim), DEC-041, DEC-042 (Kimosabe as Personal
Operating Guide, Person File primitive), DEC-045–048 (ClaimStore portfolio, canonical domain,
ClaimExpress as protocol, financial-name boundaries), DEC-049, DEC-050 (Buddy Claim advocacy
and the attorney-of-record boundary), DEC-053–055 (RRCA as operating proof, diligence before
numbers, NRA is a network not RRCA at scale).

**Conflicts — founder ruling required, not resolved here**

1. **DEC-031 / DEC-032 four canonical views** vs our corpus law, ADR register and
   OPEN-ITEMS. Two governance systems now claim to be the source of truth. Neither should
   absorb the other by inference.
2. **DEC-034 persistent File pattern** (Person, Property, Business, Project, Claim, Job as
   File types) vs ADR-018 and the locked work order, which puts the Records/Object Model at
   its own gate. Ruling four already defers the SelfInsurity expression of this; the
   underlying model decision is still ahead of its gate.
3. **DEC-038 Market Applications operates the platform, Kimosabe is its layer** vs ADR-014's
   three administrations and the unsettled legal shape of Market Applications.
4. **DEC-052 neutral DAO is governance, not exemption** touches the capture-prevention
   structure and the NCOI conflict already standing as C48.

**Positioning-only — belongs in the package, not in our law**

DEC-046 domain routing, DEC-051 territorial participation hypothesis, DEC-054 diligence
sequencing, and every evidence, hypothesis and source register.

## 4. ClaimStore — precise implementation plan

The first canonical Door. Message-only, no new record, no functional scope.

- **Persona record.** Add `claimstore` to the persona content file: wordmark, eyebrow
  "ClaimStore Vision for the Insurance Restoration Market", promise "One claim. One operating
  record. Every authorized party knows what comes next.", ask placeholder, opened-file copy,
  palette token reused from the existing brand record.
- **Sections beneath the Door**, from the instruction, rendered by the existing section
  components: the problem; the market pattern (ClaimStore, ClaimExpress, ClaimsBank,
  ClaimLoan, ClaimCoin, each with its boundary line); the ClaimExpress sequence; interest
  selection; Focused Future, labelled future; disclosure; final CTA into the existing request
  routine.
- **Interest selection** is a plain choice carried into the request's existing free-text
  context. Visible line: *an interest statement only — it creates no role, credential,
  group or permission.* Nothing is written that the ruling forbids.
- **Route.** `/claimstore`, with the standard head/SEO helper. `/b/claimstore` untouched this
  pass; the redirect is a separate step after approval.
- **Attribution.** Browser-only for this build, with the entry context visibly recorded on
  screen as captured-but-not-persisted, until the schema above is authorized.
- **Not built:** Claim File, workflow, payments, migrations, roles, permissions, publishing.
- **Returned for review:** route, desktop and mobile screenshots, components reused versus
  added, what is simulated, typecheck result, and the wording decisions left open.

## 5. Register and board

New register lines, mirrored to the founder backlog board with the same IDs, in the same turn
as the first build: the canonical route consolidation; the entry-context column awaiting
authorization; the four reconciliation conflicts above; and preview-copy approval as a
standing gate before any publication.

Nothing publishes. Nothing touches the Quantum Dashboard.
