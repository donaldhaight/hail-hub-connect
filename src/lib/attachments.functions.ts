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

export type AttachmentRow = {
  id: string;
  dossier_slug: string;
  section_id: string | null;
  kind: "file" | "link";
  storage_path: string | null;
  external_url: string | null;
  title: string;
  description: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

const slugOnly = z.object({ slug: z.string().min(1).max(80) });

export const listAttachments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => slugOnly.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await assertInsider(context);
    const isFounder = roles.has("founder_admin");
    let q = context.supabase
      .from("dossier_attachments")
      .select(
        "id, dossier_slug, section_id, kind, storage_path, external_url, title, description, mime_type, size_bytes, is_published, position, created_at, updated_at",
      )
      .eq("dossier_slug", data.slug)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (!isFounder) q = q.eq("is_published", true);
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load attachments");
    return { attachments: (rows ?? []) as AttachmentRow[], isFounder };
  });

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80),
  sectionId: z.string().uuid().nullable().optional(),
  kind: z.enum(["file", "link"]),
  storagePath: z.string().max(500).nullable().optional(),
  externalUrl: z.string().url().max(1000).nullable().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  mimeType: z.string().max(120).nullable().optional(),
  sizeBytes: z.number().int().nonnegative().nullable().optional(),
  isPublished: z.boolean().default(false),
  position: z.number().int().nonnegative().optional(),
});

export const upsertAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    if (data.kind === "file" && !data.storagePath) throw new Error("File attachments require a storage path");
    if (data.kind === "link" && !data.externalUrl) throw new Error("Link attachments require a URL");

    const payload = {
      dossier_slug: data.slug,
      section_id: data.sectionId ?? null,
      kind: data.kind,
      storage_path: data.kind === "file" ? data.storagePath ?? null : null,
      external_url: data.kind === "link" ? data.externalUrl ?? null : null,
      title: data.title,
      description: data.description ?? null,
      mime_type: data.mimeType ?? null,
      size_bytes: data.sizeBytes ?? null,
      is_published: data.isPublished,
      position: data.position ?? 0,
    };

    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("dossier_attachments")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message || "Failed to update attachment");
      return { attachment: row as AttachmentRow };
    }
    const { data: row, error } = await context.supabase
      .from("dossier_attachments")
      .insert({ ...payload, created_by: context.userId })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to create attachment");
    return { attachment: row as AttachmentRow };
  });

const idOnly = z.object({ id: z.string().uuid() });

export const deleteAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idOnly.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    // Fetch first to know if we need to clean storage.
    const { data: row } = await context.supabase
      .from("dossier_attachments")
      .select("kind, storage_path")
      .eq("id", data.id)
      .single();
    const { error } = await context.supabase.from("dossier_attachments").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete attachment");
    if (row?.kind === "file" && row.storage_path) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.storage.from(BUCKET).remove([row.storage_path]).catch(() => {});
    }
    return { ok: true };
  });

const signedUrlSchema = z.object({ id: z.string().uuid() });

export const getAttachmentSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => signedUrlSchema.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await assertInsider(context);
    const isFounder = roles.has("founder_admin");
    const { data: row, error } = await context.supabase
      .from("dossier_attachments")
      .select("id, dossier_slug, kind, storage_path, external_url, is_published, title")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Attachment not found");
    if (!isFounder && !row.is_published) throw new Error("Forbidden");
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
