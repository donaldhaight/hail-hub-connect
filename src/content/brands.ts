/**
 * The Human Blockchain — Brand Registry
 *
 * Seven stakeholder groups (Metatron 7-position model) plus four unnamed
 * Constitutional Guardrails ("Angels"). Encoded in the Three-Layer Reveal
 * order: Vertical → Brand → Domain.
 *
 * This registry drives:
 *  - The seven /b/<slug> public front doors
 *  - The Human Blockchain switcher in the header
 *  - The /architecture page's 7-position diagram
 */
export type BrandVertical =
  | "Foundation"
  | "Tech"
  | "Legal"
  | "Insurance"
  | "Banking"
  | "Construction"
  | "Center";

export type BrandStatus = "Operational" | "In Design" | "Conceptual";

export interface Brand {
  id: string;
  slug: string;
  vertical: BrandVertical;
  verticalRole: string;
  brandName: string;
  domain: string;
  tagline: string;
  oneLineValue: string;
  status: BrandStatus;
  paletteToken: string;
  positionInGeometry: string;
}

export const BRANDS: Brand[] = [
  {
    id: "united-stakeholders",
    slug: "united-stakeholders",
    vertical: "Foundation",
    verticalRole: "Governance & oversight",
    brandName: "United Stakeholders",
    domain: "unitedstakeholders.org",
    tagline: "The constitutional framework of the network.",
    oneLineValue:
      "Provides the governance, dispute resolution, and stakeholder architecture that ensures the coordination protocol remains uncaptured.",
    status: "Conceptual",
    paletteToken: "emerald",
    positionInGeometry: "North — Foundation node",
  },
  {
    id: "market-applications",
    slug: "market-applications",
    vertical: "Tech",
    verticalRole: "The engineering arm",
    brandName: "Market Applications",
    domain: "marketapplications.io",
    tagline: "The digital backbone that coordinates every group.",
    oneLineValue:
      "Platform engineering, data infrastructure, and the software layer through which claims, evidence, and payments move.",
    status: "In Design",
    paletteToken: "electric",
    positionInGeometry: "Northwest — Tech node",
  },
  {
    id: "buddy-claim",
    slug: "buddy-claim",
    vertical: "Legal",
    verticalRole: "Resolution infrastructure · Market spokesperson",
    brandName: "Buddy Claim",
    domain: "buddyclaim.com",
    tagline: "Somebody on your side of the record.",
    oneLineValue:
      "The legal and compliance layer that resolves disputes and protects the homeowner — and the market-facing voice of SelfInsurity and the ClaimStore vision, running the same front-door engine as Kimosabe with an insurance-restoration face.",
    status: "In Design",
    paletteToken: "burgundy",
    positionInGeometry: "Northeast — Legal node",
  },
  {
    id: "selfinsurity",
    slug: "selfinsurity",
    vertical: "Insurance",
    verticalRole: "Market expertise",
    brandName: "SelfInsurity",
    domain: "selfinsurity.com",
    tagline: "Carrier fluency built from twenty-five years in the field.",
    oneLineValue:
      "Deep carrier relations, claims-management discipline, and the insurance domain expertise that underwrites the whole system.",
    status: "In Design",
    paletteToken: "steel",
    positionInGeometry: "Southwest — Insurance node",
  },
  {
    id: "claimstore",
    slug: "claimstore",
    vertical: "Banking",
    verticalRole: "Financial rails",
    brandName: "ClaimStore",
    domain: "claimstore.com",
    tagline: "The neutral coordination and payments layer.",
    oneLineValue:
      "The marketplace, payment rails, and capital movement infrastructure — ClaimsBank, ClaimLoan, ClaimCoin — that eliminates cash-flow bottlenecks.",
    status: "In Design",
    paletteToken: "teal",
    positionInGeometry: "South — Banking node",
  },
  {
    id: "rrca",
    slug: "rrca",
    vertical: "Construction",
    verticalRole: "Field operations · 25-year anchor",
    brandName: "RRCA",
    domain: "rrcausa.com",
    tagline: "The operating contractor being restructured in public.",
    oneLineValue:
      "The twenty-five-year field-operations anchor: labor coordination, physical project delivery, and the live case study every other layer inherits from.",
    status: "Operational",
    paletteToken: "sienna",
    positionInGeometry: "Southeast — Construction node",
  },
  {
    id: "kimosabe",
    slug: "kimosabe",
    vertical: "Center",
    verticalRole: "Connective intelligence · The scout · Onboarding engine",
    brandName: "Kimosabe",
    domain: "kimosabe.ai",
    tagline: "The scout who walks ahead.",
    oneLineValue:
      "The personal protocol layer at the center of the geometry: one portable file, one append-only ledger, and a guide that changes shape for whatever market you are standing in — never splitting the person's record to do it.",
    status: "In Design",
    paletteToken: "ochre",
    positionInGeometry: "Center — Kimosabe node",
  },
];

export const VERTICAL_ORDER: BrandVertical[] = [
  "Foundation",
  "Tech",
  "Legal",
  "Insurance",
  "Banking",
  "Construction",
  "Center",
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
