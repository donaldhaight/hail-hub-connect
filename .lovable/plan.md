# Plan — Align the Site to the Two Congress Strategy

## Current situation

`docs/STRATEGY.md` (25 Aug 2026) corrects the project from a single physical convening on 11-1-2026 to a **Two Congress** structure:

- **First Congress — 1 November 2026, streamed.** Reveal, announce, invite. Ticketed, not open.
- **Second Congress — 14 February 2027, convened.** Physical, 300 delegates, Super Bowl weekend.
- **Owners Meeting — recurring annually from 14 February 2028.**

The live site, however, still depicts the old model: "PrepareAmerica Conference," "Attend PrepareAmerica," 300 seats at Gratitude Ranch on 11-1. That is now the largest credibility risk.

## Goal

Bring every public surface, URL, schema, and admin workflow into alignment with the Two Congress strategy and the invitation ladder:

```text
Referral → Ticket to the stream → Invitation to the Congress → Seat
```

## Sprints

### Sprint 2.0 — Vocabulary alignment (public surfaces)

Retire the old words and replace them everywhere a signed-out visitor can see.

| Retired | Replacement |
|---------|-------------|
| Conference | First Congress (or Congress, context-dependent) |
| Attend / Attendee | Ticket / Delegate |
| Registration | Application |
| Event | Occasion / Congress |
| 300 seats (on 11-1) | 300 delegates (on 02-14-2027) |

Work:
- Rewrite `src/routes/index.tsx` hero and details to describe the **First Congress** as a streamed reveal/invitation, not a physical destination.
- Rewrite `src/routes/prepare-america.tsx` to issue **tickets to the stream**, not seat applications.
- Update `src/routes/why-prepare-america.tsx`, `/investors`, `/policy`, and `/briefing` for Congress vocabulary.
- Update metadata, schema.org JSON-LD, and canonical copy.
- Keep Gratitude Ranch and 300-capacity language, but move it to **February 2027**.

### Sprint 2.1 — Ticket mechanism for the First Congress

The site's single job before 11-1 is to convert referred strangers into ticket holders.

Work:
- Add a `first_congress_tickets` table (or rename the existing conference application flow) with: referral source, applicant profile, status (`pending`, `approved`, `declined`, `waitlisted`), and ticket credential.
- Generate a unique ticket credential (UUID or short code) per approved applicant.
- Build a `/ticket/:credential` route that shows the holder's access instructions for the 11-1 stream.
- Send email stub for ticket approval (sender domain pending).
- Cap tickets deliberately (open question in STRATEGY.md: how many?). Default to a configurable number, e.g., 1,000.

### Sprint 2.2 — Owner's Manual as the broadcast artifact

The First Congress points at the Owner's Manual. It must be complete enough to be the reference document.

Work:
- Seed `manual_chapters` with the core table of contents:
  1. Preface / Convener's note
  2. The problem (insurance restoration market)
  3. The case study (RRCA)
  4. The seven stakeholder groups
  5. The architecture (Human Blockchain / Three-Layer Reveal)
  6. The two congresses and the invitation ladder
  7. The ClaimStore proof of concept
  8. Glossary
- Ensure every chapter carries truth labels and confidentiality classes.
- Add a print/PDF-ready view of the full manual.

### Sprint 2.3 — Admin workflow for the invitation ladder

The founder inbox currently manages "conference applications." Reframe it to manage the ladder.

Work:
- Rename admin concepts from "conference seat" to "ticket" and "invitation."
- Add status transitions: `pending` → `approved (ticket)` → `invited (February seat)` → `confirmed seat`.
- Add a 300-delegate cap for the Second Congress with waitlist logic.
- Update `/admin/inbox`, `/admin/signals`, and `/admin/digest` to report on tickets, invitations, and confirmed delegates.

### Sprint 2.4 — First Congress broadcast landing page

Create the page ticket holders see on 11-1.

Work:
- Build `/first-congress` (or `/congress/first`) protected by ticket credential or authenticated access.
- Include stream embed placeholder, run-of-show, and link to the Owner's Manual.
- Add a post-broadcast CTA: apply for invitation to the Second Congress.

## Out of scope for this plan

- Physical venue logistics for February (hotel, catering, itinerary) — belongs to the Second Congress.
- Sponsorship instruments (PSL tiers) — explicitly out of scope before 11-1.
- Final Agenda2028 ratification text.
- Public marketing, blog, newsletter, social cadence — forbidden by the silence doctrine.

## Success criteria

1. A signed-out visitor to `prepareamerica.com` sees a streamed First Congress on 11-1-2026 and a convened Second Congress on 02-14-2027 — never a single physical "conference" on 11-1.
2. A referred applicant can request and receive a ticket to the stream.
3. The Owner's Manual is readable behind authentication with a complete table of contents.
4. The founder can triage applicants into tickets, then tickets into invitations, then invitations into confirmed seats.
5. All schema and copy use the vocabulary in `docs/STRATEGY.md`.

## First step

Begin with Sprint 2.0: a copy pass across the public routes. It is the fastest risk reduction and unblocks the later sprints.
