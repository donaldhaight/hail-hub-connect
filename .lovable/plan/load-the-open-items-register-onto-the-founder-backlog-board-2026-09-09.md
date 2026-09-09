# Load the open-items register onto the founder backlog board

The founder backlog board (`backlog_items`, Backlog tab in the founder console) predates the open-items register and was never fed from it. This pass loads every outstanding line from `docs/OPEN-ITEMS.md` onto the board so the To Do list is workable in-app, and sets the rule that keeps them in sync from now on.

## What you'll see

- The Backlog tab goes from ~19 early-sprint items to a complete picture of open work: ISR/LC activation, ClaimExpress protocol, Records layer gaps, Connecticut Agreement questions, RoofLac, Referraltor, the PO app, held items, and unsettled decisions.
- Every line carries its register ID (A22, C34, etc.) and source document in its detail, so board and register cross-reference instead of drifting apart.
- Existing board items are untouched; nothing is duplicated (checked by title against current rows before insert).

## Mapping

| Register state | Board status |
|---|---|
| `open` (specified, unbuilt) | `planned` |
| `needs verification` | `planned` (flagged in summary) |
| `held` (deliberately waiting, with reason) | `parked` (reason in detail) |
| `unsettled` (decision, not build work) | `idea` (framed as "Decide: …") |

Categories added to the board's vocabulary: `Records Layer`, `Connecticut Agreement`, `ISR / LC`, `ClaimExpress`, `Property Owner`, `RoofLac / SelfInsurity`, `Referraltor`, `Decisions`.

## The standing rule (documented)

From this pass forward: when a sprint opens new work, the line lands in `docs/OPEN-ITEMS.md` **and** on the board in the same turn; when work ships, both close together. This rule is added to `docs/PROTOCOL.md` so any future session (any LLM) follows it.

## Technical notes

- One SQL insert pass against `backlog_items` (table, RLS, and founder-only functions already exist — no schema or code changes). Rows are stamped with the founder's user id and `sprint_label: "Register load 2026-09-09"`.
- A handful of board items from early sprints are now superseded (e.g. items the register marks shipped or re-scoped); those get status corrections, not deletion — the board keeps history.
- `docs/OPEN-ITEMS.md` gains one line at the top noting the board mirror exists; the register remains the document of record.
- Verification: re-query the board counts by category/status and confirm the founder console Backlog tab renders the new groups.
