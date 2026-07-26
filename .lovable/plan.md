# Sprint 0.4 — Founder Inbox

Email sender domain is deferred. Submissions already persist to Lovable Cloud, so we can move forward with the private review surface now and wire notification emails later when you set the domain up.

## What to build

1. **Auth**
   - Enable email + password sign-in (magic link can be added later).
   - Add Google as a secondary option via the Lovable broker (configured same turn).
   - Public `/auth` route (sign in only — no public sign-up for the admin surface).

2. **Roles**
   - `app_role` enum: `founder_admin`, `counsel`, `viewer`.
   - `has_role()` security-definer helper already exists from Sprint 0.3.
   - Seed your founder account with `founder_admin` after first sign-in (one-time SQL, using the email you sign in with).

3. **Protected route: `/_authenticated/admin/inbox`**
   - Gated by the managed `_authenticated` layout.
   - Server functions (all `requireSupabaseAuth` + `has_role('founder_admin')` check):
     - `listBriefingRequests({ status?, interest?, search? })`
     - `getBriefingRequest(id)` — full record + event history
     - `updateBriefingRequestStatus(id, status, note)` — writes to `briefing_request_events`
     - `listConferenceApplications(...)` — mirror shape
     - `updateConferenceApplicationStatus(id, status, note)`

4. **Inbox UI (documentary aesthetic, matching current tokens)**
   - Two tabs: **Briefing Requests** · **PrepareAmerica Applications**.
   - Table columns: date, name, organization, title, interest, status.
   - Filter chips by status; text search over name/email/org.
   - Row click opens a right-side detail panel: full context, acknowledgement, internal notes textarea, action buttons (Approve / Decline / Reset to Pending for briefings; Invite / Confirm / Decline for conference).
   - Every action writes an audit event with actor + note.
   - CSV export of the current filtered view.
   - Confidentiality chip `C2 · Restricted Diligence` on the page header.

5. **Email hooks (stubs now, live later)**
   - Add a `notifyFounder(requestId)` and `notifyApplicant(requestId, template)` helper that no-ops with a console note until the domain is verified.
   - When you complete email setup, we flip a single switch to route through `sendLovableEmail` — no UI rework needed.

## Deferred until you set up email
- Founder notification on new submission.
- Applicant auto-reply on submission.
- Reply-from-inbox composer.

## Decisions I'll assume unless you say otherwise
- **Login:** email + password for you, Google as a convenience option.
- **Insider gate:** manual — approval in the inbox does not auto-grant anything yet; that unlocks in Phase 1.
- **Conference threshold:** no extra criteria; open to referred insiders, triaged in the inbox.
- **Screens:** build the functional inbox now with current tokens; retrofit visuals when you send screens.

## Technical notes
- New files: `src/routes/auth.tsx`, `src/routes/_authenticated/admin/inbox.tsx`, `src/lib/inbox.functions.ts`, `src/lib/inbox.schemas.ts`, `src/components/admin/*` (table, detail panel, filter bar).
- New migration: add `app_role` values if missing, plus indexes on `briefing_requests(status, created_at)` and `conference_applications(status, created_at)`.
- Server functions use `requireSupabaseAuth`; every handler re-checks `has_role(userId, 'founder_admin')` before returning data.
- Google OAuth configured via `supabase--configure_social_auth` in the same turn.
- No changes to public routes or existing capture flow.

Approve and I'll build it.
