## Sprint 0.9 — Insider Signals + Founder Outbound

Phase 0 has a working funnel (public → briefing/conference → invite → insider room → dossier reading → notes + Q&A). What's missing before the PrepareAmerica conference is (a) a way for the founder to see *who is actually engaging* at a glance, and (b) a way to invite people directly — not only in response to inbound requests.

This sprint closes both gaps without touching the public UI (you said you'll provide screens for that).

### What we'll build

**1. Insider Signals dashboard (founder-only)**

New route: `/admin/signals`

A single scannable page that turns the raw `insider_access_log` + `dossier_messages` + `dossier_notes` streams into a per-insider view:

- One row per qualified insider (email, role, invited-from lane, invited date).
- Columns: dossiers opened (count / of 5), last active, messages posted, most-recent dossier touched.
- Sort by last-active by default; filter by "engaged / dormant / never-opened".
- CSV export for the pre-conference briefing.

This is the founder's "who's warm" list heading into 11-1-2026.

**2. Direct insider invitations (no inbound required)**

New action in `/admin/inbox` header: **"Invite insider directly"**.

- Modal: email + full name + organization + role category + optional internal note.
- Creates an `insider_invitations` row with `source = 'direct'` (new allowed value), issues a token, shows the accept URL to copy.
- Uses the same `redeem_insider_invitation` flow already in place — no new redemption logic.

This lets you seed the room with people you already know (Tan-style hand-picked cohort) without making them fill out the public form first.

**3. Invitation lifecycle visibility**

New tab in `/admin/inbox`: **Invitations**.

- Lists every invitation (from briefing / conference / direct).
- Status: pending, redeemed, expired, revoked.
- Actions: copy link, revoke, resend (regenerates token + 30-day expiry).
- Shows redeemed-by email + redemption date when applicable.

Right now invitation URLs only appear once at issue-time; if you close the tab, they're gone. This fixes that.

### Data changes

- Extend `insider_invitations` to allow `source = 'direct'` and make `briefing_request_id` / `conference_application_id` both nullable (the existing one-source check constraint gets updated to allow "exactly zero sources" when `source = 'direct'`).
- Add `revoked_at timestamptz` for the revoke action.
- No new tables.

### What we're NOT doing this sprint

- No changes to public routes or the marketing UI (waiting on your screens).
- No email sending (still stubbed until you set up the sender domain).
- No dossier content changes — story order and truth labels stay locked.
- No Phase 1 workspace features yet.

### Deliverables

- Migration: invitations schema tweaks + revoke column.
- Server functions: `listInsiderSignals`, `inviteInsiderDirect`, `listInvitations`, `revokeInvitation`, `resendInvitation`.
- Routes: `/admin/signals`, new **Invitations** tab in `/admin/inbox`, direct-invite modal.
- CSV export on the signals page.

Approve and I'll build it.
