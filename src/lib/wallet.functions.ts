import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { EARN_SCHEDULE, ENTRY_PRICE_JBK, PLATFORM_TOKEN } from "@/lib/wallet.schedule";

export type WalletEntry = {
  id: string;
  wallet_id: string;
  token_code: string;
  direction: "credit" | "debit";
  amount: number;
  reason: string;
  ref: string;
  memo: string;
  occurred_at: string;
};

export type WalletBalance = { token_code: string; amount: number };

export type WalletView = {
  anchor: string;
  walletId: string;
  kind: string;
  label: string;
  claimedAt: string | null;
  balances: WalletBalance[];
  entries: WalletEntry[];
  earnedReasons: string[];
  entryPrice: number;
  hasStanding: boolean;
};

const ENTRY_COLUMNS =
  "id, wallet_id, token_code, direction, amount, reason, ref, memo, occurred_at";

const anchorSchema = z
  .string()
  .uuid()
  .nullable()
  .optional()
  .transform((v) => v ?? null);

export const resolveWallet = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ anchor: anchorSchema }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildWalletView, mintInterestedUserWallet } = await import("@/lib/wallet.server");

    if (data.anchor) {
      const { data: existing } = await supabaseAdmin
        .from("ledger_wallets")
        .select("id, anchor, kind, label, claimed_at")
        .eq("anchor", data.anchor)
        .maybeSingle();
      if (existing) return await buildWalletView(supabaseAdmin, existing);
    }

    const wallet = await mintInterestedUserWallet(supabaseAdmin);
    return await buildWalletView(supabaseAdmin, wallet);
  });

export const earnToken = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        anchor: z.string().uuid(),
        reason: z.enum([
          "earned:arrival",
          "earned:share",
          "earned:invite",
          "earned:participate",
        ]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildWalletView, requireWallet } = await import("@/lib/wallet.server");

    const wallet = await requireWallet(supabaseAdmin, data.anchor);

    // Each earn reason pays exactly once per wallet.
    const { count } = await supabaseAdmin
      .from("ledger_entries")
      .select("id", { count: "exact", head: true })
      .eq("wallet_id", wallet.id)
      .eq("reason", data.reason);

    if (!count) {
      const rule = EARN_SCHEDULE[data.reason];
      const { error } = await supabaseAdmin.from("ledger_entries").insert({
        wallet_id: wallet.id,
        token_code: PLATFORM_TOKEN,
        direction: "credit",
        amount: rule.amount,
        reason: data.reason,
        ref: `anchor:${wallet.anchor}`,
        memo: rule.note,
      });
      if (error) throw new Error("Failed to record the earn entry");
    }

    return await buildWalletView(supabaseAdmin, wallet);
  });

export const payEntryFee = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ anchor: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildWalletView, requireWallet, balanceOf } = await import("@/lib/wallet.server");

    const wallet = await requireWallet(supabaseAdmin, data.anchor);
    const view = await buildWalletView(supabaseAdmin, wallet);

    if (view.hasStanding) return view;

    const available = balanceOf(view.balances, PLATFORM_TOKEN);
    if (available < ENTRY_PRICE_JBK) {
      return { ...view, error: "Not enough JBK yet." } as WalletView & { error: string };
    }

    const { error } = await supabaseAdmin.from("ledger_entries").insert({
      wallet_id: wallet.id,
      token_code: PLATFORM_TOKEN,
      direction: "debit",
      amount: ENTRY_PRICE_JBK,
      reason: "spent:entry",
      ref: `anchor:${wallet.anchor}`,
      memo: "Entry to the platform. Standing requested.",
    });
    if (error) throw new Error("Failed to record the entry payment");

    return await buildWalletView(supabaseAdmin, wallet);
  });

/**
 * The claim. An anonymous wallet is never duplicated — it is attached to a
 * certified identity, and the attachment itself is two ledger entries.
 */
export const claimWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ anchor: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildWalletView, requireWallet, balanceOf, ensureUserWallet } = await import(
      "@/lib/wallet.server"
    );

    const anon = await requireWallet(supabaseAdmin, data.anchor);
    if (anon.claimed_at) {
      return { ok: false as const, reason: "already_claimed" };
    }

    const target = await ensureUserWallet(supabaseAdmin, context.userId);
    const view = await buildWalletView(supabaseAdmin, anon);
    const amount = balanceOf(view.balances, PLATFORM_TOKEN);

    if (amount > 0) {
      const { error } = await supabaseAdmin.from("ledger_entries").insert([
        {
          wallet_id: anon.id,
          token_code: PLATFORM_TOKEN,
          direction: "debit",
          amount,
          reason: "transfer:out",
          ref: `wallet:${target.id}`,
          memo: "Moved to the MarketApp ledger-wallet on claim.",
          counterparty_wallet_id: target.id,
        },
        {
          wallet_id: target.id,
          token_code: PLATFORM_TOKEN,
          direction: "credit",
          amount,
          reason: "transfer:in",
          ref: `wallet:${anon.id}`,
          memo: "Received from the Interested User holding wallet.",
          counterparty_wallet_id: anon.id,
        },
      ]);
      if (error) throw new Error("Failed to move the balance");
    }

    const { error: markErr } = await supabaseAdmin
      .from("ledger_wallets")
      .update({ claimed_at: new Date().toISOString(), user_id: context.userId })
      .eq("id", anon.id);
    if (markErr) throw new Error("Failed to record the claim");

    return { ok: true as const, movedJbk: amount, walletId: target.id };
  });

export type LedgerFeedRow = WalletEntry & {
  wallet_kind: string;
  wallet_label: string;
  wallet_anchor: string | null;
};

export const listLedgerFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "founder_admin",
    });
    if (roleErr) throw new Error("Authorization check failed");
    let ok = !!allowed;
    if (!ok) {
      const { data: insider } = await context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "qualified_insider",
      });
      ok = !!insider;
    }
    if (!ok) throw new Error("Forbidden");

    const { data: entries, error } = await context.supabase
      .from("ledger_entries")
      .select(`${ENTRY_COLUMNS}, ledger_wallets!inner(kind, label, anchor)`)
      .order("occurred_at", { ascending: false })
      .limit(200);
    if (error) throw new Error("Failed to load the ledger feed");

    const { data: tokens } = await context.supabase
      .from("ledger_tokens")
      .select("code, name, symbol, peg_usd, peg_note, is_active, position")
      .order("position");

    const rows: LedgerFeedRow[] = (entries ?? []).map((e: Record<string, unknown>) => {
      const w = (e["ledger_wallets"] ?? {}) as Record<string, unknown>;
      return {
        id: String(e["id"]),
        wallet_id: String(e["wallet_id"]),
        token_code: String(e["token_code"]),
        direction: e["direction"] as "credit" | "debit",
        amount: Number(e["amount"]),
        reason: String(e["reason"]),
        ref: String(e["ref"] ?? ""),
        memo: String(e["memo"] ?? ""),
        occurred_at: String(e["occurred_at"]),
        wallet_kind: String(w["kind"] ?? ""),
        wallet_label: String(w["label"] ?? ""),
        wallet_anchor: (w["anchor"] as string | null) ?? null,
      };
    });

    return { rows, tokens: tokens ?? [] };
  });
