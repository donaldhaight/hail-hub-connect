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

export const briefingRequestSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  organization: z.string().trim().min(1, "Organization is required").max(160),
  title: z.string().trim().min(1, "Title / role is required").max(160),
  interest: z.enum(
    ["investor", "sponsor", "partner", "counsel", "advisor", "prepare-america"],
    { message: "Select a primary interest" },
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
