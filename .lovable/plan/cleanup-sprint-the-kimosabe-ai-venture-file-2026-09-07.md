# Cleanup Sprint + the Kimosabe.AI Venture File

Two halves. First we clean up what exists so nothing rots while we plan. Then we
write Kimosabe.AI as its own venture, in full.

---

## Part A — Clean up the front door and the founder's desk

### A1. One request form

Today there are two separate doors that ask overlapping questions: the private
briefing request and the PrepareAmerica invitation request. Between them they ask
the same person to classify themselves three different ways — "primary interest"
(6 options), "which group do you belong to" (8 options), and a conference
"category" (6 options).

We collapse this to one form asking only facts a person cannot get wrong:

- Full name
- Institutional email
- Organization
- Title
- What are you asking for? — a private briefing, a conference invitation, or both
- Context (optional, free text)
- The existing acknowledgement

Self-classification is removed entirely. **You** set the group at acceptance.
Both existing URLs keep working and lead to this one form; the conference page
keeps its own framing above the form but posts to the same place.

### A2. One founder queue

Today the requests live in Inbox and the group-granting buttons live in Roles.
They merge into a single table — one row per human — showing:

- Who they are and what they asked for
- The anonymous file and wallet balance they arrived with
- What has already happened to them (invited, redeemed, declined)
- One control: choose the group, then **Accept & invite**, or **Decline**

Conference seat handling, itinerary, referrals and invitations stay where they
are; only the request triage merges. Nothing already recorded is lost — the old
tabs become views of the same rows.

### A3. Founder tools move into App Home

The founder links come out of the public site menu and live in the App Home
navigation, where role-shaped menus already exist. Signed out, the public site is
just the public site.

### A4. Make the header honest

- **Search** — searches your own material: requests, people, tasks, manual
  chapters, dossiers. Results as a simple list, not a new page design.
- **New** — real actions only: new request record, new invitation, new manual
  chapter, new backlog item. Anything not real is removed rather than stubbed.
- **Role Settings** — keeps Switch Roles, adds a plain list of the roles you hold.
- **Account Settings** — a real page: your identity, email, wallet, sign out.
  Currently it points at the ledger, which is the wrong destination.

---

## Part B — The Kimosabe.AI venture file

Written as documents in the Owner's Manual, so they live where the rest of the
record lives and can be revised in place. Four artifacts, in this order:

1. **Business plan** — what Kimosabe.AI is, the problem it owns, who pays, the
   revenue model, its relationship to ClaimStore/RRCA/PrepareAmerica, the
   competitive frame, and the case for it standing alone versus staying the front
   door.
2. **Brand definition** — name, promise, voice, the one-field discipline, what
   Kimosabe will never be (not a community, not a chatbot novelty).
3. **PRD** — the product: the anonymous arrival, the file and wallet, the
   supported channel, the App Home, the role marketplace, the app switcher. Each
   feature with its user, its job, and its success condition.
4. **SRS** — the system: identity and anchors, the ledger and its append-only
   rule, roles and grants, the task engine, integration boundaries (the
   ClaimExpress protocol as an API surface), and the redaction rules that keep the
   targeting engine out of view.

Each carries its Truth Label and confidentiality class as the rest of the record
does. Written one at a time, reviewed one at a time.

**The risk, stated plainly:** four months before the conference, a full venture
file for a second brand is a real detour. The mitigation is that Part A ships
first and Kimosabe's current front door is left exactly as it is — we plan
around it, not on top of it.

---

## Order of work

1. A1 — one form (form, schema, both entry points)
2. A2 — one queue (merge triage, keep every existing record)
3. A3 + A4 — nav move, Search, New, Role Settings, Account page
4. B1 — business plan
5. B2 — brand definition
6. B3 — PRD
7. B4 — SRS

## Technical notes

- `briefing_requests` already carries `interest`, `requested_role`, `anchor`,
  `granted_role`; `requested_role` becomes founder-set only, and `interest`
  narrows to the ask (briefing / conference / both). No column drops — existing
  rows keep their values.
- `conference_applications` keeps its seat lifecycle; new conference asks create
  the briefing request row and link through the existing
  `briefing_request_id` foreign key.
- The merged queue is a new founder route reading both tables through
  `requireSupabaseAuth` server functions; `/admin/inbox` and `/admin/roles`
  redirect to it.
- Search is one server function over the tables the signed-in person may read,
  respecting existing policies — no new indexes in this pass.
- Account settings is a new route under `_authenticated/app/`.
- The Kimosabe documents are `manual_chapters` rows in their own part, authored
  through the existing editor.
