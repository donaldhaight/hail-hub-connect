import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listInsiderSignals } from "@/lib/insider.functions";
import { getMyRoles } from "@/lib/inbox.functions";
import { DOSSIERS_BY_SLUG } from "@/content/dossiers";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/signals")({
  head: () => ({
    meta: [
      { title: "Insider Signals — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SignalsPage,
});

type Row = {
  user_id: string;
  email: string;
  source: string;
  invited_at: string | null;
  redeemed_at: string | null;
  dossiers_opened: number;
  opens_total: number;
  last_active: string | null;
  last_dossier: string | null;
  messages_posted: number;
};

type Filter = "all" | "engaged" | "dormant" | "never";

const DOSSIER_TOTAL = Object.keys(DOSSIERS_BY_SLUG).length;

function SignalsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useServerFn(listInsiderSignals);
  const myRoles = useServerFn(getMyRoles);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  useEffect(() => {
    if (!authorized) return;
    setLoading(true);
    load()
      .then((r) => setRows(r.rows as Row[]))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [authorized, load]);

  const now = Date.now();
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter === "all") return true;
      if (filter === "never") return !r.last_active;
      const activeMs = r.last_active ? now - new Date(r.last_active).getTime() : Infinity;
      const engaged = activeMs < 7 * 24 * 60 * 60 * 1000;
      if (filter === "engaged") return engaged;
      if (filter === "dormant") return r.last_active && !engaged;
      return true;
    });
  }, [rows, filter, now]);

  const csv = useMemo(() => toCsv(filtered), [filtered]);

  if (authorized === null) {
    return <PageShell><div className="p-16 text-center text-silver">Loading…</div></PageShell>;
  }
  if (!authorized) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede="Founder access only." confidentiality="C2" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insider Signals"
        title="Who is actually engaging."
        lede="One row per qualified insider. Sort by last active. Use this list heading into 11-1-2026 to see who is warm, who has cooled, and who has never opened the room."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(["all", "engaged", "dormant", "never"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] ${filter === f ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"}`}
            >
              {f === "all" ? "All" : f === "engaged" ? "Engaged (7d)" : f === "dormant" ? "Dormant" : "Never opened"}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/admin/inbox"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              ← Inbox
            </a>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
              download={`insider-signals-${new Date().toISOString().slice(0, 10)}.csv`}
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Export CSV
            </a>
          </div>
        </div>

        {error ? <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div> : null}

        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
              <tr>
                <th className="p-3">Insider</th>
                <th className="p-3">Lane</th>
                <th className="p-3">Dossiers</th>
                <th className="p-3">Msgs</th>
                <th className="p-3">Last active</th>
                <th className="p-3">Last opened</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-silver">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-silver">No insiders match this filter.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.user_id} className="border-t border-border">
                  <td className="p-3 text-ink">{r.email}</td>
                  <td className="p-3 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">{r.source}</td>
                  <td className="p-3 text-xs text-muted-foreground font-mono">
                    {r.dossiers_opened} / {DOSSIER_TOTAL}
                    {r.opens_total > r.dossiers_opened ? (
                      <span className="ml-1 text-silver">({r.opens_total} opens)</span>
                    ) : null}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground font-mono">{r.messages_posted}</td>
                  <td className="p-3 text-xs text-muted-foreground font-mono">
                    {r.last_active ? new Date(r.last_active).toLocaleString() : <span className="text-silver">never</span>}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {r.last_dossier ? (DOSSIERS_BY_SLUG[r.last_dossier]?.title ?? r.last_dossier) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

function toCsv(rows: Row[]): string {
  const cols = ["email", "source", "invited_at", "redeemed_at", "dossiers_opened", "opens_total", "messages_posted", "last_active", "last_dossier"];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as any)[c])).join(","))].join("\n");
}
