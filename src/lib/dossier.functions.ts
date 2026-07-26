import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertInsider(ctx: { supabase: any; userId: string }) {
  const { data: rows, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error("Authorization check failed");
  const roles = new Set((rows ?? []).map((r: { role: string }) => r.role));
  if (!roles.has("qualified_insider") && !roles.has("founder_admin")) {
    throw new Error("Forbidden");
  }
}

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

const openSchema = z.object({ slug: z.string().min(1).max(80) });

export const logDossierOpen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => openSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { error } = await context.supabase
      .from("insider_access_log")
      .insert({ user_id: context.userId, dossier_slug: data.slug });
    if (error) throw new Error("Failed to record open");
    return { ok: true };
  });

export const listMyDossierOpens = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("insider_access_log")
      .select("dossier_slug, opened_at")
      .eq("user_id", context.userId)
      .order("opened_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Failed to load opens");
    const lastBySlug: Record<string, string> = {};
    for (const r of (data ?? []) as Array<{ dossier_slug: string; opened_at: string }>) {
      if (!lastBySlug[r.dossier_slug]) lastBySlug[r.dossier_slug] = r.opened_at;
    }
    return { lastBySlug };
  });

export const listInsiderActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: opens, error } = await supabaseAdmin
      .from("insider_access_log")
      .select("id, user_id, dossier_slug, opened_at")
      .order("opened_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error("Failed to load activity");

    const userIds = Array.from(new Set((opens ?? []).map((o) => o.user_id)));
    const emailByUser: Record<string, string> = {};
    if (userIds.length > 0) {
      // Batch resolve emails via Auth admin API
      const results = await Promise.all(
        userIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }
    return {
      rows: (opens ?? []).map((o) => ({
        ...o,
        email: emailByUser[o.user_id] ?? "(unknown)",
      })),
    };
  });
