# Sprint 3.2b — The Evidence Layer: images, logos, documents, links

Short answer: yes, incorporate them — but not as decoration. Every image, PDF, deck, screenshot, or Google Doc link should enter the project as **evidence attached to a claim**, never as loose media. That is what turns the manual and the dossiers from a well-written argument into a verifiable one. A stranger cannot verify your vision; they can verify that you filed it in 2008.

## The rule we adopt

One media model, three uses:

```text
  ARTIFACT  = a file or link + title + date + provenance + truth label + confidentiality class
     |
     +-- attached to a dossier section   (machinery exists today)
     +-- attached to a manual chapter    (does not exist yet — this sprint)
     +-- promoted to a figure in the body of a chapter (inline, captioned, numbered)
```

Brand logos and design imagery are the one exception: those are product assets, not evidence, and live in the codebase.

## What goes where

| Kind | Where it lives | Who sees it |
| --- | --- | --- |
| Brand marks, shield, UI illustration | app assets, imported directly | everyone |
| Screenshots of our own screens | manual chapter figures | insiders |
| PDFs, decks, filings, 2008–2014 archive | private storage bucket, signed URLs | insiders / founder-only per item |
| Word, Excel, Keynote, anything not web-native | uploaded as-is **and** a generated PDF or text preview | insiders |
| Google Docs / Drive / external URLs | link artifacts with a captured title, date, and a warning if access is not public | insiders |
| YouTube / Vimeo video, NotebookLM audio overviews, screen recordings | media artifacts, played in-app in our own player | insiders |

Nothing external is trusted to stay alive. Any Google Doc or third-party link we depend on gets a snapshot (PDF or text extract) stored alongside it, so the book never breaks because someone changed a sharing setting.

## Video, audio, and the Media Room — yes, and it belongs here

You are right that it was not in the plan, and right that it is huge. NotebookLM audio overviews, Gemini-generated explainers, YouTube walkthroughs, and screen recordings are the highest-conversion asset we have for a C-level reader who will not read 47 chapters. They are also the hardest to keep coordinated, which is exactly the argument for treating them as artifacts under the same model rather than as links pasted into prose.

Three things get built:

1. **Media artifacts.** Video and audio become a kind alongside file and link: a YouTube/Vimeo URL, an uploaded MP4/MP3, or a NotebookLM audio overview. Each carries duration, a poster image, a transcript, and the same date/provenance/truth/confidentiality fields as everything else. Transcripts make video searchable and quotable — a video with no transcript is invisible to a reader who is skimming.
2. **A player, not an embed dump.** One in-app player component used everywhere: chapter media, dossier media, and the Media Room. Remembers your position, tracks watch percentage per insider (so the signals dashboard shows who watched what and where they dropped), and shows the transcript beside the video with click-to-seek.
3. **The Media Room / slideshow player.** A curated, ordered playlist surface: a sequence of media plus still figures plus pull quotes, played end to end with auto-advance, chapter markers, and a narration track. This is the "sell themselves on the vision" tool — you hand someone a link, they press play, and the argument runs in order without you in the room. Playlists are built and reordered by you in the founder view, can be scoped (investor cut, contractor cut, think-tank cut, delegate cut), and each has its own share credential like the ticket pages.

Coordination is the real deliverable: one registry where every video, audio piece, document, and figure is listed with what it proves and where it appears, so nothing lives only in your Drive and nothing on the site points at a dead upload.

## What gets built

1. **Manual attachments.** Mirror the existing dossier attachment machinery for `manual_chapters`: upload, title, description, publish toggle, ordering, delete, signed-URL open, and open-tracking so you can see who read what.
2. **Provenance line.** Each artifact carries `original_date`, `source`, and `why_this_matters`. Rendered under the chapter title as a dated evidence strip — "Filed 2008. Siteforum build. Original architecture." That line is the credibility multiplier.
3. **Figures inside prose.** A chapter body can reference an attached image by marker; it renders as a numbered, captioned figure with a click-to-enlarge lightbox. Screenshots of our own screens stop being an admin curiosity and become illustrations in the book.
4. **Link artifacts done properly.** Paste a Google Doc or any URL; we store the title, note whether it is publicly reachable, and let you attach a snapshot file. Broken or private links are flagged in the founder view instead of silently rotting.
5. **Document parsing on upload.** PDFs and Office files get their text extracted at upload time so the artifact is searchable and so I can summarize it with provenance when you feed documents one at a time.
6. **Founder evidence index.** One admin screen listing every artifact across dossiers and the manual: what it proves, its date, its class, whether it is published, and how many insiders opened it. This is how the archive stops being a folder and becomes an asset register.
7. **Print edition carries evidence.** Figures print in place; attachments print as a numbered appendix of exhibits with dates. That is what makes the handed-over PDF feel like a filing rather than an export.

## How you feed it

Your preferred rhythm holds: one document at a time. You upload, I read it, write the provenance framing and the "what carried forward / what died" annotation, and attach it to the chapter it proves. Nothing gets rewritten — the 2012 Quick Start Guide stays the 2012 Quick Start Guide.

## Sequencing

- **Now (3.2b-1):** manual attachments + provenance line + evidence index. Pure build, no writing from you.
- **Then (3.2b-2):** inline figures and the lightbox, plus screenshot capture of the current private screens for use as figures.
- **Then (3.2b-3):** link snapshots and document text extraction.
- **Then (3.2b-4):** media artifacts and the in-app player with transcripts and watch tracking.
- **Then (3.2b-5):** the Media Room — curated playlists, auto-advance slideshow, audience cuts, shareable credentials.
- **Later (3.2d):** exhibits in the print edition; media appears there as a captioned still plus a QR/short link.

## Technical notes

- New `manual_attachments` table mirroring `dossier_attachments` (chapter id instead of dossier slug), plus `manual_attachment_opens`, both with GRANTs and RLS: read for `qualified_insider` when published, full access for `founder_admin`.
- New provenance columns on both attachment tables: `original_date`, `source_label`, `significance`.
- Reuse the existing private `dossier-artifacts` bucket and the signed-URL pattern in `src/lib/attachments.functions.ts`; new server functions in `src/lib/manual-attachments.functions.ts`.
- Figures use a `[[figure:<attachment-id>]]` marker resolved at render time inside the existing prose renderer, so chapter bodies stay plain text and editable.
- Text extraction runs at upload for PDFs; Office formats are converted server-side to text where possible and otherwise stored with a manual summary field.
- Brand/UI imagery continues to live in `src/assets` and is imported directly; it never enters the artifact tables.
- Media adds `kind = 'video' | 'audio'` plus `provider`, `duration_seconds`, `poster_path`, and `transcript` columns; hosted video stays on YouTube/Vimeo (we do not pay to serve video), uploaded audio and short recordings go to the private bucket.
- Watch progress lands in a `media_progress` table keyed by user and artifact, feeding the existing signals dashboard the same way dwell time already does.
- Playlists: `media_playlists` and `media_playlist_items` (ordered, mixed media/figure/quote), with a share credential mirroring the `/ticket/$credential` pattern.

## Out of scope

Public access to any artifact, in-browser image or video editing, self-hosted video streaming, AI-generated narration, and OCR of scanned handwriting.
