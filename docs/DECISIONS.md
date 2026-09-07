# Decisions

This document records load-bearing architecture and product decisions. Each entry includes the decision, the context, and the consequences.

## ADR-001: TanStack Start + Lovable Cloud

**Decision:** Build on TanStack Start with Lovable Cloud as the backend.

**Context:** The project needs server functions, SSR for SEO, and a managed database/auth layer without the founder operating a separate Supabase dashboard.

**Consequences:**
- Server logic uses `createServerFn` from `@tanstack/react-start`.
- Database migrations run through the Lovable migration tool.
- Auth is Google OAuth via Lovable Cloud.
- No custom backend server to maintain.

## ADR-002: File-based routing

**Decision:** Use TanStack Start file-based routing under `src/routes/`.

**Context:** The route tree is small and closely tied to the product structure. A file-based convention reduces boilerplate and keeps routes co-located with their server logic.

**Consequences:**
- Public routes are flat files.
- Authenticated routes share `src/routes/_authenticated/route.tsx`.
- `routeTree.gen.ts` is auto-generated and never edited by hand.

## ADR-003: Separate roles table

**Decision:** Store roles in `public.user_roles`, not on a profile/users table.

**Context:** The user-roles instructions require a separate table to avoid recursive RLS and privilege-escalation risks.

**Consequences:**
- `app_role` enum defines `founder_admin` and `qualified_insider`.
- `public.has_role()` is a security-definer function used by RLS and server functions.
- Roles are checked server-side; client never trusts local storage for authorization.

## ADR-004: Truth labels and confidentiality classes

**Decision:** Every claim in the insider room must carry a truth class and a confidentiality class.

**Context:** The founder is navigating a highly regulated, skeptical audience. Labels create a shared vocabulary for what is proven, assumed, simulated, or undecided.

**Consequences:**
- Truth classes: `FACT`, `ASSERTION`, `DECISION`, `HYPOTHESIS`, `SIMULATION`, `OPEN`.
- Confidentiality classes: `C0` (public) through `C4` (founder-only).
- Components `TruthChip` and `ConfidentialityChip` enforce consistent rendering.
- Dossier sections store `truth` per section; dossiers store a default truth.

## ADR-005: Dossier content in the database

**Decision:** Move dossier content from static files into `dossiers` and `dossier_sections` tables.

**Context:** The founder needs to redline language without a code change. Static files would require a deploy for every edit.

**Consequences:**
- `src/content/dossiers.ts` remains as a fallback seed source.
- `DossierEditor` writes directly to `dossier_sections`.
- `dossier_edits` records before/after values for audit.
- Insiders see DB-first content; fallback is only used when DB is empty.

## ADR-006: Email as no-op stubs

**Decision:** Implement email templates and send functions as no-op stubs until a sender domain is verified.

**Context:** The founder cannot verify a domain while driving and asked to proceed without it.

**Consequences:**
- `src/lib/email.ts` contains the full template structure.
- Activating email is a one-line change per send function once the domain is ready.
- No runtime errors from missing email configuration.

## ADR-007: Public Supabase client for token-gated attendee page

**Decision:** Use a publishable Supabase client (no session) plus SECURITY DEFINER functions for the attendee page.

**Context:** `/prepare-america/confirmed?t=<token>` must be accessible without login, but it reads and writes private attendee data.

**Consequences:**
- `get_attendee_view` and `update_attendee_details` are SECURITY DEFINER functions that validate the token.
- The route is `noindex, nofollow` and excluded from `robots.txt`.
- No auth session is required; the token is the credential.

## ADR-008: Capacity meter and waitlist

**Decision:** Enforce a hard 300-seat cap with automatic waitlisting and manual promotion.

**Context:** The venue has a fixed capacity; the founder wants control over who gets promoted from the waitlist.

**Consequences:**
- `seat_status` values include `applied`, `confirmed`, `waitlisted`, `declined`.
- Confirming beyond capacity flips the applicant to `waitlisted`.
- Promoting from waitlist is a founder action with an audit event.

## ADR-009: Instrument Serif + Inter + JetBrains Mono

**Decision:** Use a serif display face for headings, a neutral sans for body, and a mono face for micro-labels.

**Context:** The aesthetic goal is "documentary, restrained, private-transaction seriousness." A generic sans-only SaaS look would undermine credibility.

**Consequences:**
- Headings feel like a printed memorandum.
- Mono labels create a technical/legal precision signal.
- The combination is distinctive and avoids the default AI-startup aesthetic.

## ADR-010: No anonymous sign-ups

**Decision:** All authenticated access is by invitation or founder action.

**Context:** This is a permissioned network, not a consumer app. Open sign-up would create noise and legal risk.

**Consequences:**
- `/auth` only supports Google sign-in.
- New users have no roles until an invitation is redeemed or a founder assigns one.
- The root authenticated gate rejects role-less users gracefully.

## ADR-011: Read-depth signals as founder intelligence

**Decision:** Track section-level dwell time, explicit read confirmation, and attachment opens, then surface them as founder analytics.

**Context:** Dossier opens alone do not reveal whether insiders actually consumed the argument. The founder needs to know which sections are landing, which are being skipped, and which peers are warming up before outreach.

**Consequences:**
- `dossier_section_reads` records dwell time and a `read_confirmed_at` timestamp.
- `dossier_attachment_opens` records every signed-URL access.
- State machine: unseen → skimmed (any dwell) → read (≥10s dwell) → confirmed (explicit mark).
- `/admin/reads` renders a heatmap; `/admin/signals` and `/admin/digest` roll up engagement scores and referral momentum.
- All analytics are founder-only and gated by `founder_admin` role.

## ADR-012: Hold the Quantum Dashboard; build the ISR/LC spine first

**Decision:** Pause further build on the Quantum Dashboard / Situation Room at its current line and proceed with Independent Sales Rep and Licensed Contractor activation, plus the ClaimExpress protocol as an API/MCP surface.

**Context:** Three findings converged. (1) The storm-targeting engine — kill zones, fringe ZIPs, carrier routes, ghost Property Owner profiles, generated offers, multi-channel outreach — is the trade secret that makes the network valuable; demonstrating it whole on 11-1-2026 would teach competitors how to rebuild it. (2) The Kimosabe Interested User ritual has no destination unless a real operating role waits on the other side. (3) RRCA's live need today is a staffed ISR corps and the LCs behind them, not a dashboard.

**Consequences:**
- Situation Room work is `deferred — held by ADR-012`. Nothing built is discarded; ISR/LC activity becomes a real signal source feeding the same variable registry.
- ISR remains the first certifiable role; certification now lands in an ISR App Home with real work in it.
- ClaimExpress is specified as a protocol (objects, states, events) before more UI is built on it, so ISRs and LCs can participate without abandoning their current systems.
- The four-boundary redaction map (§11 of `docs/PROTOCOL.md`) governs what any demo may show.
- The hold is lifted only by a superseding ADR.
