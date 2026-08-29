import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { listLedgerFeed } from "@/lib/wallet.functions";
import { reasonLabel } from "@/lib/wallet.schedule";

export const Route = createFileRoute("/_authenticated/ledger")({
  head: () => ({
    meta: [
      { title: "Platform Ledger — PrepareAmerica" },
      {
        name: "description",
        content:
          "The append-only record of every JBK and ClaimCoin movement across Interested User and MarketApp wallets.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PlatformLedgerPage,
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function PlatformLedgerPage() {
  const fetchFeed = useServerFn(listLedgerFeed);
  const { data, isLoading, error } = useQuery({
    queryKey: ["ledger-feed"],
    queryFn: () => fetchFeed(),
    refetchInterval: 10_000,
  });

  const rows = data?.rows ?? [];
  const tokens = data?.tokens ?? [];

  const totals = new Map<string, number>();
  for (const r of rows) {
    const signed = r.direction === "credit" ? r.amount : -r.amount;
    totals.set(r.token_code, (totals.get(r.token_code) ?? 0) + signed);
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Mission Headquarters · Ledger"
        title="The platform ledger"
        lede="One append-only record. Wallets belong either to an anonymous anchor or to a certified identity. Balances are always summed from entries and never stored, so nothing here can be quietly adjusted."
        truth="FACT"
        confidentiality="C3"
        status={isLoading ? "Loading" : `${rows.length} entries`}
      />

      <Section number="01" title="Tokens and pegs">
        <div className="grid gap-4 sm:grid-cols-2">
          {tokens.map((t) => (
            <div key={t.code} className="border border-border p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-2xl text-ink">{t.name}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
                  {t.symbol}
                </span>
              </div>
              <div className="mt-2 font-mono text-sm text-ink">
                Peg ${fmt(Number(t.peg_usd))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.peg_note}</p>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
                Net in circulation: {fmt(totals.get(t.code) ?? 0)}
              </div>
            </div>
          ))}
          {!tokens.length && !isLoading ? (
            <p className="text-muted-foreground">No tokens defined.</p>
          ) : null}
        </div>
      </Section>

      <Section number="02" title="Entries">
        {error ? (
          <p className="text-muted-foreground">
            The ledger could not be loaded for this account.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Wallet</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Ref</th>
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 align-top">
                    <td className="py-3 pr-4 font-mono text-[11px] text-silver">
                      {new Date(r.occurred_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-ink">
                      {r.wallet_label}
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                        {r.wallet_kind}
                        {r.wallet_anchor ? ` · ${r.wallet_anchor.slice(0, 8)}` : ""}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink">
                      {reasonLabel(r.reason)}
                      {r.memo ? (
                        <div className="mt-1 max-w-[40ch] text-xs text-muted-foreground">
                          {r.memo}
                        </div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] text-silver">{r.ref}</td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-silver">
                      {r.token_code}
                    </td>
                    <td className="py-3 text-right font-mono text-ink">
                      {r.direction === "credit" ? "+" : "−"}
                      {fmt(r.amount)}
                    </td>
                  </tr>
                ))}
                {!rows.length && !isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-muted-foreground">
                      No movement recorded yet. Open{" "}
                      <span className="font-mono">/kimosabe</span> in another tab and earn.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageShell>
  );
}
