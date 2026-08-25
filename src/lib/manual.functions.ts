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

const CHAPTER_COLUMNS =
  "id, slug, part, position, number_label, title, subtitle, truth, confidentiality, body, draft_status, pull_quote, provenance_note, updated_at";

export const listManualChapters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("manual_chapters")
      .select(CHAPTER_COLUMNS)
      .order("position", { ascending: true });
    if (error) throw new Error("Failed to load the manual");
    return { chapters: data ?? [] };
  });

export const listManualGlossary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("manual_glossary")
      .select("id, term, definition, see_also")
      .order("term", { ascending: true });
    if (error) throw new Error("Failed to load the glossary");
    return { terms: data ?? [] };
  });

export const getManualChapter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { data: rows, error } = await context.supabase
      .from("manual_chapters")
      .select(CHAPTER_COLUMNS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error("Failed to load the chapter");
    const { data: nav } = await context.supabase
      .from("manual_chapters")
      .select("slug, title, position, part")
      .order("position", { ascending: true });
    const { data: terms } = await context.supabase
      .from("manual_glossary")
      .select("id, term, definition, see_also")
      .order("term", { ascending: true });
    return { chapter: rows ?? null, nav: nav ?? [], terms: terms ?? [] };
  });

const updateSchema = z.object({
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).nullable().optional(),
  truth: z
    .enum(["FACT", "ASSERTION", "DECISION", "HYPOTHESIS", "SIMULATION", "OPEN"])
    .optional(),
  confidentiality: z.enum(["C0", "C1", "C2", "C3", "C4"]).optional(),
  body: z.string().max(40000).optional(),
  draft_status: z.enum(["outline", "drafting", "review", "final"]).optional(),
  pull_quote: z.string().max(400).nullable().optional(),
  provenance_note: z.string().max(600).nullable().optional(),
});

export const updateManualChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { slug, ...patch } = data;
    const fields = Object.entries(patch).filter(([, v]) => v !== undefined);
    if (fields.length === 0) return { ok: true };

    const { data: before, error: readError } = await context.supabase
      .from("manual_chapters")
      .select(CHAPTER_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();
    if (readError || !before) throw new Error("Chapter not found");

    const { error } = await context.supabase
      .from("manual_chapters")
      .update(Object.fromEntries(fields) as never)
      .eq("slug", slug);
    if (error) throw new Error("Failed to save the chapter");

    const edits = fields
      .filter(([k, v]) => String((before as Record<string, unknown>)[k] ?? "") !== String(v ?? ""))
      .map(([k, v]) => ({
        chapter_slug: slug,
        field: k,
        old_value: String((before as Record<string, unknown>)[k] ?? ""),
        new_value: String(v ?? ""),
        edited_by: context.userId,
      }));
    if (edits.length > 0) {
      await context.supabase.from("manual_edits").insert(edits);
    }
    return { ok: true, changed: edits.length };
  });

export const listManualEdits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { data, error } = await context.supabase
      .from("manual_edits")
      .select("id, chapter_slug, field, old_value, new_value, edited_at")
      .order("edited_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Failed to load the edit log");
    return { edits: data ?? [] };
  });
