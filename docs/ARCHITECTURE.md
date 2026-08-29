# Architecture

This document maps the ClaimStore Briefing Room as a system: what the user sees, what the founder sees, how the boundaries are gated, and how data moves.

## Design posture

The site is intentionally understated. It reads like a private transaction memorandum, not a consumer app. The visual system is documentary and restrained: warm off-white paper, charcoal ink, deep navy accent, silver rules. Serif display (Instrument Serif) for headings, neutral sans (Inter) for body, mono for micro-labels.

## High-level boundaries

```text
┌─────────────────────────────────────────────────────────────┐
│                        PUBLIC LAYER                         │
│  /                          — front door                     │
│  /why-rrca                  — case for RRCA                  │
│  /industry-problem          — market fragmentation           │
│  /proof-of-concept          — concept brief                  │
│  /vision                    — long-form vision               │
│  /founder                   — founder note                   │
│  /prepare-america           — conference application         │
│  /request-briefing          — briefing request form          │
│  /prepare-america/confirmed — token-gated attendee page      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED LAYER                      │
│  Requires Google OAuth + role assignment                     │
│                                                              │
│  Founder Admin:                                              │
  │    /admin/inbox    — triage requests, invitations, itinerary │
  │    /admin/signals  — insider engagement dashboard            │
  │    /admin/digest   — daily rollup                            │
  │    /admin/edits    — dossier edit audit log                  │
  │    /admin/reads    — section-level read heatmap              │
  │                                                              │
  │  Qualified Insider:                                          │
  │    /insider        — dossier index                           │
  │    /insider/dossier/$slug  — reader + Q&A + notes            │
  │    /insider/accept — token redemption for invitations        │
  │    /insider/refer  — peer nomination form                    │
└─────────────────────────────────────────────────────────────┘
```

## Route conventions

TanStack Start uses file-based routing. Routes live in `src/routes/`. Pathless layouts use the `_` prefix. The root layout is `src/routes/__root.tsx`.

- Public leaf routes are flat files (e.g. `request-briefing.tsx`).
- Authenticated routes share the `src/routes/_authenticated/route.tsx` gate.
- Admin routes are under `src/routes/_authenticated/admin/`.
- Insider routes are under `src/routes/_authenticated/insider/`.

## Authentication and authorization

- **Auth provider:** Lovable Cloud (Supabase Auth) with Google OAuth enabled.
- **Sign-in page:** `/auth`.
- **Authenticated gate:** `src/routes/_authenticated/route.tsx` checks for a session and redirects to `/auth` if absent.
- **Role system:** Roles are stored in `public.user_roles`, separate from the auth users table. The `app_role` enum currently has `founder_admin` and `qualified_insider`.
- **Role check:** Server functions and RLS policies use the security-definer `public.has_role(_user_id uuid, _role app_role)` function to avoid recursive RLS.
- **Invitation flow:** Founders issue `insider_invitations` tokens. Recipients redeem at `/insider/accept`, which assigns the `qualified_insider` role.

## Data model summary

### Roles
- `user_roles` — one row per user-role pair. RLS: users can read their own roles; service/admin writes are server-side.

### Front-door intake
- `briefing_requests` — inbound requests for a private briefing.
- `conference_applications` — inbound applications for PrepareAmerica; includes seat status, plus-ones, hotel/dietary fields, and a unique `access_token` for the private attendee page.
- `briefing_request_events` and `conference_seat_events` — audit logs for status changes and notes.

### Insider room corpus
- `dossiers` — dossier metadata (title, summary, confidentiality, truth default, story order).
- `dossier_sections` — sections within a dossier (heading, body, truth label, position).
- `dossier_notes` — founder annotations tied to a dossier/section.
- `dossier_messages` — insider Q&A threads tied to a dossier/section.
- `dossier_edits` — audit log of corpus changes (before/after values).
- `dossier_attachments` — file/link evidence attached to a dossier/section; stored in private `dossier-artifacts` bucket.
- `dossier_attachment_opens` — per-user attachment open events for engagement analytics.
- `dossier_section_reads` — per-user section dwell time and explicit read confirmation.
- `insider_access_log` — per-user dossier open events.
- `insider_referrals` — peer nominations submitted by insiders; founder triage converts approved referrals into invitations.

### Invitations and itinerary
- `insider_invitations` — single-use tokens linking to a briefing request, conference application, direct seed, or approved referral.
- `conference_itinerary_items` — agenda entries; public read for published items, full CRUD for founder admin.

### Platform ledger
- `ledger_tokens` — JBK (JoeBack) and ClaimCoin with pegged value, peg note, and active flag. Pegs are data, so a change is auditable.
- `ledger_wallets` — one wallet per holder. `kind = 'interested_user'` wallets belong to an anonymous device anchor; `kind = 'marketapp'` wallets belong to a certified user. `claimed_at`/`claimed_from` record the attachment.
- `ledger_entries` — append-only. Database triggers reject every UPDATE and DELETE and validate direction/amount. Balances are always summed from entries, never stored.
- Writes happen only through server functions using the service-role client; the browser never proposes an amount. Read access is founder admin, qualified insider, or the wallet's own user.
- Surfaces: `/kimosabe` (public Interested User wallet and its ledger) and `/ledger` (founder/insider feed across all wallets).


### Access pattern
- Public reads use a narrow publishable Supabase client (`src/lib/attendee.functions.ts`).
- Authenticated server functions use `requireSupabaseAuth` middleware and the user's own RLS context.
- Founder-only operations check `has_role(auth.uid(), 'founder_admin')` in both server functions and RLS policies.

## Key server-function modules

- `src/lib/briefing.functions.ts` — public briefing request submission.
- `src/lib/conference.functions.ts` — public conference status and founder seat management.
- `src/lib/attendee.functions.ts` — token-gated attendee page reads/updates.
- `src/lib/itinerary.functions.ts` — founder itinerary CRUD, public published list.
- `src/lib/inbox.functions.ts` — founder inbox data and triage actions.
- `src/lib/insider.functions.ts` — invitation lifecycle and redemption.
- `src/lib/dossier.functions.ts` — dossier corpus, notes, messages, activity, and edit audit.
- `src/lib/section-reads.functions.ts` — section-level dwell tracking and read-heatmap aggregation.
- `src/lib/attachments.functions.ts` — attachment CRUD, signed URLs, and open analytics.
- `src/lib/referrals.functions.ts` — referral submission, founder triage, and funnel analytics.
- `src/lib/wallet.functions.ts` — Interested User wallet resolution, earns, entry payment, the claim/merge, and the founder ledger feed. Helpers in `src/lib/wallet.server.ts`; the earn schedule and entry price in `src/lib/wallet.schedule.ts`.


## Public API and webhooks

- `src/routes/sitemap[.]xml.ts` — server-generated sitemap for public routes.
- `public/robots.txt` — excludes admin, insider, and private attendee pages.
- No external webhooks are configured yet.

## Email

Email templates and send stubs live in `src/lib/email.ts`. They are currently no-ops because no sender domain has been verified. Once a domain is connected through Lovable Cloud Email, the stubs can be activated without changing call sites.
