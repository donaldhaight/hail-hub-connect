# The Screen Book — what your tree gets right, and what is missing

Your outline is the missing artifact between the corpus and the build: a screen-by-screen
book where every surface is described before it is built. It fits the structure already
ruled — each folder is an **authorized container** (ADR-021) and its `variants/` folder is
the **Perception Library** (ADR-020). It is Expression, so it never overrides an
obligation; it points at the Pattern it expresses.

Below is what is absent, then what I would build.

## Missing branches

**Whole positions with no home in the tree**
- Licensed Contractor — set up, verification, offer approval, book of work.
- Property Owner — the PO app: property setup, free quote, RoofLac offer, good/better/best.
- Construction Manager / SiteBMS — the next operating perspective after the Agreement.
- Referraltor — named, undefined; needs a folder that says so.

**The record itself**
There is no `Records/` branch. Prospect → Lead → Offer → Pending Project → Project →
Warranty, plus Jobs, Job Orders, Other Charges. These are the screens the whole locked work
order is aiming at, and the tree currently jumps from role onboarding straight to the
founder's console.

**Shared surfaces every screen inherits**
Header, nav, footer, empty states, error and not-found, sign-in / reset / invitation
redemption, email templates, the public brand pages (`/b/*`), the Owner's Manual as a
reader surface, the insider dossiers, the Situation Room's public-facing edge.

**The named-but-unbuilt family**
MarketApp, BooksForge, MusicApp, MovieApp, MyGPT.TV sit in the footer marked "soon" with
nothing behind them. One folder each, holding the promise and the fact that it is empty.

## Missing facet files

Your per-screen file set covers purpose, content, layout, components, actions, states,
permissions, persona, variants, evidence, open questions. Four of the eight ruled container
facets have nowhere to live:

- **permitted records** — which records may appear here (distinct from permissions)
- **available tools** — what the guide may operate on the person's behalf
- **required context** — what must be known before the screen can render
- **completion event** — what ends the work this container holds

Also absent: the **truth label and confidentiality class** every claim in this project
carries, and the **Pattern link** — the corpus line this screen is an expression of. Without
that link the book quietly becomes a second source of truth.

## The risk worth naming

This tree can drift from `docs/work/OPEN-ITEMS.md` within a week. The rule that keeps it
honest: a screen folder never invents an obligation. If a screen needs something the corpus
does not yet say, it goes in that screen's `open-questions.md` **and** on the register and
the board with a register ID — same turn, same words.

## What I would build

Documentation only. No application code, no schema, no change to the locked work order.

1. `docs/screens/00-SCREEN-BOOK.md` — the manifest: the full tree including the missing
   branches, the file set for a screen folder, the naming convention, and the four rules
   (Expression never binds · every folder names its Pattern · every variant carries mood,
   audience, truth label, class · unanswered questions go to the register).
2. `SCREEN-TEMPLATE/` — one complete blank set of the facet files, with the four missing
   facets added and a front-matter block for purpose, class, Pattern link, status.
3. Two worked examples, so the format is proven rather than described:
   - `02_Persona_Front_Doors/Kimosabe/` — a screen that exists and can be read off the
     running app.
   - `05_ISR/Get_Set_Up/` — a screen that does not exist, so the empty facets show what a
     not-yet-built screen looks like honestly.
4. Register and board rows for every branch in the tree that has no content yet, so the
   book's own gaps are tracked where all other gaps are tracked.

## Technical notes

- New directory `docs/screens/`; added to the manifest in `docs/00-START-HERE.md` with
  status `in progress`, class `C2`.
- An ADR recording that the screen book is Expression under ADR-020 and that each folder is
  an authorized container declaration under ADR-021.
- Folders are created empty-with-a-README rather than filled; filling them is the ongoing
  work, one screen at a time, in the order you choose.
- Band 3 stays out: no screen folder describes storm targeting, kill zones, carrier routes,
  ghost profiles, offer generation or outreach sequencing.
