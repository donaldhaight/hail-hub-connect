# Owner's Manual — United Stakeholders of America LLC

One canonical document that explains the network: what it is, who the seven groups are, what happens on 11-1-2026, and exactly how every screen behind the login works. Written once inside the app, read by insiders at `/manual`, and exported as a designed PDF book with a shield cover.

## The shape of it

```text
  Cover ............ USA shield, centered, dark stock, no other imagery
  Inside cover ..... C-class stamp, edition, sole-owner rights reserve
  Preface .......... Why this manual exists (founder voice)
  Table of contents
  ────────────────────────────────────────────────
  Part I    The Mission          why the market is broken, the wedge
  Part II   The Seven Groups     one spread per brand, three-layer reveal
  Part III  The Event            PrepareAmerica, 11-1-2026, Gratitude Ranch
  Part IV   The Manual           every authenticated screen, step by step
  Part V    The Phases           Phase 0 shipped → Phase 3 mapped
  ────────────────────────────────────────────────
  Appendix A  2012-2014 field materials    (reserved, filled as you upload)
  Appendix B  2008-2012 original plan      (reserved)
  Appendix C  New plan + live requirements (reserved)
  Glossary ......... every term, alphabetical
  Index ............ term → section, auto-built
  Colophon ......... edition, date, truth-label legend
```

Part IV is the part that answers your real question — how to organize the rest of the project. It documents each private surface as: what it is for, who can see it, what you do on it, what the system does in response, and what is not built yet. Founder inbox, invitations, signals, reads, digest, edits, tour, insider index, dossier reader, discussion, attachments, referrals, attendee room, itinerary. Every one gets the same five-field treatment, so gaps become obvious on sight.

## Truth discipline carries over

Every section in the manual carries a truth label (FACT / ASSERTION / DECISION / HYPOTHESIS / SIMULATION / OPEN) and a confidentiality class, exactly like the dossiers. Sections with no source material yet are published as OPEN placeholders rather than omitted — the skeleton stays complete and the holes are visible. That is what makes the first pass useful instead of aspirational.

## Where the content lives

The manual is stored in the database, not hardcoded, so you can redline it in the browser the same way you already redline dossiers. Front matter, parts, chapters, and glossary terms are all editable. The PDF is generated from that same content on demand, so the book can never drift from the site.

## Reading and exporting

- `/manual` (behind login) — contents page with part/chapter navigation, truth chips, and reading progress.
- `/manual/$chapter` — the reader, same typographic treatment as the dossier reader.
- `/manual/print` — a print-optimized route that renders the whole book, cover to index, for browser "Save as PDF". Page breaks, running heads, page numbers, and the shield cover are all handled in CSS so the export is pixel-faithful.
- Founder-only edit controls inline, plus an audit trail of edits.

## The historical archive

Appendices A-C are created as empty, titled shells in this pass. As you feed me documents one at a time, each gets parsed, summarized with provenance (source, date, original purpose), and folded in as an appendix chapter with the original attached as a dossier-style artifact. Nothing gets rewritten — the 2012 Quick Start Guide stays the 2012 Quick Start Guide, with a modern annotation explaining what carried forward and what died.

## The cover

Dark stock. The United Stakeholders shield centered and generous. Title in Instrument Serif beneath it, edition line in mono at the foot. No gradient, no illustration, no second mark. It should read as a seal of office, not a brochure.

## Technical notes

- New tables: `manual_chapters` (part, position, title, truth, confidentiality, body), `manual_glossary` (term, definition, see-also), plus an edit audit table mirroring the dossier pattern. RLS: read for `qualified_insider` and `founder_admin`, write for `founder_admin` only, with GRANTs on each.
- Seed migration carries the full skeleton and all real content that exists today, drawn from `src/content/brands.ts`, `src/content/dossiers.ts`, `docs/ARCHITECTURE.md`, `docs/REQUIREMENTS.md`, and `docs/SPRINTS.md`. Nothing is invented; unknown areas are seeded as OPEN placeholders.
- Server functions in `src/lib/manual.functions.ts` following the existing dossier pattern; routes under `src/routes/_authenticated/manual/`.
- The shield is added via a Lovable asset pointer and used on the cover and the print route.
- The index is generated from glossary terms matched against chapter bodies at render time — no manual upkeep.

## Out of scope for pass 1

Public access to the manual, PSL sponsorship pricing tables, per-brand valuation dashboards, and any 2008-2014 content that has not been uploaded yet.
