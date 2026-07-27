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

const openSchema = z.object({ slug: z.string().min(1).max(80) });

export const logDossierOpen = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => openSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { error } = await context.supabase
      .from("insider_access_log")
      .insert({ user_id: context.userId, dossier_slug: data.slug });
    if (error) throw new Error("Failed to record open");
    return { ok: true };
  });

export const listMyDossierOpens = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("insider_access_log")
      .select("dossier_slug, opened_at")
      .eq("user_id", context.userId)
      .order("opened_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Failed to load opens");
    const lastBySlug: Record<string, string> = {};
    for (const r of (data ?? []) as Array<{ dossier_slug: string; opened_at: string }>) {
      if (!lastBySlug[r.dossier_slug]) lastBySlug[r.dossier_slug] = r.opened_at;
    }
    return { lastBySlug };
  });

export const listInsiderActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: opens, error } = await supabaseAdmin
      .from("insider_access_log")
      .select("id, user_id, dossier_slug, opened_at")
      .order("opened_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error("Failed to load activity");

    const userIds = Array.from(new Set((opens ?? []).map((o) => o.user_id)));
    const emailByUser: Record<string, string> = {};
    if (userIds.length > 0) {
      const results = await Promise.all(
        userIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }
    return {
      rows: (opens ?? []).map((o) => ({
        ...o,
        email: emailByUser[o.user_id] ?? "(unknown)",
      })),
    };
  });

// ---------- Founder notes ----------

const slugOnly = z.object({ slug: z.string().min(1).max(80) });

export const listDossierNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => slugOnly.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { data: rows, error } = await context.supabase
      .from("dossier_notes")
      .select("id, dossier_slug, section_heading, body, author_id, created_at, updated_at")
      .eq("dossier_slug", data.slug)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to load notes");
    return { notes: rows ?? [] };
  });

const upsertNoteSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80),
  sectionHeading: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(4000),
});

export const upsertDossierNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => upsertNoteSchema.parse(d))
  .handler(async ({ context, data }) => {
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("dossier_notes")
        .update({
          body: data.body,
          section_heading: data.sectionHeading ?? null,
        })
        .eq("id", data.id)
        .select()
        .single();
      if (error) throw new Error(error.message || "Failed to update note");
      return { note: row };
    }
    const { data: row, error } = await context.supabase
      .from("dossier_notes")
      .insert({
        dossier_slug: data.slug,
        section_heading: data.sectionHeading ?? null,
        body: data.body,
        author_id: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to create note");
    return { note: row };
  });

const idOnly = z.object({ id: z.string().uuid() });

export const deleteDossierNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idOnly.parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("dossier_notes").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete note");
    return { ok: true };
  });

// ---------- Insider messages ----------

export const listDossierMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => slugOnly.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await assertInsider(context);
    const { data: rows, error } = await context.supabase
      .from("dossier_messages")
      .select("id, dossier_slug, section_heading, body, author_id, created_at")
      .eq("dossier_slug", data.slug)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw new Error("Failed to load messages");

    // Resolve author emails via admin (insiders see a friendly label; only founder sees emails).
    const authorIds = Array.from(new Set((rows ?? []).map((r: any) => r.author_id)));
    const authorMeta: Record<string, { email: string; isFounder: boolean }> = {};
    if (authorIds.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [userResults, roleRows] = await Promise.all([
        Promise.all(authorIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null))),
        supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", authorIds),
      ]);
      const founders = new Set(
        (roleRows.data ?? [])
          .filter((r: any) => r.role === "founder_admin")
          .map((r: any) => r.user_id),
      );
      for (const r of userResults) {
        const u = r?.data?.user;
        if (u?.id) {
          authorMeta[u.id] = { email: u.email ?? "", isFounder: founders.has(u.id) };
        }
      }
    }

    const viewerIsFounder = roles.has("founder_admin");
    return {
      viewerId: context.userId,
      viewerIsFounder,
      messages: (rows ?? []).map((r: any) => {
        const meta = authorMeta[r.author_id];
        const isFounder = meta?.isFounder ?? false;
        const email = meta?.email ?? "";
        const label = isFounder
          ? "Founder"
          : viewerIsFounder
            ? email || "Insider"
            : r.author_id === context.userId
              ? "You"
              : "Insider";
        return {
          id: r.id as string,
          section_heading: r.section_heading as string | null,
          body: r.body as string,
          author_id: r.author_id as string,
          created_at: r.created_at as string,
          authorLabel: label,
          authorIsFounder: isFounder,
        };
      }),
    };
  });

const postMessageSchema = z.object({
  slug: z.string().min(1).max(80),
  sectionHeading: z.string().max(200).nullable().optional(),
  body: z.string().min(1).max(4000),
});

export const postDossierMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => postMessageSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const { data: row, error } = await context.supabase
      .from("dossier_messages")
      .insert({
        dossier_slug: data.slug,
        section_heading: data.sectionHeading ?? null,
        body: data.body,
        author_id: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to post message");

    // Stubbed email notification to founder — no-op until domain verified.
    try {
      const { sendEmail } = await import("./email");
      await sendEmail({
        kind: "founder_new_insider_message",
        dossierSlug: data.slug,
        sectionHeading: data.sectionHeading ?? null,
        body: data.body,
        authorId: context.userId,
      });
    } catch {
      // ignore
    }

    return { message: row };
  });

export const deleteDossierMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idOnly.parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("dossier_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete message");
    return { ok: true };
  });

export const listRecentDossierMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("dossier_messages")
      .select("id, dossier_slug, section_heading, body, author_id, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Failed to load discussion");

    const authorIds = Array.from(new Set((rows ?? []).map((r: any) => r.author_id)));
    const emailByUser: Record<string, string> = {};
    const founderIds = new Set<string>();
    if (authorIds.length > 0) {
      const [userResults, roleRows] = await Promise.all([
        Promise.all(authorIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null))),
        supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", authorIds),
      ]);
      for (const r of userResults) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
      for (const r of (roleRows.data ?? []) as Array<{ user_id: string; role: string }>) {
        if (r.role === "founder_admin") founderIds.add(r.user_id);
      }
    }

    // Per-dossier counts for the header strip.
    const countsBySlug: Record<string, number> = {};
    for (const r of (rows ?? []) as any[]) {
      countsBySlug[r.dossier_slug] = (countsBySlug[r.dossier_slug] ?? 0) + 1;
    }

    return {
      countsBySlug,
      rows: (rows ?? []).map((r: any) => ({
        ...r,
        email: emailByUser[r.author_id] ?? "(unknown)",
        author_is_founder: founderIds.has(r.author_id),
      })),
    };
  });

// Per-dossier counts (notes + messages) for the insider index cards.
export const listDossierCounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const [notes, msgs] = await Promise.all([
      context.supabase.from("dossier_notes").select("dossier_slug"),
      context.supabase.from("dossier_messages").select("dossier_slug"),
    ]);
    const notesBySlug: Record<string, number> = {};
    const messagesBySlug: Record<string, number> = {};
    for (const r of (notes.data ?? []) as Array<{ dossier_slug: string }>) {
      notesBySlug[r.dossier_slug] = (notesBySlug[r.dossier_slug] ?? 0) + 1;
    }
    for (const r of (msgs.data ?? []) as Array<{ dossier_slug: string }>) {
      messagesBySlug[r.dossier_slug] = (messagesBySlug[r.dossier_slug] ?? 0) + 1;
    }
    return { notesBySlug, messagesBySlug };
  });
