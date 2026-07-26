# Sprint 0.5 — Close the loop on the front door

Sprints 0.1–0.4 are live: eight-page briefing site, capture to Lovable Cloud, founder inbox with roles and audit log. Two things are still missing before we move into Phase 1 (Qualified Insider Layer):

1. **The applicant never hears back** — no confirmation email, no founder notification. Everything sits silently in the inbox.
2. **Approved requests have nowhere to go** — the inbox marks someone "approved" but that state opens no door.

This sprint fixes both — the first via the email lane you'll finish when you're off the road, the second by scaffolding the insider gate the approval is supposed to unlock.

## What I'll build now (no domain required)

### 1. Insider gate scaffolding
- New role in `app_role`: `qualified_insider`.
- Server function `grantInsiderAccess(requestId)` — callable from the inbox detail panel when a briefing is approved. Creates an `insider_invitations` row with a single-use token, links it to the briefing request, and records the event to the audit log.
- New table `insider_invitations`: token, email, briefing_request_id, expires_at, redeemed_at, status. RLS: only founder_admin reads; anon can redeem by token via a security-definer function.
- New public route `/insider/accept?token=…` — validates the token, prompts the visitor to sign in (or create an account) with the matching email, then grants the `qualified_insider` role on that user and marks the invitation redeemed.
- New protected route `/_authenticated/insider` — landing page for qualified insiders. For this sprint it renders a placeholder "Qualified Insider Room" with the confidentiality banner and a stub list of the materials that will live there. Access is gated by `qualified_insider` OR `founder_admin`.

### 2. Inbox upgrades
- "Approve & invite" action on the briefing detail panel: sets status to `approved` and generates the invitation in one step. Shows the invite URL for you to copy (until email sending is live, you paste it into your own email).
- Show invitation status inline (unsent / redeemed / expired).

### 3. Email lane — ready to activate
- Send helpers stubbed with the exact template content (founder notification, applicant auto-reply, insider invitation) behind a `sendEmail()` shim that no-ops until the sender domain is verified.
- Once you set up the domain later, activating sending is a one-line switch — no template writing at that point.

## What I won't touch this sprint
- Visual redesign of the inbox (waiting on your screens).
- Phase 1 workspace surfaces beyond the insider landing placeholder.
- Any transaction, pricing, or securities-adjacent copy.

## Technical notes
- `insider_invitations` uses a `gen_random_uuid()` token + `expires_at` (default 30 days). Redemption is a `SECURITY DEFINER` function so anon can call it with just the token; it verifies the token is unredeemed and unexpired, matches the signed-in user's email against the invitation, and inserts the role.
- Insider landing lives under `_authenticated/` so the managed gate handles session; a `beforeLoad` check on the child calls `has_role(auth.uid(), 'qualified_insider')` and redirects to `/` if false.
- No changes to the existing eight public pages or to the `briefing_requests` schema — only additive.

## Decisions I'm making unless you say otherwise
- Invitation expiry: 30 days.
- One invitation per approved briefing request; re-issuing revokes the previous.
- Insider redemption requires the visitor to sign in with the same email address on the invitation. Google or email/password both work.

## Alternative if you'd rather not build the gate yet
If you'd prefer I hold on the insider layer until the PrepareAmerica screens arrive, the other productive move is **wiring the email lane end-to-end against a Lovable-managed sandbox sender** so the moment your domain is verified, notifications and auto-replies flip on with zero code changes. Say the word and I'll do that instead.
