# Capture six forward concepts — documentation only

No application code changes. These six items are recorded now so they are visible before the ISR onboarding, ISR→LC connection, lead origination and assignment, and offer completion work begins. Each lands in the file that already owns its kind of statement, and each is filed at the point in the locked work order where it becomes actionable.

The locked work order is unchanged: **Draft Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping → API/MCP.** Everything below is either an input to that sequence or work that queues behind it.

## 1. Kimosabe memory — three stages, one file

Recorded as a new decision (ADR-016) with three explicitly separate memory stages, because they have different legal and technical rules:

- **Before onboarding.** Today the anonymous arrival gets a device anchor and a holding wallet only — nothing they say is retained. Ruling to record: pre-onboarding memory is a **session transcript attached to the anonymous anchor**, carried across at wallet claim, and discarded if never claimed. It is not a profile.
- **After onboarding, before a role.** A personal memory file on the person's record: what they asked, what they were told, what they did. Ruling: it belongs to the person, is readable by them, and is never merged into a marketing asset.
- **Inside a role.** Memory becomes role-scoped and app-scoped — an ISR's Kimosabe knows different things than a Property Owner's, and a future BooksForge Kimosabe different again. Ruling: memory is partitioned by role and by app, and crossing a partition requires the person's act, not an inference.

Best-practice research (retrieval design, retention windows, forget-me handling) is filed as open work, not decided here. Consent and retention become inputs to the Connecticut Agreement alongside C16/C17.

## 2. Role Store: ISR, LC, PO — and the missing game layer

Extends ADR-015. Three positions become visible in the Role Store, each with a distinct path: ISR *certifies*, LC *registers and verifies* (a license, a company, insurance), PO *sets up* (free, no fee, a property instead of a credential).

Noted and explicitly held for the owner to develop: **Game, Season, League, and Product are a missing layer** above roles. The Season Ladder already exists in strategy; how a role becomes a player in a season, and what a "Product" is in that frame, is unwritten. Filed as unsettled, not designed.

## 3. RoofLac / Lifetime Roof Assurance

Introduced as a named program with a home in the brand and product record: a lifetime roof assurance offering carried by SelfInsurity. What is written now is the concept, the carrier partner, and its position in the market — not pricing, not underwriting, not terms. Those are unsettled and must not be assumed in code.

## 4. The game: ISRs sell RoofLac, not just offers

Recorded as a strategy addition. Door-to-door ISR work today completes offers for LCs. The addition: ISRs also sell the RoofLac program for SelfInsurity, and **that sale is the competition** — the thing the season is scored on. Marked "more thought required": scoring, comp split between offer completion and program sale, and how a season ends are open.

## 5. Referraltor — a new market position

Filed as a proposed position with its questions open, not settled:
- How the designation is earned (earned by conduct, purchased, or granted).
- Whether it is a role, a relationship, or an assignment under the authority rule.
- Features, benefits, and how attribution is written to the ledger.
- Whether it resolves or collides with the unsettled affiliate question (C19).

## 6. The PO app

Recorded as the demand-side surface, described in outcome terms: a property owner sets up their property once and receives a free insurance quote, a roof program offer (RoofLac), and pre-estimated home-improvement projects in good / better / best form. Noted dependency: good-better-best offer generation currently sits in band 3 of the redaction map (founder-only). Publishing it to a consumer surface either requires a redaction review or a consumer-facing variant that reveals no targeting logic. Flagged, not resolved.

## Where each lands

| Concept | File | Form |
|---|---|---|
| Kimosabe memory, three stages | `docs/DECISIONS.md` | ADR-016 |
| Memory best practices, per stage and per role | `docs/OPEN-ITEMS.md` | new open items |
| Role Store: ISR / LC / PO paths | `docs/REQUIREMENTS.md` | Epic 7 stories |
| Game / Season / League / Product layer | `docs/OPEN-ITEMS.md` section C | unsettled |
| RoofLac / Lifetime Roof Assurance | `docs/STRATEGY.md` + `docs/OPEN-ITEMS.md` | program description + unsettled terms |
| ISRs sell RoofLac as the competition | `docs/STRATEGY.md` | strategy addition, marked open |
| Referraltor | `docs/DECISIONS.md` (proposed) + `docs/OPEN-ITEMS.md` | position with open questions |
| PO app | `docs/REQUIREMENTS.md` + `docs/OPEN-ITEMS.md` | epic outline + band-3 flag |
| Ordering against the locked sequence | `docs/OPEN-ITEMS.md` | placement in the work order |

## Technical notes

- Documentation only. No routes, components, server functions, schema, or migrations.
- ADR-016 is additive; ADR-013/014/015 are untouched.
- New open items continue existing numbering (A16+, C20+) rather than renumbering the register.
- `mem://index.md` gains one line for the memory-partition rule and one for the RoofLac/game concept, so a future session does not re-invent them.
