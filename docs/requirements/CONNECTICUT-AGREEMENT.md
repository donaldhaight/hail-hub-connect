# Draft Connecticut Agreement — requirements in progress

> **Status:** in progress · **Class:** C3 · **Last revised:** 2026-09-09  
> Legal and operating rules that generate the object model. Not a legal draft.  
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

**Status: requirements in progress. Nothing here is a legal draft.**

This document collects the legal and operating rules that the shared SiteBMS record must enforce. It is the input to the object model, not a consequence of it. The locked work order remains:

```text
Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping → API/MCP
```

Each section below states a rule the agreement must address, maps it to existing open items or decisions, and notes the specific question that still needs an answer before the record can be modeled.

---

## 1. Parties and authority

The platform is not a single-vendor product sold to insurers. It is a shared record operated by Market Applications, TBD and governed through Stakeholder Groups, with RRCA as the Founding Sponsor and first operator of the Construction Management Group.

Parties expected in the Connecticut operating context:

- **Property Owner** — a real position, not a contact. Owns the structure and has rights against the record about it.
- **Independent Sales Representative (ISR)** — the first certifiable role. Completes offers and may sell RoofLac.
- **Licensed Contractor (LC)** — accepts offers, opens projects, performs work, recognizes income.
- **Construction Manager / RRCA** — one entity role under ADR-014; narrower duties are assignments, not separate roles.
- **Market Applications, TBD** — platform operator. Does not replace SAS A, SAS B, or SiteBMS.
- **SelfInsurity** — carrier relationship for RoofLac / Lifetime Roof Assurance.

**Authority rule** (ADR-014):

> Authority = Role + applicable Relationship + applicable Assignment.

A Property Owner may hold project authority with no company relationship. A Construction Manager may also be a Licensed Contractor, but the formula must still produce a determinable answer.

**Open item:** C33 — how the authority formula bites when CM and LC are the same company.

---

## 2. Property record ownership and transfer

The system is centred on a persistent Address / Property record joined to a persistent Person identity by dated ownership. The record describes a structure, its damage, its claims, its offers, and its former owners. That makes it a surveillance asset before it is a service.

The agreement must decide:

- Who owns the record at each state: Lead, Pending Project, Project, Warranty.
- What the current owner may see and correct.
- What the current owner may erase.
- What may never be sold or deleted, even with consent.
- Who inherits the file when the property is sold, and what the former owner keeps.
- How erasure interacts with the append-only ledger and the append-only offer snapshot rule (ADR-018).

**Open items:** C16, C34, C36.

---

## 3. Consent and provenance for outbound contact

Every address in the system carries provenance: front door, targeting engine, or affiliate funnel. Consent is a first-class field, captured on the record, not in a note.

The agreement must decide:

- What consent standard applies when storm-triggered outbound contact is initiated.
- Whether the consent covers only the quote, the continuing file, or both.
- What an ISR may truthfully tell a property owner at the door about how the address was obtained, without exposing band-3 targeting logic.
- Whether provenance may be overwritten after the record changes state. (ADR-018 says address and user provenance are locked.)
- What happens if consent is withdrawn after an offer is completed.

**Open items:** C17, C35.

---

## 4. Kimosabe memory and data retention

Kimosabe memory is partitioned (ADR-016):

1. **Anonymous session transcript** — attached to the device anchor before onboarding; discarded if unclaimed.
2. **Personal memory file** — owned by the person after onboarding; readable by its owner; not used for marketing or targeting.
3. **Role- and app-scoped memory** — requires the person's act to cross partitions.

The agreement must decide:

- What is retained before onboarding and for how long.
- What the personal memory file may contain, how it is retrieved, and how it is forgotten.
- Whether role-scoped memory re-enters the personal file, and under what conditions.
- The minimum retention period for any record that also sits on the append-only ledger.

**Open item:** C24.

---

## 5. Offer snapshots and field locking

Complete Offer is an event, not a save. On that event the system records a versioned snapshot of the offer information, including date/time and actor/source. Later changes do not erase the completed offer.

Minimum locked fields (ADR-018):

- Address source/provenance.
- User source/provenance.
- Completed-offer snapshot.

The agreement must decide:

- Which parties can complete an offer: ISR-side, LC-side, or both.
- Whether more than one offer may exist in history, and who may see prior offers.
- What fields beyond the minimum are locked by which events.
- Whether "Offer Accepted" and "Pending Project" are one event or two.
- What happens if an offer is completed in error.

**Open items:** C30, C31, plus the field-locking matrix in A27.

---

## 6. Project economics and income recognition

A Project consists of Jobs and Other Charges. A Job has a Job Selling Price and contains Job Orders. Job Orders follow approximately Open → Assigned → Complete → Verified → Closed. Once the required Job Orders close, the Job may close, and the Job Selling Price is recognized as income to the Licensed Contractor.

The agreement must decide:

- Whether income recognition at Job close is a real RRCA accounting rule today or a proposal being tested.
- What verification is required for a Job Order to close: one person, multi-party, photographic, or other.
- What happens to estimated values after Project Open: discarded, retained for variance, or both.
- How additional orders and change orders append to actuals without overwriting prior values.
- How Other Charges are treated for income recognition.

**Open item:** C27.

---

## 7. JobNimbus boundary and shared identifiers

JobNimbus remains the Phase 1 system of record for existing operating job/project data. SiteBMS does not duplicate JobNimbus; it decides what must happen and records that it happened.

The agreement must decide:

- Whether JobNimbus provides a Project ID that SiteBMS adopts as the shared identifier, or SiteBMS mints its own and maps to JobNimbus.
- Which data belongs in the shared SiteBMS record.
- Which data is mirrored from JobNimbus.
- Which data is referenced only by JobNimbus identifier.
- Which workflow events SiteBMS owns.
- Which events must be sent to or received from JobNimus, and in which direction.

**Open items:** C26, C28.

---

## 8. Dispute resolution and the ledger as evidence

The ledger is append-only. It serves operational trust among the parties and watcher confidence among stakeholders. No admin can rewrite history.

The agreement must decide:

- What a ledger entry proves and who can rely on it.
- How disputes about record contents are resolved.
- Whether the ledger survives account closure, company withdrawal, or platform operator change.
- What the minimum retention period is.
- How the ledger interacts with any right to erasure under Section 2.

---

## 9. RoofLac and the ISR's second motion

The ISR's work has at least two motions: completing an offer for an LC, and selling RoofLac / Lifetime Roof Assurance for SelfInsurity. The second motion is the thing the competition scores.

The agreement must decide:

- Whether RoofLac rides on the same property record or opens a second record joined to it.
- What the ISR is authorized to say and commit on behalf of SelfInsurity.
- How RoofLac sales are scored, compensated, and attributed.
- How the Game / Season / League / Product layer above roles counts these motions.

**Open items:** C21, C22, C32, C20.

---

## 10. Referraltor and affiliate provenance

Referraltor is a proposed role, not yet in force. It sits near the affiliate question: is an affiliate a member holding a file or an outside vendor?

The agreement must decide:

- How someone earns the Referraltor designation.
- What authority, benefits, and ledger attribution come with it.
- How affiliate-sourced leads are treated differently from platform-sourced or targeting-engine leads.

**Open items:** C19, C23.

---

## 11. Questions to resolve before drafting

These are not yet decisions. They are the questions the founder or counsel must answer before a real agreement can be written.

1. Does the Property Owner sign one platform agreement, or separate agreements for insurance quote, RoofLac, and restoration work?
2. Does the ISR operate as an independent contractor of the platform, the LC, or both?
3. What state law governs consent for storm-triggered outbound contact, and does the agreement need state-specific riders?
4. What is the minimum retention period for the ledger, and does it survive account closure?
5. How are affiliate-sourced leads treated differently from platform-sourced or targeting-engine leads?
6. What verification standard closes a Job Order: one person, multi-party, photographic, or other?
7. Is income recognition at Job close a real RRCA accounting rule today, or a proposal?

---

*Next: once these rules are supplied or resolved, the object model is cut from this document. Until then, no schema, migration, UI, or API work follows from it.*
