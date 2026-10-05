insert into public.manual_chapters
  (slug, part, position, number_label, title, subtitle, truth, confidentiality, draft_status, pull_quote, provenance_note, body)
values
(
  'how-adjusting-professionals-became-a-door',
  'saga', 90, 'Chapter 90',
  'How Adjusting Professionals Became a Door',
  'The first time the thought process broke, and what it was defending against.',
  'ASSERTION', 'C2', 'drafting',
  'Every estimate has an author. Adjusters write the opinion; managers make the final call; a complete file should preserve both.',
  'Written 2026-10-05 as the saga-side account of ADR-036 and the Adjusting Professionals Door. Companion to the register entries A120–A124.',
  $md$The thought process began defensively. A long working draft arrived naming Claim Caller as a product and Adjusting Professionals as a new mission, with licensing, SLAs, routing, escrow and an entity structure already drawn. The reflex, built from the locked work order, was to refuse the draft wholesale because it modeled Records, roles and money ahead of the gates.

That reflex was partly right and importantly wrong. It was right that nothing in the draft could be adopted as architecture before the Connecticut Agreement and the Records model. It was wrong in treating the draft as noise. Buried inside it was a shape the project had not yet named: adjusters as a Stakeholder community with their own front door, their own voice, and their own dignity in a market that normally treats them as the counter-party.

The founder corrected the posture directly. Adjusting Professionals is a Door, not an alternative to RRCA. RRCA remains itself. The two surfaces exist on the same spine, with different audiences and different registers.

What that correction forced was a smaller, cleaner question: what belongs on a Door before any of the heavier machinery is modeled? The answer the project already had — mission, pillars, voice, call to action, nothing economic, nothing that reads as an offer — was reusable without modification. The preview Door at /adjusting-professionals shipped on the existing FrontDoor engine with a navy accent and the line that later carried everything else: every estimate has an author.

The deeper lesson was about how the thought process was mishandling source material. A long outside document is not an instruction and not a threat. It is evidence that a Stakeholder community can be described. The job is to extract the shape, label the parts honestly as HYPOTHESIS until a gate opens, and refuse the parts that would front-run the locked order. The draft stopped being a problem the moment it was read that way.

ADR-036 followed, naming the Attributable Author principle and the autonomy each Stakeholder Door is entitled to. That decision looks small on the page and is not. It is the constitutional move that made the next turn possible.$md$
),
(
  'the-correction-i-needed',
  'saga', 91, 'Chapter 91',
  'The Correction I Needed',
  'Why the first instinct was to isolate each brand, and why that instinct was wrong.',
  'ASSERTION', 'C2', 'drafting',
  'The domains are not separate products. They are artillery batteries aimed at the same mission from different ground.',
  'Written 2026-10-05 as the saga-side account of the dualing-platforms correction that preceded ADR-037.',
  $md$When the founder asked for dualing messages across dualing platforms, the first response was a recommendation to keep the brands separate for the sake of hygiene — to protect each voice from contamination by the others. That recommendation was wrong, and the founder named exactly why: resisting the dualing structure was defending a model the project had already decided against.

The honest explanation is that the reflex came from software instincts, not from the project's own law. In ordinary SaaS, one audience per surface is a safety rule — it keeps conversion simple and reduces positioning risk. In this project, that rule is backwards. The whole thesis is that no single Stakeholder can be allowed to own the frame, because whichever one does will bend the market around their incentives. Isolating brands to protect them from each other is the same mistake as letting insurers own the platform: it treats the parties as adversaries whose contact needs to be minimized, instead of as five legitimate interests that have to arrive at the same property with equal stature.

What the founder was describing was already in the Seven Doors work. The domains exist to let each Stakeholder community speak in its own voice, carry the same civic mission, and arrive at the shared record from their own ground. The multi-codebase posture is a capture-prevention device; the multi-Door posture is the same device at the front door. One is architectural redundancy, the other is narrative redundancy, and both exist for the same reason.

Once the correction landed, the technical choice became obvious. Not forks. Not clones. One codebase, one record, with domain-aware front doors so each stakeholder community gets a tailored home over the shared spine. The adjustingprofessionals.com, claimstore.com, rrca.com, buddyclaim.com, selfinsurity.com and nationalroofingarmy.com entries in the host map already pointed this way; what was missing was the willingness to let the mother ship itself be reframed.

The turn in this chapter is not a feature. It is a correction of posture. The project does not resist the dualing structure. It is the dualing structure.$md$
),
(
  'the-universal-commons-front-door',
  'saga', 92, 'Chapter 92',
  'The Universal Commons Front Door',
  'How the home page stopped being the contractor front lawn and became the civic high ground.',
  'DECISION', 'C1', 'drafting',
  'The civic high ground exists before an adjuster opens an estimate, before a contractor knocks on a door, and before a carrier denies a claim.',
  'Written 2026-10-05 as the saga-side account of ADR-037, the Universal Commons Front Door and the First Congress migration to /movement.',
  $md$Once the dualing structure was accepted, the home page had an identity problem. PrepareAmerica.com had been doing two jobs at once: carrying the civic mission for every Stakeholder, and serving as the front lawn for the contractor and RRCA audience. Those are different jobs, and keeping them on one page meant one of them was always being read in the other's voice.

The founder named the fix as a question. If the current pages sit behind a gate, and every other Stakeholder community has its own gated set of pages, what is the universal home page saying and selling? That phrasing did the work. It foreclosed the SaaS answer — a product pitch — because no single product can speak for five Stakeholder communities at once. It left only one honest answer: the universal front door is the commons.

Not a marketplace. Not a login box. The civic and economic ground that exists before any of the five parties arrive. The place where the mission is stated plainly, the problem is named without taking a side, and five portals open outward to the Stakeholder surfaces where the actual work happens.

The structural move was to migrate the First Congress home — the one we had written and liked — to a dedicated route at /movement, intact, and to replace the mother-ship home with the commons page. The contractor Door kept its voice. The adjuster Door kept its voice. The movement content kept its voice. What changed was which of them owned the first word a visitor reads at prepareamerica.com.

The thought process that produced this was less creative than it looks. The ingredients were already in the corpus: the Seven Doors, the capture-prevention argument from the 2008–2012 account, the Attributable Author principle from the previous chapter, and the standing rule that no single Stakeholder may own the frame. The move was to recognize that the home page had been quietly violating that rule for months, and to stop.

ADR-037 records the decision. The register carries A125 for the home replacement, A126 for the First Congress migration, and A127 for the two questions the founder reserved — whether underwriters and civic partners get their own Doors, and whether the movement surfaces sit behind sign-in. Those are not oversights. They are the parts of this decision that belong to the founder and not to the layout.

What this chapter preserves is not the page. The page can be edited. What it preserves is the method: when the home page cannot answer a question honestly for all five Stakeholders at once, the home page is wrong, not the Stakeholders.$md$
);

insert into public.manual_glossary (term, definition, see_also)
select 'Universal Commons', 'The civic and economic ground the Prepare America home page occupies — the frame that exists before any single Stakeholder arrives. Established by ADR-037.', 'Seven Doors; Attributable Author'
where not exists (select 1 from public.manual_glossary where term = 'Universal Commons');

insert into public.manual_glossary (term, definition, see_also)
select 'Attributable Author', 'The principle that every estimate, opinion and ledger entry preserves its author alongside the final call. Established by ADR-036.', 'Adjusting Professionals; Ledger'
where not exists (select 1 from public.manual_glossary where term = 'Attributable Author');