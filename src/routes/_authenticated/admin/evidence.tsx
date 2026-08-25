import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { getEvidenceIndex, type EvidenceRow } from "@/lib/manual-attachments.functions";

export const Route = createFileRoute("/_authenticated/admin/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence Index — Founder Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EvidencePage,
});

function formatDate(iso: string | null): string {
  if (!iso) return "undated";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" });
}

function EvidencePage() {
  const load = useServerFn(getEvidenceIndex);
  const [rows, setRows] = useState<EvidenceRow[] | null>(null);
  const [totals, setTotals] = useState<{ artifacts: number; published: number; dated: number; opens: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load()
      .then((r) => {
        setRows(r.rows);
        setTotals(r.totals);
      })
      .catch(() => setError("Founder access only."));
  }, [load]);

  if (error) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede={error} confidentiality="C2" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console"
        title="The evidence index."
        lede="Every artifact filed against the manual and the dossier corpus, oldest first. What it proves, when it was made, and who has opened it."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link
          to="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
        >
          ← Console
        </Link>

        <div className="mt-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {[
            { label: "Artifacts", value: totals?.artifacts ?? "—" },
            { label: "Published", value: totals?.published ?? "—" },
            { label: "Dated", value: totals?.dated ?? "—" },
            { label: "Total opens", value: totals?.opens ?? "—" },
          ].map((s) => (
            <div key={s.label} className="bg-background px-4 py-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">{s.label}</div>
              <div className="mt-1 font-serif text-xl text-ink">{String(s.value)}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {rows === null ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              Nothing filed yet. Open any manual chapter or dossier and file the original document against the claim it
              proves — a dated artifact is worth more than another paragraph.
            </p>
          ) : (
            <ol className="grid gap-px border border-border bg-border">
              {rows.map((r) => (
                <li key={r.id} className="bg-background px-4 py-4">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                      {formatDate(r.originalDate)}
                    </span>
                    <span className="font-serif text-lg text-ink">{r.title}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                      {r.corpus} · {r.parentTitle}
                    </span>
                    <span className="ml-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                      <span className={r.isPublished ? "text-navy" : "text-silver"}>
                        {r.isPublished ? "Published" : "Draft"}
                      </span>
                      <span className="text-muted-foreground">
                        {r.opens} opens · {r.readers} readers
                      </span>
                    </span>
                  </div>
                  {r.sourceLabel ? (
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                      {r.sourceLabel}
                    </div>
                  ) : null}
                  {r.significance ? (
                    <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-muted-foreground">{r.significance}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </PageShell>
  );
}
