# Sprint 0.8 — Founder Notes + Insider Q&A per Dossier

The dossier reader works and every open is logged. The missing loop: insiders can read but can't respond, and the founder can't annotate a dossier in-place. This sprint turns each dossier into a two-way surface so PrepareAmerica attendees leave structured feedback tied to specific sections — and the founder can see and reply.

## What we'll build

### 1. Founder notes (per dossier, per section)
- Founder-only authored notes pinned to either the whole dossier or a specific section heading.
- Rendered inline in the reader with a distinct "Founder note" chip.
- Editable/deletable from the reader when signed in as `founder_admin` (inline composer, no separate admin screen).

### 2. Insider Q&A thread (per dossier)
- One thread per dossier, ordered oldest→newest.
- Any `qualified_insider` or `founder_admin` can post a message; optional `section_ref` to tie it to a heading.
- Founder replies are visually distinguished (same chip system).
- Insiders see all messages in the thread (not just their own) — the point is collective redline before PrepareAmerica.

### 3. Notifications (stubbed, consistent with 0.5)
- New insider post → `sendEmail({ kind: 'founder_new_insider_message' })` to founder (no-op until domain verified).
- Founder reply → `sendEmail({ kind: 'insider_reply_posted' })` to the original poster.
- Both templates added to `src/lib/email.ts` as stubs.

### 4. Founder inbox: Discussion tab
- Fourth tab in `/admin/inbox` → **Discussion**.
- Cross-dossier feed of latest insider messages with dossier + section context.
- Click-through to `/insider/dossier/$slug` anchored to the thread.

### 5. Reader polish
- Anchor links on section headings so posts can deep-link to a section.
- "N notes · M messages" counter on each card in `/insider` (uses existing per-user opens query, extended).

## Technical notes

- New tables (both under `public`, RLS on, GRANTs to `authenticated` + `service_role`):
  - `dossier_notes` (id, dossier_slug, section_heading nullable, body, author_id, created_at, updated_at)
    - SELECT: `qualified_insider` or `founder_admin`
    - INSERT/UPDATE/DELETE: `founder_admin` only
  - `dossier_messages` (id, dossier_slug, section_heading nullable, body, author_id, created_at)
    - SELECT: `qualified_insider` or `founder_admin`
    - INSERT: `qualified_insider` or `founder_admin` (author_id = auth.uid())
    - UPDATE/DELETE: author-only within 15 min, plus `founder_admin` always
- Server fns in `src/lib/dossier.functions.ts` (co-locate with existing dossier logic):
  - `listDossierNotes({ slug })`, `upsertDossierNote({...})`, `deleteDossierNote({ id })` — founder-gated writes
  - `listDossierMessages({ slug })`, `postDossierMessage({...})`, `listRecentDossierMessages()` (founder-only for the inbox tab)
- Reader: new `<DossierDiscussion />` component mounted below sections; reuses existing `Meta`/`TruthChip` styling for consistency.
- No changes to dossier content model or story order.

## Out of scope

- Threaded replies (flat thread only this sprint)
- Attachments / redline uploads
- Realtime updates (poll on mount + after post; no subscriptions)
- Email delivery (still stubbed until sender domain)

## Next sprint preview (0.9)

Sender domain + turn on the existing email stubs (founder notifications, applicant auto-replies, insider invitations, new-message pings). One migration-free sprint once you have the domain ready.
