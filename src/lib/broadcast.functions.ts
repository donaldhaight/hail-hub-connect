import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const VALID_PROVIDERS = ["youtube", "vimeo", "other"] as const;
const VALID_STATES = ["scheduled", "rehearsing", "live", "ended"] as const;

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
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

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

/** Public: the current broadcast state and published run of show. */
export const getBroadcastState = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [{ data: config, error: configErr }, { data: segments, error: segErr }] = await Promise.all([
    sb.from("broadcast_config").select("provider, stream_id, embed_url, replay_url, fallback_message, state, started_at, ended_at").eq("id", "default").maybeSingle(),
    sb
      .from("conference_itinerary_items")
      .select("id, position, time_label, title, description, location, segment_type, speaker, duration_minutes")
      .eq("is_published", true)
      .order("position", { ascending: true })
      .order("time_label", { ascending: true }),
  ]);
  if (configErr) throw new Error(configErr.message || "Failed to load broadcast state");
  if (segErr) throw new Error(segErr.message || "Failed to load run of show");
  return {
    config: config ?? {
      provider: "youtube",
      stream_id: null,
      embed_url: null,
      replay_url: null,
      fallback_message: "The stream will appear here when the session opens.",
      state: "scheduled",
      started_at: null,
      ended_at: null,
    },
    segments: segments ?? [],
  };
});

/** Founder-only: full config and checklist. */
export const getBroadcastConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: config, error: configErr }, { data: checklist, error: checkErr }] = await Promise.all([
      supabaseAdmin.from("broadcast_config").select("*").eq("id", "default").maybeSingle(),
      supabaseAdmin.from("broadcast_checklist").select("*").order("item_key", { ascending: true }),
    ]);
    if (configErr) throw new Error(configErr.message || "Failed to load config");
    if (checkErr) throw new Error(checkErr.message || "Failed to load checklist");
    return { config: config ?? null, checklist: checklist ?? [] };
  });

const updateConfigSchema = z.object({
  provider: z.enum(VALID_PROVIDERS),
  streamId: z.string().trim().max(200).optional().default(""),
  embedUrl: z.string().trim().max(1000).optional().default(""),
  replayUrl: z.string().trim().max(1000).optional().default(""),
  fallbackMessage: z.string().trim().max(1000).optional().default(""),
});

/** Founder-only: save stream provider and URLs. */
export const updateBroadcastConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateConfigSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("broadcast_config").upsert({
      id: "default",
      provider: data.provider,
      stream_id: data.streamId || null,
      embed_url: data.embedUrl || null,
      replay_url: data.replayUrl || null,
      fallback_message: data.fallbackMessage || "The stream will appear here when the session opens.",
      updated_at: new Date().toISOString(),
      updated_by: context.userId,
    });
    if (error) throw new Error(error.message || "Failed to save config");
    return { ok: true };
  });

const transitionSchema = z.object({
  state: z.enum(VALID_STATES),
});

/** Founder-only: move the broadcast state machine. */
export const transitionBroadcastState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => transitionSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    const update: {
      state: string;
      updated_at: string;
      updated_by: string;
      started_at?: string;
      ended_at?: string;
    } = { state: data.state, updated_at: now, updated_by: context.userId };
    if (data.state === "live") update.started_at = now;
    if (data.state === "ended") update.ended_at = now;
    const { error } = await supabaseAdmin.from("broadcast_config").update(update).eq("id", "default");
    if (error) throw new Error(error.message || "Failed to transition state");
    return { ok: true, state: data.state };
  });

const toggleCheckSchema = z.object({
  itemKey: z.string().trim().min(1),
  checked: z.coerce.boolean(),
});

/** Founder-only: verify the caller so the public broadcast page can render rehearsal mode. */
export const verifyFounderForRehearsal = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    return { ok: true };
  });

/** Founder-only: mark a production checklist item complete/incomplete. */
export const toggleBroadcastChecklist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => toggleCheckSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const update = data.checked
      ? { checked_at: new Date().toISOString(), checked_by: context.userId }
      : { checked_at: null, checked_by: null };
    const { error } = await supabaseAdmin.from("broadcast_checklist").update(update).eq("item_key", data.itemKey);
    if (error) throw new Error(error.message || "Failed to update checklist");
    return { ok: true };
  });
