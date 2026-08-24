/**
 * Owner's Manual — shared client-side constants and types.
 *
 * Chapter content lives in the `manual_chapters` table and is editable in the
 * browser by the founder. This module only holds presentation metadata.
 */
import type { TruthClass, ConfidentialityClass } from "@/components/briefing/Badges";

export const SHIELD_URL =
  "/__l5e/assets-v1/970e8424-e42c-41f9-b572-745a3dd7b2cf/usa-shield.png";

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
  updated_at: string;
}

export const PART_TITLES: Record<string, string> = {
  front: "Front matter",
  I: "Part I — The Thesis",
  II: "Part II — The Seven Groups",
  III: "Part III — The Convening",
  IV: "Part IV — The Functionality Manual",
  V: "Part V — The Phases",
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

/** Split a stored chapter body into display paragraphs. */
export function toParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
