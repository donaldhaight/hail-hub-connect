## Current state

**GitHub is not connected yet.** The repo only points to Lovable's internal storage (`private.lovable-gcp.code.storage` and `s3://lovable-repositories/...`). There is no `github.com` remote, so code is not syncing to a GitHub repository you own.

**Documentation is minimal.** We have:
- `README.md` — generic Lovable template, not project-specific.
- `.lovable/plan.md` — living sprint plan, currently at Sprint 0.14.
- `AGENTS.md` — Lovable sync warning only.
- `src/routes/README.md` — TanStack routing conventions.

No project requirements backlog, architecture overview, sprint history, or schema documentation exists yet.

## Plan

### 1. Connect GitHub

Connecting GitHub gives you a true external copy of the codebase, version history, and the ability to develop locally or with a team. It also makes the project portable outside Lovable.

**Steps:**
1. In the Lovable editor, open the **Plus (+)** menu in the chat input → **GitHub** → **Connect project**.
2. Authorize the Lovable GitHub App.
3. Select the GitHub account/organization where the repository should live.
4. Click **Create Repository** in Lovable.
5. After creation, verify the new `github.com` remote appears in the project.

**What I will do once connected:**
- Update `README.md` with the real clone URL and project-specific context.
- Add a `.github/CONTRIBUTING.md` if you expect other collaborators.
- Confirm bidirectional sync is working by checking the next commit lands in GitHub.

### 2. Document work to date

I propose replacing the generic README and adding a lightweight documentation layer that tells the story of the project while remaining useful for development.

**Files to create or rewrite:**

| File | Purpose |
|------|---------|
| `README.md` | Project identity, one-line vision, how to run locally, tech stack, link to public preview. |
| `.lovable/plan.md` | Keep as the rolling sprint plan. Restructure so it reads as a changelog with current/next sprint at the top. |
| `docs/ARCHITECTURE.md` | High-level system map: public routes, authenticated founder layer, insider room, database concepts, auth flow. |
| `docs/SPRINTS.md` | Sprint-by-sprint history (0.1 through 0.14) with what was built and why. |
| `docs/REQUIREMENTS.md` | Living requirements backlog: epics, user stories, acceptance criteria, and status. |
| `docs/DECISIONS.md` | Architecture and product decisions (e.g., why TanStack Start, why Lovable Cloud, why Instrument Serif + Inter, truth-label discipline). |

**Content to capture from existing work:**
- Vision pillars: RRCA, USA, ClaimStore, ClaimsBank, ClaimLoan, ClaimCoin.
- Story order: RRCA → Case Study → ClaimExpress → ClaimStore → USA Foundry.
- Truth-label taxonomy: FACT, ASSERTION, DECISION, HYPOTHESIS, SIMULATION, OPEN.
- Confidentiality classes: C0–C4.
- Sprint history: 0.1 through 0.14 with key features shipped.
- Current data model summary (public tables, RLS patterns, role system).

### 3. Living documentation rhythm going forward

To keep documentation from rotting, tie it to the sprint cycle.

**At the start of each sprint:**
- Update `docs/REQUIREMENTS.md` with the sprint goal, user stories, and acceptance criteria.
- Update `.lovable/plan.md` with the chosen sprint and rationale.

**During the sprint:**
- Add decisions to `docs/DECISIONS.md` as they are made (especially pivots or pattern changes).
- Update `docs/ARCHITECTURE.md` when new routes, tables, or auth boundaries are introduced.

**At the end of each sprint:**
- Append a concise entry to `docs/SPRINTS.md`.
- Update `README.md` if the public URL, run instructions, or tech stack changed.

**Documentation ownership:**
- I will draft and maintain the technical docs as part of each sprint.
- You own the vision narrative, requirements priority, and any market/strategy sections.

## Recommended first action

Connect GitHub first. Once the repository exists, I will rewrite `README.md` and create the initial `docs/` layer in the next sprint-sized chunk of work. If you want, I can make the documentation sprint the very next thing we ship — it pairs well with a pause before Sprint 0.15.

## Open question

Do you want the next sprint to be **documentation + GitHub hygiene** (no new product features), or should I fold the documentation updates into the next product sprint while we keep building toward 11-1-2026?