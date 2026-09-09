# Draft Connecticut Agreement — requirements capture sprint

The locked work order is:

```text
Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping → API/MCP
```

The agreement is the gate. Before the object model can be cut, the legal and operating rules it must encode have to be collected in one place. This sprint writes that collection as a requirements document, not as code.

## Goal

Create `docs/CONNECTICUT-AGREEMENT.md` as a *requirements in progress* document that records what the Draft Connecticut Agreement needs to say. It does not draft legal language. It lists the clauses, rules, and party obligations that the software will later have to enforce, and it flags which ones are already open items in `docs/OPEN-ITEMS.md`.

## What goes into the document

### 1. Parties and roles

- Property Owner
- Independent Sales Representative (ISR)
- Licensed Contractor (LC)
- Construction Manager / RRCA
- Market Applications, TBD (platform operator)
- SelfInsurity / RoofLac carrier relationship

Each party's authority is governed by ADR-014:

> Authority = Role + applicable Relationship + applicable Assignment.

### 2. Property record ownership and transfer

Inputs from `docs/OPEN-ITEMS.md`:

- C16 — who owns the property record; what the current owner may see and erase; what may never be sold.
- C34 — who inherits the file when the property is sold, and what the former owner keeps.
- C36 — whether erasure is possible at all against append-only offer snapshots and ledger entries.

The document must state what the agreement says about permanence, portability, sale-of-property transfer, and the owner's right to be forgotten versus the ledger's append-only rule.

### 3. Consent and provenance for outbound contact

Inputs from `docs/OPEN-ITEMS.md`:

- C17 — consent standard for storm-triggered outbound contact.
- C35 — what an ISR may truthfully tell a property owner at the door about how the address was obtained, without exposing band-3 targeting logic.

The document must state the consent that is captured, who may rely on it, and what disclosure is required when an address came from the targeting engine or an affiliate funnel.

### 4. Kimosabe memory and data retention

Input from `docs/OPEN-ITEMS.md`:

- C24 — Kimosabe memory retention and consent.

The document must state what the platform may retain before onboarding, after onboarding, and across role/app partitions, and what forget-me rights apply at each stage.

### 5. Offer snapshots and field locking

From `docs/RECORDS-MODEL.md` §5 and ADR-018:

- Complete Offer is an event that writes an append-only versioned snapshot.
- Address provenance, user provenance, and completed-offer snapshots must not be overwritten.

The document must state which fields are locked by which events and which parties may append but not rewrite.

### 6. Project economics and income recognition

Inputs from `docs/OPEN-ITEMS.md`:

- C27 — is income recognition at Job close a real RRCA accounting rule today, or a proposal?

The document must state when the Licensed Contractor recognizes income, what verification is required, and what happens to estimated values after Project Open.

### 7. JobNimbus boundary and shared identifiers

Inputs from `docs/OPEN-ITEMS.md`:

- C26 — does JobNimbus provide the Project ID, or does SiteBMS mint its own and map to it?
- C28 — which data lives in the shared SiteBMS record, which is mirrored from JobNimbus, which is referenced by identifier only, and which events cross the boundary.

The document must state the operational contract between SiteBMS and JobNimbus for Phase 1.

### 8. Dispute resolution and the ledger as evidence

From `docs/RECORDS-MODEL.md` §9 and the ledger design:

- The ledger is append-only and serves both operational trust and watcher confidence.
- No admin can rewrite history.

The document must state what the ledger proves, who can rely on it, and what happens if a party disputes a record.

## Questions this sprint will surface but not answer

The document ends with a short "Questions to resolve before drafting" list. Expected candidates:

- Does the Property Owner sign a single platform agreement, or separate agreements per product (insurance quote, RoofLac, restoration work)?
- Does the ISR operate as an independent contractor of the platform, the LC, or both?
- What state law governs consent for storm-triggered contact, and does the agreement need state-specific riders?
- What is the minimum retention period for the ledger, and does it survive account closure?
- How are affiliate-sourced leads treated differently from platform-sourced or targeting-engine leads?

## Explicitly out of scope

- No object model, ERD, schema, or migration.
- No UI, route, or component.
- No ClaimExpress / Siteforum screen comparison unless the founder supplies screenshots or documents.
- No resolution of the open items themselves — only their collection and framing as agreement requirements.

## Files touched

- `docs/CONNECTICUT-AGREEMENT.md` — new
- `docs/OPEN-ITEMS.md` — update the Connecticut-input items (C16, C17, C24, C34, C35, C36) to point at the new document
- `docs/RECORDS-MODEL.md` — add one cross-reference line pointing to the new document

## Success criteria

A reader can open `docs/CONNECTICUT-AGREEMENT.md` and see every rule the Records layer must enforce, traced back to an existing open item or decision. The locked work order remains intact; the next sprint after this one would be the Records / Object Model, not before.
