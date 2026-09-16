# Stakeholder Views — one operating model, many readings

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-16
> The structural idea from the 2026-09-16 living narrative, held as `HYPOTHESIS` and
> examined against everything it touches. Nothing here is built, scheduled, or ruled.
> Reading order and the full corpus map: [`../00-START-HERE.md`](../00-START-HERE.md)

## 1. The proposition

`HYPOTHESIS` — There is one shared market and operating model. It can be rendered as
**one Stakeholder's view at a time**, or as **all Stakeholder views together**. No
Stakeholder needs the whole explanation; each needs its own reading of the same thing.

The Property Owner does not need the Licensed Contractor's economics. The Licensed
Contractor does not need the InsurTech founder's model. The investor does not need ISR
onboarding. The technology Stakeholder does not need the supplier pitch.

This also makes No Conflicting Interest legible for the first time. Every Stakeholder is
allowed a viewpoint and allowed self-interest (ADR-026). The architecture's job is not
to remove those interests but to make them visible enough that one interest cannot
silently become everyone's reality.

## 2. The finding: nine features, one mechanism

The narrative lists Position Books, Circle spaces, Perception Library variants, App Home
modes, Quantum Dashboard views, revenue assumptions, the product catalog, attribution,
compensation and geography as separate things this idea touches. Read against the
corpus, most of them are not separate at all.

**One Pattern, selected by `(Stakeholder Group × audience × moment × mood × class)`,
rendered into a surface.** That selection function is ADR-020 and the Perception
Library, already specified. Everything below is that same mechanism appearing somewhere
different.

| Surface | What it is, under one mechanism | Corpus line |
|---|---|---|
| **Position Book** | The Pattern *printed* — one Stakeholder Group, the same nine questions | **A62**, ADR-020 |
| **Circle space / course** | The Pattern *hosted* by an external provider; its activity returns as evidence | **A61**, bounded by **C51** |
| **Perception Library variant** | The Pattern *worded* — mood, intensity, audience, class | ADR-020, `variants/` in the Screen Book |
| **App Home mode** | The Pattern *navigated* — MarketApp, BooksForge, MusicApp, MovieApp, MyGPTTV as settings families | Packet §13 |
| **Quantum Dashboard view** | The Pattern *aggregated* — one lens, or every lens at once | Held by **B3** |

So the practical reading is: this is not a new subsystem. It is the first serious demand
on a mechanism specified on 2026-09-10 and never once used. Three independent ideas now
require it.

## 3. The three things it does *not* reach

These must not be blurred into the view model, because a view that restates them becomes
a promise.

**3.1 Attribution is a record, not a view.** Observed Event → Normalized Fact →
Attribution Claim → Settlement Decision is a record pipeline (**A60**). A Stakeholder
view may *read* attribution. It may never restate, re-derive or re-rank it. Two
Stakeholders looking at the same conversion must see the same facts, differently worded
at most.

**3.2 Compensation is an agreement, not a view.** ADR-026: the ledger records what
happened; the economic agreement decides what it pays. A per-Stakeholder economics view
renders the *agreement that applies to that Stakeholder*. It does not create one, and a
view showing a number that no executed agreement supports is a compensation promise made
by a layout.

**3.3 Geography is a scoping dimension, not a viewpoint.** Global, national, state,
county, market, territory, property (**A64**). A Stakeholder view may be scoped to a
territory. Being scoped to a territory must never quietly imply exclusivity —
sponsorship, operating rights, lead priority, license, designation, representation and
exclusivity remain separate grants.

Revenue assumptions and the product catalog (**A63**) sit between: the catalog is shared
and singular, but *which objects apply to which Stakeholder in which geography under
which entity* is exactly the Quantum Dashboard question, and it lands on the unresolved
entity dimension (**A48**) before it lands on any view.

## 4. Two conflicts, recorded rather than resolved

**C53 — the aggregate view is a redaction problem before it is a UI problem.** "All
Stakeholder views at once" means composing material of different confidentiality classes
onto one surface. Band 3 is unreachable at any intensity; C3 counsel-and-capital material
cannot appear beside C1 prospect material merely because both are Stakeholder readings of
the same market. An aggregate view is only servable at the *lowest* class present, which
may make it far less impressive than the idea sounds. That constraint must be designed
into it, not discovered in a demo.

**C54 — per-Stakeholder economics can imply a promise.** See §3.2. A rendered number
reads as an offer. Any economics view needs a visible statement of what agreement it
derives from, or it must not show numbers at all.

## 5. What would move this off zero

Under ADR-027 this hypothesis has earned nothing yet. Independent arrival by two
narratives is one evidence event, not validation. The cheapest test available:

Take one Pattern that already exists in the corpus — the RRCA proof of concept is the
obvious candidate — and write two sibling variants of it under the existing
`variants/` model: one for a Licensed Contractor, one for capital. Same claims, same
truth labels, different audience, different class. Publish neither. If the mechanism
survives one real Pattern rendered twice, it has earned its first move off zero. If the
two variants drift into saying different things, the mechanism is wrong and we learned
it for the price of two files.

Registered as **A70**.
