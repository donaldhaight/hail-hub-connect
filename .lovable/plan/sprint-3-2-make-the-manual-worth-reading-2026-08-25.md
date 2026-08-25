# Sprint 3.2 — Make the Manual Worth Reading

Yes: focus here for a short while. Everything else on the backlog is operational (domain, sender domain, slug, GitHub). The manual is the only asset that compounds — it is the thing an executive, a VC, or a think-tank reader takes away and re-reads. Right now it is a complete skeleton with thin flesh.

## What the manual actually is today

- 47 chapters across 8 parts — the structure is finished and correct.
- 32,210 characters of body text total. That averages ~120 words per chapter: roughly one paragraph each. A real chapter is 800–1,500 words.
- 26 glossary terms.
- 0 attachments, 0 recorded edits. Nothing from the 2008–2014 archive is in it, and nobody has yet marked it up.
- 5 dossiers / 13 sections exist separately and do not cross-reference the manual at all.

So the diagnosis is not "the manual needs more features." It is: the outline is right, the writing has not happened yet, and the reader has no way to feel weight, provenance, or progress.

## What raises value and attraction, in priority order

### 1. Depth in the eight chapters that carry the argument

Not all 47 at once. Pick the load-bearing spine — the front-matter thesis, the fragmentation case, the Human Blockchain architecture, the seven groups overview, the Two Congress strategy, the Season Ladder, the PSL/seat-license economics, and the founder's provenance chapter — and take each to full length. Written in your voice, with the twenty-five years of scar tissue that nobody else can fabricate. The other 39 stay as-is and read as a promised table of contents, which is fine and even correct for a working document.

### 2. Provenance — the archive is the moat

A stranger cannot verify your vision. They can verify that you filed it in 2008. Attach the original artifacts — the Siteforum build, early decks, filings, screenshots, dated correspondence — to the chapters they prove, with a dated provenance line rendered under the chapter title. The `dossier_attachments` machinery already exists; the manual has no equivalent yet. This is the single largest credibility multiplier available.

### 3. Reading-experience craft

- Chapter estimated reading time and a manual-wide progress bar, so a reader knows the shape of the commitment.
- Pull quotes: one marked line per chapter rendered large in the margin, the thing a reader screenshots.
- Inline glossary: a defined term is underlined in the body and shows its definition on hover or tap, instead of forcing a trip to the back.
- Cross-links between manual chapters and the dossier corpus, so the two bodies of work stop being strangers.
- Previous/next chapter navigation and a persistent part-level sidebar.

### 4. A physical-object print edition

The current print route dumps chapters. A real edition: title page, colophon with version and date, running heads, part dividers, chapter drop caps, page numbers, and a printed glossary and index. The point is that when you hand a PDF to a C-level, it looks like a book, not an export.

### 5. Editorial state, so we can both see the gap

Each chapter gets a draft status — outline, drafting, review, final — visible only to you, plus a word count. The manual index then honestly shows "9 of 47 chapters final." That converts a vague sense of incompleteness into a work queue, and it is what turns this into a writing project we can actually finish.

## Recommended sequence

Sprint 3.2a — reading craft and editorial state (items 3 and 5). Pure build, no writing from you. It makes the gap visible and the reading pleasant.

Sprint 3.2b — provenance attachments (item 2). Build the upload and rendering, then you feed documents one at a time as you prefer, and I write the provenance framing around each.

Sprint 3.2c — the eight spine chapters (item 1). We work chapter by chapter in conversation; I draft from our sessions and the strategy docs, you redline.

Sprint 3.2d — the print edition (item 4), last, once there is enough text for a book to be worth setting.

The operational backlog items stay parked and take fifteen minutes each whenever you are at a desk.

## Technical notes

- Add editorial columns to `manual_chapters` (draft status, word count, pull-quote line, provenance note) via migration.
- Add a `manual_attachments` table mirroring `dossier_attachments`, using the existing private storage bucket and signed-URL pattern in `src/lib/attachments.functions.ts`.
- Inline glossary resolves against the existing `manual_glossary` table at render time — no content re-authoring needed.
- Reading time and word count derive from `body` in `src/content/manual.ts`.
- Print edition stays a route under the authenticated manual subtree, print-CSS only, no PDF library.
