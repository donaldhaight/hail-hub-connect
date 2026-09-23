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
| `/selfinsurity` | Planned — message-only, Property screens deferred behind the Records gate |
| `/rrca` | Planned — "Strategic Partner or Advisor", no public capital intake |
| `/national-roofing-army` | Planned — visibly proposed, no members, territories or coverage claimed |
| `/market-applications` | Planned — last, after the pattern is proven |
| `/kimosabe`, `/buddy-claim` | Existing Doors |
| `/b/<slug>` | **Kept.** The architectural expression of each venture; coexists with its Door, purposes declared in the registry |
| `/b/united-stakeholders` | Kept as the brand card — the intentional eighth portfolio container |

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
