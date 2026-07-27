## Sprint 0.12 — Conference Seat & Logistics Management

The PrepareAmerica intake is live, but it is still just an inbox of applications. With 300 physical seats at Gratitude Ranch on 11-1-2026, the founder needs a real event-management surface: capacity, confirmations, waitlist, plus-ones, dietary/logistics capture, and an exportable attendee roster. This sprint turns the conference tab into an operational command center for the convening.

### What ships

**1. Seat-management schema**
- Extend `conference_applications` with:
  - `seat_status` — `applied` | `invited` | `confirmed` | `waitlisted` | `declined` | `cancelled`
  - `plus_ones` — integer, default 0
  - `dietary_restrictions` — text
  - `hotel_needed` — boolean
  - `logistics_notes` — text
  - `confirmed_at` — timestamp
- New `conference_seat_events` audit table: `application_id`, `actor_id`, `action`, `note`, `created_at`.
- Hard capacity constant of 300 seats (confirmed seats = applicant + plus_ones). Waitlist opens automatically when a confirmation would exceed capacity.

**2. Server functions in `src/lib/conference.functions.ts`**
- `getConferenceCapacitySummary()` — public, returns total, confirmed, waitlisted, available.
- `updateConferenceSeat({ id, seatStatus, plusOnes, dietary, hotelNeeded, logisticsNotes, note })` — founder-only; enforces capacity, logs event, sets `confirmed_at` when appropriate.
- `promoteFromWaitlist({ id, note })` — founder-only; moves a waitlisted applicant to confirmed if seats exist.
- `listConferenceAttendees()` — founder-only; all confirmed rows with logistics data.
- `getPublicConferenceStatus()` — public; counts only, no PII, surfaced on `/prepare-america`.

**3. Founder Inbox — Conference tab upgrade**
- Capacity meter at the top: `X / 300 seats filled`.
- Per-row seat actions: Confirm, Waitlist, Decline, Cancel, Promote (waitlist only).
- Inline logistics editor for confirmed applicants: plus-ones, dietary restrictions, hotel needed, internal logistics notes.
- Waitlist position computed by `confirmed_at` ordering.
- New CSV export: attendee roster with name, email, org, title, category, plus-ones, dietary, hotel.

**4. Public `/prepare-america` page**
- Add a live seat-availability strip: e.g. "300 seats · N confirmed · applications reviewed personally".
- Keep the existing application form; successful applicants see a status-aware message referencing the review process.

**5. Insider-facing attendee roster (optional but high-impact)**
- New route `/_authenticated/insider/prepare-america` or a section inside the existing PrepareAmerica dossier.
- Confirmed insiders see a read-only list of attending organizations/categories (no emails) to signal who else is coming.
- Gated to `qualified_insider` or `founder_admin`.

**6. Email stub**
- Add a `conference_seat_confirmed` template to `src/lib/email.ts` and call it on confirmation.
- It remains no-op until the Lovable email domain is configured, just like the other templates.

### What this is NOT

- Not a full agenda builder or session scheduler.
- Not a payment/ticketing system.
- Not a hotel room-block booking integration.
- Not an automated waitlist promotion queue; promotion is founder-triggered.

### Technical notes

- Migration: add columns to `conference_applications` and create `conference_seat_events`. Both get GRANTs + RLS + `updated_at` trigger on the new table.
- Update `src/lib/inbox.schemas.ts` to include the new `seat_status` enum and an `updateConferenceSeatSchema`.
- Update `src/lib/inbox.functions.ts` with the new server functions or create a focused `src/lib/conference.functions.ts`.
- The founder inbox conference tab becomes the primary UI; no separate admin route needed.
- Capacity math is computed server-side to prevent race conditions; the UI reflects the same numbers.
- After the migration runs, the Supabase types file regenerates, and code that touches the new columns is wired in.

Approve and I'll build it.