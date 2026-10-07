# Swallowing the Map — the whole-site taxonomy

> **Status:** draft · **Class:** C2 · **Opened:** 2026-10-07 · **Register:** A131
> Truth label for the whole document unless a line says otherwise: `HYPOTHESIS`.
> This is a map, not a ruling. Nothing here creates a route, a table or a role.
> Band 3 does not appear on this map at any depth.

## 1. Why this exists

The founder asked the build to "walk the very long walk": lay the entire platform out —
menus, submenus, pages, stories, blurbs, images, videos, the Interested User progression,
SiteBMS and the App Home — with placeholders standing where content does not yet exist.
Text and colors are the easy part. The hard part is the shape: who sees what, in what order,
and which layer of the story each surface belongs to.

The organising convention is the Act 2 triad (Manual Chapter 94): the **Movie** is the
quick public front surface, the **Book** is the manuals and stakeholder pages, the **Game**
is App Home and SiteBMS. Every surface below is placed in exactly one layer.

## 2. The benchmark we cannot yet see

The reference organism is the Siteforum portal (community, RBAC, intranet, per-county
replication). The corpus holds **no verified inventory** of what Siteforum provides (A54)
and the 2019 backup walkthrough is blocked on the founder (A113). So this map is drawn from
our own routes and corpus, with Siteforum-shaped slots marked `[SF?]` wherever the founder
asserts Siteforum already did the thing. When the walkthrough happens, each `[SF?]` moves
to FACT or is struck.

## 3. The three embassies (top level)

| Embassy | Intention | Layer | Current surface | Label |
|---|---|---|---|---|
| RRCA | Selling the conflict of interest — the operator in the dirt | Movie → Game | `/rrca`, `/why-rrca`, `/proof-of-concept` | FACT (routes exist) |
| Adjusting Professionals Network | Every Estimate Has an Author | Movie → Book | `/adjusting-professionals` | FACT |
| Kimosabe Commons | Business development arm of Market Applications; conflict governed out | Movie | `/` (Universal Commons), `/kimosabe` | ASSERTION — the founder named it 2026-10-07; charter is proposal-only in the `kimosabe-commons` repository |

The second motion sits behind the embassies, never on the same page: **RoofLac** (the
product, Pillar 10) and **SelfInsurity** (the balance sheet). Ladder of trust: dry roof →
lifetime assurance → sovereign pool. `/selfinsurity` stays message-only until the Records
gate.

## 4. The seventeen market owners

Founder statement 2026-10-07 (`ASSERTION`): seven stakeholder groups to start, then six
more, then four on the corners — seventeen. Some become Stakeholder Groups, some
Designations. The canonical names live in other projects and sessions and have **not** been
ingested. Formula of record in history: `1 — 17 — 3,350`.

| Ring | Count | Names | Status |
|---|---|---|---|
| Core | 7 | per `docs/strategy/SEVEN-DOORS.md` | partly FACT; reconcile |
| Second ring | 6 | `[PLACEHOLDER — awaiting founder document]` | OPEN |
| Corners | 4 | `[PLACEHOLDER — awaiting founder document]` | OPEN |

Any names an assistant proposed in chat on 2026-10-07 are guesses and are **not** recorded.
Parallel noted, not modeled: 17 key U.S. government agencies; the consumer economy (Yellow
Pages) and the government economy (Federal Budget) meeting at one address.

## 5. The site tree

```text
MOVIE — public, SSR, no sign-in
/                         Universal Commons (Kimosabe Commons front)     ?as=<domain> previews
├── /movement             contractor / movement home
├── /adjusting-professionals
├── /rrca · /why-rrca · /proof-of-concept
├── /kimosabe · /buddy-claim
├── /selfinsurity          message-only
├── /prepare-america · /why-prepare-america · /prepare-america/confirmed
├── /national-roofing-army   proposed
├── /market-applications · /claimstore
├── /industry-problem · /vision · /architecture · /roles · /doors
├── /first-congress · /founder · /investors · /policy
├── /request-briefing · /briefing
├── /b/*                   brand host Doors (8)
└── [PLACEHOLDER] /groups/<one of 17>        a page per market owner   — not built
    [PLACEHOLDER] /media                     Movie reel: video, songs, film slots — not built

THRESHOLD — Interested User progression
/auth · /reset-password · /invitation/$credential · /ticket/$credential · /insider/accept · /offer/$slug
Anonymous session → holds a file (onboarding = holding a file) → role-scoped   (ADR-016 partitions)

BOOK — signed in
/manual · /manual/$slug · /manual/print        chapters (94 filed)
/insider · /insider/dossier/$slug · /insider/refer
/room · /ledger

GAME — signed in, App Home + SiteBMS
/app                       App Home
├── /app/tasks · /app/tasks/$taskId           tasks from State + Need
├── /app/role/$roleKey                        per-position workbench
├── /app/activity · /app/search · /app/account
└── [PLACEHOLDER] SiteBMS project views       — waits on Records / Object Model gate

FOUNDER — /founder app and /admin/*  (inbox, intake, queue, ledger, roles, screens, surfaces, …)
```

## 6. Menus

| Menu | Audience | Contents | Status |
|---|---|---|---|
| Commons nav | anyone | three embassies · Book teaser · Request briefing · Sign in | HYPOTHESIS |
| Embassy sub-nav | anyone on that Door | story · how it works · the guild · join / file | HYPOTHESIS |
| App Home rail | signed-in | Home · Tasks · My Role(s) · Activity · Manual | FACT in part (routes exist) |
| Founder rail | founder | existing admin set | FACT |

Permissions stay record-scoped; menus only reveal what the record already allows.

## 7. Content slots per page (the placeholder kit)

Every public page carries the same slot set so content can be poured in without redesign:
**headline · one-line promise · story block (narrative) · blurb trio · image · video ·
"the journey" step strip · proof / evidence · next door · call to hold a file.**
Empty slots render as labelled placeholders in preview only, never as invented claims.

## 8. What returns to the founder

- The six and the four names (and which are Groups vs Designations).
- Whether `/groups/*` and `/media` become routes.
- Any table behind §4 or §7 — schema changes are founder decisions.
- Siteforum walkthrough (A113) to settle every `[SF?]`.
