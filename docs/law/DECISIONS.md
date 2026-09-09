# Decisions

> **Status:** binding · **Class:** C2 · **Last revised:** 2026-09-09  
> Every load-bearing architecture and product decision, ADR-001 forward.  
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This document records load-bearing architecture and product decisions. Each entry includes the decision, the context, and the consequences.

## ADR-001: TanStack Start + Lovable Cloud

**Decision:** Build on TanStack Start with Lovable Cloud as the backend.

**Context:** The project needs server functions, SSR for SEO, and a managed database/auth layer without the founder operating a separate Supabase dashboard.

**Consequences:**
- Server logic uses `createServerFn` from `@tanstack/react-start`.
- Database migrations run through the Lovable migration tool.
- Auth is Google OAuth via Lovable Cloud.
- No custom backend server to maintain.

## ADR-002: File-based routing

**Decision:** Use TanStack Start file-based routing under `src/routes/`.

**Context:** The route tree is small and closely tied to the product structure. A file-based convention reduces boilerplate and keeps routes co-located with their server logic.

**Consequences:**
- Public routes are flat files.
- Authenticated routes share `src/routes/_authenticated/route.tsx`.
- `routeTree.gen.ts` is auto-generated and never edited by hand.

## ADR-003: Separate roles table

**Decision:** Store roles in `public.user_roles`, not on a profile/users table.

**Context:** The user-roles instructions require a separate table to avoid recursive RLS and privilege-escalation risks.

**Consequences:**
- `app_role` enum defines `founder_admin` and `qualified_insider`.
- `public.has_role()` is a security-definer function used by RLS and server functions.
- Roles are checked server-side; client never trusts local storage for authorization.

## ADR-004: Truth labels and confidentiality classes

**Decision:** Every claim in the insider room must carry a truth class and a confidentiality class.

**Context:** The founder is navigating a highly regulated, skeptical audience. Labels create a shared vocabulary for what is proven, assumed, simulated, or undecided.

**Consequences:**
- Truth classes: `FACT`, `ASSERTION`, `DECISION`, `HYPOTHESIS`, `SIMULATION`, `OPEN`.
- Confidentiality classes: `C0` (public) through `C4` (founder-only).
- Components `TruthChip` and `ConfidentialityChip` enforce consistent rendering.
- Dossier sections store `truth` per section; dossiers store a default truth.

## ADR-005: Dossier content in the database

**Decision:** Move dossier content from static files into `dossiers` and `dossier_sections` tables.

**Context:** The founder needs to redline language without a code change. Static files would require a deploy for every edit.

**Consequences:**
- `src/content/dossiers.ts` remains as a fallback seed source.
- `DossierEditor` writes directly to `dossier_sections`.
- `dossier_edits` records before/after values for audit.
- Insiders see DB-first content; fallback is only used when DB is empty.

## ADR-006: Email as no-op stubs

**Decision:** Implement email templates and send functions as no-op stubs until a sender domain is verified.

**Context:** The founder cannot verify a domain while driving and asked to proceed without it.

**Consequences:**
- `src/lib/email.ts` contains the full template structure.
- Activating email is a one-line change per send function once the domain is ready.
- No runtime errors from missing email configuration.

## ADR-007: Public Supabase client for token-gated attendee page

**Decision:** Use a publishable Supabase client (no session) plus SECURITY DEFINER functions for the attendee page.

**Context:** `/prepare-america/confirmed?t=<token>` must be accessible without login, but it reads and writes private attendee data.

**Consequences:**
- `get_attendee_view` and `update_attendee_details` are SECURITY DEFINER functions that validate the token.
- The route is `noindex, nofollow` and excluded from `robots.txt`.
- No auth session is required; the token is the credential.

## ADR-008: Capacity meter and waitlist

**Decision:** Enforce a hard 300-seat cap with automatic waitlisting and manual promotion.

**Context:** The venue has a fixed capacity; the founder wants control over who gets promoted from the waitlist.

**Consequences:**
- `seat_status` values include `applied`, `confirmed`, `waitlisted`, `declined`.
- Confirming beyond capacity flips the applicant to `waitlisted`.
- Promoting from waitlist is a founder action with an audit event.

## ADR-009: Instrument Serif + Inter + JetBrains Mono

**Decision:** Use a serif display face for headings, a neutral sans for body, and a mono face for micro-labels.

**Context:** The aesthetic goal is "documentary, restrained, private-transaction seriousness." A generic sans-only SaaS look would undermine credibility.

**Consequences:**
- Headings feel like a printed memorandum.
- Mono labels create a technical/legal precision signal.
- The combination is distinctive and avoids the default AI-startup aesthetic.

## ADR-010: No anonymous sign-ups

**Decision:** All authenticated access is by invitation or founder action.

**Context:** This is a permissioned network, not a consumer app. Open sign-up would create noise and legal risk.

**Consequences:**
- `/auth` only supports Google sign-in.
- New users have no roles until an invitation is redeemed or a founder assigns one.
- The root authenticated gate rejects role-less users gracefully.

## ADR-011: Read-depth signals as founder intelligence

**Decision:** Track section-level dwell time, explicit read confirmation, and attachment opens, then surface them as founder analytics.

**Context:** Dossier opens alone do not reveal whether insiders actually consumed the argument. The founder needs to know which sections are landing, which are being skipped, and which peers are warming up before outreach.

**Consequences:**
- `dossier_section_reads` records dwell time and a `read_confirmed_at` timestamp.
- `dossier_attachment_opens` records every signed-URL access.
- State machine: unseen → skimmed (any dwell) → read (≥10s dwell) → confirmed (explicit mark).
- `/admin/reads` renders a heatmap; `/admin/signals` and `/admin/digest` roll up engagement scores and referral momentum.
- All analytics are founder-only and gated by `founder_admin` role.

## ADR-012: Hold the Quantum Dashboard; build the ISR/LC spine first

**Decision:** Pause further build on the Quantum Dashboard / Situation Room at its current line and proceed with Independent Sales Rep and Licensed Contractor activation, plus the ClaimExpress protocol as an API/MCP surface.

**Context:** Three findings converged. (1) The storm-targeting engine — kill zones, fringe ZIPs, carrier routes, ghost Property Owner profiles, generated offers, multi-channel outreach — is the trade secret that makes the network valuable; demonstrating it whole on 11-1-2026 would teach competitors how to rebuild it. (2) The Kimosabe Interested User ritual has no destination unless a real operating role waits on the other side. (3) RRCA's live need today is a staffed ISR corps and the LCs behind them, not a dashboard.

**Consequences:**
- Situation Room work is `deferred — held by ADR-012`. Nothing built is discarded; ISR/LC activity becomes a real signal source feeding the same variable registry.
- ISR remains the first certifiable role; certification now lands in an ISR App Home with real work in it.
- ClaimExpress is specified as a protocol (objects, states, events) before more UI is built on it, so ISRs and LCs can participate without abandoning their current systems.
- The four-boundary redaction map (§11 of `docs/law/PROTOCOL.md`) governs what any demo may show.
- The hold is lifted only by a superseding ADR.

## ADR-013: Split the administration system into SAS A and SAS B

**Status: superseded by ADR-014.** The "two administrations replace SiteBMS" framing below is retained for history. The corrected model is three things, not two: SAS A, SAS B, and SiteBMS as the Construction Management Group's own operating system.

**Decision (original, now superseded):** Replace the single SiteBMS concept with two administrations over one shared record — SAS A for technology and project administration, SAS B for business administration — mirroring an entity split between Market Applications (TBD) as Technology Anchor and Kimosabe.ai as business development spin-off.

**Context:** The owner controls the entire opportunity, which removes the natural tension that normally keeps a platform's builder honest about its own economics. The blockchain precedent supplies the shape: Consensys to Ethereum, IOHK to Cardano — an anchor that builds and stewards without owning the funnel. The operating precedent is Siteforum GmbH's portal and development platform, where the development administration and the business administration were distinct systems over the same substrate.

The historical precedent is the 2008–2012 multi-startup, multi-codebase structure
built around the Siteforum stack. Insurance companies would only accept a coordinated
restoration platform if they controlled it, and control would have turned it into a
cost-plus clearinghouse on the contractor side and an "Uber claims" dispatch board
on the claims side. The counter-move was to build the platform and each Stakeholder
Group in parallel and sell the platform to the Groups rather than to the insurers.
The multi-startup / multi-codebase structure was not only legal posture; it was
architectural redundancy that made the system too distributed for any single player
to capture. While waiting for the market to catch up, the founder tracked blockchain
ICOs, SPACs, crypto markets, and later LLM platforms as governance and funding models
that could eventually host the same idea.

Kimosabe.ai has no revenue model of its own; anything it earns comes from the economic
model assigned to lead and people origination funnels, which is exactly why it must not
also be the Technology Anchor. RRCA's position as both construction-management operator
and platform originator creates a conflict of interest that the two-administration split
is designed to solve structurally rather than obscure.

**Consequences:**
- SAS A owns stack, identity, permissions, releases, schema, ledger machinery, API/MCP, and the project record. It never owns pricing or funnel economics.
- SAS B owns funnels, pricing, rung economics, counterparties, seat rights, and the books. It never owns schema, permissions, release authority, or the ledger write path.
- One append-only record serves both; SAS A writes events, SAS B prices them.
- Kimosabe.ai is documented as a front door and spin-off, **not** a standalone business with its own revenue model. Earlier framing of Kimosabe as a business in itself is superseded.
- Profit vs non-profit, the legal shape behind "Market Applications, TBD", the 2008–2012 original plans and their assumed legalities, and the funnel economic model are recorded as **unsettled** and must not be assumed in code.

## ADR-014: Three administrations, not two — SAS A, SAS B, and SiteBMS

**Decision:** Supersede ADR-013's central claim. SiteBMS is not replaced by SAS A and SAS B. The corrected model is:

- **SAS A — Technology Administration.** Stack, environments, identity, permissions, schema, releases, ledger machinery, the API/MCP surface, and the technical record.
- **SAS B — Platform / Human Blockchain Administration.** The stakeholder ecosystem: governance, groups, relationships, rules, assignments, platform-wide business controls, and shared market administration. Broader than ADR-013's "business administration" (pricing, funnels, books) — governance of the groups themselves belongs here.
- **SiteBMS — the Construction Management Group's Business Management System.** The operating system used by whichever entity is assigned to manage the Construction Management Group. RRCA is the Founding Sponsor and first operator of that group, and therefore the first operator of the modern SiteBMS.

Four operating decisions are settled with it:

1. **Construction Manager is one operating role** — a single entity role alongside ISR and LC, not a family. Narrower duties (estimating, production, collections) are project assignments or company relationships, not separate roles.
2. **SiteBMS lives inside this application, on the shared record** — an operating area of this app, not a separate surface reading through the API.
3. **JobNimbus is the Phase 1 system of record for existing job and project data.** SiteBMS decides what must happen and records the events; where the two disagree about existing job data, JobNimbus wins during Phase 1.
4. **Authority = Role + applicable Relationship + applicable Assignment.** The three terms are the complete ingredient set, not a mandatory triple: each axis applies only where the actor's position calls for it. A Property Owner, for example, can hold project authority with no company relationship. Permissions become record-scoped, not menu-scoped. *(Clarified same-day, 2026-09-09, on external review during the ChatGPT reconciliation — the original wording "all three must be true" would have forced every actor to carry a company relationship.)*

**Context:** The DH Method checkpoint (2026-09-09) corrected the record: the Siteforum-era precedent separated the portal administration, platform services, database administration, and development administration from the business-facing system RRCA actually operated — that fifth thing was the original SiteBMS. ADR-013 collapsed that distinction. The Draft Connecticut Agreement is the first live requirements source for the modern SiteBMS.

**Consequences:**
- ADR-013 remains in place as history, marked superseded; the strategy and architecture documents were corrected in the same pass.
- Company and project assignment become first-class objects, because the authority rule cannot be expressed without them.
- A stable identifier mapping between SiteBMS records and JobNimbus jobs, plus an explicit mirror-vs-reference field list, becomes required integration work.
- The Records layer of the shared spine (companies, leads, opportunities, projects, claims, contracts, estimates, work orders, invoices, payments, commissions, approvals, evidence) is derived from the Connecticut Agreement and the live RRCA workflow — not invented.

## ADR-015: The open front door and the Property anchor

**Decision:** Seven rulings settled on 2026-09-09 while pressure-testing the Kimosabe.ai → App Home → market-entry funnel.

1. **The front door is open to anyone.** Kimosabe.ai admits any arrival with a question. No gate, no qualification, no filter at the door. Filtering happens later, at certification.
2. **ISR/LC is not the destination.** It is the first paid position built, not the purpose of the building. Onboarding is indoctrination into *holding a file* — identity, wallet, ledger, guide — and paid roles are exits from that hallway, not the hallway itself.
3. **Property Owner is a real position**, alongside ISR and LC. A homeowner who arrives and asks holds a file; their property has a condition. This is the position the authority rule already anticipated when it allowed project authority with no company relationship.
4. **Property is the anchor record.** An address persists across owners, storms, claims, and contractors. Leads, claims, jobs, and inspections are events attached to it. Person and Property are two spines joined by **dated ownership** — the "applicable relationship" a Property Owner brings.
5. **Leads arrive from three sources, deliberately.** The front door (inbound, self-declared, consent implicit in the gesture); the storm-targeting engine (inferred, band-3 trade secret); affiliate funnels (purchased, consent inherited). **Provenance and consent are first-class fields on every lead, not notes.** The same row from three sources carries three different legal and quality profiles; if they are not distinguishable on the record, the platform inherits the worst one across all of them.
6. **Conduct history is core, but not a product.** Nobody is certified in the market — not even a Property Owner — without being tracked for a **Task Efficiency Rating: rank versus average**. It is the internal spine that makes the HTER/ATER efficiency thesis measurable on real actors. **Normative boundary: the rating is tracked for all certified positions, and is never sold, never licensed, and never exposed as a public score.** Any surface that would publish it requires a superseding ADR.
7. **The affiliate position is unsettled.** Whether an affiliate is a member holding a file (ledger-native attribution, payment as a ledger event, conduct on a permanent record) or an outside vendor (faster, but arbitrage margin and unverifiable provenance) is deliberately open. See C19.

**Context:** The question was whether Kimosabe.ai plus App Home plus Tasks amounts to an onboarding funnel into ISR/LC. It does not — that framing loses the majority of arrivals, who are homeowners, tradespeople, and observers who will never sell roofs. Reframing the funnel around holding a file, with Property Owner as a first-class position, resolves the demand-side gap in the same move: a property owner with storm damage who opens a file **is** the inventory an ISR needs, sourced from the same door without exposing the targeting engine.

**Consequences:**
- Property, Lead, and dated Ownership join Company and Project as objects the Records layer must define.
- Property-record ownership and consent become **inputs to** the Draft Connecticut Agreement, not outputs of it. See C16 and C17.
- The locked work order is unchanged: Connecticut Agreement → Records/Object Model → SiteBMS → JobNimbus mapping → API/MCP.
- A persistent property record accumulated without the owner's request is a surveillance asset before it is a service, and is exactly what an insurer would pay most for. The capture-prevention rule of ADR-013/ADR-014 therefore extends to the property record itself.

## ADR-016: Kimosabe memory has three stages, and they are not one file

**Decision:** The guide's memory is partitioned by stage of belonging, because each
stage carries different legal and technical rules. Recorded 2026-09-09.

1. **Before onboarding — session, not profile.** An anonymous arrival today receives a
   device anchor and a holding wallet; nothing they say is retained. The ruling: what
   they say is kept as a **session transcript attached to the anonymous anchor**, carried
   across at wallet claim, and discarded if the anchor is never claimed. It is a
   transcript, not a profile, and it is never enriched, appended to, or resolved to a
   person before the person claims it.
2. **After onboarding, before a role — the personal memory file.** Once the wallet is
   claimed the transcript becomes a memory file on the person's record: what they asked,
   what they were told, what they did. **It belongs to the person**, is readable by them,
   and is never merged into a marketing asset, a lead list, or a targeting input.
3. **Inside a role — partitioned by role and by app.** An ISR's Kimosabe knows different
   things than the same person's Property Owner Kimosabe, and a future BooksForge or
   MyGPT.TV Kimosabe different again. **Crossing a partition requires the person's act,
   not an inference.** The guide may ask; it may not help itself.

**Context:** Kimosabe is currently curated static guidance. The promise made at the front
door — a guide that grows with you — cannot be kept without a memory layer, and a memory
layer built without these three boundaries becomes the surveillance asset ADR-015 warned
about, assembled one helpful answer at a time.

**Consequences:**
- Retrieval design, retention windows, and forget-me handling are **open work**, not
  decided here. See A16–A18.
- Memory retention and consent join C16/C17 as **inputs to** the Draft Connecticut
  Agreement.
- The three partitions are a schema constraint, not a UI preference: memory rows carry
  stage, and where applicable role and app, from the first migration that creates them.
- The locked work order is unchanged. No memory table is created before the Records layer.

## ADR-017 (proposed, not settled): Referraltor as a market position

**Status:** proposed 2026-09-09. Recorded so it is not re-invented; **not** in force.

A **Referraltor** is a person who originates people and property into the market and is
paid for it on the permanent record. The position is named; nothing about it is settled.

Open before it can be adopted:
- **How the designation is earned** — by conduct (a threshold of accepted referrals),
  by purchase (a fee like the ISR), or by grant (founder-assigned).
- **What it is under the authority rule** — a role, a relationship, or an assignment.
  It behaves like a role but attaches to no company and no project.
- **Features and benefits**, and how attribution is written to the ledger: what event
  fires, when it settles, and what happens when two Referraltors claim the same lead.
- **Whether it resolves or collides with C19**, the unsettled affiliate question. A
  Referraltor is arguably the member-side answer to that question — if so, adopting one
  closes the other.

Nothing may be built on this until it is adopted as a decision.

## ADR-018: The address-centred state machine

**Decision:** Settled 2026-09-09 from the *RRCA SiteBMS — Minimum Records Requirement
Handoff*. Three rules govern the operating record.

1. **One record changes state; states do not create records.** The persistent Address
   record and the persistent User identity continue through
   `Prospect → Lead → Pending Project → Project → Warranty`. These are workflow states
   or business labels on one continuing, address-centred record, not five objects.
   "Warranty" is a placeholder name for the post-project state.
2. **Complete Offer is an append-only snapshot.** Completing an Offer records a versioned
   snapshot with date/time and acting source/actor. Later changes never erase a completed
   offer; a record may carry many offers in its history. Offers stand on the same
   never-rewritten footing as the ledger.
3. **Provenance is locked at entry.** The source of the address and the source of the
   user, their entry dates, and the person or system that created or activated the record
   are preserved and not casually overwritten later in the workflow. Locks may bind even
   the Licensed Contractor after the relevant event fires.

Two scope rulings ride with it:

- **Prospect is named but out of Phase 1.** A Prospect may eventually represent every
  U.S. address; that capability does not exist and is not assumed. Records begin as Leads
  today. *Claim Your Address*, bot protection, bulk activation and address ownership are
  future work.
- **The field-locking matrix is deliberately deferred.** Only the three minimum locks
  above are in force.

**Context:** The handoff is the first description of the operating model as a single
continuing record with states, rather than a feature list. It supplies what ADR-015
anticipated when it made Property the anchor: the states that anchor actually moves
through, and the economics attached to them (Jobs, Job Orders, Other Charges).

**Consequences:**
- `docs/requirements/RECORDS-MODEL.md` holds the full requirement set, marked *requirements in
  progress*; legacy ClaimExpress screens are reconciled against that document rather
  than against the codebase, which contains none of these objects.
- Narrower LC duties — production, estimating, collections — remain **assignments**, not
  Stakeholder roles, per ADR-014. Data entry starts with LC Company Admin and ISR Admin.
- Task generation shifts from onboarding tasks to `State + Need → Task` driven by real
  operating events. That is a next-stage requirement, not built.
- The locked work order is unchanged. Four questions (RECORDS-MODEL §12) and the
  Connecticut inputs C16/C17/C24 gate the first migration.

---

## ADR-019 — One front-door engine, many personas; Kimosabe.AI is the domain

**Date:** 2026-09-09 · **Status:** accepted · **Class:** C1

**Decision.** The public front door is one engine rendered through a persona registry.
`Kimosabe.AI` is the universal face; `Buddy Claim` is the first sibling, positioned as
the market-facing spokesperson for SelfInsurity and the ClaimStore vision. Both routes
share one anchor key, one holding wallet, one append-only ledger, and one guidance
channel. A persona changes the wordmark, palette, and vocabulary — never the record.

Two faces never mean two files. The person recognized at one door is the same person at
every other door, and the claim-on-sign-in path is unchanged.

**Domain correction.** The founder owns **kimosabe.ai**, not kimosabe.com. The brand
registry is corrected accordingly. No DNS or hosting change is made by this decision.

**Alternatives considered.**

- *A separate Buddy Claim codebase.* Rejected: it would split the person's file at the
  first door they walked through, which contradicts the shared spine and ADR-015.
- *Buddy Claim as copy-only on the existing `/b/buddy-claim` brand page.* Rejected: the
  brand page describes a stakeholder group; it does not open a file. The founder's intent
  was a working second door, not a second description.
- *A runtime-configurable persona table in the database.* Deferred: with two personas the
  registry is a typed content file. Governance becomes a real question at the point where
  personas are created by someone other than the founder (open question K4).

**Context.** The founder framed Kimosabe as a shapeshifting personal assistant for which
the insurance restoration market is an afterthought — a first season, not the identity.
Rendering a second branded persona on the same engine is the smallest change that makes
that claim structurally true rather than aspirational.

**Consequences.**

- `src/content/personas.ts` is the persona registry; `src/components/frontdoor/FrontDoor.tsx`
  is the shared engine. A new persona is a registry entry plus a four-line route file.
- `docs/strategy/KIMOSABE-POSITIONING.md` holds the positioning, voice, audience ladder,
  and four open questions (K1–K4).
- The existing `/b/buddy-claim` brand page is unchanged and continues to describe the
  Legal node of the Human Blockchain. `/buddy-claim` is the functional door.
- No schema, migration, wallet, or ledger behaviour changed.
