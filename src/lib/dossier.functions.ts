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

// What's-new for the current insider: last open per dossier and latest
// note/message timestamps at both dossier and section level.
export const getInsiderWhatsNew = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const [opensRes, notesRes, msgsRes] = await Promise.all([
      context.supabase
        .from("insider_access_log")
        .select("dossier_slug, opened_at")
        .eq("user_id", context.userId)
        .order("opened_at", { ascending: false })
        .limit(500),
      context.supabase
        .from("dossier_notes")
        .select("dossier_slug, section_heading, created_at, updated_at"),
      context.supabase
        .from("dossier_messages")
        .select("dossier_slug, section_heading, created_at"),
    ]);
    if (opensRes.error) throw new Error("Failed to load opens");

    const lastOpenBySlug: Record<string, string> = {};
    for (const r of (opensRes.data ?? []) as Array<{ dossier_slug: string; opened_at: string }>) {
      if (!lastOpenBySlug[r.dossier_slug]) lastOpenBySlug[r.dossier_slug] = r.opened_at;
    }

    const latestBySlug: Record<string, string> = {};
    const latestBySection: Record<string, Record<string, string>> = {};
    const bump = (slug: string, section: string | null, iso: string) => {
      if (!latestBySlug[slug] || iso > latestBySlug[slug]) latestBySlug[slug] = iso;
      const key = section ?? "__dossier__";
      latestBySection[slug] ??= {};
      if (!latestBySection[slug][key] || iso > latestBySection[slug][key]) {
        latestBySection[slug][key] = iso;
      }
    };
    for (const r of (notesRes.data ?? []) as Array<{
      dossier_slug: string;
      section_heading: string | null;
      created_at: string;
      updated_at: string;
    }>) {
      const ts = r.updated_at > r.created_at ? r.updated_at : r.created_at;
      bump(r.dossier_slug, r.section_heading, ts);
    }
    for (const r of (msgsRes.data ?? []) as Array<{
      dossier_slug: string;
      section_heading: string | null;
      created_at: string;
    }>) {
      bump(r.dossier_slug, r.section_heading, r.created_at);
    }

    return { lastOpenBySlug, latestBySlug, latestBySection };
  });

// Founder daily digest: recent activity across every lane.
const digestSchema = z.object({ windowDays: z.number().int().min(1).max(90).default(7) });

export const getFounderDigest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => digestSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sinceMs = Date.now() - data.windowDays * 24 * 60 * 60 * 1000;
    const since = new Date(sinceMs).toISOString();
    const dormantThreshold = new Date(sinceMs - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [briefingsRes, confsRes, msgsRes, invitesRes, opensRes] = await Promise.all([
      supabaseAdmin
        .from("briefing_requests")
        .select("id, name, email, organization, interest, status, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("conference_applications")
        .select("id, name, email, organization, role_category, status, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("dossier_messages")
        .select("id, dossier_slug, section_heading, body, author_id, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("insider_invitations")
        .select("id, email, source, redeemed_at, redeemed_by")
        .not("redeemed_at", "is", null)
        .gte("redeemed_at", since)
        .order("redeemed_at", { ascending: false }),
      supabaseAdmin
        .from("insider_access_log")
        .select("id, user_id, dossier_slug, opened_at")
        .gte("opened_at", since)
        .order("opened_at", { ascending: false })
        .limit(1000),
    ]);

    const userIds = Array.from(
      new Set([
        ...((msgsRes.data ?? []).map((r: any) => r.author_id as string)),
        ...((opensRes.data ?? []).map((r: any) => r.user_id as string)),
      ]),
    );
    const emailByUser: Record<string, string> = {};
    const founderIds = new Set<string>();
    if (userIds.length > 0) {
      const [users, roleRows] = await Promise.all([
        Promise.all(userIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null))),
        supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", userIds),
      ]);
      for (const r of users) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
      for (const r of (roleRows.data ?? []) as Array<{ user_id: string; role: string }>) {
        if (r.role === "founder_admin") founderIds.add(r.user_id);
      }
    }

    // Re-engagement: for each user active in the window, if their prior open
    // (before window) is older than 7 days from window start, flag them.
    const opens = (opensRes.data ?? []) as Array<{
      id: string; user_id: string; dossier_slug: string; opened_at: string;
    }>;
    const firstInWindowByUser: Record<string, { slug: string; opened_at: string }> = {};
    for (const o of [...opens].reverse()) {
      if (!firstInWindowByUser[o.user_id]) {
        firstInWindowByUser[o.user_id] = { slug: o.dossier_slug, opened_at: o.opened_at };
      }
    }
    const reengagements: Array<{ email: string; dossier_slug: string; opened_at: string }> = [];
    const toCheck = Object.keys(firstInWindowByUser).filter((u) => !founderIds.has(u));
    if (toCheck.length > 0) {
      const priors = await Promise.all(
        toCheck.map((u) =>
          supabaseAdmin
            .from("insider_access_log")
            .select("opened_at")
            .eq("user_id", u)
            .lt("opened_at", since)
            .order("opened_at", { ascending: false })
            .limit(1),
        ),
      );
      priors.forEach((res, i) => {
        const uid = toCheck[i];
        const prior = (res.data?.[0] as any)?.opened_at as string | undefined;
        if (prior && prior < dormantThreshold) {
          const f = firstInWindowByUser[uid];
          reengagements.push({
            email: emailByUser[uid] ?? "(unknown)",
            dossier_slug: f.slug,
            opened_at: f.opened_at,
          });
        }
      });
    }

    return {
      windowDays: data.windowDays,
      briefings: briefingsRes.data ?? [],
      conferences: confsRes.data ?? [],
      messages: (msgsRes.data ?? []).map((r: any) => ({
        ...r,
        email: emailByUser[r.author_id] ?? "(unknown)",
        author_is_founder: founderIds.has(r.author_id),
      })),
      redemptions: invitesRes.data ?? [],
      reengagements,
    };
  });

// ---------- Dossier editor (DB-backed corpus) ----------

export type DossierRow = {
  slug: string;
  code: string;
  story_order: number;
  title: string;
  summary: string;
  confidentiality: string;
  truth_default: string;
  published_at: string | null;
  updated_at: string;
};

export type DossierSectionRow = {
  id: string;
  dossier_slug: string;
  position: number;
  heading: string;
  truth: string;
  body: string;
  updated_at: string;
};

export const listDossiersFromDb = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("dossiers")
      .select("slug, code, story_order, title, summary, confidentiality, truth_default, published_at, updated_at")
      .order("story_order", { ascending: true });
    if (error) throw new Error("Failed to load dossiers");
    return { dossiers: (data ?? []) as DossierRow[] };
  });

const getDossierSchema = z.object({ slug: z.string().min(1).max(80) });

export const getDossierFromDb = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => getDossierSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);
    const [d1, s1] = await Promise.all([
      context.supabase
        .from("dossiers")
        .select("slug, code, story_order, title, summary, confidentiality, truth_default, published_at, updated_at")
        .eq("slug", data.slug)
        .maybeSingle(),
      context.supabase
        .from("dossier_sections")
        .select("id, dossier_slug, position, heading, truth, body, updated_at")
        .eq("dossier_slug", data.slug)
        .order("position", { ascending: true }),
    ]);
    if (d1.error) throw new Error("Failed to load dossier");
    if (s1.error) throw new Error("Failed to load sections");
    return {
      dossier: (d1.data ?? null) as DossierRow | null,
      sections: (s1.data ?? []) as DossierSectionRow[],
    };
  });

const CONF = ["C0", "C1", "C2", "C3", "C4"] as const;
const TRUTH = ["FACT", "ASSERTION", "DECISION", "HYPOTHESIS", "SIMULATION", "OPEN"] as const;

const metaSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(1000),
  confidentiality: z.enum(CONF),
  truth_default: z.enum(TRUTH),
});

async function logEdit(
  supabase: any,
  actorId: string,
  slug: string,
  sectionId: string | null,
  field: string,
  before: string | null,
  after: string | null,
) {
  await supabase.from("dossier_edits").insert({
    actor_id: actorId,
    dossier_slug: slug,
    section_id: sectionId,
    field,
    before_value: before,
    after_value: after,
  });
}

export const upsertDossierMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => metaSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: existing } = await context.supabase
      .from("dossiers")
      .select("title, summary, confidentiality, truth_default")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!existing) throw new Error("Dossier not found");
    const { error } = await context.supabase
      .from("dossiers")
      .update({
        title: data.title,
        summary: data.summary,
        confidentiality: data.confidentiality,
        truth_default: data.truth_default,
      })
      .eq("slug", data.slug);
    if (error) throw new Error(error.message || "Failed to save");
    const fields: Array<[string, string, string]> = [
      ["title", existing.title, data.title],
      ["summary", existing.summary, data.summary],
      ["confidentiality", existing.confidentiality, data.confidentiality],
      ["truth_default", existing.truth_default, data.truth_default],
    ];
    for (const [f, before, after] of fields) {
      if (before !== after) await logEdit(context.supabase, context.userId, data.slug, null, f, before, after);
    }
    return { ok: true };
  });

const sectionSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80),
  heading: z.string().min(1).max(200),
  truth: z.enum(TRUTH),
  body: z.string().min(1).max(20000),
});

export const upsertDossierSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => sectionSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    if (data.id) {
      const { data: prev } = await context.supabase
        .from("dossier_sections")
        .select("heading, truth, body")
        .eq("id", data.id)
        .maybeSingle();
      if (!prev) throw new Error("Section not found");
      const { error } = await context.supabase
        .from("dossier_sections")
        .update({ heading: data.heading, truth: data.truth, body: data.body })
        .eq("id", data.id);
      if (error) throw new Error(error.message || "Failed to save section");
      const fields: Array<[string, string, string]> = [
        ["heading", prev.heading, data.heading],
        ["truth", prev.truth, data.truth],
        ["body", prev.body, data.body],
      ];
      for (const [f, before, after] of fields) {
        if (before !== after) await logEdit(context.supabase, context.userId, data.slug, data.id, f, before, after);
      }
      return { id: data.id };
    }
    // insert at end
    const { data: last } = await context.supabase
      .from("dossier_sections")
      .select("position")
      .eq("dossier_slug", data.slug)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPos = (last?.position ?? 0) + 1;
    const { data: inserted, error } = await context.supabase
      .from("dossier_sections")
      .insert({
        dossier_slug: data.slug,
        position: nextPos,
        heading: data.heading,
        truth: data.truth,
        body: data.body,
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to add section");
    await logEdit(context.supabase, context.userId, data.slug, inserted.id, "section:add", null, data.heading);
    return { id: inserted.id as string };
  });

const deleteSchema = z.object({ id: z.string().uuid(), slug: z.string().min(1).max(80) });

export const deleteDossierSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => deleteSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: prev } = await context.supabase
      .from("dossier_sections")
      .select("heading")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase
      .from("dossier_sections")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message || "Failed to delete section");
    await logEdit(context.supabase, context.userId, data.slug, null, "section:remove", prev?.heading ?? null, null);
    return { ok: true };
  });

const reorderSchema = z.object({
  slug: z.string().min(1).max(80),
  id: z.string().uuid(),
  direction: z.enum(["up", "down"]),
});

export const reorderDossierSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => reorderSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { data: rows, error: e1 } = await context.supabase
      .from("dossier_sections")
      .select("id, position")
      .eq("dossier_slug", data.slug)
      .order("position", { ascending: true });
    if (e1) throw new Error("Failed to load sections");
    const list = (rows ?? []) as Array<{ id: string; position: number }>;
    const idx = list.findIndex((r) => r.id === data.id);
    if (idx < 0) throw new Error("Section not found");
    const swapIdx = data.direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return { ok: true };
    const a = list[idx];
    const b = list[swapIdx];
    // deferred unique constraint lets us swap in one txn; do two-step via temp positions
    const tempPos = -Math.abs(a.position) - 1000;
    const s1 = await context.supabase.from("dossier_sections").update({ position: tempPos }).eq("id", a.id);
    if (s1.error) throw new Error("Reorder failed");
    const s2 = await context.supabase.from("dossier_sections").update({ position: a.position }).eq("id", b.id);
    if (s2.error) throw new Error("Reorder failed");
    const s3 = await context.supabase.from("dossier_sections").update({ position: b.position }).eq("id", a.id);
    if (s3.error) throw new Error("Reorder failed");
    await logEdit(context.supabase, context.userId, data.slug, a.id, "section:reorder", String(a.position), String(b.position));
    return { ok: true };
  });

export const listDossierEdits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("dossier_edits")
      .select("id, actor_id, dossier_slug, section_id, field, before_value, after_value, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Failed to load edits");
    const actorIds = Array.from(new Set((data ?? []).map((r: any) => r.actor_id)));
    const emailByUser: Record<string, string> = {};
    if (actorIds.length > 0) {
      const results = await Promise.all(
        actorIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }
    return {
      rows: (data ?? []).map((r: any) => ({ ...r, email: emailByUser[r.actor_id] ?? "(unknown)" })),
    };
  });
