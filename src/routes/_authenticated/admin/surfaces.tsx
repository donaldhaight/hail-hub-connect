import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import {
  SURFACES,
  SURFACE_TYPE_ORDER,
  SURFACE_TYPE_JOB,
  SURFACE_STATUS_LABEL,
  type SurfaceStatus,
  type SurfaceType,
} from "@/content/surfaces";

export const Route = createFileRoute("/_authenticated/admin/surfaces")({
  head: () => ({
    meta: [
      { title: "Surface and Door Registry — PrepareAmerica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SurfaceRegistryPage,
});

function statusClass(status: SurfaceStatus) {
  switch (status) {
    case "established":
      return "border-navy bg-navy/5 text-navy";
    case "preseason":
      return "border-ink/40 text-ink";
    case "simulation":
      return "border-silver/60 text-silver";
    default:
      return "border-border text-silver";
  }
}

function SurfaceRegistryPage() {
  const myRoles = useServerFn(getMyRoles);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [type, setType] = useState<"all" | SurfaceType>("all");

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  const groups = useMemo(
    () =>
      SURFACE_TYPE_ORDER.filter((t) => type === "all" || t === type).map((t) => ({
        type: t,
        rows: SURFACES.filter((s) => s.type === t),
      })),
    [type],
  );

  const shared = useMemo(() => SURFACES.filter((s) => s.siblings), []);

  if (authorized === null) {
    return (
      <PageShell>
        <PageHeader eyebrow="Registry" title="Loading…" confidentiality="C4" />
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Registry"
          title="This surface is founder-only."
          lede="Your account does not carry the founder role."
          confidentiality="C4"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Surface and Door Registry"
        title="Many Doors. One platform."
        lede="Every public surface, and the job it performs. Nothing here retires, redirects or renames anything. Where two surfaces carry the same venture name, they do so on purpose — and this page says why."
        confidentiality="C4"
      />

      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="max-w-[62ch] border-l-2 border-ink pl-4 font-serif text-lg leading-relaxed text-ink">
            Many intentional Doors. Clearly named purposes. One continuing
            person. One shared platform.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {SURFACE_TYPE_ORDER.map((t) => (
              <div key={t} className="border-t border-border pt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                  {t}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {SURFACE_TYPE_JOB[t]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setType("all")}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
              type === "all" ? "border-ink bg-ink text-paper" : "border-border text-silver"
            }`}
          >
            All {SURFACES.length}
          </button>
          {SURFACE_TYPE_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                type === t ? "border-ink bg-ink text-paper" : "border-border text-silver"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {groups.map((g) => (
            <div key={g.type}>
              <h2 className="font-serif text-2xl text-ink">{g.type}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {SURFACE_TYPE_JOB[g.type]}
              </p>
              <div className="mt-5 space-y-4">
                {g.rows.map((s) => (
                  <article key={s.route} className="border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <div className="font-mono text-[11px] tracking-[0.12em] text-ink">
                          {s.route}
                        </div>
                        <div className="mt-1 font-serif text-lg text-ink">{s.name}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {s.capturesContext ? (
                          <span className="border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-silver">
                            Captures arrival context
                          </span>
                        ) : null}
                        <span
                          className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${statusClass(s.status)}`}
                        >
                          {SURFACE_STATUS_LABEL[s.status]}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-ink/80">
                      {s.purpose}
                    </p>

                    <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm md:grid-cols-2">
                      <Row label="Audience" value={s.audience} />
                      <Row label="Controlling source" value={s.source} />
                      <Row label="Call to action" value={s.cta} />
                      <Row label="Destination" value={s.destination} />
                    </dl>

                    {s.siblings ? (
                      <p className="mt-4 border-l-2 border-silver/50 pl-4 text-sm leading-relaxed text-muted-foreground">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
                          Relationship ·{" "}
                        </span>
                        {s.siblings}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-serif text-2xl text-ink">
            Where one venture speaks twice, on purpose
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">
            A new Door is complete when its distinct purpose is declared, its
            relationship to existing surfaces is documented, and it connects the
            Interested User to the shared platform without silently replacing
            another valid expression.
          </p>
          <ul className="mt-6 space-y-3">
            {shared.map((s) => (
              <li key={s.route} className="border-t border-border pt-3">
                <span className="font-mono text-[11px] text-ink">{s.route}</span>
                <span className="ml-3 text-sm text-muted-foreground">{s.siblings}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink/80">{value}</dd>
    </div>
  );
}
