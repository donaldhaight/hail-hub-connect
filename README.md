# PrepareAmerica — United Stakeholders of America LLC

> A private front door and qualified-insider room for the RRCA restructuring and
> the ClaimStore proof of concept.

**Live site:** [https://hail-hub-connect.lovable.app](https://hail-hub-connect.lovable.app)
**Custom domain (pending DNS):** [https://prepareamerica.com](https://prepareamerica.com)

## What this is

PrepareAmerica is the understated temporary front door for a larger strategy:
restructure the Roofing & Reconstruction Contractors of America (RRCA) as the
first operating proof of concept for a transaction and coordination layer for the
insurance-restoration market.

The site attracts referred executives, capital, counsel, and government advisors;
lets the founder triage and invite qualified insiders; gives those insiders a
labeled, versioned dossier room; manages the 11-1-2026 PrepareAmerica Conference;
and hosts the Situation Room, where delegates drive a live demo of the Human
Blockchain coordination model.

Two things travel together in this repository: **the application** in `src/`, and
**the corpus** in `docs/`. The corpus is the source of truth for what the
application must become.

## Current milestone

Sprint 2.5 shipped the public front door, founder inbox, insider dossier room,
conference seat management, attendee experience, Situation Room, and First
Congress demo mode. Work since then has been requirements capture ahead of the
Records layer. The locked work order is:

```text
Draft Connecticut Agreement → Records / Object Model → SiteBMS walkthrough
  → JobNimbus mapping → API / MCP
```

## Run locally

```sh
git clone https://github.com/donaldhaight/prepareamerica.git
cd prepareamerica
npm i
npm run dev
```

The dev server starts at `http://localhost:8080`.

## Built with

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [TanStack Query](https://tanstack.com/query) — server-state management
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [Lovable Cloud](https://docs.lovable.dev/features/cloud) — backend, auth, storage

## The corpus

Start at [`docs/00-START-HERE.md`](docs/00-START-HERE.md) — reading order, status
of every document, and the manifest a retrieval index walks. Any AI session
begins with [`AGENTS.md`](AGENTS.md), the standing brief.

| Document | Status | What it governs |
|---|---|---|
| [`docs/law/PROTOCOL.md`](docs/law/PROTOCOL.md) | binding | How work is done: intake, truth labels, redaction bands |
| [`docs/law/SHARED-SPINE.md`](docs/law/SHARED-SPINE.md) | binding | The invariant platform sequence |
| [`docs/law/DECISIONS.md`](docs/law/DECISIONS.md) | binding | Every ADR |
| [`docs/law/ARCHITECTURE.md`](docs/law/ARCHITECTURE.md) | binding | Routes, auth, boundaries, data model, agent surfaces |
| [`docs/strategy/STRATEGY.md`](docs/strategy/STRATEGY.md) | binding | Mission, timeline, the two congresses, vocabulary |
| [`docs/strategy/PERSPECTIVES.md`](docs/strategy/PERSPECTIVES.md) | in progress | One record, four readings |
| [`docs/requirements/REQUIREMENTS.md`](docs/requirements/REQUIREMENTS.md) | in progress | Epic backlog and acceptance criteria |
| [`docs/requirements/RECORDS-MODEL.md`](docs/requirements/RECORDS-MODEL.md) | in progress | The address-centred object model |
| [`docs/requirements/CONNECTICUT-AGREEMENT.md`](docs/requirements/CONNECTICUT-AGREEMENT.md) | in progress | Legal and operating rules that generate the model |
| [`docs/work/OPEN-ITEMS.md`](docs/work/OPEN-ITEMS.md) | register | Everything open, mirrored on the founder backlog board |
| [`docs/work/SPRINTS.md`](docs/work/SPRINTS.md) | historical | The build log |
| [`docs/history/`](docs/history/) | historical | Dated checkpoints, kept as written |

## Truth labels and confidentiality

Claims carry `FACT`, `ASSERTION`, `DECISION`, `HYPOTHESIS`, `SIMULATION`, or
`OPEN`. Surfaces carry `C0` public · `C1` named prospect · `C2` qualified insider
· `C3` counsel and capital · `C4` founder only. Storm-targeting method (band 3 of
the redaction map) never appears in a demo, a public page, or an agent's output.

## Important notes

- **This is a working concept, not an offering.** Every page carries a
  "Confidential Working Concept — Not an Offering" footer.
- **Email is stubbed until a sender domain is verified.**

## Sign-in

- **Route:** `/auth`
- Access is by invitation only. Credentials are never recorded in this
  repository or anywhere else in the corpus.

## GitHub connection

Synced for backup, collaboration, and portability:
**https://github.com/donaldhaight/prepareamerica.git**

Originally created as `hail-hub-connect` and renamed to match the mission brand.
Refresh the sync URL in the Lovable editor under **Settings → Git**.
