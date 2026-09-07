import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";

export type AppHomeTask = {
  id: string;
  label: string;
  detail: string;
  href: string;
  done: boolean;
};

export type AppHomeView = {
  email: string | null;
  roles: string[];
  balance: number;
  certification: {
    roleKey: string;
    feePaid: boolean;
    passed: number;
    total: number;
    completedAt: string | null;
  } | null;
  tasks: AppHomeTask[];
};

/**
 * Everything the App Home needs in one call: identity, roles, wallet, and a
 * server-derived task list (the workflow toll booth). Client-side state such
 * as an unclaimed Interested User anchor is layered on by the page.
 */
export const getAppHome = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AppHomeView> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureUserWallet, buildWalletView, balanceOf } = await import(
      "@/lib/wallet.server"
    );

    const { data: roleRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (roleRows ?? []).map((r) => r.role as string);
    const isFounder = roles.includes("founder_admin");

    const wallet = await ensureUserWallet(supabaseAdmin, context.userId);
    const view = await buildWalletView(supabaseAdmin, wallet);
    const balance = balanceOf(view.balances, PLATFORM_TOKEN);

    // Certification state for the certifiable roles (ISR first).
    const { data: certRoles } = await supabaseAdmin
      .from("role_catalog")
      .select("key, fee_jbk")
      .eq("certifiable", true)
      .eq("is_active", true)
      .order("position")
      .limit(1);
    const certKey = certRoles?.[0]?.key as string | undefined;

    let certification: AppHomeView["certification"] = null;
    if (certKey) {
      const { data: enrollment } = await supabaseAdmin
        .from("role_enrollments")
        .select("fee_paid_at, completed_at")
        .eq("user_id", context.userId)
        .eq("role_key", certKey)
        .maybeSingle();
      const { count: total } = await supabaseAdmin
        .from("role_modules")
        .select("id", { count: "exact", head: true })
        .eq("role_key", certKey);
      const { count: passed } = await supabaseAdmin
        .from("role_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId)
        .eq("role_key", certKey);

      certification = {
        roleKey: certKey,
        feePaid: !!enrollment?.fee_paid_at,
        passed: passed ?? 0,
        total: total ?? 0,
        completedAt: enrollment?.completed_at ?? null,
      };
    }

    const tasks: AppHomeTask[] = [];

    const hasStakeholderTag = roles.some(
      (r) => !["interested_user", "isr", "lc", "founder_admin"].includes(r),
    );
    if (!hasStakeholderTag && !isFounder) {
      tasks.push({
        id: "introduce",
        label: "Introduce yourself",
        detail:
          "Tell the founder who you are and which Stakeholder Group you believe you belong to. Grants are one click on his side.",
        href: "/request-briefing",
        done: false,
      });
    }

    if (certification) {
      if (!certification.feePaid) {
        tasks.push({
          id: "cert-fee",
          label: `Pay the ${certification.roleKey.toUpperCase()} certification fee`,
          detail:
            "Certification is earned, never granted. The fee is paid in JBK from your ledger wallet and posted to the append-only record.",
          href: "/roles",
          done: false,
        });
      } else if (!certification.completedAt) {
        tasks.push({
          id: "cert-modules",
          label: `Finish ${certification.roleKey.toUpperCase()} certification`,
          detail: `${certification.passed} of ${certification.total} modules passed. Each quiz you clear is recorded against your identity, permanently.`,
          href: "/roles",
          done: false,
        });
      } else {
        tasks.push({
          id: "cert-done",
          label: `${certification.roleKey.toUpperCase()} certified`,
          detail:
            "The role wrote itself when the last quiz cleared. It now shapes your nav and what the MarketApp will let you touch.",
          href: "/roles",
          done: true,
        });
      }
    }

    if (isFounder) {
      tasks.push({
        id: "founder-queue",
        label: "Review the access queue",
        detail:
          "Requests for invitations and briefings wait in one table. Accept, assign a Group and a role, and the invitation rides with the grant.",
        href: "/admin/roles",
        done: false,
      });
    }

    const email = (context.claims as { email?: string } | undefined)?.email ?? null;

    return { email, roles, balance, certification, tasks };
  });
