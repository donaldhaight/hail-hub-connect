# Plan — Align the Site to the Two Congress Strategy

## Current situation

`docs/STRATEGY.md` (25 Aug 2026) corrects the project from a single physical convening on 11-1-2026 to a **Two Congress** structure:

- **First Congress — 1 November 2026, streamed.** Reveal, announce, invite. Ticketed, not open.
- **Second Congress — Super Bowl weekend 2027 (14 February 2027), convened.** Physical, 300 delegates. This is where Season 1 is ratified.
- **Season 1 — 1 March 2027 through September 2027.** Short, intentional quasi-beta.
- **Winter Meeting / Owners Meeting — recurring annually on Super Bowl weekend.**
- **Season 2 — after the 2028 Owners Meeting.** Reflects rule changes ratified there. Second quasi-beta season.
- **Season 3 — the fully fueled and vetted launch.**

The live site, however, still depicts the old model: "PrepareAmerica Conference," "Attend PrepareAmerica," 300 seats at Gratitude Ranch on 11-1. That is now the largest credibility risk.

## Founder notations (added at approval)

Three corrections that reshape parts of this plan:

**1. The 11-1 dates are a season ladder, not a one-off.** 11-1-2026, 11-1-2027, and 11-1-2028 are intentional — each opens a Season, and the ladder runs to the 2028 presidential election, where an ICO / IPO / liquidity-event milestone is imagined. The site must be able to express Season 1, Season 2, Season 3 as a structure, not just a single event.

**2. Season 1 runs on the original Siteforum codebase.** The platform for Season 1 already exists — developed, hosted, and managed by the original Siteforum.com team. This is the risk story: between Day 1 (11-1-2026) and the 2-14-2027 milestone, there is virtually no build risk, because the operating platform is already live. Years 1 and 2 are founder-dictated on the proven codebase while the Board and Dev Team build the successor platform in parallel. This site does not need to become the operating platform — it needs to be the front door that hands qualified people to it.

**3. Winter Meeting dates float with Super Bowl weekend.** Never hardcode 2-14 as a recurring date. Compute or configure per year: 2027 = 14 February; later years TBD and must not be asserted until the NFL schedule is published.

## Adjusted season calendar (per latest direction)

```text
First Congress    11-01-2026   streamed     reveal, announce, invite to Second Congress
Second Congress   Super Bowl weekend 2027   convened     300 delegates; ratify Season 1
Season 1          03-01-2027 → 09-30-2027   quasi-beta   short, intentional, on Siteforum platform
Owners Meeting    Super Bowl weekend 2028   convened     ratify rule changes for Season 2
Season 2          after 02-2028 Owners Meeting   quasi-beta   rule-changed second beta
Season 3          after 02-2029 Owners Meeting   launch       fully fueled and vetted
```

The 11-1-2026 First Congress is **not** the start of Season 1. It is the invitation mechanism. Season 1 begins 1 March 2027, immediately after the Second Congress.

## Goal

Bring every public surface, URL, schema, and admin workflow into alignment with the Two Congress strategy and the invitation ladder:

```text
Referral → Ticket to the First Congress → Invitation to the Second Congress → Delegate seat → Season 1 participant
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
- Keep Gratitude Ranch and 300-capacity language, but move it to **Super Bowl weekend 2027**.

### Sprint 2.0a — The season calendar (single source of truth)

No date may be hardcoded in a component again. One module owns the ladder.

Work:
- Create `src/content/calendar.ts` exporting a typed season list:

```text
Season 1   opens 11-01-2026   milestone  Super Bowl weekend 2027 (02-14-2027)
Season 2   opens 11-01-2027   milestone  Super Bowl weekend 2028 (date TBD)
Season 3   opens 11-01-2028   milestone  2028 presidential election cycle
                                          imagined ICO / IPO / liquidity event
```

- Each entry carries: season number, opening date (fixed 11-1), milestone label, milestone date or `"TBD"`, and a public/private visibility flag.
- Winter Meeting dates are **data, never prose**. Any surface showing a milestone date reads it from this module, and renders "Super Bowl weekend" when the date is TBD.
- Only Season 1 is publicly visible at launch. Seasons 2 and 3 exist in the module and surface behind auth, so the decade horizon is legible to insiders without being marketed.
- The election-cycle and liquidity-event framing is **C3 / HYPOTHESIS** — insider surfaces only, never public copy, never in metadata.

### Sprint 2.0b — The Season 1 platform story

The strongest fact in the project is that Season 1 does not need to be built.

Work:
- Add a section to the insider room and the Owner's Manual stating plainly: the Season 1 operating platform already exists, developed and hosted by the original Siteforum team, and has an operating history.
- Frame it as the risk answer for capital: Day 1 to the Season 1 milestone carries execution risk, not build risk.
- State the two-track structure: the founder dictates Seasons 1 and 2 on the proven codebase while the Board and Dev Team build the successor platform in parallel.
- Truth-label it: the existence of the codebase is **FACT**; the two-track governance structure is **DECISION**; the successor platform timeline is **HYPOTHESIS**.
- Public surfaces get none of this by name. The front door's job is unchanged: hand qualified people to the platform, not describe it.


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
  7. The season ladder and the two-track platform strategy
  8. The ClaimStore proof of concept
  9. Glossary
- Ensure every chapter carries truth labels and confidentiality classes.
- Add a print/PDF-ready view of the full manual.

### Sprint 2.3 — Admin workflow for the invitation ladder

The founder inbox currently manages "conference applications." Reframe it to manage the ladder.

Work:
- Rename admin concepts from "conference seat" to "ticket" and "invitation."
- Add status transitions: `pending` → `approved (ticket)` → `invited (milestone seat)` → `confirmed seat`.
- Add a 300-delegate cap for the Second Congress with waitlist logic.
- Tag every record with its season, so Season 2 reuses the same machinery without a rebuild.
- Update `/admin/inbox`, `/admin/signals`, and `/admin/digest` to report on tickets, invitations, and confirmed delegates.

### Sprint 2.4 — First Congress broadcast landing page

Create the page ticket holders see on 11-1.

Work:
- Build `/first-congress` (or `/congress/first`) protected by ticket credential or authenticated access.
- Include stream embed placeholder, run-of-show, and link to the Owner's Manual.
- Add a post-broadcast CTA: apply for invitation to the Second Congress.
- Include the handoff to the Season 1 operating platform for delegates who advance.

## Out of scope for this plan

- Physical venue logistics for the Winter Meeting (hotel, catering, itinerary) — belongs to the Second Congress.
- Sponsorship instruments (PSL tiers) — explicitly out of scope before 11-1.
- Final Agenda2028 ratification text.
- Public marketing, blog, newsletter, social cadence — forbidden by the silence doctrine.
- Building or replacing the Season 1 operating platform. It exists; this site links to it.
- Any public mention of ICO / IPO / liquidity-event framing.

## Success criteria

1. A signed-out visitor to `prepareamerica.com` sees a streamed First Congress on 11-1-2026 and a convened Second Congress on Super Bowl weekend 2027 — never a single physical "conference" on 11-1.
2. A referred applicant can request and receive a ticket to the stream.
3. The Owner's Manual is readable behind authentication with a complete table of contents.
4. The founder can triage applicants into tickets, then tickets into invitations, then invitations into confirmed seats.
5. All schema and copy use the vocabulary in `docs/STRATEGY.md`.
6. No date appears in a component. Every date renders from `src/content/calendar.ts`, and TBD milestones render as "Super Bowl weekend."
7. No public surface mentions Season 2, Season 3, the election cycle, or a liquidity event.

## Open questions carried forward

1. **Does the Siteforum platform get named publicly, or only to insiders?** Naming a twenty-year-old hosting partner is either a credibility asset or a modernity liability depending on the audience.
2. **Where exactly does the handoff happen?** A delegate who advances past the Second Congress lands on the Season 1 platform — that link, and what it looks like on the way in, is unspecified.
3. **How many tickets to the First Congress?** Still open from `docs/STRATEGY.md`.

## First step

Begin with Sprint 2.0 and 2.0a together: the copy pass across public routes, on top of the calendar module so the corrected dates land in one place rather than twelve.

