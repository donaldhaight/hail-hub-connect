# After the First Canonical Door — Tell the Story, Then Take the Next Door

ClaimStore is live at `/claimstore` as the first canonical Door; the rulings are ADR-028;
the register and board carry A77–A81 and C57–C60. The founder published the work, went to
the Manual, and found nothing there — correctly. The Manual is its own corpus surface, and
no chapter has been written about this turn yet. This plan fixes that and lays out what
comes after.

## 1. Write the chapter — "The Door Became the Same Door" (Manual, next chapter)

A narrative chapter in the house style — prose, not a changelog — telling the story of the
seven-door handoff from the project's own perspective:

- The package arrived with two door systems; the audit found the difference between the
  conceptual architecture and the codebase before anything was built over it.
- The founder ruled: one canonical Door, the real engine; brand cards retire into redirects;
  interest is not authority; SelfInsurity is message-only; capital intake comes off RRCA;
  NRA stays visibly proposed; preview copy is not public copy.
- ClaimStore became the first canonical Door — the same ask-once arrival as every other
  door, with the positioning read beneath it, the five named pieces each carrying its own
  boundary line, and the disclosure that nothing here is approved public copy.
- The attribution question the code could not yet answer, and why the entry-context column
  is still only a proposal.
- What was deliberately not built: no Claim File, no workflow, no payments, no publishing.

Written for the Manual's C1 class. Filed with truth label FACT for what was built and
ruled, OPEN for what is still waiting. Rendered through the existing manual-chapter
machinery — one new chapter row, no code change.

## 2. File the history narrative

`docs/history/THE-FIRST-CANONICAL-DOOR-2026-09-22.md` — the companion narrative for the
corpus: how the project got from the nine-step Phase 1 funnel to a pattern where a new
venture is a persona record and a route, and why the reconciliation matrix (equivalent /
compatible / conflict / positioning-only) is the working method from here on. Documentation
only.

## 3. What comes next, in the founder's approved sequence

Listed, not built in this plan — each returns for review before the next begins:

1. **Buddy Claim** — the second canonical Door. Its persona and route already exist; the
   work is folding its positioning report into the same sections-beneath-the-Door pattern
   ClaimStore just established, with the attorney-of-record boundary line carried visibly.
2. **RRCA** — new persona record and Door, with "Strategic Partner or Advisor" in place of
   any capital-partner intake until counsel approves language.
3. **SelfInsurity** — message-only Door: hero, problem, Property File explanation, how it
   could work, trust and evidence states, Focused Future, CTA into the existing Interested
   User routine. Nothing touching a Property record — that gate is still locked.
4. **National Roofing Army** — Door built only as a visibly proposed readiness network: no
   members, territories, deployments, or national operation claimed.
5. **Market Applications, then Kimosabe** — aligned last, after the shared pattern is proven.

Held back until the founder says so: the `entry_context` migration (proposal is in the
corpus; awaiting "run it"), the `/b/<slug>` → canonical Door redirect flips, and any public
publishing of preview copy.

## 4. The four conflicts still awaiting a founder ruling

Carried as C57–C60 and restated in the chapter's closing register, not resolved by this
work:

- DEC-031/032 four canonical views vs corpus law (two systems claim to be the source of truth)
- DEC-034 persistent File pattern vs ADR-018 and the locked Records gate
- DEC-038 Market Applications operates the platform vs ADR-014's three administrations
- DEC-052 neutral DAO vs the capture-prevention structure (touches C48)

## Technical notes

- Manual chapter: one row in the existing `manual_chapters` table via the established
  chapter-writing path (title, part, body, draft_status, truth, confidentiality); surfaced
  on the Manual index and print edition automatically. No schema, no route, no UI change.
- History doc: single new markdown file under `docs/history/`.
- Nothing publishes; the public copy gate stands. Nothing touches the Quantum Dashboard.
- Register and board stay as they are — no new IDs needed for a chapter and a narrative;
  they close nothing that is open.
