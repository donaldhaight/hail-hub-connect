# Sprint 2.7 — File the Work, Ship It, Then Write the Story

Four moves, in order: file the outstanding work into the master backlog, verify the app end to end, ship (publish + GitHub), then bring the manuscript current through the Economics Engine.

## 1. File the to-dos in the master list

Add items to `backlog_items` (visible on `/admin`) so nothing lives only in chat:

**Operations**
- Rename GitHub repo to `prepareamerica` and repoint Lovable Git sync.
- Point prepareamerica.com (root + www) and update canonical/OG URLs.
- Verify email sender domain and activate the six templates in `src/lib/email.ts`.
- Standing per-sprint ship check: build, browser pass, publish, push.

**Economics**
- Founder to supply defensible bands: impact rate, contact rate, conversion, close rate, job average by peril, attach rates (SelfInsurity / BuddyClaim / ClaimStore), cost per lead by method, Neighborhood Captain multiplier.
- Wire the locked turnkey bid to a Task Ledger row with the ±10% band.
- Decide whether default Room sliders sit just under the addressable cap.

**Season 1 Platform**
- Expand canvass coverage beyond Texas; two-layer storm/political overlay.
- Register cultural races, canon, and seasons as mission tracks.

**Manual**
- Write Act 1 remaining chapters; open Act 2 (the stack build).

## 2. Verify the app

- Production build and typecheck.
- Signed-out crawl of every public route: `/`, `/why-prepare-america`, `/briefing`, `/architecture`, `/prepare-america`, `/first-congress`, `/request-briefing`, `/founder`, `/vision`, `/policy`, `/investors`, `/industry-problem`, `/proof-of-concept`, `/why-rrca`, `/b/*`, `/sitemap.xml` — confirm redaction holds.
- Signed-in walk as founder: `/admin` console and every surface card, `/room` (Signals, Economics, Canvass, Demo Mode), `/admin/economics` CRUD, `/admin/ledger`, `/insider`, `/manual`.
- Capture console errors and failed requests; fix blockers in the same pass, file cosmetic issues to the backlog.
- Run a security scan and resolve anything critical.

## 3. Publish and push

- Publish to the live URL, then smoke-test the published site on the same routes.
- Confirm GitHub sync is current after the rename; verify `src/`, `docs/`, `supabase/` and migrations are present.
- Record the sprint in `docs/SPRINTS.md`.

## 4. Catch up the novel / script

Bring the manuscript current with what has actually been built since Act 1 Chapter 3. New chapters to `/manual`:

- **Ch. 4 — The Treasure Chest.** The 157k-word bundle arrives; twenty-five years of pivots read back in one sitting. Establishes that the architecture was always the same architecture.
- **Ch. 5 — The Turn.** Kimosabe is a function, not a person. Before AI the founder was the center; the integration role becomes transferable. This is the hinge of Act 1.
- **Ch. 6 — What Happens in the Room.** The One Prompt Event as scene: 300 people, the founder the one person not touching a keyboard, delegates driving the console.
- **Ch. 7 — Two Tracks.** Weather and Canvass. The ladder that only multiplies published assumptions, and the coverage map that states no conclusion. The sleight of hand named plainly, in the manual, where it stops being sleight of hand.
- **Act 2 opening — If You Can Bill It, You Can Build It.** The 10% variance rule as the story's actual antagonist: the mission survives only if the estimates hold.

Written in the established voice — narrative, first-person plural where it earns it, truth labels intact. Screenplay beats included as scene headers for the Room chapters.

## 5. Then: where to focus next

After shipping I will bring a recommendation with the tradeoffs written out. My current read, to argue about rather than accept:

- The economics bands are the highest-leverage missing input — the Room's credibility in a focus group rests on numbers you can defend from experience, and only you have them.
- Second: the political overlay beyond Texas, because the two footprints snapping together is the moment that makes a room go quiet.
- Third: the pricing-to-ledger wire, which turns the demo into a signable bid.

## Technical notes

- Backlog items are literal INSERTs against `backlog_items` via the existing founder-only server functions; no schema change.
- Manuscript chapters are rows in `manual_chapters` (slug, part, position, truth, body) — content work, no schema change.
- Verification uses Playwright against localhost with the founder session; screenshots retained for the ship record.

## Out of scope

- Registrar/DNS actions and the GitHub rename click itself — those need your hands; I verify and update docs after.
- New public pages or brand doors.
