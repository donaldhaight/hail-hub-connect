# Kimosabe.AI — Brand Positioning

> **Status:** in progress · **Class:** C1 · **Last revised:** 2026-09-09
> The positioning of Kimosabe.AI and its sibling personas.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

---

## 1. The one-line position

`ASSERTION` — **Kimosabe is the trusted scout: it walks ahead, reads the ground, and
comes back with the path.**

A scout is not a map, a dashboard, or an oracle. A scout is a person you send ahead
because you do not know the terrain and they do. They come back and tell you what is
there. The relationship is trust, not subscription.

## 2. Past to future

`ASSERTION` — The transformation Kimosabe sells is not from *one industry* to *another*.
It is from a world of scattered accounts to a world with one file.

| The past it leaves | The future it walks toward |
|---|---|
| Identity resets at every login | One portable file that travels with the person |
| Every platform holds a fragment of you | One append-only ledger nobody can rewrite |
| Trust is claimed in marketing copy | Trust is earned, recorded, and visible |
| Software you operate | A scout that operates alongside you |
| Roles granted by whoever owns the software | Roles certified, never bought |

Insurance restoration is the **first proving ground**, not the definition. It was chosen
because it is the market the founder knows to the ground and the one where the absence
of a trustworthy record does the most damage.

## 3. What Kimosabe is not

`DECISION` — These are red lines in copy, product, and demo.

- **Not a chatbot.** It does not perform personality. It reports, remembers, and acts.
- **Not a dashboard.** There is no wall of widgets at the front door. One field, one
  question.
- **Not an insurance app.** Insurance restoration is a season, not the identity.
- **Not a community.** The channel is one person and the scout. There is no feed of
  strangers.
- **Not a score you can be sold.** Task Efficiency Rating is never sold, licensed, or
  publicly exposed (ADR-015).

## 4. One engine, many faces

`DECISION` (ADR-019) — Kimosabe is a **shapeshifter**, and that is a structural
property, not a metaphor.

Every persona runs the same front-door engine: the same ask-once ritual, the same
opaque anchor, the same holding wallet, the same append-only ledger, the same guidance
channel. What changes is the name at the top, the palette, and the vocabulary.

```text
                 one anchor · one wallet · one ledger
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Kimosabe.AI          Buddy Claim           (future personas)
   the universal        the insurance         a market, a season,
   scout                restoration face      a partner
```

The person who opens a file at one door is the *same person* at every other door. Two
faces never mean two files. This is the technical guarantee that makes the shapeshifting
honest rather than a marketing costume.

### Buddy Claim — the first sibling

`DECISION` — Buddy Claim is the market-facing spokesperson for **SelfInsurity** and the
**ClaimStore vision**, speaking to property owners, independent sales reps, and licensed
contractors in the language of their own market.

Its promise: *somebody on your side of the record.* What was promised, when, and by whom
— kept by someone who is not the carrier and not the contractor.

Buddy Claim proves the pattern. Every future persona is built the same way: a row in the
persona registry, not a new codebase.

## 5. The audience ladder

Each rung is a different relationship with the scout, and the copy changes accordingly.

1. **Visitor** — arrives at a front door with no email, no phone, no form. Asks one
   question. Owes nothing.
2. **Interested User** — a file is open. A holding wallet, a ledger, a channel. Still
   owes nothing.
3. **Member** — signed in; the anonymous file is claimed, not copied, into a MarketApp
   ledger-wallet.
4. **Certified role-holder** — ISR, LC, or Property Owner. Earned, not granted.
5. **Multi-role operator** — several roles on one identity and one history. The ladder's
   whole point: the person is never split.

## 6. Voice

`ASSERTION` — Kimosabe speaks the way a good scout speaks when they get back to camp.

- **Plain and specific.** "Your file is open" beats "Welcome to your journey."
- **Short sentences that carry weight.** No hedging, no exclamation points.
- **It says what it will not do.** Naming the limit is what makes the promise credible.
- **It remembers out loud.** "I remembered you" is the whole product in three words.
- **It never flatters.** The scout's value is accuracy, not encouragement.

Buddy Claim shares this voice but drops the frontier register for market plainness: roofs,
claims, jobs, what got promised.

## 7. Viral shape

`HYPOTHESIS` — The WeChat comparison the founder raised is about **occupying the space
between apps**, not about messaging volume.

The mechanism to test: the file is worth more the more doors it has been recognized at.
A person who opened a file through Buddy Claim after a hailstorm already has a wallet,
a ledger, and a scout when they later want a certified role, a property setup, or a
different market entirely. The onboarding is not repeated because the person is not
re-created.

What remains unproven, and must not be claimed: that this produces organic spread. It is
a structural precondition for it, not evidence of it.

## 8. Open questions

*Updated 2026-09-10 against the founder's adaptive-interface clarification.*

| ID | Question | State |
|---|---|---|
| K1 | Does Buddy Claim get its own domain, or live as a path under the main site? | **Answered in principle** — the founder named **buddyclaim.com** alongside kimosabe.ai. No DNS or hosting change has been made; `/buddy-claim` remains the working door |
| K2 | Do personas share one guidance feed, or does each carry its own voice track? | Open |
| K3 | At what point does a person see that Kimosabe and Buddy Claim are one scout? Is the reveal a feature or a footnote? | **Now urgent.** Personas are a standing mechanism, not a one-off sibling; future domains, apps, roles, missions and moods may activate more. A reveal rule chosen late is a reveal rule chosen by accident |
| K4 | How many personas before the registry needs founder governance rather than a code edit? | **Triggered.** Registered as A29–A34's companion item A34 |

### 8.1 The pressure the clarification puts on §3

The red lines in §3 were written for one scout with one register. The Perception Library
(ADR-020) holds provocative, humorous and dramatic siblings of the same idea. Two of those
sit against *"does not perform personality."* That collision is registered as **C37** and
is a founder decision, not a copy edit. Until it is settled, the Perception Library is
bounded to tone, length and framing — the red lines stand as written.

Buddy Claim remains the first sibling and the proof of the pattern; it is no longer the
whole of it. A persona is now the standing mechanism by which one file wears a face
appropriate to a domain, role, mission or moment (ADR-019, ADR-021).

## 9. Related

- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-015 (Property anchor, open front door),
  ADR-016 (memory partitions), ADR-019 (one engine, many personas).
- [`strategy/STRATEGY.md`](STRATEGY.md) — mission, timeline, the two congresses.
- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) — the register of record.
