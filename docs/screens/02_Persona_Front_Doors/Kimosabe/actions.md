# Permitted actions

| Action | Who | Writes | Reversible | Ledger event |
|---|---|---|---|---|
| Ask the first question | anyone | resolves or creates the anchor and its wallet | no — the file is append-only | `earned:participate`, recorded once |
| Ask again | anyone with the file open | nothing new | — | none |
| Earn gestures | anyone with the file open | wallet credit against the earn schedule | no | one line per gesture, reason-labelled |
| Pay entry | anyone with the balance | debit at the entry price | no | `spent:` line |
| Sign in / become a member | anyone | merges the anchor's file into the person's account | no | claim-on-merge |

Every write is append-only and server-side. The screen never edits a prior line; it only
adds the next one.
