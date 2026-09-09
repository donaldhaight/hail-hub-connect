# The Crystal Ball — one record, four readings

The records model already says what the system holds. What it does not yet say is
what the same address record *feels like* from each side of it. Writing those four
readings is the cheapest way to find the assumptions hiding inside the model —
before any of it is built.

Documentation only. No code, no schema, no UI. The locked work order
(Draft Connecticut Agreement → Records/Object Model → SiteBMS → JobNimbus mapping
→ API/MCP) is untouched.

## What gets written

One new document, `docs/PERSPECTIVES.md`, marked *requirements in progress*.

It follows a single property — one address, one continuing record — through
Lead → Offer → Pending Project → Project → Warranty, told four times:

1. **The ISR.** How the address arrives, what consent looks like at the door, what
   completing an offer commits them to, and where RoofLac sits alongside the offer.
2. **The Licensed Contractor.** Accepting the offer, opening the project, standing up
   jobs, job orders and other charges, and what "settled enough to open" actually means.
3. **The Property Owner.** Being invited to a record that already exists about their
   home, what they can see, what they can correct, and what warranty means to them.
4. **The Construction Manager (RRCA).** Verifying work, closing job orders, closing
   jobs, and the moment income is recognized.

Each reading ends with a short **Assumptions surfaced** list: the things that reading
takes for granted that nobody has actually decided.

## The point of the exercise

Four narratives of the same record will disagree with each other. Those disagreements
are the finding. A closing section collects them as candidate open items — for example:

- Who the record belongs to at each state, and whether that changes at Offer Accepted
- What the Property Owner may erase, and what survives erasure (already open as C16)
- Whether "Offer Accepted" and "Pending Project" are one event or two
- Whether the ISR keeps a relationship to the record after the offer completes
- Whether RoofLac rides on the same record or opens a second one
- Who is accountable when the four readings name different actors for the same task

Anything genuinely new gets added to `docs/OPEN-ITEMS.md` in the same pass. Nothing
gets closed.

## Deliberately not in this sprint

- No scenario picker, no screen, no demo. If the writing reads well, a screen can be
  built from it later — that is a separate decision.
- No new decisions. This document raises questions; ADRs answer them.
- No fabricated specifics. Where a reading needs a fact nobody has supplied, it says so
  in plain words rather than inventing one.

## Files touched

- `docs/PERSPECTIVES.md` — new
- `docs/OPEN-ITEMS.md` — append newly surfaced questions only
- `docs/RECORDS-MODEL.md` — one cross-reference line pointing to the new document
