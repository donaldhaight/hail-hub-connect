# Kimosabe.AI Positioning & Front-Door Copy Sprint

## What we are doing

Define and ship the public brand positioning for **Kimosabe.AI** as a shapeshifting, friendly personal scout — an all-in-one lynchpin that helps people navigate from the fragmented past (disconnected task platforms, paper chaos, insurance-restoration opacity) into a coordinated future. Insurance restoration is the first proving ground, not the final definition. Then update the `/kimosabe` front door and related copy to match.

## Strategic frame

Kimosabe is **not** a chatbot, a dashboard, or an insurance app. It is a personal protocol layer: one persistent identity, one append-only ledger, one line of guidance, and a growing family of role-shaped apps. The front door sells the transformation, not the feature list.

Core proposition:

- **Past** → scattered systems, forgotten promises, identity that resets at every login.
- **Future** → one portable file, earned trust, roles that unlock rooms, and a scout that remembers what matters.
- **Kimosabe** → the friendly transformer who walks between the two.

The first "season" is insurance restoration (ISR / LC / Property Owner). The platform pattern is general: connect existing task platforms, create new ones where gaps exist, and wrap both in a single identity envelope.

## One engine, two faces

Kimosabe and **Buddy Claim** run the same front-door engine — same ask-once ritual, same file, same holding wallet, same ledger, same guidance channel. Only the persona, palette, and vocabulary differ.

- **Kimosabe.AI** — the universal scout. Open to anyone, no market assumed. The general-purpose door.
- **Buddy Claim** — the same scout wearing a market-specific face: the spokesperson for SelfInsurity and the ClaimStore vision, speaking directly to the insurance-restoration audience (property owners, ISRs, contractors).

This proves the shapeshifting thesis in code, not just in copy: one protocol layer, many branded personas. Buddy Claim becomes the template for every future persona.

Implementation approach: extract the front-door experience into a shared, persona-driven component so both routes render the same machine with different content. No duplicated logic.

## Deliverables

1. **Positioning brief** — `docs/strategy/KIMOSABE-POSITIONING.md`
   - Audience ladder: public front door → interested user → certified role-holder → multi-role operator.
   - Brand promise, proof points, voice/tone rules, and red lines (what Kimosabe is not).
   - Relationship to PrepareAmerica, the Human Blockchain, Market Applications, and the first season.
   - The one-engine/many-personas principle and how Buddy Claim instantiates it.

2. **Persona registry** — `src/content/personas.ts`
   - A typed persona record: wordmark, tagline, subhead, ask placeholder, button label, wallet framing, footer link, palette token.
   - Two entries: `kimosabe` and `buddy-claim`.

3. **Shared front-door component** — `src/components/frontdoor/FrontDoor.tsx`
   - The existing `/kimosabe` experience refactored to accept a persona and render from it.
   - Wallet, earn, ledger, and ask logic move over unchanged.

4. **Two routes on one engine**
   - `src/routes/kimosabe.tsx` — renders the `kimosabe` persona.
   - `src/routes/buddy-claim.tsx` — new public route rendering the `buddy-claim` persona, positioned as SelfInsurity's spokesperson for the ClaimStore vision.
   - Each gets its own unique title, description, and canonical.

5. **Updated brand registry** — `src/content/brands.ts`
   - Correct Kimosabe's domain to `kimosabe.ai` (the founder owns .AI, not .com).
   - Refresh Kimosabe tagline and one-line value for the scout/transformer positioning.
   - Refresh Buddy Claim's entry to name its spokesperson role.

6. **Updated guidance voice** — `src/lib/kimosabe-feed.ts`
   - Rewrite feed items in the new tone: warm, shape-shifting, memory-bearing, never chatbot-cutesy.
   - Keep role-scoped gating intact.

7. **Cross-references** — `docs/00-START-HERE.md` and an ADR in `docs/law/DECISIONS.md` recording the one-engine/many-personas decision and the `.ai` domain correction.

## Out of scope

- No schema, migration, or wallet logic changes — the ledger and wallet behave exactly as they do today.
- No visual redesign beyond persona palette and copy.
- No domain or DNS changes; the `.ai` correction is recorded in content and docs only.
- No new certification, role, or Role Store work.

## Technical notes

- `FrontDoor.tsx` receives a `persona` prop; all wallet server functions (`resolveWallet`, `earnToken`, `payEntryFee`) and the anchor storage key stay shared, so a person recognized at one door is the same person at the other. One identity, two faces — never two files.
- The existing `/b/buddy-claim` brand page stays as-is; the new `/buddy-claim` front door is a separate, functional door.

## Verification

- `bunx tsgo --noEmit` passes.
- `/kimosabe` and `/buddy-claim` both return HTTP 200 and render their own persona.
- Opening a file at one door and visiting the other shows the same balance and ledger.
