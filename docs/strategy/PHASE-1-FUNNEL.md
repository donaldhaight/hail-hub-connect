# Phase 1 Funnel — one spine, three audiences

> **Status:** simulation · **Class:** C0 (screens) / C2 (this document) ·
> **Truth:** `SIMULATION` · **Last revised:** 2026-09-16
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This document records what a narrated Phase 1 funnel asked for, what the running system
already did, what was built, and what was refused. Nothing here is approved public copy
and no offer described here is a commercial commitment. Every offer screen carries the
`SIMULATION` label where a reader can see it.

---

## 1. The nine narrated steps against the running system

| Step | State before | What it took |
|---|---|---|
| Public landing page | Exists — one `FrontDoor` engine, two personas (Kimosabe, Buddy Claim) | Nothing structural; a track query parameter for framing |
| Interested User / onboarding | Exists — anchor, holding wallet, append-only ledger, claim on sign-in | Nothing |
| App Home | Exists — server-derived Tasks | A track argument through `getAppHome` |
| Getting started | Partly — Tasks existed, no track shaping | Configuration: track-derived starter Tasks |
| Content / reader | Exists — `/manual/$slug` chapters | Content: each track points at an existing chapter |
| Offer / opportunity | **Missing** | One new screen, `/offer/$slug` |
| Request / conversion | Exists — `AccessRequestForm` → founder queue | Accepts `track` and `offer`, prefills the existing context field |
| Confirmation / next step | Exists | Names the track's next step |
| Activity / record | **Missing as a view** (records existed) | One new read-only screen, `/app/activity` |

Six of nine already existed. One is configuration. Two were built.

## 2. What was built

- `src/content/funnels.ts` — the three tracks as data: framing line, chapter, offer,
  starter Tasks, confirmation line.
- `/kimosabe?track=…` — the track is remembered in the person's own browser under
  `prepareamerica.track` and changes framing only.
- Track-derived starter Tasks in `buildAppHome`, ids prefixed `track:`, self-settleable
  like every other reading task.
- `/offer/$slug` — C0, `SIMULATION`-badged, one ask, one link onward.
- `/app/activity` — the person's own wallet balance and their own ledger lines. No
  aggregate, no other person, no platform total.

## 3. Three walkthroughs

**3.1 Experienced Builder.** Arrives at `/kimosabe?track=builder`, asks anything, receives
an anchor, a wallet and a ledger. App Home shows two track Tasks: read *Leads Were Never
the Product*, then see what is asked of builders. The offer asks for reading and
disagreement, not for their company. The request lands in the founder queue with the track
named in the context field. Nobody self-certifies; the founder assigns the Stakeholder
Group at acceptance.

**3.2 Property Owner.** Same arrival, different framing and chapter. The offer describes a
property file — and the track stops at a request, because no property record exists
anywhere in this schema and the funnel will not pretend otherwise (A73). The confirmation
says so in plain words.

**3.3 Licensed Contractor / ISR.** Same arrival. The offer points at the Role Store, where
ISR is the one certifiable position: a fee paid in JBK from the wallet the person already
holds, four modules, four quizzes. LC is catalogued and not open. The offer says both.

## 4. Does one spine really carry all three?

**Yes at the near end, no at the far end.** Arrival, anchor, file, wallet, ledger, App Home
and Tasks are genuinely shared — the three tracks differ only in words and in which
existing screen they point at.

The divergence is at conversion. Builder and Contractor converge on positions that exist
(request → founder grant → certification). Property Owner converges on a *property record*,
which is a Records-layer object sitting behind the locked work order. That is an
architectural difference, not a content gap, and no amount of configuration closes it.

## 5. Where the simulation contradicted the corpus, and what was refused

- **Track as provenance.** Writing the arrival track onto the person's record would create
  a lead-provenance field, which is first-class under ADR-015. It stays in the browser
  (A74).
- **Attribution by form field.** The request carries track and offer as free text in the
  existing `context` field. No column was added; structured attribution is a Records
  decision (A75), and origin is not compensation (ADR-026).
- **A Property Owner position.** Not created. ADR-015 makes it a real position; nothing
  makes it a built one.
- **Offers as copy.** Every offer is `SIMULATION`, C0, and unlinked from public navigation
  (A76).
- **Memory partitions.** The track is a browser value read by the person's own session. No
  inference crosses a partition (ADR-016).

## 6. What this does not settle

The funnel is walkable, not proven. It tests whether the platform can become an acquisition
surface through content, configuration and routing — and on the evidence of this build,
largely it can, with one exception the Records gate owns. Under ADR-027 that proposition
starts at zero and moves only when a real person walks it.

## 7. Related

- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) §O — A73–A76.
- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-015, ADR-016, ADR-026, ADR-027.
- [`screens/00-SCREEN-BOOK.md`](../screens/00-SCREEN-BOOK.md) — the container facets each
  new screen owes.
