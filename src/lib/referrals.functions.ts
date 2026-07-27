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

export type ReferralRow = {
  id: string;
  referrer_id: string;
  nominee_name: string;
  nominee_email: string;
  nominee_organization: string | null;
  nominee_role: string | null;
  context: string;
  status: "pending" | "approved" | "declined" | "invited";
  founder_note: string | null;
  resulting_invitation_id: string | null;
  created_at: string;
  updated_at: string;
};

const submitSchema = z.object({
  nomineeName: z.string().trim().min(1).max(160),
  nomineeEmail: z.string().trim().email().max(255),
  nomineeOrganization: z.string().trim().max(200).nullable().optional(),
  nomineeRole: z.string().trim().max(160).nullable().optional(),
  context: z.string().trim().min(20, "Please provide meaningful context (min 20 chars)").max(4000),
});

export const submitInsiderReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertInsider(context);

    // Rate limit: max 5 pending per insider.
    const { count } = await context.supabase
      .from("insider_referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", context.userId)
      .eq("status", "pending");
    if ((count ?? 0) >= 5) {
      throw new Error("You already have 5 pending nominations. Wait for the founder to review those first.");
    }

    // Don't allow duplicate pending nomination of same email by same insider.
    const { data: existing } = await context.supabase
      .from("insider_referrals")
      .select("id")
      .eq("referrer_id", context.userId)
      .ilike("nominee_email", data.nomineeEmail)
      .in("status", ["pending", "approved"])
      .limit(1);
    if (existing && existing.length > 0) {
      throw new Error("You have already nominated this email — one nomination per insider.");
    }

    const { data: row, error } = await context.supabase
      .from("insider_referrals")
      .insert({
        referrer_id: context.userId,
        nominee_name: data.nomineeName,
        nominee_email: data.nomineeEmail,
        nominee_organization: data.nomineeOrganization ?? null,
        nominee_role: data.nomineeRole ?? null,
        context: data.context,
      })
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to submit referral");
    return { referral: row as ReferralRow };
  });

export const listMyReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertInsider(context);
    const { data, error } = await context.supabase
      .from("insider_referrals")
      .select(
        "id, referrer_id, nominee_name, nominee_email, nominee_organization, nominee_role, context, status, founder_note, resulting_invitation_id, created_at, updated_at",
      )
      .eq("referrer_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to load referrals");
    return { rows: (data ?? []) as ReferralRow[] };
  });

const listSchema = z
  .object({
    status: z.enum(["pending", "approved", "declined", "invited", ""]).optional().default(""),
    search: z.string().optional().default(""),
  })
  .optional()
  .default({});

export const listReferrals = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => listSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("insider_referrals")
      .select(
        "id, referrer_id, nominee_name, nominee_email, nominee_organization, nominee_role, context, status, founder_note, resulting_invitation_id, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.status) q = q.eq("status", data.status);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`nominee_name.ilike.${s},nominee_email.ilike.${s},nominee_organization.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error("Failed to load referrals");

    // Resolve referrer emails
    const referrerIds = Array.from(new Set((rows ?? []).map((r: any) => r.referrer_id as string)));
    const emailByUser: Record<string, string> = {};
    if (referrerIds.length > 0) {
      const results = await Promise.all(
        referrerIds.map((id) => supabaseAdmin.auth.admin.getUserById(id).catch(() => null)),
      );
      for (const r of results) {
        const u = r?.data?.user;
        if (u?.id && u.email) emailByUser[u.id] = u.email;
      }
    }
    return {
      rows: (rows ?? []).map((r: any) => ({
        ...(r as ReferralRow),
        referrer_email: emailByUser[r.referrer_id] ?? "(unknown)",
      })),
    };
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "approved", "declined", "invited"]),
  founderNote: z.string().max(4000).nullable().optional(),
});

export const updateReferralStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("insider_referrals")
      .update({
        status: data.status,
        founder_note: data.founderNote ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message || "Failed to update referral");
    return { referral: row as ReferralRow };
  });

const approveAndInviteSchema = z.object({
  id: z.string().uuid(),
  founderNote: z.string().max(4000).nullable().optional(),
});

// Approve a referral AND mint an insider_invitations row in one step.
export const approveReferralAndInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => approveAndInviteSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: ref, error: refErr } = await supabaseAdmin
      .from("insider_referrals")
      .select("id, nominee_name, nominee_email, nominee_organization, nominee_role, referrer_id")
      .eq("id", data.id)
      .single();
    if (refErr || !ref) throw new Error("Referral not found");

    // Revoke prior pending direct invites to same email.
    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("source", "direct")
      .ilike("email", ref.nominee_email)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const referrerLine = ref.referrer_id ? `Referred by insider ${ref.referrer_id.slice(0, 8)}…` : "";
    const note = [referrerLine, data.founderNote ?? ""].filter(Boolean).join(" — ");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        source: "direct",
        email: ref.nominee_email,
        full_name: ref.nominee_name,
        organization: ref.nominee_organization,
        role_category: ref.nominee_role,
        internal_note: note || null,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error(invErr?.message ?? "Failed to create invitation");

    await supabaseAdmin
      .from("insider_referrals")
      .update({
        status: "invited",
        founder_note: data.founderNote ?? null,
        resulting_invitation_id: inv.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    return { invitationId: inv.id as string, token: inv.token as string, expiresAt: inv.expires_at as string };
  });

// For signals dashboard: total referrals per referrer.
export const listReferralCountsByReferrer = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("insider_referrals")
      .select("referrer_id, status");
    if (error) throw new Error("Failed to load referral counts");
    const byUser: Record<string, { total: number; pending: number; invited: number }> = {};
    for (const r of (data ?? []) as Array<{ referrer_id: string; status: string }>) {
      byUser[r.referrer_id] ??= { total: 0, pending: 0, invited: 0 };
      byUser[r.referrer_id].total++;
      if (r.status === "pending") byUser[r.referrer_id].pending++;
      if (r.status === "invited") byUser[r.referrer_id].invited++;
    }
    return { byUser };
  });
