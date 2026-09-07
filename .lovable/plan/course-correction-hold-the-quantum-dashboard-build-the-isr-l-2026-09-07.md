# Course Correction: Hold the Quantum Dashboard, Build the ISR/LC Spine

You are not going off course. What you are describing is a re-ordering, not a
detour — and the order you are proposing is the correct one. This document does
two things: it retraces how the thinking got here, and it fixes the new
sequence in writing so the pause is a decision on the record rather than a
drift.

## Part 1 — Where my head is, message by message

**The front door.** You opened with Barry Diller and Y Combinator: a network of
operating companies with one understated door in front of them. I read that as
an instruction about restraint. The site's job was never to sell — it was to
qualify, filter, and hold the serious visitor long enough to be recognized. So
Phase 0 became a public surface with truth labels and confidentiality classes
attached to every claim, because the audience you want is the audience that
punishes overstatement.

**The private side.** When you asked where sign-in was, the real question
underneath it was: what happens after someone is recognized? That produced the
insider room, the dossiers, the invitation tokens, and the read-depth
instrumentation. The organizing idea was that recognition is earned in stages
and every stage leaves a record.

**The seven groups.** The reveal order — Foundation, Tech, Legal, Insurance,
Banking, Construction, Kimosabe at center — told me the platform is not one
product with modules. It is seven doors with one hallway. Everything after that
was built so a surface can show a different face to a different group without
forking the codebase.

**PrepareAmerica and the two Congresses.** The mission frame reset the altitude:
fix the insurance restoration transaction, prove the pattern generalizes. Two
Congresses gave the work dates to answer to, and the season ladder gave the
dates a structure.

**Mission Headquarters and the 10% rule.** This was the biggest instruction you
have given me. It changed my posture from assistant to co-founder held to an
estimate. Everything since is priced, logged, and measured against variance,
because the thesis — that agent work collapses cost — is only worth anything if
we are the first ones audited by it.

**The Turn.** The saga clarified the architecture: before AI, you were the
integration function. The whole build since is an attempt to move that function
out of your head and into a system that can hold it. Kimosabe is the name of
that function once it lives outside you.

**The Situation Room.** Weather-channel-before-a-Cat-5 crossed with
election-night coverage. Seven lenses, one console, a variable registry so every
number on screen can be traced to a source. Built to be driven by someone who is
not you.

**Your last two messages.** You looked at what the room would actually reveal
and flinched — correctly. And then you noticed that the thing you personally
need next is not a dashboard at all. That brings us here.

## Part 2 — What you just worked out (and why it is right)

Three realizations, and they resolve into one instruction.

1. **The targeting engine is the trade secret, not the demo.** Storm overlay,
   kill zone, fringe ZIPs, carrier routes, ghost profiles, multi-channel
   outreach — that is the machine that makes the network valuable. Showing it
   fully on 11-1-2026 teaches a room full of smart competitors how to build it.
   It has to exist; it does not have to be visible.

2. **Kimosabe and the Interested User only pay off if there is somewhere to
   land.** Onboarding a person into a wallet and a role is a ritual with no
   destination unless a real operating role is waiting on the other side.

3. **The role you actually need staffed is ISR — and behind the ISR, the LC.**
   That is RRCA's need, today, not a 2027 need.

The instruction that falls out: **hold the Quantum Dashboard at its current
line, and build the ISR/LC activation spine plus the ClaimExpress protocol
underneath it.**

## Part 3 — The new sequence

```text
NOW      Interested User ──► Kimosabe ──► ISR certification ──► ISR App Home
          (anonymous)         (ritual)     (fee, 4 modules)      (real work)
                                                 │
                                                 ▼
                                    LC onboarding ──► ClaimExpress protocol
                                                        (the API/MCP surface)
                                                 │
                                                 ▼
HELD     Quantum Dashboard / Situation Room  ── reads the same protocol
PRIVATE  Targeting & outreach engine         ── founder/operator only, never demoed whole
```

Why this does not knock the project off course:

- The Situation Room already reads from a variable registry and a signals
  table. ISR and LC activity becomes another signal source. Nothing built so far
  is thrown away; the room gets real data instead of scenario data.
- The role spine, the ledger, and the wallet are already in place. ISR is
  already the designated first certifiable role. This is the next step on the
  path we drew, not a new path.
- The 11-1-2026 demo gets *stronger*: a live ISR working a real file is a better
  demo than a dashboard nobody's work flows into — and it reveals no targeting
  method.

## Part 4 — The four boundaries this locks in

To keep the pause honest, four lines get drawn and written into the docs:

1. **Public/Group-visible.** The room, the lenses, the outcome data. What
   happened, never how the targets were chosen.
2. **Operating (ISR/LC).** Their own book of work, their own files, their own
   ledger. Scoped to them.
3. **Founder/operator-only.** Storm targeting, ghost Property Owner profiles,
   measurement reports, offer generation, outreach sequencing, ISR motivation.
   Behind `founder_admin`, and absent from every demo script.
4. **Protocol boundary (ClaimExpress as API/MCP).** ISRs and LCs keep their
   current systems. We expose a contract they can call — objects, states,
   events — instead of asking them to migrate. This is the piece that makes
   adoption possible without a rip-and-replace, and it is why the protocol has
   to be specified before more UI gets built on top of it.

## Part 5 — What I need from you to start

Your 6–8 pages, but pointed at ISR/LC now instead of at the Season demo:

- The **ClaimExpress object list and state machine** as it actually runs — Lead,
  Opportunity, Inspection, Estimate, Contract, Work Order, Job, Invoice,
  Payment, Commission, or whatever the real vocabulary is, with the transitions.
- The **ISR day**: what they see on login, what they touch, how they get paid,
  what makes them come back.
- The **LC relationship**: what an LC sees of their ISRs, what they approve,
  where the commission split lands.
- The **screenshots** you mentioned — the legacy screens are the requirement
  document; I will read them as the spec.
- Which parts of the file an ISR may see versus an LC versus the Property Owner.

## Part 6 — What happens when you approve this

No code yet. On approval I will:

- Write `docs/DECISIONS.md` ADR-012 recording the hold on the Quantum Dashboard
  and the reason, so the pause is auditable rather than forgotten.
- Add the four-boundary redaction map to `docs/PROTOCOL.md`.
- Open an Epic 7 (ISR/LC activation) and Epic 8 (ClaimExpress protocol) in
  `docs/REQUIREMENTS.md` as `open`, with the Quantum Dashboard items marked
  `deferred — held by ADR-012`.
- Record a Saga chapter for the moment you chose to withhold the targeting
  engine, because that decision is part of the story.

Then we build against your notes.
