import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const STATUSES = ["idea", "planned", "building", "shipped", "parked"] as const;

const createSchema = z.object({
  category: z.string().min(1).max(60),
  title: z.string().min(1).max(200),
  summary: z.string().max(400).default(""),
  detail: z.string().max(20000).default(""),
  status: z.enum(STATUSES).default("idea"),
  priority: z.number().int().min(1).max(4).default(2),
  sprint_label: z.string().max(60).nullable().default(null),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  category: z.string().min(1).max(60).optional(),
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(400).optional(),
  detail: z.string().max(20000).optional(),
  status: z.enum(STATUSES).optional(),
  priority: z.number().int().min(1).max(4).optional(),
  sprint_label: z.string().max(60).nullable().optional(),
});

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export const listBacklog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const [{ data: items, error: itemsErr }, { data: comments, error: commentsErr }] =
      await Promise.all([
        context.supabase
          .from("backlog_items")
          .select("*")
          .order("category", { ascending: true })
          .order("position", { ascending: true })
          .order("created_at", { ascending: true }),
        context.supabase
          .from("backlog_comments")
          .select("id, item_id, body, author_kind, created_at")
          .order("created_at", { ascending: true }),
      ]);
    if (itemsErr) throw new Error(itemsErr.message || "Failed to load backlog");
    if (commentsErr) throw new Error(commentsErr.message || "Failed to load discussion");
    return { items: items ?? [], comments: comments ?? [] };
  });

export const createBacklogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => createSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("backlog_items")
      .insert({ ...data, created_by: context.userId })
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to create item");
    return { item: row };
  });

export const updateBacklogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("backlog_items")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to update item");
    return { item: row };
  });

export const deleteBacklogItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("backlog_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete item");
    return { ok: true };
  });

export const addBacklogComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ item_id: z.string().uuid(), body: z.string().min(1).max(10000) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("backlog_comments")
      .insert({ item_id: data.item_id, body: data.body, author_id: context.userId, author_kind: "founder" })
      .select("id, item_id, body, author_kind, created_at")
      .single();
    if (error) throw new Error(error.message || "Failed to post note");
    return { comment: row };
  });

/** Mark an item as building and stamp who asked for it. */
export const requestBuild = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("backlog_items")
      .update({
        status: "building",
        build_requested_at: new Date().toISOString(),
        build_requested_by: context.userId,
      })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to request build");
    return { item: row };
  });

export const getConsoleCounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [requests, invitations, seats, broadcast] = await Promise.all([
      supabaseAdmin.from("briefing_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabaseAdmin.from("insider_invitations").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin
        .from("conference_applications")
        .select("id", { count: "exact", head: true })
        .eq("seat_status", "confirmed"),
      supabaseAdmin.from("broadcast_config").select("state").eq("id", "default").maybeSingle(),
    ]);
    return {
      openRequests: requests.count ?? 0,
      pendingInvitations: invitations.count ?? 0,
      confirmedSeats: seats.count ?? 0,
      broadcastState: (broadcast.data?.state as string) ?? "scheduled",
    };
  });
