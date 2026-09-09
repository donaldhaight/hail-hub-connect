# Standing brief for any agent working on this project

Read this first, every session. It is short on purpose and changes rarely.

## What this is

PrepareAmerica is the front door and working corpus for United Stakeholders of
America LLC: a coordination and transaction layer for the insurance-restoration
market, with the RRCA restructuring as its first operating proof of concept.
The application is a TanStack Start site on Lovable Cloud; the corpus in `docs/`
is the source of truth for what it must become.

The standing rule: **if it is not in the corpus, it did not happen.**

## Before you propose anything

Load these four, in order:

1. [`docs/law/PROTOCOL.md`](docs/law/PROTOCOL.md)
2. [`docs/law/SHARED-SPINE.md`](docs/law/SHARED-SPINE.md)
3. [`docs/law/DECISIONS.md`](docs/law/DECISIONS.md)
4. [`docs/work/OPEN-ITEMS.md`](docs/work/OPEN-ITEMS.md)

The full map and status of every document is
[`docs/00-START-HERE.md`](docs/00-START-HERE.md).

## Rules that bind your output

- **Locked work order.** Draft Connecticut Agreement → Records / Object Model →
  SiteBMS → JobNimbus mapping → API / MCP. Nothing is modeled ahead of its gate.
- **Truth labels.** Every claim you write carries one: `FACT`, `ASSERTION`,
  `DECISION`, `HYPOTHESIS`, `SIMULATION`, `OPEN`. An assertion is never quietly
  promoted to a fact because it has been repeated.
- **Confidentiality classes.** `C0` public · `C1` named prospect · `C2` qualified
  insider · `C3` counsel and capital · `C4` founder only. Write to the class of
  the surface you are writing for.
- **Band 3 never leaves the founder.** Storm targeting, kill-zone and fringe
  tagging, carrier routes, ghost profiles, offer generation, outreach sequencing.
  Its outcomes may appear; its method never does — not in a demo, a public page,
  a chat reply, or an agent's output.
- **Authority = Role + applicable Relationship + applicable Assignment.** Not
  every actor needs all three. Permissions are record-scoped, never menu-scoped.
- **Register and board together.** New work lands in
  `docs/work/OPEN-ITEMS.md` *and* on the founder backlog board in the same turn,
  carrying the same register ID. They close together.
- **Decisions get written at the moment they are made** — a dated ADR in
  `docs/law/DECISIONS.md`, with the alternatives considered.
- **Memory partitions are not crossed by inference** (ADR-016). Anonymous
  session → personal file → role- and app-scoped. Only the person's own act
  moves anything across a boundary.

## What you may decide alone, and what comes back to the founder

**Alone:** copy, layout, an admin view over existing data, a field on an existing
form, bug fixes, documentation filing, anything reversible and non-structural.

**Back to the founder:** schema changes, anything touching money, seats, roles or
credentials, anything that changes what insiders can see, anything downstream of
material still in the intake lane, and any work that would jump the locked order.
Write the backlog row with acceptance criteria drafted and say it is waiting.

**Never without an explicit instruction:** publishing, domain changes, deleting
corpus material, or editing a `history/` document to match the present.

## House style

Narrative prose over bullet inventories. Patterns named across documents, not
summaries of each file. Disagreement stated once, with the reason, then execute
as asked. One owner: the founder reserves all rights to execute and pivot.

<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
