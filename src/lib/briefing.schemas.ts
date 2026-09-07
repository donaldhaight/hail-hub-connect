import { z } from "zod";

/**
 * One request, one vocabulary.
 *
 * A person is never asked to classify themselves. They tell us who they are and
 * what they are asking for; the Founder sets the Stakeholder Group at acceptance.
 */
export const ACCESS_ASKS = [
  {
    id: "briefing",
    label: "A private briefing",
    note: "A direct conversation about the restructuring and the proof of concept.",
  },
  {
    id: "conference",
    label: "An invitation to the Congress",
    note: "An invitation credential for the PrepareAmerica convening.",
  },
  {
    id: "both",
    label: "Both",
    note: "A briefing first, and an invitation if the fit is right.",
  },
] as const;

export type AccessAskId = (typeof ACCESS_ASKS)[number]["id"];

export const accessRequestSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  organization: z.string().trim().min(1, "Organization is required").max(160),
  title: z.string().trim().min(1, "Title / role is required").max(160),
  ask: z.enum(["briefing", "conference", "both"], {
    message: "Tell us what you are asking for",
  }),
  anchor: z
    .string()
    .optional()
    .transform((v) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : undefined)),
  context: z.string().trim().max(1500).optional(),
  acknowledged: z.literal("on", { message: "You must acknowledge the disclaimer" }),
});

export type AccessRequestInput = z.infer<typeof accessRequestSchema>;

/** Display labels for the ask recorded on a request row. */
export const ASK_LABELS: Record<string, string> = {
  briefing: "Private briefing",
  conference: "Congress invitation",
  both: "Briefing + invitation",
  // Values recorded before the forms merged.
  investor: "RRCA investor prospect",
  sponsor: "ClaimStore sponsor",
  partner: "Strategic industry partner",
  counsel: "Counsel",
  advisor: "Trusted advisor",
  "prepare-america": "Congress invitation",
  executive: "C-level executive",
  contractor: "Contractor",
  government: "Government / policy",
};

export function askLabel(id: string | null | undefined): string {
  if (!id) return "—";
  return ASK_LABELS[id] ?? id;
}
