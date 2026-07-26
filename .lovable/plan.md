
# ClaimStore Briefing Room — Phase 0 through Phase 3 Plan

Launch target: **November 1, 2026 — PrepareAmerica Conference, Gratitude Ranch (Flower Mound, TX)**
Audience: C-level industry execs, VCs, contractors with capital, government think tanks, referred insiders.
Positioning: understated, documentary, private-transaction seriousness. Inspired by Garry Tan / YC's plain confidence — not crypto, not roofing marketing, not fintech neon.

## Governing rules (drawn from your vision doc)

1. **Story order is load-bearing.** Always: (1) RRCA the real company → (2) restructuring case study → (3) ClaimExpress Protocol → (4) ClaimStore industry layer → (5) USA venture foundry. Nobody reaches layers 4-5 before understanding 1-3.
2. **Three access layers, technically separate.** Layer A (public/introductory), Layer B (qualified insider, after identity + NDA), Layer C (due-diligence room, by explicit authorization).
3. **Never merge the three propositions.** RRCA equity, ClaimStore sponsorship, USA/IP participation are distinct — separate rooms, separate memberships, separate audit trails.
4. **Truth labels on every material statement:** FACT / ASSERTION / DECISION / HYPOTHESIS / SIMULATION / OPEN.
5. **Confidentiality classes C0–C4.** C3/C4 stay out of the app entirely in early phases.
6. **No transactions.** No investment amounts, no payments, no e-sig for offerings, no ClaimCoin implementation, no bank/escrow operations.
7. **Simulation banner** on every screen showing non-verified data.

---

## Phase 0 — Public Front Door (understated site)
**Goal:** Earn the next conversation. Attract & qualify C-levels, VCs, contractors, think tanks. Drive them to request a private briefing or apply for a PrepareAmerica invitation.

### Sprint 0.1 — Design direction & foundation
- Generate 3 design directions (Tailwind + Motion): all understated, black / deep navy / silver / warm off-white, restrained serif+sans typography, documentary tone. Vary composition (editorial column vs. dossier grid vs. minimal manifesto).
- Set up TanStack Start route scaffold, semantic design tokens in `src/styles.css`, base layout + footer.
- Head metadata per route (title, description, og:*, twitter:*).

### Sprint 0.2 — Public pages (Layer A only)
Routes:
- `/` — Briefing headline: *"Restructure one company. Prove a better industry process."* Sub: RRCA as first operating proof of concept for ClaimStore. Two CTAs: **Request a Private Briefing**, **Read the Concept Brief**.
- `/why-rrca` — operating history, candid statement of losses, why a live restructuring is stronger evidence than a theoretical pilot.
- `/industry-problem` — the six coordination questions (what work, what agreed, who acts next, what evidence, what blocks, when complete).
- `/proof-of-concept` — six-step progression (diagnose → correct → controls → document → measure → convert to protocol).
- `/vision` — layered walk-through of ClaimStore, ClaimExpress, ClaimsBank, ClaimLoan, ClaimCoin (each labeled *proposed/conceptual*, no operational claims).
- `/prepare-america` — teaser for the 11-1-2026 conference at Gratitude Ranch, application form for the 300 seats.
- `/founder` — Donald Haight statement, 25 years, RRCA context.
- `/request-briefing` — qualification form (name, org, role, interest area: investor / sponsor / partner / counsel / advisor).

### Sprint 0.3 — Capture & routing
- Lovable Cloud enabled: `briefing_requests`, `conference_applications` tables with RLS + service-role grants.
- Email notification to Donald on submission (server function → resend/email provider).
- Admin-only inbox page (auth-gated) to review, approve, or reject requests → assigns Layer B invitation.
- Truth-label + confidentiality-class badges as reusable components (used everywhere from Phase 0 on).
- Persistent "Confidential Working Concept — Not an Offering" footer disclaimer.

**Phase 0 done when:** a referred C-level can land, understand levels 1–3 in one session, and submit a qualified briefing/conference request that reaches Donald.

---

## Phase 1 — Qualified Insider Layer (Layer B)
**Goal:** Post-approval, invite qualified insiders into a private briefing area with identity confirmation and confidentiality acknowledgement.

### Sprint 1.1 — Auth & invitations
- Lovable Cloud auth: email/password + Google. Invitation-only account creation; no self-signup.
- `user_roles` table using the app_role enum pattern (founder_admin, counsel, rrca_exec, investor_prospect, sponsor_prospect, strategic_partner, specialist_advisor, content_reviewer, system_auditor). `has_role()` security-definer function. Never store role on profiles.
- Confidentiality-acknowledgement gate (must accept current version before Layer B content renders).
- MFA required for founder_admin, counsel, and any diligence role.

### Sprint 1.2 — Qualified insider content
- `/insider/concept-brief` — full RRCA-ClaimStore Concept Brief.
- `/insider/entity-map` — interactive entity/relationship map (RRCA, USA, ClaimStore, sponsors, investors, counsel) with existing/proposed badges.
- `/insider/implementation-plan` — preliminary plan with truth labels.
- `/insider/participation-paths` — investor, sponsor, partner, advisor, counsel pathways (separate cards, no cross-linking).
- `/insider/faq`, `/insider/materials` (references to approved external documents; no live uploads yet).

### Sprint 1.3 — Founder admin console
- Invitation creation & role assignment.
- Manual approval queue for `/request-briefing` submissions.
- Access expiration, suspension, audit-log viewer.

---

## Phase 2 — Restructuring Workspace (paywalled app, per PRD/SRS §10)
**Goal:** The operational app behind the front door: registers, workflows, audit — simulated data only until counsel approves live data.

Modules (each = its own sprint or half-sprint):
- **2.1 Command Center** — current phase, open risks, pending decisions, missing docs, assigned actions, deadlines, blockers.
- **2.2 Document Request Register** — request lifecycle Draft → Requested → Acknowledged → Available Externally → Under Review → Accepted/Deficient/Not Available → Closed. External-repo references only, no live uploads.
- **2.3 Risk Register** — severity/likelihood/status/owner/mitigation + counsel-review flag.
- **2.4 Decisions & Open Questions Log** — options, authority, rationale.
- **2.5 Actions & Deadlines Tracker** — owner, blockers, verification.
- **2.6 Entity & Relationship Register** — existing vs. proposed indicators; source of authority.
- **2.7 Content & Truth Register** — every controlled statement carries truth class + confidentiality class + approved audience + version.
- **2.8 Investor Room** (RRCA equity) — strictly membership-separated.
- **2.9 Sponsor Room** (ClaimStore POC) — strictly membership-separated. Cross-room access requires two distinct grants.
- **2.10 Audit Log** — every sign-in, view, create, edit, approve, export, invitation, access-change event.
- **2.11 Reports** — executive status, missing docs, risk, decisions, actions, entities, access, truth classification. CSV + PDF export with generation date / user / applied filters / simulation notice.

Persistent SIMULATION banner across every screen. Prohibited-field guard warns and blocks bank data, SSNs, tax IDs, PII.

---

## Phase 3 — Portfolio & Money-Flow Views (per USA–RRCA Portfolio Architecture)
**Goal:** Present the USA venture portfolio (RRCA, Market Applications, SelfInsurity, BuddyClaim, ClaimStore, National Roofing Army, Kimosabe) as independent-startup cards with a common ledger pattern.

Sprints mirror your doc §10 sprints 1–5:
- **3.1** Portfolio, company models, money-flow, ledger, territory, master-admin views (all simulated, all labeled).
- **3.2** Entity/DBA/role/territory/account records + standardized chart of accounts and dimensions.
- **3.3** Receipts + expenses (simulated), evidence attach, restrictions, approvals.
- **3.4** Reconciliation stub — placeholders for approved bank/Coinbase/accounting connections. No live financial connections in this phase without counsel approval.
- **3.5** Scenarios, assumption vs. actual, valuation methods (asset / revenue / normalized EBITDA).

---

## Cross-cutting invariants
- **Composition of every page:** heading → truth/confidentiality badges → body → "next action" affordance for that role.
- **Never** display an offering, price, subscription, or transaction path anywhere in the app.
- **Never** merge RRCA investment with ClaimStore sponsorship or USA IP participation in a single record, page, or CTA.
- **Never** claim regulatory approval, guaranteed returns, completed technology, or that ClaimCoin exists as a product.
- Visual system stays away from cryptocurrency, vault, coin, futuristic-banking, and roofing-marketing imagery.

## Technical section

- **Stack:** TanStack Start v1 + React 19 + Tailwind v4 + Lovable Cloud (Postgres + Auth + Storage + server functions on Cloudflare Workers). No `react-router-dom`, no Supabase Edge Functions.
- **Auth gating:** Layer A public. Layer B / C under `src/routes/_authenticated/` using the integration-managed gate; role gates via nested pathless layouts (`_authenticated/_counsel`, `_authenticated/_investor-room`, `_authenticated/_sponsor-room`) each guarded by `has_role()` server-side.
- **Data isolation:** every workspace record carries `workspace_id`, `confidentiality_class`, `truth_class`, `approved_audience`; RLS policies enforce role + room membership + expiration.
- **Audit:** append-only `audit_events` table written from server functions, never from the browser.
- **Simulation flag:** `is_simulated` column on registers; UI reads it to render banner.
- **Notifications:** in-app + email via server function.
- **Secrets:** any external API key via `add_secret`. No secret in client code.

## What's explicitly out of scope
- Real diligence document uploads (external repo reference only until Phase 2 counsel sign-off).
- ClaimCoin, ClaimsBank/escrow, ClaimLoan lending, or any payment/transaction rail.
- Automated legal/financial compliance judgments.
- Public investor solicitation of any kind.
- JobNimbus / RoofingRedline / accounting live integrations (Phase 3.4+ only after approval).

## Suggested build order (from your "start now")
1. Phase 0, Sprints 0.1 → 0.2 → 0.3 (public front door + capture + admin inbox).
2. Phase 1 (auth + qualified insider layer + admin console).
3. Phase 2 modules in the order 2.1 → 2.2 → 2.3 → 2.7 → 2.4/2.5 → 2.6 → 2.8/2.9 → 2.10 → 2.11.
4. Phase 3 only after Phase 2 walkthrough with Donald and Adrian.

## Open items to resolve before Phase 1 build
1. Final product name for the public site header — "ClaimStore" alone, "ClaimStore Briefing Room", or something more understated for the front door?
2. Domain to point at Phase 0.
3. Screens you mentioned — send whenever ready; I'll redline the direction against them.
4. Whether Adrian's firm gets founder-admin or counsel-only access on launch day.
5. Whether PrepareAmerica conference application should require any qualifying financial threshold or just role/organization.

Approve to move into Phase 0, Sprint 0.1 (design directions).
