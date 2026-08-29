import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CERTIFICATION_REASON, type RoleCatalogRow, type RoleModuleRow } from "@/lib/roles";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";

export type CertificationState = {
  roleKey: string;
  enrolled: boolean;
  feePaidAt: string | null;
  completedAt: string | null;
  passedModuleIds: string[];
  balance: number;
  fee: number;
  holdsRole: boolean;
};

/** Public: the Role Store. */
export const listRoleCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { publicClient, CATALOG_COLUMNS, MODULE_COLUMNS } = await import("@/lib/roles.server");
  const sb = publicClient();

  const { data: roles, error } = await sb
    .from("role_catalog")
    .select(CATALOG_COLUMNS)
    .eq("is_active", true)
    .order("position");
  if (error) throw new Error("Failed to load the role catalog");

  const { data: modules } = await sb
    .from("role_modules")
    .select(MODULE_COLUMNS)
    .order("position");

  return {
    roles: (roles ?? []) as unknown as RoleCatalogRow[],
    modules: (modules ?? []) as unknown as RoleModuleRow[],
  };
});

async function loadCertification(
  admin: any,
  userId: string,
  roleKey: string,
): Promise<CertificationState> {
  const { balanceOf, buildWalletView, ensureUserWallet } = await import("@/lib/wallet.server");

  const { data: role } = await admin
    .from("role_catalog")
    .select("key, fee_jbk")
    .eq("key", roleKey)
    .maybeSingle();
  if (!role) throw new Error("Unknown role");

  const { data: enrollment } = await admin
    .from("role_enrollments")
    .select("fee_paid_at, completed_at")
    .eq("user_id", userId)
    .eq("role_key", roleKey)
    .maybeSingle();

  const { data: progress } = await admin
    .from("role_progress")
    .select("module_id")
    .eq("user_id", userId)
    .eq("role_key", roleKey);

  const { data: roleRows } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const wallet = await ensureUserWallet(admin, userId);
  const view = await buildWalletView(admin, wallet);

  return {
    roleKey,
    enrolled: !!enrollment,
    feePaidAt: enrollment?.fee_paid_at ?? null,
    completedAt: enrollment?.completed_at ?? null,
    passedModuleIds: (progress ?? []).map((p: { module_id: string }) => p.module_id),
    balance: balanceOf(view.balances, PLATFORM_TOKEN),
    fee: Number(role.fee_jbk ?? 0),
    holdsRole: (roleRows ?? []).some((r: { role: string }) => r.role === roleKey),
  };
}

export const getCertification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ roleKey: z.string().max(60) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return await loadCertification(supabaseAdmin, context.userId, data.roleKey);
  });

/** Enroll and post the certification fee to the append-only ledger. */
export const enrollInRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ roleKey: z.string().max(60) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureUserWallet } = await import("@/lib/wallet.server");

    const { data: role } = await supabaseAdmin
      .from("role_catalog")
      .select("key, fee_jbk, certifiable")
      .eq("key", data.roleKey)
      .maybeSingle();
    if (!role || !role.certifiable) throw new Error("That role is not certifiable");

    const state = await loadCertification(supabaseAdmin, context.userId, data.roleKey);
    if (state.feePaidAt) return state;

    const fee = Number(role.fee_jbk ?? 0);
    if (fee > 0 && state.balance < fee) {
      return { ...state, error: "Not enough JBK for the certification fee." };
    }

    if (fee > 0) {
      const wallet = await ensureUserWallet(supabaseAdmin, context.userId);
      const { error } = await supabaseAdmin.from("ledger_entries").insert({
        wallet_id: wallet.id,
        token_code: PLATFORM_TOKEN,
        direction: "debit",
        amount: fee,
        reason: CERTIFICATION_REASON,
        ref: `role:${data.roleKey}`,
        memo: `Certification fee — ${data.roleKey.toUpperCase()}`,
      });
      if (error) throw new Error("Failed to post the certification fee");
    }

    const { error: enrollErr } = await supabaseAdmin.from("role_enrollments").upsert(
      {
        user_id: context.userId,
        role_key: data.roleKey,
        status: "in_progress",
        fee_paid_at: new Date().toISOString(),
        fee_amount: fee,
      },
      { onConflict: "user_id,role_key" },
    );
    if (enrollErr) throw new Error("Failed to record the enrollment");

    return await loadCertification(supabaseAdmin, context.userId, data.roleKey);
  });

/** Answer a module quiz. The correct answer never reaches the browser. */
export const answerModuleQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ moduleId: z.string().uuid(), choice: z.number().int().min(0).max(9) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: mod } = await supabaseAdmin
      .from("role_modules")
      .select("id, role_key, position, quiz_answer")
      .eq("id", data.moduleId)
      .maybeSingle();
    if (!mod) throw new Error("Unknown module");

    const { data: enrollment } = await supabaseAdmin
      .from("role_enrollments")
      .select("fee_paid_at")
      .eq("user_id", context.userId)
      .eq("role_key", mod.role_key)
      .maybeSingle();
    if (!enrollment?.fee_paid_at) throw new Error("Enroll before taking the quiz");

    if (data.choice !== mod.quiz_answer) {
      return { correct: false as const };
    }

    await supabaseAdmin.from("role_progress").upsert(
      {
        user_id: context.userId,
        role_key: mod.role_key,
        module_id: mod.id,
        passed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module_id" },
    );

    // All modules passed → the role is written and the journey closes.
    const { count: total } = await supabaseAdmin
      .from("role_modules")
      .select("id", { count: "exact", head: true })
      .eq("role_key", mod.role_key);
    const { count: passed } = await supabaseAdmin
      .from("role_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .eq("role_key", mod.role_key);

    if ((total ?? 0) > 0 && (passed ?? 0) >= (total ?? 0)) {
      await supabaseAdmin
        .from("user_roles")
        .upsert(
          { user_id: context.userId, role: mod.role_key as never },
          { onConflict: "user_id,role" },
        );
      await supabaseAdmin
        .from("role_enrollments")
        .update({ status: "certified", completed_at: new Date().toISOString() })
        .eq("user_id", context.userId)
        .eq("role_key", mod.role_key);
    }

    return {
      correct: true as const,
      state: await loadCertification(supabaseAdmin, context.userId, mod.role_key),
    };
  });

/* ---------------------------------------------------------------- founder */

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export type RoleRequestRow = {
  id: string;
  name: string;
  email: string;
  organization: string;
  title: string;
  interest: string;
  requested_role: string | null;
  granted_role: string | null;
  granted_at: string | null;
  anchor: string | null;
  status: string;
  context: string | null;
  created_at: string;
  wallet_jbk: number | null;
};

export const listRoleRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("briefing_requests")
      .select(
        "id, name, email, organization, title, interest, requested_role, granted_role, granted_at, anchor, status, context, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error("Failed to load access requests");

    const anchors = (rows ?? [])
      .map((r) => r.anchor)
      .filter((a): a is string => !!a);

    const balances = new Map<string, number>();
    if (anchors.length) {
      const { data: wallets } = await supabaseAdmin
        .from("ledger_wallets")
        .select("id, anchor")
        .in("anchor", anchors);
      const ids = (wallets ?? []).map((w) => w.id);
      if (ids.length) {
        const { data: entries } = await supabaseAdmin
          .from("ledger_entries")
          .select("wallet_id, direction, amount, token_code")
          .in("wallet_id", ids);
        const byWallet = new Map<string, number>();
        for (const e of entries ?? []) {
          if (e.token_code !== PLATFORM_TOKEN) continue;
          const cur = byWallet.get(e.wallet_id) ?? 0;
          byWallet.set(e.wallet_id, cur + (e.direction === "credit" ? 1 : -1) * Number(e.amount));
        }
        for (const w of wallets ?? []) {
          if (w.anchor) balances.set(w.anchor, byWallet.get(w.id) ?? 0);
        }
      }
    }

    const out: RoleRequestRow[] = (rows ?? []).map((r) => ({
      ...(r as Omit<RoleRequestRow, "wallet_jbk">),
      wallet_jbk: r.anchor ? (balances.get(r.anchor) ?? 0) : null,
    }));

    return { rows: out };
  });

/** The founder grants a role. Nobody self-certifies into a Stakeholder Group. */
export const grantRoleToRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ requestId: z.string().uuid(), roleKey: z.string().max(60) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: req } = await supabaseAdmin
      .from("briefing_requests")
      .select("id, email")
      .eq("id", data.requestId)
      .maybeSingle();
    if (!req) throw new Error("Request not found");

    const { data: role } = await supabaseAdmin
      .from("role_catalog")
      .select("key")
      .eq("key", data.roleKey)
      .maybeSingle();
    if (!role) throw new Error("Unknown role");

    const { error } = await supabaseAdmin
      .from("briefing_requests")
      .update({
        granted_role: data.roleKey,
        granted_at: new Date().toISOString(),
        granted_by: context.userId,
        status: "approved",
      })
      .eq("id", data.requestId);
    if (error) throw new Error("Failed to record the grant");

    // If they already hold an account, write the role row now; otherwise the
    // invitation redemption applies it when they arrive.
    const { data: invites } = await supabaseAdmin
      .from("insider_invitations")
      .select("redeemed_by")
      .eq("briefing_request_id", data.requestId)
      .not("redeemed_by", "is", null)
      .limit(1);
    const uid = invites?.[0]?.redeemed_by;
    if (uid) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: uid, role: data.roleKey as never }, { onConflict: "user_id,role" });
    }

    return { ok: true as const, appliedNow: !!uid };
  });

/** Roles the signed-in person actually holds — the Switch Role source. */
export const listMyRoleTags = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error("Failed to load your roles");
    return { roles: (data ?? []).map((r) => r.role as string) };
  });

/** Founder-only: seed a signed-in person's MarketApp wallet so fees can move. */
export const grantSeedTokens = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ email: z.string().email(), amount: z.number().positive().max(100000) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureUserWallet } = await import("@/lib/wallet.server");

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = (list?.users ?? []).find(
      (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
    );
    if (!user) throw new Error("No account with that email");

    const wallet = await ensureUserWallet(supabaseAdmin, user.id);
    const { error } = await supabaseAdmin.from("ledger_entries").insert({
      wallet_id: wallet.id,
      token_code: PLATFORM_TOKEN,
      direction: "credit",
      amount: data.amount,
      reason: "granted:seed",
      ref: `founder:${context.userId}`,
      memo: "Seed grant from the founder.",
    });
    if (error) throw new Error("Failed to post the seed grant");
    return { ok: true as const };
  });
