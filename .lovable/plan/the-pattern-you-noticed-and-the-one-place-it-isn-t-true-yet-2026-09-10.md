# The pattern you noticed — and the one place it isn't true yet

## Is it true?

Half of it. Three surfaces already follow the pattern, and I confirmed each in the code:

- **The backlog board** — one row per open item, with status (`idea · planned · building ·
  shipped · parked`), created date, a discussion thread per row, and a one-click build brief.
  Live, database-backed, editable in place.
- **The Owner's Manual and the insider dossiers** — chapters and sections edited in place,
  with evidence attached per section: PDF and screenshot uploads *and* links, gathered into
  a single Evidence Index across the whole corpus, plus an edit log of corpus changes.
- **The intake lane** — drop documents and links before they are filed.

**The Screen Book is the exception.** Everything I built for it yesterday is markdown files
in the repository. There is no table view, no form, no upload box, no status column, no
last-edited date, no link to a previous state. Today the only way to embellish a screen
folder is to ask me to edit a file. That is the gap your question found.

## Is it a good way to move the project forward?

Yes, with one caveat worth saying once.

It is good because it turns the hardest remaining work — describing several hundred
surfaces across every stakeholder group — into something you and other people can chip at
in small pieces, in any order, without me in the loop for each one. Each screen becomes a
row with a status, so at any moment the book itself tells you how much of the system has
actually been described. And the uploads matter more than the text: a legacy ClaimExpress
screenshot dropped onto a screen row is Source material, which outranks anything either of
us writes about it.

The caveat: the book describes; it never rules. A screen row can hold a question, but the
answer still has to land on the register and the board, or the book quietly becomes a
second source of truth. That rule is already written into the book's front page, and the
build below enforces it by making "send this question to the backlog" a button rather than
a good intention.

## What I would build

A Screen Book surface inside the Founder App, at `/admin/screens`, working the way the
backlog board already works.

1. **The tree as a table.** Every branch and screen from the book, one row each: branch,
   screen name, status (`empty · specified · built`), class, route if it has one, count of
   open questions, and last edited. Filter by branch, status, and class. This is the
   progress bar for the entire description effort.
2. **A screen page.** Open a row and get the twelve facets — purpose, permissions, records,
   actions, tools, context, completion, content, layout, components, states, persona — each
   an editable text area saved on its own. Front matter (status, class, truth label, Pattern
   links, route, register IDs) edited as fields, not as raw text.
3. **Evidence per screen.** Upload PDFs and screenshots, or attach links, exactly as the
   manual does today — same storage, same signed-URL handling. Legacy screens land here.
4. **Previous state.** Every save writes a revision. Each facet shows its history: who,
   when, and the text as it was, restorable. Evidence is never overwritten; a correction is
   a new dated artifact.
5. **Questions become register rows.** A question typed on a screen gets a button that
   creates the backlog row and stamps the register ID back onto the screen — register and
   board together, in the same act.
6. **The repository stays in step.** An export writes the current state of every screen back
   to `docs/screens/` so the corpus on disk and the live book never diverge.

Nothing here touches the locked work order, the Records model, or any public surface. It is
founder-only tooling for describing what we already agreed to describe.

## Technical notes

- New tables: `screen_pages` (branch, slug, name, status, class, truth, route, pattern
  links, register IDs, ordering, timestamps), `screen_facets` (page, facet key, body,
  updated_at), `screen_facet_revisions` (append-only prior bodies), and screen-scoped rows
  reusing the existing attachment shape for evidence. Founder-only policies plus explicit
  grants on each.
- Seeded from the existing `docs/screens/` tree in the migration, so the board opens already
  populated with every branch, the two worked examples, and the honest empty ones.
- Server functions in `src/lib/screens.functions.ts`, guarded the way `backlog.functions.ts`
  is; UI reuses `PageShell`, the board patterns from `BacklogBoard.tsx`, and the attachment
  component from the manual.
- New link added to the Founder Console surface list.

**Waiting on you:** this creates database tables, which is a structural change I do not make
alone. Approving this plan is that decision.
