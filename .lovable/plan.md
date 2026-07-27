## Sprint 0.18a — Seed Founder Admin Account

### What you asked for
Create `Donald.Haight@rrcausa.com` with password `Admin` and grant it founder-admin rights.

### Two things to flag before we build

1. **Password strength.** `Admin` is 5 characters and almost certainly below Supabase's minimum (default 6) and will trip the HIBP leaked-password check we discussed enabling. I'd like to seed the account with a temporary password of your choice (min 8 chars, e.g. `Admin!2026` or similar) and force a reset on first login. If you insist on literal `Admin`, I'll disable HIBP for the seed and re-enable it after — but that's a real security hole for a site aimed at C-levels and VCs.
2. **Google is the primary path.** The app is wired for Google OAuth. An email/password account works, but if you plan to sign in with Google using this same address, sign in with Google *first* — Supabase will link the identities. Otherwise the two identities can collide.

### Plan (executes in build mode after you approve)

1. **Confirm email/password auth is enabled** in Lovable Cloud auth settings (read-only check; enable if off — you already have Google on).
2. **One-shot seed server function** `src/lib/seed-founder.functions.ts` (public route, guarded so it only runs when *no* `founder_admin` exists yet, then self-disables):
   - Uses `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`.
   - Inserts `('<uid>', 'founder_admin')` into `public.user_roles`.
   - Returns `{ ok: true }` or a clear reason (already exists, weak password, etc.).
3. **Trigger the seed once** via `stack_modern--invoke-server-function` from my side — no UI, no leftover endpoint exposed on the published site (the function checks "founder already exists" and refuses subsequent calls).
4. **Verify** by signing in at `/auth` with the credentials, confirming `/admin/inbox`, `/admin/digest`, `/admin/reads`, `/admin/tour` all load.
5. **Docs**: add a line to `docs/DECISIONS.md` recording the seeded founder identity and the "first Google sign-in also becomes founder" fallback that already exists in `inbox.functions.ts`.

### What I need from you before executing

- **Password**: keep literal `Admin` (weak, I'll note the risk) **or** give me a stronger temporary one. Reply with the password you want and I'll switch to build mode and run the seed.
- Confirm the email is exactly `Donald.Haight@rrcausa.com` (case-insensitive on Supabase's side, but I'll store it as written).

### Note on current state (verified)
No admin account has been provisioned by me in prior sprints. The existing fallback in `src/lib/inbox.functions.ts` auto-promotes the *first* signed-in user to `founder_admin` if none exists — so if you'd rather just sign in with Google once at `/auth`, you become founder automatically and we can skip the password seed entirely. Say the word.
