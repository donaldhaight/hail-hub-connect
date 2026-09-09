# Repo check + documentation reorganization for the agent era

## 1. Backup status — verified

Everything is already saved and pushed. The working tree is clean (no uncommitted
changes), and the latest commit "Backlog board updated" is on the connected
branch, which syncs to GitHub as `prepareamerica`. Nothing to push.

## 2. What's wrong with the current layout

`docs/` is now twelve flat files of near-equal weight — strategy, protocol,
decisions, records model, perspectives, open items, sprints, a dated checkpoint,
the Connecticut draft. Nothing tells a new reader (or a new AI session, or a
future agent team) which file is law, which is history, and which is a draft in
motion. The README describes the site but not the corpus, and `AGENTS.md` holds
only Lovable's boilerplate — so every LLM that joins the project has to be
briefed by hand, which is exactly the failure mode the Working Protocol exists
to prevent.

## 3. Proposed structure

```text
README.md            what this is, how to run it, and the map of everything else
AGENTS.md            the standing brief every AI session reads first
docs/
  00-START-HERE.md   reading order + which files are binding vs. in progress
  law/               binding: PROTOCOL, DECISIONS, SHARED-SPINE, ARCHITECTURE
  strategy/          STRATEGY, PERSPECTIVES
  requirements/      REQUIREMENTS, RECORDS-MODEL, CONNECTICUT-AGREEMENT (draft)
  work/              OPEN-ITEMS (the register), SPRINTS (history)
  history/           DH-METHOD-CHECKPOINT-2026-09-09 and future dated checkpoints
```

Every file keeps its name and content; only its folder changes, plus a short
status header at the top of each (binding / in progress / historical, last
revised, who it governs). All cross-references between documents get repaired in
the same pass.

## 4. AGENTS.md becomes the standing brief

This is the piece that serves the one-prompt, agent-team, orchestration future.
It stays short and stable, and covers:

- The one-paragraph statement of what this project is.
- The reading order: which four files an agent must load before proposing work.
- The corpus rules already in the Protocol, stated as instructions: truth labels,
  confidentiality bands C0–C4, the four-boundary redaction map (band 3 never
  leaves the founder), the locked work order Connecticut → Records → SiteBMS →
  JobNimbus → API/MCP.
- The standing rule that new work lands in the register and on the backlog board
  in the same turn.
- What an agent may decide alone versus what must come back to the founder.
- The Lovable git note that's already there, preserved verbatim.

## 5. README rewritten

Two audiences in one page: a human arriving cold, and a machine indexing the
repo. Sections: what PrepareAmerica is; the current milestone; how to run it;
the corpus map with one line per document and its status; the locked work order;
truth labels and confidentiality classes in brief; founder sign-in; the GitHub
connection.

## 6. Groundwork for retrieval and agent teams

Documentation-only, no code:

- A short front-matter block on each doc (title, status, class, last revised,
  supersedes) so the corpus can later be chunked and indexed for retrieval
  without re-reading every file by hand.
- `docs/00-START-HERE.md` doubles as the manifest a future indexer walks.
- A new section in `docs/ARCHITECTURE.md` naming — not building — the intended
  agent surfaces: the Kimosabe memory partitions already set in ADR-016, where a
  retrieval index would sit relative to them, and the boundary that no agent
  crosses a memory partition without the person's act.

## 7. Not in this sprint

No application code, no database changes, no UI, no retrieval index actually
built, no new strategy. Pure filing and framing.

## Technical notes

Moves use `git mv` so history follows each file. After the move I re-run a
search for every intra-doc link and path reference (including from
`src/` and `.lovable/plan/*`) and fix them, then run a typecheck to confirm
nothing in the app referenced a doc path.
