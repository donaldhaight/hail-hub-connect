insert into public.manual_chapters (slug, part, position, number_label, title, subtitle, truth, confidentiality, draft_status, pull_quote, provenance_note, body) values (
'saga-the-turn-to-underwriting','saga',81,'Chapter 81','The Turn from Vision to Underwriting','Act I resolves, and the threshold is named','ASSERTION','C2','drafting',
'A threshold is crossed by an act, not by a realization.',
'Written 2026-09-16 as the project-side companion to an outside living narrative of the same date. Full account: docs/history/THE-TURN-TO-UNDERWRITING-2026-09-16.md. Ruling: ADR-027.',
$md$For eight weeks the project answered one question badly, and the badness was instructive. The question was what should we build next. The answer kept changing its name — ClaimStore, MarketApp, Kimosabe, Prepare America, Lt. Dan's Plan, the Human Blockchain — because the thing being built was not yet a thing. It was a method looking for an object.

Act I resolves here, and it resolves with a sentence that would have been unwritable in August. This is a method and an operating architecture for preserving human context, coordinating conflicting interests, testing assumptions, and allowing many intelligences, markets, providers and Stakeholders to participate without any one of them becoming the whole system.

That is the end of the search. What follows is not another architectural revelation. It is arithmetic.

On the morning of September 16 the founder supplied the sentence that changes the posture of everything above it: assumptions start at zero. An idea earns nothing by being believed. It earns nothing by being repeated. It earns nothing because four different intelligences, working separately, arrived at the same shape — that is an evidence event, and an evidence event moves a claim off zero without ever starting it there. The system does not exist to defend the plan. It exists to underwrite it.

This is the first principle in the project that binds the founder and every model on identical terms, including the one writing this chapter.

The second thing this turn produced is smaller and structural. One shared operating model can be read one Stakeholder at a time, or all Stakeholders at once. The Property Owner does not need the Contractor's economics; the investor does not need the onboarding. Position Books, hosted course spaces, worded variants, App Home modes and dashboard lenses look like five separate features and are not. They are one mechanism seen from five places — a mechanism specified on the tenth of September and never once used since. Three independent ideas now demand it. That is the strongest signal in the whole morning, and the cheapest thing available to test.

Two things stay outside it, and the boundary matters. Attribution is a record; a view may read it and may never restate it. Compensation is an agreement; a number rendered in a layout is an offer made by a layout. The ledger says what happened. The agreement says what it pays. Those were separated one day earlier and the separation holds here.

And then the question of where we stand. The outside reading says we have crossed the threshold into Act II. From inside the records, that is nearly right and not quite. Nothing irreversible has happened. No entity has transacted. The append-only ledger holds no real money. The Connecticut Agreement is a draft. The one decision that cannot be unmade later — which legal entity a dollar belongs to — is still unmade.

So: Act I has resolved, and we are standing on the threshold rather than across it. The crossing act will be whichever comes first of an executed agreement, a real dollar, or a public commitment on November 1. Both readings are preserved, because the difference between them is not pedantry. It names what the crossing costs, and it says the cost is still avoidable this week and will not be next month.

What waits on the other side is ordinary and unromantic. Startup expenses. Bank accounts. General ledgers. Customers. A roof sold. A lead fee. A sponsor saying yes or no. Someone experienced looking at the model and finding the dragons in it.

The grand thesis will be tested through an ordinary roofing transaction, which is a far better test than asking anyone to believe the thesis first.$md$
);

insert into public.backlog_items (category, title, summary, detail, status, priority, sprint_label, position) values
('register','A67 — Standing assumption inventory','Every proposition carrying architecture, money or exposure, with what evidence would move it.','ADR-027. Starts at zero by definition. No scoring method; each line names an evidence event. Seeded from docs/history/THE-TURN-TO-UNDERWRITING-2026-09-16.md section 5.','idea',2,'Sprint 2.19',670),
('register','A68 — Attribution pipeline as a named diagram','Observed Event → Normalized Fact → Attribution Claim → Settlement Decision.','Shape only. The objects are drawn with the Records layer under A60, never ahead of it. Extends ADR-026.','idea',2,'Sprint 2.19',671),
('register','A69 — The Stakeholder-view mechanism','One Pattern selected by Stakeholder Group, audience, moment, mood and class.','HYPOTHESIS, held in docs/strategy/STAKEHOLDER-VIEWS.md. Not a new subsystem — the first serious demand on ADR-020, unused since 2026-09-10.','idea',2,'Sprint 2.19',672),
('register','A70 — The first variant proof','One existing Pattern rendered twice: Licensed Contractor and capital. Published to nobody.','The cheapest available test of A62, A69 and ADR-020 at once. If the two drift into saying different things, the mechanism is wrong and we learned it for the price of two files.','idea',1,'Sprint 2.19',673),
('register','A71 — Aggregate Stakeholder view as a redaction design','An all-views surface is servable only at the lowest class present.','Band 3 unreachable at any intensity; C3 material cannot sit beside C1 material merely because both read the same market. Design the constraint in, do not discover it in a demo.','idea',2,'Sprint 2.19',674),
('register','A72 — A confidence method under ADR-027','How evidence events accumulate.','Deliberately undefined. Do not invent arithmetic before there is evidence to weigh.','idea',3,'Sprint 2.19',675),
('register','C53 — May an all-Stakeholder-views surface exist at all?','A composition problem before a UI problem.','docs/strategy/STAKEHOLDER-VIEWS.md section 4. Unsettled — must not be assumed in code.','idea',2,'Sprint 2.19',676),
('register','C54 — May a Stakeholder view render economics before an agreement supports the number?','A rendered number reads as an offer.','Against ADR-026. Any economics view needs a visible statement of what agreement it derives from, or must show no numbers.','idea',2,'Sprint 2.19',677),
('register','C55 — Have we crossed into Act II, or are we standing on the threshold?','Both readings preserved.','The crossing act is an executed agreement, a real dollar on the ledger, or a public November 1 commitment — whichever comes first.','idea',2,'Sprint 2.19',678),
('register','C56 — Does convergence between models weigh the same as observed reality?','ADR-027 treats both as evidence events with no weighting, on purpose.','Bears on A72. Resolving it early would manufacture precision the evidence cannot support.','idea',3,'Sprint 2.19',679);