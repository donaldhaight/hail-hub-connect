## Where we are

Phase 0 has shipped: public front door, capture forms, founder inbox, insider room, dossier reader with editor, signals, digest, conference seat management, and now SEO/mobile polish. The 11-1-2026 convening is ~14 weeks out.

## Two credible next moves

Pick one — both are useful, they answer different pressures.

### Option A — Sprint 0.14: Attendee Experience (recommended)

Close the loop for the 300 people whose seats you're managing. Right now confirmed attendees get nothing back from the site.

- **Confirmed attendee page** at `/prepare-america/confirmed` — token-gated, shows their seat status, plus-one form, hotel toggle, dietary/access notes, and the working itinerary.
- **Plus-one capture** writes back to `conference_applications` and updates the capacity meter live.
- **Itinerary block** (editable by founder from `/admin/inbox` → new "Itinerary" tab) so you can publish agenda updates without a code change.
- **"My Briefing" bridge** — confirmed attendees who are also insiders see a one-click link into `/insider`.
- Email stubs stay stubbed until you verify the sender domain.

Why this next: it converts the seat pipeline from a spreadsheet into a two-way channel, and it's the thing every confirmed C-level will actually touch before 11-1.

### Option B — Sprint 0.14: Insider Room Depth

Deepen what qualified insiders see so referrals from them carry more weight.

- **Dossier attachments** — founder can attach PDFs/images per section (Supabase Storage, C-class gated).
- **Insider referrals** — an insider can nominate 1–3 peers; nominations land in the founder inbox as a new lane.
- **Reading receipts per section** (not just per dossier) so Signals shows depth, not just opens.

Why this instead: if the strategy right now is "let warm insiders pull in the next wave," this arms them. But it doesn't help the 11-1 convening directly.

## Recommendation

**Option A.** The conference is the load-bearing event; every week that confirmed attendees have no return surface is a week of silent attrition. Insider depth can follow in 0.15.

Tell me A or B (or something else) and I'll write the detailed sprint plan.