# Act 2 — The Situation Room and the Efficiency Proof

Received and filed: the storybrand pass did its job, the Kimosabe center holds, and the unspoken story stays unspoken until intake surfaces it. What follows is the build consequence of what you just described.

## The thing being built

On 11-1-2026 people drive the car. That means the demo surface is not a slide and not a video — it is a live console with real variables moving, and the founder is not touching the keyboard.

The reference frame you gave is exact and worth holding as the design brief:

```text
Weather Channel, 48 hours out       Election Night, 50 states / 3,350 counties
------------------------------      ----------------------------------------
one system, tightening cone         many jurisdictions, continuous counts
probability, not certainty          calls, holds, and stated confidence
lead time is the product            analysis and assumption is the product
```

Our console is both at once: a forecast surface (what is coming, where, how big) and a canvass surface (what is counted, by whom, with what confidence) — sliced by the seven stakeholder groups, each of which sees the same event through its own function.

## Phase A — The Situation Room shell

A new authenticated surface, `/room`, separate from `/admin`. Admin is where the founder runs the mission; the Room is what a delegate drives.

- **View switcher** — the same event rendered through each of the seven functions: Foundation, Technology, Legal, Insurance, Banking, Construction, Center. A view is a lens, not a separate page: same underlying rows, different columns, filters, and headline metric.
- **Canvas layouts** — map, table, and board, switchable without losing filter state.
- **Advanced query bar** — full-text plus structured filters (geography, peril, date window, stakeholder, status, confidence). Every query is URL-addressable, so a demo can be handed to someone mid-flight.
- **Saved views** — a named query with its layout and filters, shareable to another seat. This is what makes it drivable by a stranger in the room.
- **Continuous counters** — a persistent strip of totals that recompute as filters change: counties touched, claims in flight, capacity committed, dollars staged, variance to estimate.

## Phase B — The variable model

The value story you described — brands compounding with each new variable — needs the variable to be a first-class object, not a column somebody added.

- A `variables` registry: name, definition, unit, source, refresh cadence, owner stakeholder group, truth label, confidentiality class.
- A `signals` fact table: variable, geography (state / county / zip), timestamp, value, confidence, provenance.
- Every number on every Room surface renders from a signal row and can be clicked through to its provenance card. Nothing on screen is unattributed. That single rule is what separates this from a dashboard mockup.
- New brands and models attach by registering variables, so growth in the story is visible as growth in the registry.

## Phase C — Task Efficiency Rating

The claim is large, so the instrument has to be conservative and auditable.

- **Task ledger** — every unit of work, human or agent, recorded with: task class, estimated hours, actual hours, estimated cost, actual cost, rework count, and outcome accepted or rejected.
- **HTER** and **ATER** computed identically from that one ledger — no separate accounting for agents. Ratio of accepted output to fully loaded cost and elapsed time, per task class.
- **Variance panel** — the 10% rule made visible: estimate vs. actual per sprint, with the running record of whether we get to keep running.
- **Deflation view** — cost per accepted task over time, by class. Truth-labeled: the ledger is FACT, the ratio is ASSERTION, "inflation goes away" is HYPOTHESIS and never appears in public copy.
- This project is the first subject. Our own backlog items feed the ledger, which is why the 11-1 demo can be about us and still be real.

## Phase D — Demo mode

Because the room drives it live and the room cannot break it.

- A seeded scenario — a named storm with a real footprint — replayable on a clock, so the console can be driven forward through an event in minutes.
- A hard boundary between scenario data and production data, labeled on screen at all times.
- A one-prompt entry point: a single natural-language box that resolves to a saved view. That is the moment the founder isn't touching the keyboard.

## Order of work

1. Room shell, view switcher, query bar, saved views — empty but drivable.
2. Variable registry and signal table with provenance click-through.
3. Task ledger and the two efficiency ratings, fed by the existing backlog.
4. Scenario replay and the one-prompt entry point.

Each phase gets priced as a Completed Project Offer before it starts — human hours, agent hours, materials, labor, turnkey bid, equipment, other — and closed against actuals in the ledger it is building.

## Open, for your call before Phase A ships

1. Does a delegate in the room drive their own seat, or does the Room render on a single screen with one driver at a time?
2. Which peril and which storm is the seeded scenario — I want a real one with a name and a date, not synthetic geography.
3. Do the seven views ship all at once, or does the Room reveal them in the same order as the brands — Foundation first, Center last?

## Not in scope here

No public surface changes, no corpus ingestion, no manual chapters. Those continue on their own tracks.
