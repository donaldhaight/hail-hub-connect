import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendEmail } from "./email";

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

const grantSchema = z.object({ briefingRequestId: z.string().uuid() });
const grantConfSchema = z.object({ conferenceApplicationId: z.string().uuid() });

export const grantInsiderAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("briefing_requests")
      .select("id, name, email")
      .eq("id", data.briefingRequestId)
      .single();
    if (reqErr || !req) throw new Error("Briefing request not found");

    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("briefing_request_id", req.id)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        source: "briefing",
        briefing_request_id: req.id,
        email: req.email,
        full_name: req.name,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error("Failed to create invitation");

    await supabaseAdmin
      .from("briefing_requests")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", req.id);

    await supabaseAdmin.from("briefing_request_events").insert({
      briefing_request_id: req.id,
      actor_id: context.userId,
      action: "insider:invited",
      note: `invitation ${inv.id}`,
    });

    await sendEmail({
      kind: "insider_invitation",
      to: req.email,
      name: req.name,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { token: inv.token as string, expiresAt: inv.expires_at as string };
  });

export const getInvitationForRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("insider_invitations")
      .select("id, token, status, expires_at, redeemed_at, email")
      .eq("briefing_request_id", data.briefingRequestId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error("Failed to load invitation");
    return { invitation: rows?.[0] ?? null };
  });

export const grantInsiderAccessFromConference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantConfSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: app, error: appErr } = await supabaseAdmin
      .from("conference_applications")
      .select("id, name, email")
      .eq("id", data.conferenceApplicationId)
      .single();
    if (appErr || !app) throw new Error("Conference application not found");

    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("conference_application_id", app.id)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        source: "conference",
        conference_application_id: app.id,
        email: app.email,
        full_name: app.name,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error("Failed to create invitation");

    await supabaseAdmin
      .from("conference_applications")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", app.id);

    await sendEmail({
      kind: "insider_invitation",
      to: app.email,
      name: app.name,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { token: inv.token as string, expiresAt: inv.expires_at as string };
  });

export const getInvitationForConference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantConfSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("insider_invitations")
      .select("id, token, status, expires_at, redeemed_at, email")
      .eq("conference_application_id", data.conferenceApplicationId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error("Failed to load invitation");
    return { invitation: rows?.[0] ?? null };
  });

const redeemSchema = z.object({ token: z.string().uuid() });

export const redeemInsiderInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => redeemSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { data: result, error } = await (context.supabase as any).rpc(
      "redeem_insider_invitation",
      { _token: data.token },
    );
    if (error) throw new Error(error.message ?? "Redemption failed");
    return result as { ok: boolean; reason?: string; already?: boolean; expected?: string };
  });

// ============================================================
// Sprint 0.9 — Direct invitations, lifecycle, signals
// ============================================================

const directInviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1).max(200),
  organization: z.string().max(200).optional().default(""),
  roleCategory: z.string().max(80).optional().default(""),
  internalNote: z.string().max(2000).optional().default(""),
});

export const inviteInsiderDirect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => directInviteSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Revoke any existing pending direct invitations to the same email
    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("source", "direct")
      .ilike("email", data.email)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        source: "direct",
        email: data.email,
        full_name: data.fullName,
        organization: data.organization || null,
        role_category: data.roleCategory || null,
        internal_note: data.internalNote || null,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error(invErr?.message ?? "Failed to create invitation");

    await sendEmail({
      kind: "insider_invitation",
      to: data.email,
      name: data.fullName,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { id: inv.id as string, token: inv.token as string, expiresAt: inv.expires_at as string };
  });

const listInvSchema = z.object({
  status: z.enum(["pending", "redeemed", "revoked", "expired", ""]).optional().default(""),
  source: z.enum(["briefing", "conference", "direct", ""]).optional().default(""),
  search: z.string().optional().default(""),
}).optional().default({});

export const listInvitations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listInvSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const now = new Date().toISOString();
    let q = supabaseAdmin
      .from("insider_invitations")
      .select("id, email, full_name, organization, role_category, source, status, token, expires_at, redeemed_at, redeemed_by, revoked_at, internal_note, created_at, briefing_request_id, conference_application_id")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.source) q = q.eq("source", data.source);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`email.ilike.${s},full_name.ilike.${s},organization.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load invitations");

    // Compute effective status: pending rows past expires_at are "expired"
    const decorated = (rows ?? []).map((r: any) => {
      let effective = r.status as string;
      if (effective === "pending" && r.expires_at && r.expires_at < now) effective = "expired";
      return { ...r, effective_status: effective };
    });

    const filtered = data.status
      ? decorated.filter((r) => r.effective_status === data.status)
      : decorated;

    // Resolve redeemed_by emails
    const userIds = Array.from(new Set(filtered.map((r) => r.redeemed_by).filter(Boolean))) as string[];
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
      rows: filtered.map((r) => ({ ...r, redeemed_by_email: r.redeemed_by ? emailByUser[r.redeemed_by] ?? null : null })),
    };
  });

const idSchema = z.object({ id: z.string().uuid() });

export const revokeInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .is("redeemed_at", null);
    if (error) throw new Error(error.message ?? "Failed to revoke");
    return { ok: true };
  });

export const resendInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => idSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error: findErr } = await supabaseAdmin
      .from("insider_invitations")
      .select("id, email, full_name, source, briefing_request_id, conference_application_id, organization, role_category, internal_note, redeemed_at")
      .eq("id", data.id)
      .single();
    if (findErr || !existing) throw new Error("Invitation not found");
    if (existing.redeemed_at) throw new Error("Already redeemed — cannot resend");

    // Revoke old
    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    // Create fresh with new token + 30-day window (schema default)
    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        source: existing.source,
        briefing_request_id: existing.briefing_request_id,
        conference_application_id: existing.conference_application_id,
        email: existing.email,
        full_name: existing.full_name,
        organization: existing.organization,
        role_category: existing.role_category,
        internal_note: existing.internal_note,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error(invErr?.message ?? "Failed to resend");

    await sendEmail({
      kind: "insider_invitation",
      to: existing.email,
      name: existing.full_name ?? existing.email,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { id: inv.id as string, token: inv.token as string, expiresAt: inv.expires_at as string };
  });

// ============================================================
// Insider Signals — per-insider engagement rollup
// ============================================================

export const listInsiderSignals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // All qualified_insider role rows
    const { data: roleRows, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["qualified_insider", "founder_admin"]);
    if (roleErr) throw new Error("Failed to load roles");

    const insiderUserIds = Array.from(
      new Set((roleRows ?? []).filter((r) => r.role === "qualified_insider").map((r) => r.user_id)),
    );
    if (insiderUserIds.length === 0) return { rows: [] };

    // Fetch emails
    const emailByUser: Record<string, string> = {};
    const results = await Promise.all(
      insiderUserIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
    );
    for (const r of results) {
      const u = r?.data?.user;
      if (u?.id && u.email) emailByUser[u.id] = u.email;
    }

    // Redemption metadata (source lane, invited_at)
    const { data: invRows } = await supabaseAdmin
      .from("insider_invitations")
      .select("email, source, created_at, redeemed_at, redeemed_by")
      .in("redeemed_by", insiderUserIds);
    const invByUser: Record<string, { source: string; invited_at: string; redeemed_at: string | null }> = {};
    for (const r of (invRows ?? []) as any[]) {
      if (!r.redeemed_by) continue;
      const cur = invByUser[r.redeemed_by];
      if (!cur || (r.created_at && r.created_at < cur.invited_at)) {
        invByUser[r.redeemed_by] = { source: r.source, invited_at: r.created_at, redeemed_at: r.redeemed_at };
      }
    }

    // Access log
    const { data: opens } = await supabaseAdmin
      .from("insider_access_log")
      .select("user_id, dossier_slug, opened_at")
      .in("user_id", insiderUserIds)
      .order("opened_at", { ascending: false })
      .limit(5000);

    const opensByUser: Record<string, { slugs: Set<string>; lastAt: string; lastSlug: string; total: number }> = {};
    for (const o of (opens ?? []) as any[]) {
      const cur = opensByUser[o.user_id] ?? { slugs: new Set(), lastAt: "", lastSlug: "", total: 0 };
      cur.slugs.add(o.dossier_slug);
      cur.total += 1;
      if (!cur.lastAt || o.opened_at > cur.lastAt) {
        cur.lastAt = o.opened_at;
        cur.lastSlug = o.dossier_slug;
      }
      opensByUser[o.user_id] = cur;
    }

    // Messages posted
    const { data: msgs } = await supabaseAdmin
      .from("dossier_messages")
      .select("author_id")
      .in("author_id", insiderUserIds);
    const msgCountByUser: Record<string, number> = {};
    for (const m of (msgs ?? []) as any[]) {
      msgCountByUser[m.author_id] = (msgCountByUser[m.author_id] ?? 0) + 1;
    }

    const rows = insiderUserIds.map((uid) => {
      const o = opensByUser[uid];
      const inv = invByUser[uid];
      return {
        user_id: uid,
        email: emailByUser[uid] ?? "(unknown)",
        source: inv?.source ?? "unknown",
        invited_at: inv?.invited_at ?? null,
        redeemed_at: inv?.redeemed_at ?? null,
        dossiers_opened: o?.slugs.size ?? 0,
        opens_total: o?.total ?? 0,
        last_active: o?.lastAt ?? null,
        last_dossier: o?.lastSlug ?? null,
        messages_posted: msgCountByUser[uid] ?? 0,
      };
    });

    rows.sort((a, b) => {
      const at = a.last_active ?? "";
      const bt = b.last_active ?? "";
      return bt.localeCompare(at);
    });
    return { rows };
  });
