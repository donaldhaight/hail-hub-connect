import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDossierReadHeatmap, getSectionReadSummary, type HeatmapCell } from "@/lib/section-reads.functions";
import { getAttachmentAnalytics, getAttachmentOpens } from "@/lib/attachments.functions";
import { getMyRoles } from "@/lib/inbox.functions";
import { listDossiersFromDb, type DossierRow } from "@/lib/dossier.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/reads")({
  head: () => ({
    meta: [
      { title: "Read-Depth Signals — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReadsPage,
});

type Section = { id: string; position: number; heading: string };

type AttachmentAnalytic = {
  id: string;
  title: string;
  kind: "file" | "link";
  isPublished: boolean;
  openCount: number;
  uniqueReaders: number;
  lastOpenedAt: string | null;
};

function ReadsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [dossiers, setDossiers] = useState<DossierRow[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [cells, setCells] = useState<HeatmapCell[]>([]);
  const [attachments, setAttachments] = useState<AttachmentAnalytic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailSection, setDetailSection] = useState<Section | null>(null);
  const [detailReaders, setDetailReaders] = useState<Array<{
    userId: string;
    email: string;
    dwellMs: number;
    firstSeenAt: string;
    lastSeenAt: string;
    confirmedAt: string | null;
  }> | null>(null);

  const myRoles = useServerFn(getMyRoles);
  const listDossiers = useServerFn(listDossiersFromDb);
  const loadHeatmap = useServerFn(getDossierReadHeatmap);
  const loadSectionSummary = useServerFn(getSectionReadSummary);
  const loadAttachmentAnalytics = useServerFn(getAttachmentAnalytics);
  const loadAttachmentOpens = useServerFn(getAttachmentOpens);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  useEffect(() => {
    if (!authorized) return;
    listDossiers()
      .then((r) => {
        setDossiers(r.dossiers);
        if (r.dossiers.length > 0 && !selectedSlug) setSelectedSlug(r.dossiers[0].slug);
      })
      .catch(() => {});
  }, [authorized, listDossiers, selectedSlug]);

  useEffect(() => {
    if (!authorized || !selectedSlug) return;
    setLoading(true);
    setError(null);
    Promise.all([
      loadHeatmap({ data: { slug: selectedSlug } }),
      loadAttachmentAnalytics({ data: { slug: selectedSlug } }),
    ])
      .then(([h, a]) => {
        setSections(h.sections);
        setCells(h.cells);
        setAttachments(a.attachments);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [authorized, selectedSlug, loadHeatmap, loadAttachmentAnalytics]);

  const users = useMemo(() => {
    const map = new Map<string, { email: string }>();
    for (const c of cells) {
      if (!map.has(c.userId)) map.set(c.userId, { email: c.email });
    }
    return Array.from(map.entries()).map(([userId, meta]) => ({ userId, ...meta }));
  }, [cells]);

  const cellsBySectionUser = useMemo(() => {
    const map = new Map<string, HeatmapCell>();
    for (const c of cells) {
      map.set(`${c.sectionId}:${c.userId}`, c);
    }
    return map;
  }, [cells]);

  async function openSectionDetail(section: Section) {
    setDetailSection(section);
    setDetailReaders(null);
    try {
      const r = await loadSectionSummary({ data: { slug: selectedSlug, sectionId: section.id } });
      setDetailReaders(r.readers);
    } catch (e) {
      setDetailReaders([]);
    }
  }

  function exportCsv(): string {
    const header = ["section", "email", "state", "dwell_seconds", "first_seen", "last_seen", "confirmed"].join(",");
    const lines = [];
    for (const section of sections) {
      for (const u of users) {
        const c = cellsBySectionUser.get(`${section.id}:${u.userId}`);
        lines.push(
          [
            section.heading,
            u.email,
            c?.state ?? "unseen",
            c ? Math.round(c.dwellMs / 1000) : 0,
            c?.firstSeenAt ?? "",
            c?.lastSeenAt ?? "",
            c?.confirmedAt ?? "",
          ].join(","),
        );
      }
    }
    return [header, ...lines].join("\n");
  }

  if (authorized === null) {
    return (
      <PageShell>
        <div className="p-16 text-center text-silver">Loading…</div>
      </PageShell>
    );
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
        eyebrow="Read-Depth Signals"
        title="Who read what, how deeply."
        lede="Per-dossier heatmap: rows are sections in narrative order, columns are insiders, color is read state. Click a section heading to see the full reader list."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Dossier</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="border border-border bg-paper px-3 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            >
              {dossiers.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/signals"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              ← Signals
            </Link>
            <Link
              to="/admin/inbox"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Inbox
            </Link>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(exportCsv())}`}
              download={`read-depth-${selectedSlug}-${new Date().toISOString().slice(0, 10)}.csv`}
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Export CSV
            </a>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 bg-muted border border-border" />
            Unseen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 bg-yellow-100 border border-yellow-300" />
            Skimmed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 bg-navy/30 border border-navy/50" />
            Read
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 bg-navy border border-navy" />
            Confirmed
          </span>
        </div>

        {error ? (
          <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
        ) : null}

        {loading ? (
          <div className="p-16 text-center text-silver">Loading…</div>
        ) : users.length === 0 ? (
          <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No insider reads recorded for this dossier yet.
          </div>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                <tr>
                  <th className="sticky left-0 z-10 min-w-[220px] bg-muted p-3">Section</th>
                  {users.map((u) => (
                    <th key={u.userId} className="min-w-[100px] p-3 text-center">
                      <div className="max-w-[120px] truncate">{u.email}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.id} className="border-t border-border">
                    <td className="sticky left-0 z-10 bg-card p-3 align-top">
                      <button
                        onClick={() => openSectionDetail(section)}
                        className="text-left text-ink hover:text-navy hover:underline"
                      >
                        <span className="font-mono text-[10px] text-silver">§{section.position + 1}</span>
                        <br />
                        {section.heading}
                      </button>
                    </td>
                    {users.map((u) => {
                      const c = cellsBySectionUser.get(`${section.id}:${u.userId}`);
                      return (
                        <td key={u.userId} className="p-1 text-center align-middle">
                          <div
                            className={`mx-auto flex h-8 w-8 items-center justify-center border text-[10px] font-mono ${
                              !c || c.state === "unseen"
                                ? "bg-muted border-border text-silver"
                                : c.state === "skimmed"
                                  ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                  : c.state === "read"
                                    ? "bg-navy/30 border-navy/50 text-ink"
                                    : "bg-navy border-navy text-paper"
                            }`}
                            title={
                              c
                                ? `${c.state} · ${Math.round(c.dwellMs / 1000)}s${c.confirmedAt ? " · confirmed" : ""}`
                                : "unseen"
                            }
                          >
                            {c ? (c.state === "confirmed" ? "✓" : Math.round(c.dwellMs / 1000)) : "—"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {attachments.length > 0 ? (
          <div className="mt-10">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Attachment engagement
            </div>
            <div className="border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                  <tr>
                    <th className="p-3">Attachment</th>
                    <th className="p-3">Kind</th>
                    <th className="p-3">Opens</th>
                    <th className="p-3">Unique readers</th>
                    <th className="p-3">Last opened</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {attachments.map((a) => (
                    <tr key={a.id} className="border-t border-border">
                      <td className="p-3 text-ink">{a.title}</td>
                      <td className="p-3 text-xs font-mono uppercase text-muted-foreground">{a.kind}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{a.openCount}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">{a.uniqueReaders}</td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">
                        {a.lastOpenedAt ? new Date(a.lastOpenedAt).toLocaleString() : "—"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={async () => {
                            const r = await loadAttachmentOpens({ data: { attachmentId: a.id } });
                            const list = r.opens.map((o) => `• ${o.email} — ${new Date(o.openedAt).toLocaleString()}`).join("\n");
                            alert(list || "No opens recorded.");
                          }}
                          className="text-xs text-muted-foreground hover:text-ink"
                        >
                          View opens
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </section>

      {detailSection ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-auto border border-border bg-paper p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  §{detailSection.position + 1}
                </div>
                <div className="font-serif text-lg text-ink">{detailSection.heading}</div>
              </div>
              <button
                onClick={() => setDetailSection(null)}
                className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
              >
                Close
              </button>
            </div>
            {detailReaders === null ? (
              <div className="p-6 text-center text-silver">Loading…</div>
            ) : detailReaders.length === 0 ? (
              <div className="p-6 text-center text-silver">No readers yet.</div>
            ) : (
              <ul className="divide-y divide-border border border-border">
                {detailReaders.map((r) => (
                  <li key={r.userId} className="flex flex-wrap items-center justify-between gap-2 p-3">
                    <div className="text-sm text-ink">{r.email}</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {r.confirmedAt ? (
                        <span className="text-navy">confirmed</span>
                      ) : r.dwellMs >= 10000 ? (
                        "read"
                      ) : r.dwellMs > 0 ? (
                        "skimmed"
                      ) : (
                        "seen"
                      )}
                      {" · "}
                      {Math.round(r.dwellMs / 1000)}s
                      {r.confirmedAt ? ` · ${new Date(r.confirmedAt).toLocaleString()}` : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
