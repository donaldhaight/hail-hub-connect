import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ScenarioRow = {
  id: string;
  slug: string;
  name: string;
  peril: string;
  event_date: string;
  region: string;
  note: string;
  is_production: boolean;
  clock_steps: number;
  position: number;
};

export type VariableRow = {
  id: string;
  key: string;
  name: string;
  definition: string;
  unit: string;
  source: string;
  cadence: string;
  stakeholder: string;
  truth_label: string;
  confidentiality: string;
  headline: boolean;
  position: number;
};

export type SignalRow = {
  id: string;
  scenario_id: string;
  variable_key: string;
  state: string;
  county: string;
  clock_step: number;
  observed_at: string;
  value: number;
  confidence: number;
  provenance: string;
};

export type ViewQuery = {
  scenario?: string;
  q?: string;
  minConfidence?: number;
  step?: number;
};

export type SavedViewRow = {
  id: string;
  owner_id: string;
  name: string;
  lens: string;
  layout: string;
  query: ViewQuery;
  shared: boolean;
  created_at: string;
};

export type DemoScriptRow = {
  id: string;
  position: number;
  prompt: string;
  lens: string;
  scenario_slug: string;
  layout: string;
  speaking_note: string;
  truth_label: string;
  created_at: string;
  updated_at: string;
};

const SCENARIO_COLUMNS =
  "id, slug, name, peril, event_date, region, note, is_production, clock_steps, position";
const VARIABLE_COLUMNS =
  "id, key, name, definition, unit, source, cadence, stakeholder, truth_label, confidentiality, headline, position";
const SIGNAL_COLUMNS =
  "id, scenario_id, variable_key, state, county, clock_step, observed_at, value, confidence, provenance";
const VIEW_COLUMNS = "id, owner_id, name, lens, layout, query, shared, created_at";

/** Scenarios, the variable registry, and saved views. Cheap; loaded once. */
export const getRoomFrame = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [scenarios, variables, views] = await Promise.all([
      context.supabase.from("room_scenarios").select(SCENARIO_COLUMNS).order("position"),
      context.supabase.from("room_variables").select(VARIABLE_COLUMNS).order("position"),
      context.supabase
        .from("room_saved_views")
        .select(VIEW_COLUMNS)
        .order("created_at", { ascending: false }),
    ]);
    if (scenarios.error) throw new Error("Failed to load scenarios");
    if (variables.error) throw new Error("Failed to load the variable registry");
    return {
      scenarios: (scenarios.data ?? []) as ScenarioRow[],
      variables: (variables.data ?? []) as VariableRow[],
      views: (views.data ?? []) as SavedViewRow[],
      userId: context.userId,
    };
  });

/** Every signal for one scenario. Small enough to filter and replay client-side. */
export const getScenarioSignals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ scenarioId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("room_signals")
      .select(SIGNAL_COLUMNS)
      .eq("scenario_id", data.scenarioId)
      .order("clock_step", { ascending: true })
      .order("county", { ascending: true });
    if (error) throw new Error("Failed to load signals");
    return { signals: (rows ?? []) as SignalRow[] };
  });

export const saveRoomView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        name: z.string().min(1).max(80),
        lens: z.string().min(1).max(40),
        layout: z.string().min(1).max(20),
        query: z
          .object({
            scenario: z.string().optional(),
            q: z.string().optional(),
            minConfidence: z.number().optional(),
            step: z.number().optional(),
          })
          .default({}),
        shared: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("room_saved_views")
      .insert({
        owner_id: context.userId,
        name: data.name,
        lens: data.lens,
        layout: data.layout,
        query: data.query as Record<string, never>,
        shared: data.shared,
      })
      .select(VIEW_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to save the view");
    return { view: row as SavedViewRow };
  });

export const deleteRoomView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("room_saved_views").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete the view");
    return { ok: true };
  });

const DEMO_SCRIPT_COLUMNS =
  "id, position, prompt, lens, scenario_slug, layout, speaking_note, truth_label, created_at, updated_at";

/** The founder's run-of-show for the One Prompt Event. Ordered beats. */
export const getDemoScript = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("room_demo_script")
      .select(DEMO_SCRIPT_COLUMNS)
      .order("position", { ascending: true });
    if (error) throw new Error("Failed to load demo script");
    return { beats: (data ?? []) as DemoScriptRow[] };
  });
