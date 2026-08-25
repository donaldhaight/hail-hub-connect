# The Working Protocol — an instruction document for the archive

You asked for the document that explains how the intake machinery actually gets used: what it does, how you feed it, and how I turn what you feed me into strategy, architecture, and code. Right now that knowledge lives in chat and in my head. It should live in the repo, next to `STRATEGY.md` and `DECISIONS.md`, so any future collaborator — or a future session of me — can pick up the thread cold.

## What gets written

A single new file, `docs/PROTOCOL.md`, plus links to it from the README, the Founder Console, and `/admin/intake`.

## Structure of the document

1. **Purpose.** Why an archive protocol exists: the vision is larger than any one session, so the corpus, not the conversation, is the source of truth.
2. **The four layers.** Cultural, Business/valuation, Requirements, Wildcard. What each layer is for, what belongs in it, and why Wildcard exists as a deliberate holding pen rather than a dumping ground.
3. **The lifecycle of a document.** The path every artifact takes:

```text
  you drop it        ->  INTAKE LANE     (new)
  I read + annotate  ->  what it is, when, what it proves, which layers   (read)
  we place it        ->  manual chapter | dossier section | concept track (filed)
  or we hold it      ->  parked, with a reason recorded                   (parked)
```

4. **Your side of the loop.** How to feed material: one at a time when it deserves discussion, in batches when it is bulk history. What metadata to bother with (title, original date, source) and what to leave to me (significance, layers, framing). Links are first-class — a Google Doc URL is a valid artifact.
5. **My side of the loop.** Exactly what I do with each item, in order: date it, place it in the timeline, name what it proves, tag its layers, then say which of the three outputs it changes — a manual chapter, a valuation claim, or a backlog item. Nothing gets read without one of those three landing somewhere.
6. **How intake drives strategy.** The rule that a strategic assertion must cite an artifact or be labeled ASSERTION. How gaps in the archive map ("no artifacts 2015–2019") become questions I ask you rather than assumptions I make.
7. **How intake drives architecture and code.** The chain from artifact to shipped feature: evidence -> requirement in `REQUIREMENTS.md` -> backlog item -> sprint -> code, with `DECISIONS.md` capturing anything load-bearing along the way. Includes when I will build immediately versus when I stage it as a backlog row.
8. **The Concept Lab rule.** Side concepts (Dual Race Month and its successors) live as tracks, invisible to insiders, until adoption writes their decisions and open questions into the backlog. Nothing speculative touches the manual before it earns it.
9. **Truth labels and confidentiality.** A short reference table (FACT / ASSERTION / DECISION, C0–C4) and the rule that every filed artifact inherits the label of the claim it supports.
10. **Standing conventions.** How I write to you: narrative first, patterns across documents called out explicitly, challenge where I disagree, no silent scope changes. Your reserved right to pivot at any time.

## Where it surfaces in the app

- README gets a "How we work" line linking to the protocol.
- The Founder Console gets a card pointing at the document.
- `/admin/intake` gets a collapsible "How this lane works" panel with the lifecycle diagram and the layer definitions, so the instructions sit where the work happens rather than only in a file.

## Technical notes

- `docs/PROTOCOL.md` is prose only; no schema or code changes.
- The in-app panel reads its copy from a new constant in `src/content/intake.ts` so the wording lives in one place and stays client-safe.
- `docs/REQUIREMENTS.md` gains a D-7 row ("Working protocol is documented") under Epic 5.

## Out of scope

Automating any part of the protocol (auto-filing, AI-assigned layers), changing the intake schema, and rewriting existing docs. This turn documents the process and makes it visible; the machinery stays as shipped.
