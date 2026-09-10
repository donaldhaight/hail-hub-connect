# Required context

| Needed | Source | If missing |
|---|---|---|
| Anchor | browser local storage, shared key across all persona doors | none needed — the first question creates one |
| Persona | the route: `/kimosabe` | not possible; the route defines it |
| Wallet view | server, resolved from the anchor | the door shows the unopened state |

**Memory partition:** anonymous session only. Nothing here reads a personal file, a role
partition, or another door's history. A returning anchor opens quietly because the browser
carried it back — not because anything was inferred.
