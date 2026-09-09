# Sprint history

This is the build log for the ClaimStore Briefing Room. Each sprint had a single, testable outcome. Sprints are numbered loosely by release order, not calendar weeks.

## Sprint 0.1 — Design tokens and public shell

**Goal:** Establish the visual and narrative tone before any logic is added.

- Configured Tailwind v4 design tokens in `src/styles.css`: paper, ink, navy, silver, rule.
- Set typography: Instrument Serif headings, Inter body, JetBrains Mono labels.
- Built `PageShell`, `Header`, and `Footer` with the persistent legal disclaimer.
- Created `TruthChip` and `ConfidentialityChip` components.

## Sprint 0.2 — Public routes

**Goal:** Ship the entire public front door.

- Built `/`, `/why-rrca`, `/industry-problem`, `/proof-of-concept`, `/vision`, `/prepare-america`, `/founder`, and `/request-briefing`.
- Enforced the load-bearing story order: RRCA → Case Study → ClaimExpress → ClaimStore → USA Foundry.
- Added the first request-capture form on `/request-briefing`.

## Sprint 0.3 — Capture and routing

**Goal:** Make the briefing request form write to the database.

- Migrated `user_roles`, `briefing_requests`, and `conference_applications`.
- Created `src/lib/briefing.schemas.ts` and `src/lib/briefing.functions.ts`.
- Wired `/request-briefing` to persist submissions with validation and rate limiting.
- Left email as a stub pending sender-domain verification.

## Sprint 0.4 — Founder inbox

**Goal:** Give the founder a private review surface.

- Configured Google OAuth and the `_authenticated` layout gate.
- Built `/admin/inbox` with Briefing Requests and PrepareAmerica Applications tabs.
- Added approve/decline triage controls and internal notes.
- Created `insider_invitations` with single-use tokens.

## Sprint 0.5 — Qualified insider scaffolding

**Goal:** Create the invitation redemption path and the first gated insider page.

- Built `/insider/accept` for token redemption.
- Built a gated `/insider` landing page.
- Added email stubs for invitations.

## Sprint 0.6 — Conference loop and dossier index

**Goal:** Close the loop for PrepareAmerica applications and turn `/insider` into a real dossier index.

- Extended `insider_invitations` to support both briefing and conference sources.
- Implemented `submitConferenceApplication` and a functional `/prepare-america` form.
- Overhauled `/insider` into the Working Dossier Index with truth labels and narrative cards.

## Sprint 0.7 — Dossier reader and activity log

**Goal:** Let insiders read the corpus and let the founder see who is engaging.

- Created `insider_access_log`.
- Centralized dossier content in `src/content/dossiers.ts`.
- Built `/insider/dossier/$slug` with automatic access logging.
- Added an Insider Activity tab to the founder inbox.

## Sprint 0.8 — Founder notes and insider Q&A

**Goal:** Make the dossier a two-way conversation.

- Created `dossier_notes` and `dossier_messages`.
- Built `DossierDiscussion` for inline founder notes and flat Q&A threads.
- Added a Discussion tab to the founder inbox.

## Sprint 0.9 — Insider signals and founder outbound

**Goal:** Give the founder a "who's warm" dashboard and the ability to seed the network directly.

- Updated `insider_invitations` to support direct seeding.
- Created `/admin/signals` with per-insider engagement metrics.
- Added an Invitations tab for revoke/resend.

## Sprint 0.10 — Founder digest and "what's new"

**Goal:** Surface re-engagement and new activity without manual inbox scanning.

- Built `/admin/digest` with daily rollup of requests, applications, messages, and dormant-insider returns.
- Added "What's new" badges and section-level `NEW` chips to the insider room.

## Sprint 0.11 — Founder dossier editor

**Goal:** Let the founder redline the corpus directly in the browser.

- Migrated dossier content into `dossiers` and `dossier_sections` tables.
- Built `DossierEditor` for in-place heading, truth-label, and body edits.
- Created `/admin/edits` for the full edit audit log.

## Sprint 0.12 — Conference seat and logistics management

**Goal:** Operationalize the 300-seat convening.

- Extended `conference_applications` with seat management fields.
- Created `conference_seat_events` audit table.
- Implemented hard 300-seat cap with waitlist and promotion logic.
- Added capacity meter, logistics editor, and CSV export in the founder inbox.
- Wired public capacity display on `/prepare-america`.

## Sprint 0.13 — Public front door polish

**Goal:** Make the site credible when shared with C-levels and VCs.

- Created `src/lib/site.ts` with standardized `routeHead` helper.
- Added `robots.txt` and server-generated `sitemap.xml`.
- Overhauled `Header` with mobile navigation.
- Applied SEO metadata and JSON-LD across all public routes.

## Sprint 0.14 — Attendee experience

**Goal:** Give confirmed guests a private return surface.

- Added `access_token` and `attendee_notes` to `conference_applications`.
- Created `conference_itinerary_items` and public/founder itinerary functions.
- Built `/prepare-america/confirmed` with seat details, logistics form, live itinerary, and insider-room bridge.
- Added the Itinerary tab and attendee-link copy button to the founder inbox.

## Sprint 0.15 — Insider room depth

**Goal:** Make the dossier room a complete reading and referral environment.

- Created `dossier_attachments`, `insider_referrals`, and `dossier_section_reads` tables with RLS and private storage bucket `dossier-artifacts`.
- Built attachment CRUD, signed-URL access, and referral submission + founder triage flows.
- Implemented `useSectionReads` hook using `IntersectionObserver` for section-level dwell tracking and explicit "Mark as read" confirmation.
- Updated `/insider/dossier/$slug` with truth chips, seen/read badges, attachment evidence cards, and a dossier appendix.
- Built `/insider/refer` for peer nominations and added a Referrals tab to the founder inbox for one-click approve-and-invite.

## Sprint 0.16 — Founder read-depth signals

**Goal:** Turn dossier engagement into actionable founder intelligence.

- Created `dossier_attachment_opens` table and composite index on `dossier_section_reads`.
- Added `getDossierReadHeatmap`, `getSectionReadSummary`, `getAttachmentAnalytics`, `getAttachmentOpens`, `getReferralFunnel`, and `getReferralsByReferrer` server functions.
- Updated `listInsiderSignals` to include sections read, sections confirmed, and attachments opened per insider.
- Overhauled `getFounderDigest` with most-engaged insiders, referral momentum, and sections that need work.
- Built `/admin/reads` with a per-dossier section-by-insider heatmap and attachment engagement table.
- Expanded `/admin/signals` with a referral funnel dashboard and read-depth columns.

## Sprint 2.5 — Demo Mode & Invitation Ladder

**Goal:** Harden the First Congress demo and make the invitation surface founder-operable.

- Renamed public-facing "ticket" language to "invitation" and "delegate seat" while preserving credential-gated links.
- Hardened the `/first-congress` countdown with server-side time synchronization.
- Built Demo Mode in `/room` so the founder can step through a scripted Hurricane Beryl run-of-show with automated lens and layout switching.
- Fixed credential validation on `/invitation/$credential` so malformed links render a graceful "not open" page instead of a runtime error.
- Tightened SECURITY DEFINER grants: only `has_role` and `redeem_insider_invitation` remain executable by authenticated users by design.
- Renamed the GitHub backup repository from `hail-hub-connect` to `prepareamerica` and updated `README.md` with the new clone URL.

## Sprint 2.7 — File the Work, Ship It, Write the Story

**Goal:** Get every outstanding decision into the master backlog, verify the app end to end, ship, and bring the manuscript current with what has actually been built.

- Filed six new backlog items: the economics bands the founder still owes, the pricing-to-Task-Ledger wire, the default slider position against the addressable cap, canvass expansion beyond Texas, the cultural races/canon/seasons as mission tracks, and the Act 2 writing thread.
- Added Part VI — The Saga to the Owner's Manual with five chapters: *The Treasure Chest*, *The Turn*, *What Happens in the Room*, *Two Tracks*, and *Act Two — If You Can Bill It, You Can Build It*. Appendices and back matter shifted behind it.
- Verification pass: typecheck clean; sixteen public routes returned 200 signed out; ten private surfaces (`/admin`, `/room`, `/admin/economics`, `/admin/ledger`, `/admin/inbox`, `/admin/intake`, `/admin/evidence`, `/admin/lab`, `/insider`, `/manual`) loaded authorized with zero console errors.
- Database linter: only the two intentional SECURITY DEFINER grants (`has_role`, `redeem_insider_invitation`) remain, as recorded in security memory.

## Sprint 2.8 — The Second Mind (DH Method Checkpoint)

**Goal:** Freeze the first external reconciliation of the architecture into the permanent record — documentation only, no application code.

- Completed the first DH Method reconciliation with an external AI (ChatGPT): its understanding was compared against the live codebase, database, and planning context, and reported as Aligned / Different / Missing / Questions.
- The founder issued five rulings, recorded as ADR-014: the Construction Manager is one operating role; SiteBMS stays inside this app on the shared record; JobNimbus is the Phase 1 system of record for existing job/project data; Authority = Role + Company Relationship + Project Assignment; the three-administration model (SAS A technology / SAS B platform / SiteBMS operations) supersedes the older interpretation.
- Corrected `docs/law/ARCHITECTURE.md` and `docs/strategy/STRATEGY.md` to the three-administration model; updated project memory so no future session resurrects the superseded version.
- Added Saga chapter *The Second Mind* (position 79) to the Owner's Manual, narrating the reconciliation and its governance lesson.
- Closed `docs/history/DH-METHOD-CHECKPOINT-2026-09-09.md` with a status section.
- Narrative placement: still Act Two — this checkpoint is its hinge. Act Three begins when the first Construction Management Group (RRCA, founding sponsor and first operator) runs on the shared record.
- Next queue: Records layer derivation from the Draft Connecticut Agreement, then the Construction Manager (SiteBMS) operating-perspective walkthrough.
