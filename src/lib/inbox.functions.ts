import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  updateBriefingStatusSchema,
  updateConferenceStatusSchema,
  listFiltersSchema,
} from "./inbox.schemas";

async function assertFounder(ctx: {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> };
  userId: string;
}) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export const claimFounderIfUnclaimed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "founder_admin");
    if (countErr) throw new Error("Unable to check role state");
    if ((count ?? 0) > 0) return { claimed: false };
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "founder_admin" });
    if (insErr) throw new Error("Unable to claim founder role");
    return { claimed: true };
  });

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error("Failed to load roles");
    return { roles: (data ?? []).map((r) => r.role as string) };
  });

export const listBriefingRequests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listFiltersSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("briefing_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`name.ilike.${s},email.ilike.${s},organization.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load briefing requests");
    return { rows: rows ?? [] };
  });

export const listConferenceApplications = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listFiltersSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("conference_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`name.ilike.${s},email.ilike.${s},organization.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load conference applications");
    return { rows: rows ?? [] };
  });

export const updateBriefingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateBriefingStatusSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("briefing_requests")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error("Failed to update status");
    await supabaseAdmin.from("briefing_request_events").insert({
      briefing_request_id: data.id,
      actor_id: context.userId,
      action: `status:${data.status}`,
      note: data.note ?? null,
    });
    // Applicant notification email is wired once a Lovable email domain is configured.
    return { ok: true };
  });

export const updateConferenceStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateConferenceStatusSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("conference_applications")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error("Failed to update status");
    return { ok: true };
  });

export const updateBriefingNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    updateBriefingStatusSchema.pick({ id: true }).extend(updateBriefingStatusSchema.pick({ note: true }).shape).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("briefing_requests")
      .update({ internal_notes: data.note ?? null, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error("Failed to save notes");
    return { ok: true };
  });
