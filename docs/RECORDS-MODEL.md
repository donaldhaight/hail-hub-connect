# Records Model — requirements in progress

**Status: requirements in progress. Nothing here is final.** No field list, lock rule,
workflow state, or revenue treatment in this document is settled. It is the operating
model as described by RRCA on 2026-09-09, written down so the object model can be cut
once, with everything in view.

Source: *RRCA SiteBMS — Minimum Records Requirement Handoff* (2026-09-09).

This document does **not** move the locked work order:

**Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping → API/MCP**

No migration follows from this file. Four questions (§9) and the Connecticut inputs
(C16, C17, C24) still gate the first table.

---

## 1. Core principle

The system is centred on a **persistent Address record** and a **persistent User
identity**. Neither becomes a new record because the workflow state changed. The same
underlying record changes state over time:

```text
Prospect → Lead → Pending Project → Project → Warranty
```

These are workflow states or business labels on one continuing, address-centred record.
"Warranty" is a placeholder name for the post-project state and may change.

## 2. Provenance

The source of the Address and the source of the User are preserved and **locked**. They
are not casually overwritten later in the workflow. The record must always answer:

- where the address came from;
- where the user came from;
- when each entered the system;
- which person or system created or activated the record.

This is the same first-class provenance rule ADR-015 set for leads, extended to the
address and the person.

## 3. Prospect — named, and out of scope for Phase 1

Long term a Prospect may represent every address in the United States. **That capability
does not exist and Phase 1 does not assume it.** Today records generally begin as Leads.

Future address-data integration may support *Claim Your Address*. Bot protection, bulk
activation, duplicate handling, and address ownership are unresolved future requirements.

## 4. Lead

A Lead may enter from many sources. Minimum retained:

- date entered
- source (provenance, per §2 and ADR-015: front door, targeting engine, affiliate)
- associated user / ISR / LC context
- workflow state
- current Need / Status

**Duplicate-address handling** is a required behaviour. The current business process may
detect an existing address, show a disclaimer, and permit an authorized override. Exact
duplicate rules are undefined (see §9 Q4).

## 5. Offer

Either an authorized ISR-side or LC-side user may complete an Offer.

**Complete Offer** is an event. On that event the system records a **versioned snapshot**
of the offer information, including date/time and the acting source/actor. Later changes
never erase a completed offer — the offer history is append-only, on the same footing as
the ledger.

Related milestone events:

- Offer Complete
- Property Owner Invited
- Property Owner Accepted

More than one Offer may exist in the history of a record.

## 6. Pending Project → Project

**Pending Project** is the period after an Offer is accepted but before all project
details are settled.

A **Project** becomes Open when the details are settled and a **Project ID** is assigned.
At Project Open:

- actual project economics begin replacing estimates;
- Jobs are established;
- Other Charges are established;
- Job Orders are established;
- the workflow state becomes operational.

## 7. Project economics

A Project consists of **Jobs** and **Other Charges**.

- **Lead economics** — while the record is a Lead or pre-project, values are *estimated*.
- **Project economics** — once it is a Project, values are *actual*. Actuals are
  appendable through verified changes or additional orders, not casually overwritten.
  Accounting and versioning rules remain to be detailed.

### Jobs

A Job is a sellable scope / revenue unit within a Project.

- each Job has a **Job Selling Price**
- each Job may contain multiple Job Orders

### Job Orders

Cost / procurement / execution units beneath a Job. Initial types:

- Material
- Labor
- Turnkey
- Equipment

Anticipated lifecycle (names subject to refinement):

```text
Open → Assigned → Complete → Verified → Closed
```

The load-bearing principle is that **humans may verify work**. Once the required Job
Orders are Closed, the Job may Close, and the Job Selling Price is then recognized as
income to the Licensed Contractor per the applicable accounting rules (see §9 Q2 — it is
not yet confirmed whether this is RRCA's real rule today).

### Other Charges

Separate from Jobs and Job Orders. Each has an **Other Charge Selling Price** and an
**Other Charge Cost**.

## 8. Project Close and Tasks

When all Jobs and required project work are Closed the Project moves toward **Project
Close**. Closeout Tasks may remain after operational work is complete; when they are
satisfied the Project transitions to the post-project state currently called **Warranty**.

Tasks are generated from workflow conditions:

```text
State + Need → Task
```

A Task records: state; Need / Status; responsible actor; date/time created; completion
event; date/time completed. A human click or verified event updates the workflow state
and writes the next record of what happened. **Task generation from real operating events
is a major next-stage requirement** — today's tasks are onboarding tasks, not workflow
tasks.

## 9. Authority and field locking

Data-entry responsibility is shared initially by **LC Company Admin** and **ISR Admin**.
The LC App will later carry narrower operating permissions for production, estimating,
collections and other work. **These narrower duties are not new Stakeholder roles** —
they are assignments, per ADR-014.

Authority continues to follow the settled formula:

> **Authority = Role + applicable Relationship + applicable Assignment**

Some fields lock on workflow events, and a lock may apply even to the Licensed
Contractor after the relevant event. At minimum:

- address source/provenance is preserved;
- user source/provenance is preserved;
- Complete Offer creates a historical snapshot that is never overwritten.

**A complete field-locking matrix is deliberately deferred.**

## 10. Kimosabe inside this model

Each user's Kimosabe is expected to assist with, and increasingly automate, data entry,
workflow guidance, reminders and operational actions. Automation operates **within
explicit human authority** and never bypasses permissions, approvals, provenance, or
required verification. This is consistent with the memory partition rule (ADR-016):
crossing a partition requires the person's act, never an inference.

## 11. Phase 1 relationship to JobNimbus

JobNimbus remains the Phase 1 system of record for existing operating job/project data
where already established. SiteBMS does not rebuild JobNimbus to duplicate it.

The next design pass must identify:

- which data belongs in the shared SiteBMS record;
- which data is mirrored from JobNimbus;
- which data is referenced only by JobNimbus identifier;
- which workflow events SiteBMS owns;
- which events must be sent to or received from JobNimbus.

## 12. Open questions gating the object model

| # | Question |
|---|---|
| Q1 | Does a Project ID exist in JobNimbus today that SiteBMS should adopt as the shared identifier, or does SiteBMS mint its own and map to JobNimbus? |
| Q2 | Is income recognition at Job close a real accounting rule RRCA follows today, or a proposal? It determines whether the ledger writes a revenue event there. |
| Q3 | Who owns the address record, and what may a property owner see or erase? (C16 — an input to the Connecticut Agreement, still unanswered.) |
| Q4 | Duplicate-address override: who is authorized, and is the override itself an event on the record? |

## 13. Reconciliation against the current application

Nothing in the database holds any of this yet. There is no address, property, lead,
company, project, job, job order, other charge, offer, or workflow-task table. The
existing tables serve the briefing, manual, conference, insider, ledger, role and intake
surfaces — none of the operating record.

Consequently, **legacy ClaimExpress / Siteforum screens are reconciled against this
document**, not against the codebase, which has nothing to compare.

## 14. The same record, read from four sides

`docs/PERSPECTIVES.md` walks this model through its states four times — ISR, Licensed
Contractor, Property Owner, Construction Manager — and records where the readings
contradict each other. Those contradictions are open items C30–C36, and several are
inputs to the Draft Connecticut Agreement rather than consequences of it.

## 15. Connecticut Agreement as the next gate

Before the object model is cut, the legal and operating rules that govern the record
must be collected in `docs/CONNECTICUT-AGREEMENT.md`. It is the next step in the
locked work order.
