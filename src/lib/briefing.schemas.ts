import { z } from "zod";

export const INTERESTS = [
  { id: "investor", label: "RRCA investor prospect" },
  { id: "sponsor", label: "ClaimStore sponsor" },
  { id: "partner", label: "Strategic industry partner" },
  { id: "counsel", label: "Counsel · construction / restructuring / securities" },
  { id: "advisor", label: "Trusted advisor" },
  { id: "prepare-america", label: "PrepareAmerica Conference applicant" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];

/** The Stakeholder Groups a person may request. Interested User is never requested. */
export const REQUESTABLE_ROLES = [
  { id: "industry_observer", label: "Industry Observer" },
  { id: "venture_tech", label: "VentureTech" },
  { id: "systems_tech", label: "SystemsTech" },
  { id: "legal_tech", label: "LegalTech" },
  { id: "insure_tech", label: "InsureTech" },
  { id: "fin_tech", label: "FinTech" },
  { id: "construction_management", label: "Construction Management" },
  { id: "business_development", label: "Business Development" },
] as const;

export type RequestableRoleId = (typeof REQUESTABLE_ROLES)[number]["id"];

export const briefingRequestSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  organization: z.string().trim().min(1, "Organization is required").max(160),
  title: z.string().trim().min(1, "Title / role is required").max(160),
  interest: z.enum(
    ["investor", "sponsor", "partner", "counsel", "advisor", "prepare-america"],
    { message: "Select a primary interest" },
  ),
  requestedRole: z
    .enum([
      "industry_observer",
      "venture_tech",
      "systems_tech",
      "legal_tech",
      "insure_tech",
      "fin_tech",
      "construction_management",
      "business_development",
    ])
    .optional(),
  anchor: z
    .string()
    .optional()
    .transform((v) =>
      v && /^[0-9a-f-]{36}$/i.test(v) ? v : undefined,
    ),
  context: z.string().trim().max(1500).optional(),
  acknowledged: z.literal("on", { message: "You must acknowledge the disclaimer" }),
});

export type BriefingRequestInput = z.infer<typeof briefingRequestSchema>;


export const CONFERENCE_CATEGORIES = [
  { id: "executive", label: "C-level industry executive" },
  { id: "investor", label: "Institutional investor / venture capital" },
  { id: "contractor", label: "Contractor with capital" },
  { id: "government", label: "Government / policy / think tank" },
  { id: "counsel", label: "Counsel — construction / restructuring / securities" },
  { id: "advisor", label: "Strategic advisor / partner" },
] as const;

export type ConferenceCategoryId = (typeof CONFERENCE_CATEGORIES)[number]["id"];

export const conferenceApplicationSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  organization: z.string().trim().min(1, "Organization is required").max(160),
  title: z.string().trim().min(1, "Title / role is required").max(160),
  category: z.enum(
    ["executive", "investor", "contractor", "government", "counsel", "advisor"],
    { message: "Select a category" },
  ),
  referral: z.string().trim().max(200).optional(),
  context: z.string().trim().max(1500).optional(),
  acknowledged: z.literal("on", { message: "You must acknowledge the disclaimer" }),
});

export type ConferenceApplicationInput = z.infer<typeof conferenceApplicationSchema>;
