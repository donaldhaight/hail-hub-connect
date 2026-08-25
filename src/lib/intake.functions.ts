import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LAYERS, TRIAGE_STATES, type TriageState } from "@/content/intake";

const BUCKET = "dossier-artifacts";

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export type IntakeRow = {
  id: string;
  kind: "file" | "link";
  storage_path: string | null;
  external_url: string | null;
  title: string;
  original_date: string | null;
  source_label: string | null;
  notes: string | null;
  layers: string[];
  triage_state: TriageState;
  filed_as: "manual" | "dossier" | null;
  filed_ref: string | null;
  extracted_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  updated_at: string;
};

const COLUMNS =
  "id, kind, storage_path, external_url, title, original_date, source_label, notes, layers, triage_state, filed_as, filed_ref, extracted_text, mime_type, size_bytes, created_at, updated_at";

export const listIntakeItems = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        state: z.enum(["all", ...TRIAGE_STATES]).default("all"),
        layer: z.enum(["all", ...LAYERS]).default("all"),
        search: z.string().max(200).default(""),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);

    let q = context.supabase
      .from("intake_items")
      .select(COLUMNS)
      .order("created_at", { ascending: false });
    if (data.state !== "all") q = q.eq("triage_state", data.state);
    if (data.layer !== "all") q = q.contains("layers", [data.layer]);
    if (data.search.trim()) {
      const s = data.search.trim().replace(/[%,]/g, " ");
      q = q.or(`title.ilike.%${s}%,notes.ilike.%${s}%,extracted_text.ilike.%${s}%`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load intake");

    const items = (rows ?? []) as IntakeRow[];

    const { data: allRows } = await context.supabase
      .from("intake_items")
      .select("triage_state, layers, original_date, source_label");
    const all = (allRows ?? []) as Array<{
      triage_state: string;
      layers: string[];
      original_date: string | null;
      source_label: string | null;
    }>;

    const byState: Record<string, number> = {};
    for (const s of TRIAGE_STATES) byState[s] = 0;
    const byLayer: Record<string, number> = {};
    for (const l of LAYERS) byLayer[l] = 0;
    const byDecade: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let undated = 0;

    for (const r of all) {
      byState[r.triage_state] = (byState[r.triage_state] ?? 0) + 1;
      for (const l of r.layers ?? []) byLayer[l] = (byLayer[l] ?? 0) + 1;
      if (r.original_date) {
        const year = Number(r.original_date.slice(0, 4));
        if (!Number.isNaN(year)) {
          const decade = `${Math.floor(year / 10) * 10}s`;
          byDecade[decade] = (byDecade[decade] ?? 0) + 1;
        }
      } else {
        undated++;
      }
      const src = (r.source_label ?? "").trim();
      if (src) bySource[src] = (bySource[src] ?? 0) + 1;
    }

    return {
      items,
      map: { total: all.length, byState, byLayer, byDecade, bySource, undated },
    };
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.enum(["file", "link"]),
  storagePath: z.string().max(500).nullable().optional(),
  externalUrl: z.string().url().max(1000).nullable().optional(),
  title: z.string().min(1).max(300),
  originalDate: z.string().max(20).nullable().optional(),
  sourceLabel: z.string().max(200).nullable().optional(),
  notes: z.string().max(8000).nullable().optional(),
  layers: z.array(z.enum(LAYERS)).default([]),
  triageState: z.enum(TRIAGE_STATES).default("new"),
  extractedText: z.string().max(400000).nullable().optional(),
  mimeType: z.string().max(120).nullable().optional(),
  sizeBytes: z.number().int().nonnegative().nullable().optional(),
});

export const upsertIntakeItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    if (data.kind === "file" && !data.storagePath) throw new Error("File items require an upload");
    if (data.kind === "link" && !data.externalUrl) throw new Error("Link items require a URL");

    const payload = {
      kind: data.kind,
      storage_path: data.kind === "file" ? data.storagePath ?? null : null,
      external_url: data.kind === "link" ? data.externalUrl ?? null : null,
      title: data.title,
      original_date: data.originalDate && data.originalDate.length > 0 ? data.originalDate : null,
      source_label: data.sourceLabel ?? null,
      notes: data.notes ?? null,
      layers: data.layers,
      triage_state: data.triageState,
      extracted_text: data.extractedText ?? null,
      mime_type: data.mimeType ?? null,
      size_bytes: data.sizeBytes ?? null,
    };

    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("intake_items")
        .update(payload)
        .eq("id", data.id)
        .select(COLUMNS)
        .single();
      if (error) throw new Error(error.message || "Failed to update item");
      return { item: row as IntakeRow };
    }
    const { data: row, error } = await context.supabase
      .from("intake_items")
      .insert({ ...payload, created_by: context.userId })
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to create item");
    return { item: row as IntakeRow };
  });

export const deleteIntakeItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row } = await context.supabase
      .from("intake_items")
      .select("kind, storage_path, triage_state")
      .eq("id", data.id)
      .single();
    const { error } = await context.supabase.from("intake_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete item");
    // Only remove the stored file when it was never filed against a chapter or dossier.
    if (row?.kind === "file" && row.storage_path && row.triage_state !== "filed") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.storage.from(BUCKET).remove([row.storage_path]);
    }
    return { ok: true };
  });

export const getIntakeItemUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("intake_items")
      .select("kind, storage_path, external_url")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Item not found");
    if (row.kind === "link") return { url: row.external_url as string };
    if (!row.storage_path) throw new Error("Missing file");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, 300);
    if (signErr || !signed?.signedUrl) throw new Error("Failed to sign URL");
    return { url: signed.signedUrl };
  });

/** Destinations an intake item can be filed against. */
export const getFilingTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const [chapters, dossiers] = await Promise.all([
      context.supabase.from("manual_chapters").select("slug, title, part, position").order("position"),
      context.supabase.from("dossiers").select("slug, title, story_order").order("story_order"),
    ]);
    return {
      chapters: ((chapters.data ?? []) as any[]).map((c) => ({
        slug: c.slug as string,
        title: c.title as string,
        part: c.part as string,
      })),
      dossiers: ((dossiers.data ?? []) as any[]).map((d) => ({
        slug: d.slug as string,
        title: d.title as string,
      })),
    };
  });

/**
 * File an intake item against a manual chapter or a dossier. The stored object is
 * reused as-is — nothing is copied twice.
 */
export const fileIntakeItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        corpus: z.enum(["manual", "dossier"]),
        ref: z.string().min(1).max(120),
        significance: z.string().max(2000).nullable().optional(),
        publish: z.boolean().default(false),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: item, error } = await context.supabase
      .from("intake_items")
      .select(COLUMNS)
      .eq("id", data.id)
      .single();
    if (error || !item) throw new Error("Item not found");
    const row = item as IntakeRow;

    const shared = {
      kind: row.kind,
      storage_path: row.storage_path,
      external_url: row.external_url,
      title: row.title,
      description: row.notes,
      original_date: row.original_date,
      source_label: row.source_label,
      significance: data.significance ?? null,
      mime_type: row.mime_type,
      size_bytes: row.size_bytes,
      layers: row.layers,
      extracted_text: row.extracted_text,
      is_published: data.publish,
      position: 0,
      created_by: context.userId,
    };

    if (data.corpus === "manual") {
      const { error: insErr } = await context.supabase
        .from("manual_attachments")
        .insert({ ...shared, chapter_slug: data.ref });
      if (insErr) throw new Error(insErr.message || "Failed to file against the chapter");
    } else {
      const { error: insErr } = await context.supabase
        .from("dossier_attachments")
        .insert({ ...shared, dossier_slug: data.ref });
      if (insErr) throw new Error(insErr.message || "Failed to file against the dossier");
    }

    const { error: updErr } = await context.supabase
      .from("intake_items")
      .update({ triage_state: "filed", filed_as: data.corpus, filed_ref: data.ref })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message || "Filed, but failed to update the lane");

    return { ok: true };
  });

export type CorpusSearchHit = {
  source: "intake" | "manual" | "dossier";
  id: string;
  title: string;
  ref: string | null;
  snippet: string;
};

/** Founder-only search across intake notes, chapter bodies, and dossier sections. */
export const searchCorpus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ q: z.string().min(2).max(200) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const s = data.q.trim().replace(/[%,]/g, " ");
    const like = `%${s}%`;

    const [intake, chapters, sections] = await Promise.all([
      context.supabase
        .from("intake_items")
        .select("id, title, notes, extracted_text")
        .or(`title.ilike.${like},notes.ilike.${like},extracted_text.ilike.${like}`)
        .limit(25),
      context.supabase
        .from("manual_chapters")
        .select("slug, title, body")
        .or(`title.ilike.${like},body.ilike.${like}`)
        .limit(25),
      context.supabase
        .from("dossier_sections")
        .select("id, dossier_slug, heading, body")
        .or(`heading.ilike.${like},body.ilike.${like}`)
        .limit(25),
    ]);

    const snippet = (text: string | null): string => {
      if (!text) return "";
      const i = text.toLowerCase().indexOf(s.toLowerCase());
      if (i < 0) return text.slice(0, 160);
      return `${i > 40 ? "…" : ""}${text.slice(Math.max(0, i - 40), i + 140)}…`;
    };

    const hits: CorpusSearchHit[] = [
      ...((intake.data ?? []) as any[]).map((r) => ({
        source: "intake" as const,
        id: r.id,
        title: r.title,
        ref: null,
        snippet: snippet(r.notes ?? r.extracted_text),
      })),
      ...((chapters.data ?? []) as any[]).map((r) => ({
        source: "manual" as const,
        id: r.slug,
        title: r.title,
        ref: r.slug,
        snippet: snippet(r.body),
      })),
      ...((sections.data ?? []) as any[]).map((r) => ({
        source: "dossier" as const,
        id: r.id,
        title: r.heading,
        ref: r.dossier_slug,
        snippet: snippet(r.body),
      })),
    ];

    return { hits };
  });
