import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { WalletEntry } from "@/lib/wallet.functions";

export type MyActivity = {
  balance: number;
  claimedAt: string | null;
  entries: WalletEntry[];
};

/**
 * The person's own record: their wallet balance and their own ledger lines.
 * Own rows only — no aggregate, no other person, no platform total.
 */
export const getMyActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyActivity> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ensureUserWallet, buildWalletView, balanceOf } = await import(
      "@/lib/wallet.server"
    );
    const { PLATFORM_TOKEN } = await import("@/lib/wallet.schedule");

    const wallet = await ensureUserWallet(supabaseAdmin, context.userId);
    const view = await buildWalletView(supabaseAdmin, wallet);

    return {
      balance: balanceOf(view.balances, PLATFORM_TOKEN),
      claimedAt: view.claimedAt ?? null,
      entries: view.entries,
    };
  });
