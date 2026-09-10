# Permitted actions

| Action | Who | Writes | Reversible | Ledger event |
|---|---|---|---|---|
| Pay the entry fee | verified member | wallet debit | no | `spent:certification` |
| Begin the curriculum | the same person | module progress | — | unspecified |
| Complete a module and its quiz | the same person | progress, pass/fail | — | unspecified |
| Be certified | the system, on completion | role grant | no | wallet claim at certification (A1) |

**Unwritten:** what happens on a failed quiz, whether the fee is charged once or per
attempt, whether certification lapses, and whether it can be revoked and by whom.
