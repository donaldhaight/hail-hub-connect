## Sprint 0.11 — Founder Dossier Editor (in-app authoring)

Right now every dossier's title, summary, and section body lives in `src/content/dossiers.ts` — a source file. To change one word, the founder has to ask me to ship code. That's a bottleneck heading into the 11-1-2026 convening, where dossier language will iterate daily. This sprint moves the dossier corpus into Lovable Cloud, gives the founder an in-app editor, and keeps the current file as the seed / fallback.

### What ships

**1. Dossier storage in the database**
Two tables: `dossiers` (slug, code, story_order, title, summary, confidentiality, truth_default, published_at) and `dossier_sections` (dossier_slug, position, heading, truth, body). RLS: anyone with `qualified_insider` or `founder_admin` can read; only `founder_admin` can write. Existing dossier slugs stay the same, so all existing notes/messages/opens keep working.

**2. Seed from `src/content/dossiers.ts`**
Migration inserts the current five dossiers and their sections verbatim. Nothing visible changes to insiders on first load.

**3. Founder edit surface**
- Inline "Edit" button next to each section heading in the dossier reader (founder only). Opens a compact inline editor for heading, truth label, and body. Save writes to `dossier_sections`.
- Header-level "Edit dossier meta" toggle for title / summary / confidentiality / truth default.
- "Add section" and "Remove section" controls (with a confirm) at the bottom of the section list.
- Reorder via up/down arrows on each section (position is authoritative).
- All edits are optimistic on the founder's screen with a visible saved/unsaved state; server is source of truth.

**4. Reader reads from DB, falls back to file**
Reader and index load from the `dossiers` + `dossier_sections` tables. If the DB is empty for a slug (first load before seed runs), fall back to `src/content/dossiers.ts` so nothing breaks mid-migration. Story order, truth chips, confidentiality chips, SIMULATION banner, and section-level NEW markers all continue to work — they just read live data.

**5. Edit audit trail**
`dossier_edits` table logs each save (actor, slug, section_id or null, field, before, after, timestamp). Surfaces as a small "Recent edits" tab inside `/admin/inbox` so co-authors can see what the founder just changed. No versioned rollback in this sprint — that's Sprint 0.12 if wanted.

### What this is NOT

- Not a rich-text editor. Body is plain text with blank-line paragraph splitting, exactly like today. Truth discipline stays chip-based, not inline markup.
- Not multi-author. Only `founder_admin` writes.
- Not versioned rollback. The edit log records history; restoring a prior version is a follow-on.
- No new dossier types or fields beyond what already exists.

### Technical notes

- Migration: `dossiers`, `dossier_sections`, `dossier_edits`. All three get GRANTs + RLS + `updated_at` triggers. Section unique key: `(dossier_slug, position)`.
- New server functions in `src/lib/dossier.functions.ts`:
  `listDossiersFromDb`, `getDossierFromDb(slug)`, `upsertDossierMeta`, `upsertDossierSection`, `deleteDossierSection`, `reorderDossierSection`, `listDossierEdits`.
- `src/content/dossiers.ts` stays as the seed source and typed fallback; `Dossier` / `DossierSection` types move to a shared `src/content/dossier-types.ts` so DB responses share the type.
- Reader (`insider/dossier.$slug.tsx`) becomes DB-first with file fallback. Index (`insider/index.tsx`) loads the ordered list from DB (falls back to `ORDERED_DOSSIERS`).
- Founder-only edit UI is a small `<DossierEditor>` co-located with the reader — no separate route. Non-founders see the same page they see today.
- Story order stays load-bearing: the seed migration sets `story_order` explicitly per current values; the editor exposes reordering only within a dossier's sections, not across dossiers, to preserve the RRCA → ClaimExpress → ClaimStore → USA Foundry → PrepareAmerica sequence unless we explicitly decide otherwise.

Approve and I'll build it.
