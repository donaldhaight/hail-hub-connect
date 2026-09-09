# Capture the Kimosabe.ai Funnel Rulings — Documentation Only

This session settled several architectural questions while pressure-testing the
Kimosabe.ai → App Home → market-entry funnel. You asked me to capture as we go.
No application code changes.

## What was ruled

1. **The front door is open to anyone.** Kimosabe.ai admits any arrival with a
   question. Filtering happens later, at certification — not at the door.
2. **ISR/LC is not the destination.** It is the first paid position built, not
   the purpose of the building. Onboarding is indoctrination into *holding a
   file* — identity, wallet, ledger, guide.
3. **Property Owner is a real position now**, alongside ISR and LC. A homeowner
   who arrives and asks holds a file; their property has a condition.
4. **Property is the anchor record.** An address persists across owners, storms,
   claims, and contractors. Leads, claims, and jobs are events attached to it.
   Person and Property are two spines joined by **dated ownership**, which is the
   "applicable relationship" a Property Owner brings when they have no company.
5. **Leads arrive from three sources, deliberately:** the front door (inbound
   self-identifiers), the storm-targeting engine (inferred, trade secret), and
   affiliate funnels (purchased). Provenance and consent are first-class fields
   on every lead, not notes.
6. **Conduct history is core, but not a product.** Nobody is certified in the
   market — not even a Property Owner — without being tracked for a **Task
   Efficiency Rating: rank versus average**. It is an internal spine, never sold.
7. **Affiliate position remains open** — member-with-a-file versus outside
   vendor is deliberately unsettled.

## Open questions this raises

- **Property record ownership.** A persistent record of a structure, its damage
  history, its claims, and its former owners is a surveillance asset before it
  is a service. The Connecticut Agreement must answer: who owns the property
  record, what the current owner may see and erase, and what may never be sold.
  Without this, the moat becomes the liability and reopens the capture risk.
- **Consent for storm-triggered outbound.** The targeting engine may stay
  secret; the consent record cannot — it must survive a subpoena, and the rules
  vary by state.
- **Task Efficiency Rating applied to consumers.** Rating a Property Owner is
  defensible operationally (an unresponsive homeowner costs everyone money) but
  carries obvious reputational risk if ever made visible. "Core but not a
  product" is the reconciliation — this needs to be written down as a hard
  boundary, not left as an implication.
- **Empty room risk.** A newly certified ISR still needs work on day one.
  Unresolved until the Property/lead objects exist.

## What I will write

Documentation only. No schema, no routes, no components.

- **`docs/DECISIONS.md`** — add **ADR-015: The Open Front Door and the Property
  Anchor**, recording rulings 1–7 above, with the affiliate question explicitly
  marked unsettled and the Task Efficiency Rating boundary stated as normative
  ("tracked for all certified positions; never sold, never exposed as a public
  score").
- **`docs/ARCHITECTURE.md`** — add a short section describing the two spines
  (Person, Property) joined by dated ownership, and lead provenance as a
  first-class attribute with three named sources.
- **`docs/OPEN-ITEMS.md`** — add the four open questions above to the unsettled
  register; note that Property-record ownership and consent are now **inputs to
  the Connecticut Agreement**, not downstream of it.
- **`mem://index.md`** and a new **`mem://structure/property-anchor`** memory —
  so these rulings survive into later sessions and other platforms.

## What stays unchanged

- The locked work order: **Draft Connecticut Agreement → Records/Object Model →
  SiteBMS → JobNimbus mapping → API/MCP.** Property-as-anchor does not jump the
  queue; it becomes a requirement the agreement must satisfy.
- ADR-014 and the authority formula.
- `docs/SPRINTS.md` and the Saga chapters, which remain historical record.

## Technical notes

No migrations, no server functions, no route changes. Four markdown files and
two memory writes. Nothing in `src/` is touched.
