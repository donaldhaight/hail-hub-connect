# Sprint 0.7 — Dossier Reader + Insider Activity Log

The `/insider` room currently lists dossier cards but they don't open. Insiders can't actually read anything, and the founder has no visibility into who has accessed what. This sprint closes that loop so the insider layer becomes usable at the PrepareAmerica preview.

## What we'll build

### 1. Dossier content model (C2/C3, simulated)
Move dossier definitions out of the index component into a typed registry so each entry has:
- `slug`, `title`, `summary`, `confidentiality` (C2/C3), `truthDefault` (DRAFT/SIMULATION/ASSERTION)
- `sections[]` — ordered narrative blocks, each with its own truth label
- `storyOrder` position so the canonical sequence (RRCA → Case Study → ClaimExpress → ClaimStore → USA Foundry → PrepareAmerica) is enforced in navigation

Content is authored in-repo as structured TS (not a DB table yet — faster to iterate, and keeps C2/C3 material out of any anon-reachable surface).

### 2. Dossier reader route
New route `/_authenticated/insider/dossier/$slug`:
- Gated to `qualified_insider` or `founder_admin` (same guard as `/insider`)
- Renders title, confidentiality chip, per-section truth chips
- Persistent "Confidential Working Concept — Not an Offering" footer + simulation banner when any section is SIMULATION
- Prev/Next navigation follows `storyOrder`
- "Back to Index" returns to `/insider`

### 3. Access logging
New table `insider_access_log` (user_id, dossier_slug, opened_at, ip hash optional).
- Server fn `logDossierOpen` called on reader mount
- RLS: insert-own for authenticated; select restricted to `founder_admin`

### 4. Founder visibility
New tab in `/admin/inbox` → **Insider Activity**:
- List recent opens (who, what, when)
- Group by insider so the founder can see engagement depth before PrepareAmerica
- CSV export

### 5. Insider index polish
- Show "Last opened" per card for the current insider
- Order cards by canonical story order (not alphabetical)

## Technical notes

- Migration adds `insider_access_log` with GRANTs (`authenticated` insert/select, `service_role` all) and RLS policies using `has_role()`.
- Dossier registry: `src/content/dossiers.ts` — pure data, imported by both index and reader.
- Reader uses `createServerFn` + `requireSupabaseAuth` to verify role server-side before returning content (defense in depth beyond the route gate).
- No email work — sender domain still deferred.

## Out of scope
- Real content authoring beyond 1-2 seed sections per dossier (you'll want to redline)
- Dossier editing UI (Phase 2)
- ClaimCoin / ClaimsBank interactive models (Phase 3)

## Next sprint preview (0.8)
Once you're ready: founder-authored dossier notes + insider Q&A thread per dossier, so PrepareAmerica attendees can leave structured feedback tied to specific sections.