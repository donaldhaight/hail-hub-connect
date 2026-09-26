# The Circle Conversation, Mapped Against the House

Documentation only. No changes to code, database, pages, the Screen Book, or the locked work order. This plan says where the Circle conversation lands in the project record, what the record already has, what is missing, and what becomes a requirement or an experiment.

## What the conversation is

A long exchange with Circle's built-in AI about the United Stakeholders Circle community: 19 of 20 spaces used, fewer than 10 members, 2 access groups, five space groups (Articles of Manifestation, History of Planet Earth, Stakeholder Groups (empty), Insurance Restoration Market (ten empty role courses), Training the AI). It also covers Lt Dan's Plan, the Prepare America book titles, a "Nobody Owns It" preface, a Chapter One ("The Excavation"), a current-state briefing, and the difference between Circle's two AI tiers. The outside reader's big finding: this is "one project in five layers," not five projects. That matches the three-layer convergence already in ADR-023.

## Already in the record (strengthened, nothing to change)

- **Lt Dan's Plan as the umbrella**: ADR-023 (proposed, not in force), and `LT-DANS-PLAN.md`.
- **Circle as an outside provider whose activity comes back as evidence**: A61, bounded by C51. `STAKEHOLDER-VIEWS.md` already lists "Circle space / course" as one form of a Stakeholder view.
- **Kimosabe as a guide, not a chatbot, with separate memory stages**: ADR-016 and the Kimosabe front door.
- **Seasons and the DH Method**: ADR-030 and `PRESEASON-DOMAINS.md`. The Circle AI calls the method sound and says it is not yet formalized. That's accurate.
- **"Nobody owns it" versus the LLC as container**: ADR-026 (No Conflicting Interest) and C48. The Circle AI found the same tension on its own. Under ADR-027, that's a convergence signal. It doesn't settle anything.
- **Interested User → ISR as the first certifiable role**: the Role Store and the Verify Workflow.
- **Referraltor**: ADR-017 (proposed). Circle confirms the older slug `lead-originator`. This is new evidence, not a new idea.

## What is missing or genuinely new

1. **The role list doesn't match.** Circle's ten role courses include four positions our record has never catalogued: Insurance Company Admin, Independent Adjuster, Building Material Supplier Admin, and Mortgage Company Admin. It also has "Applicant" and "ClaimBuddy" (which looks like an older name for Buddy Claim). Our Role Store has ISR (open), LC (catalogued), and no Property Owner. This is the third role list, next to the seventeen-role architecture and the stakeholder positions. It widens A91 ("four meanings of seven").
2. **Circle is a real, ongoing system that the corpus never lists.** It has a monthly plan, an admin limit (3 of 3), a space limit (19 of 20), and a Pledge Agreement post. None of this appears in the project record.
3. **A Pledge Agreement to the Rules already exists in Circle.** This may be an early version of the member agreement, which sits close to the Connecticut Agreement gate. We need to know its status before anything relies on it.
4. **Two AI tiers.** An admin assistant with memory, and up to ten role agents. The role agents have no memory, can't take actions, and need Circle Plus. That lines up with ADR-016's memory stages and the idea of one guide per role, but the record has no ruling on whether Kimosabe could ever run inside a provider. A 1,500-character agent instruction is a new kind of Expression, not a Pattern.
5. **The Circle AI has no written instructions.** The project has an agent brief (`AGENTS.md` and the project knowledge). Circle has none. That's a gap in how the two systems stay in step.
6. **The intellectual library** (Dr. Jiang, Tom McDonald, the ChatGPT research log from 2023–2024, the Manus material). It's valuable as origin evidence (ADR-026: origin is not compensation). For a member it's the wrong front door. It needs a classification label, not deletion.
7. **Band 3 exposure check.** Nothing in the conversation is Band 3, but it's a third-party AI with persistent memory of the project. What that memory is allowed to hold has never been stated.

## Proposed register and board lines (same IDs on both)

Requirements (A-series, continuing after A91):
- **A92** Add Circle to the provider inventory: plan, limits, spaces, access groups, owner. Founder-supplied facts. Class C2.
- **A93** Build a role crosswalk: Circle's ten courses, the Role Store, the seventeen-role architecture, and the stakeholder positions, in one table. Documentation only. It feeds A91.
- **A94** File the Circle conversation as Source in `docs/history/`, and file the "Nobody Owns It" preface and Chapter One as SOURCE, not canon.
- **A95** Write the Circle admin-AI brief: what it may remember and what it may never hold (Band 3, C3/C4). Draft only. The founder installs it.

Experiments (SIMULATION):
- **A96** One role course rehearsal: pick ISR, render the existing four modules as a Circle course, and see whether the activity can come back as evidence without crossing a memory partition. Nothing is written to our ledger.
- **A97** A Kimosabe-voiced agent instruction (1,500 characters) as an Expression under the Perception Library. It waits on Circle Plus, so it's a paper exercise first.

Questions for the founder (C-series, continuing after C61):
- **C62** Is the Circle Pledge Agreement in force, and how does it relate to the Connecticut Agreement?
- **C63** Do Insurance Company Admin, Independent Adjuster, Supplier Admin and Mortgage Company Admin become catalogued positions, or stay Circle-only for now? (Anything added to the catalog is a schema-level act for the founder.)
- **C64** Is ClaimBuddy retired in favor of Buddy Claim, or a separate thing?
- **C65** Is Circle the member-facing home for courses in Season 1, or only a rehearsal space? Either way, our platform stays the system of record.

## Where it lands in the Manual and Screen Book

- **Manual:** one new chapter, "The Other House," as narrative, class C1. It tells how an outside AI read the older Circle house and found the same shape we'd built here. It is labelled convergence, not proof.
- **Screen Book:** no new folders. Add a note to `12_Named_Not_Built` and the role branches recording that Circle has role-course shells for positions that have no folder yet. That goes in their open-questions files, pointing at C63.
- **No ADR.** Filing a source and opening questions is not a ruling.

## Technical notes

- Files: a new history source file, register rows A92–A97 and C62–C65 in `docs/work/OPEN-ITEMS.md`, matching rows on the backlog board, one `manual_chapters` row, and small open-questions edits in the Screen Book.
- No schema, migration, route, or UI change. The role catalog is untouched.
