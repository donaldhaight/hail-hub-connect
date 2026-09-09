# Architecture

This document maps the ClaimStore Briefing Room as a system: what the user sees, what the founder sees, how the boundaries are gated, and how data moves.

## Design posture

The site is intentionally understated. It reads like a private transaction memorandum, not a consumer app. The visual system is documentary and restrained: warm off-white paper, charcoal ink, deep navy accent, silver rules. Serif display (Instrument Serif) for headings, neutral sans (Inter) for body, mono for micro-labels.

## High-level boundaries

```text
┌─────────────────────────────────────────────────────────────┐
│                        PUBLIC LAYER                         │
│  /                          — front door                     │
│  /why-rrca                  — case for RRCA                  │
│  /industry-problem          — market fragmentation           │
│  /proof-of-concept          — concept brief                  │
│  /vision                    — long-form vision               │
│  /founder                   — founder note                   │
│  /prepare-america           — conference application         │
│  /request-briefing          — briefing request form          │
│  /prepare-america/confirmed — token-gated attendee page      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED LAYER                      │
│  Requires Google OAuth + role assignment                     │
│                                                              │
│  Founder Admin:                                              │
  │    /admin/inbox    — triage requests, invitations, itinerary │
  │    /admin/signals  — insider engagement dashboard            │
  │    /admin/digest   — daily rollup                            │
  │    /admin/edits    — dossier edit audit log                  │
  │    /admin/reads    — section-level read heatmap              │
  │                                                              │
  │  Qualified Insider:                                          │
  │    /insider        — dossier index                           │
  │    /insider/dossier/$slug  — reader + Q&A + notes            │
  │    /insider/accept — token redemption for invitations        │
  │    /insider/refer  — peer nomination form                    │
└─────────────────────────────────────────────────────────────┘
```

## Route conventions

TanStack Start uses file-based routing. Routes live in `src/routes/`. Pathless layouts use the `_` prefix. The root layout is `src/routes/__root.tsx`.

- Public leaf routes are flat files (e.g. `request-briefing.tsx`).
- Authenticated routes share the `src/routes/_authenticated/route.tsx` gate.
- Admin routes are under `src/routes/_authenticated/admin/`.
- Insider routes are under `src/routes/_authenticated/insider/`.

## Authentication and authorization

- **Auth provider:** Lovable Cloud (Supabase Auth) with Google OAuth enabled.
- **Sign-in page:** `/auth`.
- **Authenticated gate:** `src/routes/_authenticated/route.tsx` checks for a session and redirects to `/auth` if absent.
- **Role system:** Roles are stored in `public.user_roles`, separate from the auth users table. The `app_role` enum currently has `founder_admin` and `qualified_insider`.
- **Role check:** Server functions and RLS policies use the security-definer `public.has_role(_user_id uuid, _role app_role)` function to avoid recursive RLS.
- **Invitation flow:** Founders issue `insider_invitations` tokens. Recipients redeem at `/insider/accept`, which assigns the `qualified_insider` role.

## Data model summary

### Roles
- `user_roles` — one row per user-role pair. RLS: users can read their own roles; service/admin writes are server-side.

### Front-door intake
- `briefing_requests` — inbound requests for a private briefing.
- `conference_applications` — inbound applications for PrepareAmerica; includes seat status, plus-ones, hotel/dietary fields, and a unique `access_token` for the private attendee page.
- `briefing_request_events` and `conference_seat_events` — audit logs for status changes and notes.

### Insider room corpus
- `dossiers` — dossier metadata (title, summary, confidentiality, truth default, story order).
- `dossier_sections` — sections within a dossier (heading, body, truth label, position).
- `dossier_notes` — founder annotations tied to a dossier/section.
- `dossier_messages` — insider Q&A threads tied to a dossier/section.
- `dossier_edits` — audit log of corpus changes (before/after values).
- `dossier_attachments` — file/link evidence attached to a dossier/section; stored in private `dossier-artifacts` bucket.
- `dossier_attachment_opens` — per-user attachment open events for engagement analytics.
- `dossier_section_reads` — per-user section dwell time and explicit read confirmation.
- `insider_access_log` — per-user dossier open events.
- `insider_referrals` — peer nominations submitted by insiders; founder triage converts approved referrals into invitations.

### Invitations and itinerary
- `insider_invitations` — single-use tokens linking to a briefing request, conference application, direct seed, or approved referral.
- `conference_itinerary_items` — agenda entries; public read for published items, full CRUD for founder admin.

### Platform ledger
- `ledger_tokens` — JBK (JoeBack) and ClaimCoin with pegged value, peg note, and active flag. Pegs are data, so a change is auditable.
- `ledger_wallets` — one wallet per holder. `kind = 'interested_user'` wallets belong to an anonymous device anchor; `kind = 'marketapp'` wallets belong to a certified user. `claimed_at`/`claimed_from` record the attachment.
- `ledger_entries` — append-only. Database triggers reject every UPDATE and DELETE and validate direction/amount. Balances are always summed from entries, never stored.
- Writes happen only through server functions using the service-role client; the browser never proposes an amount. Read access is founder admin, qualified insider, or the wallet's own user.
- Surfaces: `/kimosabe` (public Interested User wallet and its ledger) and `/ledger` (founder/insider feed across all wallets).


### Access pattern
- Public reads use a narrow publishable Supabase client (`src/lib/attendee.functions.ts`).
- Authenticated server functions use `requireSupabaseAuth` middleware and the user's own RLS context.
- Founder-only operations check `has_role(auth.uid(), 'founder_admin')` in both server functions and RLS policies.

## Key server-function modules

- `src/lib/briefing.functions.ts` — public briefing request submission.
- `src/lib/conference.functions.ts` — public conference status and founder seat management.
- `src/lib/attendee.functions.ts` — token-gated attendee page reads/updates.
- `src/lib/itinerary.functions.ts` — founder itinerary CRUD, public published list.
- `src/lib/inbox.functions.ts` — founder inbox data and triage actions.
- `src/lib/insider.functions.ts` — invitation lifecycle and redemption.
- `src/lib/dossier.functions.ts` — dossier corpus, notes, messages, activity, and edit audit.
- `src/lib/section-reads.functions.ts` — section-level dwell tracking and read-heatmap aggregation.
- `src/lib/attachments.functions.ts` — attachment CRUD, signed URLs, and open analytics.
- `src/lib/referrals.functions.ts` — referral submission, founder triage, and funnel analytics.
- `src/lib/wallet.functions.ts` — Interested User wallet resolution, earns, entry payment, the claim/merge, and the founder ledger feed. Helpers in `src/lib/wallet.server.ts`; the earn schedule and entry price in `src/lib/wallet.schedule.ts`.


## Public API and webhooks

- `src/routes/sitemap[.]xml.ts` — server-generated sitemap for public routes.
- `public/robots.txt` — excludes admin, insider, and private attendee pages.
- No external webhooks are configured yet.

## Email

Email templates and send stubs live in `src/lib/email.ts`. They are currently no-ops because no sender domain has been verified. Once a domain is connected through Lovable Cloud Email, the stubs can be activated without changing call sites.

## SAS A, SAS B, and SiteBMS

Added 2026-09-07; corrected 2026-09-09 (ADR-014 supersedes ADR-013). Three distinct
things over one shared record, not two. The lineage is the Siteforum GmbH portal and
development platform, where the platform that built things, the platform administration
that governed them, and the business system RRCA actually operated were separate.

### SAS A — Technology Administration

Owned by the Technology Anchor (Market Applications, TBD).

Owns: the stack and its environments, identity, roles and permissions, the release path,
migrations and schema, the append-only ledger machinery, the API/MCP surface, the
integration architecture, and the technical record (sprints, offers, variance,
HTER/ATER).

Must never own: group governance, funnel economics, counterparty relationships, or any
Stakeholder Group's operating controls.

Answers: *can it be built, proven, and kept honest?*

### SAS B — Platform / Human Blockchain Administration

Owns: the stakeholder ecosystem — governance, groups, relationships, rules, assignments,
platform-wide business controls, and shared market administration, including pricing and
the rung economics of the ladder, counterparties, sponsorship and seat rights, and the
profit/non-profit question.

Must never own: schema, permissions, release authority, the ledger's write path, or the
operating controls of any single Stakeholder Group.

Answers: *who governs the platform, and on what terms?*

### SiteBMS — Construction Management Group Business Management System

The operating system of the Construction Management Group, used by whichever entity is
assigned to manage that group. **RRCA is the Founding Sponsor and first operator of the
group, and therefore the first operator of the modern SiteBMS.**

SiteBMS is not the whole platform and is not replaced by SAS A or SAS B. Construction
Management Group control is never exposed to SAS A merely because SAS A owns the
technical implementation.

Owns: the group's files, workflows, reports and controls — company and user
relationships, LC and ISR coordination, lead origination and assignment, project
responsibility and Contractor of Record, sales through closeout authority, compensation
and splits, documentation and evidence, dispute and workmanship responsibility.

Operating decisions settled with ADR-014:

- SiteBMS lives **inside this application** on the shared record — an operating area,
  not a separate product behind the API.
- **JobNimbus is the Phase 1 system of record** for existing job and project data.
  SiteBMS decides what must happen and records the events; the API/MCP connects it to
  the systems that already know how to do the work.
- **Authority = Role + applicable Relationship + applicable Assignment.** The three
  terms are the complete ingredient set, not a mandatory triple — a Property Owner can
  hold project authority with no company relationship. Permissions are record-scoped,
  not menu-scoped.
- **Construction Manager is one operating role**, alongside ISR and LC.

### Where they meet

One record. All three read the same append-only ledger and the same identity spine;
none can quietly rewrite another's history. SAS A writes the events, SAS B prices and
governs them, SiteBMS executes the work they describe. Any surface that lets a business
decision mutate technical state — or a technical convenience mutate an economic or
operating fact — is a defect, not a shortcut.

```text
   Market Applications            Kimosabe.ai              RRCA (first operator)
   (Technology Anchor)         (BizDev spin-off)      Construction Mgmt Group
            |                          |                       |
          SAS A                      SAS B                  SiteBMS
   technology admin        platform administration   group operating system
            \____________ one shared record ________________/
```

### Unsettled

Profit or non-profit; the legal shape behind "Market Applications, TBD"; the economic
model assigned to the origination funnels. These are held open in the documents rather
than assumed in the code.

## SAS B and the Stakeholder-Group Stack

The 2008–2012 strategy reframes how SAS A and SAS B relate to the seven Stakeholder
Groups. The platform is not a product sold *to* insurance companies. It is a commons
owned *by* the Groups, with the two administrations serving different halves of the
same record.

### The capture-prevention design

Insurance companies would only accept a coordinated restoration platform if they
controlled it. Control would turn it into a cost-plus clearinghouse on the
contractor side and an "Uber claims" dispatch board on the claims side — valuable
to the owner, extractive for everyone else.

The defensive structure is federation:

- Each Stakeholder Group has its own role, its own certification path, and its own
  economic interest in the ledger.
- No single Group can rewrite the schema, the identity spine, or the append-only record.
- SAS A enforces this technically (permissions, releases, ledger write path).
- SAS B enforces it commercially (pricing, counterparties, ownership instruments).

### SAS A's role in the federation

SAS A — owned by the Technology Anchor — is the neutral steward of the commons. It
builds the stack, runs the identity and role systems, maintains the ledger machinery,
and hosts the API/MCP surface. It does not set funnel prices, take project spreads,
or favor one Group over another.

This neutrality is what makes the ledger credible to watchers. SAS A writes events;
it does not price them.

### SAS B's role in the federation

SAS B — owned by the business development spin-off and the eventual platform
operating entity — runs the origination funnels, sets rung economics, manages
counterparties, and handles the books. It prices the events that SAS A writes, but it
cannot mutate the underlying record.

SAS B is also where the crowd-facing instruments live: portions of Stakeholder
Groups offered to an invited crowd, on terms that preserve the no-single-controller
rule.

### Where the ledger sits

The append-only ledger is the shared record. It serves two purposes at once:

1. **Operational trust.** Every movement of value or obligation between Groups is
   timestamped, auditable, and immutable.
2. **Watcher confidence.** Capital, government observers, and qualified insiders can
   see that the platform's state changes are real and that no administration can
   quietly rewrite them.

SAS A writes the events through the ledger machinery. SAS B reads and prices them.
Either side trying to do the other's job is a defect, not a shortcut.

## Two spines: Person and Property

*(ADR-015, 2026-09-09.)*

The shared spine runs Interested User → Identity/File → Certification → Roles →
Permissions → Ledger → Tasks → Records. That spine is about a **human**. A second,
equally durable spine is about a **structure**.

- **Person** — the file. Identity, wallet, ledger position, roles, conduct history.
- **Property** — the address. Damage history, claims, jobs, inspections, evidence.

They meet through **dated ownership**: someone owned that roof before, someone will
own it after. The property record outlives the relationship, which is the point —
it is the durable asset no one else in this market holds. Ownership is the
"applicable relationship" a Property Owner brings under the ADR-014 authority rule
when they have no company relationship at all.

**Property is the anchor.** Leads, claims, jobs, and estimates are events attached
to a property, not free-standing rows.

### Lead provenance is a first-class attribute

Every lead carries how it arrived, when, from whom, and what consent came with it.
Three sources are supported deliberately, and they are not interchangeable:

| Source | Nature | Consent |
|---|---|---|
| Front door | Self-declared — the person asked | Implicit in the gesture |
| Targeting engine | Inferred from storm data; band-3 trade secret | Must be established separately |
| Affiliate funnel | Purchased; contact made by a third party | Inherited, must be verifiable |

The engine may stay secret; the consent record cannot — it has to survive a
subpoena, and the applicable rules vary by state. A contractor paying for a lead is
really paying for a defensible answer to "why are you calling me."

### Task Efficiency Rating

No position in the market is certified — including Property Owner — without being
tracked for a Task Efficiency Rating: rank versus average. It is the internal
measurement spine behind the HTER/ATER efficiency thesis.

It is **core but not a product**: tracked for all certified positions, never sold,
never licensed, never exposed as a public score. Publishing it would require a
superseding ADR.
