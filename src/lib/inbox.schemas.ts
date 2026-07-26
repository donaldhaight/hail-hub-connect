import { z } from "zod";

export const BRIEFING_STATUSES = ["pending", "approved", "declined"] as const;
export const CONFERENCE_STATUSES = ["applied", "invited", "confirmed", "declined"] as const;

export const updateBriefingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(BRIEFING_STATUSES),
  note: z.string().trim().max(2000).optional(),
});

export const updateConferenceStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(CONFERENCE_STATUSES),
  note: z.string().trim().max(2000).optional(),
});

export const listFiltersSchema = z.object({
  status: z.string().optional(),
  search: z.string().trim().max(120).optional(),
});

export type BriefingStatus = (typeof BRIEFING_STATUSES)[number];
export type ConferenceStatus = (typeof CONFERENCE_STATUSES)[number];
