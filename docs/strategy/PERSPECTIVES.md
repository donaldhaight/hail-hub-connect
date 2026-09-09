# Perspectives — one record, four readings

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-09  
> One property record read four ways: ISR, LC, Property Owner, Construction Manager.  
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

**Status: requirements in progress. Nothing here is a decision.**

`docs/requirements/RECORDS-MODEL.md` says what the system holds. This document says what the same
record *feels like* from each side of it. One property, one continuing address-centred
record, walked four times — ISR, Licensed Contractor, Property Owner, Construction
Manager — through the states in ADR-018:

```text
Prospect → Lead → Pending Project → Project → Warranty
```

The purpose is not narration. It is to surface assumptions. A model that reads cleanly
from one side and awkwardly from another has an unmade decision inside it, and this is
the cheapest place to find it.

This document raises questions. It answers none. It does **not** move the locked work
order: **Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus
mapping → API/MCP.** No schema follows from it.

Where a reading needs a fact nobody has supplied, it says so rather than inventing one.

---

## The property

One address. Storm-damaged roof. It enters as a Lead, is offered on, accepted, opened as
a Project, worked, closed, and passes into Warranty. Every reading below is the *same
record* — not a copy, not a hand-off, not a new row.

---

## 1. The ISR reads it

**Arrival.** The address reaches the ISR from one of three provenances (ADR-015): the
open front door, the targeting engine, or an affiliate funnel. The ISR sees the address
and the fact that it is workable. Whether the ISR sees *which* provenance, and how much
of the reason behind a targeted address, is not decided — the targeting logic sits in
band 3 (`docs/law/PROTOCOL.md`), and an ISR is not the founder.

**At the door.** The ISR is standing in front of a person who did not ask to be a record.
Consent is captured here, on the record, as a first-class field — not a note. What is
being consented to is broader than a quote: it is a continuing file about a structure.

**Completing the offer.** Complete Offer is an event, not a save. The snapshot is
permanent (ADR-018). From the ISR's side this is the moment the work becomes real and
the moment their name is attached to something that can never be quietly amended.

**RoofLac.** Alongside the offer, the ISR carries the Lifetime Roof Assurance program for
SelfInsurity — the second motion, and the thing the competition scores (C21, C22).

**Assumptions surfaced**

- That the ISR may see an address before the owner has any relationship with the platform.
- That consent captured at the door covers the *record*, not only the quote.
- That the ISR's relationship to the record survives Complete Offer. Nothing says it does.
- That RoofLac attaches to this same property record rather than opening a second one.
- That the ISR is told enough about provenance to answer "how did you get my address?"
  truthfully at the door. Today they may not be.

---

## 2. The Licensed Contractor reads it

**Inheritance.** The LC receives a record already carrying an address, a person, a
provenance, a consent, and at least one completed offer snapshot — none of which the LC
authored and none of which the LC may rewrite. The LC's authority is
Role + applicable Relationship + applicable Assignment (ADR-014).

**Accepting.** Property Owner Accepted moves the record to Pending Project: accepted, not
yet settled. What must be true to leave that state is undefined — the model says "details
settled and a Project ID assigned" and stops.

**Opening.** At Project Open, estimates give way to actuals. Jobs carry selling price;
Job Orders (material, labour, turnkey, equipment) carry cost and run
Open → Assigned → Complete → Verified → Closed; Other Charges carry both.

**The uncomfortable part.** The LC works inside a record they do not own, alongside an
ISR they did not hire, on a property whose owner can see them. That is the design. It is
also the thing most likely to be resisted in the field.

**Assumptions surfaced**

- That "settled enough to open" can be expressed as a checklist. Nobody has written it.
- That the Project ID is the LC's, the platform's, or JobNimbus's (C26).
- That an LC will accept fields locked against them by an event an ISR triggered.
- That multiple offers in history are visible to the LC, including offers from other LCs.
  Nothing says whether they are.
- That estimated economics are discarded at Project Open, or retained beside actuals for
  variance. The 10% variance rule implies retained; the model does not say.

---

## 3. The Property Owner reads it

**Discovery.** The owner is invited to a record that already describes their home. Before
they arrive, the record may already hold an address provenance, a damage assessment, an
offer, and the name of a person who knocked. Their first experience of the platform is
being *told about themselves*.

**Position.** The owner is a real position, not a contact (ADR-015). They set the property
up once and can receive a free insurance quote, a RoofLac offer, and pre-estimated
good/better/best work (Epic 9) — subject to C25, whether that generator may face a
consumer at all.

**Warranty.** After close, the record does not end. To the owner, "Warranty" is the only
state that means anything in daily life — it is the promise that outlives the crew.

**The hard question.** What may they erase? A permanent file of a structure, its damage,
its claims and its former owners is a surveillance asset before it is a service (C16).
The owner's reading is the one that makes that unavoidable.

**Assumptions surfaced**

- That an owner will accept a record that predates their consent.
- That erasure is even possible against an append-only offer history and ledger. Those two
  rules are in direct tension and the tension is not resolved anywhere.
- That the record survives the sale of the house, and that the *next* owner inherits it.
  Nothing addresses transfer of ownership of the file itself.
- That the owner can see the ISR's and LC's conduct history. Conduct is "core but not a
  product" — visible to whom is undecided.
- That "Warranty" is a state of the record rather than an instrument the owner holds.

---

## 4. The Construction Manager (RRCA) reads it

**Position.** Construction Manager is one entity role (ADR-014). Production, estimating
and collections are assignments beneath it, not roles.

**Verification.** The CM's whole reading turns on one act: a human verifies that work was
done. Job Orders close on verification; when the required Job Orders close, the Job may
close; the Job selling price is then recognized as income to the LC.

**The boundary.** JobNimbus is the Phase 1 system of record for existing job/project data.
SiteBMS decides what must happen and records that it happened. Which field lives where,
and which events cross in which direction, is unwritten (C28).

**Assumptions surfaced**

- That income recognition at Job close is RRCA's actual accounting rule, not a proposal
  (C27). If it is real, the ledger writes a revenue event there; if not, it must not.
- That verification is one act by one person. Multi-party or photographic verification
  would change the object.
- That the CM and the LC are different parties on this record. When RRCA is both operator
  and contractor, the reading collapses and the authority rule is doing no work.
- That closeout tasks remaining after operational close have an owner. None is named.
- That a verified event is itself append-only, like the offer snapshot. Implied, not stated.

---

## 5. Where the readings disagree

These are the findings. Each is a decision nobody has made.

| # | Disagreement |
|---|---|
| 1 | **Ownership of the record by state.** The ISR reads it as theirs until the offer completes; the LC as theirs from acceptance; the owner as theirs always; the CM as the platform's. All four cannot be right. |
| 2 | **Erasure vs append-only.** The owner's right to erase (C16) and the permanence of offer snapshots and ledger entries (ADR-018) cannot both be absolute. |
| 3 | **Offer Accepted and Pending Project** — one event or two. The ISR reads acceptance as the finish line; the LC reads it as the starting gun. |
| 4 | **The ISR after the offer.** Whether any relationship, visibility or attribution survives Complete Offer. Compensation and the competition (C22) assume it does; the model is silent. |
| 5 | **RoofLac's home.** One record carrying an insurance instrument, or a second record joined to the property. |
| 6 | **CM and LC as the same party.** RRCA is the first operator *and* a contractor. The authority formula must still bite when both sides are one company. |
| 7 | **Provenance disclosure at the door.** What an ISR may truthfully tell a property owner about how the address was obtained, without exposing band-3 logic. |
| 8 | **Transfer on sale.** Who inherits the file when the property changes hands, and what the former owner keeps. |

Items 1, 2, 7 and 8 are inputs to the Draft Connecticut Agreement. Items 3, 4, 5 and 6
are object-model decisions and are added to `docs/work/OPEN-ITEMS.md` as C30–C33.

---

*Next: these readings are reconciled against the legacy ClaimExpress / Siteforum screens
when supplied, and against the Draft Connecticut Agreement when drafted. Nothing here is
built.*
