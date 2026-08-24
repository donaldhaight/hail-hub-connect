# Ship Phase 0 — Publish, Domain, Email, Backup, Audit

Make the current ClaimStore Briefing Room a real, shareable, founder-operable surface before any Phase 2 work begins.

## Goal

Phase 0 is live at a public URL with a custom domain option, transactional email is active, the codebase is backed up to GitHub, and a final quality audit confirms nothing is broken for signed-out visitors or for the founder account.

## Why now

The public front door, authenticated founder tools, insider room, conference logistics, and Owner's Manual are all functionally complete. The remaining blockers are operational, not product: publishing, domain/email setup, source control, and a last-mile QA pass. Shipping now gives you a stable URL to share with C-levels, VCs, and government contacts before the 11-1-2026 convening.

## Plan

### Step 1 — Security scan and build verification

- Run a security scan and resolve any critical findings that block publishing.
- Run `vite build` locally to confirm production bundle succeeds.
- Verify no runtime 500s on public routes (`/`, `/why-prepare-america`, `/briefing`, `/architecture`, `/prepare-america`, `/request-briefing`, `/b/*`, `/sitemap.xml`).

### Step 2 — Publish to Lovable

- Publish the project to its `.lovable.app` URL.
- Confirm public routes render correctly on the published URL (not just the preview).
- Do not rename the Lovable slug unless you ask for a specific one.

### Step 3 — Custom domain

- Connect a domain you own via Project Settings → Domains.
- Update `SITE_URL` in `src/lib/site.ts` and all canonical/OG URLs to the final custom domain.
- Re-publish so metadata points to the custom domain.

### Step 4 — Email sender domain and auth email templates

- Set the same domain as the email sender domain in Lovable Cloud Email.
- Scaffold auth email templates (`auth-email-hook` edge function + React Email templates) and deploy the function.
- Activate the existing email stubs in `src/lib/email.ts` for briefing-request and conference-application notifications.
- Send a test notification to yourself to confirm deliverability.

### Step 5 — GitHub backup

- Connect the project to a user-owned GitHub repository.
- Verify the initial sync includes `src/`, `docs/`, `supabase/`, and migration files.
- Record the repo URL in `docs/DECISIONS.md` under ADR-001 or a new ADR.

### Step 6 — Final quality audit

- Crawl every public link and screenshot each page at desktop and mobile widths.
- Sign in as `Donald.Haight@rrcausa.com` and walk every authenticated route: `/admin/inbox`, `/admin/invite`, `/admin/signals`, `/admin/digest`, `/admin/reads`, `/admin/edits`, `/admin/tour`, `/insider`, `/insider/dossier/$slug`, `/insider/refer`, `/manual`, `/manual/$slug`, `/manual/print`, `/prepare-america/confirmed?t=<token>`.
- Confirm redaction rules hold for signed-out users on `/architecture` and `/b/*`.
- Confirm the 300-seat capacity logic and waitlist promotion still work end-to-end.
- Document any findings; fix blocking bugs in the same pass, file cosmetic issues for later.

### Step 7 — Handoff checklist

- Update `docs/REQUIREMENTS.md` status for all Phase 0 epics to `shipped`.
- Update `docs/SPRINTS.md` with a new "Sprint 1.19 — Ship Phase 0" entry.
- Update `README.md` with the live URL, admin sign-in email, and a one-paragraph "what is deployed" summary.

## Out of scope for this plan

- Phase 2 feature design or prototyping.
- Uploading 2008–2014 archive documents into the manual appendices.
- New public pages, brand doors, or dashboard redesigns.

## Decision needed

If you already own the domain you want to use, tell me what it is. If not, the first publish will use the default Lovable subdomain and we can connect a domain afterward.
