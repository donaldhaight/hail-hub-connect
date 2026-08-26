import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  createAssumption,
  deleteAssumption,
  getEconomicsFrame,
  updateAssumption,
  type AssumptionRow,
} from "@/lib/economics.functions";
import { getMyRoles } from "@/lib/inbox.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/economics")({
  head: () => ({
    meta: [
      { title: "Economics Assumptions — PrepareAmerica" },
      { name: "description", content: "Founder Console editor for the weather-track economics model: every variable, band, truth label, and source." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EconomicsAdminPage,
});

const UNITS = ["usd", "rate", "count", "ratio", "hours", "cpm"] as const;
const TRUTH_LABELS = ["ASSERTION", "FACT", "HYPOTHESIS", "DECISION"] as const;

const STAGES = [
  "footprint",
  "targeting",
  "campaign",
  "contact",
  "conversion",
  "close",
  "revenue",
  "attach",
  "pricing",
] as const;

function emptyDraft(): Draft {
  return {
    key: "",
    stage: "footprint",
    label: "",
    definition: "",
    unit: "rate",
    low: "0",
    base: "0",
    high: "0",
    truth_label: "ASSERTION",
    source: "",
    position: "0",
  };
}

type Draft = {
  id?: string;
  key: string;
  stage: string;
  label: string;
  definition: string;
  unit: string;
  low: string;
  base: string;
  high: string;
  truth_label: string;
  source: string;
  position: string;
};

function EconomicsAdminPage() {
  const load = useServerFn(getEconomicsFrame);
  const save = useServerFn(updateAssumption);
  const add = useServerFn(createAssumption);
  const remove = useServerFn(deleteAssumption);
  const myRoles = useServerFn(getMyRoles);

  const [rows, setRows] = useState<AssumptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    load()
      .then((res) => {
        if (!cancelled) setRows(res.assumptions);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load assumptions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authorized, load]);

  const stages = useMemo(() => {
    const map = new Map<string, AssumptionRow[]>();
    for (const r of rows) {
      const list = map.get(r.stage) ?? [];
      list.push(r);
      map.set(r.stage, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.position - b.position);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  async function handleSave() {
    if (!draft.key.trim() || !draft.label.trim() || !draft.source.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const payload = {
        key: draft.key.trim(),
        stage: draft.stage.trim(),
        label: draft.label.trim(),
        definition: draft.definition.trim(),
        unit: draft.unit.trim(),
        low: Number(draft.low) || 0,
        base: Number(draft.base) || 0,
        high: Number(draft.high) || 0,
        truth_label: draft.truth_label.trim(),
        source: draft.source.trim(),
        position: Number(draft.position) || 0,
      };
      const res = draft.id
        ? await save({ data: { id: draft.id, ...payload } })
        : await add({ data: payload });
      setRows((all) => {
        const next = all.filter((r) => r.id !== res.row.id);
        return [...next, res.row].sort((a, b) => a.position - b.position);
      });
      setDraft(emptyDraft());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save the assumption");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assumption? It will disappear from the Room's ladder.")) return;
    try {
      await remove({ data: { id } });
      setRows((all) => all.filter((r) => r.id !== id));
      if (draft.id === id) setDraft(emptyDraft());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete the assumption");
    }
  }

  function edit(r: AssumptionRow) {
    setDraft({
      id: r.id,
      key: r.key,
      stage: r.stage,
      label: r.label,
      definition: r.definition,
      unit: r.unit,
      low: String(r.low),
      base: String(r.base),
      high: String(r.high),
      truth_label: r.truth_label,
      source: r.source,
      position: String(r.position),
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
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
        eyebrow="Founder Console · Economics Engine"
        title="The assumption register"
        lede="Every variable that drives the weather-track ladder lives here. Edit the bands, change the truth label, or add a new stage. The Room recomputes on the next load."
        truth="DECISION"
        confidentiality="C2"
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/room"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
        >
          ← Situation Room
        </Link>

        {error ? (
          <p className="mt-4 border border-burgundy/40 bg-burgundy/5 px-3 py-2 text-sm text-burgundy">{error}</p>
        ) : null}

        {/* Entry form */}
        <section className="mt-8 border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-ink">
            {draft.id ? "Edit assumption" : "New assumption"}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Input label="Key" value={draft.key} onChange={(v) => setDraft({ ...draft, key: v })} />
            <Select
              label="Stage"
              value={draft.stage}
              options={[...STAGES]}
              onChange={(v) => setDraft({ ...draft, stage: v })}
            />
            <Input label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
            <Input
              label="Definition"
              value={draft.definition}
              onChange={(v) => setDraft({ ...draft, definition: v })}
            />
            <Select
              label="Unit"
              value={draft.unit}
              options={[...UNITS]}
              onChange={(v) => setDraft({ ...draft, unit: v })}
            />
            <Select
              label="Truth label"
              value={draft.truth_label}
              options={[...TRUTH_LABELS]}
              onChange={(v) => setDraft({ ...draft, truth_label: v })}
            />
            <Input
              label="Low band"
              type="number"
              value={draft.low}
              onChange={(v) => setDraft({ ...draft, low: v })}
            />
            <Input
              label="Base band"
              type="number"
              value={draft.base}
              onChange={(v) => setDraft({ ...draft, base: v })}
            />
            <Input
              label="High band"
              type="number"
              value={draft.high}
              onChange={(v) => setDraft({ ...draft, high: v })}
            />
            <Input label="Source" value={draft.source} onChange={(v) => setDraft({ ...draft, source: v })} />
            <Input
              label="Position"
              type="number"
              value={draft.position}
              onChange={(v) => setDraft({ ...draft, position: v })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busy || !draft.key.trim() || !draft.label.trim()}
              onClick={handleSave}
              className="border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-40"
            >
              {draft.id ? "Save changes" : "Add assumption"}
            </button>
            {draft.id ? (
              <button
                type="button"
                onClick={() => setDraft(emptyDraft())}
                className="border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </section>

        {/* Register */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-ink">The register</h2>
          {loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="mt-4 space-y-8">
              {stages.map(([stage, items]) => (
                <div key={stage}>
                  <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                    {stage}
                  </h3>
                  <div className="overflow-x-auto border border-border">
                    <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border bg-ink/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                          <th className="px-3 py-2">Pos</th>
                          <th className="px-3 py-2">Key</th>
                          <th className="px-3 py-2">Label</th>
                          <th className="px-3 py-2">Definition</th>
                          <th className="px-3 py-2">Unit</th>
                          <th className="px-3 py-2 text-right">Low</th>
                          <th className="px-3 py-2 text-right">Base</th>
                          <th className="px-3 py-2 text-right">High</th>
                          <th className="px-3 py-2">Truth</th>
                          <th className="px-3 py-2">Source</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((r) => (
                          <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-ink/[0.02]">
                            <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">
                              {r.position}
                            </td>
                            <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
                              {r.key}
                            </td>
                            <td className="px-3 py-2 text-ink">{r.label}</td>
                            <td className="px-3 py-2 text-[12px] text-muted-foreground">{r.definition}</td>
                            <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                              {r.unit}
                            </td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                              {fmt(r.unit, r.low)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums text-ink">
                              {fmt(r.unit, r.base)}
                            </td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                              {fmt(r.unit, r.high)}
                            </td>
                            <td className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                              {r.truth_label}
                            </td>
                            <td className="px-3 py-2 text-[12px] text-muted-foreground">{r.source}</td>
                            <td className="whitespace-nowrap px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => edit(r)}
                                className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy hover:text-ink"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(r.id)}
                                className="ml-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-burgundy"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {stages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assumptions yet.</p>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

function fmt(unit: string, n: number) {
  if (unit === "usd" || unit === "cpm") return `$${n.toLocaleString()}`;
  if (unit === "rate") return `${(n * 100).toFixed(1)}%`;
  return n.toLocaleString();
}

function Input({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: "text" | "number" | "date";
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
