import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { listTickets, issueTicket } from "@/lib/ticket.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { TICKET_TIERS, FIRST_CONGRESS } from "@/content/calendar";

export const Route = createFileRoute("/_authenticated/admin/tickets")({
  head: () => ({
    meta: [
      { title: "Invitation Ledger — PrepareAmerica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TicketsPage,
});

type Row = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  title: string | null;
  ticket_tier: string;
  ticket_status: string;
  ticket_credential: string;
  seat_status: string;
  delegate_seat_status: string;
  second_congress_credential: string;
  season_id: string;
  created_at: string;
};

const STATUSES = ["pending", "approved", "waitlisted", "declined"] as const;

function TicketsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const myRoles = useServerFn(getMyRoles);
  const load = useServerFn(listTickets);
  const issue = useServerFn(issueTicket);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  function refresh() {
    setLoading(true);
    load()
      .then((r) => setRows(r.rows as Row[]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!authorized) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.ticket_status] = (c[r.ticket_status] ?? 0) + 1;
    return c;
  }, [rows]);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.ticket_status === filter)),
    [rows, filter],
  );

  async function apply(row: Row, tier: string, status: string) {
    setBusy(row.id);
    try {
      await issue({
        data: { id: row.id, tier: tier as "observer" | "stakeholder", status: status as (typeof STATUSES)[number] },
      });
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, ticket_tier: tier, ticket_status: status } : r)),
      );
    } finally {
      setBusy(null);
    }
  }

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
        eyebrow="Invitation Ledger"
        title="The invitation ladder."
        lede={`Referral → invitation to the First Congress (${FIRST_CONGRESS.dateLabel}) → invitation to the Second Congress → delegate seat → Season One. Assign a tier, then issue.`}
        confidentiality="C2"
      />
      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <a href="/admin/inbox" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Inbox</a>
          <a href="/admin/digest" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Digest</a>
          <a href="/admin/signals" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Signals</a>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
                filter === s ? "border-navy bg-navy/5 text-navy" : "border-border text-muted-foreground hover:border-navy"
              }`}
            >
              {s} · {counts[s] ?? 0}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-16 text-center text-silver">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No requests in this state.
          </div>
        ) : (
          <div className="divide-y divide-border border border-border">
            {visible.map((r) => {
              const url = `/invitation/${r.ticket_credential}`;
              return (
                <div key={r.id} className="bg-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="font-serif text-lg text-ink">{r.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.organization ?? "—"}
                        {r.title ? ` · ${r.title}` : ""} · {r.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                        {r.ticket_status}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                        {r.delegate_seat_status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {TICKET_TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        disabled={busy === r.id}
                        onClick={() => apply(r, t.id, r.ticket_status)}
                        className={`border px-3 py-1.5 text-xs disabled:opacity-50 ${
                          r.ticket_tier === t.id
                            ? "border-navy bg-navy/5 text-navy"
                            : "border-border text-muted-foreground hover:border-navy"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                    <span className="mx-1 text-border">|</span>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={busy === r.id}
                        onClick={() => apply(r, r.ticket_tier, s)}
                        className={`border px-3 py-1.5 text-xs disabled:opacity-50 ${
                          r.ticket_status === s
                            ? "border-ink bg-ink text-paper"
                            : "border-border text-muted-foreground hover:border-navy"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {r.ticket_status === "approved" ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <code className="border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {url}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(`${window.location.origin}${url}`)
                            .then(() => {
                              setCopied(r.id);
                              setTimeout(() => setCopied(null), 1500);
                            })
                            .catch(() => {});
                        }}
                        className="border border-border px-3 py-1 text-xs text-muted-foreground hover:border-navy"
                      >
                        {copied === r.id ? "Copied" : "Copy invitation link"}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </PageShell>
  );
}
