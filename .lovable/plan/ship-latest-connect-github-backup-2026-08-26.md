# Ship Latest + Connect GitHub Backup

Capture the Sprint 2.5 work (invitation vocabulary, Situation Room Demo Mode, server-time countdown) in a published deployment and a GitHub repository.

## Goal

The live site reflects the latest frontend changes, and the codebase is mirrored to a user-owned GitHub repository for backup and portability.

## Plan

### Step 1 — Final verification

- Run a fresh build/typecheck pass to confirm no regressions from Sprint 2.5.
- Spot-check `/room`, `/first-congress`, `/invitation/$credential`, and `/admin/tickets` in the preview.

### Step 2 — Publish frontend changes

- Trigger a publish so the live URL picks up the new UI.
- Wait for the deployment to finish, then smoke-test the published URL for the same routes.

### Step 3 — Connect GitHub

- In the Lovable editor: Plus (+) → GitHub → Connect project.
- Choose or create the repository (suggested name: `prepareamerica` or `claimstore-briefing-room`).
- Verify the initial sync includes `src/`, `docs/`, `supabase/`, and migration files.

### Step 4 — Record the connection

- Update `README.md` with the published URL and repository URL.
- Add a brief entry to `docs/SPRINTS.md` for "Sprint 2.5 — Demo Mode & Invitation Ladder".

## Decision needed

What GitHub repository name do you want to use? If you don’t have a preference, I’ll suggest `prepareamerica`.
