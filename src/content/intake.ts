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
