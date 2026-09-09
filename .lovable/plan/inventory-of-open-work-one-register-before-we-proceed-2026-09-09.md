# Inventory of Open Work — one register before we proceed

Everything we have opened and not closed, gathered from the documents, the decisions, and the app itself. The output is a single new document, `docs/OPEN-ITEMS.md`, that becomes the standing register — nothing new gets built in this pass.

## Why a register

Open work is currently scattered across five places: requirement rows marked `open`, decision records marked `deferred`, a numbered open-questions section in the strategy document, dated planning notes, and empty states inside the app. No one place answers "what is outstanding." This creates it, and every future sprint closes lines in it rather than inventing new lists.

## What the register will contain

**A. Unbuilt work that is already specified**
- ISR / LC activation (Epic 7): wallet claim on certification, ISR book of work, commission ledger, LC approval surface, role visibility matrix. All six rows open.
- ClaimExpress protocol (Epic 8): object and state model, versioned public endpoints, MCP surface, transition audit trail, redaction review. All five rows open; the specification document itself does not exist yet.
- Text extraction from uploaded documents, so search reaches inside files.
- GitHub backup verification.

**B. Work held on purpose, with the reason and who can lift it**
- Founder and attendee emails — no-ops until a sending domain is verified. One line per send point.
- Quantum Dashboard / Situation Room expansion — held by ADR-012.
- Storm targeting and outreach — built, confined, never demonstrated whole.
- Payments and sponsorship instruments — out of scope for this phase.
- February 2027 logistics, delegate credentialing, Agenda2028 ratification text.
- Marketing channels — forbidden before 11-1-2026.
- Agenda2032 / Agenda2036 — declared, deliberately unwritten.

**C. Decisions still unsettled**
- Profit versus non-profit for the platform business.
- Legal shape and final name behind "Market Applications (TBD)".
- The 2008–2012 plans and their assumed legalities.
- The economic model on origination funnels.
- The seven strategy open questions (venue, broadcast production, ticket cap, Agenda2024 timing, what is said publicly on 11-2, whether the brand names surface at First Congress, seat-right instruments).
- Pricing, take rate, and settlement mechanics — currently shown to insiders as open.
- Whether Hurricane Beryl is the permanent demonstration scenario.
- What Nav, Search, Add, Role Settings, and Account Settings actually contain, role by role.

**D. Places in the app that are deliberately empty**
- Each role's own area is an empty room with a working door and lock, awaiting your description of the screens.
- BooksForge, MusicApp, MovieApp, MyGPT.TV appear in the footer marked "soon" with nothing behind them.
- The vision page describes components as conceptual — that is the content, not a defect.

**E. Loose ends found in the app that need your ruling**
- Six pieces of working back-end logic are finished but not connected to any screen: seat-event history, a person's own dossier-open history, the manual edit log, referral counts, referrals by referrer, and wallet claim.
- Wallet claim is the notable one: the front door tells a visitor their file will be claimed into their wallet when they sign in, and the logic to do it exists, but I could not find the place that calls it. This needs verification before the next build — it may mean the promise on the front door is not currently kept.
- One inert leftover line in the task detail screen.

**F. Work order already locked**
Draft Connecticut Agreement → Records / Object Model → SiteBMS walkthrough → JobNimbus mapping → API/MCP. Restated at the top of the register so the inventory never becomes a menu to pick from out of order.

## Format

Each line carries: what it is, where it lives (document or screen), why it is open, and what would close it. Grouped as above. No status invention — a line is `open`, `held`, `unsettled`, or `needs verification`.

## Technical notes

- New file `docs/OPEN-ITEMS.md`; no application code changes.
- Existing requirement, decision, and sprint documents stay as they are; the register cross-references them rather than duplicating status.
- One verification step, read-only: trace the wallet claim path to confirm whether the claim-on-sign-in promise is wired. The finding is recorded in the register either way.
- Optionally, after you have read it, the same lines can be loaded into the founder backlog board so they are workable in-app. Say the word and that becomes a second pass.
