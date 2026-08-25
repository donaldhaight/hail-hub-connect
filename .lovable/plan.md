# Founder Console + Project Backlog

Answering your question first: there is no Super Admin home today. You have eight separate admin pages (`/admin/inbox`, `/admin/digest`, `/admin/signals`, `/admin/reads`, `/admin/edits`, `/admin/invite`, `/admin/tickets`, `/admin/broadcast`, `/admin/tour`) reachable only from links in the header. There is no `/admin` landing page tying them together.

So this plan does two things: create the Super Admin console at `/admin`, and make the backlog its default view.

## 1. Super Admin console at `/admin`

A founder-only landing page that becomes the default destination after sign-in.

- Top strip: live counts — open requests, pending invitations, seats confirmed, days to First Congress (11-1-2026), broadcast state.
- Console grid: cards linking to every admin surface with a one-line description of what it does.
- Main panel: the Backlog board (below) rendered directly on `/admin`, so the to-do list is what you see first.
- Header nav gains a single "Console" link; the existing scattered admin links collapse under it.

## 2. Backlog board

A working to-do system for you and me, not a generic task app.

Each item carries:
- **Category** — grouping (Operations, Domain & Email, Broadcast, Insider Room, Manual, Season 1 Platform, Strategy, Bugs). Categories are editable.
- **Created date**, **Title**, **Summary** (one line shown in the list).
- **Detail** — long-form description, opened in a drawer from the item.
- **Status** — `idea → planned → building → shipped → parked`.
- **Priority** and **Sprint label** (e.g. "Sprint 3.1") for grouping alongside category.

Board view: grouped by category, collapsible, with a status filter and a "show shipped" toggle.

## 3. Discussion thread per item

Inside each item's drawer, a threaded discussion form. You post a note; I post analysis and decisions when working the item. This becomes the durable record for plan-mode conversation that today only lives in chat.

## 4. The Build button

Each item gets a **Build** button. Pressing it:
- Flips status to `building` and stamps who/when.
- Composes a build brief from the item's title, summary, detail, and full discussion thread, and copies it to your clipboard as the exact instruction to hand me.
- Shows the brief on screen so you can read it before sending.

It does not autonomously run code changes — it packages the decision so one click, one paste starts the build with full context.

## 5. Seeding the current backlog

The board ships pre-populated with everything currently outstanding, so it is useful the moment it exists:
- Connect prepareamerica.com (root + www) and repoint canonical/OG URLs.
- Verify the email sender domain and activate the six templates in `src/lib/email.ts`.
- Rename the Lovable slug off `hail-hub-connect`.
- Update `/admin/tour` with the broadcast and run-of-show surfaces.
- GitHub backup of the repo.
- Season 1 / Siteforum platform handoff prep.
- February Second Congress seat-confirmation machinery.

## Technical notes

- New tables `backlog_items` and `backlog_comments` in Lovable Cloud, with RLS restricting all access to `has_role(auth.uid(), 'founder_admin')`, plus explicit GRANTs. Seed rows are literal INSERTs in the same migration.
- Server functions in `src/lib/backlog.functions.ts` behind `requireSupabaseAuth` with a founder-role assertion, matching the existing admin function pattern.
- New routes: `src/routes/_authenticated/admin/index.tsx` (console + board). The board and drawer are components under `src/components/briefing/`.
- Header nav simplified to a single Console entry for founder users; existing admin routes stay where they are.

## Out of scope

- Doing the domain and email setup itself — those still need your hands at the registrar.
- Assigning items to anyone other than you.
- Any change to public-facing pages.
