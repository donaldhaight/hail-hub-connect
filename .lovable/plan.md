# Alignment Check — Reconciliation Response (no code changes)

Reviewed against the live codebase, routes, docs and database. Findings, then the decisions now settled.

## Aligned

**The spine exists end to end, in this order.**
- Interested User — public front door with a device anchor and holding wallet, no email required.
- Identity / File — sign-in or invitation redemption claims the existing file; the holding wallet merges into the account wallet rather than being replaced.
- Certification — role catalog, enrollments, modules, quiz progress; ISR is the first certifiable role.
- Roles — one person holds many role rows against one identity. Switching the active role is a display preference only; it creates no second identity and no second history.
- Permissions — a single access map answers "what does this person hold, and what does that open", read by both the menu and the server. Hidden menu items are not treated as the lock.
- Ledger — append-only, database-enforced, double-entry; earning, claim-on-merge and role fees already move through it.
- Tasks — a task strip on App Home, an all-tasks view, and a single-task view.

**The Universal App Home shell already has exactly the described bar:** nav menu upper left, quick search, Add, Role Settings with Switch Roles, Account Settings; below it the task notification area with a link to All Tasks; then the Kimosabe area; then the app switcher footer.

**Treating Nav / Search / Add / Role Settings / Account Settings as undefined extension points matches the current posture.** Each operating role also already has its own deliberately empty area behind the permission check, labelled as pending description.

## Different

1. **SAS A / SAS B / SiteBMS.** The repository does not merely omit the three-way model — in three places it asserts the opposite. ADR-013 says the SiteBMS concept is *replaced* by SAS A and SAS B, and the strategy and architecture documents repeat it. Two newer documents carry the corrected model. The repo currently contradicts itself. Now settled below: the three-way model supersedes ADR-013, which must be marked superseded rather than edited away. Note the corrected SAS B (platform / Human Blockchain administration and governance) is broader than the recorded one (pricing, funnels, books).

2. **Kimosabe on App Home is not conversational yet.** It is a curated set of written guidance entries filtered by the roles held — no input field, no memory, no reply path. The public front door is a search field that opens a file, not a chat. "Persistent conversational guide" is currently intent, not implementation. The "community of two" framing is the right target and should be recorded as such.

3. **The home is role-*filtered*, not role-*shaped*.** Every role sees the same body; only menu entries, guidance entries and the task set differ. That is a smaller claim than "shaped by their active Role", and it is worth deciding deliberately whether the body itself ever changes per role.

4. **Active role is stored in the browser, not on the record.** Sufficient today; it will not survive a device change, and it cannot feed server-side decisions once an operating role does real work. The CM decision below makes this load-bearing.

5. **LC is catalogued but closed.** LC exists as an entity role with a fee, marked inactive, with no curriculum behind it. ISR is the only live certification path.

## Missing

- **The Construction Manager perspective in full.** There is no construction-management *operating* role — the existing tag of that name is a stakeholder group label, not an operating role — and no SiteBMS surface.
- **The Records layer.** This is the one spine step with no implementation. No company, lead, opportunity, project, claim, contract, estimate, work order, invoice, payment, commission, approval or evidence records exist. Everything recorded today is narrative, ledger or onboarding.
- **Company as a first-class object, and project assignment.** Nothing connects a person to a company or a person to a project, so the authority rule decided below cannot yet be expressed at all.
- **Property Owner.** No PO role, and no mechanism for inviting a transaction participant into a single project.
- **The Draft Connecticut Agreement.** Named as the first live requirements source but not in the repository, so none of its rules are yet expressed as requirements.
- **The external-system boundary.** No ClaimExpress object model, no API/MCP surface, no JobNimbus integration point or identifier mapping.
- **Task generation from workflow.** Tasks are a fixed onboarding set. Nothing yet emits a task from an operating event.

## Decisions now settled

1. **Construction Manager is one operating role.** A single entity role alongside ISR and LC — not a family. Any narrower duties (estimating, production, collections) are project assignments or company relationships, not separate roles.
2. **SiteBMS lives inside this application, on the shared record.** It is an operating area of this app, not a separate surface reading through the API. The next build is a route area, not an integration boundary.
3. **JobNimbus is the Phase 1 system of record for existing job and project data.** SiteBMS decides what must happen and records the events; JobNimbus holds the operating job data during Phase 1. Where they disagree about existing job data, JobNimbus wins. This implies a stable identifier mapping and an explicit list of fields we mirror versus fields we only reference.
4. **Authority = Role + Company Relationship + Project Assignment.** All three must be true for an operating permission. This adds two axes the permission model does not have and makes the access map insufficient on its own — permissions become record-scoped, not menu-scoped.
5. **The three-way SAS A / SAS B / SiteBMS model is authoritative** and supersedes the older "SAS A and SAS B replace SiteBMS" interpretation. ADR-013 gets superseded by a new decision record; the strategy and architecture sections are corrected to match.

## What follows

The Records layer and the Connecticut requirements, in that order. Two consequences worth stating before that work begins:

- The authority rule means the Records layer cannot be drawn as tables alone. Company relationship and project assignment must be designed alongside the objects they govern, or every access rule written afterwards becomes a retrofit.
- The Connecticut Agreement should enter the repository as a requirements source before the objects are drawn, so the object model is derived from the real rules rather than reconciled to them later.
