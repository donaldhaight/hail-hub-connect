# Sprint 0.16 — Founder Read-Depth Signals

**Goal:** Turn the raw instrumentation from Sprint 0.15 (section-level reads, attachment opens, insider referrals) into actionable founder intelligence before the 11-1-2026 convening.

You now have section-level dwell time, explicit "Mark as read" confirmations, attachment downloads, and peer nominations flowing into the database. That data is only useful once the founder can see patterns across insiders and dossiers. This sprint builds the intelligence layer on top of the capture layer.

---

## Track 1 — Per-Dossier Read Heatmap

A founder view that shows, for each dossier, which insiders have actually read which sections and how deeply.

**Data**
- Aggregate `dossier_section_reads` by `dossier_slug` and `section_id`.
- Metrics per (insider, section): `first_seen_at`, `last_seen_at`, cumulative `dwell_ms`, `read_confirmed_at`.
- Derived states: `unseen`, `skimmed` (< 10s dwell), `read` (≥ 10s or confirmed), `confirmed` (explicit mark).

**Server functions**
- `getDossierReadHeatmap(slug)` — returns a matrix: sections × insiders with state and dwell time.
- `getSectionReadSummary(slug, sectionId)` — list of insiders who have seen/confirmed a specific section.

**UI**
- New route `/admin/reads` (or extend `/admin/signals` with a "Reads" tab).
- Dossier selector. For the selected dossier, render a grid: rows = sections in order, columns = insiders (email or name), cells = colored state chips.
- Click a cell to open a detail panel with exact dwell time and confirmation timestamp.
- Export the matrix to CSV for offline review or investor updates.

---

## Track 2 — Attachment Open Analytics

Surface which evidence files are being consumed and which are ignored.

**Data**
- Join `dossier_attachments` with a new lightweight log table or reuse `insider_access_log` if it can represent attachment opens cleanly.
- If `insider_access_log` lacks an `action` column, add `action` enum (`dossier_open`, `attachment_open`, `referral_submitted`) and backfill safely.

**Server functions**
- `getAttachmentAnalytics(slug)` — list attachments with open count, unique insiders, last open time.
- `getAttachmentOpens(attachmentId)` — per-insider open log.

**UI**
- In the dossier reader (founder view only), each attachment card shows an "opened by N insiders" badge.
- New sub-view under `/admin/reads` or `/admin/signals`: "Evidence engagement" table.

---

## Track 3 — Referral Funnel

Show the conversion path from insider nomination to redeemed invitation.

**Data**
- Join `insider_referrals` → `insider_invitations` via `resulting_invitation_id`.
- States: `pending` → `approved` → `invited` (token created) → `redeemed` (user accepted).
- Group by referrer to see which insiders are bringing the strongest peers.

**Server functions**
- `getReferralFunnel()` — counts per stage, top referrers, conversion rate.
- `getReferralsByReferrer(referrerId)` — full history for a single insider.

**UI**
- Add a "Referral Funnel" card to `/admin/signals`.
- Extend the existing Referrals inbox tab with stage counts and a one-click "promote pending to invited" bulk action.

---

## Track 4 — Digest Upgrade

Make the daily digest smarter by surfacing patterns, not just events.

**Additions to `/admin/digest`**
- "Most engaged insiders this week" — ranked by sections read + attachments opened + messages posted.
- "Sections that need work" — high-traffic dossiers with low confirmation rates.
- "Dormant readers returning" — insiders whose `last_seen_at` moved after a 7+ day gap.
- "Referral momentum" — nominations submitted, approved, redeemed in the last 7 days.

---

## Sequence

1. Migration: add `action` column to `insider_access_log` if needed; ensure indexes on `dossier_section_reads(dossier_slug, user_id)` and `(section_id, user_id)`.
2. Track 1: heatmap server function and `/admin/reads` route.
3. Track 3: referral funnel aggregation and `/admin/signals` cards.
4. Track 2: attachment analytics (depends on access-log action column decision).
5. Track 4: digest upgrades using the new aggregations.
6. Verify with Playwright: founder opens heatmap, clicks a cell, exports CSV; attachment open increments; referral funnel counts update after approve/redeem.

---

## Docs updates at close

- `docs/SPRINTS.md`: add 0.16 entry.
- `docs/REQUIREMENTS.md`: mark I-6, I-7, I-8 as shipped; add new open items for heatmap drill-down and referral conversion tracking.
- `docs/DECISIONS.md`: add ADR-011 — "Read-depth aggregation as founder signal, not surveillance." Include a note that dwell time is approximate and used only for founder prioritization, not as a legal record.
- `docs/ARCHITECTURE.md`: update data model with `dossier_section_reads`, `dossier_attachments`, and `insider_referrals` relationships.

---

## Explicitly out of scope

- Email notifications for attachment opens or read confirmations (email transport still deferred).
- Inline attachment previews (still open-in-new-tab only).
- Public analytics or read-depth visible to non-founders.
- Real-time websockets; polling on digest/inbox is sufficient for Phase 0.

---

## Alternative: Sprint 0.16 — Public Trust Layer

If you would rather strengthen the front door before the conference, the alternative is to build dedicated landing pages for **Investors** and **Policy / Government** audiences, plus a "Why PrepareAmerica" narrative page. This is lower risk but does not leverage the data we just captured.

**Recommendation:** Ship the read-depth signals first. The founder needs to know who is actually consuming the corpus before 11-1-2026. The public trust layer can follow as Sprint 0.17.

Say the word and I will switch to build mode and start with the migration and `/admin/reads` route.