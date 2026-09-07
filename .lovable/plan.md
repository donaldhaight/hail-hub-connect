# The Verify Workflow: from anonymous arrival to a role-wearing App Home

Yes — same page. And you already answered the hard question yourself: if onboarding
is identical for everyone, then the thing the Founder assigns on acceptance cannot
be a *job* like ISR. It has to be the one rung that every accepted person stands on.

## The correction: ISR is not the second role

Today the ladder reads Interested User → ISR, and that is why your thinking felt
like weeds. ISR is a job inside the marketplace. LC is a job inside the marketplace.
Neither is a stage of arrival. Putting one of them in the arrival path forces a
different onboarding per Group, which is exactly what you said you don't want.

Three rungs, and only three:

```text
 1. INTERESTED USER   anonymous · anchor + wallet · no form, no email
                      earned by arriving
 2. VERIFIED MEMBER   a real person the Founder accepted
                      earned by request + your acceptance
                      carries a Stakeholder Group as a TAG, not a door
 3. ENTITY ROLE       ISR · LC · PO · INSCO · IA
                      earned by certification inside the MarketApp
                      never granted, never requested
```

Everyone lands on the same App Home at rung 2. The Group tag changes what is in
the nav menu and what sits in the Tasks toll booth — it does not change the frame,
the onboarding, or the screens. That is how one onboarding serves seven Groups.

## The workflow, end to end

```text
  ANY FRONT DOOR
  Kimosabe.AI search · PrepareAmerica · a brand landing page
            │
            ▼
  [1] ANCHOR MINTED        opaque id + holding wallet, no email asked
      Interested User      earns JBK, spends it on entry
            │
            │  person decides to become known
            ▼
  [2] REQUEST ACCESS       name · org · title · Group they think they are
      (form we already     · anchor travels with it, so the wallet and its
       have live)            earn history are attached to the application
            │
            ▼
  [3] FOUNDER QUEUE        one table view, one row per human
      /admin/inbox         you see: the file, the wallet, the Group they chose
            │
            ├── DECLINE  ── recorded as an event, nothing else happens
            │
            └── ACCEPT ──► you set the Group tag (confirm or override their pick)
                           │
                           ▼
  [4] INVITATION SENT      email with a one-time credential
            │
            ▼
  [5] REDEEM               account created · wallet CLAIMED, not copied
      Verified Member      Group tag applied · two ledger entries written
            │
            ▼
  [6] APP HOME             one bar · Tasks toll booth · direct line to Kimosabe
                           footer: MarketApp · BooksForge · MusicApp · MovieApp · MyGPT.TV
            │
            │  optional, later, self-driven
            ▼
  [7] MARKETAPP / ROLE STORE
      fee ── 4 videos + quizzes ── ISR earned
      (LC is the same machine with a different curriculum + license check)
```

The single most important line on that diagram is step 5: the anonymous wallet is
**claimed, never duplicated**. That is the moment the anonymous person and the
known person become one file, and it is a ledger event with a timestamp — which
makes it demonstrable in the room.

## What each surface has to become

**The request form.** Today it asks for a "primary interest" written for the
briefing narrative. It becomes "which group do you belong to" using the seven
Stakeholder Groups, and it carries the anchor. Reachable from Kimosabe.AI, from
PrepareAmerica, and from every brand page — same form, one destination.

**The Founder queue.** Today it approves and declines. It gains one action:
**Accept and assign Group**, which in a single click sets the tag, writes the
event, and issues the invitation. Nobody self-certifies; nobody arrives without
passing your table.

**Redemption.** Today it applies a granted role. It applies the Group tag plus
Verified Member, and claims the wallet in the same transaction.

**Kimosabe.AI front page.** One search field, one button, no login, no nav. Typing
mints the anchor. It is the widest door and the emptiest screen in the system.

**App Home.** One shell for every role, exactly as you described it: single header
bar, nav menu upper left, Search, New (your "Add Record"), Role Settings with
Switch Roles, Account Settings. Tasks toll booth directly under the header. The
supported line to Kimosabe below that — one person, one channel, humans watching,
not a community. Footer as the app switcher.

**System Management System.** Not built now, but every list on the path above —
Groups, roles, curricula, quizzes, tasks, fees, feed rules — is stored as data
rather than code, so the SMS later becomes screens over tables you already have.
No rewrite, and that is the whole reason to hold the discipline now.

## Technical notes

- `app_role` gains `verified_member`; the seven Group values already exist in the
  enum, as do `isr` and the legacy tags. `lc` is added to `role_catalog` as an
  inactive entity role so the shape exists before the curriculum does.
- `briefing_requests` already carries `requested_role`, `anchor`, `granted_role`,
  `granted_at`, `granted_by` — the columns for this flow are in place. The work is
  the accept-and-assign action, the form vocabulary, and the redemption path.
- Wallet claim runs inside the redemption function as two append-only ledger
  entries; the ledger stays insert-only through server functions with no client writes.
- App Home ships as one shell component driven by a per-role nav and task
  configuration read from the database, not branched per Group in code.

## Order of work

1. Group vocabulary on the request form, anchor attached, reachable from every door.
2. Accept-and-assign in the Founder queue, with the event trail.
3. Redemption: Verified Member + Group tag + wallet claim in one transaction.
4. Kimosabe.AI front page and the anonymous ritual behind it.
5. The App Home shell.
6. MarketApp / Role Store with ISR, then LC on the same machine.

## Still open

- The exact label for rung 2. "Verified Member" is a placeholder; "Stakeholder"
  and "Citizen" both fit the mission better and cost nothing to choose now.
- Whether declined requests keep their Interested User wallet. My assumption: yes.
- The Tasks toll booth contents for a Group tag that has no marketplace job yet.
