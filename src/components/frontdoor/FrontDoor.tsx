import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { earnToken, payEntryFee, resolveWallet, type WalletView } from "@/lib/wallet.functions";
import {
  EARN_SCHEDULE,
  KIMOSABE_ANCHOR_KEY as ANCHOR_KEY,
  PLATFORM_TOKEN,
  reasonLabel,
} from "@/lib/wallet.schedule";
import { Meta } from "@/components/briefing/Badges";
import type { Persona } from "@/content/personas";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

/**
 * The shared front door.
 *
 * One machine, many faces. Every persona renders through this component and
 * shares one anchor key, one wallet, and one ledger — the person is the same
 * person at every door, and the file never splits.
 */
export function FrontDoor({ persona }: { persona: Persona }) {
  const resolve = useServerFn(resolveWallet);
  const earn = useServerFn(earnToken);
  const pay = useServerFn(payEntryFee);

  const [view, setView] = useState<WalletView | null>(null);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const booted = useRef(false);

  const apply = useCallback((next: WalletView & { error?: string }) => {
    if (typeof window !== "undefined" && next.anchor) {
      window.localStorage.setItem(ANCHOR_KEY, next.anchor);
    }
    setView(next);
    setNotice(next.error ?? null);
  }, []);

  // A returning anchor opens quietly — the door remembers without a form.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    const stored = window.localStorage.getItem(ANCHOR_KEY);
    if (!stored) return;
    resolve({ data: { anchor: stored } })
      .then((v) => {
        apply(v as WalletView);
        setOpened(true);
      })
      .catch(() => setNotice("The file could not be opened."));
  }, [resolve, apply]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const q = question.trim();
    if (!q) return;
    setBusy(true);
    try {
      const stored = window.localStorage.getItem(ANCHOR_KEY);
      const v = (await resolve({ data: { anchor: stored } })) as WalletView;
      apply(v);
      setAsked(q);
      setOpened(true);
      // Participation is an earn gesture — recorded once, permanently.
      const earned = (await earn({
        data: { anchor: v.anchor, reason: "earned:participate" },
      })) as WalletView;
      apply(earned);
    } catch {
      setNotice("The file could not be opened.");
    } finally {
      setBusy(false);
    }
  }

  const balance = view?.balances.find((b) => b.token_code === PLATFORM_TOKEN)?.amount ?? 0;
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

  if (!opened) {
    return (
      <div
        data-brand={persona.paletteToken}
        className="flex min-h-screen flex-col bg-background text-foreground"
      >
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full max-w-xl">
            <h1 className="text-center font-serif text-6xl tracking-tight text-ink md:text-7xl">
              {persona.wordmark}
            </h1>
            <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-silver">
              {persona.eyebrow}
            </p>
            <p className="mx-auto mt-6 max-w-[46ch] text-center text-sm leading-relaxed text-muted-foreground">
              {persona.promise}
            </p>
            <form onSubmit={ask} className="mt-10">
              <div className="flex border border-border transition-colors focus-within:border-navy">
                <div className="flex items-center pl-4">
                  <Search className="h-4 w-4 text-silver" />
                </div>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={persona.askPlaceholder}
                  aria-label={`Ask ${persona.wordmark}`}
                  className="h-14 w-full bg-transparent px-4 text-base text-ink placeholder:text-silver focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={busy || !question.trim()}
                className="mt-4 w-full border border-ink py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "Opening…" : persona.openLabel}
              </button>
            </form>
            {notice ? (
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                {notice}
              </p>
            ) : null}
          </div>
        </main>
        <footer className="px-6 py-6 text-center">
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver hover:text-ink"
          >
            prepareamerica.com
          </Link>
        </footer>
      </div>
    );
  }

  return (
    <div
      data-brand={persona.paletteToken}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <span className="font-serif text-lg tracking-tight text-ink">{persona.wordmark}</span>
          <Meta
            truth="DECISION"
            confidentiality="C1"
            status={view ? `Anchor ${view.anchor.slice(0, 8)}` : undefined}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {asked ? (
          <div className="mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              You asked
            </div>
            <p className="mt-2 font-serif text-2xl leading-snug text-ink">{asked}</p>
            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              {persona.openedBody}
            </p>
          </div>
        ) : (
          <p className="mb-8 text-sm text-muted-foreground">I remembered you.</p>
        )}

        {/* The holding wallet */}
        <section className="mb-10 border border-border p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Holding wallet
          </div>
          <div className="mt-2 font-serif text-5xl text-ink">
            {fmt(balance)} <span className="text-2xl text-silver">{PLATFORM_TOKEN}</span>
          </div>
          <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
            {persona.walletBody} Entry costs {fmt(price)} {PLATFORM_TOKEN}.
          </p>
          {view?.hasStanding ? (
            <p className="mt-4 border-l-2 border-ink pl-4 text-sm text-ink">
              Entry paid. When you sign in, this file is claimed — not copied — into a MarketApp
              ledger-wallet, and the claim is itself two ledger entries.
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
          <div className="mt-4">
            <Link
              to="/auth"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:underline"
            >
              Have an account? Claim this file →
            </Link>
          </div>
          {notice ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
              {notice}
            </p>
          ) : null}
        </section>

        {/* Earn */}
        <section className="mb-10">
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
        </section>

        {/* The ledger, in the open */}
        <section className="mb-10">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            The ledger, in the open
          </div>
          <div className="overflow-x-auto border border-border p-5">
            <table className="w-full min-w-[30rem] text-sm">
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
        </section>

        <form onSubmit={ask} className="mb-6">
          <div className="flex border border-border transition-colors focus-within:border-navy">
            <div className="flex items-center pl-4">
              <Search className="h-4 w-4 text-silver" />
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={persona.askAgainPlaceholder}
              aria-label={`Ask ${persona.wordmark} again`}
              className="h-12 w-full bg-transparent px-4 text-sm text-ink placeholder:text-silver focus:outline-none"
            />
          </div>
        </form>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center">
        <Link
          to="/"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver hover:text-ink"
        >
          prepareamerica.com
        </Link>
      </footer>
    </div>
  );
}
