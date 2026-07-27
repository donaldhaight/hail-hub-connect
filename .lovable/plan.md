## Sprint 0.13 — Public Front Door Polish

Goal: make the public briefing room look credible when a C-level, VC, or contractor opens it cold — on mobile, in a link preview, or via search. No new features; tighten what exists.

### 1. Mobile navigation

Current `Header` hides the nav below `lg:` and shows nothing in its place, so on phones the site loses its wayfinding. Add:
- A hamburger button (visible below `lg:`) that opens a full-width sheet with the same NAV entries plus the admin links (when signed in).
- Ensure the sticky "Request a Private Briefing" CTA stays reachable without overflowing on 360px widths (apply the `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` + `shrink-0` pattern from responsive-layout guidance).
- Verify `PageShell`, `PageHeader`, and the six coordination-question grid on `/industry-problem` don't clip at 375px.

### 2. Per-route head metadata audit

Every public leaf route already sets title/description/og:title/og:description. Add what's missing:
- `og:type: "website"` on the root, `"article"` on briefing routes (`/why-rrca`, `/industry-problem`, `/proof-of-concept`, `/vision`, `/prepare-america`, `/founder`).
- `og:url` self-referencing each route, using the project domain.
- `twitter:card: "summary_large_image"` on each leaf.
- `<link rel="canonical">` on each leaf route (not `__root`).
- Set a proper root default title/description in `__root.tsx` (site-wide fallback), plus `og:site_name: "ClaimStore Briefing Room"`.
- Do NOT add `og:image` — no branded hero exists yet; let hosting inject the screenshot preview.

### 3. Sitemap + robots

- Create `src/routes/sitemap[.]xml.ts` as a server route listing the seven public routes (`/`, `/why-rrca`, `/industry-problem`, `/proof-of-concept`, `/vision`, `/prepare-america`, `/founder`, `/request-briefing`). Omit `/auth`, `/insider.accept`, and everything under `_authenticated`.
- Add `public/robots.txt` allowing all crawlers with a `Sitemap:` directive pointing at the project domain.
- Base URL: `https://hail-hub-connect.lovable.app`.
- Omit `<lastmod>` (no authoritative per-page timestamp).

### 4. JSON-LD

- `Organization` schema on `__root` (name: ClaimStore / United Stakeholders of America LLC).
- `Event` schema on `/prepare-america` (PrepareAmerica Conference, 2026-11-01, Gratitude Ranch, Flower Mound TX) using the existing copy.

### 5. Small consistency + a11y passes

- Confirm a single `<h1>` per page (the `PageHeader` title).
- Add `aria-label` / `aria-current` where the nav uses `activeProps`.
- Confirm focus-visible rings on the CTA and nav links against the paper background.
- Verify color contrast of `text-silver` micro-labels meets AA on the paper background; darken the token slightly if it doesn't.

### 6. Verify

- `bun run build` clean.
- Playwright: load `/`, `/why-rrca`, `/prepare-america` at 375×812 and 1280×800; capture screenshots; confirm nav sheet opens on mobile; assert canonical + og:url present in rendered head.
- `curl` `/sitemap.xml` and `/robots.txt` and confirm both return correct content-types.

### Out of scope

- No `og:image` generation (no brand hero decided yet).
- No copy rewrites — polish only.
- No changes to auth, insider, or founder surfaces.
- No new dossier content.

After this ships, the natural next sprint is either **Attendee Experience** (confirmation page + itinerary for confirmed guests) or **Brand hero + OG image** (once you approve a visual direction).