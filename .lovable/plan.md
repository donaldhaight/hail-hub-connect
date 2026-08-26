# Kimosabe: the front door to the Human Blockchain

Kimosabe is not one of the apps. It is the branded chat surface every app opens into and returns from — MarketApp, BooksForge, MusicApp, MovieApp, MyGPT.TV. One conversation, one file, one memory across all of them. That shared memory is what makes it a Human Blockchain rather than five products with a common login.

Built as a separate route tree in this project. Zero changes to PrepareAmerica. The link can be dropped anywhere and still work.

## The access model — proposed, pending correction

The Siteforum/ClaimExpress model has not been narrated yet, so this is a working reconstruction, not a claim about the 2014 system. It is built to be replaced field-for-field once the real model is on the table. Nothing downstream assumes it is right.

Three layers, each answering a different question:

```text
GROUP   ── who you belong to        (org, crew, chapter, territory)
ROLE    ── what you are             (rep, crew chief, adjuster, counsel, investor)
GRANT   ── what that lets you touch (module + record + territory)
```

- A person may hold several group memberships; each carries its own role. Grants accumulate — the union, never the intersection.
- A role is a permission bundle wearing a job title. The title is what the user sees; the bundle is what the system enforces.
- Access is filtered on all three grains at once: which screens you can open, which records inside them are yours, and which geography you are scoped to.
- **Certification** is the act of a role being granted. It is never self-asserted. Someone with standing certifies it, and the certification is recorded with who, when, and on what evidence.

PrepareAmerica's nine role tags today are not this model — only two are enforced anywhere, and one person holds one. There is nothing to contradict. Clean slate.

## The Interested User routine

**Arrival.** Everyone starts as an Interested User. No signup, no email, no phone. An opaque anchor is minted (browser storage plus signed cookie) and a file opens. Kimosabe already knows something: the link that carried them, the region, the device, the hour.

**Intuition.** Chat UI means Kimosabe moves first, and the opening move is a read, not a question. *"You came in from a roofing link in Tarrant County."* Being read correctly disarms. Being read slightly wrong is better — they correct it, and the correction is the first thing they teach it.

**Trojan horses.** Each app is a capability worth having whose use happens to raise resolution on the file:

| App | What it gives them | What it teaches us |
| --- | --- | --- |
| MarketApp | run my numbers, watch my county, show me my roof | scale, territory, trade role |
| BooksForge.AI | make me something | what they care about, how they think |
| MusicApp.AI / MovieApp.AI | the cultural races | taste — and eyes off the canvass track |
| MyGPT.TV | a channel of their own | what they want to be seen as |

Nobody fills out a profile. The profile assembles itself. Every observation carries a value, a provenance, and a confidence — the same discipline as the Situation Room's signals. Derived traits ("contractor with money", "capital", "counsel") are computed, scored, and always traceable to the gestures that produced them.

**Recognition.** At the first real return, Kimosabe says it out loud: *"I remembered you."* Quietly proud rather than covert. This is a deliberate posture decision — it turns a persistence mechanism into the best moment in the demo, and keeps the room's counsel comfortable.

**The turn.** At some point the Interested User stops browsing and wants standing — to transact rather than observe. Kimosabe hands them to MarketApp for the ledger-wallet. This is the moment the anonymous file must become a certified identity holding a role.

```text
Interested User ──► horses raise resolution ──► asks for standing
                                                      │
                                                      ▼
                                      MarketApp: ledger-wallet opened
                                                      │
                                                      ▼
                              certification requested ──► founder review ──► role granted
```

Nobody self-certifies. Every certification request lands in a founder queue with the whole accumulated file attached — every gesture, every inference, every confidence score. The vetting decision is made against evidence the person generated themselves without ever being interviewed.

## Build order

1. **Kimosabe shell** — route tree, anchor minting, credential resolution, the recognition moment. No horses yet.
2. **The file** — observations, derived traits with confidence, and the merge rule for when an anonymous file later attaches to a credential or account (claimed, never duplicated; merge recorded).
3. **MarketApp handoff** — the standing request, the ledger-wallet stub, and the certification queue with the file attached.
4. **First Trojan horse** — one MarketApp capability end to end, proving the resolution loop.
5. **Remaining horses**, then the founder-side view of accumulating files.

Step 3 is the one that binds to Siteforum. When the real group/role/certification model arrives, it replaces the proposed model above and steps 1–2 are unaffected — the file does not care what roles exist.

## Technical notes

- Kimosabe lives at its own path under `src/routes/`, with its own resolver rather than the `_authenticated` gate. That gate fails closed; Kimosabe fails open into the ritual.
- The anchor is server-signed and opaque; the browser never holds anything meaningful about the person.
- New tables for the file, its observations, derived traits, and certification requests. Anonymous rows are written only through narrow server functions, never directly from the client. Founder-only read.
- Groups, roles, and grants are data, not hardcoded checks, so the model can be swapped when Siteforum's is known.
- Nothing outside the Kimosabe route tree changes.

## Still open

- The actual Siteforum/ClaimExpress group, role, and certification model — replaces the proposed section above.
- Which Trojan horse ships first.
- What the ledger-wallet holds at Season 1 grain.
