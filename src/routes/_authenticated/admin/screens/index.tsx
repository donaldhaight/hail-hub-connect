import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { listScreens, createScreenPage, exportScreenBook, type ScreenPage } from "@/lib/screens.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/screens/")({
  head: () => ({
    meta: [
      { title: "Screen Book — PrepareAmerica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ScreenBookPage,
});

type Summary = Record<string, { written: number; questions: number; evidence: number; lastEdited: string | null }>;

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(status: string) {
  switch (status) {
    case "built":
      return "border-navy bg-navy/5 text-navy";
    case "specified":
      return "border-ink/30 text-ink";
    default:
      return "border-border text-silver";
  }
}

function ScreenBookPage() {
  const myRoles = useServerFn(getMyRoles);
  const load = useServerFn(listScreens);
  const create = useServerFn(createScreenPage);
  const exportBook = useServerFn(exportScreenBook);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [pages, setPages] = useState<ScreenPage[]>([]);
  const [summary, setSummary] = useState<Summary>({});
  const [branch, setBranch] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [adding, setAdding] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  const refresh = () => {
    load()
      .then((r) => {
        setPages(r.pages);
        setSummary(r.summary as Summary);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  };

  useEffect(() => {
    if (!authorized) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  const branches = useMemo(
    () => Array.from(new Set(pages.map((p) => p.branch))).sort(),
    [pages],
  );

  const rows = useMemo(
    () =>
      pages.filter(
        (p) => (branch === "all" || p.branch === branch) && (status === "all" || p.status === status),
      ),
    [pages, branch, status],
  );

  const counts = useMemo(() => {
    const total = pages.length;
    const described = pages.filter((p) => (summary[p.id]?.written ?? 0) > 0).length;
    const questions = pages.reduce((n, p) => n + (summary[p.id]?.questions ?? 0), 0);
    const evidence = pages.reduce((n, p) => n + (summary[p.id]?.evidence ?? 0), 0);
    return { total, described, questions, evidence };
  }, [pages, summary]);

  async function handleAdd() {
    if (!newSlug.trim() || branch === "all") return;
    setBusy(true);
    try {
      const slug = newSlug.trim().replace(/\s+/g, "_");
      await create({ data: { branch, slug, name: slug.replace(/_/g, " "), class: "C2" } });
      setNewSlug("");
      setAdding(false);
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    setBusy(true);
    try {
      const r = await exportBook();
      const blob = new Blob([r.markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `screen-book-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
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
        eyebrow="Screen Book"
        title="Every surface, one row each."
        lede="One folder per screen: what it is for, who may open it, which records appear, what the guide may do, and what ends it. Empty is an honest state."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {[
            { label: "Screens", value: String(counts.total) },
            { label: "Started", value: String(counts.described) },
            { label: "Open questions", value: String(counts.questions) },
            { label: "Evidence", value: String(counts.evidence) },
          ].map((s) => (
            <div key={s.label} className="bg-background px-4 py-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">{s.label}</div>
              <div className="mt-1 font-serif text-xl text-ink">{s.value}</div>
            </div>
          ))}
        </div>

        {err ? (
          <div className="mt-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{err}</div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="border border-border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            <option value="all">All branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink"
          >
            <option value="all">Any status</option>
            <option value="empty">Empty</option>
            <option value="specified">Specified</option>
            <option value="built">Built</option>
          </select>
          <button
            onClick={() => setAdding((v) => !v)}
            disabled={branch === "all"}
            title={branch === "all" ? "Pick a branch first" : "Add a screen to this branch"}
            className="border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy disabled:opacity-40"
          >
            + Screen
          </button>
          <button
            onClick={handleExport}
            disabled={busy}
            className="ml-auto border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
          >
            Export markdown
          </button>
        </div>

        {adding ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border border-border bg-muted/30 p-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{branch}</span>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="Screen_Name"
              className="border border-border bg-background px-2 py-1 text-sm text-ink"
            />
            <button
              onClick={handleAdd}
              disabled={busy}
              className="border border-navy px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-navy"
            >
              Add
            </button>
          </div>
        ) : null}

        <div className="mt-6 overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left font-mono text-[9px] uppercase tracking-[0.18em] text-silver">
                <th className="px-3 py-2">Branch</th>
                <th className="px-3 py-2">Screen</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Class</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Facets</th>
                <th className="px-3 py-2">Questions</th>
                <th className="px-3 py-2">Evidence</th>
                <th className="px-3 py-2">Last edited</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const s = summary[p.id];
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-silver">
                      {p.branch}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        to="/admin/screens/$pageId"
                        params={{ pageId: p.id }}
                        className="text-ink hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${statusClass(p.status)}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{p.class}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{p.route ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{s?.written ?? 0}/13</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{s?.questions ?? 0}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground">{s?.evidence ?? 0}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-silver">{fmt(s?.lastEdited ?? null)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          This book describes; it never rules. A question raised on a screen goes to the backlog from the screen
          itself, so the register and the board stay in step.
        </p>
      </section>
    </PageShell>
  );
}
