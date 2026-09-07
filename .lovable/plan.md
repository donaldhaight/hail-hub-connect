# Next Sprint — Finish the Header Promises, Then Open the Venture File

The cleanup sprint landed: one request form, one founder queue, founder tools
inside App Home, task pages. Two things remain from that plan. This sprint
closes them.

---

## Part 1 — Make the header honest (was A4)

The App Home bar shows Search, New, Role Settings and Account. Today some of
those are thinner than they look. Each becomes real or is removed:

- **Search** — one server-side search over what the signed-in person may read:
  their requests, tasks, manual chapters, dossiers; for you, the people queue.
  Results as a plain list grouped by kind, no new page design.
- **New** — real actions only: new request record, new invitation, new manual
  chapter, new backlog item. Anything not real is removed, not stubbed.
- **Role Settings** — keeps Switch Roles, adds a plain list of the roles you
  hold and what each one opens.
- **Account** — a real page: your identity, email, wallet balance, sign out.
  It currently points at the ledger, which is the wrong destination.

## Part 2 — Task strip polish

The tasks pages exist. Two small additions make them teach instead of just
list:

- Every task carries a one-line **why** — why this task exists for this person
  right now — and a flag for whether it can be dismissed.
- First visit to App Home shows a short welcome line, dismissed once, stored
  per person (not a ledger concept).

## Part 3 — Kimosabe.AI business plan (B1)

The first of the four venture-file documents, written as a chapter in the
Owner's Manual where the rest of the record lives:

- What Kimosabe.AI is and the problem it owns
- Who pays and the revenue model
- Its relationship to ClaimStore, RRCA and PrepareAmerica
- The competitive frame
- The honest question: standalone venture versus permanent front door

Carries its Truth Label and confidentiality class like every other chapter.
Written alone, reviewed alone — brand definition, PRD and SRS follow in their
own sprints, one at a time.

---

## Order of work

1. Account page (smallest, fixes a wrong link)
2. Search
3. New menu
4. Role Settings list
5. Task why/dismissible + welcome line
6. B1 business plan chapter

## Technical notes

- Search is one server function under `requireSupabaseAuth`, reading only
  tables existing policies already allow — no new indexes.
- Account is a new route under `_authenticated/app/`; the header Account item
  points there.
- Task `why` and `dismissible` are fields on the derived task shape in
  `src/lib/apphome.server.ts` — no schema change; dismissal persists in
  `app_task_states` (already exists, per-user, RLS on).
- Welcome dismissal keyed by user id in localStorage.
- B1 is a `manual_chapters` row authored through the existing editor, in the
  Kimosabe.AI part.
