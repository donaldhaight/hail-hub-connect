# Seven-Venture Handoff — Read-Only Audit and Recommended Sequence

Read in the prescribed order: session readme, Screen Book, Manual, the seven positioning
reports and instructions, the Ledger, the Book. Nothing built, nothing changed. This is the
first response the master handoff asks for.

## 1. What already exists that the seven Doors can reuse

There are **two different things in the codebase both called a door**, and the package treats
them as one.

- **The real Door.** One shared engine takes a persona record and renders the whole arrival:
  the ask box, the holding file, the wallet, the anchor that remembers an anonymous visitor
  between visits, and the entry payment. Only **Kimosabe** and **Buddy Claim** have persona
  records. Adding a persona is a content record plus a route — the engine already carries the
  work.
- **The brand card.** A separate, much lighter static page at `/b/<slug>` — a three-layer
  reveal (vertical, brand, domain), a fixed "request a private briefing" pair of buttons, and
  an architecture footer. **Six** of the seven ventures have one of these: SelfInsurity,
  Market Applications, Kimosabe, ClaimStore, Buddy Claim, RRCA (plus United Stakeholders, an
  eighth record not in the package's seven). These have no ask, no wallet, no attribution.

Also reusable and proven: the page shell, section and prose components; the shared head/SEO
helper every public route uses; and `/offer/<slug>` as the clean recent example of a simple
content-driven page with a not-found state.

## 2. Coverage, venture by venture

| Venture | Real Door | Brand card | Gap to a full preseason Door |
|---|---|---|---|
| SelfInsurity | no | yes | persona record + route + copy |
| Market Applications | no | yes | persona record + route + copy |
| Kimosabe | yes | yes | copy alignment only |
| ClaimStore | no | yes | persona record + route + copy |
| Buddy Claim | yes | yes | copy alignment; track param not wired |
| RRCA | no | yes | persona record + route + copy |
| National Roofing Army | no | **no** | everything — no route, no record, no palette, no mention anywhere in the repo |

United Stakeholders exists as an eighth brand card. The package's seven do not include it.
That mismatch needs a founder answer before the set is treated as closed.

## 3. Conflicts — stop-and-report, not chosen silently

1. **Two door systems, one word.** Every instruction says "create the Door using existing
   components." Six ventures already have a page at `/b/<slug>`. Building a second, richer
   page at `/<slug>` gives each venture two public addresses with different promises. Either
   the brand cards are retired into the new pattern, or the new Doors live under `/b/` and
   that route family grows an ask. This is a decision, not a preference.
2. **Attribution is promised and does not exist.** Every instruction requires
   `entry_door`, `campaign: preseason_2026`, `initial_intent`, `initial_role_hypothesis`,
   `primary_file_type`, `promise_version` to be preserved. Today the only thing that reaches
   the server is an opaque anchor string. No table anywhere records which door, persona,
   campaign or track a person arrived through. The instructions also forbid migrations. So
   the requirement and the boundary contradict each other: the honest outcome is
   browser-only context plus a written gap, which means **preseason attribution will not be
   measurable** unless the founder lifts the no-migration rule for that one column.
3. **Role-interest pickers.** Five instructions ask the Door to offer stakeholder choices
   (Property Owner, ISR, Licensed Contractor, Adjuster, Advocate, Creditor, Capital Partner,
   and more). The corpus rule is that the founder sets the Stakeholder Group at acceptance;
   nobody self-certifies. Interest-only capture is compatible, but it has nowhere to land —
   see conflict 2. It would be free text on a request, at best.
4. **Locked work order.** The corpus order is Connecticut Agreement → Records/Object Model →
   SiteBMS → JobNimbus → API/MCP. Seven Doors are not in that order. They are public
   expression, not architecture, so they can run alongside it — but the SelfInsurity
   instruction goes further and describes Property File onboarding screens (relationship,
   address confirmation, file-ready, walk-around). **That is the Property record**, which the
   corpus says does not exist and which the Records gate governs. As written, SelfInsurity
   jumps its gate.
5. **RRCA and capital language.** The RRCA Door asks for a "Potential Capital Partner"
   interest option while forbidding investment solicitation. That line is thinner than the
   document treats it and wants counsel's eye before it is public.
6. **The Ledger's own decisions are dated one day ago and unreconciled with ours.** DEC-031
   through DEC-040 restructure the corpus into four views. Our corpus has its own law,
   decisions and register. Nothing should be migrated by inference; the two need an explicit
   reconciliation ruling.

## 4. Missing evidence

- No verified inventory for National Roofing Army: no domain, no DBA proof, no members, no
  county data. The Door would be entirely a proposal.
- RRCA history is founder-reported throughout and carries the valuation baseline.
- Every SelfInsurity market observation is labelled a fact but sourced to "source candidates
  requiring formal registration" — none registered yet.
- Domain ownership for the seven brands is asserted, not documented.
- No promise-version or disclosure-approval record exists anywhere; the media plan requires
  one per artifact.

## 5. Dependencies before any Door is built

1. Founder ruling on conflict 1 (one door system, which one).
2. Founder ruling on conflict 2 (browser-only attribution, or one permitted column).
3. Counsel or founder sign-off on the disclosure paragraph for each of the seven.
4. A ruling on whether SelfInsurity ships as a **message-only Door** (hero, problem, property
   file described, trust, CTA) with the onboarding screens deferred to the Records gate.
5. Confirmation of the seven-vs-eight set (United Stakeholders).
6. Copy approval: every line in the instructions is drafted, none is approved public copy.

## 6. Recommended execution sequence

The package's own order (SelfInsurity first) is wrong for this codebase, because SelfInsurity
is the one venture whose instruction collides with a locked gate.

1. **Decide the two conflicts above.** Nothing else is worth starting first.
2. **Prove the pattern on ClaimStore.** Message-only, no record implied, the vision framing is
   already how the corpus talks, and it is the cleanest test of one shared template.
3. **Buddy Claim and RRCA** next — they validate advocacy and company framing and both already
   have surface to fold in.
4. **SelfInsurity**, message-only, once the Property File question is ruled.
5. **National Roofing Army** last of the market Doors, and only after the evidence gap is
   accepted as "proposed network, nothing verified" in visible language.
6. **Market Applications and Kimosabe** last, as the package says: they describe the shared
   layer and should be written after the others prove what is shared.
7. Reconcile findings into the Ledger and our register with matching IDs. No Quantum
   Dashboard work until the seven baselines are reconciled.

## 7. Database, auth and permission confirmation

No database, auth, role or permission change is required to build the Doors as message-only
pages with existing CTAs. **One precise gap:** preserving `entry_door` and `campaign` beyond
the browser requires a persisted column on the anchor or request record. Without it,
preseason attribution is a claim the system cannot support.
