# Sprint 0.15 — Insider Room Depth

Goal: give qualified insiders the tools to work *inside* a dossier (bring evidence, pull in the right people, and prove they've actually read it), and give the founder the signal to act on it.

Three tracks, shippable independently but designed together.

---

## Track 1 — Dossier Attachments (evidence layer)

Each dossier section can carry founder-uploaded artifacts (PDFs, images, decks, spreadsheets) plus optional external links. Insiders can view/download; the founder controls what's published.

**Data**
- New table `dossier_attachments`: `id`, `dossier_id`, `section_id` (nullable = dossier-level), `kind` ('file' | 'link'), `storage_path` (nullable), `external_url` (nullable), `title`, `description`, `mime_type`, `size_bytes`, `is_published`, `position`, `created_by`, timestamps.
- Storage bucket `dossier-artifacts` (private). RLS: founders write; qualified insiders read only `is_published = true` via signed URLs minted server-side.
- Grants + policies in the same migration (per project rules).

**Server functions**
- `listAttachments(dossierId)` — insider-visible (published only) and founder-visible (all).
- `upsertAttachment`, `deleteAttachment`, `reorderAttachments` — `founder_admin` only.
- `getAttachmentSignedUrl(attachmentId)` — mints a short-lived signed URL after verifying insider role and `is_published`.

**UI**
- Reader (`/insider/dossier/$slug`): "Evidence" strip under each section + a dossier-level "Appendix" block. File cards show title, size, kind icon. Click → signed URL open in new tab.
- Editor (inline for founders): drag-drop upload, link-paste, publish toggle, reorder, delete.
- Log every attachment open into `insider_access_log` with `action='attachment_open'`.

---

## Track 2 — Insider Referrals (network expansion, gated)

Let a qualified insider nominate someone to the founder. Never auto-approve — every referral lands in the founder inbox as a first-class triage item.

**Data**
- New table `insider_referrals`: `id`, `referrer_id` (auth.uid), `nominee_name`, `nominee_email`, `nominee_organization`, `nominee_role`, `context` (why this person, C0–C2), `status` ('pending' | 'approved' | 'declined' | 'invited'), `founder_note`, `resulting_invitation_id` (nullable → `insider_invitations`), timestamps.
- RLS: insider can insert + read own; founder reads/updates all.

**Server functions**
- `submitInsiderReferral` — auth'd, rate-limited (max N/day per insider), Zod-validated.
- `listReferrals` (founder), `updateReferralStatus` (founder) — approving can optionally create an `insider_invitations` row in one step and link it back.

**UI**
- `/insider/refer` — clean single-form page ("Who should be in the room?"). Explicit note: *"Every nomination is reviewed personally. No auto-invites."*
- Inbox: new **Referrals** tab alongside Briefing / Conference / Invitations. Triage panel with Approve → Invite (opens invitation modal pre-filled) / Decline / Note.
- Signals dashboard: add "Referrals sent" column per insider.

---

## Track 3 — Section-Level Read Receipts

Move from "opened the dossier" to "actually read section X." Founder needs to know which arguments are landing.

**Data**
- New table `dossier_section_reads`: `id`, `user_id`, `dossier_id`, `section_id`, `first_seen_at`, `last_seen_at`, `dwell_ms` (accumulator), `read_confirmed_at` (nullable). Unique on (user_id, section_id).
- RLS: insider writes own; founder reads all.

**Client instrumentation**
- IntersectionObserver on each section in the reader. Record `first_seen_at` on first ≥50% visibility; accumulate dwell while visible; batch-flush every 10s and on unload via `sendBeacon` → server function `recordSectionRead`.
- "Mark as read" button per section for explicit confirmation → sets `read_confirmed_at`.

**UI**
- Reader: subtle per-section state chip ("Seen 2m" / "Read ✓") for the insider viewing their own progress.
- Founder side: on each section in the editor, a small "Read by N/M · confirmed by K" badge. New **Reads** view (or column in Signals) showing per-section heatmap per insider.

---

## Sequence

1. Migration + storage bucket + grants/policies for all three tables.
2. Track 1 (attachments) end-to-end — highest leverage; unlocks real conversations.
3. Track 3 (read receipts) — pure additive instrumentation.
4. Track 2 (referrals) — new surface + inbox tab.
5. Verify with Playwright: founder uploads → insider sees + downloads; insider submits referral → founder sees in inbox; scrolling a section registers dwell + confirm.

## Docs updates at close

- `docs/SPRINTS.md`: add 0.15 entry.
- `docs/ARCHITECTURE.md`: add attachments/referrals/reads to data model + storage section.
- `docs/REQUIREMENTS.md`: tick off relevant items, add follow-ups (e.g. threaded referrals, per-section comments tied to reads).

## Explicitly out of scope

- Attachment previews inline (open in new tab only).
- Referral-to-invitation email delivery (email transport is still deferred per your earlier call).
- Public analytics / read receipts for non-insider surfaces.

---

Say the word and I'll switch to build mode and start with the migration.
