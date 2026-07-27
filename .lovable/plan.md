
## Phase 2 — The Quantum Dashboard Architecture

Extend the current ClaimStore Briefing Room into a seven-brand federation. Phase 2 keeps the same `qualified_insider` gate, the same Lovable Cloud backend, and the same truth-labeling discipline — but reframes the app around the **1-17-3350 Human Blockchain** and the **Three-Layer Reveal** (Verticals → Brands → Domains).

Sprint 1.0 delivers all seven understated brand front doors and the shared shell that will later host each brand's Quantum Dashboard. No dashboards yet — that is Sprint 1.1+.

### The seven stakeholder groups (from your strategy doc)

```text
                    Foundation
                United Stakeholders
                        │
        Tech ─── Kimosabe (center) ─── Legal
   Market Apps    Bus Dev / OS       Buddy Claim
                        │
     Insurance  ────────┼──────── Construction Mgmt
    SelfInsurity        │              RRCA (25-yr anchor)
                        │
                     Banking
                    ClaimStore
```

Plus four unnamed **Angels** (Constitutional Guardrails) referenced but not personified.

### Sprint 1.0 deliverables

1. **Brand registry** — `src/content/brands.ts` with a typed record per brand:
   - `id`, `vertical` (Foundation/Tech/Legal/Insurance/Banking/Construction/Kimosabe), `brandName`, `domain`, `tagline`, `positionInGeometry`, `truthClass`, `status` (Operational / In Design / Conceptual), `paletteToken`, `oneLineValue`.
   - Seeded from the doc: United Stakeholders, Market Applications, Buddy Claim, SelfInsurity, ClaimStore, RRCA, Kimosabe.

2. **Seven public routes under one domain**, route-group pattern `/b/<slug>`:
   - `/b/united-stakeholders` — Foundation / Governance
   - `/b/market-applications` — Tech / Engineering arm
   - `/b/buddy-claim` — Legal / Resolution
   - `/b/selfinsurity` — Insurance / Carrier expertise
   - `/b/claimstore` — Banking / Financial rails (links to existing ClaimStore content)
   - `/b/rrca` — Construction / 25-year anchor (links to existing RRCA dossier)
   - `/b/kimosabe` — Center / Connective intelligence
   - Each is a **BrandShell** page: hero (vertical → brand → domain in that reveal order), one-line value, status chip, "Request briefing" CTA, four-Angels footer note.
   - Each gets its own `head()` metadata via `routeHead()`, unique OG tags, and joins the sitemap.

3. **Shared shell + Quantum switcher**
   - New `BrandShell` component wrapping `PageShell` with brand-scoped palette (CSS custom properties driven by `paletteToken`), brand wordmark, and a persistent **brand switcher dropdown** in the header labeled "Quantum Dashboard ▾".
   - Dropdown groups the seven by vertical (Foundation, Tech, Legal, Insurance, Banking, Construction, Center) and shows each brand's status chip.
   - Available on all public and authenticated routes so an insider can jump between brands.

4. **Distinct visual identity per brand, shared discipline**
   - Seven palette tokens defined in `src/styles.css` (each brand gets `--brand-ink`, `--brand-accent`, `--brand-paper`). All other tokens (truth chips, confidentiality chips, footer, typography) stay shared.
   - Same Instrument Serif + Inter type system; only accent + paper shift per brand.

5. **The Three-Layer Reveal, encoded**
   - Each `/b/<slug>` hero renders in the doc's mandated order:
     1. **Vertical** (large label — "Banking", "Legal", etc.)
     2. **Brand name** (revealed second, smaller)
     3. **Domain** (smallest, at the bottom of the hero — the "afterthought")
   - A short "Why this order" tooltip explains the reveal discipline to first-time viewers.

6. **1-17-3350 marker**
   - Small footer badge on every brand page: "1 protocol · 17 roles · 3,350 counties". Links to a new `/architecture` page that renders the Metatron 7-position diagram and names the four Angels as unnamed guardrails.

7. **Insider dossier per brand (stub)**
   - Seed one dossier per brand in the existing `dossiers` table with a single introductory section (SIMULATION-labeled) so `/insider` immediately shows a seven-row corpus. Real depth comes with the Quantum Dashboard in Sprint 1.1.

8. **Navigation, SEO, and docs**
   - Header (desktop + mobile) gains the Quantum Dashboard dropdown.
   - `robots.txt` allows `/b/*` and `/architecture`; sitemap includes all seven.
   - `docs/REQUIREMENTS.md` gains **Epic 6 — Quantum Federation**; `docs/SPRINTS.md` logs Sprint 1.0; `docs/DECISIONS.md` gains ADR-008 (route-group federation on one domain, subdomains deferred until we connect custom domains).

### Explicitly out of scope for Sprint 1.0

- The actual Quantum Dashboard (assumptions, variables, options, filtered data) — that is Sprint 1.1, one brand at a time, starting with RRCA per your "prove the pattern then replicate" instinct.
- Personal Seat License (PSL) flow, tiers (Explorer / Architect / Founder), $10M valuation surfacing — Sprint 1.2.
- The 17-position expansion and the four Angels as claimable roles — Sprint 1.3.
- Custom subdomains per brand — deferred; the route-group pattern lets us lift-and-shift to subdomains later without rewriting.

### Technical notes

- Route files: `src/routes/b/united-stakeholders.tsx` etc., each with `createFileRoute("/b/<slug>")` and its own `head()`.
- One layout route `src/routes/b/route.tsx` renders `<Outlet />` and applies the brand palette via a data attribute on the shell.
- Brand palette applied via `data-brand="<id>"` on `<BrandShell>`; CSS defines `[data-brand="rrca"] { --accent: ... }` etc. Keeps semantic tokens intact.
- No schema migration needed for the front doors themselves; the dossier stubs use `supabase--insert`, not a migration.
- Build/typecheck verified in the same turn.

### Acceptance criteria

- All seven `/b/<slug>` routes render with distinct palettes, the Three-Layer Reveal order, and unique metadata.
- Header Quantum Dashboard dropdown works on desktop and mobile and appears on every page.
- Sitemap and robots include the new routes; auth and admin routes remain excluded.
- `/architecture` page renders the 7-position diagram and names the four Angels as unnamed guardrails.
- `/insider` lists seven brand dossiers with SIMULATION chips.
- Build passes; the existing Briefing Room, admin inbox, invite flow, and confirmed-attendee page remain fully functional.

### Next step

Approve this plan and I'll implement Sprint 1.0. If any brand's tagline, one-line value, or palette direction should be different from what the strategy doc implies, tell me now and I'll bake it in — otherwise I'll draft understated defaults and you can redline them in the founder editor once they're live.
