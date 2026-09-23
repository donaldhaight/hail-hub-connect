# One Engine, Many Domains — The Preseason Door Doctrine

The founder asked how the preseason messaging at the key domains should be built and run,
and delegated the architecture call. Considering the intention of the PrepareAmerica site,
the business plans, and the messaging evolution ahead — launch 11-1-2026, Season 1 through
the 2-14-2027 Super Bowl Weekend Owners Meeting / Congress, Hurricane Season 2027, the start
of Season 2 — the recommendation is: **one engine, many domains.**

## The recommendation

Each venture domain serves its own Interest Door **from this platform**, at its own address.
claimstore.com shows the ClaimStore door as its front page. buddyclaim.com shows Buddy Claim.
A stranger never sees PrepareAmerica unless they go looking for the movement behind the door.
To the world: separate sites, separate voices, separate promises. Underneath: one engine, one
Interested User routine, one continuing person, one ledger.

Why not separate sites per domain:

- **The point of preseason is measurement.** Which message makes a stranger raise their hand.
  Seven separate stacks means seven separate analytics, seven hand-raise forms to reconcile —
  and the conversion destination is this platform anyway, so every hand raised elsewhere must
  be ferried here. Building the doors where the routine already lives removes the ferry.
- **The messaging will evolve for eighteen months.** Launch copy, mid-season corrections,
  post-Congress copy, hurricane-season copy, Season 2 copy. Doors here are content records
  with promise versions (the ClaimStore pattern) — a revision is an edit, not a rebuild.
- **Separation of expression does not require separation of infrastructure.** That was
  ADR-029's lesson: many intentional doors, one shared platform.
- The ventures may later spin out as their own properties when baselines support it
  (the Quantum Dashboard / portfolio valuation path). The registry already records each
  door's controlling source and promise version, so a future separation is a move, not an
  archaeology dig.

## What gets built

1. **Host-aware front door.** This platform detects which domain a visitor arrived on and
   renders that venture's canonical Door as the domain's front page. prepareamerica.com
   keeps the movement home exactly as it is. Paths stay shared: claimstore.com/architecture
   and prepareamerica.com/architecture reach the same page, because the architecture is
   shared. Only the front page wears the domain's face.
2. **Domain connections.** Each venture domain is connected to this project with **no
   primary domain set** — that is the setting that lets every domain serve at its own
   address instead of redirecting. The DNS steps are a founder action in project settings;
   I supply the exact records. Domain ownership itself stays on the register as a
   documentation gap from the package audit until it is written down.
3. **The season spine, written down.** A short strategy document mapping the messaging
   seasons to the doors: preseason (now → 11-1-2026) message-first preview copy; Season 1
   (launch → 2-14-2027 Owners Meeting / Congress); the turn into Hurricane Season 2027;
   Season 2. Each door's promise version is recorded per season, so we can always say which
   promise a person arrived on.
4. **Nothing publishes, nothing redirects, nothing retires.** All copy stays preview copy
   per the standing ruling. Buddy Claim still waits for the registry review per the
   founder's own sequencing — the first domain door is whichever venture the founder names.

## What this makes urgent (already on the register)

- **A78 — entry-context persistence.** With many real domains, "browser-only, not stored"
  stops being a posture and starts being a blindfold: we cannot learn which domain's
  message works if the arrival context dies in the visitor's browser. The narrow additive
  proposal (entry_door, campaign, interest, promise_version, referral source on the
  existing anchor/request record) is already drafted and awaiting authorization. Multiple
  domains are the strongest argument yet for approving it.
- **Domain inventory.** Which domains are owned, at which registrar, expires when — asserted
  in the package, never documented. One register line, founder-supplied facts.

## Register, board, law

- ADR-030: "One engine, many domains" — the decision, the alternative considered (separate
  sites per domain), and the consequences.
- docs/strategy/PRESEASON-DOMAINS.md: the doctrine and the season spine.
- New register lines mirrored to the board in the same turn: host-aware front door;
  domain inventory; season-spine promise versioning; the A78 argument restated.

## Held open

- Which venture goes first — the founder names it.
- Publishing and counsel review gates are untouched: nothing goes public without the
  founder's explicit instruction.

## Technical notes

- Host detection: read the request hostname server-side in the root route; map host →
  persona id in a small content table (same pattern as src/content/personas.ts); render the
  existing FrontDoor engine. No new schema, no migration, no RLS change. Unknown hosts fall
  through to the current home page.
- Domains: connected in project settings, each with root + www entries, none set primary.
- bunx tsgo --noEmit must pass; each mapped host verified to render its door at root in dev.
