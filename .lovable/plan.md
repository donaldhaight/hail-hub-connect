# Kimosabe: the Interested User seam

A separate route tree in this project. Zero changes to PrepareAmerica. A link to the Kimosabe home page can be dropped anywhere — email, badge, the Situation Room, a cold hand-off at Gratitude Ranch — and the page knows who arrived.

## The inversion

PrepareAmerica assumes identity, then grants access. Kimosabe grants access, then accumulates identity.

Everyone arrives as an **Interested User**. No email, no phone, no form. On first touch the system mints an opaque device anchor (browser storage plus a signed cookie) and opens a file. Every gesture after that sharpens the file. The person is real to the system before they have told it anything.

```text
arrival ──► anchor minted ──► file opens (empty, high uncertainty)
   │
   ├─ carried a credential?  → merge with what PrepareAmerica already knows
   ├─ signed in?             → merge with the account
   └─ nothing?               → still a file; still remembered
                    │
                    ▼
        Trojan horses raise resolution over time
```

## The Trojan horses

Each is a capability genuinely worth having. The disclosure is a side effect of the user wanting the tool, never a gate in front of it.

| Capability | What it teaches us |
| --- | --- |
| Show me my roof | property, geography, ownership posture |
| Run my numbers | operator scale — crew size, claim volume |
| Watch this county | territory and intent, plus a reason to reach them they asked for |
| Save this / take it with me | the first voluntary contact detail, on their initiative |

Nobody fills out a profile. The profile assembles itself.

## Inference, not just storage

The file holds observations, and each carries a value, a provenance, and a confidence — the same discipline as the Situation Room's signals. Derived traits ("contractor with money", "capital", "counsel") are computed with a confidence score and are always traceable to the gestures that produced them.

Kimosabe is the Situation Room pointed at one human instead of one storm.

## The recognition moment

At first real recognition Kimosabe says so out loud: *"I remembered you."* Quietly proud rather than covert. This is a deliberate posture decision — it turns a persistence mechanism into the demo's best moment and keeps the room's counsel comfortable.

## Sequencing — Siteforum first

No Kimosabe code gets written until the 2014 ClaimExpress/Siteforum architecture is on the table. Kimosabe's data shapes must be a compatible dialect of Season 1's object model, not a parallel invention.

Order of work:

1. **Narration intake.** Founder narrates Siteforum, starting with the user record — what it knows about a person, its fields, the states a person moves through. Then the lead lifecycle (origination → targeting → capture → distribution → offer → follow-up), then the surrounding nouns. Captured as a living architecture document in the archive and filed to the Intake Lane as it comes in.
2. **Dialect map.** A written mapping from Siteforum's user record and lead objects to the Kimosabe file and to what PrepareAmerica already holds. This is the artifact that prevents rework.
3. **Kimosabe shell.** Route tree, anchor minting, credential resolution, the recognition moment. No horses yet.
4. **First Trojan horse.** One capability, end to end, proving the resolution loop.
5. **Remaining horses**, then the founder-side view of the accumulating files.

## Technical notes

- Kimosabe lives at its own path in `src/routes/`, with its own resolver rather than the `_authenticated` gate. The gate fails closed; Kimosabe fails open into the ritual.
- The anchor is an opaque server-signed identifier; the browser never holds anything meaningful about the person.
- New tables for the anonymous file, its observations, and derived traits — anonymous rows are writable by unauthenticated visitors only through narrow server functions, never directly. Founder-only read.
- Merging: when an anonymous file later attaches to a credential or an account, the file is claimed rather than duplicated, and the merge is recorded.
- Nothing in `src/routes/` outside the Kimosabe tree changes. The link is just a link.

## Open — waiting on the founder

- The Siteforum user record and lead lifecycle (blocking steps 2 onward).
- Which Trojan horse goes first.
- Whether the nine role tags become one field inside the Kimosabe file or stay a separate PrepareAmerica concern.
