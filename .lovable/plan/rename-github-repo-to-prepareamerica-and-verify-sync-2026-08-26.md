# Rename GitHub repo to `prepareamerica` and verify sync

The project is currently synced to `https://github.com/donaldhaight/hail-hub-connect.git`. We want the repository name to match the mission brand: `prepareamerica`.

## Goal

- The GitHub repository is renamed to `prepareamerica`.
- Lovable Git sync points to the new URL.
- Documentation (`README.md`, `docs/SPRINTS.md`) reflects the new repository URL.
- A quick verification confirms the sync includes `src/`, `docs/`, `supabase/`, and migration files.

## Plan

### Step 1 — Verify current sync contents

- Read the current GitHub repository tree for `donaldhaight/hail-hub-connect` to confirm `src/`, `docs/`, `supabase/`, and migration files are present and up to date.
- Report the latest commit hash and which directories were included.

### Step 2 — Rename the repository on GitHub

- In GitHub, go to `donaldhaight/hail-hub-connect` → Settings → General → Repository name.
- Rename to `prepareamerica`.
- GitHub will automatically redirect the old URL, but we will update Lovable to use the canonical new URL.

### Step 3 — Update Lovable Git sync URL

- In the Lovable editor: Settings → Git → update the repository URL to `https://github.com/donaldhaight/prepareamerica.git`.
- Trigger a sync to confirm the connection still works under the new name.

### Step 4 — Update project documentation

- Update `README.md`: replace the placeholder `<repository-url>` and any references to `hail-hub-connect` with `prepareamerica`.
- Update `docs/SPRINTS.md` Sprint 2.5 entry to record the actual repository name.

### Step 5 — Re-verify sync after rename

- Confirm the latest commit on `prepareamerica` matches the project state.
- Confirm the key directories are still present.

## Out of scope

- No code changes, no new features, no publish or domain changes.

## Decision needed

None — proceed once you approve the plan. You will need to perform the GitHub rename in Step 2; I can do the verification and doc updates.