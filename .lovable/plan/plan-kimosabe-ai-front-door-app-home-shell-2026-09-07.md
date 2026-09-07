# Plan: Kimosabe.AI Front Door + App Home Shell

## Why now

The verify workflow is complete: Interested Users arrive via `/request-briefing` (Kimosabe front door), land in the founder queue, and the Founder grants a Stakeholder Group tag + optional entity role (ISR). Wallet claim happens on redemption. But a newly granted user currently lands on generic authenticated surfaces — the role-wearing App Home described by the Founder does not yet exist. Build the destination before extending the machinery (LC, ClaimExpress protocol).

## What we will build

### 1. Kimosabe.AI front page (`/kimosabe` rework)
- Bare, Google-like front page: wordmark, one search field, one button. No login required, no public nav chrome.
- First interaction creates/reuses the anonymous device anchor + holding wallet (already built in the Interested User ritual) and routes into the onboarding path.
- Visually distinct from PrepareAmerica.com mission door: blank-page minimal, its own brand feel within the design-token system.

### 2. App Home shell (`/app`) — authenticated, all roles
- **Header** (one bar): nav menu (upper left), search, **New** (creates role-appropriate records), Role Settings (with Switch Roles link), Account Settings.
- **Tasks strip** directly under the header: the workflow toll booth — pending tasks with links to one-task and all-tasks views. Seeded with onboarding/verification tasks per role.
- **Supported feed** below tasks: a direct line to Kimosabe guidance (monitored, one-user channel — explicitly not a community).
- **Footer app switcher**: MarketApp (links to Role Store), BooksForge, MusicApp, MovieApp, MyGPT.TV posted as "coming soon".
- Same building, two scales with the Situation Room: App Home is one person's desk; `/room` remains the operator wall.

### 3. Role-shaped nav menus
- Nav menu contents derive from the user's roles: Interested User (no grant), Verified Member, ISR, founder_admin.
- Granting a role in the founder queue visibly changes the App Home the user receives.

## Explicitly out of scope (held)
- LC role curriculum/design (same certification pattern as ISR, later).
- ClaimExpress protocol / API-MCP work.
- System Management System authoring surface (Founder Dashboard remains its seed).
- Quantum Dashboard targeting engine (per ADR-012 pause; redaction boundaries unchanged).

## Technical notes
- New public route rework: `src/routes/kimosabe.tsx`; new authenticated shell: `src/routes/_authenticated/app.tsx` (+ nav config module keyed by role from `user_roles` / `role_enrollments`).
- Tasks strip backed by a lightweight tasks source (reuse existing tables where possible; no new ledger concepts).
- Feed is read-mostly guidance content; no community features, no moderation surface.
- All authenticated data through `requireSupabaseAuth` server fns; public Kimosabe page stays SSR-safe with no protected loader.
- Head metadata for the new public page per project SEO rules.
