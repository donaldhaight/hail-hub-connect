/**
 * The role vocabulary, client-safe.
 *
 * Two axes, kept deliberately separate — the collision between them is what
 * made groups too complicated in 2008.
 *
 *  - stakeholder : the Founding Stakeholder Groups. Requested, never self-granted.
 *  - entity      : operating roles inside the MarketApp (ISR, LC, PO, INSCO, IA).
 *                  These are certified, not requested.
 */

export type RoleAxis = "stakeholder" | "entity";

export type RoleCatalogRow = {
  key: string;
  name: string;
  axis: string;
  summary: string;
  detail: string;
  requestable: boolean;
  certifiable: boolean;
  fee_jbk: number;
  is_active: boolean;
  position: number;
};

export type RoleModuleRow = {
  id: string;
  role_key: string;
  position: number;
  title: string;
  summary: string;
  video_url: string | null;
  body: string;
  quiz_question: string;
  quiz_options: string[];
};

export const ACTIVE_ROLE_KEY = "prepareamerica.activeRole";

/** Display names for role tags that predate the catalog. */
export const LEGACY_ROLE_LABELS: Record<string, string> = {
  founder_admin: "Founder Admin",
  qualified_insider: "Qualified Insider",
  counsel: "Counsel",
  rrca_exec: "RRCA Executive",
  investor_prospect: "Investor Prospect",
  sponsor_prospect: "Sponsor Prospect",
  strategic_partner: "Strategic Partner",
  specialist_advisor: "Specialist Advisor",
  system_auditor: "System Auditor",
  interested_user: "Interested User",
  industry_observer: "Industry Observer",
  venture_tech: "VentureTech",
  systems_tech: "SystemsTech",
  legal_tech: "LegalTech",
  insure_tech: "InsureTech",
  fin_tech: "FinTech",
  construction_management: "Construction Management",
  business_development: "Business Development",
  isr: "Independent Sales Rep (ISR)",
};

export function roleLabel(key: string): string {
  return LEGACY_ROLE_LABELS[key] ?? key;
}

export const CERTIFICATION_REASON = "spent:certification";
