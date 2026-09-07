# Season 1 — The Trusted Scout, Working Ledgers, and Stakeholder Apps

**Goal:** Build enough of the Kimosabe front door, ledger/token backbone, and Stakeholder Group app shells to run Season 1 out of this codebase even if Siteforum is not ready.

## Context

Kimosabe is the Trusted Scout: the all-in-one front door experience that follows a user from the public page into the logged-in App Home. The Season 1 systems must support three onboarding funnels (Stakeholder community, everyday American user, roofing community), prove JBK and ClaimCoin as working units of measure, and give each Stakeholder Group a scoped app view without exposing Founder-level dashboards.

## Build phases

### 1. Ledger and token backbone
Make the existing ledger tables production-ready for Season 1:

- Finalize `ledger_tokens`: JBK (platform credit) and ClaimCoin (settlement unit).
- Wallet model: one holding wallet per device/anchor for anonymous users; one authenticated wallet per user after sign-in; merge/claim flow already exists — verify and harden.
- Transaction model: append-only double-entry; every movement has reason, ref, memo, counterparty.
- Operational transactions: earn JBK for onboarding steps, pay entry fees for roles, transfer between wallets, claim merge.
- Coinbase off-ramp design: add a `fiat_exits` table and a service route that records an intent to off-ramp; the actual Coinbase API integration will be behind a feature flag until credentials are available.

### 2. Kimosabe Trusted Scout front door
A single public page at `/kimosabe` that is the front door:

- One search field + one action button (no login required).
- Arriving users create or reuse an anonymous device anchor and holding wallet.
- The action routes into the onboard ladder: Interested User → Verified Member → Entity Role → Certified Operator.
- The logged-in App Home becomes the destination after any auth step or wallet claim.

### 3. App Home and role-shaped shells
Complete the `/app` shell started in the previous sprint:

- One-bar header: nav menu upper left, search, New, Role Settings (with Switch Roles), Account Settings.
- Tasks strip: dismissible tasks tied to `app_task_states`.
- Kimosabe feed: a one-to-one monitored channel, never a community feed.
- Footer app switcher: MarketApp, Role Store, BooksForge, MusicApp, MovieApp, MyGPT.TV.
- Role-scoped left nav: each role sees only the menu items it owns.

### 4. Stakeholder Group app shells
Create lightweight apps for each Stakeholder Group:

```text
Group          App focus                                              Excluded from view
PO             File a claim/project request, view assigned LC/ISR     Founder Dashboard, other group tools
LC             View project leads, accept/decline offers, crews       Storm targeting, other LC leads
ISR            Lead intake, pin drops, offer lifecycle, commission    Full claim details until assigned
Insco          Claims they are party to, docs, dispute/approve        Founder Dashboard, other insurers' data
Adjco          Inspection requests, reports, milestone sign-off       Other adjuster assignments
Supplier       Material orders for approved projects                  Customer PII beyond shipping needs
```

Each app is a route subtree under `/app/<group>` with its own lens/dashboard link. Access is controlled by role enrollment in `user_roles` and `role_catalog`.

### 5. Season 1 operations — the race
Build the minimum workflow that lets the system run:

- Storm map: a founder/admin view for plotting weather events and predicted impact zones.
- Pin drop: ISRs create lead pins (address, storm, damage class, photos) from the field.
- Offer lifecycle: LCs receive pins, make offers, POs accept/decline, Insco/Adjco milestones are tracked.
- Completion and close: work verified, ClaimCoin settlement recorded, ledger entries append.

## Documentation

- Owner's Manual chapter: "The Trusted Scout" — Kimosabe as the front door and the three onboarding funnels.
- Owner's Manual chapter: "Season 1 Operations" — storm, pin, offer, close.
- Strategy memo update: Coinbase off-ramp as an attempted integration, fallback to internal ledger settlement.
- SAS A/SAS B note: keep the existing split documented; do not expand until the owner finishes describing it.

## Unsettled

- Whether Coinbase credentials will be available before 11-1-2026.
- Exact fee schedule for ISR/LC certification and lead placement.
- Whether PO-facing intake is public or invitation-only in Season 1.
- Whether Supplier and Adjco roles launch with Season 1 or Season 2.
- Legal shape of "Market Applications, TBD" and funnel economics (still held open).

## Technical details

- Tables to extend: `ledger_tokens`, `ledger_wallets`, `ledger_entries`, plus new `fiat_exits` (pending Coinbase integration).
- New tables: `season_projects`, `lead_pins`, `offers`, `milestones` (or reuse existing `backlog_items` if appropriate — verify first).
- Routes: public `/kimosabe`, authenticated `/app`, `/app/po`, `/app/lc`, `/app/isr`, `/app/insco`, `/app/adjco`, `/app/supplier`, plus `/app/search` and `/app/account`.
- Server functions: extend existing wallet and ledger functions; add role-scoped list/create/update functions for leads, offers, milestones.
- Auth/RLS: every new table gets GRANTs and RLS policies scoped by role; no anon writes except where explicitly designed.
