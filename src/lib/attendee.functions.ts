import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const tokenSchema = z.object({ token: z.string().uuid() });

export const getAttendeeView = createServerFn({ method: "GET" })
  .validator((d: unknown) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: result, error } = await sb.rpc("get_attendee_view", { _token: data.token });
    if (error) throw new Error(error.message || "Failed to load attendee");
    return result as {
      ok: boolean;
      reason?: string;
      id?: string;
      name?: string;
      email?: string;
      organization?: string | null;
      seatStatus?: string;
      plusOnes?: number;
      hotelNeeded?: boolean;
      dietaryRestrictions?: string | null;
      attendeeNotes?: string | null;
      confirmedAt?: string | null;
    };
  });

const updateSchema = z.object({
  token: z.string().uuid(),
  plusOnes: z.coerce.number().int().min(0).max(3),
  hotelNeeded: z.coerce.boolean(),
  dietary: z.string().trim().max(1000).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const updateAttendeeDetails = createServerFn({ method: "POST" })
  .validator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: result, error } = await sb.rpc("update_attendee_details", {
      _token: data.token,
      _plus_ones: data.plusOnes,
      _hotel_needed: data.hotelNeeded,
      _dietary: data.dietary,
      _notes: data.notes,
    });
    if (error) throw new Error(error.message || "Failed to update");
    return result as { ok: boolean; reason?: string; plusOnes?: number };
  });

export const listPublishedItinerary = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("conference_itinerary_items")
    .select("id, position, time_label, title, description, location, segment_type, speaker, duration_minutes")
    .eq("is_published", true)
    .order("position", { ascending: true })
    .order("time_label", { ascending: true });
  if (error) throw new Error(error.message || "Failed to load itinerary");
  return { rows: data ?? [] };
});
