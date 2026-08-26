# Credentials: who gets in, what they see

## The answer to your question first

Right now the system is **binary**, not tiered.

The database knows nine tags: `founder_admin`, `counsel`, `rrca_exec`, `investor_prospect`, `sponsor_prospect`, `strategic_partner`, `specialist_advisor`, `system_auditor`, `qualified_insider`.

But the app only enforces two of them. Every gate reads: "are you founder_admin, or are you qualified_insider?" The other seven exist in the enum and are never checked anywhere in the code. And today exactly one tag is actually assigned to anyone — your `founder_admin`. So the truthful statement is: **you, and then everyone else who gets through the door sees the identical room.** Nobody is currently holding one of the seven audience tags.

Vetting works (nothing is self-serve — a person only gets a role by your invitation), but differentiation does not.

## What this plan builds

### 1. Make the seven tags real

A single access matrix in code — one file, one table — mapping each tag to what it may open:

```text
tag                  room  economics  canvass  ledger  manual  dossiers  admin
founder_admin         all      all      all     all     all      all      yes
rrca_exec             yes      yes       —      yes     yes      yes       —
investor_prospect     yes      yes       —      read    yes      tier2     —
sponsor_prospect      yes    pricing     —       —      yes      tier2     —
strategic_partner     yes      yes       —       —      yes      tier2     —
counsel               yes       —        —       —      yes      tier1     —
specialist_advisor    yes      yes       —      yes     yes      tier1     —
system_auditor        yes      yes      yes     yes     yes       —        —
qualified_insider     yes       —        —       —      yes      tier1     —
```

(Starting proposal — you set the final grid; it is data, not hardcoded logic.)

Gates stop asking "founder or insider" and start asking "does this tag grant this surface."

### 2. Roster page at `/admin/roster`

One screen where you see every person who has ever been let in: name, email, tag(s), when granted, by whom, last seen, which surfaces they have opened. You grant a tag, change a tag, or revoke access from that screen. Nothing else in the system can grant a tag.

### 3. Tag the invitation, not the person after the fact

When you issue an invitation, you choose the tag it carries. Redemption assigns exactly that tag. No invitation can be issued without one. This is where your "nobody gets through that I don't vet" becomes structural rather than a habit.

### 4. Audit trail

Every grant, change, and revoke writes a row: who did it, when, previous value. The founder console shows it. This is the same discipline as the variance ledger — the access history is itself a tracked variance.

### 5. Calendar correction

Anything computing a countdown re-reads from `src/content/calendar.ts` against real current date (today: Aug 26, 2026 — 67 days to the First Congress). Any place showing a stale or wrong interval gets fixed in this pass.

## Technical notes

- New table `role_grants` (audit log) plus columns on `insider_invitations` for the tag carried; RLS founder-only, explicit GRANTs.
- New `src/lib/access.ts` holding the matrix, imported by both server functions and route gates so client and server cannot drift.
- Existing `has_role` stays; the guard helpers in `src/lib/*.functions.ts` change from role-name checks to matrix checks.
- Route gates under `_authenticated/` read the same matrix.
- Migration seeds the matrix defaults above as literal rows where the grid is data.

## Out of scope

- Self-service signup of any kind. There is none and there will be none.
- Per-record sharing (person-by-person exceptions). Tags only, for now.
