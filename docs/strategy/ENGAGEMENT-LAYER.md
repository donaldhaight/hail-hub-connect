# The Engagement Layer — the part with no ancestor

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-12
> Holds the material from the 2026-09-12 afternoon addendum. Nothing here binds.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This note keeps an afternoon of thinking without promoting it into architecture by
repetition. Every claim carries a truth label. The locked work order is untouched by
anything written here.

---

## 1. The recoverability asymmetry

`ASSERTION` — The construction machinery and the engagement architecture are not equally
unknown, and the corpus has never said so.

The Licensed Contractor, ISR, Property Owner and SiteBMS problems are not blank sheets.
Screens, workflows, agreements, legal documents, process logic, operating experience and
prior software from the 2012–2019 ClaimExpress and Siteforum era exist. That work is
translation into a modern architecture — demanding, but not mysterious. It can be
reconstructed, compared against its ancestors, and modernized once the Records layer gives
it a foundation.

The engagement layer has no ancestor. The cultural layer, the reason somebody returns
tomorrow, the relationship between a person and the guide, the feed, the player, the
transition from curiosity to participation, and the single explanation that makes every
business, book, application, role and mission feel like one thing — none of that exists
anywhere to be copied.

`ASSERTION` — Therefore founder hours are worth more on the layer with no precedent, and
agent hours are worth more on the layer with ancestors. This is a statement about
attention, not about sequence. See ADR-024.

## 2. What this does *not* change

`DECISION` (ADR-024) — The locked work order stands unchanged:

```text
Draft Connecticut Agreement → Records / Object Model → SiteBMS
  → JobNimbus mapping → API / MCP
```

Nothing in this note unblocks that sequence and nothing in it is blocked by it. The
engagement layer sits largely in Expression (ADR-020) and may be *described* in parallel.
It may not be *built* ahead of the Records layer, because a feed and a player both need
permitted records and a completion event under ADR-021.

## 3. The universal grammar

`HYPOTHESIS` — Six words may hold many businesses without asking a person to learn the
corporate architecture first:

```text
Home · Ask · Feed · Player · Tasks · Settings
```

The legal entities stay separate. The DBAs stay distinct. The accounting systems and
ledgers preserve their boundaries. SAS A, SAS B and SiteBMS keep administering different
layers (ADR-014). ClaimStore remains a commercial proof; BooksForge, MusicApp, MovieApp
and MyGPT.TV remain different media modes. The complexity exists underneath and the
experience does not advertise it.

`ASSERTION` — If this holds, it also answers a marketing problem the corpus already
carries: different front doors may make different promises while delivering people into
one legible interior. That is ADR-019 stated in the user's vocabulary rather than the
architecture's.

`OPEN` — Two of the six are not in the Screen Book. `04_App_Home` lists Home_Page,
Guide_Channel, Search, New, Tasks, Account, Role_Switcher and Role_Store. **Feed** and
**Player** appear nowhere in the twelve-branch tree at any status. Either the branch is
incomplete or the grammar is wrong; the branch has been corrected to hold both as
honestly empty. Registered as **A44**, **A45**, **A46**.

## 4. The Kimosabe turn

`ASSERTION` — During the session Kimosabe changed position. It began at the gate and
became the intelligence inside App Home. The first-pass shape:

```text
Front Door → Interested User → the guide learns enough to be useful → App Home
  → tasks and suggested actions → personalized feed → content preferences
  → reader / player → continued learning → more relevant opportunities
  → roles, certifications, designations, work, economic participation
```

`ASSERTION` — This is an engagement loop before any gamification: ask, discover, consume,
react, learn, recommend, act, return. It is consistent with
[`KIMOSABE-POSITIONING.md`](KIMOSABE-POSITIONING.md) §4 — the guide is intelligence
available through every surface, not a website.

`OPEN` — It is also the point where the addendum touches the machinery rather than the
layer above it. A feed that recommends and a player that records what was consumed are
reads and writes against a memory partition. Under ADR-016 no partition is crossed by
inference; only the person's own act moves anything across a boundary. "Increasingly
relevant opportunities" is precisely inference unless the rule is written first. This is
**C38** arriving with a concrete surface attached.

## 5. First-pass gamification — the deliberate pattern break

`HYPOTHESIS` — The most useful thing to attack next may be the least-developed part of the
vision, specifically because the operating work already has a path and this does not.

What is in scope is a *first pass*: what makes exploring one more card interesting, what
makes opening the next chapter feel consequential, what makes a task feel like progress
rather than paperwork, what makes discovering a role feel earned, what makes the guide
feel like a guide rather than support, and what makes November 1 feel like somewhere the
story is heading rather than a webinar date.

`DECISION` — What is explicitly out of scope, recorded now so it cannot drift in later:

- Not the final game, and not the elaborate LARP.
- Not Metatron's Cube permanently mapped to roles.
- Not scoring economics that alter the ledger.
- Not badge inflation or artificial rewards.
- Nothing that exposes band 3 — storm targeting, kill zones, fringe tagging, carrier
  routes, ghost profiles, offer generation, outreach sequencing — at any mood, intensity
  or mechanic.

`OPEN` — One conflict is live and must be resolved before any mechanic is drafted. The
certification rule holds that nobody can grant a certification and nobody can buy past
one; that rule is the reason the badge means anything. A progression mechanic that makes a
role *feel* nearer without the quiz being passed is a claim the badge cannot back.
Registered as **C43**. Scope and refusal list registered as **A47**.

## 6. What converges

`ASSERTION` — Two descriptions are being written in parallel: the operating machinery,
protected and sequenced here; and the world, discovered outside and returned as Source.
They are not competing plans. The correct handoff is not "here are twenty ideas, build
them" but "here is how the world is fitting together — reconcile it, change nothing yet."
This note is the second description, filed.
