# Plan: Make App Home the Destination

The front door and the App Home shell now exist, but almost nobody is delivered to them. Sign-in currently sends everyone to the founder inbox surface, and accepting an invitation drops people on the insider page. This sprint routes people into their home and makes the first thing they see there actually actionable.

## 1. Every arrival lands in App Home

- After sign-in, sign-up, and password reset, people land on `/app`.
- After accepting an invitation, people land on `/app` instead of the insider page — the welcome, wallet claim, and first tasks all read there.
- The Founder keeps a one-click path to the queue and the Situation Room from the nav menu, so nothing is lost by not landing there.

## 2. First-run welcome in App Home

- A first visit shows a short greeting naming the group and role that were granted, and confirms anything earned before signing up has moved into the personal wallet.
- Once acknowledged, it does not return.

## 3. Tasks that lead somewhere

- Each task in the strip opens a single-task view with what is being asked, why, and one action; plus an "all tasks" view.
- Completing a task updates the strip immediately.

## 4. Role-shaped homes visible in practice

- Interested User, Verified Member, ISR, and Founder each see a different task set and nav menu, confirmed by walking one account through the whole path.

## Held for later (unchanged)

Licensed Contractor course design, the ClaimExpress protocol / API-MCP work, the System Management System authoring surface, and the Quantum Dashboard targeting engine.

## Technical notes

- `redirectAfterAuth` in `src/routes/auth.tsx` currently hard-routes to `/admin/inbox`; change to `/app`, keeping any intended-destination handling.
- `src/routes/insider.accept.tsx` navigates to `/insider` after redemption; change to `/app`.
- Add `/app/tasks` and `/app/tasks/$id` under `_authenticated`, backed by the existing `getAppHome` task derivation extracted into a shared task module, plus a completion server fn for the tasks that can be marked done.
- First-run acknowledgement stored per user (small profile flag or local preference keyed to the user id), not a new ledger concept.
- Verify end to end in the browser with a signed-in session for a granted role and for the Founder.
