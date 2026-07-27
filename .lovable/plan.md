## Sprint 0.19 — Founder Invite Surface

**Goal:** Make founder-driven insider invitations impossible to miss and pleasant to send.

### Current state
- The founder inbox has an "Invite insider directly" button that opens a small inline modal, but it blends into the tab bar and is easy to miss.
- There is no dedicated `/admin/invite` route or persistent nav link.
- The invite form fields and post-send experience (copy link, resend, revoke) are usable but cramped inside the inbox layout.

### Proposed work

1. **Dedicated invite page** (`/_authenticated/admin/invite.tsx`)
   - Full-width form with fields: email, full name, organization, role/category, internal founder note.
   - Zod validation matching the existing `inviteInsiderDirect` server function.
   - On submit, call `inviteInsiderDirect`, then display the generated `/insider/accept?token=...` link with a one-click copy button and a "Send another" reset.
   - Show a live preview of the invitation email body (plain text) so the founder knows what the recipient will see once email sending is enabled.

2. **Persistent navigation affordance**
   - Add an "Invite" link to the authenticated header for `founder_admin` users, pointing to `/admin/invite`.
   - Keep the existing inbox button but relabel it "Invite someone" and make it route to `/admin/invite` instead of opening the modal.

3. **Inbox invitations tab polish**
   - Add a "New invitation" button on the Invitations tab that also routes to `/admin/invite`.
   - Add copy-link and resend actions directly on each pending invitation row.

4. **Email preview / stub clarity**
   - Since email sending is still deferred, surface a non-blocking notice: "Email sending is not configured — copy the link and send it manually for now."

### Out of scope
- Public "request an invite" form.
- Expanding insider peer referrals (already exists at `/insider/refer`).
- Bulk CSV upload of invites.

### Acceptance criteria
- A founder can sign in, click "Invite" in the header, fill the form, and copy a working invitation link.
- The existing inbox invitation list remains functional and gains a clear path to the new page.
- Build passes and the new route is noindex/nofollow.

### Next step
Approve this plan and I'll implement Sprint 0.19.