# Reconciliation — the adaptive-interface clarification against the existing corpus

No code, schema, backlog, or corpus changes are proposed here. This is the comparison
you asked for, plus one recommendation about what to discuss next.

---

## 1. What already aligns

**One human, one file, many faces.** ADR-019 already rules that the front door is one
engine rendered through a persona registry, with one anchor, one holding wallet, one
append-only ledger, one guidance channel. Kimosabe and Buddy Claim run on it today, and
a person who opens a file at one door is recognized at the other. Your framing restates
what is already in force and extends it to future domains.

**Roles change the view, never the person.** The Shared Spine and the authority rule
(Role + applicable Relationship + applicable Assignment, record-scoped) already say
exactly this. Nothing about presentation may bypass permission.

**Memory changes with the role.** ADR-016's three partitions — anonymous session,
personal file, role/app scoped — are the memory half of your model, already written.

**Pages as containers, not fixed content.** The corpus already refuses to define what
Nav, Search, Add, Role Settings and Account Settings contain, calling them extension
points to be filled role by role. The role areas are deliberately empty rooms behind
proven locks. Your container definition is the missing shape of that decision, not a
contradiction of it.

**Preserve obligations exactly, let presentation evolve.** This is the existing rule
that history documents are never edited to match the present, and that legacy
ClaimExpress / Siteforum screens are guidance reconciled against the records model.

**PrepareAmerica as the institutional face.** Already the documented posture: a private
transaction memorandum, not a consumer app.

---

## 2. What conflicts

**"Fun, simple, viral" versus the stated red lines.** The Kimosabe positioning brief
declares, as decisions, that Kimosabe is *not a chatbot*, *does not perform personality*,
*never flatters*, and has *no wall of widgets*. A humorous or dramatic variant selected
by mood sits directly against "does not perform personality." Either the red line is
narrowed deliberately or the Perception Library is bounded to exclude it. This is a
decision, not a drafting problem.

**Presentation selected by mood versus the memory-partition rule.** Inferring mood,
moment or goal, and then adapting, is inference. If a mood signal learned in one role
shapes presentation in another, the partition has been crossed without the person's act.
The rule as written is absolute; adaptive presentation needs an explicit carve-out
stating which signals are session-local and which may persist.

**Variant siblings versus truth labels and confidentiality classes.** Every claim in
the corpus carries a truth label and every surface a class. A Perception Library holding
provocative and institutional versions of the same idea must carry both per variant, or
a C1 provocative rendering will eventually be served into a C0 surface. Band 3 makes
this sharper: an adaptive generator is the most likely thing in the system to leak
targeting logic in an "inviting" rendering.

**Personas activated by mission and mood versus the unanswered reveal question.** K3
asks when, if ever, a person learns Kimosabe and Buddy Claim are one scout. Many
personas make that question urgent rather than optional.

**Persona governance.** ADR-019 deferred a runtime persona table because two personas
fit in a typed file. "Future domains, apps, roles, missions and moods may activate
additional personas" is the condition that deferral named (K4).

---

## 3. What already exists that is now outdated

- `docs/law/ARCHITECTURE.md` route map still shows only the public briefing pages and
  the insider/admin layer. It does not include `/app`, `/roles`, `/kimosabe`,
  `/buddy-claim`, `/room`, `/ledger`, `/manual`, or the role areas.
- The same document describes the role enum as founder_admin and qualified_insider only;
  the catalog has since grown well past that.
- "Design posture" is written as if the whole system is understated and institutional.
  That is now true of PrepareAmerica specifically, not of the platform.
- K1 (does Buddy Claim get its own domain?) appears answered by your naming of
  buddyclaim.com; the brief still lists it open.
- The positioning brief treats Buddy Claim as *the* first sibling proving the pattern.
  Your clarification promotes personas to a standing mechanism.

---

## 4. What is missing

1. **The Progressive Knowledge Library itself.** Source / Pattern / Expression exists
   nowhere. The corpus stores Source and some Pattern in prose; there is no separation,
   no linkage from an expression back to the obligation it expresses, and no rule that
   an Expression may never contradict its Pattern.
2. **The Perception Library.** No variant model, no sibling preservation, no labeling by
   audience, persona, moment, mood, purpose, intensity — and no selection rule.
3. **The container definition as a first-class object.** Purpose, permitted roles,
   permitted records, permitted actions, tools, required context, presentation options,
   completion event. Today a page is a route file; none of those eight facets is declared
   anywhere a guide could read.
4. **The retrieval layer.** The corpus has a manifest and status headers so it *can* be
   chunked; nothing indexes, retrieves, or serves it, and no index inherits class today.
5. **Completion events for containers.** Tasks are currently onboarding tasks; the
   `State + Need → Task` engine is unbuilt, so a container has nothing to complete against.
6. **A persona registry with governance** rather than a typed content file.
7. **Selection provenance.** If the guide chooses a variant, the choice should be
   recorded — which variant, why, to whom — or adaptive presentation becomes the one part
   of the system with no audit trail.

---

## 5. What I recommend we discuss next

The locked work order still gates the object model: Connecticut Agreement → Records →
SiteBMS → JobNimbus → API/MCP. Nothing here changes that, and I would not open a
knowledge-library build ahead of it.

But this clarification is **presentation and knowledge architecture**, which sits in the
same lane as the Role Store paths — it touches how meaning is stored and rendered, not
what the operating objects are. It can be specified in parallel without jumping the gate,
provided we specify and do not build.

Three questions worth settling before anything is written down:

1. **How far does the red line move?** Is "never performs personality" narrowed to
   "never flatters and never fakes memory," so humor and drama become legitimate
   registers? Or is the Perception Library bounded to tone, length and framing only?
2. **Which adaptation signals may persist, and which are session-local?** Device and
   declared goal are easy. Mood and inferred intent are the ones that touch ADR-016.
3. **Does an Expression ever become authoritative?** My instinct is no — Source and
   Pattern bind, Expression never does, and any expression that cannot be traced to a
   Pattern is a defect. Confirming that is what keeps the governance intact underneath
   the fun.

If you agree with the direction, the next turn would be documentation only: an ADR for
the three-layer library and the container definition, a Perception Library specification
with its labeling and selection rules, an architecture refresh of the outdated sections
in §3, and the corresponding register and board lines. No application, database, or
schema change.
