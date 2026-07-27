# Sprint 0.17 — Public Trust Layer

**Goal:** Strengthen the public front door for two high-value audiences — investors and policy/government actors — before the 11-1-2026 convening.

The insider room now has depth and the founder has signal. The public site, however, still speaks in one voice. To attract the C-levels, VCs, and think-tank audiences the founder wants in the room, the front door needs audience-specific landing pages that answer the question each constituency asks first:

- **Investors:** What is the rollup thesis, what are the unit economics, and why is now the time?
- **Policy / Government:** Why does this matter to national resilience, and how does it fit existing public-private frameworks?

This sprint builds those two lanes without changing the insider room or the founder command center.

---

## Track 1 — Investor Lane

A dedicated `/investors` page that frames ClaimStore as a Diller-style rollup opportunity executed through a YC-style network.

**Content**
- The rollup thesis: fragmented insurance restoration market, repeatable acquisition pattern, data moat.
- Capital stack preview: ClaimStore → ClaimsBank → ClaimLoan → ClaimCoin as a staged capital-and-liquidity flywheel.
- Unit economics as **simulations** (truth-labeled `SIMULATION`), not projections.
- PrepareAmerica as the first annual convening where the network becomes self-aware.
- Call to action: request a private briefing or apply for a PrepareAmerica seat (links to existing forms).

**UI**
- New public route `/investors`.
- Uses existing `PageShell`, `TruthChip`, and `ConfidentialityChip` components.
- SEO: unique title, description, canonical, OG tags, JSON-LD `Organization` + `InvestmentFund` (as a `Project` fallback if no standard type fits).
- Mobile-responsive and linked from the main navigation under a new "For investors" item.

---

## Track 2 — Policy / Government Lane

A dedicated `/policy` page that frames the mission in resilience and public-interest terms.

**Content**
- The problem: climate-driven property losses, fragmented contractor networks, information asymmetry between homeowners, carriers, and adjusters.
- The ClaimStore answer: a standardized claim-data register that improves transparency without replacing existing public systems.
- RRCA and USA Foundry as the private governance layer that can interface with state insurance departments, FEMA-adjacent frameworks, and municipal preparedness offices.
- Truth labels: most claims are `ASSERTION` or `HYPOTHESIS`; nothing is presented as enacted policy.
- Call to action: request a policy briefing or register interest in a PrepareAmerica seat.

**UI**
- New public route `/policy`.
- Uses existing components and design tokens.
- SEO metadata and JSON-LD `GovernmentOrganization` / `NGO` references where appropriate.
- Linked from the main navigation under "For policy."

---

## Track 3 — Why PrepareAmerica Page

A narrative page at `/why-prepare-america` that explains the convening itself: what it is, who it is for, what will happen, and what will not.

**Content**
- The origin: 25 years in insurance restoration, a network that needs to become a market.
- The format: 300 qualified stakeholders, no press, no pitching stage, working sessions only.
- The output: a published set of principles and a roadmap, not a product announcement.
- Truth labels: attendance is invite-only or application-based; no tickets are sold.

**UI**
- New public route `/why-prepare-america`.
- Links to `/prepare-america` application.
- SEO metadata and JSON-LD `Event` schema.

---

## Track 4 — Navigation and SEO Polish

- Update `Header.tsx` to include the three new public pages in a clean dropdown or inline on desktop.
- Ensure mobile menu includes the new routes.
- Update `sitemap.xml` generator to include `/investors`, `/policy`, and `/why-prepare-america`.
- Verify all new pages have unique titles, descriptions, canonicals, and OG tags via `routeHead`.

---

## Sequence

1. Draft content for `/investors`, `/policy`, and `/why-prepare-america` in a founder-reviewable form.
2. Build the three public routes using existing components and truth-label conventions.
3. Update `Header.tsx` navigation and mobile menu.
4. Update `sitemap.xml` generator.
5. Run typecheck and a Playwright smoke test across the new routes.
6. Update docs: `docs/SPRINTS.md`, `docs/REQUIREMENTS.md`, `docs/ARCHITECTURE.md`.

---

## Docs updates at close

- `docs/SPRINTS.md`: add 0.17 entry.
- `docs/REQUIREMENTS.md`: add F-6, F-7, F-8 for new public lanes; mark as shipped.
- `docs/ARCHITECTURE.md`: update public layer route list.
- `docs/DECISIONS.md`: optional ADR-012 on audience-specific public pages vs. a single generic front door.

---

## Explicitly out of scope

- Email capture beyond existing briefing/conference forms.
- New data models or authenticated functionality.
- Payment, ticketing, or sponsorship transactions.
- Real-time updates or websockets.

---

## Alternative: Sprint 0.17 — Email Activation

If the sender domain is verified between now and the next session, the alternative is to activate the email stubs in `src/lib/email.ts` so the founder receives notifications for new briefing requests, conference applications, and insider messages. This is a smaller, high-leverage sprint that depends entirely on domain verification.

**Recommendation:** Ship the public trust layer first. The 11-1-2026 audience-building window is more urgent than inbox notifications, and email activation can be slotted in as soon as the domain is ready.

Say the word and I will switch to build mode and start with the three public routes.