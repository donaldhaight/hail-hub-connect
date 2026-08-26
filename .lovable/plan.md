# The Corpus Lands — Ingesting the Human Blockchain OKF Bundle

You dropped the whole thing. 34 documents, two registers of decisions and open questions, a 157,801-word ClaimStore synthesis, an agent instruction file, and a roadmap that already knows what it doesn't have. This is the first real test of the Intake Lane, and it arrives at scale.

## What I read

The bundle is `human-blockchain-operating-system` v0.2 — a Docusaurus + Open Knowledge Format package. Its authority order is the same one we operate under here: your current narrated intention first, approved decisions second, working software third, the brief fourth, the historical corpus last. That means this repo does not overrule what we've built; it supplies it.

Highest-value contents, by what they unlock:

- `docs/50-execution/` — `backlog-user-stories.md` (2,372 lines), `api-event-schema.md`, `data-dictionary-field-naming.md`, `developer-agent-handoff.md`, `mvp-demo-requirements.md`. This is a Phase Zero build spec that already exists.
- `docs/20-product/` — data model master, MVP ERD, entity/role/designation matrix, screen inventory and UX flow, ClaimExpress protocol, Need-to-Done addendum, master glossary.
- `docs/40-market/one-prompt-event-package.md` and `founding-sponsor-position-book.md` — the 11-1 event and the PSL/sponsor model, already written down.
- `docs/90-registers/` — decisions, assumptions and variables, risks and review gates, source register. Named open questions, not vibes.
- `sources/ChatGPT-2-ClaimStore-Vision-Requirements-*.md` — the 1.2 MB origin synthesis behind all of it.

## The contradiction worth flagging first

Two live descriptions of the same program now exist: this repo's Stage 0–6 roadmap (ingestion engine first, Phase Zero platform at Stage 6) and our Season/Congress ladder with the One Prompt Event on 11-1-2026. They are compatible but not identical, and the naming diverges — Quantum Dashboard survives in the repo where we retired it publicly in favor of The Human Blockchain. Reconciling those two roadmaps into one is the real work, not the file copying.

## Plan

### Step 1 — Preserve and register (no interpretation)

- Copy the bundle into `docs/corpus/hbos-v0.2/` unchanged, minus git metadata and `node_modules`/lockfiles.
- Add a source card at `docs/corpus/hbos-v0.2/SOURCE.md`: origin repo, upload date, file count, hash, and the authority note that this is retrievable evidence, not canon.
- Register each of the 34 documents as an Intake Lane item with title, layer(s), a one-line "what it proves," and triage state. Product and execution docs land as `requirements`; the continuity brief and market docs as `business`; the ChatGPT synthesis as `wildcard` pending extraction.

### Step 2 — Read and annotate the eleven that matter

Full read, with annotations recorded in the lane, of: master continuity brief, current-state, master roadmap, backlog user stories, mvp demo requirements, data model master, mvp ERD, entity/role/designation matrix, screen inventory, one prompt event package, and the three registers.

Output is one document — `docs/RECONCILIATION.md` — with three tables:

1. **Already built here** — repo requirement mapped to the route/table that satisfies it.
2. **Gap** — repo requirement with no counterpart in this codebase.
3. **Conflict** — repo says X, our standing decisions say Y, with a recommendation for each.

### Step 3 — Fold into the live instruments

- `docs/REQUIREMENTS.md` absorbs the gaps as new epics, each tagged with its corpus source path.
- The Project Backlog board gets the Phase Zero items as cards, priced under the standing rule: human hours, agent hours, materials, labor, turnkey bid, equipment, other expenses.
- `docs/DECISIONS.md` records each conflict resolution as a dated ADR — including a formal ruling on Quantum Dashboard vs. The Human Blockchain.
- The registers' open questions become open questions in the lane, addressed to you, not silently resolved by me.

### Step 4 — Extract the synthesis

The 157k-word ClaimStore synthesis gets chunked and indexed into the corpus search that already spans intake, manual, and dossiers — so a question asked in the Concept Lab can retrieve the 2026 origin passage that answers it.

## What this is not

Not a rebuild. Not adopting the repo's Docusaurus stack — this project stays TanStack Start; the bundle enters as corpus, not as a second site. No schema changes beyond intake rows unless Step 2 proves one is needed, and that comes back to you as a priced sprint before it's built.

## Technical notes

- Copy excludes `.git`, `package-lock.json`, and `node_modules`; markdown, `okf.yaml`, and `manifest.json` come in as-is.
- Intake registration runs as a one-time seeded migration with literal INSERTs so the lane is populated on first load, not on page render.
- The corpus search index reuses the existing search path; no new provider.

## Decision needed

Confirm the sequence, and tell me one thing: when Step 2 finds a conflict between what that repo says and what we've decided here since, does the newer decision here win by default — or do you want each one surfaced for your ruling?
