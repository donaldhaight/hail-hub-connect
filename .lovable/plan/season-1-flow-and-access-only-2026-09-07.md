# Season 1 — Flow and Access Only

**Goal:** Get the movement between screens and the rules of who can reach what correct. No invented views, no invented datasets, no per-role screen designs. Those come from you, one at a time, after the frame exists.

## Scope discipline

This plan builds three things and nothing else:

1. The path a person walks from the public front door to their signed-in home.
2. The access rules that decide which doors open for which role.
3. Empty, labelled placeholders where a role's own screens will later go.

Anything about what an ISR, LC, PO, insurer, adjuster or supplier actually sees is out of scope until you describe it.

## 1. The walk (screen to screen)

```text
kimosabe.ai (public, no login)
   |  search field + one button
   v
anonymous file opens  — device anchor + holding wallet created
   |
   v
onboarding steps      — each step earns; still no email required
   |
   v
sign up / sign in
   |
   v
wallet claim          — holding wallet merges into the account wallet
   |
   v
App Home (/app)       — the destination for everyone, every role
   |
   +-- Tasks           (the toll booth; a task links to one task page)
   +-- The channel     (direct line to Kimosabe, monitored)
   +-- Nav menu        (role-shaped; only doors you hold)
   +-- Role settings   (switch between roles you hold)
   +-- Account         (your file, your wallet, your record)
   +-- Footer switcher (MarketApp now; the rest marked soon)
```

Rules that fall out of this:

- Every entry point ends at App Home. Sign-in, invitation redemption, wallet claim, email link.
- Nothing on the public side requires an account; nothing on the signed-in side is reachable without one.
- A person who never signs up still has a file and a wallet that survives.

## 2. Access

Access is decided by the roles held in the existing role tables, not by page-level guesswork.

```text
Standing            Reaches
-----------------------------------------------------------
Anonymous           Public front door, onboarding steps, own holding wallet
Interested User     Same, plus a persistent file
Verified Member     App Home, own wallet, own record
Entity Role         App Home, plus that role's own area (empty for now)
Founder             Everything, plus the Founder Console
```

Two hard rules:

- Holding an entity role opens that role's own area only. It never opens the Founder Console or another role's area.
- Every server call re-checks the role. A hidden menu item is not access control.

Delivered as: one place in the code that answers "what does this person hold, and what does that open", used by both the nav menu and the server checks. No duplicated lists.

## 3. Role areas as empty rooms

For each entity role that exists in the role catalog, create one route that renders a labelled, deliberately empty page: the role name, what it will hold, and a note that the views are pending your description.

This proves the routing and the access rules end to end without inventing a single field, status or dataset.

## 4. Ledger — movement only, not new economics

Confirm the existing ledger carries the movements the walk above requires: earn on an onboarding step, claim on wallet merge, and a recorded fee when a role is taken. No new tokens, no new pricing, no new tables in this pass.

Coinbase and fiat exit are noted as a later pass, not built here.

## What I will ask you next, in order

1. The Interested User onboarding steps — how many screens, what each one says and asks.
2. The App Home task list — what tasks exist and what each one opens.
3. One entity role at a time: its screens, views, datasets, naming conventions and statuses.
4. The ledger's second unit of measure and how it settles.

## Technical notes

- Public route `/kimosabe`; authenticated subtree under `/app`.
- One shared access map module consumed by the nav and by server functions.
- One route per entity role under `/app`, placeholder body only.
- No new tables and no migration in this pass.
