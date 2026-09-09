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

## Deliverables

1. **Positioning brief** — `docs/strategy/KIMOSABE-POSITIONING.md`
   - Audience ladder: public front door → interested user → certified role-holder → multi-role operator.
   - Brand promise, proof points, voice/tone rules, and red lines (what Kimosabe is not).
   - Relationship to PrepareAmerica, the Human Blockchain, Market Applications, and the first season.

2. **Updated brand registry** — `src/content/brands.ts`
   - Refresh Kimosabe tagline, one-line value, and vertical role to match scout/transformer positioning.
   - Keep domain as `kimosabe.com` unless a decision changes it to `kimosabe.ai`.

3. **Rewritten `/kimosabe` front door** — `src/routes/kimosabe.tsx`
   - Headline, subhead, and placeholder text that express the scout/transformer promise.
   - Preserve the one-field, one-button ritual; change only the language around it.
   - Update page `<title>` and `description` meta.

4. **Updated Kimosabe feed voice** — `src/lib/kimosabe-feed.ts`
   - Rewrite existing feed items in the new tone: warm, shape-shifting, memory-bearing, never chatbot-cutesy.
   - Keep role-scoped gating intact.

5. **Optional cross-reference** — `docs/00-START-HERE.md`
   - Add the positioning brief to the strategy reading list.

## Out of scope

- No visual redesign, no new illustration, no animation.
- No schema, route, or wallet logic changes.
- No new pages beyond copy updates to the existing `/kimosabe` route.
- No domain or DNS changes.

## Verification

- `bunx tsgo --noEmit` passes.
- `/kimosabe` returns HTTP 200 and the new copy renders.
- No broken internal links introduced by the new document.
