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
  return roles as Set<string>;
}

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

const recordSchema = z.object({
  slug: z.string().min(1).max(80),
  reads: z
    .array(
      z.object({
        sectionId: z.string().uuid(),
        dwellMs: z.number().int().nonnegative().max(24 * 60 * 60 * 1000),
        confirmed: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const recordSectionReads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => recordSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const now = new Date().toISOString();

    // Fetch existing rows for these sections.
    const sectionIds = data.reads.map((r) => r.sectionId);
    const { data: existing } = await context.supabase
      .from("dossier_section_reads")
      .select("id, section_id, dwell_ms, read_confirmed_at")
      .eq("user_id", context.userId)
      .in("section_id", sectionIds);
    const bySection = new Map<string, any>();
    for (const r of (existing ?? []) as any[]) bySection.set(r.section_id, r);

    const inserts: any[] = [];
    const updates: Array<{ id: string; dwell_ms: number; confirmed?: boolean }> = [];
    for (const r of data.reads) {
      const cur = bySection.get(r.sectionId);
      if (!cur) {
        inserts.push({
          user_id: context.userId,
          dossier_slug: data.slug,
          section_id: r.sectionId,
          first_seen_at: now,
          last_seen_at: now,
          dwell_ms: r.dwellMs,
          read_confirmed_at: r.confirmed ? now : null,
        });
      } else {
        updates.push({
          id: cur.id,
          dwell_ms: (cur.dwell_ms ?? 0) + r.dwellMs,
          confirmed: r.confirmed && !cur.read_confirmed_at ? true : undefined,
        });
      }
    }

    if (inserts.length > 0) {
      const { error } = await context.supabase.from("dossier_section_reads").insert(inserts);
      if (error && !`${error.message}`.includes("duplicate")) {
        throw new Error(error.message || "Failed to record reads");
      }
    }
    for (const u of updates) {
      const patch: any = { dwell_ms: u.dwell_ms, last_seen_at: now };
      if (u.confirmed) patch.read_confirmed_at = now;
      await context.supabase.from("dossier_section_reads").update(patch).eq("id", u.id);
    }
    return { ok: true };
  });

const slugOnly = z.object({ slug: z.string().min(1).max(80) });

export const listMySectionReads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => slugOnly.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { data: rows, error } = await context.supabase
      .from("dossier_section_reads")
      .select("section_id, dwell_ms, read_confirmed_at, first_seen_at, last_seen_at")
      .eq("user_id", context.userId)
      .eq("dossier_slug", data.slug);
    if (error) throw new Error("Failed to load reads");
    const bySection: Record<
      string,
      { dwell_ms: number; read_confirmed_at: string | null; first_seen_at: string; last_seen_at: string }
    > = {};
    for (const r of (rows ?? []) as any[]) {
      bySection[r.section_id] = {
        dwell_ms: r.dwell_ms ?? 0,
        read_confirmed_at: r.read_confirmed_at ?? null,
        first_seen_at: r.first_seen_at,
        last_seen_at: r.last_seen_at,
      };
    }
    return { bySection };
  });

export const listSectionReadRollup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => slugOnly.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("dossier_section_reads")
      .select("section_id, user_id, dwell_ms, read_confirmed_at")
      .eq("dossier_slug", data.slug);
    if (error) throw new Error("Failed to load rollup");
    const bySection: Record<
      string,
      { readers: number; confirmed: number; totalDwellMs: number }
    > = {};
    for (const r of (rows ?? []) as any[]) {
      bySection[r.section_id] ??= { readers: 0, confirmed: 0, totalDwellMs: 0 };
      bySection[r.section_id].readers++;
      if (r.read_confirmed_at) bySection[r.section_id].confirmed++;
      bySection[r.section_id].totalDwellMs += r.dwell_ms ?? 0;
    }
    return { bySection };
  });

const heatmapSchema = z.object({ slug: z.string().min(1).max(80) });

export type HeatmapCell = {
  userId: string;
  email: string;
  sectionId: string;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  dwellMs: number;
  confirmedAt: string | null;
  state: "unseen" | "skimmed" | "read" | "confirmed";
};

export const getDossierReadHeatmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => heatmapSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [sectionsRes, readsRes] = await Promise.all([
      supabaseAdmin
        .from("dossier_sections")
        .select("id, position, heading")
        .eq("dossier_slug", data.slug)
        .order("position", { ascending: true }),
      supabaseAdmin
        .from("dossier_section_reads")
        .select("section_id, user_id, dwell_ms, first_seen_at, last_seen_at, read_confirmed_at")
        .eq("dossier_slug", data.slug),
    ]);

    if (sectionsRes.error) throw new Error("Failed to load sections");
    if (readsRes.error) throw new Error("Failed to load reads");

    const sections = (sectionsRes.data ?? []) as Array<{ id: string; position: number; heading: string }>;
    const reads = (readsRes.data ?? []) as Array<{
      section_id: string;
      user_id: string;
      dwell_ms: number;
      first_seen_at: string;
      last_seen_at: string;
      read_confirmed_at: string | null;
    }>;

    const userIds = Array.from(new Set(reads.map((r) => r.user_id)));
    const emailByUser: Record<string, string> = {};
    if (userIds.length > 0) {
      const results = await Promise.all(
        userIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }

    const cells: HeatmapCell[] = [];
    for (const r of reads) {
      const dwellMs = r.dwell_ms ?? 0;
      let state: HeatmapCell["state"] = "unseen";
      if (r.read_confirmed_at) {
        state = "confirmed";
      } else if (dwellMs >= 10000) {
        state = "read";
      } else if (dwellMs > 0 || r.first_seen_at) {
        state = "skimmed";
      }
      cells.push({
        userId: r.user_id,
        email: emailByUser[r.user_id] ?? "(unknown)",
        sectionId: r.section_id,
        firstSeenAt: r.first_seen_at,
        lastSeenAt: r.last_seen_at,
        dwellMs,
        confirmedAt: r.read_confirmed_at ?? null,
        state,
      });
    }

    return { sections, cells };
  });

const sectionSummarySchema = z.object({ slug: z.string().min(1).max(80), sectionId: z.string().uuid() });

export const getSectionReadSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => sectionSummarySchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("dossier_section_reads")
      .select("user_id, dwell_ms, first_seen_at, last_seen_at, read_confirmed_at")
      .eq("dossier_slug", data.slug)
      .eq("section_id", data.sectionId)
      .order("last_seen_at", { ascending: false });
    if (error) throw new Error("Failed to load section summary");

    const userIds = Array.from(new Set((rows ?? []).map((r: any) => r.user_id as string)));
    const emailByUser: Record<string, string> = {};
    if (userIds.length > 0) {
      const results = await Promise.all(
        userIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }

    return {
      readers: (rows ?? []).map((r: any) => ({
        userId: r.user_id as string,
        email: emailByUser[r.user_id] ?? "(unknown)",
        dwellMs: (r.dwell_ms ?? 0) as number,
        firstSeenAt: r.first_seen_at as string,
        lastSeenAt: r.last_seen_at as string,
        confirmedAt: (r.read_confirmed_at ?? null) as string | null,
      })),
    };
  });
