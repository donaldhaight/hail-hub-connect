# Arrival Context — the exact proposal for authorization (A78)

Status: PROPOSAL for founder authorization. Schema change, so it comes back to you (standing brief). Nothing runs until you approve.

## What it does, in plain words

Today, when someone walks through one of the seven Doors, the note of *which* Door they came through is kept only in their own browser and is lost the moment they switch devices or clear it. This change keeps that same small note alongside the file that opens for them, and alongside any briefing request they send, so we can finally learn which message worked.

It records the Door, never the person's identity beyond what they already give us. It never grants a role, a group, a permission, a territory or a commission.

## What is stored (and only this)

Seven fields, exactly the ones already captured in the browser today:

- entry_door — which Door (e.g. national-roofing-army)
- campaign — from the link, if any
- initial_intent — the first question's category, if any
- interest — the option the visitor chose themselves
- promise_version — which version of the Door's copy they saw
- referral_source — the link source or referring site
- captured_at — when

Never stored: name, email, address, IP address, device fingerprint, location, or anything from the storm-targeting side (Band 3). The referring site is trimmed to its domain only.

## Rules that travel with it

- Written once, at first arrival; never rewritten afterwards (matches the append-only ledger spirit). A later Door visit does not overwrite the first.
- Attribution is a record, not compensation (ADR-026). Nothing reads this field to route leads, set prices or pay anyone.
- Readable only by the founder view and by the person's own file. No insider, role or public surface sees it.
- The visible "captured · not stored" line on each Door changes to "captured · kept with your file", so the promise to the visitor stays true.

## Rollback

One reverse step removes the two new fields. No other data depends on them, so removing them loses only the attribution notes and nothing else. The browser capture keeps working either way.

## Record-keeping in the same turn

- ADR-032: arrival context persisted, with alternatives considered (browser-only forever; a separate attribution table; storing the full query string — rejected for privacy).
- A78 closed on register and board together; SEVEN-DOORS section 2 and the entry-context note updated from "proposed" to "implemented".

## Technical details

- Migration: `ALTER TABLE public.ledger_wallets ADD COLUMN entry_context jsonb;` and the same on `public.briefing_requests`. Nullable, additive, no backfill. Existing grants/RLS already cover both tables; no policy widened.
- Validation: server functions that open a wallet and create a briefing request accept an optional `entryContext` object, Zod-validated to the seven keys (strings ≤200 chars, `referral_source` reduced to hostname), unknown keys stripped.
- Write-once: wallet insert sets it only when the column is null; claim-on-sign-in carries it unchanged.
- Client: `FrontDoor` / request form pass `readEntryContext()` into those calls; `entry-context.ts` comment and Door disclosure line updated.
- Admin: show entry_door and promise_version as a read-only column in the existing founder request table.
- Rollback SQL: `ALTER TABLE ... DROP COLUMN entry_context;` on both tables.
