# Sprint 2.9 — The Role Spine: Request Access, the Role Store, and Switch Role

Steps 1–3 of the ledger plan are live. This sprint builds steps 4–6: the Siteforum
provisioning flow re-expressed here, one certifiable role (ISR), and role-aware
context so Kimosabe always knows which role a person is wearing.

## 1. Request Access, with a role chosen

Today the public form asks for a "primary interest" from a list written for the
briefing narrative. It becomes a **role request**, using the Stakeholder Group
vocabulary, with the Interested User file attached.

```text
Kimosabe file (anchor + wallet)  ──►  Request Access (role chosen)
                                             │
                                             ▼
                                  Founder queue — full file attached
                                             │
                                             ▼
                                    Role granted by you alone
```

- Role choices: Industry Observer, VentureTech, SystemsTech, LegalTech,
  InsureTech, FinTech, Construction Management, Business Development.
  Interested User is never requested — it is provisioned on arrival.
- The request carries the anchor when the person came through `/kimosabe`, so the
  wallet, its balance, and its earn history travel with the application.
- Nobody self-certifies. The founder inbox stays the only path to a role.

## 2. The founder queue grants roles

`/admin/inbox` gains a Grant Role action per request: pick the role, and on grant
the system writes the role row, marks the request, and records the decision as an
event. Existing invitation flow is reused for the email side; redemption now
assigns the granted role instead of only qualified_insider.

## 3. Role Store and ISR certification

A `/roles` surface listing role cards. Phase 1 exposes exactly one certifiable
role: **ISR**.

```text
Role Card ──► fee ──► video 1 → quiz ──► ... video 4 → quiz ──► sign in ──► App Home
```

- Fee is recorded as a ledger entry (`spent:certification`), not a payment
  integration — checkout wiring comes later.
- The four videos and their quizzes are **stored as data**, so a future SiteBMS
  owns them without a rewrite.
- Completion writes the ISR role and lands the person on their role App Home.

## 4. Switch Role and role-aware context

- A person can hold several roles. A role switcher in the header sets the active
  role; the active role is persisted and read by every surface.
- Kimosabe reads the world through the active role only — it does not cross roles.
- Anonymous visitors keep the Interested User file and wallet, unchanged.

## Technical notes

- New tables: `role_requests` (or reuse `briefing_requests` with a `requested_role`
  column plus `anchor`), `role_catalog`, `role_modules` (video + quiz as data),
  `role_progress`. Each gets GRANTs and RLS in the same migration: public insert
  for requests, founder-only reads, self-scoped progress.
- `app_role` enum gains the Stakeholder Group values plus `isr`; existing values
  stay so nothing in place breaks.
- Grants and certification completions are server-only writes through
  `createServerFn` with `requireSupabaseAuth`; the client never proposes a role.
- Active role lives in a small `useActiveRole` hook backed by the user's role rows,
  validated server-side on every protected read.
- The certification fee posts to the existing append-only ledger, so the money
  story and the role story share one spine.

## Order of work

1. Role catalog + enum migration.
2. Request Access with role selection, anchor attached.
3. Founder queue grant action + invitation redemption assigning the granted role.
4. Role Store, ISR modules as data, progress and completion.
5. Switch Role + role-aware surfaces.

## Still open

- The ISR fee amount, and whether it is JBK, dollars, or both.
- Video sources for the four ISR modules — placeholders until you supply them.
- Whether Industry Observer is grantable or purely a tag.
