# ClaimStore Front Door — Next Sprints: Capture, Notify, Review

## Where we are
Phase 0.1–0.2 are complete: an eight-page public briefing site with a documentary/dossier aesthetic, truth/confidentiality badges, and a `/request-briefing` form that currently only logs to the console. There is no backend, auth, or email yet.

## Strategic anchor for the next move
Using the DH method, I’ll anchor the next phase on two proven patterns and then morph them toward your vision:
- **Garry Tan / YC funnel**: the front door is a high-signal, low-friction application that qualifies a small group of insiders.
- **Barry Diller / IAC rollup**: each later module (ClaimStore → ClaimsBank → ClaimLoan → ClaimCoin) becomes a vertical network that owns one transaction type in insurance restoration.

The next two sprints build the funnel. The funnel must work before the rollup can be seeded with the right people.

---

## Sprint 0.3 — Capture & Routing

**Goal:** Every `/request-briefing` and `/prepare-america` submission is validated, persisted, and reaches the founder.

### 1. Enable Lovable Cloud
- Activate Lovable Cloud on the project.
- This gives us Postgres, Auth, Storage, and managed email without external accounts.

### 2. Database schema
Create two public tables with RLS and proper GRANTs:

- `briefing_requests`
  - `id`, `name`, `email`, `organization`, `title`, `interest`, `context`, `acknowledged`
  - `status` enum: `pending` / `approved` / `declined`
  - `internal_notes`, `created_at`, `updated_at`
- `conference_applications`
  - Same shape plus optional `briefing_request_id` link
  - `status` enum: `applied` / `invited` / `confirmed` / `declined`
- `briefing_request_events` (append-only audit log)
  - `request_id`, `actor_id`, `action`, `note`, `created_at`

RLS policy design:
- `anon` can INSERT into both request tables.
- Only authenticated users with the `founder_admin` role can SELECT/UPDATE.
- `service_role` gets ALL for server-side admin work.

### 3. Server functions
- `submitBriefingRequest` (POST)
  - Zod validation, length limits, email normalization.
  - Rate limit: one submission per email per 24 hours.
  - Insert row, then send founder notification email.
- `submitConferenceApplication` (POST)
  - Same pattern, linked to a briefing request when applicable.

### 4. Email
- Use Lovable’s built-in managed email infrastructure.
- If you own a sender domain, configure it; otherwise we’ll use the default Cloud sender until a domain is added.
- Founder notification: "New briefing request from {name} at {organization}" with a direct review link.
- Applicant auto-reply: a short confirmation that the request was received and will be reviewed personally.

### 5. UI updates
- Replace the `console.info` stub in `/request-briefing` with a real server-function call.
- Add loading, success, and error states.
- Add client-side validation with Zod and clear error messages.
- Keep the existing design tokens and documentary tone.

### 6. Security & compliance
- All validation runs server-side; never trust the client.
- No PII logged to the browser console.
- CSRF protection remains via the existing `csrfMiddleware`.
- Confirmation copy contains no forward-looking claims, no pricing, no securities language.

---

## Sprint 0.4 — Founder Inbox

**Goal:** A private, auth-gated screen where the founder can review, approve, decline, and reply to requests.

### 1. Auth & roles
- Add Supabase Auth to the project.
- Create `user_roles` table with an `app_role` enum and a `has_role()` security-definer function (standard Supabase pattern).
- Seed one `founder_admin` account.
- No roles stored on profiles; all privilege checks happen server-side.

### 2. Protected admin route
- Route: `/admin/inbox` under the `_authenticated/` layout.
- Server functions:
  - `listBriefingRequests` — requires `founder_admin`.
  - `updateBriefingRequestStatus` — approve/decline with internal notes.
  - `sendApplicantReply` — compose and send a reply email to the requester.

### 3. Inbox UI
- Table view: name, organization, interest, status, date.
- Filters by status and interest.
- Detail panel with full request body and internal notes.
- Action buttons: Approve, Decline, Send Reply.
- Export to CSV for offline review.

### 4. Audit
- Every status change and reply is written to `briefing_request_events`.
- Events are append-only and readable only by admin roles.

---

## Design & legal invariants (carry forward)
- Keep the existing documentary aesthetic: warm off-white paper, charcoal ink, deep navy accent, Instrument Serif + Inter + JetBrains Mono.
- No crypto, vault, coin, futuristic-banking, or roofing-marketing imagery.
- Every material statement keeps its truth label; every private screen carries a confidentiality class.
- Persistent footer: "Confidential Working Concept — Not an Offering."
- No transaction paths, no pricing, no subscription, no securities language anywhere.

---

## Decisions needed before I start
1. **Sender domain:** Do you own a domain you want emails to come from? (e.g., `notify@claimstore.com` or `briefing@unitedstakeholders.us`). If not, we’ll use the default Lovable Cloud sender until you add one.
2. **Founder login:** Do you prefer magic-link email login or a password account for the admin inbox?
3. **Insider gate trigger:** Should an `approved` briefing request automatically unlock the qualified-insider gate, or will you invite people manually from the inbox?
4. **Conference threshold:** Should `/prepare-america` applications require any qualifying criteria beyond role/organization, or remain open to referred insiders?
5. **Screens:** You mentioned you want to provide screens. Should I wait for them before polishing the admin UI, or build the functional inbox first and retrofit the visuals?

---

## Suggested approval
If you approve, I’ll begin **Sprint 0.3**: enable Lovable Cloud, create the request tables, wire the form, and send a test notification. Sprint 0.4 follows immediately after.