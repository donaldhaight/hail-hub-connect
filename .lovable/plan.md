# Sprint 0.18 — Access Polish + Private Tour

Three related pieces, in one sprint because they all touch the same surface (how a human actually gets into and understands this app).

## Part A — Sign-in affordance in the header

Today `/auth` is unlinked. Fix:

- Add a small **"Sign in"** link in the header (desktop + mobile menu), visible only when signed out. Muted styling — it stays understated and does not compete with the "Request a Private Briefing" CTA.
- When signed in, the existing Digest/Inbox links already show; add a compact **"Sign out"** control alongside them that calls `supabase.auth.signOut()` and navigates to `/`.
- No change to the primary nav items — public pages stay as-is.

## Part B — Password reset flow

- Add a **"Forgot password?"** link on `/auth` (email/password mode only).
- New public route `/reset-password` that:
  - Detects `type=recovery` in the URL hash.
  - Renders a "set new password" form.
  - Calls `supabase.auth.updateUser({ password })` and redirects to `/admin/inbox` on success.
- Wire `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${origin}/reset-password })` from the forgot-password action.
- Add `/reset-password` to `robots.txt` disallow list (same as other private surfaces).

## Part C — Private illustrated tour ("How this app works")

A single signed-in-only page that walks a viewer through everything built in Phase 0, with real screenshots and short explainers written in the same documentary voice as the dossiers.

**Route:** `/_authenticated/admin/tour` (founder-only via existing `_authenticated` gate; not in sitemap; noindex).

**Structure — five acts matching the load-bearing story order:**

1. **The Front Door** — `/`, `/why-rrca`, `/industry-problem`, `/proof-of-concept`, `/vision`, `/prepare-america`, `/founder`, plus the new `/investors`, `/policy`, `/why-prepare-america`. One screenshot each, one paragraph explaining who it's aimed at and what job it does.
2. **Capture & Triage** — `/request-briefing` and the conference application form → `/admin/inbox` (all four tabs: Briefing, Conference, Discussion, Referrals, Invitations, Itinerary). Explains the funnel from anonymous visitor → qualified insider.
3. **The Insider Room** — `/insider` (dossier index with NEW badges), `/insider/dossier/$slug` (reader with section truth chips, read receipts, attachments, Q&A), `/insider/refer`. Explains the confidentiality model and read-depth instrumentation.
4. **Founder Intelligence** — `/admin/digest`, `/admin/signals`, `/admin/reads` heatmap, `/admin/edits` corpus history. Explains what each signal means and how to act on it.
5. **Conference Operations** — Capacity meter, seat lifecycle, `/prepare-america/confirmed` attendee page, itinerary editor. Explains the 300-seat cap and token-gated attendee access.

**Screenshot generation (build-time, not runtime):**

- Playwright script under `scripts/generate-tour-screenshots.ts`:
  - Signs in as founder via injected Supabase session.
  - Seeds a small scoped demo dataset (2-3 briefing requests, 1-2 conference apps in each seat state, 1 insider with a few dossier reads and one Q&A message, 1 referral). All rows tagged with a `demo_tour` marker so they're deleted at the end.
  - Visits each route at 1440×900, captures PNG to `src/assets/tour/{act}-{slug}.png`.
  - Tears down demo rows.
- Screenshots are committed as static assets and imported into the tour page — the page itself does no runtime capture.
- Re-run the script manually when the UI changes materially (documented in `docs/SPRINTS.md`).

**Header link:** Add a small **"Tour"** link next to Digest/Inbox for signed-in founders only.

**Documentation:**

- Add Sprint 0.18 entry to `docs/SPRINTS.md`.
- Add `REQ-ACC-*` and `REQ-TOUR-*` entries to `docs/REQUIREMENTS.md`.
- ADR in `docs/DECISIONS.md`: "Tour is private, screenshots are build-time static assets" (rationale: avoids exposing private UI publicly, avoids per-request Playwright cost, keeps the page fast and SSR-safe).

## Confidentiality

- Tour page: C2 chip + "Confidential Working Concept — Not an Offering" footer (inherited from `PageShell`).
- `robots.txt`: add `/reset-password` and `/admin/tour` to Disallow (already covers `/admin/*`, so tour is fine; reset-password is new).

## Explicitly out of scope

- Public "how it works" marketing page (can be a later sprint if you want a redacted external version).
- Video walkthrough (screenshots + prose only for now).
- Email templates for password reset (Supabase default template is used; custom templating is a separate sprint).

## Deliverables checklist

- [ ] Header: Sign in link (signed-out), Sign out + Tour link (signed-in)
- [ ] `/auth`: Forgot password link
- [ ] `/reset-password` route
- [ ] `robots.txt` updated
- [ ] `scripts/generate-tour-screenshots.ts` + first run committed to `src/assets/tour/`
- [ ] `/_authenticated/admin/tour` page with five acts
- [ ] `docs/SPRINTS.md`, `REQUIREMENTS.md`, `DECISIONS.md` updated
- [ ] Typecheck + build clean; manual verification of sign-in, reset request, and tour page
