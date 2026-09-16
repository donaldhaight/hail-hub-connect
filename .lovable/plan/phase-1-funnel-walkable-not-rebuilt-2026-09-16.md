# Phase 1 Funnel — walkable, not rebuilt

Make the narrated nine-step Phase 1 flow walkable end to end for three simulated people,
using what already exists. One new content file, one new offer screen, one new activity view,
and a track-aware set of starter Tasks. Nothing else moves. The Construction Management work
order is untouched.

Everything written in this pass is **SIMULATION** content and is labelled as such on screen.
It is not approved copy and not a commercial offer.

## What already exists, and what it serves

| Narrated step | Served by | Verdict |
|---|---|---|
| 1. Public landing | `/kimosabe`, `/buddy-claim` (one `FrontDoor` engine, persona records), plus the institutional pages | Exists. Needs a track parameter only |
| 2. Interested User / onboarding | `FrontDoor` anchor + holding wallet + append-only ledger, `/auth`, wallet claim-on-sign-in | Exists |
| 3. App Home | `/app` — identity, roles, balance, Tasks, the channel | Exists |
| 4. Getting Started | Tasks are derived in `apphome.server.ts`; there is no audience-shaped starter set | Configuration: new derived tasks, no new screen |
| 5. Content / Reader | `/manual` and `/manual/$slug` — chapters, evidence, read tracking | Exists, reused as the reader |
| 6. Offer / Opportunity | Nothing. The Role Store sells a certification, not an audience offer | Genuinely missing — one simple new screen |
| 7. Request / Conversion | `/request-briefing` writes to the request queue; founder accepts and grants | Exists. Carry the track and offer through |
| 8. Confirmation / Next step | Confirmation copy exists after a request | Exists, made track-aware |
| 9. Activity / Record | The person's own ledger is readable but has no signed-in view of their own | Small new view over existing records |

So: three of nine need work, and only one of those is a real new screen.

## The three acceptance cases

A single content file defines three tracks — Experienced Builder, Property Owner,
Licensed Contractor / ISR. A track selects the landing framing, the starter Tasks, the reader
chapter, the offer shown, and the confirmation's next step. No new role, no new record type,
no new permission rule. The Property Owner track deliberately ends at a request, because no
Property Owner position is built and the plan will not pretend otherwise.

## Work

1. **`src/content/funnels.ts`** — the three tracks as data: key, label, framing line, starter
   task definitions, reader chapter slug, offer slug, confirmation next step. Truth label
   `SIMULATION` carried on every offer string.
2. **Track parameter** — `/kimosabe?track=builder|owner|contractor` passes the track into the
   front door's copy and stores it with the anchor. No change to the wallet or ledger.
3. **Starter Tasks** — extend the existing derivation in `apphome.server.ts` with the track's
   tasks, using the current `AppHomeTask` shape (label, detail, why, action, href,
   dismissible). They appear in App Home and `/app/tasks` with no UI change.
4. **`/offer/$slug`** — the one new screen. Existing `PageShell`/`Section` components, the
   offer read from `funnels.ts`, a `SIMULATION` badge, and one action that goes to the request
   form carrying the offer slug.
5. **Request and confirmation** — `/request-briefing` accepts `track` and `offer` search
   params, records them in the existing free-text context field, and the confirmation names
   the track's next step. No schema migration.
6. **`/app/activity`** — the person's own ledger lines and settled tasks, read through the
   existing wallet view. Own rows only; no aggregate, no other person.

## Documentation, same turn

- `docs/strategy/PHASE-1-FUNNEL.md` — the mapping above, the three walkthroughs, the
  contradictions found, and the one-spine finding.
- `docs/history/` narrative entry from inside the codebase.
- Register lines in `docs/work/OPEN-ITEMS.md`, mirrored to the founder backlog board with the
  same IDs, including the open questions this pass cannot answer.
- No ADR. A walkable simulation is not a ruling.

## The one-spine answer, stated up front

The three funnels do share one spine — arrival, anchor, file, wallet, ledger, App Home, Tasks
— and the codebase already proves it, because two personas run one engine today. The
architectural difference is at the far end, not the near end: the Builder and the Contractor
converge on a *position* that exists (request → grant → certification), while the Property
Owner converges on a *property record* that does not exist anywhere in the schema. That
asymmetry is recorded, not papered over, and the Property Owner track stops at the request.

## Technical notes

New files: `src/content/funnels.ts`, `src/routes/offer.$slug.tsx`,
`src/routes/_authenticated/app/activity.tsx`. Edited: `apphome.server.ts` (task derivation),
`FrontDoor.tsx` (track framing only), `request-briefing.tsx` (search params). No migration, no
new table, no new role, no permission change. Verified with a typecheck and by walking each of
the three tracks through the running app.
