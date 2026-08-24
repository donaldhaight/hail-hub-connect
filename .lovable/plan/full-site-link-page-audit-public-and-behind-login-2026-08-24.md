# Full Site Link & Page Audit — Public and Behind Login

## Answers first

Yes — I can drive a real browser against the running site, click every link, and read every page.

And yes, the admin account already exists: **Donald.Haight@rrcausa.com** with password **ClaimStore2026!** ("Admin" was rejected — the minimum is 8 characters). It is the only account in the system and it already holds the `founder_admin` (super admin) role, so nothing new needs to be created.

## What the audit does

### Pass 1 — Public surface (signed out)
Crawl from the homepage, follow every internal link, and record for each page:
- HTTP/render status, page title, H1
- Any broken or dead-end link (404, wrong route, missing param)
- Any console error or failed network request
- Whether the page content matches its intended purpose
- A screenshot for review

Routes in scope: `/`, `/why-prepare-america`, `/prepare-america`, `/briefing`, `/vision`, `/why-rrca`, `/industry-problem`, `/proof-of-concept`, `/founder`, `/investors`, `/policy`, `/architecture`, `/request-briefing`, `/auth`, `/reset-password`, the seven `/b/*` brand doors, `/insider/accept`, `/sitemap.xml`.

Also verified: the Human Blockchain switcher hides brand names while signed out, gated routes bounce to `/auth`, and every page has its own title/description.

### Pass 2 — Authenticated surface (signed in as founder_admin)
Sign in with the admin account, then walk and screenshot:
- `/admin/inbox` — briefing requests, conference applications, status changes, seat capacity meter
- `/admin/invite` — invitation generation
- `/admin/signals`, `/admin/reads`, `/admin/digest`, `/admin/edits`, `/admin/tour`
- `/insider` index, `/insider/dossier/<slug>` for each dossier, `/insider/refer`
- `/prepare-america/confirmed` attendee view
- Signed-in switcher (brand names visible), sign-out behavior

For each, confirm data loads (no empty-state-from-error), server functions return 200, and no unauthorized errors.

### Pass 3 — Report
A single findings list, grouped as:
1. Broken links / wrong destinations
2. Pages that render but show the wrong or placeholder content
3. Runtime/console/server errors
4. Empty views caused by no seed data (expected, not bugs)

No fixes are applied during the audit. You review the findings, then we fix in a follow-up pass.

## Technical notes
- Uses headless Chromium against the local dev server; console and network are captured per page.
- Screenshots saved for both passes so you can read the pages without clicking through yourself.
- Read-only: no data is created or modified except signing in.
