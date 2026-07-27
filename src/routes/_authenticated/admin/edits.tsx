import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { listDossierEdits } from "@/lib/dossier.functions";
import { DOSSIERS_BY_SLUG } from "@/content/dossiers";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/edits")({
  head: () => ({
    meta: [
      { title: "Recent Edits — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditsPage,
});

type Row = {
  id: string;
  actor_id: string;
  dossier_slug: string;
  section_id: string | null;
  field: string;
  before_value: string | null;
  after_value: string | null;
  created_at: string;
  email: string;
};

function EditsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const myRoles = useServerFn(getMyRoles);
  const load = useServerFn(listDossierEdits);

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
      .finally(() => setLoading(false));
  }, [authorized, load]);

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      const day = r.created_at.slice(0, 10);
      const arr = map.get(day) ?? [];
      arr.push(r);
      map.set(day, arr);
    }
    return Array.from(map.entries());
  }, [rows]);

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
        eyebrow="Recent Edits"
        title="Every dossier change."
        lede="Audit log of every save on the dossier corpus. Actor, field, before, and after — reverse-chronological."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-4 flex gap-2">
          <a href="/admin/inbox" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Inbox</a>
          <a href="/admin/digest" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Digest</a>
          <a href="/admin/signals" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Signals</a>
        </div>
        {loading ? (
          <div className="p-16 text-center text-silver">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No dossier edits yet.
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([day, items]) => (
              <div key={day}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="divide-y divide-border border border-border">
                  {items.map((r) => {
                    const d = DOSSIERS_BY_SLUG[r.dossier_slug];
                    return (
                      <div key={r.id} className="bg-card p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                            {r.field}
                          </span>
                          <span className="font-mono text-[10px] text-silver">{r.email}</span>
                        </div>
                        <div className="mt-1 font-serif text-base text-ink">
                          {d?.title ?? r.dossier_slug}
                        </div>
                        {r.before_value !== null || r.after_value !== null ? (
                          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div className="border border-border bg-muted/40 p-2 text-xs">
                              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-silver">Before</div>
                              <div className="whitespace-pre-wrap text-muted-foreground">{truncate(r.before_value ?? "—", 400)}</div>
                            </div>
                            <div className="border border-border bg-muted/40 p-2 text-xs">
                              <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-silver">After</div>
                              <div className="whitespace-pre-wrap text-ink">{truncate(r.after_value ?? "—", 400)}</div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}
