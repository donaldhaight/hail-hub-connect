# Reading the Afternoon Addendum Against the Corpus

Documentation only. No route, component, schema, migration or UI change. Nothing in the
addendum is promoted to canon by this pass; it is filed with truth labels so it can be
argued with later. The locked work order does not move.

## The question you asked, answered first

**Does this change what Donald should spend the next 24 hours figuring out, or does it
simply add a layer above the locked work order?**

Both, and the split is clean.

It does **not** change the locked work order. Connecticut Agreement → Records / Object
Model → SiteBMS → JobNimbus → API / MCP is sequencing for the *machinery*, and the
addendum's own argument concedes the machinery has ancestors. Nothing here unblocks it,
and nothing here is blocked by it.

It **does** change what you personally should spend tonight on. The addendum's strongest
move is the asymmetry it names: the LC/ISR/PO/SiteBMS work is recoverable from 2012–2019
material, and the engagement layer has no ancestor. That is a real difference in
information value. Your hours are the scarce input on the part with no precedent; the
recoverable part is translation work an agent can grind on. So: the order stays, your
attention moves, and the two are not in conflict.

One caution, stated once. "Kimosabe becomes the intelligence inside App Home" is the
place where the addendum quietly touches the machinery rather than the layer above it.
A feed that recommends, a player that tracks what you consumed, and a guide that "learns
enough to be useful" are all reads and writes against a memory partition (ADR-016) and
all need a completion event under ADR-021. That is specifiable tonight in words. It is
not buildable until the Records layer exists. I would write it and hold it.

## What is genuinely new

Three things, and only three.

1. **The recoverability asymmetry.** The corpus has never stated that the construction
   machinery is largely reconstructable from prior implementations while the engagement
   architecture is unprecedented. That is a prioritization principle, not a plan item,
   and it belongs in the protocol's working method.
2. **The universal grammar — Home · Ask · Feed · Player · Tasks · Settings.** Six words
   that hold many businesses without asking the user to learn the corporate structure.
   The Screen Book's `04_App_Home` branch currently lists eight screens
   (Home_Page · Guide_Channel · Search · New · Tasks · Account · Role_Switcher ·
   Role_Store) and does not contain Feed or Player at all.
3. **First-pass gamification as the deliberate pattern break** — explicitly bounded:
   not the LARP, not Metatron's Cube bound to roles, not ledger-altering scoring, not
   badge inflation. A bounded refusal list is the part that makes this specifiable.

## What the corpus already held

- Kimosabe as intelligence rather than a website — `strategy/KIMOSABE-POSITIONING.md` §4.
- Many doors, one arrival architecture — ADR-019, already running at `/kimosabe` and
  `/buddy-claim` on one anchor, wallet and ledger.
- The engagement loop's "explain it many ways" requirement — the Perception Library
  (A30), still specified and unbuilt.
- App Home's extension points deliberately undefined — C14, open since it was built.
- Tasks that lead somewhere — `/app/tasks` exists; it is the seed of the loop.

## Conflicts, stated plainly

1. **Feed and Player are not in the Screen Book.** The addendum's central loop runs
   through two containers that do not exist in the twelve-branch tree, at any status.
   Either the branch is wrong or the loop is.
2. **A recommending feed versus ADR-016.** "Increasingly relevant opportunities" is
   inference across a memory partition unless the person's own act moves it. This is
   C38 arriving with a concrete surface attached.
3. **"Makes discovering a role feel earned" versus the certification rule.** Nobody can
   grant a certification and nobody buys past one. Any progression mechanic that makes a
   role *feel* nearer without the quiz being passed is a claim the badge cannot back.
4. **A player and a feed versus the locked order.** Both need permitted records and a
   completion event (ADR-021); both sit downstream of Records. Specifiable now,
   buildable later — and that distinction has to be written down or it will erode.
5. **Gamification versus band 3.** Nothing in a game surface may expose targeting,
   kill-zone or fringe method. Stated before any mechanic is drafted, not after.

## Classification

| Idea | Label |
|---|---|
| Machinery is recoverable; engagement has no ancestor | ASSERTION — strong, and new to the corpus |
| Next 24 hours belong to the engagement layer | proposed DECISION on attention, not on work order |
| Universal grammar: Home · Ask · Feed · Player · Tasks · Settings | HYPOTHESIS |
| Kimosabe as the intelligence coordinating App Home, not a gate | ASSERTION — consistent with the positioning brief; unbuilt (A38) |
| Personalized feed with content settings | OPEN — no records, no partition rule, no completion event |
| Reader / Player | OPEN — same |
| First-pass gamification with an explicit refusal list | HYPOTHESIS |
| Front doors make different promises, one legible interior | ASSERTION — already in force under ADR-019 |
| November 1 as a place the story is heading | ASSERTION — consistent with existing treatment |
| Legal entities and ledgers stay separate beneath one grammar | ASSERTION — consistent with ADR-014 |

## Files this pass will write

- `docs/strategy/ENGAGEMENT-LAYER.md` — new C2 note holding the recoverability asymmetry,
  the six-word grammar, the engagement loop, the Kimosabe turn, and the bounded
  first-pass gamification question. Every claim labelled.
- `docs/law/DECISIONS.md` — ADR-024 recording the attention-versus-sequence distinction:
  the locked work order is unchanged, and founder hours are directed at the layer with no
  ancestor. Alternatives considered.
- `docs/screens/04_App_Home/README.md` — add `Feed` and `Player` to the branch as
  honestly empty, with the conflict noted.
- `docs/work/OPEN-ITEMS.md` — new register lines: the grammar as a declared container set;
  feed records and partition rule; player records and completion event; first-pass
  gamification scope and refusal list; the earned-role tension against certification.
- `docs/00-START-HERE.md` — add the new strategy note to the manifest.
- `docs/work/SPRINTS.md` — Sprint 2.15, documentation only.
- Backlog board mirror of every new register line, same IDs, same turn.

## Out of scope

No mechanic is designed, no feed is built, no player is built, no schema is touched, no
persona is added, and the locked work order is untouched.
