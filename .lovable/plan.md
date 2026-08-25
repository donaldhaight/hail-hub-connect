# Connect prepareamerica.com and Set the Mission Brand

Two moves: make the site live at the domain you actually want people to remember, and decide what that domain *says* before the invitations go out.

## Part 1 — Connect the domain

Domain connection itself happens in Project Settings → Domains (I can't add DNS records for you), but the codebase has to be ready first or every canonical tag, sitemap URL, and social preview will keep pointing at the Lovable subdomain.

Steps, in order:

1. Publish is already done, so the domain flow is available.
2. In Project Settings → Project → Domains, connect two entries: `prepareamerica.com` and `www.prepareamerica.com`. Set `prepareamerica.com` as Primary so `www` redirects to it.
3. At your registrar, add the records Lovable shows: A records for `@` and `www` pointing to `185.158.133.1`, plus the `_lovable` TXT verification record. If the domain sits behind Cloudflare, check "Domain uses Cloudflare or a similar proxy" in the Advanced section first so it uses CNAME verification instead.
4. Wait for verification and automatic SSL. Usually minutes; the outer bound is 72 hours.

### Code changes I make in the same pass

- `src/lib/site.ts` — `SITE_URL` becomes `https://prepareamerica.com`. This is the single source for `routeHead()`, so most canonical/OG tags follow automatically.
- Six files still hardcode the old host and get switched to the shared constant: `src/routes/index.tsx`, `src/routes/briefing.tsx`, `src/routes/prepare-america.tsx`, `src/routes/__root.tsx`, `src/routes/sitemap[.]xml.ts`, `public/robots.txt` (sitemap line).
- `README.md` gets the live URL.
- Re-publish so the deployed metadata matches.

One caveat worth naming: crawlers cache previews. Existing shared links will show old titles until Facebook/LinkedIn/X re-scrape or you force it in their debuggers.

## Part 2 — Brand the mission

Right now the site has two competing identities. The homepage leads with the PrepareAmerica thesis; the metadata, site name, and manual all say "ClaimStore Briefing Room." With `prepareamerica.com` as the front door, that split becomes visible to every C-level who lands there.

Three coherent directions:

**A. PrepareAmerica as the movement, ClaimStore as the proof.**
`SITE_NAME` becomes "PrepareAmerica"; every page title reads "… — PrepareAmerica." ClaimStore, RRCA, and the seven verticals stay exactly where they are, one layer in, as the evidence. Cleanest fit with the thesis homepage and with the Vertical → Brand → Domain reveal discipline you already enforce.

**B. Dual-signature.**
`SITE_NAME` becomes "PrepareAmerica · United Stakeholders of America." Signals the convening body and the movement together. Heavier in titles, stronger with government and institutional readers.

**C. Keep ClaimStore Briefing Room, treat prepareamerica.com as the event door.**
Domain redirects into the conference track; the briefing identity stays intact. Least disruptive, but it wastes the domain's rhetorical power.

My read: **A**. The domain is the argument — "if we can fix the insurance restoration market, we can fix the government" only lands if the URL is the movement, not the vendor. ClaimStore is stronger as what you *show* than as what you're *called* at the door.

### What changes under A

- `SITE_NAME` in `src/lib/site.ts`, which cascades to every `og:site_name` and title suffix.
- Header wordmark and footer attribution.
- `__root.tsx` sitewide defaults and the WebSite/Organization JSON-LD.
- Homepage and `/why-prepare-america` copy reviewed for consistency — no restructuring, just making sure the naming reads as one voice.
- Owner's Manual cover and title page reframed as United Stakeholders of America publishing under the PrepareAmerica banner.

Not touched: the seven brand doors, redaction rules, the manual's chapter content, the conference logic.

## Decision needed

Confirm the domain is yours to point (and whether it's on Cloudflare), and pick A, B, or C. I'll do the domain-readiness code pass and the branding pass in one execution.
