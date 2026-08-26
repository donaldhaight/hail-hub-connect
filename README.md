# PrepareAmerica — United Stakeholders of America LLC

> A private front door and qualified-insider room for the RRCA restructuring and the ClaimStore proof of concept.

**Live site:** [https://hail-hub-connect.lovable.app](https://hail-hub-connect.lovable.app)  
**Custom domain (pending DNS):** [https://prepareamerica.com](https://prepareamerica.com)

**Milestone:** Sprint 2.5 complete. The public front door, founder inbox, insider dossier room, conference seat management, attendee experience, Situation Room, and First Congress demo mode are all functional and deployed.

## What this is

PrepareAmerica is the understated temporary front door for a larger strategy: restructure the Roofing & Reconstruction Contractors of America (RRCA) as the first operating proof of concept for a proposed transaction and coordination layer for the insurance-restoration market.

The site is designed to:

1. Attract referred C-level executives, capital, counsel, and government advisors.
2. Let the founder privately review, triage, and invite qualified insiders.
3. Give those insiders a labeled, versioned dossier room where they can read, question, and redline the working concept.
4. Manage the 11-1-2026 PrepareAmerica Conference — 300 seats, private, at Gratitude Ranch in Flower Mound, Texas.
5. Host the Situation Room, where delegates can drive a live demo of the Human Blockchain coordination model.

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
- [Lovable Cloud](https://docs.lovable.dev/features/cloud) — backend, auth, and storage
- [Supabase JS client](https://supabase.com/docs/reference/javascript) — generated client for type-safe database access

## Project documentation

- [`docs/PROTOCOL.md`](docs/PROTOCOL.md) — **how we work**: how material enters the archive, how it is annotated and filed, and how it becomes strategy, architecture, and code.
- [`docs/STRATEGY.md`](docs/STRATEGY.md) — the governing strategy memo: timeline, the two congresses, brand architecture, vocabulary, and marketing posture.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system map, routes, auth, and data model.
- [`docs/SPRINTS.md`](docs/SPRINTS.md) — sprint-by-sprint history from 0.1 through 2.5.
- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — living requirements backlog.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — architecture and product decisions.
- [`.lovable/plan.md`](.lovable/plan.md) — current plan and next credible moves.

## Important notes

- **This is a working concept, not an offering.** Every page carries a "Confidential Working Concept — Not an Offering" footer.
- **Truth labels are load-bearing.** All claims inside the insider room are classified as FACT, ASSERTION, DECISION, HYPOTHESIS, SIMULATION, or OPEN.
- **Email is stubbed until a sender domain is verified.** Invitation and notification emails are implemented as no-op stubs pending domain setup.

## Founder sign-in

- **Email:** `Donald.Haight@rrcausa.com`
- **Password:** `ClaimStore2026!`
- **Sign-in route:** `/auth`

## GitHub connection

This project is synced to GitHub for backup, collaboration, and portability:
**https://github.com/donaldhaight/prepareamerica.git**

The repository was originally created as `hail-hub-connect` and renamed to `prepareamerica` to match the mission brand. If the sync URL ever needs to be refreshed, update it in the Lovable editor under **Settings → Git**.
