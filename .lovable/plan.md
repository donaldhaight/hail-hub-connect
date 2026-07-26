# Sprint 0.6 — Close the Conference Loop + Insider Room Shell

Phase 0 has a briefing funnel but the PrepareAmerica conference tab in the founder inbox is empty because no public form writes to `conference_applications`. This sprint closes that loop and lays the first real content shell for the insider room so approved insiders land on something intentional, not placeholders.

## Goals

1. Public conference application flow that feeds the existing inbox tab.
2. Founder-side triage parity with briefings (approve → optional insider invite).
3. First real Insider Room shell: a documented index of the working artifacts (still gated, still labeled as drafts) instead of four generic placeholder cards.

## Scope

### 1. PrepareAmerica application form (public)
- Add a "Request to attend" section on `/prepare-america` with an application form: name, title, organization, email, category (Executive / Investor / Contractor / Government / Advisor), referral source, why-attend note.
- New server fn `submitConferenceApplication` in `src/lib/briefing.functions.ts` mirroring `submitBriefingRequest`: Zod validation, 24h rate limit by email, writes to `conference_applications`.
- Success/failure states matching the briefing form UX.

### 2. Founder inbox parity
- Conference tab already lists rows; add the same detail-panel actions the briefing tab has: status updates with audit note, internal notes editor, and — for `confirmed` status — an optional "Issue insider invite" button reusing `grantInsiderAccess` (extended to accept a `conferenceApplicationId` variant, or a thin wrapper that creates the invitation from the application record).
- Extend `insider_invitations` usage so an invite can be sourced from either a briefing request or a conference application (add nullable `conference_application_id` column; keep existing behavior unchanged).

### 3. Insider Room shell (`/insider`)
- Replace the four generic placeholder cards with a real "Working Dossier Index" reflecting the master vision:
  - RRCA Restructuring — Case Study
  - ClaimExpress — Operational Layer
  - ClaimStore — Network Thesis
  - USA Foundry — ClaimsBank / ClaimLoan / ClaimCoin
  - PrepareAmerica Conference — Agenda & Attendees
- Each entry: title, one-line thesis, confidentiality chip (C2/C3), truth chip (DRAFT / SIMULATION), "Not yet released" state. No document bodies yet — that's Phase 1.
- Add a top strip showing the viewer's role (`qualified_insider` vs `founder_admin`) and the standing "Confidential Working Concept — Not an Offering" reminder.

### 4. Housekeeping
- Head metadata pass on `/prepare-america` to match the new form (unique title + description, `noindex` stays off — this page is public).
- Header link to `/prepare-america` confirmed reachable from the front door.

## Out of scope (deferred)
- Email activation (waiting on your sender domain).
- Any real dossier content behind `/insider` (Phase 1).
- Payments / ticketing for the conference.

## Technical notes
- Migration: `ALTER TABLE insider_invitations ADD COLUMN conference_application_id uuid REFERENCES conference_applications(id)`; keep `briefing_request_id` nullable; CHECK that exactly one source is set. Preserve existing GRANTs and RLS.
- `submitConferenceApplication` is a public server fn (no `requireSupabaseAuth`), same shape as `submitBriefingRequest`.
- Inbox conference actions call existing `updateConferenceStatus`; add `grantInsiderAccessFromConference({ conferenceApplicationId })` alongside the existing briefing variant to keep call sites explicit.
- No changes to auth, `_authenticated` gate, or the managed Supabase client files.

After this sprint the front door has two working intake lanes (briefing + conference), the founder can triage and invite from either, and insiders see a real (if empty) working index instead of placeholders.
