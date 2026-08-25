# Requirements

This is the living requirements backlog for the ClaimStore Briefing Room. Items are grouped by epic. Status values: `open`, `in-progress`, `shipped`, `deferred`.

## Epic 1 — Public front door

The understated public surface that qualifies and filters inbound interest before the founder ever sees it.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| F-1 | A visitor understands the central proposition within one screen. | Hero states the RRCA → ClaimStore ladder; C0 confidentiality; no offering language. | shipped |
| F-2 | A visitor can request a private briefing. | `/request-briefing` form validates email, org, title, interest; writes to DB; deduplicates by email. | shipped |
| F-3 | A visitor can apply for a PrepareAmerica seat. | `/prepare-america` form validates category and acknowledgment; shows live capacity. | shipped |
| F-4 | The public site is credible on mobile and in shared links. | All public routes have unique titles, descriptions, canonicals, OG tags, JSON-LD where appropriate; mobile nav works. | shipped |
| F-5 | Search engines index only public pages. | `robots.txt` and sitemap exclude admin, insider, and private attendee pages. | shipped |

## Epic 2 — Founder command center

The founder's private workspace for triage, communication, and governance.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| A-1 | Founder can review briefing requests. | `/admin/inbox` lists requests with status filter, search, notes, approve/decline. | shipped |
| A-2 | Founder can review conference applications. | `/admin/inbox` lists applications with seat status, capacity meter, plus-one/dietary editor. | shipped |
| A-3 | Founder can invite insiders directly or from inbound requests. | Invitation tokens are generated, copied, revoked, and resent from the inbox. | shipped |
| A-4 | Founder can see insider engagement. | `/admin/signals` shows dossier opens, message counts, last activity per insider. | shipped |
| A-5 | Founder gets a daily rollup. | `/admin/digest` surfaces new requests, applications, messages, re-engaged dormant insiders, most-engaged insiders, referral momentum, and sections that need work. | shipped |
| A-6 | Founder can manage the conference itinerary. | `/admin/inbox` Itinerary tab supports CRUD on agenda items; published items appear on attendee page. | shipped |
| A-7 | Founder can copy a confirmed attendee's private link. | Conference detail panel shows `/prepare-america/confirmed?t=<token>` with copy button. | shipped |
| A-9 | Founder can see section-level read depth. | `/admin/reads` shows a heatmap of sections × insiders and attachment opens per dossier. | shipped |
| A-8 | Founder receives email notifications for new submissions. | Email is sent when a briefing request or conference application is submitted. | deferred |

## Epic 3 — Insider room

The gated, labeled, versioned corpus room for qualified insiders.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| I-1 | An invited user can redeem a token and become an insider. | `/insider/accept` validates token, creates auth user if needed, assigns `qualified_insider` role. | shipped |
| I-2 | An insider sees a curated dossier index. | `/insider` lists dossiers in story order with confidentiality and truth labels. | shipped |
| I-3 | An insider can read a dossier with truth labels intact. | `/insider/dossier/$slug` renders sections with heading, truth class, body; access is logged. | shipped |
| I-4 | An insider can ask questions and reply in Q&A threads. | `DossierDiscussion` supports flat messages per dossier/section; authors can edit within 15 minutes. | shipped |
| I-5 | An insider sees what's new since their last visit. | Index and reader show `Unread`, `New`, or `New activity` badges based on `insider_access_log`. | shipped |
| I-6 | Founder can attach PDFs/images to dossier sections. | Supabase Storage bucket `dossier-artifacts`; attachments render in reader via signed URLs. | shipped |
| I-7 | Insiders can refer 1–3 peers. | `/insider/refer` form writes to founder inbox; approved referrals auto-generate invitation tokens. | shipped |
| I-8 | Reading receipts are tracked per section, not just per dossier. | `dossier_section_reads` records dwell time and explicit confirmation; signals show depth. | shipped |

## Epic 4 — Conference logistics

Operational support for the 11-1-2026 convening.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| C-1 | Conference capacity is enforced at 300 confirmed seats. | Waitlist is automatic; promotion from waitlist updates status and audit log. | shipped |
| C-2 | Confirmed attendees can manage their own logistics. | `/prepare-america/confirmed?t=<token>` allows plus-ones (0–3), hotel toggle, dietary/access notes. | shipped |
| C-3 | Confirmed attendees see the published itinerary. | Published `conference_itinerary_items` render in time order on the attendee page. | shipped |
| C-4 | Founder can export the attendee roster. | CSV export from `/admin/inbox` includes name, email, org, status, plus-ones, hotel, dietary. | shipped |
| C-5 | Attendees receive confirmation and update emails. | Email stubs activated once sender domain is verified. | deferred |

## Epic 5 — Documentation and governance

The project must be explainable to future collaborators, investors, and auditors.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| D-1 | Project has a project-specific README. | README explains vision, local setup, tech stack, and links to docs. | shipped |
| D-2 | Architecture is documented. | `docs/ARCHITECTURE.md` covers routes, auth, data model, and key modules. | shipped |
| D-3 | Sprint history is documented. | `docs/SPRINTS.md` captures 0.1 through 0.14. | shipped |
| D-4 | Requirements backlog is maintained. | `docs/REQUIREMENTS.md` exists and is updated each sprint. | shipped |
| D-5 | Decisions are recorded. | `docs/DECISIONS.md` captures load-bearing choices with rationale. | shipped |
| D-6 | Code is backed up to GitHub. | Repository is connected to a user-owned GitHub repo and sync is verified. | open |

## Epic 6 — Evidence, intake, and ideation

Turning the archive into an asset register, and side concepts into a governed lane.

| ID | Story | Acceptance criteria | Status |
|----|-------|---------------------|--------|
| E-1 | Every artifact carries provenance. | `original_date`, `source_label`, `significance` on dossier and manual attachments; rendered as a dated evidence strip. | shipped |
| E-2 | Founder sees one index of all evidence. | `/admin/evidence` lists every artifact across corpora with opens and publish state. | shipped |
| E-3 | Material can be staged before it is filed. | `/admin/intake` accepts files and links, tags layers, tracks triage state, and files against a chapter or dossier without re-uploading. | shipped |
| E-4 | The founder can see the shape of the archive. | Intake lane shows counts by triage state, layer, decade, and source. | shipped |
| E-5 | The whole corpus is searchable from one box. | Search spans intake notes, manual chapters, and dossier sections. | shipped |
| E-6 | Side concepts are explored without forking the project. | `/admin/lab` holds tracks with briefs, layer tags, notes/questions/decisions, and an adopt action that writes backlog items. | shipped |
| E-7 | Uploaded documents are searchable by their text. | PDF/Office text extraction at upload populates `extracted_text`. | open |

## Deferred items

These are intentionally not in the current build path.

- **Applicant notification emails** — waiting on verified sender domain.
- **Dossier attachments** — needs Supabase Storage bucket and file-type policy.
- **Insider referrals** — product decision on whether this arms the right growth loop before 11-1.
- **Section-level read receipts** — depends on richer access-log schema.
- **Payments or sponsorship transactions** — explicitly out of scope for Phase 0.
