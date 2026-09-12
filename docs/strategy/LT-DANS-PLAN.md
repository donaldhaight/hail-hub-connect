# Lt. Dan's Plan — the umbrella question

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-12
> Holds the material from the 2026-09-12 lunch-break checkpoint. Nothing here binds.
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This note exists so that a strong morning of thinking is kept without being promoted into
architecture by repetition. Every claim below carries a truth label. The umbrella question
itself is recorded as **proposed and not in force** (ADR-023).

---

## 1. What the checkpoint proposed

`ASSERTION` — An outside session on 2026-09-12 read the whole body of work — ClaimStore,
RRCA, Prepare America, Kimosabe, the Agenda years, the books, songs and films — and
proposed that **Lt. Dan's Plan** is not another product inside the architecture but the
name of the entire body of work.

The consequences it drew:

- Prepare America stops being the permanent umbrella and becomes a mission, a book, a
  challenge, an event, or an era inside the Plan.
- Agenda 2024 / 2028 / 2032 / 2036 become volumes and time markers rather than corporate
  architecture.
- Roofing Wars, Planet Kimosabe, Esoteric Investors, Creators Anonymous and the Prequel
  stop competing for position in a hierarchy and become stories in one world.

`OPEN` — None of this is decided. It re-parents the institutional face of United
Stakeholders of America LLC and therefore waits on the founder. See ADR-023.

## 2. What the corpus already held

`FACT` — The three-layer shape the session arrived at from the outside already exists
inside the corpus, arrived at from a different direction:

| The session's words | The corpus |
|---|---|
| The Library is not the work; old plans become Source | ADR-020 — Source preserved, Pattern binding, Expression free |
| Book, game, business and thesis as four tellings | The Perception Library — sibling variants, none overwriting another (A30) |
| Many boats, one country | ADR-019 — one front-door engine, many personas, one anchor and ledger |
| Kimosabe is the intelligence, not a website | `strategy/KIMOSABE-POSITIONING.md` §4 |
| Identity belongs to the person, not the door | `law/SHARED-SPINE.md` §1–2 |

`ASSERTION` — That convergence is the useful finding of the session. Two independent
readings reached the same separation of story, interface and operating system. That is
evidence the separation is structural rather than a documentation habit.

## 3. Boats and the country

`ASSERTION` — The founder's metaphor: **domains are boats; they bring people into the
country; there does not need to be one Ellis Island.**

LtDansPlan.com, Kimosabe.ai, BuddyClaim.com, MarketApp, BooksForge, MusicApp, MovieApp,
MyGPT.TV, the Agenda years, ClaimStore — and doors not yet invented — may originate
different journeys. Beneath them is a common arrival architecture: identity, permissions,
roles, ledger, tasks and records belong to the person, not to the door.

`FACT` — This is already true in the running application. `/kimosabe` and `/buddy-claim`
are two faces of one engine sharing one device anchor, one holding wallet and one
append-only ledger. The metaphor names what the code does.

`ASSERTION` — The metaphor also disarms the fear that many domains equal brand sprawl.
Sprawl is only dangerous where each door owns its own identity. Here none of them do.

## 4. The board-room problem

`ASSERTION` — The diagnosis worth keeping: an insurance-restoration executive can find
ClaimStore compelling and still refuse to carry it to a board, because Congress, Agenda
2028 and the political framing make participation feel like endorsement of something
larger than the business problem he came to examine.

`ASSERTION` — The corpus already contains the mechanism for this and has not used it. A30
specifies sibling variants labelled by audience, with none overwriting another. An
institutional, apolitical telling of the same argument is a **variant**, not a new
property. Registered as A42.

`HYPOTHESIS` — LtDansPlan.com as a calmer, personal, Kiplinger-style serious door —
periodic analysis from a recognizable point of view, part founder's publishing platform,
part online book. Registered as A43. It is a genuine option, but it is a more expensive
answer than the variant, and the variant should be tried first.

`proposed DECISION` — Leave Prepare America's personality alone. Do not soften its depth
or apologize for it. Change only how and when a person reaches it.

## 5. The game gateway

`OPEN` — A paired gateway with almost no explanation: a striking image, a question, a
phrase, a key. *Help Me Kimosabe.* Perhaps Iak Sakkak, a maze, sacred geometry, or nothing
but an input field. The person interacts before being told what the system means.

`DECISION` (ADR-021) — Whatever it becomes, it is an authorized container like every other
surface: it must name a purpose, permitted roles, permitted records, permitted actions,
available tools, required context and a **completion event**. A door with no completion
event cannot be specified. Registered as C41.

`ASSERTION` — Band 3 never appears in a game surface. Storm targeting, kill zones, carrier
routes, ghost profiles, offer generation and outreach sequencing stay out of the
mythology as firmly as they stay out of the demo.

## 6. The front end, and why it looks anticlimactic

`FACT` — The common journey the session arrived at is largely built:

```text
front door → Interested User onboarding → App Home → first role → role-shaped
navigation → Role Store for further roles
```

`ASSERTION` — It feels anticlimactic because the interesting part is missing on purpose,
not by neglect. What a newly certified person actually works on is A15, and A15 is blocked
on the Records layer. A new front door does not unblock it.

`DECISION` — The locked work order is untouched by anything in this note: Draft
Connecticut Agreement → Records / Object Model → SiteBMS → JobNimbus mapping → API / MCP.

## 7. Where I think this is going

`ASSERTION` — The project is becoming a records system with many doors and many readings,
whose invariant is the file and the ledger. Brand, book, game, agenda year and persona are
all Expression above that line. That is a more durable answer than any single umbrella
name — which is precisely why the umbrella question can stay open without costing
anything.

`ASSERTION` — November 1, 2026 is a date to demonstrate the next version of the
experiment, not a deadline that decides whether the Plan succeeded.

## 8. Open lines opened by this note

| Register | Question |
|---|---|
| C40 | Is Lt. Dan's Plan the umbrella for the whole body of work, and does Prepare America become a mission inside it? |
| C41 | What is the game gateway's completion event, and what does it authorize? |
| C42 | ADR-010 ("no anonymous sign-ups") against ADR-015 (front door open to anyone) |
| A42 | An institutional, apolitical Perception variant of the Prepare America argument |
| A43 | LtDansPlan.com as a calm serious door — decide after A42 is tried |

## 9. Related

- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-019, ADR-020, ADR-021, ADR-023.
- [`strategy/KIMOSABE-POSITIONING.md`](KIMOSABE-POSITIONING.md) — the scout position.
- [`requirements/KNOWLEDGE-LIBRARY.md`](../requirements/KNOWLEDGE-LIBRARY.md) — Source /
  Pattern / Expression, the Perception Library, authorized containers.
- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) — the register.
