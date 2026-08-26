# The Economics Engine — Two Tracks, One Pricing Adventure

Received. The picture holds: Track 1 is the weather funnel you have twenty years of receipts for, Track 2 is the political data lock you show but never claim, and the cultural races are the misdirection that keeps the room from staring at Track 2 too long. The pricing adventure is not a valuation — it is a purchase order: how many leads do we want to buy, and what does it cost to build every surface required to originate, distribute, and close them.

Two pieces of work. The first is housekeeping you asked me to stop losing. The second is the model.

## Part 1 — Put the standing ops items in the app

Right now the GitHub rename and the domain pointing live only in chat. They become backlog rows in the Founder Console so they survive travel and context loss.

New backlog items, category `Operations`:

1. Rename GitHub repo `hail-hub-connect` → `prepareamerica`, update the Git sync URL in Settings, re-verify the sync includes `src/`, `docs/`, `supabase/`, migrations.
2. Point `prepareamerica.com` at the published site: add the custom domain, set the DNS records at the registrar, verify SSL, confirm the canonical URL and sitemap update.
3. Standing check: after each sprint, confirm the published build is current and the repo mirror is fresh.

Each carries the owner (founder action vs. agent action) in the summary, so a traveling founder can see at a glance which ones only he can click.

## Part 2 — The Weather Track economics (`/room` → Economics lens)

The Situation Room already renders signals with provenance. What it does not yet do is turn a storm into money. That is the funnel, and every stage is a registered variable with a defensible range drawn from your twenty years:

```text
storm footprint      properties in swath
   ↓  impact rate     → estimated claims
   ↓  targeting       → addressable properties
   ↓  campaign        ad spend + door-to-door hours
   ↓  contact rate    → surveys completed (silent — the survey is the campaign)
   ↓  conversion      → originated leads
   ↓  distribution    → leads sold / assigned
   ↓  close rate      → contracted jobs
   ↓  job average     → gross revenue
   ↓  attach rate     → SelfInsurity / BuddyClaim / ClaimStore synergy revenue
```

Design rules for the model:

- Every rate is a **variable with a low / base / high band**, and the demo runs on the low band. We underestimate on stage, on purpose. The screen says so.
- Two cost drivers only, because those are the ones you actually buy: **ad spend** and **door-to-door headcount**. Everything downstream is a rate applied to them.
- **Neighborhood Captains** enter as the declared wildcard — a separate multiplier row with its own band, labeled HYPOTHESIS, shown as upside and never counted in the base case.
- The surveys line is the quiet one: people are surveyed by being campaigned to. Shown as a count, described in one sentence, not dwelt upon.
- Synergy revenue (SelfInsurity, BuddyClaim, ClaimStore) projects off the same lead count via attach rates, so the room can see one lead monetize more than once without a second data set.

Surface: an **Economics lens** in the Room with a scenario selector, the funnel rendered stage by stage with live counts, and sliders for ad spend and door count. Change a driver, the whole ladder recomputes. Every number clicks through to its variable card — definition, source, band, truth label.

## Part 3 — The Political Track (`/room` → Canvass lens)

Same console, different corpus. Public political data only, going back as far as it stays defensible: turnout, registration, precinct results, demographics, participation over cycles, at county and precinct grain.

Presentation rule, and it is the whole trick: **we describe the method and never state the conclusion.** The screen shows the coverage — how many jurisdictions, how many cycles, how many records, matched to the same county grain as the storm data. The room does the arithmetic itself. Nothing on that screen claims influence, prediction, or intent. It is labeled FACT (the records) and nothing else.

The overlay is what lands: the same county carries a hail swath and a turnout history. One map, two layers. No sentence needed.

## Part 4 — The cultural tracks

Registered as additional tracks in the same track model so they exist as objects, not decoration — the races, the canon, the seasons. Their job in the room is load-bearing misdirection: heat and motion on the screen while the political overlay sits quietly. They get real rows and real counters so they hold up to a delegate who pokes at them.

## Part 5 — The pricing adventure

This is the Completed Project Offer for the whole network, expressed the only way that matters: **how many leads do we want to buy?**

- Lead volume target as the single input.
- Cost per lead by origination method (ad spend, door-to-door, captain referral), each with its own band.
- Build-out costs itemized: every website, every stakeholder surface, hosting, agent hours, human hours, materials, labor, equipment.
- Output: total program cost, cost per lead all-in, and the 10% variance envelope we commit to.
- Actuals close against it in the existing task ledger, so the bid and the record live in the same instrument.

That is the number the focus groups will white-board around, and it is the one we can defend line by line.

## Order of work

1. Ops backlog items (GitHub, domain) — small, immediate.
2. Track model + funnel variables and bands, seeded from your historical ranges.
3. Economics lens in the Room with the two driver sliders.
4. Canvass lens with the public political corpus and the county overlay.
5. Cultural tracks registered.
6. Pricing adventure calculator wired to the task ledger.

## What I need from you, when you have a spare hour on the road

The bands. For each: a low, a base, and a high you would defend in that room.

- Impact rate — properties in a swath that become claims.
- Contact rate — doors knocked or impressions served per completed survey.
- Conversion — surveys to originated leads.
- Close rate — leads to contracted jobs.
- Job average — by peril, if it differs.
- Attach rates — leads that pull a SelfInsurity, BuddyClaim, or ClaimStore product.
- Cost per lead by method.
- Neighborhood Captain multiplier — your honest upside guess.

Rough is fine. I will hold them as ASSERTION with your name on them until a case study promotes them to FACT.

## Not in scope

No public site changes, no corpus ingestion, no manual chapters. Those keep their own lanes.
