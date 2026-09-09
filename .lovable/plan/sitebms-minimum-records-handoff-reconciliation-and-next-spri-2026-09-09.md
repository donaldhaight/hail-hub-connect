# SiteBMS Minimum Records Handoff — reconciliation and next sprint

Yes, this helps. It is the first document that describes the operating model as a
single continuing record with states, rather than a list of features. It is close
enough to build the object model from, once the two open legal inputs are answered.

## Aligned — already true in the project

- Address/Property as the anchor record, and one continuing record per person, are
  already settled (ADR-015, and the two-spines section of the architecture doc).
- Provenance and consent as first-class fields on every lead, never notes — already
  settled in ADR-015 and matching this document's provenance rules.
- Authority = Role + applicable Relationship + applicable Assignment — already the
  normative wording; this document uses it correctly.
- Construction Manager as one operating role, narrower duties as assignments — matches
  ADR-014. This document restates it for LC production/estimating/collections.
- JobNimbus as Phase 1 system of record, and the sequence
  Connecticut Agreement → Object Model → SiteBMS → JobNimbus mapping → API/MCP.
- Kimosabe assisting inside explicit human authority, never bypassing permissions —
  consistent with the memory partition rule (ADR-016).

## Different — where it changes something already written

- **Prospect becomes a named state.** The register currently has Property, Lead and
  dated Ownership only. This adds Prospect (potentially every U.S. address) ahead of
  Lead, explicitly out of scope for Phase 1. That is a useful narrowing and should be
  recorded as such so nobody builds address ingestion early.
- **Warranty as a post-project state** is new; the closeout period was not modelled.
- **Offer history as versioned snapshots** is stronger than "leads and offers exist".
  Complete Offer becomes an append-only event, which puts offers on the same
  never-rewritten footing as the ledger.

## Missing — what this introduces that nothing in the app represents yet

Nothing in the database today holds any of it. There is no property, address, lead,
company, project, job, job order, charge, offer, or workflow-task table. The objects
this document requires:

- Address / Property (anchor), with locked source and entry date
- User provenance (source, entry date, activating actor) on the person record
- Lead: date, source, ISR/LC context, state, need/status, duplicate handling
- Offer with versioned completed snapshots, plus invited/accepted milestones
- Pending Project, Project, Project ID, estimated-vs-actual economics
- Job (selling price) → Job Orders (material, labor, turnkey, equipment) with an
  Open → Assigned → Complete → Verified → Closed lifecycle
- Other Charges (selling price and cost), separate from Jobs
- Workflow Tasks generated from State + Need, with actor, created and completed events
- Field-lock rules tied to workflow events

## Questions that must be answered before the object model is cut

1. Does a Project ID exist in JobNimbus today that SiteBMS should adopt as the shared
   identifier, or does SiteBMS mint its own and map to JobNimbus?
2. Is income recognition at Job close a real accounting rule RRCA follows today, or a
   proposal? It determines whether the ledger writes a revenue event there.
3. Who owns the address record and what may a property owner erase? (C16 — still an
   input to the Connecticut Agreement, still unanswered.)
4. Duplicate-address override: who is authorized, and is the override itself an event
   on the record?

## Smallest next sprint — documentation only, no schema

1. Record this handoff as `docs/RECORDS-MODEL.md`: the state machine
   (Prospect → Lead → Pending Project → Project → Warranty), the object list above with
   the minimum fields named here, the Job/Job Order/Other Charge economics, the
   State + Need → Task rule, and an explicit "requirements in progress" header.
2. Add ADR-018: the address-centred state machine — one record changes state; Complete
   Offer is an append-only snapshot; provenance is locked at entry.
3. Update the open-items register: close nothing, add the Prospect scope limit, the
   Warranty state, the four questions above, and the field-lock matrix as deferred.
4. Leave the locked work order intact. No migration, no tables, no UI in this sprint —
   the Connecticut Agreement and questions 1–4 still gate the first migration.

When the legacy ClaimExpress screenshots arrive, they get reconciled against
`docs/RECORDS-MODEL.md` rather than against the codebase, which has nothing to compare.
