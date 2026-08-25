import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "dossier-artifacts";

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

export type ManualAttachmentRow = {
  id: string;
  chapter_slug: string;
  kind: "file" | "link";
  storage_path: string | null;
  external_url: string | null;
  title: string;
  description: string | null;
  original_date: string | null;
  source_label: string | null;
  significance: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

const COLUMNS =
  "id, chapter_slug, kind, storage_path, external_url, title, description, original_date, source_label, significance, mime_type, size_bytes, is_published, position, created_at, updated_at";

export const listManualAttachments = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const roles = await assertInsider(context);
    const isFounder = roles.has("founder_admin");
    let q = context.supabase
      .from("manual_attachments")
      .select(COLUMNS)
      .eq("chapter_slug", data.slug)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (!isFounder) q = q.eq("is_published", true);
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load evidence");
    return { attachments: (rows ?? []) as ManualAttachmentRow[], isFounder };
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  kind: z.enum(["file", "link"]),
  storagePath: z.string().max(500).nullable().optional(),
  externalUrl: z.string().url().max(1000).nullable().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  originalDate: z.string().max(20).nullable().optional(),
  sourceLabel: z.string().max(200).nullable().optional(),
  significance: z.string().max(2000).nullable().optional(),
  mimeType: z.string().max(120).nullable().optional(),
  sizeBytes: z.number().int().nonnegative().nullable().optional(),
  isPublished: z.boolean().default(false),
  position: z.number().int().nonnegative().optional(),
});

export const upsertManualAttachment = createServerFn({ method: "POST" })
  .validator((d: unknown) => upsertSchema.parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    if (data.kind === "file" && !data.storagePath) throw new Error("File artifacts require a storage path");
    if (data.kind === "link" && !data.externalUrl) throw new Error("Link artifacts require a URL");

    const payload = {
      chapter_slug: data.slug,
      kind: data.kind,
      storage_path: data.kind === "file" ? data.storagePath ?? null : null,
      external_url: data.kind === "link" ? data.externalUrl ?? null : null,
      title: data.title,
      description: data.description ?? null,
      original_date: data.originalDate && data.originalDate.length > 0 ? data.originalDate : null,
      source_label: data.sourceLabel ?? null,
      significance: data.significance ?? null,
      mime_type: data.mimeType ?? null,
      size_bytes: data.sizeBytes ?? null,
      is_published: data.isPublished,
      position: data.position ?? 0,
    };

    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("manual_attachments")
        .update(payload)
        .eq("id", data.id)
        .select(COLUMNS)
        .single();
      if (error) throw new Error(error.message || "Failed to update artifact");
      return { attachment: row as ManualAttachmentRow };
    }
    const { data: row, error } = await context.supabase
      .from("manual_attachments")
      .insert({ ...payload, created_by: context.userId })
      .select(COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to create artifact");
    return { attachment: row as ManualAttachmentRow };
  });

export const deleteManualAttachment = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row } = await context.supabase
      .from("manual_attachments")
      .select("kind, storage_path")
      .eq("id", data.id)
      .single();
    const { error } = await context.supabase.from("manual_attachments").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete artifact");
    if (row?.kind === "file" && row.storage_path) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.storage.from(BUCKET).remove([row.storage_path]).catch(() => {});
    }
    return { ok: true };
  });

export const getManualAttachmentUrl = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    const roles = await assertInsider(context);
    const isFounder = roles.has("founder_admin");
    const { data: row, error } = await context.supabase
      .from("manual_attachments")
      .select("id, chapter_slug, kind, storage_path, external_url, is_published, title")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Artifact not found");
    if (!isFounder && !row.is_published) throw new Error("Forbidden");

    try {
      await context.supabase.from("manual_attachment_opens").insert({
        attachment_id: row.id,
        user_id: context.userId,
        chapter_slug: row.chapter_slug,
      });
    } catch {
      // best effort
    }

    if (row.kind === "link") {
      return { url: row.external_url as string, kind: "link" as const, title: row.title as string };
    }
    if (!row.storage_path) throw new Error("Missing file");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path, 300);
    if (signErr || !signed?.signedUrl) throw new Error("Failed to sign URL");
    return { url: signed.signedUrl, kind: "file" as const, title: row.title as string };
  });

export type EvidenceRow = {
  id: string;
  corpus: "manual" | "dossier";
  parent: string;
  parentTitle: string;
  kind: "file" | "link";
  title: string;
  originalDate: string | null;
  sourceLabel: string | null;
  significance: string | null;
  isPublished: boolean;
  opens: number;
  readers: number;
  lastOpenedAt: string | null;
};

/** The evidence index: every artifact across the manual and the dossier corpus. */
export const getEvidenceIndex = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [manualRes, dossierRes, chaptersRes, dossiersRes, mOpensRes, dOpensRes] = await Promise.all([
      supabaseAdmin
        .from("manual_attachments")
        .select("id, chapter_slug, kind, title, original_date, source_label, significance, is_published"),
      supabaseAdmin
        .from("dossier_attachments")
        .select("id, dossier_slug, kind, title, original_date, source_label, significance, is_published"),
      supabaseAdmin.from("manual_chapters").select("slug, title"),
      supabaseAdmin.from("dossiers").select("slug, title"),
      supabaseAdmin.from("manual_attachment_opens").select("attachment_id, user_id, opened_at"),
      supabaseAdmin.from("dossier_attachment_opens").select("attachment_id, user_id, opened_at"),
    ]);

    const chapterTitle = new Map<string, string>(
      ((chaptersRes.data ?? []) as any[]).map((c) => [c.slug as string, c.title as string]),
    );
    const dossierTitle = new Map<string, string>(
      ((dossiersRes.data ?? []) as any[]).map((d) => [d.slug as string, d.title as string]),
    );

    type Stat = { count: number; users: Set<string>; last: string | null };
    const stats = new Map<string, Stat>();
    for (const o of [...((mOpensRes.data ?? []) as any[]), ...((dOpensRes.data ?? []) as any[])]) {
      const cur = stats.get(o.attachment_id) ?? { count: 0, users: new Set<string>(), last: null };
      cur.count++;
      cur.users.add(o.user_id);
      if (!cur.last || o.opened_at > cur.last) cur.last = o.opened_at;
      stats.set(o.attachment_id, cur);
    }

    const toRow = (a: any, corpus: "manual" | "dossier"): EvidenceRow => {
      const parent = corpus === "manual" ? a.chapter_slug : a.dossier_slug;
      const s = stats.get(a.id);
      return {
        id: a.id,
        corpus,
        parent,
        parentTitle:
          (corpus === "manual" ? chapterTitle.get(parent) : dossierTitle.get(parent)) ?? parent,
        kind: a.kind,
        title: a.title,
        originalDate: a.original_date ?? null,
        sourceLabel: a.source_label ?? null,
        significance: a.significance ?? null,
        isPublished: a.is_published,
        opens: s?.count ?? 0,
        readers: s?.users.size ?? 0,
        lastOpenedAt: s?.last ?? null,
      };
    };

    const rows: EvidenceRow[] = [
      ...((manualRes.data ?? []) as any[]).map((a) => toRow(a, "manual")),
      ...((dossierRes.data ?? []) as any[]).map((a) => toRow(a, "dossier")),
    ].sort((a, b) => (a.originalDate ?? "9999").localeCompare(b.originalDate ?? "9999"));

    return {
      rows,
      totals: {
        artifacts: rows.length,
        published: rows.filter((r) => r.isPublished).length,
        dated: rows.filter((r) => r.originalDate).length,
        opens: rows.reduce((n, r) => n + r.opens, 0),
      },
    };
  });
