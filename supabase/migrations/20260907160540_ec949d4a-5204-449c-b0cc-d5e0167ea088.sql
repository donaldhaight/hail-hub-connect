insert into public.manual_chapters (slug, part, position, number_label, title, subtitle, truth, confidentiality, draft_status, pull_quote, provenance_note, body) values ('kimosabe-business-plan', 'V', 66, '31', 'Kimosabe.AI — The Business Plan', 'One front door, one file, one wallet, and the ladder that runs from a stranger to a certified operator.', 'DECISION', 'C2', 'review', 'Every business that has ever mattered started by answering one question for one stranger, and writing the answer down where both parties could see it.', 'Authored as the operating business plan for the Kimosabe.AI surface. Sits beside The Two-Track Platform.', $body$
## The one-sentence version

Kimosabe.AI is the front door to the Human Blockchain: a search field a stranger can use without an email address, which opens a file, opens a wallet, and starts a record that both sides can read for the rest of the relationship.

Everything else this company sells — leads for roofing projects, leads for sales talent, certification, market access — is delivered *through* that file. The file is the product surface. The record is the moat.

## Why a front door instead of a form

The industry standard for acquiring a contractor, a sales rep, or an investor is a form that harvests contact information and gives nothing back. The person pays first and finds out later whether it was worth it. That asymmetry is why lead buyers distrust lead sellers, and why the category is priced like a commodity despite carrying enormous value.

Kimosabe inverts it. The stranger asks a question and immediately receives:

1. A file — a durable place where their questions and our answers accumulate.
2. A wallet — carrying JBK, earned before any identity is given up.
3. A visible ledger — every token movement recorded in the open.

**DECISION.** No email, no phone, no login is required to receive value. The device anchor is enough. Identity is exchanged later, voluntarily, when the person wants something the anonymous file cannot hold.

## The ladder

The business is a ladder, not a funnel. A funnel discards; a ladder retains everyone at the height they choose.

- **Interested User** — anonymous anchor, holding wallet, earns JBK. Voluntarily gives a name and a group.
- **Verified Member** — founder-accepted, wallet claimed, App Home opens. Pays or is granted an entity role.
- **Entity Role** — ISR (certifiable), LC (coming), others founder-granted.
- **Certified Operator** — transacts inside the market, carries a record.

Each rung has its own economics. The Interested User costs us compute and returns intent data and a live audience; monetized indirectly, never sold. The Verified Member costs founder attention in the queue and returns a qualified, grouped, addressable participant. The Entity Role is the first direct revenue: ISR certification carries a fee in JBK, LC will carry a higher one because the license is worth more. The Certified Operator carries recurring revenue on transaction flow, plus the network value of a verified operator roster nobody else has.

## What we actually sell

**FACT.** Two lead products exist today in the market and we know both sides of them intimately: project leads — property owners with storm-caused damage, matched to contractors who can actually perform; and talent leads — sales representatives matched to roofing contractors who need to recruit.

**ASSERTION.** Both are commodities *as leads* and both are premium products *as verified relationships inside a shared record*. A lead is worth what a stranger will pay for a phone number. A certified operator holding a file with a visible performance history is worth a multiple of that, because the buyer is no longer buying a guess.

That is the whole business thesis: convert lead sales into record-backed relationships, then price the record.

## What we do not show

The storm-targeting engine — how we determine where damage is, at what density, with what claim probability — is never surfaced to any role. It is the trade secret. Users see the output (a matched project, a matched rep) and never the mechanism. This is a standing constraint, documented separately, and no feature on the Kimosabe surface may violate it.

## Revenue model

- **ISR certification** — role fee, JBK-denominated; live at launch.
- **LC certification** — role fee, higher tier; when the course is written.
- **Project lead placement** — per-match, contractor side; Season 2.
- **Talent placement** — per-placement, contractor side; Season 2.
- **MarketApp transaction** — ledger spread on JBK settlement; Seasons 2–3.
- **Sponsorship and seats** — Congress participation rights; 11-01-2026.

**DECISION.** JBK denominates internal work. It is not a security and is not sold for dollars at the front door; it is earned by participation and spent on access. The peg exists so the ledger can be read in plain numbers, not so the token can be traded.

## The API-MCP posture

Independent Sales Reps and Licensed Contractors already own systems they will not abandon. Demanding migration is how this category loses.

**DECISION.** The back end is positioned as an API and MCP surface. An ISR or LC engages Kimosabe from inside their own CRM, their own phone, their own workflow. Kimosabe holds the record and the settlement; it does not hold their operation hostage. Our leverage comes from being the only shared ledger both sides trust, not from lock-in.

## Cost discipline

Every sprint is a Completed Project Offer with an estimate, an actual, and a variance; the standing tolerance is ten percent. Human Task Efficiency Rating and Agent Task Efficiency Rating are recorded side by side on the platform ledger so the ratio is a measured fact rather than a claim.

**ASSERTION.** If agent efficiency compounds against a fixed human baseline and the savings are recorded in the open, price pressure becomes structural rather than negotiated. That is the long argument this company is quietly building the evidence for.

## Launch

**11-01-2026, First Congress, #PrepareAmerica.** The demonstrable claim on that date is narrow and true: a stranger walks up, asks one question, and leaves with a file, a wallet, and a role path — with every step of it recorded where the room can see it.

Nothing on the stage is a mock. That constraint sets the build order and it does not move.
$body$) on conflict (slug) do update set part = excluded.part, position = excluded.position, number_label = excluded.number_label, title = excluded.title, subtitle = excluded.subtitle, truth = excluded.truth, confidentiality = excluded.confidentiality, draft_status = excluded.draft_status, pull_quote = excluded.pull_quote, provenance_note = excluded.provenance_note, body = excluded.body, updated_at = now();