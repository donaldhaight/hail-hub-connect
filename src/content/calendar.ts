/**
 * The season ladder — single source of truth for every date on this site.
 *
 * No component may hardcode a date. Import from here.
 *
 * Truth labels:
 *  - The First Congress date (11-01-2026) is a DECISION.
 *  - Season 1 dates are a DECISION.
 *  - Milestone dates keyed to Super Bowl weekend beyond 2027 are OPEN until
 *    the NFL publishes the schedule. Render them as "Super Bowl weekend".
 *  - The election-cycle and liquidity-event framing is C3 / HYPOTHESIS.
 *    It must never appear in public copy or metadata.
 */

export type Visibility = "public" | "insider";
export type Phase = "invitation" | "ratification" | "beta" | "launch";

export interface LadderEntry {
  /** Stable key for lookups. */
  id: string;
  /** Season number, or null for congresses and owners meetings. */
  season: number | null;
  /** Display name. */
  label: string;
  /** ISO opening date, or null when the date floats. */
  opensOn: string | null;
  /** ISO closing date, or null when the entry is a single occasion. */
  closesOn: string | null;
  /**
   * Human label for the date. When `opensOn` is null this carries the
   * floating description, e.g. "Super Bowl weekend".
   */
  dateLabel: string;
  /** Whether this occasion is streamed, convened, or an operating period. */
  mode: "streamed" | "convened" | "operating";
  phase: Phase;
  /** One-line description of what happens. */
  purpose: string;
  visibility: Visibility;
}

/**
 * The First Congress is NOT the start of Season 1. It is the invitation
 * mechanism. Season 1 begins 1 March 2027, after the Second Congress.
 */
export const LADDER: LadderEntry[] = [
  {
    id: "first-congress",
    season: null,
    label: "The First Congress",
    opensOn: "2026-11-01",
    closesOn: null,
    dateLabel: "November 1, 2026",
    mode: "streamed",
    phase: "invitation",
    purpose:
      "Reveal, announce, and invite. Streamed to ticket holders. You need an invitation to receive the invitation.",
    visibility: "public",
  },
  {
    id: "second-congress",
    season: null,
    label: "The Second Congress",
    opensOn: "2027-02-14",
    closesOn: null,
    dateLabel: "Super Bowl weekend 2027",
    mode: "convened",
    phase: "ratification",
    purpose:
      "Three hundred delegates convene at Gratitude Ranch to ratify Season 1.",
    visibility: "public",
  },
  {
    id: "season-1",
    season: 1,
    label: "Season One",
    opensOn: "2027-03-01",
    closesOn: "2027-09-30",
    dateLabel: "March 1 – September 30, 2027",
    mode: "operating",
    phase: "beta",
    purpose:
      "A short, intentional quasi-beta run on the existing operating platform.",
    visibility: "public",
  },
  {
    id: "owners-meeting-2028",
    season: null,
    label: "The Winter Owners Meeting",
    opensOn: null,
    closesOn: null,
    dateLabel: "Super Bowl weekend 2028",
    mode: "convened",
    phase: "ratification",
    purpose: "Ratify the rule changes that define Season Two.",
    visibility: "insider",
  },
  {
    id: "season-2",
    season: 2,
    label: "Season Two",
    opensOn: null,
    closesOn: null,
    dateLabel: "Following the 2028 Owners Meeting",
    mode: "operating",
    phase: "beta",
    purpose:
      "The second quasi-beta, operating under the rules ratified in Winter 2028.",
    visibility: "insider",
  },
  {
    id: "owners-meeting-2029",
    season: null,
    label: "The Winter Owners Meeting",
    opensOn: null,
    closesOn: null,
    dateLabel: "Super Bowl weekend 2029",
    mode: "convened",
    phase: "ratification",
    purpose: "Ratify Season Three.",
    visibility: "insider",
  },
  {
    id: "season-3",
    season: 3,
    label: "Season Three",
    opensOn: null,
    closesOn: null,
    dateLabel: "Following the 2029 Owners Meeting",
    mode: "operating",
    phase: "launch",
    purpose: "The fully fueled and vetted launch.",
    visibility: "insider",
  },
];

export function entry(id: string): LadderEntry {
  const found = LADDER.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown ladder entry: ${id}`);
  return found;
}

/** Entries a signed-out visitor may see. */
export const PUBLIC_LADDER = LADDER.filter((e) => e.visibility === "public");

export const FIRST_CONGRESS = entry("first-congress");
export const SECOND_CONGRESS = entry("second-congress");
export const SEASON_ONE = entry("season-1");

/** Where the Second Congress convenes. */
export const CONGRESS_VENUE = "Gratitude Ranch, Flower Mound, Texas";

/** Delegate capacity for the Second Congress. */
export const DELEGATE_CAPACITY = 300;

/** The convening entity. */
export const CONVENER = "United Stakeholders of America LLC";

/* ------------------------------------------------------------------ */
/* Seat license tiers — structure only. No pricing, no payment rail.   */
/* ------------------------------------------------------------------ */

export interface TicketTier {
  id: string;
  label: string;
  /** What the tier grants at the First Congress. */
  grants: string;
  /** Whether the tier carries a standing right to a delegate seat. */
  seatRight: boolean;
  /** Whether the license may be transferred, and on what terms. */
  transferable: "no" | "with-approval";
  /** How long the license runs. */
  term: string;
}

/**
 * Modeled on the NFL Personal Seat License: a one-time license that confers
 * the right to buy a seat, not the seat itself. We inherit the structure and
 * deliberately not the cash-extraction posture that its own inventor later
 * disowned. Holders here are referred, not captive.
 *
 * DECISION — tier definitions. No tier is priced or sold on this site.
 */
export const TICKET_TIERS: TicketTier[] = [
  {
    id: "observer",
    label: "Observer",
    grants: "Access to the First Congress stream.",
    seatRight: false,
    transferable: "no",
    term: "The First Congress only.",
  },
  {
    id: "stakeholder",
    label: "Stakeholder",
    grants:
      "Access to the First Congress stream, plus a standing right to a delegate seat at the Second Congress and priority in subsequent seasons.",
    seatRight: true,
    transferable: "with-approval",
    term: "Standing through Season Three.",
  },
];

export type TicketTierId = (typeof TICKET_TIERS)[number]["id"];
