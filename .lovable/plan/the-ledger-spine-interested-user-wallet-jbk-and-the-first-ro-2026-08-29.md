# The Ledger Spine: Interested User wallet, JBK, and the first role

Your Siteforum narration closed the gap. Below is the answer to your token question, then the build order.

## Answer first: yes, Interested User is a role

Siteforum's model was roles, not groups — a matrix of roles, with groups added later only for geography and community. That maps cleanly:

- **Interested User** is a role. It is the only role that requires no certification and no verification, and it is provisioned automatically on arrival rather than by you.
- It carries exactly one capability beyond browsing: **a ledger-wallet that can earn JBK and spend a portion of it on entry**. Earn-and-enter, nothing else. No transfers to other people, no external value.
- Its wallet is a **holding account**, not an identity. When the person later certifies into a real role, the anonymous wallet is *claimed* — the same balance, the same history, now attached to a certified identity. Never duplicated, and the claim itself is a ledger entry.
- Coinbase only enters at the MarketApp boundary, when a certified role exists. Before that the ledger is internal and self-contained.

That gives you the thing you actually want on 11-01-2026: an anonymous person in the room can watch tokens move, in real time, on a live ledger, without an account.

## The ledger, at Phase 1 grain

One append-only ledger, double-entry, no deletes and no updates. Balances are always derived by summing entries — never stored and mutated.

```text
WALLET   ── belongs to an anchor (anonymous) or a user (certified)
ENTRY    ── wallet, token, amount, direction, reason, occurred_at, ref
TOKEN    ── JBK | CLAIMCOIN, each with a pegged value recorded as data
```

- Every entry names its **reason** (earned:share, earned:invite, spent:entry, claimed:merge, granted:seed) and its **ref** (what caused it).
- Movement between the Interested User wallet and the MarketApp wallet is itself two entries, so the movement is visible as an event with a date and time — which is the demo.
- Peg values live in a table, versioned, so a peg change is auditable rather than a code edit.
- Nothing is written from the browser. All writes go through narrow server functions that decide the amounts; the client never proposes a balance.

## Role provisioning — Siteforum's flow, kept

Your 2008 flow was: request access with a chosen role → lands in a table → you review → you create the user and assign the role → system emails → verify → user lands on their role's App Home. We keep that spine and change only what has to change.

```text
Request Access (role chosen)  ──►  Founder queue (full file attached)
                                            │
                                            ▼
                                   Role granted by you
                                            │
                                            ▼
                        Role Store card ──► fee ──► 4 videos + quizzes ──► App Home
```

- **Nobody self-certifies.** The queue is yours alone, exactly as before.
- **Phase 1 ships one certifiable role: ISR.** Fee, checkout, four videos each followed by a short quiz, then sign-in and App Home. Every other role stays request-only until you say otherwise.
- Videos and quizzes are stored as data now so the future SiteBMS can own them later without a rewrite.
- **Switch Role** is in the model from day one, because Kimosabe must know which role the person is currently wearing.

## Role naming — realign now, while it is cheap

The nine tags in the platform today are pre-Stakeholder-Group vocabulary, and only two are enforced anywhere. Realigning costs almost nothing at this moment and gets expensive the day a second role is enforced:

```text
Interested User · Industry Observer (tagged)
VentureTech · SystemsTech · LegalTech · InsureTech · FinTech
Construction Management · Business Development
Founder Admin (retained)
```

Legacy operating roles from Siteforum — LC, ISR, PO, INSCO, IA — are **entity roles inside the MarketApp**, a separate axis from Stakeholder Groups. Keeping the two axes separate avoids the collision that made groups too complicated in 2008.

## Kimosabe and the object grain

Kimosabe attaches to the person, and reads the world through whichever role they are currently in. It does not cross roles. Anonymous, it sees the Interested User file and wallet. Certified and switched into ISR, it sees ISR tasks and the season clock. Same conversation, same memory, different permissions — that is the grain.

## Build order

1. **Ledger core** — wallets, append-only entries, tokens with pegs, derived balances, server-only writes.
2. **Interested User role + wallet** — auto-provision on arrival, earn events, the entry spend, and the claim/merge rule.
3. **Ledger surface** — a live view of entries moving, for Founder Admin and Qualified Insider, drivable in the room.
4. **Request Access with role selection** into the founder queue, with the accumulated file attached.
5. **Role Store + ISR certification** — card, fee, four videos with quizzes, App Home landing.
6. **Switch Role + role-aware Kimosabe.**

Steps 1–3 stand alone and are the demonstrable piece. Steps 4–6 are the Siteforum flow re-expressed here.

## The two-codebase question

Codebase 1 is Siteforum running Season 1, due March 1 2027. Codebase 2 is this. They meet at the ledger: this platform holds the ledger of record for Founders and Sponsors, and Siteforum's Season 1 activity posts into it as entries. That is one integration surface instead of a merge, and it is why the ledger has to be right first.

## On the multi-LLM stack

This platform can call any model through one gateway, so OpenAI, Anthropic, Google and xAI models are available now without separate keys or accounts. Agent orchestration frameworks and per-role agents are a later phase — they need the role model and ledger underneath them to have anything to act on. I would not start them before step 6.

## Still open

- Which entity operates Season 1.
- Peg values for JBK and ClaimCoin.
- The earn schedule: what an Interested User earns for sharing, inviting, participating, and the entry price.
- Gamification — not yet designed; your six pages of notes likely speak to it.
