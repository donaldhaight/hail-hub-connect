# Open Items Register

The standing list of everything opened and not yet closed. Compiled 2026-09-09 from `docs/REQUIREMENTS.md`, `docs/DECISIONS.md`, `docs/STRATEGY.md`, the dated planning notes in `.lovable/plan/`, and a direct audit of the running application.

This register does not duplicate status held elsewhere; it points at it. When a line closes, close it in its home document and strike it here.

**Status vocabulary:** `open` (specified, unbuilt) · `held` (deliberately paused, with a reason) · `unsettled` (no decision yet) · `needs verification` (behaviour unconfirmed).

## Locked work order

Nothing in this register may be picked up out of sequence. The order was locked at the DH Method checkpoint (`docs/DH-METHOD-CHECKPOINT-2026-09-09.md:145`):

> Draft Connecticut Agreement → Records / Object Model → SiteBMS walkthrough → JobNimbus mapping → API/MCP

The Draft Connecticut Agreement is the gate. Nothing is modeled ahead of it.

---

## A. Specified but unbuilt

| # | Item | Home | Status | What closes it |
|---|---|---|---|---|
| A1 | Wallet claim on certification | `docs/REQUIREMENTS.md:90-101` (Epic 7, R-1) | open | Claim-on-sign-in is now wired (see E2, closed). What remains is the claim *at certification*, which follows the role fee flow |
| A2 | ISR App Home book of work | Epic 7, R-2 | open | Owner describes the ISR screens; role area is built and empty |
| A3 | Commission ledger for ISR/LC | Epic 7, R-3 | open | Records layer defines the commission object |
| A4 | LC approval surface | Epic 7, R-4 | open | Connecticut Agreement defines LC authority |
| A5 | ISR / LC / Property Owner visibility matrix | Epic 7, R-5 | open | Authority rule applied per record |
| A6 | Confirm band-3 targeting is unreachable from operating roles | Epic 7, R-6 | open | Redaction audit against `docs/PROTOCOL.md:199-210` |
| A7 | ClaimExpress object and state model | `docs/REQUIREMENTS.md:103-113` (Epic 8, P-1) | open | `docs/CLAIMEXPRESS.md` does not exist yet |
| A8 | Versioned `/api/public/claimexpress/*` endpoints | Epic 8, P-2 | open | Follows A7 |
| A9 | MCP tool surface | Epic 8, P-3 | open | Follows A7 |
| A10 | Transition audit trail on the shared record | Epic 8, P-4 | open | Follows A7 |
| A11 | Redaction review of the protocol surface | Epic 8, P-5 | open | Follows A7–A10 |
| A12 | Full-text extraction of uploaded documents | `docs/REQUIREMENTS.md:86` (E-7) | open | Populate `extracted_text` at upload so search reaches inside files |
| A13 | GitHub backup verification | `docs/REQUIREMENTS.md:71` (D-6) | open | One confirmed restore test |

## B. Held on purpose

| # | Item | Reason held | Lifted by |
|---|---|---|---|
| B1 | Founder notification emails (`src/lib/email.ts:1`, `src/lib/dossier.functions.ts:245`) | No verified sending domain — functions are working no-ops | Verifying a sender domain; one line per send point (ADR-006) |
| B2 | Attendee confirmation and update emails (`docs/REQUIREMENTS.md:58`, C-5) | Same as B1 | Same as B1 |
| B3 | Quantum Dashboard / Situation Room expansion | ADR-012 — building the whole engine in public would teach competitors to rebuild it | A superseding ADR only |
| B4 | Storm targeting and outreach engine | Built; confined to band 3, never demonstrated whole | Not intended to lift; the confinement is the decision |
| B5 | Payments and sponsorship transactions | Out of scope for this phase (`docs/REQUIREMENTS.md:122`) | A phase decision |
| B6 | February 2027 logistics, delegate credentialing, seat-right instruments, Agenda2028 ratification text | Can wait for 02-14-2027 (`docs/STRATEGY.md:53-58`) | Second Congress planning |
| B7 | Blog, social, SEO, paid, press | Forbidden before 11-1-2026 (`docs/STRATEGY.md:288-295`) | Launch day |
| B8 | Agenda2032 and Agenda2036 volumes | Declared, deliberately unwritten — runway, not placeholders | Later seasons |

## C. Unsettled — must not be assumed in code

| # | Question | Recorded at |
|---|---|---|
| C1 | Profit versus non-profit for the platform business | `docs/STRATEGY.md:374`, `docs/ARCHITECTURE.md:205`, ADR-013 |
| C2 | Legal shape and final name behind "Market Applications (TBD)" | same |
| C3 | The 2008–2012 original plans and their assumed legalities | same |
| C4 | The economic model assigned to origination funnels | same |
| C5 | Gratitude Ranch as February venue at 300 | `docs/STRATEGY.md:314-334` |
| C6 | What the broadcast production actually requires | same |
| C7 | Ticket cap size | same |
| C8 | Whether Agenda2024 is written before or after First Congress | same |
| C9 | What is said publicly on 11-2 | same |
| C10 | Whether the seven brand names surface at First Congress | same |
| C11 | Seat-right / PSL sponsorship instruments | same |
| C12 | Pricing, take rate, settlement mechanics | `src/content/dossiers.ts:97` — currently shown to insiders labelled OPEN |
| C13 | Whether Hurricane Beryl is the permanent demonstration scenario or a stand-in | `.lovable/plan/hold-season-1-notes-incoming-2026-08-30.md:17` |
| C14 | What Nav, Search, Add, Role Settings and Account Settings contain, role by role | Alignment check, 2026-09-09 — intentionally undefined extension points |
| C15 | Company and project assignment as first-class objects | ADR-014 consequence; cannot be modeled before the Connecticut Agreement |

## D. Deliberately empty in the app

| # | Surface | Where | Note |
|---|---|---|---|
| D1 | Every operating role's own area | `src/routes/_authenticated/app/role.$roleKey.tsx:95-112` | The door and the lock are proven; the room is unfurnished by design. Nothing invented to fill it. |
| D2 | BooksForge, MusicApp, MovieApp, MyGPT.TV | `src/components/apphome/AppShell.tsx:9,202-209` | Footer labels marked "· soon"; inert text, no routes behind them |
| D3 | Vision page component statuses | `src/routes/vision.tsx:26-51` | "Conceptual — not implemented" is the content, not a defect |
| D4 | Investor figures | `src/routes/investors.tsx:87` | Labelled as founder assertions pending diligence |
| D5 | Simulated dossier material | `src/routes/_authenticated/insider/dossier.$slug.tsx:178`, `src/content/dossiers.ts:41` | Illustrative pending real-data ingest |

## E. Loose ends found in the audit

| # | Item | Where | Status |
|---|---|---|---|
| E1 | Six working server functions are finished but connected to no screen | see below | needs verification |
| E2 | ~~Wallet claim is not wired.~~ **Closed 2026-09-09.** The front door promised that an anonymous file would be attached to the person's wallet on sign-in; `claimWallet` existed and was complete but had zero call sites. Now called once on every authenticated arrival by `useWalletClaim` (`src/hooks/useWalletClaim.ts`), mounted in the authenticated layout (`src/routes/_authenticated/route.tsx:15`). The anchor key is shared from `src/lib/wallet.schedule.ts` so the two ends cannot drift. A failed claim leaves the anchor in place and retries on the next visit; it never blocks entry. | `src/hooks/useWalletClaim.ts` | closed |
| E3 | Seat-event history unused | `src/lib/conference.functions.ts:164` (`listConferenceSeatEvents`) | open — decide: surface it or remove |
| E4 | A person's own dossier-open history unused | `src/lib/dossier.functions.ts:41` (`listMyDossierOpens`) | open — same |
| E5 | Manual edit log unused | `src/lib/manual.functions.ts:127` (`listManualEdits`) | open — same |
| E6 | Referral counts by referrer unused | `src/lib/referrals.functions.ts:245` | open — same |
| E7 | Referrals by referrer unused | `src/lib/referrals.functions.ts:318` | open — same |
| E8 | Inert leftover expression in task detail | `src/routes/_authenticated/app/tasks/$taskId.tsx:120` | open — harmless, remove on next touch |

E2 is the only line in this register that may represent a broken user-facing promise rather than unbuilt work. It should be resolved before the next build step, independent of the locked work order.

## F. Superseded, retained for history

- ADR-013's two-administration model, superseded by ADR-014 (`docs/DECISIONS.md:144-146`).
- The original "all three must be true" authority wording, corrected the same day to "Role + applicable Relationship + applicable Assignment".
- Sprint 2.8 and the Saga chapter *The Second Mind* keep the original rulings as written; they are the historical record and are not amended.

---

*Maintenance: this file is regenerated by audit, not by hand-editing status in place. When a line closes, close it in its home document first.*
