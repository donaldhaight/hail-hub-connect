/**
 * Owner's Manual — shared client-side constants and types.
 *
 * Chapter content lives in the `manual_chapters` table and is editable in the
 * browser by the founder. This module only holds presentation metadata.
 */
import type { TruthClass, ConfidentialityClass } from "@/components/briefing/Badges";

export const SHIELD_URL =
  "/__l5e/assets-v1/970e8424-e42c-41f9-b572-745a3dd7b2cf/usa-shield.png";

export type DraftStatus = "outline" | "drafting" | "review" | "final";

export interface ManualChapter {
  id: string;
  slug: string;
  part: string;
  position: number;
  number_label: string | null;
  title: string;
  subtitle: string | null;
  truth: TruthClass;
  confidentiality: ConfidentialityClass;
  body: string;
  draft_status: DraftStatus;
  pull_quote: string | null;
  provenance_note: string | null;
  updated_at: string;
}

export const PART_TITLES: Record<string, string> = {
  front: "Front matter",
  I: "Part I — The Thesis",
  II: "Part II — The Seven Groups",
  III: "Part III — The Convening",
  IV: "Part IV — The Functionality Manual",
  V: "Part V — The Phases",
  saga: "Part VI — The Saga",
  appendix: "Appendices — The Archive",
  back: "Back matter",
};

export const TRUTH_OPTIONS: TruthClass[] = [
  "FACT",
  "ASSERTION",
  "DECISION",
  "HYPOTHESIS",
  "SIMULATION",
  "OPEN",
];

export const CONFIDENTIALITY_OPTIONS: ConfidentialityClass[] = [
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
];

export const DRAFT_STATUS_OPTIONS: DraftStatus[] = [
  "outline",
  "drafting",
  "review",
  "final",
];

export const DRAFT_STATUS_LABEL: Record<DraftStatus, string> = {
  outline: "Outline",
  drafting: "Drafting",
  review: "In review",
  final: "Final",
};

/** Split a stored chapter body into display paragraphs. */
export function toParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Rough word count of a chapter body. */
export function wordCount(body: string): number {
  const trimmed = body.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Reading time in whole minutes, at 220 words per minute, floored at 1. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(wordCount(body) / 220));
}

/** A chapter counts as written once it is past the outline stage. */
export function isWritten(status: DraftStatus): boolean {
  return status === "drafting" || status === "review" || status === "final";
}
