# Plan — Close Phase 2: Manual, Broadcast, and the Ladder in Admin

## Where the project actually stands

The Two Congress alignment is partly done. Verified this pass:

- The season ladder exists as data in `src/content/calendar.ts` (First Congress, Second Congress, Season 1, tiers, venue, capacity, convener).
- Tickets exist end to end: schema fields on `conference_applications`, credential-gated server functions, the private `/ticket/$credential` holder page, and the founder ledger at `/admin/tickets`.
- The Owner's Manual is real and substantial — 43 chapters across front matter, Parts I–V, three appendices, and a colophon.

Three gaps remain, and they are the whole of what's left in Phase 2.

**1. The manual predates the strategy.** There is no chapter on the two congresses, no chapter on the season ladder, and no chapter on the Siteforum platform — which is the single strongest risk answer in the project. Nine existing chapters still carry the retired vocabulary in their body text, including one titled "Confirmed Attendee Room."

**2. There is no broadcast page.** Nothing in `src/routes/` serves 1 November. A ticket holder who opens their credential today sees their ticket and nothing to attend.

**3. The founder inbox does not know tickets exist.** `/admin/tickets` is a separate ledger; `/admin/inbox` and `/admin/digest` still speak in conference seats. The ladder is legible in one screen and invisible in the two the founder actually lives in.

## Recommended order

Manual first, broadcast second, admin third. The manual is what the broadcast points at, so it has to be right before there is a page pointing at it. Admin is internal — it can trail the public surfaces without costing credibility.

## Sprint 2.2 — The manual becomes the broadcast artifact

Four new chapters, slotted into the existing numbering:

- **Part III — The Two Congresses.** What each occasion is for, the Continental framing, why the first is streamed and the second convened.
- **Part III — The Invitation Ladder.** Referral → ticket → invitation → delegate seat → Season One participant. States the mechanic plainly: you need an invitation to receive the invitation.
- **Part V — The Season Ladder.** Season 1 (1 Mar–30 Sep 2027), Season 2 after the 2028 Owners Meeting, Season 3 as the fully fueled launch. Winter Meeting dates rendered as "Super Bowl weekend," never a hardcoded day.
- **Part V — The Two-Track Platform.** Season 1 runs on the original Siteforum codebase, which already exists and has an operating history. Truth-labeled: codebase existence FACT, two-track governance DECISION, successor timeline HYPOTHESIS. Insider confidentiality.

Then a revision pass on the nine chapters whose bodies still say conference, attendee, or a physical 11-1 convening — including retitling "Confirmed Attendee Room" to "Delegate Room" and extending "The Seat Model" to carry the seat-license structure (Observer and Stakeholder tiers, what each grants, transfer terms). No pricing, no payment rails.

The existing `/manual/print` view picks the new chapters up automatically.

## Sprint 2.4 — The First Congress broadcast page

A new route at `/first-congress`, opened by ticket credential rather than login, so a holder needs nothing but their link.

- Before 1 November: a countdown, the run of show, the convener's seal, and a link into the Owner's Manual.
- On the day: a stream embed slot, ready for whatever provider we choose.
- After: the post-broadcast call to action — apply for an invitation to the Second Congress — plus the handoff note for delegates who advance into Season One.

Tier-aware. A Stakeholder holder sees their standing right to a seat; an Observer sees the application path.

## Sprint 2.3b — The ladder in the founder's daily screens

- `/admin/inbox` gains ticket tier and status per row, plus a one-click path to the ticket ledger, so a briefing request can be walked up the ladder without switching screens.
- `/admin/digest` reports the ladder as a funnel: requests in, tickets issued by tier, invitations extended, delegate seats confirmed against the 300 cap.
- Retire the remaining "conference seat" labels in admin copy.
- Confirm the public request form tags new rows with the current season so Season 2 reuses the same machinery.

## Technical notes

- New manual chapters land through the migration tool as inserts into `manual_chapters`, matching the existing part and position scheme; revisions to the nine legacy chapters are updates to `body` and `title`.
- `/first-congress` reads the credential from a query parameter and calls the existing `get_ticket_view` function — no new table, no new policy.
- Every date on every new surface reads from `src/content/calendar.ts`. No date is written into a component.
- Election-cycle and liquidity-event framing stays C3 and insider-only, per the strategy memo.

## What this does not touch

No pricing, no payments, no ICO mechanics, no Agenda microsites, and no change to the seven brand front doors. The successor operating platform stays out of scope — this site's job is still to hand qualified people to the platform that already exists.
