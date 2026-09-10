# Close the exposed sign-in, add password change to Account

Two problems. The README on GitHub prints the founder email and password in
plain text, and the Account page has no way to change a password once signed in.
Both get fixed in the same pass.

## 1. Take the credentials out of the README

Replace the "Founder sign-in" block with a line that only names the sign-in
route (`/auth`) and says access is granted by invitation. No email, no password,
ever again in the corpus.

Important, and I can't do it for you: the old password is already in the
repository's history and in anyone's copy of it. Removing the line does not
un-publish it. **Change the password immediately after this ships** — the new
Account screen below is how you do it.

## 2. Password change on the Account page

Add a "Password" section to `/app/account`, below Identity, above Session:

- Current password, new password, confirm new password.
- Refuses if the new password is under 8 characters or the two entries differ.
- On success: a plain confirmation, fields cleared.
- On failure: the reason shown in the same red style already used on the
  sign-in page ("current password is incorrect", etc.).

Also add a "Forgot it?" link that sends the reset email to the signed-in
address, reusing the existing `/reset-password` page — so a half-remembered
password is not a lockout.

## 3. Require the current password

Turn on the backend setting that requires the current password for a signed-in
password change. Without it, anyone who reached an open session could silently
change the password. Recovery-link resets are unaffected.

## Technical notes

- `src/routes/_authenticated/app/account.tsx` — new password card; calls
  `supabase.auth.updateUser({ password, current_password })`. Local component
  state only; no new server function, no schema change.
- `supabase--configure_auth` with `require_current_password: true`.
- `README.md` — credential block replaced.
- Verify: `bunx tsgo --noEmit`, then a signed-in run through the form in the
  preview (wrong current password rejected, correct one accepted).

## Not in this pass

Password strength meter, two-factor, session revocation across devices, and
rewriting git history. Say the word and any of them become their own item.
