import { EARN_SCHEDULE, ENTRY_PRICE_JBK, PLATFORM_TOKEN } from "@/lib/wallet.schedule";
import type { WalletBalance, WalletEntry, WalletView } from "@/lib/wallet.functions";

type AdminClient = {
  from: (table: string) => any;
};

export type WalletRow = {
  id: string;
  anchor: string | null;
  kind: string;
  label: string;
  claimed_at: string | null;
};

const ENTRY_COLUMNS =
  "id, wallet_id, token_code, direction, amount, reason, ref, memo, occurred_at";

export function balanceOf(balances: WalletBalance[], token: string): number {
  return balances.find((b) => b.token_code === token)?.amount ?? 0;
}

export async function mintInterestedUserWallet(admin: AdminClient): Promise<WalletRow> {
  const anchor = crypto.randomUUID();
  const { data, error } = await admin
    .from("ledger_wallets")
    .insert({ anchor, kind: "interested_user", label: "Interested User" })
    .select("id, anchor, kind, label, claimed_at")
    .single();
  if (error || !data) throw new Error("Failed to open the file");

  const rule = EARN_SCHEDULE["earned:arrival"];
  await admin.from("ledger_entries").insert({
    wallet_id: data.id,
    token_code: PLATFORM_TOKEN,
    direction: "credit",
    amount: rule.amount,
    reason: "earned:arrival",
    ref: `anchor:${anchor}`,
    memo: rule.note,
  });

  return data as WalletRow;
}

export async function requireWallet(admin: AdminClient, anchor: string): Promise<WalletRow> {
  const { data, error } = await admin
    .from("ledger_wallets")
    .select("id, anchor, kind, label, claimed_at")
    .eq("anchor", anchor)
    .maybeSingle();
  if (error || !data) throw new Error("No file found for that anchor");
  return data as WalletRow;
}

export async function ensureUserWallet(admin: AdminClient, userId: string): Promise<WalletRow> {
  const { data: existing } = await admin
    .from("ledger_wallets")
    .select("id, anchor, kind, label, claimed_at")
    .eq("user_id", userId)
    .eq("kind", "marketapp")
    .maybeSingle();
  if (existing) return existing as WalletRow;

  const { data, error } = await admin
    .from("ledger_wallets")
    .insert({ kind: "marketapp", user_id: userId, label: "MarketApp ledger-wallet" })
    .select("id, anchor, kind, label, claimed_at")
    .single();
  if (error || !data) throw new Error("Failed to open the MarketApp wallet");
  return data as WalletRow;
}

export async function buildWalletView(
  admin: AdminClient,
  wallet: WalletRow,
): Promise<WalletView> {
  const { data: rows } = await admin
    .from("ledger_entries")
    .select(ENTRY_COLUMNS)
    .eq("wallet_id", wallet.id)
    .order("occurred_at", { ascending: false });

  const entries: WalletEntry[] = (rows ?? []).map((e: Record<string, unknown>) => ({
    id: String(e["id"]),
    wallet_id: String(e["wallet_id"]),
    token_code: String(e["token_code"]),
    direction: e["direction"] as "credit" | "debit",
    amount: Number(e["amount"]),
    reason: String(e["reason"]),
    ref: String(e["ref"] ?? ""),
    memo: String(e["memo"] ?? ""),
    occurred_at: String(e["occurred_at"]),
  }));

  const byToken = new Map<string, number>();
  for (const e of entries) {
    const signed = e.direction === "credit" ? e.amount : -e.amount;
    byToken.set(e.token_code, (byToken.get(e.token_code) ?? 0) + signed);
  }

  const balances: WalletBalance[] = [...byToken.entries()].map(([token_code, amount]) => ({
    token_code,
    amount,
  }));

  return {
    anchor: wallet.anchor ?? "",
    walletId: wallet.id,
    kind: wallet.kind,
    label: wallet.label,
    claimedAt: wallet.claimed_at,
    balances,
    entries,
    earnedReasons: [...new Set(entries.map((e) => e.reason))],
    entryPrice: ENTRY_PRICE_JBK,
    hasStanding: entries.some((e) => e.reason === "spent:entry"),
  };
}
