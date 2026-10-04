# Site Walk — every page, every link, signed out and signed in

> **Status:** findings · **Class:** C4 · **Walked:** 2026-10-04 · read-only, nothing changed
> Method: a headless browser opened every route file in `src/routes`, followed every internal
> link it found, and recorded where each page landed, its headline, and how many other pages
> link to it. Pass 1 signed out. Pass 2 signed in as an ordinary account with **no role**
> (buddyclaim@gmail.com) — so the founder view itself was not walked; that is a separate pass.

## The headline

`FACT` Nothing is broken. Every one of 57 public and 65 signed-in addresses answered; no dead
links, no crashes, no console errors. The problem is not breakage — it is **reachability**.
The house has two well-lit hallways (the narrative pages and App Home) and a great many rooms
with no door from the hallway.

## Rooms nobody links to (signed out)

`FACT` These pages work but no page on the site points at them:

- **All six Interest Doors** — `/kimosabe`, `/buddy-claim`, `/claimstore`, `/rrca`,
  `/selfinsurity`, `/national-roofing-army`, `/market-applications`. By design they are meant
  to be reached from their own domains, but today those domains are not live, so the Doors are
  invisible except by typed address.
- `/first-congress` — and it greets a visitor with "This session is closed to you."
- `/prepare-america/confirmed`, `/insider/accept`, `/reset-password` — expected (reached by
  email or after an action).
- The seven `/b/*` brand cards are reached from exactly one place (the Architecture page).

`FACT` Top navigation carries: Home, Why PrepareAmerica, The Briefing, Prepare America,
Architecture, Roles, Founder, Request a briefing, Sign in. Vision, Why RRCA, Industry Problem,
Proof of Concept, Investors and Policy are reached only through in-page links and the footer.

## Signed in, no role

- `FACT` App Home, Account, Tasks and the Role Store read cleanly. **Activity** (`/app/activity`)
  and **Search** (`/app/search`) have no link from App Home. `/ledger` and `/room` are reachable
  only by address or one link.
- `FACT` `/manual` sends a roleless person silently back to the home page with no explanation.
  The same for `/insider`. A one-line "this is for qualified insiders" would be kinder.
- `FACT` The sign-in page's headline reads **"Founder sign in."** to everyone, including Door
  visitors and insiders.
- `FACT` Inconsistent gatekeeping on founder pages: most say "Not authorized," but
  `/admin/invite`, `/admin/queue`, `/admin/ledger` and `/admin/tour` draw their page frame for a
  roleless account. The data behind them is still protected — every action and list checks the
  founder role on the server — so nothing leaks, but the page shells should refuse the same way.
  `/admin/roles` quietly redirects to the queue.

## Proposals (not built — for the founder's redline)

`HYPOTHESIS` **A Doors index.** One public page — "Many Doors, One Platform" — listing the
Interest Doors with one line each, linked from the footer. Solves invisibility until domains go
live without promoting any Door into the main navigation.

`HYPOTHESIS` **Three-tier footer** — Movement · Narrative · Doors — so every public page has at
least one inbound link and the top navigation stays short.

`HYPOTHESIS` **App Home side rail** adds Activity, Search and (for insiders) Manual and Ledger.

`HYPOTHESIS` **Content blocks.** The Doors already share one engine with fixed sections; the
narrative pages do not. A small block palette (hero, statement, three-up, timeline, quote,
disclosure, call to action, evidence card) stored as records would let the founder compose and
redline pages in place — the Gutenberg / Circle page-builder idea. This touches schema and so
comes back to the founder before any build.

`DECISION` (agent, reversible) — fix the "Founder sign in" headline and make the four admin page
shells refuse like the others. Copy and gatekeeping display only; listed for approval with the
rest.
