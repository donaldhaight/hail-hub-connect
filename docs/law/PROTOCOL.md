# The Working Protocol

How material enters this project, what happens to it, and how it becomes strategy, architecture, and code.

This document is the instruction set for the collaboration itself. `STRATEGY.md` says what we are building and why. `ARCHITECTURE.md` says how the software is put together. This file says how the two stay honest with each other as the archive grows.

---

## 1. Purpose

The vision is older and larger than any one session. It began in 2000, it has pivoted more than once, and it lives across a hundred conversations, dozens of documents, and a quarter century of operating experience in insurance restoration. No single message can carry it, and no chat window will remember it.

So the corpus — not the conversation — is the source of truth.

The Intake Lane, the Evidence Index, the Owner's Manual, and the Concept Lab exist to make that literal. Every claim in the manual should be traceable to something dated. Every requirement should be traceable to a claim. Every line of shipped code should be traceable to a requirement. When that chain holds, the project can be handed to a collaborator, an investor, or an auditor without a briefing. When it breaks, we are back to relying on memory, which is exactly the failure mode this whole system is designed to escape.

**The standing rule:** if it is not in the corpus, it did not happen.

---

## 2. The four layers

Every artifact and every intake item carries one or more layer tags. Layers are not folders — an item can feed three of them at once. They describe what the material *proves*, not what it *is*.

| Layer | Tag | What belongs here |
|-------|-----|-------------------|
| **Cultural** | `cultural` | The story: why the industry is broken, who gets hurt, what restoration means, the language and iconography of PrepareAmerica, the human-blockchain framing, the congresses as ritual. Photographs, speeches, letters, press, the ranch, the seven stakeholder groups. |
| **Business / valuation** | `business` | The money: RRCA financials, the ClaimStore lead-flow economics, PSL and seat-license mechanics, comparables, cap table, deal history, term sheets, market sizing, unit economics of hail and hurricane demand. |
| **Requirements** | `requirements` | The build: anything that tells us what the software must do. Screens, redlines, workflows, legacy Siteforum behavior, vendor docs, compliance obligations, operating procedures. |
| **Wildcard** | `wildcard` | The fourth layer, deliberately unresolved. Ideas that clearly matter but do not yet belong to a lane — the Daytona/Indy Dual Race Month theme is the founding example. |

Wildcard is a holding pen, not a dumping ground. It has one entry condition: *this connects to the vision in a way we cannot yet articulate.* Material that is simply unfiled belongs in the lane with triage state `new`, not tagged `wildcard`. The distinction matters, because wildcard items are the ones I will actively try to connect to the other three — a queue of unresolved resonance, reviewed on purpose rather than forgotten.

---

## 3. The lifecycle of a document

```text
  you drop it        ->  INTAKE LANE                                      (new)
  I read + annotate  ->  what it is, when, what it proves, which layers   (read)
  we place it        ->  manual chapter | dossier section | concept track (filed)
  or we hold it      ->  parked, with a reason recorded                   (parked)
```

**new** — in the lane, unread. The lane shows a needs-triage count so neither of us loses the thread on a batch upload.

**read** — I have opened it and written the annotation: what it is, the date it belongs to in the timeline, what it proves or disproves, and its layer tags. An item can sit at `read` indefinitely. That is fine. Reading is not filing.

**filed** — placed against a manual chapter, a dossier section, or a concept track. Filing reuses the existing artifact machinery, so the file is never uploaded twice and its provenance fields (`original_date`, `source_label`, `significance`) travel with it into the evidence strip that renders at the end of the chapter.

**parked** — deliberately not filed, with the reason in the notes. Parking is a decision, not a shrug. "Superseded by the 2024 restructuring," "personal, not for the corpus," "wait until the valuation chapter exists." Parked items stay searchable.

Nothing is deleted from the lane as a matter of housekeeping. Deletion is reserved for genuine mistakes — a duplicate, a wrong file.

---

## 4. Your side of the loop

**Feed one at a time when it deserves a conversation.** A document that changes the argument — a deal memo, a founding letter, a photograph that carries the culture — gets its own exchange. You drop it, I read it, we talk about it, then it gets placed. This is the rhythm you prefer and it is the rhythm that produces the best chapters.

**Feed in batches when it is bulk history.** Twenty years of RRCA correspondence does not need twenty conversations. Drag the whole set in. The lane queues them, the needs-triage count tracks them, and I work through the batch in date order, reporting patterns rather than filing individual receipts.

**What is worth typing when you upload:**

- **Title** — a human name, not the filename. "RRCA member agreement, first version" beats `scan_0042.pdf`.
- **Original date** — the date the material is *from*, not the date you uploaded it. This is the single most valuable field you can give me. It is what turns a pile into a timeline, and it is the one thing I usually cannot recover from the document itself.
- **Source** — where it came from. "Siteforum export," "ChatGPT session, week of Aug 18," "Manus," "personal files," "counsel."

**What to leave to me:** significance, layer tags, framing, and which chapter it belongs to. If you already know, say so and I will follow it. If you do not, that is my job.

**Links are first-class artifacts.** A Google Doc URL, a Manus session, a YouTube segment, a news article — paste it as a link item. It gets the same date, source, layers, and triage state as a file. Do not convert a living document into a PDF just to feed it to me; the link keeps it live.

**You do not have to decide where anything goes at the moment it arrives.** That was the whole point of building the lane. Unfiled is a valid, durable, searchable state.

---

## 5. My side of the loop

For every item I take out of the lane, in this order:

1. **Date it.** Establish the original date and place it on the project timeline. If the date is ambiguous I say so and give my estimate with reasoning rather than leaving the field empty.
2. **Situate it.** What was happening in the story when this was made? A 2008 document and a 2024 document can say the same words and mean opposite things.
3. **Name what it proves.** One sentence, written to be quoted. This becomes the `significance` field, and it is what appears in the evidence strip under a chapter. If I cannot write that sentence, the item is not ready to file — it goes to `read` and waits.
4. **Tag the layers.** One or more of cultural / business / requirements / wildcard.
5. **Name the output it changes.** Every item I read must land in at least one of three places:
   - a **manual chapter** — new, revised, or newly evidenced;
   - a **valuation or business claim** — strengthened, weakened, or newly supported;
   - a **backlog item** — because the material revealed something the software must do.

   If an item changes none of the three, I say that explicitly and park it. That is a legitimate outcome, but it has to be stated, not silently skipped. This is the discipline that prevents reading from becoming an activity that produces nothing.

6. **Report the pattern, not the receipt.** When a batch lands, I tell you what the set means together — the trend, the contradiction, the gap — rather than summarizing each file back to you. Cross-document connection is the point.

---

## 6. How intake drives strategy

**Assertions must cite or be labeled.** Every strategic claim in the corpus carries a truth label. A claim supported by a dated artifact can be a FACT. A claim I believe but cannot evidence is an ASSERTION, and it is labeled as one even when I am confident. I will not quietly promote an assertion to a fact because it has been repeated often enough — that is precisely the failure mode that makes decks worthless to the people we are trying to attract.

**Gaps become questions, not assumptions.** The archive map on the intake lane counts artifacts by decade, layer, and source, and shows the holes. When there are no artifacts from 2015–2019, or no valuation model filed, I ask you for that material rather than inventing a bridge across the gap. A named gap is an asset; a papered-over gap is a liability that surfaces in diligence.

**Strategy revisions happen as material lands, not after.** As documents arrive I revise the chapter outline, the valuation narrative, and the requirements backlog in the same pass as the annotation. You should watch the manual's shape change while you load, not receive a restructure at the end.

**Disagreement is stated once, clearly, and then I execute.** If I think a direction is wrong I say so in a sentence with the reason, and then I build what you asked for. You are the sole owner and you reserve the right to pivot. My job is to make sure you pivot with the full picture, not to slow you down with re-litigation.

---

## 7. How intake drives architecture and code

The chain, end to end:

```text
  ARTIFACT (intake lane, dated, annotated)
      |
      v
  CLAIM  (manual chapter / dossier section, truth-labeled)
      |
      v
  REQUIREMENT  (docs/requirements/REQUIREMENTS.md, epic + acceptance criteria)
      |
      v
  BACKLOG ITEM  (/admin backlog board, prioritized)
      |
      v
  SPRINT  (docs/work/SPRINTS.md)
      |
      v
  CODE  (shipped, with load-bearing choices in docs/law/DECISIONS.md)
```

**When I build immediately:** the ask is narrow, the shape is obvious, and it does not change the data model or the public posture. Copy, layout, a new admin view over existing data, a field on an existing form.

**When I stage it as a backlog row instead:** it needs a schema change, it touches money or seats or credentials, it changes what insiders can see, it depends on material still in the lane, or it is large enough that you should choose the order. In those cases I write the row — with the acceptance criteria already drafted — and tell you it is waiting. The backlog board's Build button then turns the row into the instruction that starts the work.

**`DECISIONS.md` is written at the moment of the decision,** not reconstructed later. Anything load-bearing — a vocabulary choice, a visibility rule, a schema shape we will have to live with — gets a dated entry with the alternatives considered.

**`REQUIREMENTS.md` is the contract.** A feature is not done because it renders. It is done when its acceptance criteria are met and its row reads `shipped`.

---

## 8. The Concept Lab rule

Side concepts get a track in the Lab, not a fork of the project. A track has a name, a brief, layer tags, and a status: `exploring`, `converging`, `adopted`, `retired`. It collects its own notes, open questions, and decisions.

**Nothing in the Lab is visible to insiders.** Not the track, not its brief, not its artifacts. The public site and the insider corpus stay clean while you think out loud. This is the isolation a cloned repo would have given you, without the cost of reconciling two versions of the same vision later.

**Adoption is the bridge back.** Adopting a track flips its status and writes its decisions and unresolved questions into the project backlog as Concept Lab items. That is a single action rather than a re-explanation — the mechanism that lets you spend two days elsewhere on a theme like Dual Race Month and bring the whole result home intact.

**Retirement costs a row in a table.** A track that never converges is not a failure and does not need cleaning up. Retire it and it stays searchable, which means the idea is recoverable when the conditions change.

**Speculative material does not touch the manual before it earns it.** A chapter may show "informed by: Dual Race Month" once a track is adopted. Before that, the manual does not know the track exists.

---

## 9. Truth labels and confidentiality

Every claim carries a truth label. Every surface carries a confidentiality class. Filed artifacts inherit the label and class of the claim they support — an exhibit under an ASSERTION does not make the assertion a fact, and an exhibit under a C3 section is a C3 exhibit.

**Truth labels**

| Label | Meaning |
|-------|---------|
| `FACT` | Verifiable, and the evidence is filed. |
| `ASSERTION` | Believed and argued, not yet evidenced. |
| `DECISION` | A choice we made. True because we said so, and reversible by saying otherwise. |
| `HYPOTHESIS` | A testable proposition with a stated test. |
| `SIMULATION` | Modeled or illustrative numbers. Never presented as actuals. |
| `OPEN` | Known unknown, deliberately surfaced rather than hidden. |

**Confidentiality classes**

| Class | Audience |
|-------|----------|
| `C0` | Public. The front door. |
| `C1` | Named prospect, shared deliberately. |
| `C2` | Qualified insider. The dossier room and the manual. |
| `C3` | Counsel, capital, and executive principals. |
| `C4` | Founder only. Intake lane, Concept Lab, evidence index. |

The intake lane, the Concept Lab, and the evidence index are C4 throughout. Insiders never read those tables.

---

## 10. Standing conventions

- **Narrative first.** Reports are written as prose that carries an argument, not as bullet inventories of what changed.
- **Patterns called out explicitly.** The value is in the connections across documents, decades, and layers. When I see one, I name it, including when it undercuts a current claim.
- **Challenge where warranted.** Stated in a sentence, with the reason, once. Then execution proceeds as asked.
- **No silent scope changes.** Work is not quietly narrowed or widened. If something cannot be completed, that is said plainly along with what is missing and why.
- **Blockchain and DAO concepts stay practical.** They are applied as governance and coordination mechanics — seat rights, stakeholder groups, verifiable records — not invoked as vocabulary.
- **One owner.** You reserve all rights to execute and pivot. This protocol describes how the work is organized, not who decides.
- **Open work is registered twice, once.** When a sprint opens new work, the line lands in `docs/work/OPEN-ITEMS.md` (the register, document of record) and on the founder backlog board (Backlog tab, workable in-app) in the same turn, carrying the same register ID. When work ships, both close together. No line lives in only one place.

---

*This document is itself governed by the protocol. It is a DECISION, class C2, and it is revised when the way we work changes — not after.*

---

## 11. The four-boundary redaction map

Adopted with ADR-012. Every surface, every demo script, and every route belongs to exactly one of these bands. When it is unclear which, it is treated as the more restricted one.

| Band | Contains | Audience |
|------|----------|----------|
| **1. Public / Group-visible** | The room, the seven lenses, outcome data. What happened — never how targets were chosen. | Anyone in the room on 11-1-2026 |
| **2. Operating (ISR / LC)** | An operator's own book of work, their files, their ledger, their commissions. | Scoped to that operator and their LC |
| **3. Founder / operator-only** | Storm targeting, kill-zone and fringe tagging, carrier routes, ghost Property Owner profiles, measurement reports, good-better-best offer generation, outreach sequencing, ISR motivation mechanics. | `founder_admin` only; absent from every demo script |
| **4. Protocol boundary** | ClaimExpress as API/MCP — the objects, states, and events an external system may call. | Published contract; no method, no data, no targeting logic |

Band 3 is never demoed whole. Outputs of band 3 may appear in band 1 as outcomes; the method never does. Band 4 exists so ISRs and LCs can adopt the platform without a rip-and-replace of the systems they already run.
