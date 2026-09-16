# Reading "The Turn from Vision to Underwriting" — documentation only

Source, not instruction. Nothing in the codebase, schema, routes, UI, Screen Book,
public copy or the locked work order changes. Prior interpretations are preserved;
nothing already written is edited to match this reading.

## What lands where

**1. A new history document — `docs/history/THE-TURN-TO-UNDERWRITING-2026-09-16.md`**

The Lovable-side living narrative, written as a companion to the ChatGPT one rather
than a summary of it. It answers the six questions asked, in prose:

- *How we arrived here* — from "what should we build" through the corpus reorganization,
  the Screen Book, the two-exposure simulation and the September 15 packet, to a morning
  that asks the project to be underwritten rather than explained.
- *Already in the corpus* — the fossil-record instinct (PROTOCOL truth labels), provider
  abstraction (A61/C51), Kimosabe as continuing relationship (ADR-016, ADR-019), one
  person / one file (SHARED-SPINE), App modes (A62), the revenue-object catalog (A63),
  origin-is-not-compensation (ADR-026), Position Books (A64), the 1% and USA-sells
  simulations, the corpus-as-ingredients reading.
- *Genuinely new* — three things: **assumptions start at zero** as an operating posture;
  the **Observed Event → Normalized Fact → Attribution Claim → Settlement Decision**
  chain as a named pipeline; and the **Stakeholder view as a first-class product of one
  Pattern**, with the Quantum Dashboard able to show one view or all views at once.
- *Resurfaced, therefore heavier* — the Perception Library variant model (specified
  2026-09-10, still never used, now demanded by three separate ideas at once), the
  entity dimension (A48), and the unruled umbrella (C40/C45).
- *Assumptions still carrying architecture or business logic* — named and listed, each
  labelled as carrying either architecture, money, or exposure, with what evidence
  would move it. Includes: Siteforum bridges the gap (A54); the engagement layer can
  carry a launch (A56); the ledger will not need an entity column before the first
  dollar (A48); Circle-style providers can stay external mappings (C51); one
  onboarding fits every stakeholder; November 1 succeeds as announcement (A53).

**2. Where we are in the story — recorded, and disagreed with once**

The narrative says: resolution of Act I, irreversible threshold into Act II. From the
codebase's vantage that is *nearly* right and I will say why it is not yet complete. A
threshold is crossed by an act, not a realization. Nothing irreversible has happened:
no entity has transacted, no agreement is executed, the append-only ledger holds no
real money, and the one decision that cannot be taken back later — the entity dimension
— is still un-made. The honest reading from inside the code: **Act I has resolved; we
are standing on the threshold, not across it.** The first crossing act is whichever
comes first of an executed Connecticut Agreement, a real dollar on the ledger, or a
public November 1 commitment. That distinction is worth preserving because it names
what the crossing *costs*.

**3. A new strategy note — `docs/strategy/STAKEHOLDER-VIEWS.md`**

The one genuinely structural idea in the narrative, held as `HYPOTHESIS`, examined
against nine things it touches without building any of them: Position Books, Circle
spaces and courses, Perception Library variants, App Home modes, Quantum Dashboard
views, revenue assumptions, the product catalog, attribution, compensation, geography.

The finding to write down: **these are not nine features, they are one mechanism seen
from nine places.** One Pattern, selected by (Stakeholder Group × audience × moment ×
class), rendered into a surface. Position Books are that mechanism printed; Circle
spaces are it hosted; variants are it worded; App Home modes are it navigated; the
Quantum Dashboard is it aggregated. Two things it does *not* reach, and must not be
allowed to blur: attribution and compensation are records, not views — a view may read
them, never restate them (ADR-026); and geography is a scoping dimension, not a
viewpoint, so territory must not quietly become exclusivity (A65).

Two conflicts recorded rather than resolved: an "all Stakeholder views at once" surface
is a redaction problem before it is a UI problem (Band 3 and C3 material cannot appear
in an aggregate), and per-Stakeholder economics rendered as a view can imply a
compensation promise the agreement has not made.

**4. A new ADR — ADR-027, "Assumptions start at zero"**

The only thing in this narrative that is a decision rather than a reading, and the
founder stated it as an operating principle. It puts the posture in force and
deliberately defines no numeric score:

- Every proposition enters the corpus at zero earned confidence.
- Belief by the founder, or agreement between ChatGPT, Claude, Manus and this project,
  is an *evidence event* — it moves an assumption off zero; it never starts it above it.
- Independent convergence, working software, executed agreements, operating results and
  observed reality raise confidence. Contradictory evidence lowers it.
- No scoring method, weighting or Coefficient-of-Truth arithmetic is invented yet; that
  is registered as open, not drafted.
- Truth labels are unchanged. This governs *confidence*; the labels govern *kind*.

Alternatives considered will be recorded: adopting a 0–100 score now (rejected —
precision the evidence cannot support), and leaving the posture informal (rejected —
the project's whole failure mode is a compelling story outrunning proof).

**5. A Manual chapter**

One new chapter in Part VI (The Saga), following the existing pattern of
`saga-the-keeper-of-the-order`: the turn from vision to underwriting, told from this
project's side — `ASSERTION`, class C2, seeded through a migration to `manual_chapters`
the same way prior chapters were. It preserves both readings of where we stand in the
story rather than choosing one.

**6. Register and board, together**

New lines **A67–A73** and **C53–C56** in `docs/work/OPEN-ITEMS.md`, mirrored to the
founder backlog board with the same IDs (Sprint 2.19, category `register`, status
`idea`). They cover: the assumption inventory itself as a standing artifact; the
attribution pipeline naming; the Stakeholder-view mechanism; the first unused-variant
proof; the aggregate-view redaction problem; and the scoring method left undefined.

`docs/00-START-HERE.md` manifest and `docs/work/SPRINTS.md` get the new entries.

## What this does not do

No ruling on Model A versus Model B, the umbrella question, USA as contractor, the 1%,
network ownership of RRCA, or NRA's parent. No new route, component, table for app data,
UI, public copy or domain. The locked work order stands: Draft Connecticut Agreement →
Records / Object Model → SiteBMS → JobNimbus mapping → API / MCP.

## Technical notes

Documentation files are plain Markdown. The single database write is a migration
inserting one row into the existing `manual_chapters` table (Part VI, next position),
matching the seed pattern used for chapter 80. No schema change, no new table, no RLS
change. Backlog mirroring inserts rows into the existing `backlog_items` table.
