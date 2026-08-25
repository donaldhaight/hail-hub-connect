import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LAYERS } from "@/lib/intake.functions";

export const TRACK_STATUSES = ["exploring", "converging", "adopted", "retired"] as const;
export type TrackStatus = (typeof TRACK_STATUSES)[number];

export const NOTE_KINDS = ["note", "question", "decision"] as const;
export type NoteKind = (typeof NOTE_KINDS)[number];

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export type TrackRow = {
  id: string;
  slug: string;
  name: string;
  brief: string;
  status: TrackStatus;
  layers: string[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type TrackNoteRow = {
  id: string;
  track_id: string;
  kind: NoteKind;
  body: string;
  resolved: boolean;
  position: number;
  created_at: string;
};

const TRACK_COLUMNS = "id, slug, name, brief, status, layers, position, created_at, updated_at";
const NOTE_COLUMNS = "id, track_id, kind, body, resolved, position, created_at";

export const listTracks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const [tracks, notes] = await Promise.all([
      context.supabase
        .from("concept_tracks")
        .select(TRACK_COLUMNS)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true }),
      context.supabase
        .from("concept_track_notes")
        .select(NOTE_COLUMNS)
        .order("created_at", { ascending: true }),
    ]);
    if (tracks.error) throw new Error("Failed to load tracks");
    return {
      tracks: (tracks.data ?? []) as TrackRow[],
      notes: (notes.data ?? []) as TrackNoteRow[],
    };
  });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const upsertTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(120),
        brief: z.string().max(20000).default(""),
        status: z.enum(TRACK_STATUSES).default("exploring"),
        layers: z.array(z.enum(LAYERS)).default([]),
        position: z.number().int().nonnegative().default(0),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const payload = {
      name: data.name,
      brief: data.brief,
      status: data.status,
      layers: data.layers,
      position: data.position,
    };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("concept_tracks")
        .update(payload)
        .eq("id", data.id)
        .select(TRACK_COLUMNS)
        .single();
      if (error) throw new Error(error.message || "Failed to update track");
      return { track: row as TrackRow };
    }
    const { data: row, error } = await context.supabase
      .from("concept_tracks")
      .insert({ ...payload, slug: slugify(data.name) || crypto.randomUUID().slice(0, 8), created_by: context.userId })
      .select(TRACK_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to create track");
    return { track: row as TrackRow };
  });

export const deleteTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("concept_tracks").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete track");
    return { ok: true };
  });

export const addTrackNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        trackId: z.string().uuid(),
        kind: z.enum(NOTE_KINDS).default("note"),
        body: z.string().min(1).max(8000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("concept_track_notes")
      .insert({ track_id: data.trackId, kind: data.kind, body: data.body, created_by: context.userId })
      .select(NOTE_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to add note");
    return { note: row as TrackNoteRow };
  });

export const toggleTrackNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid(), resolved: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase
      .from("concept_track_notes")
      .update({ resolved: data.resolved })
      .eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to update note");
    return { ok: true };
  });

export const deleteTrackNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("concept_track_notes").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete note");
    return { ok: true };
  });

/**
 * Adopt a track: mark it adopted and turn its decisions and open questions into
 * backlog items so the concept re-enters the main build path.
 */
export const adoptTrack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);

    const { data: track, error } = await context.supabase
      .from("concept_tracks")
      .select(TRACK_COLUMNS)
      .eq("id", data.id)
      .single();
    if (error || !track) throw new Error("Track not found");
    const t = track as TrackRow;

    const { data: notes } = await context.supabase
      .from("concept_track_notes")
      .select(NOTE_COLUMNS)
      .eq("track_id", data.id)
      .order("created_at", { ascending: true });

    const rows = (notes ?? []) as TrackNoteRow[];
    const actionable = rows.filter((n) => n.kind !== "note" && !n.resolved);

    const { data: maxRow } = await context.supabase
      .from("backlog_items")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    let position = ((maxRow?.position as number | undefined) ?? 0) + 1;

    const inserts = [
      {
        category: "Concept Lab",
        title: `Adopt: ${t.name}`,
        summary: t.brief.slice(0, 380),
        detail: t.brief,
        status: "planned",
        priority: 2,
        sprint_label: null,
        position: position++,
        created_by: context.userId,
      },
      ...actionable.map((n) => ({
        category: "Concept Lab",
        title: `${t.name} — ${n.body.slice(0, 120)}`,
        summary: n.kind === "question" ? "Open question carried in from the lab." : "Decision carried in from the lab.",
        detail: n.body,
        status: "idea",
        priority: n.kind === "decision" ? 2 : 3,
        sprint_label: null,
        position: position++,
        created_by: context.userId,
      })),
    ];

    const { error: insErr } = await context.supabase.from("backlog_items").insert(inserts);
    if (insErr) throw new Error(insErr.message || "Failed to write backlog items");

    const { error: updErr } = await context.supabase
      .from("concept_tracks")
      .update({ status: "adopted" })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message || "Adopted, but failed to update the track");

    return { ok: true, created: inserts.length };
  });
