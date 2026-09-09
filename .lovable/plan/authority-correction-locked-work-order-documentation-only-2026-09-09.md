# Authority Correction + Locked Work Order — Documentation Only

Two corrections relayed from ChatGPT via the founder. Both are right; both land on the normative record. No application code changes.

## Correction 1 — Work order is explicit and legal-first

The next phase runs in this fixed sequence:

```text
Draft Connecticut Agreement
  -> Records / Object Model (derived from the agreement's rules)
  -> SiteBMS operating walkthrough (Construction Manager perspective)
  -> JobNimbus mapping (Phase 1 system of record)
  -> API/MCP surface
```

The legal/operating rules generate the object model. Nothing is modeled ahead of the Agreement.

## Correction 2 — Authority formula: applicable, not conjunctive

ADR-014 item 4 currently reads "All three must be true for an operating permission." That is wrong as stated: a Property Owner can hold project authority with no company relationship. Corrected rule:

**Authority = Role + applicable Relationship + applicable Assignment.**

Relationship and Assignment are applied only where the actor's position calls for them. The three terms remain the complete ingredient set; they are not a mandatory triple.

### Design consequence for the Records layer
People who act on records without a company (Property Owner, insurer contact, inspector, official) must be first-class actors with project-scoped authority. Relationship and Assignment axes are optional per actor, never backfilled with placeholder company rows.

## Edits

### 1. docs/DECISIONS.md — ADR-014, item 4
Replace "All three must be true for an operating permission" with the applicability rule, plus a one-line clarification note: corrected the same day on external review (ChatGPT reconciliation), with the Property Owner example.

### 2. docs/ARCHITECTURE.md — authority rule (line ~182)
Same wording change to keep the architecture doc and the ADR identical.

### 3. Project memory — core rule
Update the authority line to: "Authority = Role + applicable Relationship + applicable Assignment; axes apply only where the actor's position calls for them; permissions are record-scoped, never menu-scoped."

### 4. docs/DH-METHOD-CHECKPOINT-2026-09-09.md — status addendum
One line under the closed status: ruling 4 refined to the applicability form on same-day external review; normative wording lives in ADR-014.

### 5. Leave untouched (historical record)
- `docs/SPRINTS.md` Sprint 2.8 entry — a dated log of what was ruled that morning.
- The Saga chapter *The Second Mind* — it narrates the rulings as issued; the correction is part of the same day's story and lives in the ADR.
- Archived plans under `.lovable/plan/`.

## Next after this
Founder supplies the Draft Connecticut Agreement -> derive the Records/Object Model from its rules -> Construction Manager (SiteBMS) walkthrough -> JobNimbus mapping -> API/MCP.
