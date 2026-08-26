import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AssumptionRow = {
  id: string;
  key: string;
  stage: string;
  label: string;
  definition: string;
  unit: string;
  low: number;
  base: number;
  high: number;
  truth_label: string;
  source: string;
  position: number;
};

export type ProgramCostRow = {
  id: string;
  category: string;
  label: string;
  note: string;
  est_amount: number;
  act_amount: number;
  recurring: boolean;
  position: number;
};

export type CanvassRow = {
  id: string;
  state: string;
  county: string;
  precincts: number;
  cycles_covered: number;
  earliest_cycle: number;
  latest_cycle: number;
  records: number;
  registered_voters: number;
  turnout_rate: number;
  households: number;
  source: string;
  truth_label: string;
};

export type MissionTrackRow = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  purpose: string;
  note: string;
  status: string;
  truth_label: string;
  position: number;
};

const ASSUMPTION_COLUMNS =
  "id, key, stage, label, definition, unit, low, base, high, truth_label, source, position";
const COST_COLUMNS = "id, category, label, note, est_amount, act_amount, recurring, position";
const CANVASS_COLUMNS =
  "id, state, county, precincts, cycles_covered, earliest_cycle, latest_cycle, records, registered_voters, turnout_rate, households, source, truth_label";
const TRACK_COLUMNS = "id, slug, name, kind, purpose, note, status, truth_label, position";

/** Everything the economics and canvass surfaces need. Small; loaded once. */
export const getEconomicsFrame = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [assumptions, costs, canvass, tracks] = await Promise.all([
      context.supabase.from("economics_assumptions").select(ASSUMPTION_COLUMNS).order("position"),
      context.supabase.from("program_costs").select(COST_COLUMNS).order("position"),
      context.supabase.from("canvass_coverage").select(CANVASS_COLUMNS).order("county"),
      context.supabase.from("mission_tracks").select(TRACK_COLUMNS).order("position"),
    ]);
    if (assumptions.error) throw new Error("Failed to load assumptions");
    if (costs.error) throw new Error("Failed to load program costs");
    if (canvass.error) throw new Error("Failed to load canvass coverage");
    return {
      assumptions: (assumptions.data ?? []).map((r: AssumptionRow) => ({
        ...r,
        low: Number(r.low),
        base: Number(r.base),
        high: Number(r.high),
      })) as AssumptionRow[],
      costs: (costs.data ?? []).map((r: ProgramCostRow) => ({
        ...r,
        est_amount: Number(r.est_amount),
        act_amount: Number(r.act_amount),
      })) as ProgramCostRow[],
      canvass: (canvass.data ?? []).map((r: CanvassRow) => ({
        ...r,
        records: Number(r.records),
        registered_voters: Number(r.registered_voters),
        households: Number(r.households),
        turnout_rate: Number(r.turnout_rate),
      })) as CanvassRow[],
      tracks: (tracks.data ?? []) as MissionTrackRow[],
    };
  });

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

const assumptionSchema = z.object({
  key: z.string().min(1),
  stage: z.string().min(1),
  label: z.string().min(1),
  definition: z.string().min(1),
  unit: z.string().min(1),
  low: z.number().nonnegative(),
  base: z.number().nonnegative(),
  high: z.number().nonnegative(),
  truth_label: z.string().min(1),
  source: z.string().min(1),
  position: z.number().int(),
});

export const updateAssumption = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        ...assumptionSchema.shape,
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { id, ...payload } = data;
    const { data: row, error } = await context.supabase
      .from("economics_assumptions")
      .update(payload)
      .eq("id", id)
      .select(ASSUMPTION_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to update the assumption");
    return { row: row as AssumptionRow };
  });

export const createAssumption = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => assumptionSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("economics_assumptions")
      .insert(data)
      .select(ASSUMPTION_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to create the assumption");
    return { row: row as AssumptionRow };
  });

export const deleteAssumption = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("economics_assumptions").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete the assumption");
    return { ok: true };
  });
