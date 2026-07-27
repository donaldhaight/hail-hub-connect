import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getFounderDigest } from "@/lib/dossier.functions";
import { getMyRoles } from "@/lib/inbox.functions";
import { DOSSIERS_BY_SLUG } from "@/content/dossiers";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/digest")({
  head: () => ({
    meta: [
      { title: "Founder Digest — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DigestPage,
});

type Digest = Awaited<ReturnType<typeof getFounderDigest>>;
type WindowDays = 1 | 7 | 30;

type Item = { ts: string; node: ReactNode };

function DigestPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [windowDays, setWindowDays] = useState<WindowDays>(7);
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myRoles = useServerFn(getMyRoles);
  const load = useServerFn(getFounderDigest);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  useEffect(() => {
    if (!authorized) return;
    setLoading(true);
    setError(null);
    load({ data: { windowDays } })
      .then(setDigest)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [authorized, load, windowDays]);

  const items = useMemo<Item[]>(() => {
    if (!digest) return [];
    const out: Item[] = [];
    for (const b of digest.briefings as any[]) {
      out.push({
        ts: b.created_at,
        node: <Row tag="Briefing request" title={`${b.name} · ${b.organization}`} body={b.interest ?? ""} meta={b.email ?? ""} href="/admin/inbox" />,
      });
    }
    for (const c of digest.conferences as any[]) {
      out.push({
        ts: c.created_at,
        node: <Row tag="PrepareAmerica" title={`${c.name} · ${c.organization}`} body={c.role_category ?? ""} meta={c.email ?? ""} href="/admin/inbox" />,
      });
    }
    for (const m of digest.messages as any[]) {
      const d = DOSSIERS_BY_SLUG[m.dossier_slug];
      out.push({
        ts: m.created_at,
        node: (
          <Row
            tag={m.author_is_founder ? "Founder reply" : "Insider message"}
            title={`${d?.title ?? m.dossier_slug}${m.section_heading ? ` · ${m.section_heading}` : ""}`}
            body={truncate(m.body, 240)}
            meta={m.email}
            href={`/insider/dossier/${m.dossier_slug}`}
          />
        ),
      });
    }
    for (const r of digest.redemptions as any[]) {
      out.push({
        ts: r.redeemed_at ?? "",
        node: <Row tag="Invitation redeemed" title={r.email} body={`Source: ${r.source ?? "—"}`} meta="" href="/admin/inbox" />,
      });
    }
    for (const r of digest.reengagements) {
      const d = DOSSIERS_BY_SLUG[r.dossier_slug];
      out.push({
        ts: r.opened_at,
        node: (
          <Row
            tag="Re-engagement"
            title={r.email}
            body={`Returned to ${d?.title ?? r.dossier_slug} after >7 days dormant.`}
            meta=""
            href={`/insider/dossier/${r.dossier_slug}`}
          />
        ),
      });
    }
    return out.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [digest]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const it of items) {
      const day = it.ts.slice(0, 10);
      const arr = map.get(day) ?? [];
      arr.push(it);
      map.set(day, arr);
    }
    return Array.from(map.entries());
  }, [items]);

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
        eyebrow="Founder Digest"
        title="Everything that moved."
        lede="Reverse-chronological. Briefing intake, PrepareAmerica applications, insider messages, invitations redeemed, and re-engagement from previously dormant insiders — one column."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[1, 7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setWindowDays(d as WindowDays)}
              className={`border px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] ${windowDays === d ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"}`}
            >
              {d === 1 ? "24 hours" : `${d} days`}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <a href="/admin/inbox" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Inbox</a>
            <a href="/admin/signals" className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy">Signals</a>
          </div>
        </div>

        {error ? (
          <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
        ) : null}

        {loading ? (
          <div className="p-16 text-center text-silver">Loading…</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Nothing to report in this window.
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([day, entries]) => (
              <div key={day}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="divide-y divide-border border border-border">
                  {entries.map((it, i) => (
                    <div key={i}>{it.node}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Row({ tag, title, body, meta, href }: { tag: string; title: string; body: string; meta: string; href: string }) {
  return (
    <a href={href} className="block bg-card p-4 transition hover:bg-muted/50">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">{tag}</span>
        {meta ? <span className="font-mono text-[10px] text-silver">{meta}</span> : null}
      </div>
      <div className="mt-1 font-serif text-lg text-ink">{title}</div>
      {body ? <p className="mt-1 max-w-[68ch] text-sm text-muted-foreground">{body}</p> : null}
    </a>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}
