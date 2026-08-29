import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";
import { earnToken, payEntryFee, resolveWallet, type WalletView } from "@/lib/wallet.functions";
import { EARN_SCHEDULE, PLATFORM_TOKEN, reasonLabel } from "@/lib/wallet.schedule";

const ANCHOR_KEY = "kimosabe.anchor";

export const Route = createFileRoute("/kimosabe")({
  head: () =>
    routeHead({
      title: "Kimosabe — the Interested User ledger",
      description:
        "Arrive with no email and no phone. A file opens, a wallet opens, and every token movement is recorded in the open. This is the front door to the Human Blockchain.",
      path: "/kimosabe",
    }),
  component: KimosabePage,
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function KimosabePage() {
  const resolve = useServerFn(resolveWallet);
  const earn = useServerFn(earnToken);
  const pay = useServerFn(payEntryFee);

  const [view, setView] = useState<WalletView | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const apply = useCallback((next: WalletView & { error?: string }) => {
    if (typeof window !== "undefined" && next.anchor) {
      window.localStorage.setItem(ANCHOR_KEY, next.anchor);
    }
    setView(next);
    setNotice(next.error ?? null);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(ANCHOR_KEY);
    resolve({ data: { anchor: stored } })
      .then((v) => apply(v as WalletView))
      .catch(() => setNotice("The file could not be opened."));
  }, [resolve, apply]);

  const balance =
    view?.balances.find((b) => b.token_code === PLATFORM_TOKEN)?.amount ?? 0;
  const price = view?.entryPrice ?? 0;

  async function doEarn(reason: keyof typeof EARN_SCHEDULE) {
    if (!view || busy) return;
    setBusy(true);
    try {
      apply((await earn({ data: { anchor: view.anchor, reason } })) as WalletView);
    } catch {
      setNotice("That gesture could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  async function doEntry() {
    if (!view || busy) return;
    setBusy(true);
    try {
      apply((await pay({ data: { anchor: view.anchor } })) as WalletView & { error?: string });
    } catch {
      setNotice("The entry payment could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Kimosabe · Interested User"
        title={view ? "I remembered you." : "A file opens."}
        lede="No email. No phone. No form. An opaque anchor was minted, a holding wallet opened alongside it, and every token movement below is a permanent line in an append-only ledger."
        truth="DECISION"
        confidentiality="C1"
        status={view ? `Anchor ${view.anchor.slice(0, 8)}` : "Opening"}
      />

      <Section number="01" title="The holding wallet">
        <div className="space-y-8">
          <div className="border border-border p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Balance
            </div>
            <div className="mt-2 font-serif text-5xl text-ink">
              {fmt(balance)} <span className="text-2xl text-silver">{PLATFORM_TOKEN}</span>
            </div>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
              JoeBack is earned, never bought. It buys one thing: entry. Entry costs{" "}
              {fmt(price)} {PLATFORM_TOKEN}. Nothing here transfers to another person, and
              nothing here has external value until a certified role exists.
            </p>
            {view?.hasStanding ? (
              <p className="mt-4 border-l-2 border-ink pl-4 text-sm text-ink">
                Entry paid. When you sign in, this file is claimed — not copied — into a
                MarketApp ledger-wallet, and the claim is itself two ledger entries.
              </p>
            ) : (
              <button
                type="button"
                disabled={!view || busy || balance < price}
                onClick={doEntry}
                className="mt-5 border border-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                Pay entry — {fmt(price)} {PLATFORM_TOKEN}
              </button>
            )}
            {notice ? (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                {notice}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Earn
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(EARN_SCHEDULE) as (keyof typeof EARN_SCHEDULE)[])
                .filter((k) => k !== "earned:arrival")
                .map((key) => {
                  const rule = EARN_SCHEDULE[key];
                  const done = view?.earnedReasons.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!view || busy || done}
                      onClick={() => doEarn(key)}
                      className="border border-border p-4 text-left transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-serif text-lg text-ink">{rule.label}</span>
                        <span className="font-mono text-[11px] text-silver">
                          {done ? "recorded" : `+${rule.amount}`}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {rule.note}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </Section>

      <Section number="02" title="The ledger, in the open">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Reason</th>
                <th className="py-2 pr-4">Token</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(view?.entries ?? []).map((e) => (
                <tr key={e.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-mono text-[11px] text-silver">
                    {new Date(e.occurred_at).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-ink">
                    {reasonLabel(e.reason)}
                    {e.memo ? (
                      <div className="mt-1 max-w-[42ch] text-xs text-muted-foreground">
                        {e.memo}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-silver">{e.token_code}</td>
                  <td className="py-3 text-right font-mono text-ink">
                    {e.direction === "credit" ? "+" : "−"}
                    {fmt(e.amount)}
                  </td>
                </tr>
              ))}
              {!view?.entries.length ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    No entries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}
