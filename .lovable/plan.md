# Alignment Check — Reconciliation Response (no code changes)

Reviewed against the live codebase, routes, docs and database. Findings only.

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

1. **SAS A / SAS B / SiteBMS.** The repository does not merely omit the three-way model — in three places it asserts the opposite. ADR-013 says the SiteBMS concept is *replaced* by SAS A and SAS B, and the strategy and architecture documents repeat it. Two newer documents carry the corrected model. The repo currently contradicts itself and must be reconciled by a superseding decision record, not a quiet edit. Also note the corrected definition of SAS B (platform / Human Blockchain administration and governance) is broader than the recorded one (business administration: pricing, funnels, books).

2. **Kimosabe on App Home is not conversational yet.** It is a curated set of written guidance entries filtered by the roles held — no input field, no memory, no reply path. The public front door is a search field that opens a file, not a chat. "Persistent conversational guide" is currently intent, not implementation. The "community of two" framing is the right target and should be recorded as such.

3. **The home is role-*filtered*, not role-*shaped*.** Every role sees the same body; only menu entries, guidance entries and the task set differ. That is a smaller claim than "shaped by their active Role", and it is worth deciding deliberately whether the body itself ever changes per role.

4. **Active role is stored in the browser, not on the record.** Sufficient today; it will not survive a device change or feed server-side decisions once an operating role does real work.

5. **LC is catalogued but closed.** LC exists as an entity role with a fee, marked inactive, with no curriculum behind it. ISR is the only live certification path.

## Missing

- **The Construction Manager perspective in full.** There is no construction-management *operating* role — the existing tag of that name is a stakeholder group label, not an operating role — and no SiteBMS surface.
- **The Records layer.** This is the one spine step with no implementation. No company, lead, opportunity, project, claim, contract, estimate, work order, invoice, payment, commission, approval or evidence records exist. Everything recorded today is narrative, ledger or onboarding.
- **Company as a first-class object.** Nothing connects a person to a company, and nothing expresses Contractor of Record, project responsibility, or authority delegated by a company rather than by a role.
- **Property Owner.** No PO role, and no mechanism for inviting a transaction participant into a single project.
- **The Draft Connecticut Agreement.** It is named as the first live requirements source but is not in the repository, so none of its rules are yet expressed as requirements.
- **The external-system boundary.** No ClaimExpress object model, no API/MCP surface, no JobNimbus integration point.
- **Task generation from workflow.** Tasks are a fixed onboarding set. Nothing yet emits a task from an operating event.

## Questions — needed before the next build step

1. **Is the Construction Manager one role or a family?** One CM operating role, or CM plus coordinator, estimator, production, collections? This determines whether we add one entity role or a role group with internal permissions.

2. **Does SiteBMS live inside this application on the shared record, or beside it as its own surface reading through the API?** The answer decides whether the next build is a route area or an integration boundary.

3. **When SiteBMS and JobNimbus disagree about a project, which one is the system of record?** Needed before any object model is drawn, because it decides which side owns state transitions and which side receives them.

4. **Does authority flow from company membership as well as from role?** If an LC belongs to a company and a CM manages that company's projects, permissions need a relationship axis the current model does not have.

5. **Confirm the correction is authoritative** so the contradicting decision record can be superseded rather than left ambiguous.
