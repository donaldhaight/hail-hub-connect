import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  position: z.coerce.number().int().min(0).max(999).default(0),
  timeLabel: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional().default(""),
  location: z.string().trim().max(200).optional().default(""),
  isPublished: z.coerce.boolean().default(true),
  segmentType: z.enum(["opening", "reveal", "announcement", "invitation", "performance", "closing", "segment"]).default("segment"),
  speaker: z.string().trim().max(200).optional().default(""),
  durationMinutes: z.coerce.number().int().min(0).max(999).default(0),
});

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export const listItineraryItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { data, error } = await context.supabase
      .from("conference_itinerary_items")
      .select("id, position, time_label, title, description, location, is_published, segment_type, speaker, duration_minutes, updated_at")
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const upsertItineraryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => itemSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const row = {
      position: data.position,
      time_label: data.timeLabel,
      title: data.title,
      description: data.description || null,
      location: data.location || null,
      is_published: data.isPublished,
      segment_type: data.segmentType,
      speaker: data.speaker || null,
      duration_minutes: data.durationMinutes,
    };
    if (data.id) {
      const { error } = await context.supabase
        .from("conference_itinerary_items")
        .update(row)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: inserted, error } = await context.supabase
      .from("conference_itinerary_items")
      .insert(row)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id };
  });

export const deleteItineraryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase
      .from("conference_itinerary_items")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
