# Sprint 3.2c — The Intake Lane and the Concept Lab

Two problems, one answer. You need to hand me the whole archive before I can be useful across all three layers, and you need somewhere to put a live side concept (the Daytona/Indy dual-race month) without breaking the zone we are in. Today the evidence machinery only accepts an artifact if it already knows which chapter or dossier it proves. That is exactly what blocks bulk intake and blocks speculative ideas.

So we add two things next to what exists: an **Intake Lane** for unfiled material, and a **Concept Lab** for ideas that are not yet doctrine.

## How we work, concretely

```text
  you drop material  ->  INTAKE LANE (unfiled, dated, mine to read)
                            |
        I read + annotate   |  what it is, when, what it proves, which layer
                            v
         +------------------+------------------+
         |                  |                  |
    CULTURAL           BUSINESS/VALUATION   REQUIREMENTS
         |                  |                  |
         +--------> file against a chapter / dossier / backlog item
                            |
                     CONCEPT LAB (side tracks: Dual Race Month, etc.)
                     promoted into the manual only when it earns it
```

You can still feed one document at a time — that rhythm stays. The difference is nothing has to be filed at the moment it arrives, and nothing gets lost while unfiled. Batch uploads are fine too; the lane holds them in a queue with a "needs triage" count so neither of us loses the thread.

## What gets built

1. **Intake Lane** (`/admin/intake`). Drag in files or paste links with no chapter required. Each item gets a date, a source, and a triage state: `new`, `read`, `filed`, `parked`. I annotate each one with what it is, what it proves, and which of the three layers it feeds. Filing an item moves it to a chapter or dossier using the machinery already shipped — no re-upload.
2. **Layer tags.** Every artifact and every intake item carries one or more of `cultural`, `business`, `requirements`, `wildcard`. The wildcard tag is deliberate: it is where the fourth-layer ideas land instead of being flattened into one of the three.
3. **Concept Lab** (`/admin/lab`). A track is a named side concept with its own brief, its own artifacts, its own open questions, and a status: `exploring`, `converging`, `adopted`, `retired`. Dual Race Month becomes track one, seeded with whatever you bring from the ChatGPT/Manus sessions. Adopting a track writes its decisions into `docs/DECISIONS.md` language and generates the manual chapters or backlog items it implies — that is the "bring it all back here" mechanism, and it is one click rather than a re-explanation.
4. **Cross-links.** A track can cite manual chapters and dossiers; a chapter can show "informed by: Dual Race Month". Nothing in the Lab renders to insiders until adopted, so the public and the corpus stay clean while you think out loud.
5. **Archive map** (`/admin/intake` summary strip). Counts by layer, by decade, by source, and a list of the gaps I can see — "no artifacts dated 2015–2019", "no valuation model filed". That map is what lets me ideate against the whole archive instead of the last thing I read.
6. **Text extraction at intake.** PDFs and Office files get their text pulled on arrival so I can search, quote, and cross-reference the whole corpus rather than only what is in the current conversation. This pulls 3.2b-3 forward, because end-to-end knowledge is worthless if I can only read the newest file.

## On the side project

Do not start a separate Lovable project for it. A cloned repo would fork the corpus and you would spend the next month reconciling two versions of the same vision. The Lab gives you the same isolation — separate surface, separate status, invisible to insiders — with none of the merge cost. Bring the dual-race material in whenever you like; if it never gets adopted it costs us a row in a table.

## Answering the direct question

Yes, I can plan and architect while you load. That is the better order: as documents land I write the provenance annotations and, at the same time, revise the chapter outline, the valuation narrative, and the requirements backlog to match what the archive actually proves. You will see the manual's shape change as the evidence arrives rather than after.

## Technical notes

- New `intake_items` table: `id, kind (file|link), storage_path, external_url, title, original_date, source_label, notes, layers text[], triage_state, filed_as (manual|dossier|null), filed_ref, created_at`. GRANTs plus founder-only RLS; insiders never read this table.
- Filing calls the existing `upsertManualAttachment` / dossier attachment paths and reuses the same `dossier-artifacts` bucket path, so no file is copied twice.
- `layers text[]` added to `manual_attachments` and `dossier_attachments` as well, defaulting to empty.
- New `concept_tracks` and `concept_track_notes` tables, founder-only. Adoption writes backlog rows through the existing backlog functions.
- Extracted document text stored in an `extracted_text` column, indexed for full-text search; a founder-only search box spans intake, manual, and dossier text.
- Server functions in `src/lib/intake.functions.ts` and `src/lib/lab.functions.ts`, mirroring the thin-wrapper shape used by `src/lib/manual-attachments.functions.ts`.

## Out of scope

Insider-visible Lab content, AI auto-filing without your confirmation, OCR of handwriting, and video work — media artifacts remain queued as 3.2b-4/3.2b-5 behind this.
