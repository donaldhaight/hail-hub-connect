import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getRoomFrame,
  getScenarioSignals,
  saveRoomView,
  deleteRoomView,
  getDemoScript,
  type ScenarioRow,
  type VariableRow,
  type SignalRow,
  type SavedViewRow,
  type DemoScriptRow,
} from "@/lib/room.functions";
import { getMyRoles } from "@/lib/inbox.functions";
import { LENSES, LAYOUTS, getLens, formatValue, resolvePrompt, type Layout, type Lens } from "@/content/room";
import { PageShell } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/room")({
  head: () => ({
    meta: [
      { title: "The Situation Room — PrepareAmerica" },
      {
        name: "description",
        content:
          "A live console for the insurance restoration market: every variable attributed, every number traceable, read through the seven functions of the Human Blockchain.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RoomPage,
});

type Row = SignalRow & { variable: VariableRow };

function RoomPage() {
  const loadFrame = useServerFn(getRoomFrame);
  const loadSignals = useServerFn(getScenarioSignals);
  const saveView = useServerFn(saveRoomView);
  const removeView = useServerFn(deleteRoomView);
  const loadDemo = useServerFn(getDemoScript);
  const myRoles = useServerFn(getMyRoles);

  const [scenarios, setScenarios] = useState<ScenarioRow[]>([]);
  const [variables, setVariables] = useState<VariableRow[]>([]);
  const [views, setViews] = useState<SavedViewRow[]>([]);
  const [signals, setSignals] = useState<SignalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scenarioSlug, setScenarioSlug] = useState<string>("");
  const [lens, setLens] = useState<Lens>("Center");
  const [layout, setLayout] = useState<Layout>("table");
  const [q, setQ] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptEcho, setPromptEcho] = useState<string[]>([]);
  const [inspect, setInspect] = useState<Row | null>(null);
  const [viewName, setViewName] = useState("");
  const [busy, setBusy] = useState(false);

  const [isFounder, setIsFounder] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoScript, setDemoScript] = useState<DemoScriptRow[]>([]);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const frame = await loadFrame();
        if (cancelled) return;
        setScenarios(frame.scenarios);
        setVariables(frame.variables);
        setViews(frame.views);
        setScenarioSlug(frame.scenarios[0]?.slug ?? "");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to open the room");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadFrame]);

  const scenario = useMemo(
    () => scenarios.find((s) => s.slug === scenarioSlug) ?? scenarios[0],
    [scenarios, scenarioSlug],
  );

  useEffect(() => {
    if (!scenario) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await loadSignals({ data: { scenarioId: scenario.id } });
        if (!cancelled) setSignals(res.signals);
      } catch {
        if (!cancelled) setSignals([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scenario, loadSignals]);

  // Scenario clock.
  const stepsRef = useRef(4);
  stepsRef.current = scenario?.clock_steps ?? 4;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => {
        const next = s + 1;
        if (next >= stepsRef.current) {
          setPlaying(false);
          return stepsRef.current - 1;
        }
        return next;
      });
    }, 1400);
    return () => clearInterval(t);
  }, [playing]);

  const varByKey = useMemo(() => {
    const m = new Map<string, VariableRow>();
    variables.forEach((v) => m.set(v.key, v));
    return m;
  }, [variables]);

  const lensConfig = getLens(lens);

  const rows: Row[] = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return signals
      .filter((s) => s.clock_step === step)
      .filter((s) => lensConfig.variables.includes(s.variable_key))
      .filter((s) => s.confidence >= minConfidence)
      .filter((s) =>
        needle
          ? `${s.county} ${s.state} ${s.variable_key} ${s.provenance}`.toLowerCase().includes(needle)
          : true,
      )
      .map((s) => ({ ...s, variable: varByKey.get(s.variable_key)! }))
      .filter((s) => Boolean(s.variable))
      .sort((a, b) => b.value - a.value);
  }, [signals, step, lensConfig, minConfidence, q, varByKey]);

  const counters = useMemo(() => {
    return lensConfig.variables.map((key) => {
      const v = varByKey.get(key);
      const subset = rows.filter((r) => r.variable_key === key);
      const sum = subset.reduce((acc, r) => acc + Number(r.value), 0);
      // An index is averaged across counties; everything else totals.
      const total = v?.unit === "index" && subset.length ? sum / subset.length : sum;
      const conf = subset.length
        ? subset.reduce((acc, r) => acc + Number(r.confidence), 0) / subset.length
        : 0;
      return { key, variable: v, total, confidence: conf, counties: subset.length };
    });
  }, [lensConfig, rows, varByKey]);

  const countiesTouched = useMemo(() => new Set(rows.map((r) => r.county)).size, [rows]);

  const applyPrompt = useCallback(() => {
    const r = resolvePrompt(prompt);
    if (r.lens) setLens(r.lens);
    if (r.scenario) setScenarioSlug(r.scenario);
    if (r.layout) setLayout(r.layout);
    setQ(r.q ?? "");
    setPromptEcho(r.matched.length ? r.matched : ["no match — showing the room unchanged"]);
  }, [prompt]);

  async function handleSaveView() {
    if (!viewName.trim()) return;
    setBusy(true);
    try {
      const res = await saveView({
        data: {
          name: viewName.trim(),
          lens,
          layout,
          query: { scenario: scenarioSlug, q, minConfidence, step },
          shared: true,
        },
      });
      setViews((v) => [res.view, ...v]);
      setViewName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save the view");
    } finally {
      setBusy(false);
    }
  }

  function applyView(v: SavedViewRow) {
    setLens((v.lens as Lens) ?? "Center");
    setLayout((v.layout as Layout) ?? "table");
    const query = v.query ?? {};
    if (query.scenario) setScenarioSlug(query.scenario);
    setQ(query.q ?? "");
    setMinConfidence(query.minConfidence ?? 0);
    setStep(query.step ?? 0);
  }

  async function handleDeleteView(id: string) {
    try {
      await removeView({ data: { id } });
      setViews((all) => all.filter((v) => v.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete the view");
    }
  }

  return (
    <PageShell>
      <div className="border-b border-border bg-ink/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
                Human Blockchain · Situation Room
              </div>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">
                {scenario ? scenario.name : "The Situation Room"}
              </h1>
              <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
                {lensConfig.question}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span
                className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                  scenario?.is_production
                    ? "border-navy text-navy"
                    : "border-sienna/60 bg-sienna/10 text-sienna"
                }`}
              >
                {scenario?.is_production ? "Production data" : "Scenario data — not production"}
              </span>
              <Link
                to="/admin/ledger"
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
              >
                Efficiency ledger →
              </Link>
            </div>
          </div>

          {/* One-prompt entry */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyPrompt();
              }}
              placeholder="One prompt — e.g. “show me the money in Harris County after the hurricane”"
              className="min-w-[18rem] flex-1 border border-border bg-background px-3 py-2 text-sm text-ink outline-none focus:border-navy"
            />
            <button
              type="button"
              onClick={applyPrompt}
              className="border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy"
            >
              Drive it
            </button>
          </div>
          {promptEcho.length ? (
            <p className="mt-2 font-mono text-[11px] text-silver">
              read as: {promptEcho.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      {/* Lens switcher */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {LENSES.map((l) => (
            <button
              key={l.lens}
              type="button"
              onClick={() => setLens(l.lens)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                lens === l.lens
                  ? "border-navy text-ink"
                  : "border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <select
            value={scenarioSlug}
            onChange={(e) => {
              setScenarioSlug(e.target.value);
              setStep(0);
            }}
            className="border border-border bg-background px-2 py-1.5 text-[13px] text-ink"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name} — {s.event_date}
              </option>
            ))}
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter county, variable, provenance…"
            className="min-w-[14rem] flex-1 border border-border bg-background px-2 py-1.5 text-[13px] text-ink outline-none focus:border-navy"
          />

          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Confidence ≥ {minConfidence.toFixed(2)}
            <input
              type="range"
              min={0}
              max={0.95}
              step={0.05}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:border-navy"
            >
              {playing ? "Pause" : "Replay"}
            </button>
            <input
              type="range"
              min={0}
              max={(scenario?.clock_steps ?? 4) - 1}
              step={1}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-silver">
              T+{step}h
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            {LAYOUTS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className={`border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
                  layout === l ? "border-navy text-navy" : "border-border text-muted-foreground hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Counters */}
      <div className="border-b border-border bg-ink/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-4 sm:px-6 md:grid-cols-4">
          <Counter label="Counties in view" value={String(countiesTouched)} sub="distinct" />
          {counters.slice(0, 3).map((c) => (
            <Counter
              key={c.key}
              label={c.variable?.name ?? c.key}
              value={formatValue(c.total, c.variable?.unit ?? "count")}
              sub={`conf ${(c.confidence * 100).toFixed(0)}% · ${c.variable?.truth_label ?? ""}`}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error ? (
          <p className="mb-4 border border-burgundy/40 bg-burgundy/5 px-3 py-2 text-sm text-burgundy">{error}</p>
        ) : null}
        {loading ? (
          <p className="text-sm text-muted-foreground">Opening the room…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing matches this query at T+{step}h. Loosen the confidence floor or clear the filter.
          </p>
        ) : layout === "table" ? (
          <TableView rows={rows} onInspect={setInspect} />
        ) : layout === "board" ? (
          <BoardView rows={rows} lensVars={lensConfig.variables} varByKey={varByKey} onInspect={setInspect} />
        ) : (
          <MapView rows={rows} headlineKey={lensConfig.variables[0]!} onInspect={setInspect} />
        )}

        {/* Saved views */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-xl text-ink">Saved views</h2>
          <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
            A named query with its lens, layout, clock position, and filters. Hand one to another seat and
            they land exactly where you were standing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Name this view"
              className="min-w-[14rem] border border-border bg-background px-2 py-1.5 text-[13px] text-ink outline-none focus:border-navy"
            />
            <button
              type="button"
              disabled={busy || !viewName.trim()}
              onClick={handleSaveView}
              className="border border-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              Save current view
            </button>
          </div>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {views.length === 0 ? (
              <li className="py-3 text-sm text-muted-foreground">No saved views yet.</li>
            ) : (
              views.map((v) => (
                <li key={v.id} className="flex flex-wrap items-center gap-3 py-3">
                  <button
                    type="button"
                    onClick={() => applyView(v)}
                    className="text-left text-[15px] text-ink underline underline-offset-4 hover:text-navy"
                  >
                    {v.name}
                  </button>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-silver">
                    {v.lens} · {v.layout}
                    {v.query?.scenario ? ` · ${v.query.scenario}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteView(v.id)}
                    className="ml-auto font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-burgundy"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {inspect ? <ProvenanceDrawer row={inspect} onClose={() => setInspect(null)} /> : null}
    </PageShell>
  );
}

function Counter({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-background px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</div>
      <div className="mt-1 font-serif text-2xl text-ink">{value}</div>
      {sub ? <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-silver">{sub}</div> : null}
    </div>
  );
}

function TableView({ rows, onInspect }: { rows: Row[]; onInspect: (r: Row) => void }) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-ink/[0.03] font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
            <th className="px-3 py-2">County</th>
            <th className="px-3 py-2">Variable</th>
            <th className="px-3 py-2 text-right">Value</th>
            <th className="px-3 py-2 text-right">Confidence</th>
            <th className="px-3 py-2">Truth</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-ink/[0.02]">
              <td className="px-3 py-2 text-ink">
                {r.county}, {r.state}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{r.variable.name}</td>
              <td className="px-3 py-2 text-right font-mono text-ink">
                {formatValue(Number(r.value), r.variable.unit)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                {(Number(r.confidence) * 100).toFixed(0)}%
              </td>
              <td className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                {r.variable.truth_label}
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => onInspect(r)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy hover:text-ink"
                >
                  Provenance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BoardView({
  rows,
  lensVars,
  varByKey,
  onInspect,
}: {
  rows: Row[];
  lensVars: string[];
  varByKey: Map<string, VariableRow>;
  onInspect: (r: Row) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lensVars.map((key) => {
        const v = varByKey.get(key);
        const subset = rows.filter((r) => r.variable_key === key);
        if (!v) return null;
        return (
          <div key={key} className="border border-border">
            <div className="border-b border-border bg-ink/[0.03] px-3 py-2">
              <div className="text-[14px] text-ink">{v.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                {v.stakeholder} · {v.truth_label} · {v.confidentiality}
              </div>
            </div>
            <ul className="divide-y divide-border">
              {subset.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => onInspect(r)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-ink/[0.02]"
                  >
                    <span className="text-ink">{r.county}</span>
                    <span className="font-mono text-ink">{formatValue(Number(r.value), v.unit)}</span>
                  </button>
                </li>
              ))}
              {subset.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">No readings.</li>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function MapView({
  rows,
  headlineKey,
  onInspect,
}: {
  rows: Row[];
  headlineKey: string;
  onInspect: (r: Row) => void;
}) {
  const headline = rows.filter((r) => r.variable_key === headlineKey);
  const max = Math.max(1, ...headline.map((r) => Number(r.value)));
  return (
    <div>
      <p className="mb-4 max-w-[70ch] text-sm text-muted-foreground">
        Footprint view — each county sized by <strong className="text-ink">{headline[0]?.variable.name ?? headlineKey}</strong>.
        Intensity is the reading; the number under it is the confidence we are willing to state out loud.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {headline.map((r) => {
          const intensity = Number(r.value) / max;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onInspect(r)}
              className="border border-border p-4 text-left transition-colors hover:border-navy"
              style={{ backgroundColor: `color-mix(in oklab, var(--color-navy, #1b2a4a) ${Math.round(intensity * 22)}%, transparent)` }}
            >
              <div className="text-[15px] text-ink">{r.county}</div>
              <div className="mt-1 font-serif text-2xl text-ink">
                {formatValue(Number(r.value), r.variable.unit)}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                conf {(Number(r.confidence) * 100).toFixed(0)}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProvenanceDrawer({ row, onClose }: { row: Row; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30" onClick={onClose}>
      <aside
        className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">Provenance card</div>
            <h2 className="mt-2 font-serif text-2xl text-ink">{row.variable.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
          >
            Close
          </button>
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <Field label="Reading">
            {formatValue(Number(row.value), row.variable.unit)} — {row.county}, {row.state}
          </Field>
          <Field label="Confidence">{(Number(row.confidence) * 100).toFixed(0)}%</Field>
          <Field label="Observed">{new Date(row.observed_at).toLocaleString()}</Field>
          <Field label="Definition">{row.variable.definition}</Field>
          <Field label="Source">{row.variable.source}</Field>
          <Field label="Cadence">{row.variable.cadence}</Field>
          <Field label="Owner function">{row.variable.stakeholder}</Field>
          <Field label="Labels">
            {row.variable.truth_label} · {row.variable.confidentiality}
          </Field>
          <Field label="Chain">{row.provenance}</Field>
        </dl>

        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Nothing renders in this room without a row behind it. If a number cannot produce this card, it does
          not belong on the screen.
        </p>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</dt>
      <dd className="mt-1 text-ink/85">{children}</dd>
    </div>
  );
}
