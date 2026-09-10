import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BUCKET = "dossier-artifacts";

export const FACET_KEYS = [
  "purpose",
  "permissions",
  "records",
  "actions",
  "tools",
  "context",
  "completion",
  "content",
  "layout",
  "components",
  "states",
  "persona",
  "open_questions",
] as const;

export type FacetKey = (typeof FACET_KEYS)[number];

export const FACET_LABELS: Record<FacetKey, string> = {
  purpose: "Purpose",
  permissions: "Permitted roles",
  records: "Permitted records",
  actions: "Permitted actions",
  tools: "Available tools",
  context: "Required context",
  completion: "Completion event",
  content: "Content",
  layout: "Layout",
  components: "Components",
  states: "States",
  persona: "Persona",
  open_questions: "Open questions",
};

export type ScreenPage = {
  id: string;
  branch: string;
  slug: string;
  name: string;
  status: "empty" | "specified" | "built";
  class: string;
  truth: string;
  route: string | null;
  pattern_links: string[];
  register_ids: string[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type ScreenFacet = {
  id: string;
  page_id: string;
  facet_key: FacetKey;
  body: string;
  updated_at: string;
};

export type ScreenAttachment = {
  id: string;
  page_id: string;
  kind: "file" | "link";
  storage_path: string | null;
  external_url: string | null;
  title: string;
  description: string | null;
  original_date: string | null;
  source_label: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

const ATTACH_COLUMNS =
  "id, page_id, kind, storage_path, external_url, title, description, original_date, source_label, mime_type, size_bytes, created_at";

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

/** The whole book as a table: every screen, with its facet and evidence counts. */
export const listScreens = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const [pagesRes, facetsRes, attachRes] = await Promise.all([
      context.supabase
        .from("screen_pages")
        .select("*")
        .order("branch", { ascending: true })
        .order("position", { ascending: true }),
      context.supabase.from("screen_facets").select("page_id, facet_key, body, updated_at"),
      context.supabase.from("screen_attachments").select("id, page_id"),
    ]);
    if (pagesRes.error) throw new Error(pagesRes.error.message || "Failed to load the screen book");
    if (facetsRes.error) throw new Error(facetsRes.error.message || "Failed to load facets");
    if (attachRes.error) throw new Error(attachRes.error.message || "Failed to load evidence");

    const facets = (facetsRes.data ?? []) as Array<{
      page_id: string;
      facet_key: string;
      body: string;
      updated_at: string;
    }>;
    const attachments = (attachRes.data ?? []) as Array<{ id: string; page_id: string }>;

    const summary: Record<
      string,
      { written: number; questions: number; evidence: number; lastEdited: string | null }
    > = {};
    for (const p of (pagesRes.data ?? []) as ScreenPage[]) {
      summary[p.id] = { written: 0, questions: 0, evidence: 0, lastEdited: null };
    }
    for (const f of facets) {
      const s = summary[f.page_id];
      if (!s) continue;
      const body = (f.body ?? "").trim();
      if (body.length > 0) s.written += 1;
      if (f.facet_key === "open_questions" && body.length > 0) {
        s.questions = body.split("\n").filter((l) => l.trim().length > 0).length;
      }
      if (!s.lastEdited || f.updated_at > s.lastEdited) s.lastEdited = f.updated_at;
    }
    for (const a of attachments) {
      const s = summary[a.page_id];
      if (s) s.evidence += 1;
    }

    return { pages: (pagesRes.data ?? []) as ScreenPage[], summary };
  });

/** One screen: front matter, all facets, evidence. */
export const getScreen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const [pageRes, facetsRes, attachRes] = await Promise.all([
      context.supabase.from("screen_pages").select("*").eq("id", data.id).single(),
      context.supabase
        .from("screen_facets")
        .select("id, page_id, facet_key, body, updated_at")
        .eq("page_id", data.id),
      context.supabase
        .from("screen_attachments")
        .select(ATTACH_COLUMNS)
        .eq("page_id", data.id)
        .order("created_at", { ascending: true }),
    ]);
    if (pageRes.error) throw new Error(pageRes.error.message || "Screen not found");
    if (facetsRes.error) throw new Error(facetsRes.error.message || "Failed to load facets");
    if (attachRes.error) throw new Error(attachRes.error.message || "Failed to load evidence");
    return {
      page: pageRes.data as ScreenPage,
      facets: (facetsRes.data ?? []) as ScreenFacet[],
      attachments: (attachRes.data ?? []) as ScreenAttachment[],
    };
  });

/** Save one facet. The previous body is written to the revision log first. */
export const saveFacet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        page_id: z.string().uuid(),
        facet_key: z.enum(FACET_KEYS),
        body: z.string().max(60000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: existing } = await context.supabase
      .from("screen_facets")
      .select("id, body")
      .eq("page_id", data.page_id)
      .eq("facet_key", data.facet_key)
      .maybeSingle();

    if (existing && (existing.body ?? "").trim().length > 0 && existing.body !== data.body) {
      await context.supabase.from("screen_facet_revisions").insert({
        page_id: data.page_id,
        facet_key: data.facet_key,
        body: existing.body,
        edited_by: context.userId,
      });
    }

    const { data: row, error } = await context.supabase
      .from("screen_facets")
      .upsert(
        {
          page_id: data.page_id,
          facet_key: data.facet_key,
          body: data.body,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_id,facet_key" },
      )
      .select("id, page_id, facet_key, body, updated_at")
      .single();
    if (error) throw new Error(error.message || "Failed to save");
    return { facet: row as ScreenFacet };
  });

/** Every previous state of one facet, newest first. */
export const listFacetRevisions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ page_id: z.string().uuid(), facet_key: z.enum(FACET_KEYS) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: rows, error } = await context.supabase
      .from("screen_facet_revisions")
      .select("id, body, created_at")
      .eq("page_id", data.page_id)
      .eq("facet_key", data.facet_key)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message || "Failed to load history");
    return { revisions: (rows ?? []) as Array<{ id: string; body: string; created_at: string }> };
  });

/** Front matter. */
export const updateScreenPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().min(1).max(120).optional(),
        status: z.enum(["empty", "specified", "built"]).optional(),
        class: z.enum(["C0", "C1", "C2", "C3", "C4"]).optional(),
        truth: z
          .enum(["FACT", "ASSERTION", "DECISION", "HYPOTHESIS", "SIMULATION", "OPEN"])
          .optional(),
        route: z.string().max(200).nullable().optional(),
        pattern_links: z.array(z.string().max(300)).max(20).optional(),
        register_ids: z.array(z.string().max(40)).max(50).optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { id, ...patch } = data;
    const { data: row, error } = await context.supabase
      .from("screen_pages")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to update screen");
    return { page: row as ScreenPage };
  });

/** A new screen inside an existing branch. */
export const createScreenPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        branch: z.string().min(1).max(80),
        slug: z.string().min(1).max(80),
        name: z.string().min(1).max(120),
        class: z.enum(["C0", "C1", "C2", "C3", "C4"]).default("C2"),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("screen_pages")
      .insert({ ...data, status: "empty", truth: "OPEN", position: 999 })
      .select("*")
      .single();
    if (error) throw new Error(error.message || "Failed to add screen");
    return { page: row as ScreenPage };
  });

/** Evidence: a file already uploaded to storage, or a link. */
export const addScreenAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        page_id: z.string().uuid(),
        kind: z.enum(["file", "link"]),
        storage_path: z.string().max(500).nullable().optional(),
        external_url: z.string().url().max(1000).nullable().optional(),
        title: z.string().min(1).max(200),
        description: z.string().max(2000).nullable().optional(),
        original_date: z.string().max(20).nullable().optional(),
        source_label: z.string().max(200).nullable().optional(),
        mime_type: z.string().max(120).nullable().optional(),
        size_bytes: z.number().int().nonnegative().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    if (data.kind === "file" && !data.storage_path) throw new Error("A file needs a storage path");
    if (data.kind === "link" && !data.external_url) throw new Error("A link needs a URL");
    const { data: row, error } = await context.supabase
      .from("screen_attachments")
      .insert({
        page_id: data.page_id,
        kind: data.kind,
        storage_path: data.kind === "file" ? data.storage_path ?? null : null,
        external_url: data.kind === "link" ? data.external_url ?? null : null,
        title: data.title,
        description: data.description ?? null,
        original_date:
          data.original_date && data.original_date.length > 0 ? data.original_date : null,
        source_label: data.source_label ?? null,
        mime_type: data.mime_type ?? null,
        size_bytes: data.size_bytes ?? null,
        created_by: context.userId,
      })
      .select(ATTACH_COLUMNS)
      .single();
    if (error) throw new Error(error.message || "Failed to attach");
    return { attachment: row as ScreenAttachment };
  });

export const deleteScreenAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { error } = await context.supabase.from("screen_attachments").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to remove");
    return { ok: true };
  });

export const getScreenAttachmentUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: row, error } = await context.supabase
      .from("screen_attachments")
      .select("kind, storage_path, external_url")
      .eq("id", data.id)
      .single();
    if (error || !row) throw new Error("Not found");
    if (row.kind === "link") return { url: row.external_url as string };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(row.storage_path as string, 60 * 10);
    if (signErr || !signed) throw new Error("Failed to open");
    return { url: signed.signedUrl };
  });

/**
 * A question raised on a screen becomes a backlog row, and the register ID
 * comes back onto the screen. Register and board together, one act.
 */
export const sendQuestionToBacklog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        page_id: z.string().uuid(),
        question: z.string().min(3).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: page, error: pageErr } = await context.supabase
      .from("screen_pages")
      .select("id, branch, name, register_ids")
      .eq("id", data.page_id)
      .single();
    if (pageErr || !page) throw new Error("Screen not found");

    const { data: item, error } = await context.supabase
      .from("backlog_items")
      .insert({
        category: "Screen Book",
        title: `${page.branch} / ${page.name} — ${data.question.slice(0, 120)}`,
        summary: data.question.slice(0, 400),
        detail: `Raised on the screen ${page.branch}/${page.name}.\n\n${data.question}`,
        status: "idea",
        priority: 2,
        created_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message || "Failed to open the backlog row");

    const shortId = `SB-${String(item.id).slice(0, 8)}`;
    const registerIds = Array.from(new Set([...(page.register_ids ?? []), shortId]));
    await context.supabase
      .from("screen_pages")
      .update({ register_ids: registerIds })
      .eq("id", page.id);

    const existing = await context.supabase
      .from("screen_facets")
      .select("body")
      .eq("page_id", page.id)
      .eq("facet_key", "open_questions")
      .maybeSingle();
    const line = `- ${data.question} — ${shortId}`;
    const body = existing.data?.body ? `${existing.data.body.trimEnd()}\n${line}` : line;
    await context.supabase
      .from("screen_facets")
      .upsert(
        { page_id: page.id, facet_key: "open_questions", body, updated_by: context.userId },
        { onConflict: "page_id,facet_key" },
      );

    return { registerId: shortId, backlogId: item.id as string, registerIds };
  });

/** The whole book as markdown, one section per screen, for writing back to docs/screens/. */
export const exportScreenBook = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const [pagesRes, facetsRes] = await Promise.all([
      context.supabase
        .from("screen_pages")
        .select("*")
        .order("branch", { ascending: true })
        .order("position", { ascending: true }),
      context.supabase.from("screen_facets").select("page_id, facet_key, body"),
    ]);
    if (pagesRes.error) throw new Error("Failed to export");
    const facets = (facetsRes.data ?? []) as Array<{ page_id: string; facet_key: string; body: string }>;
    const byPage = new Map<string, Array<{ facet_key: string; body: string }>>();
    for (const f of facets) {
      const list = byPage.get(f.page_id) ?? [];
      list.push(f);
      byPage.set(f.page_id, list);
    }
    const out: string[] = [
      `# The Screen Book — export`,
      ``,
      `> Generated ${new Date().toISOString().slice(0, 10)}. Expression, never binding (ADR-020).`,
      ``,
    ];
    for (const p of (pagesRes.data ?? []) as ScreenPage[]) {
      out.push(`---`, ``, `## ${p.branch}/${p.slug}`, ``);
      out.push("```yaml");
      out.push(`screen: ${p.branch}/${p.slug}`);
      out.push(`status: ${p.status}`);
      out.push(`class: ${p.class}`);
      out.push(`truth: ${p.truth}`);
      out.push(`route: ${p.route ?? "null"}`);
      out.push(`pattern: [${(p.pattern_links ?? []).join(", ")}]`);
      out.push(`register: [${(p.register_ids ?? []).join(", ")}]`);
      out.push("```");
      out.push(``);
      const list = byPage.get(p.id) ?? [];
      for (const key of FACET_KEYS) {
        const f = list.find((x) => x.facet_key === key);
        if (!f || !(f.body ?? "").trim()) continue;
        out.push(`### ${FACET_LABELS[key]}`, ``, f.body.trim(), ``);
      }
    }
    return { markdown: out.join("\n") };
  });
