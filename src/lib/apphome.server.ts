/**
 * The App Home derivation, server-only.
 *
 * One place decides what a person's home shows: identity, roles, wallet,
 * certification state, and the task list. The App Home page, the all-tasks
 * view, and the single-task view all read from here so they can never
 * disagree with each other.
 */
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";
import type { AppHomeTask, AppHomeView } from "@/lib/apphome.types";

type AnyClient = {
  from: (t: string) => any;
};

/** Tasks a person may mark done themselves; everything else is derived. */
export const DISMISSIBLE_TASKS = new Set(["introduce", "founder-queue", "welcome"]);

export async function buildAppHome(
  supabase: AnyClient,
  userId: string,
  email: string | null,
): Promise<AppHomeView> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { ensureUserWallet, buildWalletView, balanceOf } = await import(
    "@/lib/wallet.server"
  );

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const roles = (roleRows ?? []).map((r: { role: string }) => r.role as string);
  const isFounder = roles.includes("founder_admin");

  const wallet = await ensureUserWallet(supabaseAdmin, userId);
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
      .eq("user_id", userId)
      .eq("role_key", certKey)
      .maybeSingle();
    const { count: total } = await supabaseAdmin
      .from("role_modules")
      .select("id", { count: "exact", head: true })
      .eq("role_key", certKey);
    const { count: passed } = await supabaseAdmin
      .from("role_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("role_key", certKey);

    certification = {
      roleKey: certKey,
      feePaid: !!enrollment?.fee_paid_at,
      passed: passed ?? 0,
      total: total ?? 0,
      completedAt: enrollment?.completed_at ?? null,
    };
  }

  // Tasks the person has marked done themselves.
  const { data: stateRows } = await supabase
    .from("app_task_states")
    .select("task_id")
    .eq("user_id", userId);
  const cleared = new Set(
    (stateRows ?? []).map((r: { task_id: string }) => r.task_id as string),
  );

  const tasks: AppHomeTask[] = [];

  const hasStakeholderTag = roles.some(
    (r: string) => !["interested_user", "isr", "lc", "founder_admin"].includes(r),
  );
  if (!hasStakeholderTag && !isFounder) {
    tasks.push({
      id: "introduce",
      label: "Introduce yourself",
      detail:
        "Tell the founder who you are and which Stakeholder Group you believe you belong to. Grants are one click on his side.",
      why: "Until a Stakeholder Group is attached to your name, this home can only show you the public floor. The group is what opens the rooms — it is granted by a person, never claimed by a form.",
      action: "Write your introduction",
      href: "/request-briefing",
      done: false,
      dismissible: true,
    });
  }

  if (certification) {
    const key = certification.roleKey.toUpperCase();
    if (!certification.feePaid) {
      tasks.push({
        id: "cert-fee",
        label: `Pay the ${key} certification fee`,
        detail:
          "Certification is earned, never granted. The fee is paid in JBK from your ledger wallet and posted to the append-only record.",
        why: "The fee is the first entry in your own ledger history. It is paid from what you earned, not from what you bought, and it is visible for as long as the record exists.",
        action: "Open the Role Store",
        href: "/roles",
        done: false,
        dismissible: false,
      });
    } else if (!certification.completedAt) {
      tasks.push({
        id: "cert-modules",
        label: `Finish ${key} certification`,
        detail: `${certification.passed} of ${certification.total} modules passed. Each quiz you clear is recorded against your identity, permanently.`,
        why: "Nobody can grant you this role and nobody can buy past it. The modules are the whole gate — when the last quiz clears, the role writes itself.",
        action: "Continue the curriculum",
        href: "/roles",
        done: false,
        dismissible: false,
      });
    } else {
      tasks.push({
        id: "cert-done",
        label: `${key} certified`,
        detail:
          "The role wrote itself when the last quiz cleared. It now shapes your nav and what the MarketApp will let you touch.",
        why: "This one is finished. It stays visible because the record of clearing it is part of your identity here.",
        action: "Review the curriculum",
        href: "/roles",
        done: true,
        dismissible: false,
      });
    }
  }

  if (isFounder) {
    tasks.push({
      id: "founder-queue",
      label: "Review the access queue",
      detail:
        "Requests for invitations and briefings wait in one table. Accept, assign a Group and a role, and the invitation rides with the grant.",
      why: "Every person who arrives at the front door stops here. Nothing moves until you accept — that is the design, not a bottleneck to remove.",
      action: "Open the request queue",
      href: "/admin/queue",
      done: false,
      dismissible: true,
    });
  }

  for (const t of tasks) {
    if (cleared.has(t.id)) t.done = true;
  }

  return {
    email,
    roles,
    balance,
    certification,
    tasks,
    walletClaimedAt: view.claimedAt ?? null,
  };
}
