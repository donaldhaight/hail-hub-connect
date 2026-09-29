# Seven Doors — Canonical Route Plan, Attribution, and Decision Reconciliation

> **Status:** strategy · **Class:** C2 · **Written:** 2026-09-22  
> Companion to the founder rulings of 2026-09-22 (ADR-028) and the archived plan
> `.lovable/plan/seven-doors-rulings-accepted-route-plan-attribution-proposal-2026-09-22.md`.  
> Everything described as copy here is **preview copy**. Nothing is approved for publication.

## 1. The Door engine, and the surfaces beside it

> **Correction, 2026-09-23 (ADR-029).** This section originally said the brand cards were
> retired as independent destinations. That was a misreading of the founder's intention and
> is superseded. Nothing is retired, redirected or renamed. `/b/<slug>` is the architectural
> expression of a venture; the Door is its market expression. Both are valid and both point
> into the same Interested User routine. See the Surface and Door Registry at
> `/admin/surfaces` and `docs/history/MANY-DOORS-ONE-PLATFORM-2026-09-23.md`.

Two public systems exist: the Door engine (ask box, holding file, wallet, anchor) serving
`/kimosabe`, `/buddy-claim` and `/claimstore` from persona records, and the brand card at
`/b/<slug>` serving the architecture. They perform different jobs.

The engine carries optional positioning `sections` beneath the door — one new field on the
persona shape, no second component family. Where a venture speaks through both a card and a
Door, the registry declares how the two differ so they do not appear to contradict.

| Route | State |
|---|---|
| `/claimstore` | **Built 2026-09-22** — the first preseason Interest Door, message-only |
| `/buddy-claim` | **Built 2026-09-23** — second canonical Door |
| `/rrca` | **Built 2026-09-29** — "Strategic Partner or Advisor", no public capital intake |
| `/selfinsurity` | **Built 2026-09-29** — message-only, Property screens deferred behind the Records gate |
| `/national-roofing-army` | **Built 2026-09-29** — visibly proposed; a named section states that no members, counties, deployments, territories or coverage are claimed |
| `/market-applications` | **Built 2026-09-29** — last, as ruled. Neutrality stated as a constraint; legal shape explicitly not asserted |
| `/kimosabe` | Existing Door — the center of the geometry |
| `/b/<slug>` | **Kept.** The architectural expression of each venture; coexists with its Door, purposes declared in the registry |
| `/b/united-stakeholders` | Kept as the brand card — the intentional eighth portfolio container |

The canonical Door sequence is complete as of 2026-09-29 (register A79, closed). Every Door
is preview copy. None is approved for publication.

Two asymmetries worth naming rather than smoothing over. **National Roofing Army has no
brand card** — it holds no position in the seven-position Human Blockchain geometry, so
unlike every other Door it has one surface rather than two (**C66**, related to C49).
**Market Applications has both**, and they say different things on purpose: the card states
the Tech position in the architecture, the Door makes the market case.

Nothing is retired. Every surface declares its purpose instead (ADR-029).


## 2. Attribution — proposed, not implemented

The `entry_context` column proposed for `ledger_wallets` and `briefing_requests` is **not
authorized and has not been run**. Until it is, arrival context is captured in the browser
(`src/lib/entry-context.ts`), shown to the person on screen as *captured · not stored*, and
carried into a request as free text in the existing `context` field.

Captured fields: `entry_door`, `campaign`, `initial_intent`, `interest`, `promise_version`,
`referral_source`, `captured_at`. No name, email, address, IP or device data. The interest
value is a self-declared marketing string and never a role, credential, group or permission.

## 3. Decision reconciliation — package DEC-031–056 against the corpus

No renumbering, no merging.

**Equivalent.** DEC-033 ≈ ADR-019 · DEC-037 ≈ ADR-021/ADR-022 · DEC-044 ≈ ADR-016 ·
DEC-043 ≈ the standing authority rule · DEC-056 ≈ ADR-012.

**Compatible.** DEC-035, DEC-036, DEC-039, DEC-040, DEC-041, DEC-042, DEC-045–048,
DEC-049, DEC-050, DEC-053–055.

**Conflicts — founder ruling required (C57–C60).**

1. DEC-031 / DEC-032 four canonical views vs the corpus law, ADR register and this
   register. Two governance systems now claim to be the source of truth.
2. DEC-034 persistent File pattern vs ADR-018 and the locked work order — the Records /
   Object Model has its own gate and is not modelled ahead of it.
3. DEC-038 Market Applications operates the platform, Kimosabe is its layer vs ADR-014's
   three administrations and the unsettled legal shape of Market Applications.
4. DEC-052 neutral DAO is governance, not exemption — touches the capture-prevention
   structure and the standing NCOI conflict (C48).

**Positioning-only.** DEC-046 domain routing · DEC-051 territorial participation
hypothesis · DEC-054 diligence sequencing · every evidence, hypothesis and source register.

## 4. ClaimStore, as built

`/claimstore`, palette `teal`, promise version *ClaimStore Door v0.1 — 2026-09-22*.

- The canonical Door engine unchanged: ask once, a file opens, wallet and append-only ledger.
- Sections beneath it: the problem; the market pattern (ClaimStore, ClaimExpress, ClaimsBank,
  ClaimLoan, ClaimCoin — each with its boundary line in the same breath); the ClaimExpress
  sequence; interest selection; Focused Future, labelled FUTURE; arrival context; the CTA into
  the existing Interested User routine; the disclosure.
- Interest selection carries into the request's free-text context with the visible line that
  it creates no role, credential, group or permission.
- Not built: Claim File, workflow, payments, migrations, roles, permissions, publishing.

## 5. The last two Doors, as built (2026-09-29)

**National Roofing Army** — `/national-roofing-army`, palette `steel`, promise version
*National Roofing Army Door v0.1 — 2026-09-29*. The hard part of this Door is what it must
not say, so it says it in a section of its own: no members, no verified counties, no
deployments, no territories available or reserved, no coverage map, no national operation.
The proposal itself is readiness before the storm, a record the contractor keeps, and
coordination that no carrier, supplier or platform owner controls — each carrying its own
boundary line. Interest options are contractor, crew lead, supplier, observer, and the note
says plainly that none of them is a membership or a territory.

**Market Applications** — `/market-applications`, palette `electric`, promise version
*Market Applications Door v0.1 — 2026-09-29*. The technology administration of ADR-014,
told as a market case: six systems hold six versions of the same job, and the usual fix
solves coordination by creating capture. The four items are one continuing record,
append-only history, integration rather than replacement, and neutrality as a constraint —
the last of which states the NCOI test (ADR-026) in market language while saying outright
that the legal shape of Market Applications is unsettled and is not asserted here.

Both Doors run the unchanged engine, capture arrival context in the browser only, and route
into the existing Interested User routine. No schema, migration, role, permission or
publication.

