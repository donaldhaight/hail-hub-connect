import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listLedger, upsertTask, deleteTask, type LedgerRow } from "@/lib/ledger.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/ledger")({
  head: () => ({
    meta: [
      { title: "Task Ledger & Efficiency — PrepareAmerica" },
      {
        name: "description",
        content:
          "One ledger for human and agent work: estimate, actual, rework, outcome — and the two efficiency ratings computed identically from it.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LedgerPage,
});

type Draft = {
  id?: string;
  title: string;
  task_class: string;
  actor: "human" | "agent";
  sprint_label: string;
  occurred_on: string;
  est_hours: string;
  act_hours: string;
  est_cost: string;
  act_cost: string;
  rework: string;
  outcome: "open" | "accepted" | "rejected";
  note: string;
};

function emptyDraft(): Draft {
  return {
    title: "",
    task_class: "build",
    actor: "agent",
    sprint_label: "",
    occurred_on: new Date().toISOString().slice(0, 10),
    est_hours: "0",
    act_hours: "0",
    est_cost: "0",
    act_cost: "0",
    rework: "0",
    outcome: "open",
    note: "",
  };
}

function rating(rows: LedgerRow[]) {
  const closed = rows.filter((r) => r.outcome !== "open");
  const accepted = closed.filter((r) => r.outcome === "accepted");
  const hours = closed.reduce((a, r) => a + Number(r.act_hours), 0);
  const cost = closed.reduce((a, r) => a + Number(r.act_cost), 0);
  const rework = closed.reduce((a, r) => a + Number(r.rework), 0);
  const acceptRate = closed.length ? accepted.length / closed.length : 0;
  return {
    tasks: closed.length,
    accepted: accepted.length,
    hours,
    cost,
    rework,
    acceptRate,
    hoursPerAccepted: accepted.length ? hours / accepted.length : 0,
    costPerAccepted: accepted.length ? cost / accepted.length : 0,
    // Accepted output per $1,000 of loaded cost, discounted by rework.
    score: cost > 0 ? (accepted.length / (cost / 1000)) * (1 - Math.min(0.5, rework * 0.03)) : 0,
  };
}

function LedgerPage() {
  const load = useServerFn(listLedger);
  const save = useServerFn(upsertTask);
  const remove = useServerFn(deleteTask);

  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await load();
        if (!cancelled) setRows(res.rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load the ledger");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const human = useMemo(() => rating(rows.filter((r) => r.actor === "human")), [rows]);
  const agent = useMemo(() => rating(rows.filter((r) => r.actor === "agent")), [rows]);

  const variance = useMemo(() => {
    const closed = rows.filter((r) => r.outcome !== "open");
    const est = closed.reduce((a, r) => a + Number(r.est_cost), 0);
    const act = closed.reduce((a, r) => a + Number(r.act_cost), 0);
    const pct = est > 0 ? ((act - est) / est) * 100 : 0;
    return { est, act, pct, within: Math.abs(pct) <= 10 };
  }, [rows]);

  const bySprint = useMemo(() => {
    const m = new Map<string, { est: number; act: number }>();
    rows
      .filter((r) => r.outcome !== "open")
      .forEach((r) => {
        const key = r.sprint_label || "Unassigned";
        const cur = m.get(key) ?? { est: 0, act: 0 };
        cur.est += Number(r.est_cost);
        cur.act += Number(r.act_cost);
        m.set(key, cur);
      });
    return [...m.entries()].map(([label, v]) => ({
      label,
      ...v,
      pct: v.est > 0 ? ((v.act - v.est) / v.est) * 100 : 0,
    }));
  }, [rows]);

  async function handleSave() {
    if (!draft.title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await save({
        data: {
          id: draft.id,
          title: draft.title.trim(),
          task_class: draft.task_class.trim() || "build",
          actor: draft.actor,
          sprint_label: draft.sprint_label.trim() || null,
          occurred_on: draft.occurred_on,
          est_hours: Number(draft.est_hours) || 0,
          act_hours: Number(draft.act_hours) || 0,
          est_cost: Number(draft.est_cost) || 0,
          act_cost: Number(draft.act_cost) || 0,
          rework: Number(draft.rework) || 0,
          outcome: draft.outcome,
          note: draft.note,
        },
      });
      setRows((all) => {
        const next = all.filter((r) => r.id !== res.row.id);
        return [res.row, ...next].sort((a, b) => (a.occurred_on < b.occurred_on ? 1 : -1));
      });
      setDraft(emptyDraft());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to record the task");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove({ data: { id } });
      setRows((all) => all.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete the task");
    }
  }

  function edit(r: LedgerRow) {
    setDraft({
      id: r.id,
      title: r.title,
      task_class: r.task_class,
      actor: r.actor,
      sprint_label: r.sprint_label ?? "",
      occurred_on: r.occurred_on,
      est_hours: String(r.est_hours),
      act_hours: String(r.act_hours),
      est_cost: String(r.est_cost),
      act_cost: String(r.act_cost),
      rework: String(r.rework),
      outcome: r.outcome,
      note: r.note,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console · Act 2"
        title="Task Ledger and the Efficiency Proof"
        lede="One ledger, two actors, identical accounting. Human and agent work is recorded the same way — estimate, actual, rework, outcome — so the ratings can be compared without special pleading."
        truth="FACT"
        confidentiality="C3"
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

        {/* Ratings */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <RatingCard label="Human Task Efficiency Rating" tone="ink" r={human} />
          <RatingCard label="Agent Task Efficiency Rating" tone="navy" r={agent} />
        </section>

        <p className="mt-4 max-w-[80ch] text-sm text-muted-foreground">
          Ledger rows are <strong className="text-ink">FACT</strong>. The ratings computed from them are{" "}
          <strong className="text-ink">ASSERTION</strong>. Any claim that a widening spread between these two
          numbers implies deflation is <strong className="text-ink">HYPOTHESIS</strong> and stays off every
          public surface until the ledger is long enough to survive an audit.
        </p>

        {/* Variance */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-ink">The 10% rule</h2>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            If we can bill it, we can build it — and if estimate and actual land inside ten percent, we get to
            keep running with the project.
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-6 border border-border p-5">
            <Stat label="Estimated" value={`$${Math.round(variance.est).toLocaleString()}`} />
            <Stat label="Actual" value={`$${Math.round(variance.act).toLocaleString()}`} />
            <Stat
              label="Variance"
              value={`${variance.pct >= 0 ? "+" : ""}${variance.pct.toFixed(1)}%`}
              tone={variance.within ? "ok" : "warn"}
            />
            <span
              className={`ml-auto border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
                variance.within ? "border-navy text-navy" : "border-burgundy text-burgundy"
              }`}
            >
              {variance.within ? "Inside the rule" : "Outside the rule"}
            </span>
          </div>

          <ul className="mt-4 divide-y divide-border border-y border-border">
            {bySprint.map((s) => (
              <li key={s.label} className="flex flex-wrap items-center gap-4 py-2 text-sm">
                <span className="min-w-[10rem] text-ink">{s.label}</span>
                <span className="font-mono text-muted-foreground">
                  est ${Math.round(s.est).toLocaleString()} · act ${Math.round(s.act).toLocaleString()}
                </span>
                <span
                  className={`ml-auto font-mono text-[12px] ${
                    Math.abs(s.pct) <= 10 ? "text-navy" : "text-burgundy"
                  }`}
                >
                  {s.pct >= 0 ? "+" : ""}
                  {s.pct.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Entry form */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-ink">{draft.id ? "Edit entry" : "Record work"}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Input label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Input
              label="Task class"
              value={draft.task_class}
              onChange={(v) => setDraft({ ...draft, task_class: v })}
            />
            <Select
              label="Actor"
              value={draft.actor}
              options={["agent", "human"]}
              onChange={(v) => setDraft({ ...draft, actor: v as Draft["actor"] })}
            />
            <Input
              label="Sprint label"
              value={draft.sprint_label}
              onChange={(v) => setDraft({ ...draft, sprint_label: v })}
            />
            <Input
              label="Date"
              type="date"
              value={draft.occurred_on}
              onChange={(v) => setDraft({ ...draft, occurred_on: v })}
            />
            <Select
              label="Outcome"
              value={draft.outcome}
              options={["open", "accepted", "rejected"]}
              onChange={(v) => setDraft({ ...draft, outcome: v as Draft["outcome"] })}
            />
            <Input
              label="Estimated hours"
              type="number"
              value={draft.est_hours}
              onChange={(v) => setDraft({ ...draft, est_hours: v })}
            />
            <Input
              label="Actual hours"
              type="number"
              value={draft.act_hours}
              onChange={(v) => setDraft({ ...draft, act_hours: v })}
            />
            <Input
              label="Estimated cost"
              type="number"
              value={draft.est_cost}
              onChange={(v) => setDraft({ ...draft, est_cost: v })}
            />
            <Input
              label="Actual cost"
              type="number"
              value={draft.act_cost}
              onChange={(v) => setDraft({ ...draft, act_cost: v })}
            />
            <Input
              label="Rework cycles"
              type="number"
              value={draft.rework}
              onChange={(v) => setDraft({ ...draft, rework: v })}
            />
            <Input label="Note" value={draft.note} onChange={(v) => setDraft({ ...draft, note: v })} />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busy || !draft.title.trim()}
              onClick={handleSave}
              className="border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-40"
            >
              {draft.id ? "Save entry" : "Record entry"}
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

        {/* Ledger */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-ink">The ledger</h2>
          {loading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-border">
              <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-ink/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Task</th>
                    <th className="px-3 py-2">Actor</th>
                    <th className="px-3 py-2 text-right">Est h</th>
                    <th className="px-3 py-2 text-right">Act h</th>
                    <th className="px-3 py-2 text-right">Est $</th>
                    <th className="px-3 py-2 text-right">Act $</th>
                    <th className="px-3 py-2 text-right">Rework</th>
                    <th className="px-3 py-2">Outcome</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-ink/[0.02]">
                      <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">{r.occurred_on}</td>
                      <td className="px-3 py-2 text-ink">
                        {r.title}
                        {r.sprint_label ? (
                          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                            {r.sprint_label}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {r.actor}
                      </td>
                      <td className="px-3 py-2 text-right font-mono">{Number(r.est_hours)}</td>
                      <td className="px-3 py-2 text-right font-mono">{Number(r.act_hours)}</td>
                      <td className="px-3 py-2 text-right font-mono">${Number(r.est_cost).toLocaleString()}</td>
                      <td className="px-3 py-2 text-right font-mono">${Number(r.act_cost).toLocaleString()}</td>
                      <td className="px-3 py-2 text-right font-mono">{r.rework}</td>
                      <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {r.outcome}
                      </td>
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
          )}
        </section>
      </div>
    </PageShell>
  );
}

function RatingCard({
  label,
  r,
  tone,
}: {
  label: string;
  tone: "ink" | "navy";
  r: ReturnType<typeof rating>;
}) {
  return (
    <div className={`border p-6 ${tone === "navy" ? "border-navy/40 bg-navy/[0.03]" : "border-border"}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{label}</div>
      <div className="mt-2 font-serif text-4xl text-ink">{r.score.toFixed(2)}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
        accepted tasks per $1K, rework-discounted
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Pair label="Closed tasks" value={String(r.tasks)} />
        <Pair label="Accepted" value={`${r.accepted} (${(r.acceptRate * 100).toFixed(0)}%)`} />
        <Pair label="Hours / accepted" value={r.hoursPerAccepted.toFixed(1)} />
        <Pair label="Cost / accepted" value={`$${Math.round(r.costPerAccepted).toLocaleString()}`} />
        <Pair label="Total hours" value={r.hours.toFixed(1)} />
        <Pair label="Rework cycles" value={String(r.rework)} />
      </dl>
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</div>
      <div
        className={`font-serif text-2xl ${
          tone === "warn" ? "text-burgundy" : tone === "ok" ? "text-navy" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-[14px] text-ink outline-none focus:border-navy"
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
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-background px-2 py-1.5 text-[14px] text-ink outline-none focus:border-navy"
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
