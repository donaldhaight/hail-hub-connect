# Plan — Sprint 3.0: First Congress Broadcast Production

## Goal

Turn the existing `/first-congress` shell into a real broadcast production surface: configurable stream embed, founder-controlled run of show, backstage/rehearsal mode, and post-broadcast invitation mechanics. The 11-1-2026 event must be producible from this site, not merely described by it.

## Why this is the right next move

Phase 2 closed the invitation ladder and the manual. The remaining critical path to 11-1 is the broadcast itself: what plays, in what order, who can see it, and what happens the moment it ends. Everything else (Season 1 platform, Second Congress invitations) depends on this event executing.

## Sprint 3.0 — Broadcast production surface

### 1. Stream provider integration

- Add a `broadcast_config` table (single row) with fields for stream provider, embed URL, stream ID, and fallback message.
- Support at least two providers out of the gate: YouTube live embed and Vimeo live embed, selectable in the admin.
- Render the embed only when the broadcast is `live` or within a rehearsal window; otherwise show the existing placeholder.
- Keep the embed behind the ticket credential — no public stream URL.

### 2. Founder run-of-show editor

- Extend the existing `/admin/inbox` Itinerary tab (or create `/admin/broadcast`) into a broadcast-specific sequence editor.
- Each segment gets: position, time label, title, description, speaker/presenter, duration estimate, segment type (`opening`, `reveal`, `announcement`, `invitation`, `performance`, `closing`), and publish flag.
- Add a "go live" toggle that marks the broadcast as started; the public page switches from countdown to stream automatically without a page reload.
- Add a "rehearsal mode" toggle visible only to founders: the same page renders, but watermarked, so the run of show can be walked through before 11-1.

### 3. Broadcast state machine

- States: `scheduled` → `rehearsing` → `live` → `ended`.
- Drive the public `/first-congress` page from this state:
  - `scheduled`: countdown + run of show + manual link.
  - `rehearsing` (founder-only, via a secret query param or founder session): stream embed + watermark.
  - `live`: stream embed + run of show + live badge.
  - `ended`: replay embed slot + post-broadcast call to action.
- All dates still read from `src/content/calendar.ts`; no hardcoded 11-1 references.

### 4. Post-broadcast invitation handoff

- When state is `ended`, the page surfaces the Second Congress application path.
- Stakeholder holders see their standing right to a seat and a confirmation-of-interest button.
- Observer holders see the invitation application form (reuse `/prepare-america` machinery, tagged to the current season).
- Founder sees conversion events in `/admin/digest`: stream opened, post-broadcast CTA clicked, application started, application submitted.

### 5. Production checklist page

- New founder-only route `/admin/broadcast` with a pre-event checklist:
  - stream provider configured
  - run of show published
  - manual chapters aligned
  - ticket count and tier breakdown
  - test credential link works
  - rehearsal completed
- Each item is a manual check with timestamp and founder name, stored in `broadcast_checklist`.

## What this does not touch

- No pricing, no payments, no ICO mechanics.
- No change to the seven brand front doors or the public marketing pages.
- No new Siteforum integration; the handoff note stays as copy.
- The election-cycle and liquidity-event framing stays C3/insider-only.

## Verification

- Founder can configure a stream, enter rehearsal mode, see the embed, publish the run of show, and end the broadcast.
- Ticket holder opening `/first-congress?t=<credential>` before the event sees countdown; during `live` sees stream; after `ended` sees invitation CTA.
- No hardcoded dates in components; all dates from `src/content/calendar.ts`.
