# Start Here — the corpus map

> **Status:** binding · **Class:** C2 · **Last revised:** 2026-09-09
> The reading order for any human or agent joining this project, and the manifest
> a future retrieval index walks.

This project's source of truth is the corpus, not the conversation. If it is not
in these files, it did not happen. Read in the order below before proposing work.

---

## 1. Reading order

Load these four first. Nothing should be proposed without them.

1. [`law/PROTOCOL.md`](law/PROTOCOL.md) — how work is done here: intake, truth
   labels, confidentiality bands, the four-boundary redaction map.
2. [`law/SHARED-SPINE.md`](law/SHARED-SPINE.md) — the invariant sequence
   Interested User → Identity → Certification → Roles → Permissions → Ledger →
   Tasks → Records.
3. [`law/DECISIONS.md`](law/DECISIONS.md) — every ADR. A later ADR supersedes an
   earlier one; nothing is reopened by inference.
4. [`work/OPEN-ITEMS.md`](work/OPEN-ITEMS.md) — what is open right now, and the
   locked work order.

Then read whichever of `strategy/` and `requirements/` the task touches.

## 2. The manifest

| File | Status | Class | What it governs |
|---|---|---|---|
| [`law/PROTOCOL.md`](law/PROTOCOL.md) | binding | C2 | Working method, truth labels, redaction bands |
| [`law/SHARED-SPINE.md`](law/SHARED-SPINE.md) | binding | C2 | The invariant platform sequence |
| [`law/DECISIONS.md`](law/DECISIONS.md) | binding | C2 | ADR-001 onward |
| [`law/ARCHITECTURE.md`](law/ARCHITECTURE.md) | binding | C2 | Routes, auth, boundaries, data model, agent surfaces |
| [`strategy/STRATEGY.md`](strategy/STRATEGY.md) | binding | C1 | Mission, timeline, the two congresses, vocabulary |
| [`strategy/PERSPECTIVES.md`](strategy/PERSPECTIVES.md) | in progress | C2 | One record, four readings |
| [`strategy/KIMOSABE-POSITIONING.md`](strategy/KIMOSABE-POSITIONING.md) | in progress | C1 | The scout position, voice, personas, audience ladder |
| [`requirements/REQUIREMENTS.md`](requirements/REQUIREMENTS.md) | in progress | C2 | The epic backlog and acceptance criteria |
| [`requirements/RECORDS-MODEL.md`](requirements/RECORDS-MODEL.md) | in progress | C2 | The address-centred object model |
| [`requirements/KNOWLEDGE-LIBRARY.md`](requirements/KNOWLEDGE-LIBRARY.md) | in progress | C2 | Source / Pattern / Expression, the Perception Library, authorized containers |
| [`requirements/CONNECTICUT-AGREEMENT.md`](requirements/CONNECTICUT-AGREEMENT.md) | in progress | C3 | Legal and operating rules that generate the model |
| [`work/OPEN-ITEMS.md`](work/OPEN-ITEMS.md) | register | C4 | Document of record for open work |
| [`work/SPRINTS.md`](work/SPRINTS.md) | historical | C2 | The build log |
| [`history/`](history/) | historical | C2 | Dated checkpoints, kept as written |

Planning notes live in `.lovable/plan/` — dated, superseded by whatever landed
after them, and never authoritative over the files above.

## 3. Status vocabulary

- **binding** — in force. Change it only with a new decision recorded in
  `law/DECISIONS.md`.
- **in progress** — requirements being captured. Real, but not final. Do not
  build a schema against it without saying so.
- **register** — the standing list of open work. Mirrored on the founder backlog
  board; both close together.
- **historical** — a record of a moment. Never edited to match the present.

## 4. The locked work order

Nothing is picked up out of sequence:

```text
Draft Connecticut Agreement → Records / Object Model → SiteBMS walkthrough
  → JobNimbus mapping → API / MCP
```

## 5. Truth labels and confidentiality classes

Every claim carries a truth label: `FACT`, `ASSERTION`, `DECISION`, `HYPOTHESIS`,
`SIMULATION`, `OPEN`. Every surface carries a class: `C0` public · `C1` named
prospect · `C2` qualified insider · `C3` counsel and capital · `C4` founder only.
Full definitions in [`law/PROTOCOL.md`](law/PROTOCOL.md) §9.

Band 3 of the redaction map — storm targeting and everything downstream of it —
never appears in a demo, a public page, or an agent's output.
