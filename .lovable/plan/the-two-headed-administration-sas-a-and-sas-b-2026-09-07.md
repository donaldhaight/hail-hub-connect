# The Two-Headed Administration: SAS A and SAS B

A documentation pass, not a build. It writes down the structure you just described — while you keep describing it — so nothing gets lost between now and the launch.

## The structure as stated

Two entities, one owner, deliberately separated to avoid a conflict of interest:

- **Market Applications (TBD)** — the Technology Anchor. The role Consensys plays for Ethereum, or IOHK for Cardano: it builds and stewards the stack, and it does not sell the funnel.
- **Kimosabe.ai** — the business development spin-off. No revenue model of its own beyond whatever economic model is assigned to lead and people origination funnels. It is the front door, not the treasury.

From that split fall the two administration systems, formerly one thing called SiteBMS:

- **SAS A — technology and project administration.** The stack, the environments, the roles and permissions, the release path, the record. This is the Siteforum "portal and development platform" half.
- **SAS B — business administration.** Running the platform as a going concern — profit or non-profit, undecided — pricing, funnels, counterparties, the books, the ladder economics.

Same building, two scales: SAS A answers "can it be built and proven", SAS B answers "should it be sold and at what price".

```text
                 Owner (sole)
                 /          \
   Market Applications      Kimosabe.ai
   (Technology Anchor)      (BizDev spin-off)
            |                     |
          SAS A                 SAS B
   stack / project        platform business
            \                     /
             \___ one record ____/
```

## What gets written

1. **`docs/STRATEGY.md`** — a new section, "The Technology Anchor and the Spin-Off", holding the entity split, the Consensys/IOHK analogy, the no-revenue-of-its-own posture for Kimosabe, and the conflict-of-interest reasoning.
2. **`docs/ARCHITECTURE.md`** — a new section, "SAS A and SAS B", defining each system's scope, what it owns, what it must never own, and where the two meet (one shared record, two administrations). Notes the SiteBMS rename.
3. **`docs/DECISIONS.md`** — ADR-013, "Split the administration system into SAS A and SAS B", with context (Siteforum lineage, 2008–2012 plans, Ethereum/Cardano lifetimes), the decision, and consequences.
4. **Owner's Manual chapter** — "The Anchor and the Spin-Off", written in the memoir voice: Siteforum's portal and development platform, why the multi-startup approach was a barrier to entry in insurance restoration, and how that same shape now carries the platform. Truth label DECISION, confidentiality C2, draft status review.
5. **Project memory** — the entity split, the SAS A / SAS B definitions, and the "Kimosabe has no revenue model of its own" constraint, so no future session re-proposes Kimosabe as a standalone business.

## Held open, on purpose

These stay marked UNSETTLED in the documents rather than guessed:

- Profit or non-profit for the platform business.
- The legal shape and name behind "Market Applications, TBD".
- The 2008–2012 original business plans and assumed legalities — your Step 1, still being described.
- The economic model assigned to the lead and people origination funnels.

## Sequence

I hold the writing until you say the description is complete. As you talk, I keep a running list of patterns and connections back to what is already in the codebase and the manual, and hand it over at the end. Then I write all five items in one pass and you read them as a set.

Nothing in the running site changes.
