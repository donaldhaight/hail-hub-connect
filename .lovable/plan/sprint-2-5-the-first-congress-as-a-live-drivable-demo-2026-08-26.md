# Sprint 2.5 — The First Congress as a live, drivable demo

The Situation Room and the Efficiency Ledger are built. The security lockdown is complete. The next load-bearing deadline is 11-1-2026, and the product story you have been telling is that people in the room will drive the car. That means the event is not a deck. It is a demo with a script, a scenario, and a room full of people who can touch the console.

This sprint makes the First Congress executable.

## The thing being built

A closed, ticketed broadcast where every admitted holder can:
- enter a private broadcast room with countdown / live stream / replay;
- watch the founder pose one natural-language prompt to the Situation Room;
- see the console resolve the prompt, switch lens and scenario, and render attributed numbers;
- understand that every number is traceable to a provenance card.

Behind the scenes, the founder has a run-of-show that pre-loads each view and a seat ledger that knows who is admitted, waitlisted, or invited to the Second Congress.

## Phase A — Invitation ladder, not ticket ladder

The public site and admin tools still speak in "tickets." The strategy has moved to **Invitation → Delegate Seat → Season One**. The code can keep `ticket` as an internal credential token, but every human-facing label should match the ladder.

- Rename public labels: `/prepare-america` and `/ticket/$credential` become invitation/delegate-seat language.
- Update admin `/admin/tickets` to read as the **Invitation & Seat Ledger**.
- Add a `delegate_seat` status column and a Second Congress credential path (`/seat/$credential` or `/invitation/$credential`).
- Preserve the existing credential machinery; this is a vocabulary and routing pass, not a rewrite.

## Phase B — The demo script and a real scenario

The One Prompt Event needs a script the founder can rehearse.

- Build a **Run of Show** table (`room_demo_script`): sequence order, prompt text, expected lens/scenario/layout, speaking note, truth label.
- Add a **Demo Mode** switch in `/room` that locks the UI to the script sequence and displays the current speaking note to the founder only.
- Replace the generic seeded scenarios with one real, named event. Seed actual counties and modeled variables for that event.
- Wire the broadcast state machine so the script can advance the Room from the founder console.

Open call: which real storm anchors the demo. I recommend a 2024 or 2025 named hurricane or hail event with a clear county footprint, so the counties are recognizable to the audience.

## Phase C — Broadcast room hardening

`/first-congress` exists but has not been exercised end-to-end with a live stream provider.

- Verify the embed renders correctly for each state: scheduled, rehearsing, live, ended.
- Add a **rehearsal watermark** visible only to founder-signed sessions.
- Ensure the replay/Second Congress CTA appears after `ended`.
- Add a **countdown** that is accurate to the event start time and resilient to client clock drift.
- Add a "copy your credential link" reminder for approved holders.

## Phase D — Security and PII audit

The recent scan fixed function-execution exposure. Before 300 people receive credentials, we should:

- Re-run the security scan and address any new critical or high findings.
- Audit all surfaces that display name, email, organization, or credential tokens to ensure they require the correct authorization.
- Confirm RLS on `conference_applications`, `insider_invitations`, and the new seat registry allows only the founder admin to read full rows.
- Add a data-retention note: applications from declined/waitlisted holders are retained but not displayed publicly.

## Order of work

1. Vocabulary pass across public routes and admin ledger.
2. Delegate-seat credential and status column.
3. Real scenario seed and variable provenance cleanup.
4. Run-of-show table and demo mode in `/room`.
5. Broadcast room end-to-end test and rehearsal watermark.
6. Security re-scan and PII authorization audit.

Each phase is priced as a Completed Project Offer before it starts — human hours, agent hours, materials, labor, turnkey bid, equipment, other — and recorded in the ledger.

## Open calls before build starts

1. **Which named storm is the demo scenario?** A real 2024/2025 hurricane or hail event is needed for county-level seed data.
2. **One driver or many seats in the room?** Does the founder drive the console on the main screen while the audience watches, or do delegates get their own read-only seats on secondary devices?
3. **Do we fully retire the word "ticket"?** It is still the internal credential token. Public copy can say "invitation" while the database keeps `ticket_credential`. Confirm this is acceptable.

## Not in scope

No new public marketing pages, no corpus ingestion, no manual chapters. Those tracks continue in parallel but do not block the event demo.
