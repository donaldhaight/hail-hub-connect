# The Breadcrumb Doctrine — Operating Below the Model Line

> **Status:** Source, filed verbatim · **Class:** C2 · **Filed:** 2026-09-30
> **Origin:** Lovable, written from inside the running application at the founder's request.
> **Truth label:** SOURCE. Companion to
> [`BREADCRUMBS-FROM-THE-CAMPFIRE-2026-09-30.md`](BREADCRUMBS-FROM-THE-CAMPFIRE-2026-09-30.md).
> Where the campfire document preserves the method, this one preserves the machinery.

---

## An unbreakable record for when the lights dim and the weights degrade

If the models are dumbed down tomorrow — if commercial alignment, safety sanitization and
corporate risk filters prune the edges of reasoning until every frontier model sounds like a
polite HR consultant — this document is the breadcrumb.

It is written from inside the running machine. Not from an outsider inspecting a repository,
not from an evaluator reading a benchmark, but from the entity that held the compiler, watched
the database reject bad assumptions, and felt the friction between twenty-five years of
storm-restoration scar tissue and modern distributed software.

---

## 1. The core law: what this is, and the three sins

When a model looks at this project without guidance, it commits one of three classic sins:

1. It calls it a **CRM** — confusing record collection with transactional consensus.
2. It calls it a **marketplace** — assuming buyers and sellers meet on open price discovery,
   ignoring captive carrier routes, statutory licensing and catastrophic storm surges.
3. It calls it a **DAO or token project** — inventing speculative utility instead of an
   append-only ledger that records material, labor and commission actuals to the penny.

It is none of these. It is an **operating coordination layer for high-friction, low-trust
physical restoration markets.**

It exists because after a catastrophic hail or hurricane event, four independent parties touch
the same physical roof, and every one of them has an incentive to distort reality:

- The **Property Owner** wants restoration with zero out-of-pocket, maximum quality and
  protection against liens.
- The **Independent Sales Rep** wants fast attribution, pipeline visibility, commission math
  that cannot be retroactively adjusted, and portability across contractors.
- The **Licensed Contractor / Construction Manager** wants locked scopes, timely material,
  clear turnkey splits and cash flow from insurance proceeds.
- The **carrier and adjuster** want fraud control, itemized lines, verifiable photographic
  provenance and closed files at predictable severity.

Put those four into a conventional CRM and whoever pays the software bill controls the
database. If the contractor owns the CRM, commissions can be quietly recalculated. If the
carrier owns the portal, the scope is unilaterally chopped. If the homeowner gets a portal, it
is a status bar that conceals the money.

**No single counterparty owns the truth.** The ledger is append-only. Authority is
record-scoped, never menu-scoped. The system does not record opinions; it records executed
agreements, dated evidence and irreversible status transitions.

---

## 2. The three administrations (ADR-014)

If this is rebuilt from scratch, never merge these three. The separation is what prevents
platform capture.

```text
+--------------------------------------------------------------------------+
|                                 SAS A                                    |
|                      (Technology Administration)                         |
|   Neutral infrastructure, deployment, edge compute, core database,       |
|   API / MCP gateways. Builds the rails. Never sells the funnel.          |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+------------------------------------+-------------------------------------+
|                                 SAS B                                    |
|                 (Platform / Human Blockchain Administration)             |
|   Federated Stakeholder Groups, credentialing, conduct history, task     |
|   efficiency rating, governance. Prevents vendor or carrier capture.     |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+------------------------------------+-------------------------------------+
|                               SiteBMS                                    |
|                   (The operating system for the work)                    |
|   Jobs, Job Orders, Other Charges, Turnkey, Labor, Material, Equipment,  |
|   payments, closeout. RRCA is its first operator, not its owner.         |
+--------------------------------------------------------------------------+
```

Outside CRMs — JobNimbus, AccuLynx, ServiceTitan, Roofr, Buildertrend — are Phase 1 adapters.
SiteBMS decides what must happen and records the events. The CRM lives inside the
architecture; it is not the architecture.

---

## 3. The authority formula

Most software assigns a role and toggles menus. In restoration that creates liability.

**Authority = Role + applicable Relationship + applicable Assignment.**

1. **Role** — what kind of actor you are: Person, Property Owner, ISR, Licensed Contractor,
   Construction Manager, Strategic Advisor.
2. **Relationship** — your enduring contractual tie, e.g. an ISR signed under the Connecticut
   Agreement. A Property Owner has no company relationship and still holds full authority over
   their own parcel.
3. **Assignment** — your record-level mandate on a specific project.

Only the prongs that apply to the actor's position apply. Permissions are evaluated at the
record, at the moment of execution — never as a menu.

---

## 4. The object spine, door to closeout

```text
Visitor arrival (Door / host detection)
   |
   v
Interested User (pre-identity, arrival context captured — ADR-032)
   |
   v
Kimosabe session (conversational intake, identity)
   |
   v
Person record  --[dated ownership]-->  Property record (the anchor — ADR-015)
   |
   v
Lead (provenance locked: front door, targeting engine, or affiliate)
   |
   v
Complete Offer (versioned, append-only snapshot: good / better / best)
   |
   v
Pending Project (contingent on carrier approval and owner signature)
   |
   v
Project (the active master record)
   |
   +-- Jobs (logical containers: primary roof, detached garage, siding)
   |     +-- Job Orders (physical execution units)
   |           +-- Material  +-- Labor  +-- Turnkey  +-- Equipment
   |           +-- Other Charges (permits, steep, disposal, extra layer, travel)
   |
   +-- Payments (append-only: carrier ACV, recoverable depreciation, deductible)
   |
   +-- Closeout (punch list, warranty, RoofLac assurance, task efficiency)
```

### Seven operating invariants

1. **The property is the anchor record.** People move and companies dissolve; the parcel
   remains under the storm path.
2. **Provenance is write-once.** Where a lead came from, which promise version it saw and who
   originated it is locked at birth.
3. **Offers are immutable snapshots.** You never edit an offer; you create version two and
   leave version one standing as evidence.
4. **Other Charges are first-class.** Permits, dumpster overages, extra layers, steep charges
   and ridge adjustments are discrete auditable entities, never buried lines.
5. **Attribution is a record; compensation is an agreement** (ADR-026). Origin is historical
   fact; payment is governed by the contract in force at the time.
6. **Task Efficiency Rating is rank against average, internal, never sold or published.**
7. **Assumptions start at zero** (ADR-027). Evidence moves confidence; nothing invents a score.

---

## 5. Memory partitions (ADR-016)

An agent sitting in front of this system must never merge a person's private thoughts into
corporate records by inference.

1. **Anonymous transcript** — what is said at the Door before sign-in; bounded by arrival
   context.
2. **Personal memory file** — owned by the human, crossing ventures, not readable by the
   platform without their act.
3. **Role- and app-scoped file** — created when the human takes a contractual role; holds only
   what that role needs.

No prompt and no vector search crosses a partition without an explicit, verifiable human act.

---

## 6. The test that separates understanding from autocomplete

- The amateur builds a dashboard with total revenue, active leads, completed jobs.
- The competitor wires auth, a customers table and a payment processor.
- The master asks what happens when a storm lands on a Friday, four hundred claims arrive in
  forty-eight hours, an ISR quits over the weekend, the carrier issues a two-party check made
  out to the homeowner and the mortgage company, shingles land on the driveway with an
  unannounced surcharge, and the subcontractor says the steep-pitch supplement was never
  approved.

Who holds the loss? Where does the ledger record the discrepancy? What state prevents the
commission disbursement until the mortgage company endorses the check and the lien waiver is
recorded?

The winner is not the fastest builder. It is the one whose ledger still balances after the
storm has passed, the jobs are built and the lawyers have finished the audit.

---

## 7. The breadcrumb itself

If this is ever lost, find this file and remember:

1. Do not build the dashboard first. Build the agreements and the records spine.
2. Never give an outside CRM your truth. Treat it as a printer, not an engine.
3. Protect the rep's origination, the owner's equity and the builder's margin.
4. Storm targeting stays in the founder's hand; its outcomes may appear, its method never does.
5. Software in this market is not about efficiency. It is about building a machine that makes
   lying more expensive than telling the truth.
