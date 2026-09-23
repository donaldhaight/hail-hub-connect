/**
 * The Surface and Door Registry.
 *
 * Founder ruling, 2026-09-23 (ADR-029): the new Interest Doors were never meant
 * to replace the existing website. Many intentional Doors. Clearly named
 * purposes. One continuing person. One shared platform.
 *
 * Intentional multiplicity, unlabelled, reads as accidental duplication. This
 * registry is the label. Every public route declares what job it performs, what
 * it points into, and — where two surfaces carry the same venture name on
 * purpose — how they differ.
 *
 * Nothing here retires, redirects or renames anything. It is a reading surface.
 */

export type SurfaceType =
  | "Movement"
  | "Narrative"
  | "Architecture"
  | "Brand card"
  | "Interest Door"
  | "Capture"
  | "Platform"
  | "Corpus";

export type SurfaceStatus =
  | "established"
  | "preseason"
  | "simulation"
  | "proposed";

export interface Surface {
  route: string;
  name: string;
  type: SurfaceType;
  audience: string;
  purpose: string;
  /** Where the controlling words come from. */
  source: string;
  cta: string;
  destination: string;
  status: SurfaceStatus;
  /** Does this surface capture arrival context? */
  capturesContext: boolean;
  /** Other surfaces expressing the same venture, and how this one differs. */
  siblings?: string;
}

export const SURFACE_TYPE_JOB: Record<SurfaceType, string> = {
  Movement: "The mission, the event, the master invitation.",
  Narrative:
    "The five-message spine — RRCA, the correction, ClaimExpress, ClaimStore, United Stakeholders.",
  Architecture: "Stakeholder geometry, roles, counties, governance.",
  "Brand card": "The vertical, brand and domain within the architecture.",
  "Interest Door":
    "One market problem, one focused message, one measurable way in.",
  Capture: "The Interested User routine — the need and the entry context.",
  Platform: "The continuing relationship, inside the shared record.",
  Corpus: "How the surfaces explain and govern one another.",
};

export const SURFACE_STATUS_LABEL: Record<SurfaceStatus, string> = {
  established: "Established infrastructure",
  preseason: "Preseason experiment",
  simulation: "Simulation content",
  proposed: "Proposed — not built",
};

const CAPTURE = "/request-briefing — the Interested User routine";
const PLATFORM = "Kimosabe, the holding file, then App Home";

export const SURFACES: Surface[] = [
  // ---------------------------------------------------------------- Movement
  {
    route: "/",
    name: "PrepareAmerica",
    type: "Movement",
    audience: "Everyone arriving at the front of the house",
    purpose:
      "Restructure one real contractor, document every correction, prove a better process, then ask whether it can become a standard.",
    source: "Founder narrative · the five-message spine",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/prepare-america",
    name: "The First Congress",
    type: "Movement",
    audience: "Invited attendees and applicants",
    purpose:
      "The November 1 convening: the reveal, the seats, and the ladder toward the Second Congress.",
    source: "Founder narrative · the event plan",
    cta: "Request a seat",
    destination: "/prepare-america/confirmed and the founder queue",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/why-prepare-america",
    name: "Why PrepareAmerica",
    type: "Movement",
    audience: "People deciding whether the convening is for them",
    purpose: "Why 300 seats, why this room, why now.",
    source: "Founder narrative",
    cta: "Request a seat",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },

  // --------------------------------------------------------------- Narrative
  {
    route: "/briefing",
    name: "The Briefing",
    type: "Narrative",
    audience: "Executives, capital, policy readers",
    purpose:
      "The five layers in sequence: RRCA, the restructuring, ClaimExpress, ClaimStore, United Stakeholders.",
    source: "Founder narrative · the corpus",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/why-rrca",
    name: "Why RRCA",
    type: "Narrative",
    audience: "Readers asking why this company",
    purpose: "Names the animal: an industry restructuring, not another product.",
    source: "Founder narrative",
    cta: "Read on",
    destination: "/industry-problem",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/industry-problem",
    name: "The Industry Problem",
    type: "Narrative",
    audience: "Readers who need the diagnosis before the remedy",
    purpose: "Twenty-five years of pattern recognition, compressed.",
    source: "Founder narrative",
    cta: "Read on",
    destination: "/proof-of-concept",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/proof-of-concept",
    name: "Proof of Concept",
    type: "Narrative",
    audience: "Readers weighing credibility",
    purpose: "ClaimExpress as the working precedent before the vision expands.",
    source: "Founder narrative",
    cta: "Read on",
    destination: "/vision",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/vision",
    name: "The Vision",
    type: "Narrative",
    audience: "Readers who have earned the larger picture",
    purpose:
      "The integrated capital and coordination network the proof points toward.",
    source: "Founder narrative",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/founder",
    name: "Founder Statement",
    type: "Narrative",
    audience: "Everyone",
    purpose: "Sole ownership, the right to pivot, and the method.",
    source: "Founder voice",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/investors",
    name: "For Investors",
    type: "Narrative",
    audience: "Capital",
    purpose: "Where venture dollars fit inside a foundry structure.",
    source: "Founder narrative · preview copy, counsel gate applies",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/policy",
    name: "For Policy & Government",
    type: "Narrative",
    audience: "Agencies, think tanks, elected officials",
    purpose: "A standardized disaster-recovery protocol, written for policy.",
    source: "Founder narrative",
    cta: "Request a private briefing",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },

  // ------------------------------------------------------------ Architecture
  {
    route: "/architecture",
    name: "The Architecture",
    type: "Architecture",
    audience: "Readers who want the machine, not the message",
    purpose:
      "Stakeholder geometry, the role spine, counties, and how governance resists capture.",
    source: "docs/law/ARCHITECTURE.md",
    cta: "Explore the groups",
    destination: "The /b/<slug> brand cards",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/roles",
    name: "The Role Store",
    type: "Architecture",
    audience: "People asking what position they could hold",
    purpose:
      "What each certified position is, what it requires, and who grants it. Nobody self-certifies.",
    source: "docs/law/SHARED-SPINE.md · ADR-015",
    cta: "Request access",
    destination: CAPTURE,
    status: "established",
    capturesContext: false,
  },
  {
    route: "/first-congress",
    name: "First Congress",
    type: "Architecture",
    audience: "Credential holders and observers",
    purpose: "The run of show and the convening record.",
    source: "docs/work/SPRINTS.md · the event plan",
    cta: "Hold your credential",
    destination: "/ticket/$credential",
    status: "established",
    capturesContext: false,
  },

  // ------------------------------------------------------------- Brand cards
  {
    route: "/b/united-stakeholders",
    name: "United Stakeholders",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose:
      "The governance and oversight position — and the intentional eighth container holding the portfolio.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "Deliberately excluded from the seven-Door execution set until the portfolio baselines exist.",
  },
  {
    route: "/b/market-applications",
    name: "Market Applications",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose: "The engineering arm — the software layer the groups coordinate through.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "An Interest Door at /market-applications is planned last, after the pattern is proven.",
  },
  {
    route: "/b/buddy-claim",
    name: "Buddy Claim",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose: "The legal and resolution position within the geometry.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "/buddy-claim is the market-facing Door. This card explains the position; the Door speaks to the person in the middle of a claim.",
  },
  {
    route: "/b/selfinsurity",
    name: "SelfInsurity",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose: "The insurance-expertise position within the geometry.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "A message-only Interest Door is planned; Property screens stay behind the Records gate.",
  },
  {
    route: "/b/claimstore",
    name: "ClaimStore — Banking",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose:
      "ClaimStore's position in the Human Blockchain: financial rails, and its relationship to ClaimsBank, ClaimLoan and ClaimCoin.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "Intentionally distinct from /claimstore. This card is the architectural and financial-rails expression. The Door is the market-positioning expression. Neither supersedes the other; both point into the same Interested User routine.",
  },
  {
    route: "/b/rrca",
    name: "RRCA",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose: "The field-operations anchor and the live case study.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "An Interest Door is planned with Strategic Partner or Advisor language. No public capital intake until counsel approves.",
  },
  {
    route: "/b/kimosabe",
    name: "Kimosabe",
    type: "Brand card",
    audience: "Readers inside the architecture",
    purpose: "The centre of the geometry — the personal protocol layer.",
    source: "src/content/brands.ts",
    cta: "Read the architecture",
    destination: "/architecture",
    status: "established",
    capturesContext: false,
    siblings:
      "/kimosabe is the working Door. The card explains the position; the Door opens a file.",
  },

  // ----------------------------------------------------------- Interest Doors
  {
    route: "/kimosabe",
    name: "Kimosabe",
    type: "Interest Door",
    audience: "Anyone, with no email and no form",
    purpose:
      "Ask one question; a file opens in your name and is still yours at every other Door.",
    source: "src/content/personas.ts · docs/strategy/KIMOSABE-POSITIONING.md",
    cta: "Ask",
    destination: PLATFORM,
    status: "established",
    capturesContext: true,
    siblings: "See /b/kimosabe for the architectural expression.",
  },
  {
    route: "/buddy-claim",
    name: "Buddy Claim",
    type: "Interest Door",
    audience: "A person in the middle of a claim",
    purpose: "Somebody on your side of the record.",
    source: "src/content/personas.ts",
    cta: "Ask",
    destination: PLATFORM,
    status: "established",
    capturesContext: true,
    siblings:
      "Positioning sections have not yet been folded in. See /b/buddy-claim for the architectural expression.",
  },
  {
    route: "/claimstore",
    name: "ClaimStore — the market record",
    type: "Interest Door",
    audience: "Property owners, contractors, adjusters, capital, observers",
    purpose:
      "One claim. One operating record. Every authorized party knows what comes next. The first preseason Interest Door.",
    source:
      "Positioning report, 2026-09-22 · persona record · promise version ClaimStore Door v0.1",
    cta: "Ask, or state an interest and request a briefing",
    destination: `${PLATFORM} · ${CAPTURE}`,
    status: "preseason",
    capturesContext: true,
    siblings:
      "Intentionally distinct from /b/claimstore. The card explains ClaimStore's banking position in the architecture; this Door makes the market case and converts an Interested User. Both are valid.",
  },
  {
    route: "/selfinsurity",
    name: "SelfInsurity",
    type: "Interest Door",
    audience: "Property owners and carriers",
    purpose:
      "Message-only Door. Property relationship, address confirmation and walk-through stay behind the Records gate.",
    source: "Positioning report, 2026-09-22",
    cta: "Request a briefing",
    destination: CAPTURE,
    status: "proposed",
    capturesContext: false,
  },
  {
    route: "/rrca",
    name: "RRCA",
    type: "Interest Door",
    audience: "Operators, strategic partners, advisors",
    purpose:
      "The operating proof, told as a market case. Strategic Partner or Advisor only — no public capital intake.",
    source: "Positioning report, 2026-09-22 · counsel gate applies",
    cta: "Request a briefing",
    destination: CAPTURE,
    status: "proposed",
    capturesContext: false,
  },
  {
    route: "/national-roofing-army",
    name: "National Roofing Army",
    type: "Interest Door",
    audience: "Contractors",
    purpose:
      "A visibly proposed contractor-aligned roofing readiness network. No members, counties, deployments or coverage claimed.",
    source: "Positioning report, 2026-09-22",
    cta: "Register interest",
    destination: CAPTURE,
    status: "proposed",
    capturesContext: false,
  },
  {
    route: "/market-applications",
    name: "Market Applications",
    type: "Interest Door",
    audience: "Technology partners",
    purpose: "Planned last, after the shared Door pattern is proven.",
    source: "Positioning report, 2026-09-22",
    cta: "Request a briefing",
    destination: CAPTURE,
    status: "proposed",
    capturesContext: false,
  },
  {
    route: "/offer/$slug",
    name: "Phase 1 offers",
    type: "Interest Door",
    audience: "Builder, owner and contractor tracks",
    purpose:
      "One narrated offer per track, labelled SIMULATION. Not a commercial commitment.",
    source: "src/content/funnels.ts · docs/strategy/PHASE-1-FUNNEL.md",
    cta: "Request a briefing",
    destination: CAPTURE,
    status: "simulation",
    capturesContext: false,
  },

  // ----------------------------------------------------------------- Capture
  {
    route: "/request-briefing",
    name: "The Interested User routine",
    type: "Capture",
    audience: "Anyone who has decided to raise a hand",
    purpose:
      "The need, in the person's own words, plus the Door they came through and the interest they stated. Interest is never authority.",
    source: "src/components/access/AccessRequestForm.tsx",
    cta: "Send",
    destination: "The founder queue at /admin/queue",
    status: "established",
    capturesContext: true,
  },
  {
    route: "/auth",
    name: "Sign in",
    type: "Capture",
    audience: "People with an account or an invitation",
    purpose: "The boundary between the public house and the platform.",
    source: "Auth integration",
    cta: "Sign in",
    destination: "App Home",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/invitation/$credential",
    name: "Invitation",
    type: "Capture",
    audience: "Invited insiders",
    purpose: "A single-use credential the founder issued personally.",
    source: "Founder queue",
    cta: "Accept",
    destination: "App Home",
    status: "established",
    capturesContext: false,
  },

  // ---------------------------------------------------------------- Platform
  {
    route: "/app",
    name: "App Home",
    type: "Platform",
    audience: "Everyone who has a file",
    purpose:
      "The continuing relationship: the person's tasks, their wallet, their ledger, their next step.",
    source: "src/lib/apphome.server.ts",
    cta: "Continue",
    destination: "Roles, records, the ledger",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/app/activity",
    name: "Your activity",
    type: "Platform",
    audience: "The person themselves",
    purpose: "Their own ledger lines and settled tasks. Nobody else's.",
    source: "src/lib/ledger.functions.ts",
    cta: "—",
    destination: "—",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/ledger",
    name: "The Efficiency Ledger",
    type: "Platform",
    audience: "Qualified insiders",
    purpose: "Append-only history. No administrator rewrites it.",
    source: "src/lib/ledger.functions.ts",
    cta: "—",
    destination: "—",
    status: "established",
    capturesContext: false,
  },

  // ------------------------------------------------------------------ Corpus
  {
    route: "/manual",
    name: "The Owner's Manual",
    type: "Corpus",
    audience: "Qualified insiders and the founder",
    purpose:
      "How the system must operate, and the narrative of how it got that way. Behind the login on purpose.",
    source: "manual_chapters, editable in place",
    cta: "Read",
    destination: "/manual/$slug",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/admin/screens",
    name: "The Screen Book",
    type: "Corpus",
    audience: "Founder",
    purpose:
      "Every page, view and report as a row: purpose, permissions, records, actions, evidence, status, previous state.",
    source: "screen_pages and its append-only revisions",
    cta: "Open a screen",
    destination: "/admin/screens/$pageId",
    status: "established",
    capturesContext: false,
  },
  {
    route: "/admin/surfaces",
    name: "The Surface and Door Registry",
    type: "Corpus",
    audience: "Founder",
    purpose:
      "What every public surface is for, and where two surfaces express the same venture on purpose.",
    source: "src/content/surfaces.ts · ADR-029",
    cta: "—",
    destination: "—",
    status: "preseason",
    capturesContext: false,
  },
];

export const SURFACE_TYPE_ORDER: SurfaceType[] = [
  "Movement",
  "Narrative",
  "Architecture",
  "Brand card",
  "Interest Door",
  "Capture",
  "Platform",
  "Corpus",
];
