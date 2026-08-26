import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LedgerRow = {
  id: string;
  title: string;
  task_class: string;
  actor: "human" | "agent";
  sprint_label: string | null;
  occurred_on: string;
  est_hours: number;
  act_hours: number;
  est_cost: number;
  act_cost: number;
  rework: number;
  outcome: "open" | "accepted" | "rejected";
  note: string;
  created_at: string;
};

const COLUMNS =
  "id, title, task_class, actor, sprint_label, occurred_on, est_hours, act_hours, est_cost, act_cost, rework, outcome, note, created_at";

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export const listLedger = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { data, error } = await context.supabase
      .from("task_ledger")
      .select(COLUMNS)
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to load the ledger");
    return { rows: (data ?? []) as LedgerRow[] };
  });

const taskInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  task_class: z.string().min(1).max(40).default("build"),
  actor: z.enum(["human", "agent"]).default("agent"),
  sprint_label: z.string().max(40).nullable().default(null),
  occurred_on: z.string().min(8).max(10),
  est_hours: z.number().nonnegative().default(0),
  act_hours: z.number().nonnegative().default(0),
  est_cost: z.number().nonnegative().default(0),
  act_cost: z.number().nonnegative().default(0),
  rework: z.number().int().nonnegative().default(0),
  outcome: z.enum(["open", "accepted", "rejected"]).default("open"),
  note: z.string().max(4000).default(""),
});

export const upsertTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => taskInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { id, ...payload } = data;
    if (id) {
      const { data: row, error } = await context.supabase
        .from("task_ledger")
        .update(payload)
        .eq("id", id)
        .select(COLUMNS)
        .single();
      if (error) throw new Error(error.message || "Failed to update the task");
      return { row: row as LedgerRow };
    }
    const { data: row, error } = await context.supabase
      .from("task_ledger")
      .insert({ ...payload, created_by: context.userId })
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to record the task");
    return { row: row as LedgerRow };
  });

export const deleteTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("task_ledger").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete the task");
    return { ok: true };
  });
