# ClaimStore Briefing Room — Plan

## Current sprint

### Sprint 0.14 — Attendee Experience
**Status:** shipped.

- Added `access_token` to `conference_applications` for private attendee pages.
- Created `conference_itinerary_items` and founder/public itinerary functions.
- Built `/prepare-america/confirmed` with seat details, logistics form, live itinerary, and insider-room bridge.
- Added Itinerary tab and attendee-link copy button to `/admin/inbox`.

## Where we are

Phase 0 is complete. The project has:

- A public front door with SEO, mobile nav, and structured data.
- A founder inbox with triage for briefing requests, conference applications, invitations, insider activity, discussion, and itinerary.
- A qualified-insider room with a labeled, versioned dossier corpus, founder notes, Q&A, and "what's new" signals.
- Conference seat management with a 300-seat cap, waitlist, logistics capture, and CSV export.
- A private attendee experience for confirmed guests.
- Documentation: README, architecture, sprints, requirements, and decisions.

## Documentation and GitHub hygiene

The next immediate task is to connect the project to GitHub and verify bidirectional sync. Once connected, the documentation layer is in place and will be maintained as part of each subsequent sprint.

**Open item:** Connect GitHub via Lovable editor → Plus (+) → GitHub → Connect project.

## Two credible next moves

Pick one — both are useful, they answer different pressures.

### Option A — Sprint 0.15: Insider Room Depth (recommended)

Deepen what qualified insiders see so referrals from them carry more weight.

- **Dossier attachments** — founder can attach PDFs/images per section (Supabase Storage, C-class gated).
- **Insider referrals** — an insider can nominate 1–3 peers; nominations land in the founder inbox as a new lane.
- **Reading receipts per section** — not just per dossier, so Signals shows depth, not just opens.

Why this next: the conference is the load-bearing event, but the insider cohort is the only channel that can pull in the right 300 people. Arming them before 11-1 compounds the value of every seat.

### Option B — Sprint 0.15: Public Front Door Scale

Widen the top of the funnel before the convening.

- **Investor-specific landing page** — a `/for-investors` path with a tailored narrative and downloadable one-pager stub.
- **Government/think-tank page** — a `/for-policy` path framing the infrastructure and workforce angle.
- **Press kit / fact sheet** — public C0 summary with truth labels, ready to share.

Why this instead: if the immediate priority is filling the remaining seats with the right categories, more targeted public surfaces help. But it does not deepen the insider experience.

## Recommendation

**Option A.** The 300 seats are managed; the insider room is where the real pre-convening persuasion happens. Insider depth can be shipped in 0.15, then front-door scale in 0.16 if time allows.

Tell me A or B (or something else) and I'll write the detailed sprint plan.
