/**
 * Intake Lane and Concept Lab — shared client-safe constants.
 *
 * Kept out of the `.functions.ts` modules so the server-function splitter
 * never strips them from the client bundle.
 */

export const LAYERS = ["cultural", "business", "requirements", "wildcard"] as const;
export type Layer = (typeof LAYERS)[number];

export const LAYER_LABEL: Record<Layer, string> = {
  cultural: "Cultural",
  business: "Business / valuation",
  requirements: "Requirements",
  wildcard: "Wildcard",
};

export const TRIAGE_STATES = ["new", "read", "filed", "parked"] as const;
export type TriageState = (typeof TRIAGE_STATES)[number];

export const TRIAGE_LABEL: Record<TriageState, string> = {
  new: "Needs triage",
  read: "Read",
  filed: "Filed",
  parked: "Parked",
};

export const TRACK_STATUSES = ["exploring", "converging", "adopted", "retired"] as const;
export type TrackStatus = (typeof TRACK_STATUSES)[number];

export const TRACK_STATUS_LABEL: Record<TrackStatus, string> = {
  exploring: "Exploring",
  converging: "Converging",
  adopted: "Adopted",
  retired: "Retired",
};

export const NOTE_KINDS = ["note", "question", "decision"] as const;
export type NoteKind = (typeof NOTE_KINDS)[number];

export const NOTE_KIND_LABEL: Record<NoteKind, string> = {
  note: "Note",
  question: "Open question",
  decision: "Decision",
};

/**
 * Copy for the "How this lane works" panel on /admin/intake.
 * Mirrors docs/law/PROTOCOL.md so the instructions sit where the work happens.
 */
export const PROTOCOL_DOC = "docs/law/PROTOCOL.md";

export const PROTOCOL_LEDE =
  "The corpus, not the conversation, is the source of truth. Drop material here before you know where it belongs — unfiled is a valid, durable, searchable state.";

export const PROTOCOL_DIAGRAM = `you drop it        ->  INTAKE LANE                                      (new)
I read + annotate  ->  what it is, when, what it proves, which layers   (read)
we place it        ->  manual chapter | dossier section | concept track (filed)
or we hold it      ->  parked, with a reason recorded                   (parked)`;

export const LAYER_GUIDE: Record<Layer, string> = {
  cultural:
    "The story. Why the industry is broken, who gets hurt, the language and iconography of PrepareAmerica, the congresses as ritual.",
  business:
    "The money. RRCA financials, lead-flow economics, PSL and seat-license mechanics, comparables, market sizing, deal history.",
  requirements:
    "The build. Anything that tells us what the software must do — screens, redlines, workflows, legacy behavior, compliance.",
  wildcard:
    "The fourth layer, deliberately unresolved. Ideas that clearly matter but do not yet belong to a lane. A holding pen, not a dumping ground.",
};

export const PROTOCOL_STEPS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "What's worth typing",
    body: "A human title, the date the material is from (not the day you uploaded it), and where it came from. Significance, layers, and filing are mine.",
  },
  {
    title: "One at a time, or in bulk",
    body: "Material that changes the argument gets its own conversation. Twenty years of correspondence goes in as a batch and gets worked in date order.",
  },
  {
    title: "Every item lands somewhere",
    body: "Each thing I read changes a manual chapter, a valuation claim, or a backlog item — or it gets parked with a stated reason. Nothing is silently skipped.",
  },
  {
    title: "Gaps become questions",
    body: "The archive map counts artifacts by decade, layer, and source. Where there's a hole, I ask you for the material instead of bridging it with an assumption.",
  },
];
