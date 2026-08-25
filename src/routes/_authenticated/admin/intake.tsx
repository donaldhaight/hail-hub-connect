import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { supabase } from "@/integrations/supabase/client";
import {
  listIntakeItems,
  upsertIntakeItem,
  deleteIntakeItem,
  getIntakeItemUrl,
  getFilingTargets,
  fileIntakeItem,
  searchCorpus,
  type IntakeRow,
  type CorpusSearchHit,
} from "@/lib/intake.functions";
import {
  LAYERS,
  LAYER_LABEL,
  LAYER_GUIDE,
  TRIAGE_STATES,
  TRIAGE_LABEL,
  PROTOCOL_DOC,
  PROTOCOL_LEDE,
  PROTOCOL_DIAGRAM,
  PROTOCOL_STEPS,
  type Layer,
  type TriageState,
} from "@/content/intake";

export const Route = createFileRoute("/_authenticated/admin/intake")({
  head: () => ({
    meta: [
      { title: "Intake Lane — Founder Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: IntakePage,
});

const BUCKET = "dossier-artifacts";
const input = "w-full border border-border bg-background px-3 py-2 text-sm text-ink";
const chip =
  "border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors";

function formatDate(iso: string | null): string {
  if (!iso) return "undated";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" });
}

type MapSummary = {
  total: number;
  byState: Record<string, number>;
  byLayer: Record<string, number>;
  byDecade: Record<string, number>;
  bySource: Record<string, number>;
  undated: number;
};

function IntakePage() {
  const load = useServerFn(listIntakeItems);
  const remove = useServerFn(deleteIntakeItem);
  const upsert = useServerFn(upsertIntakeItem);
  const openUrl = useServerFn(getIntakeItemUrl);
  const loadTargets = useServerFn(getFilingTargets);
  const doSearch = useServerFn(searchCorpus);

  const [protocolOpen, setProtocolOpen] = useState(false);
  const [items, setItems] = useState<IntakeRow[] | null>(null);
  const [map, setMap] = useState<MapSummary | null>(null);
  const [state, setState] = useState<"all" | TriageState>("all");
  const [layer, setLayer] = useState<"all" | Layer>("all");
  const [search, setSearch] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState<null | "file" | "link">(null);
  const [busy, setBusy] = useState(false);
  const [filing, setFiling] = useState<IntakeRow | null>(null);
  const [targets, setTargets] = useState<{
    chapters: Array<{ slug: string; title: string; part: string }>;
    dossiers: Array<{ slug: string; title: string }>;
  } | null>(null);

  const [corpusQuery, setCorpusQuery] = useState("");
  const [hits, setHits] = useState<CorpusSearchHit[] | null>(null);

  const refresh = useCallback(() => {
    load({ data: { state, layer, search } })
      .then((r) => {
        setItems(r.items);
        setMap(r.map as MapSummary);
        setErr(null);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Founder access only."));
  }, [load, state, layer, search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    loadTargets()
      .then(setTargets)
      .catch(() => setTargets(null));
  }, [loadTargets]);

  async function open(id: string) {
    try {
      const r = await openUrl({ data: { id } });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to open");
    }
  }

  async function patch(row: IntakeRow, changes: Partial<{ triageState: TriageState; layers: Layer[] }>) {
    setBusy(true);
    try {
      await upsert({
        data: {
          id: row.id,
          kind: row.kind,
          storagePath: row.storage_path,
          externalUrl: row.external_url,
          title: row.title,
          originalDate: row.original_date,
          sourceLabel: row.source_label,
          notes: row.notes,
          layers: (changes.layers ?? (row.layers as Layer[])) ?? [],
          triageState: changes.triageState ?? row.triage_state,
          extractedText: row.extracted_text,
          mimeType: row.mime_type,
          sizeBytes: row.size_bytes,
        },
      });
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this item from the lane?")) return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function runCorpusSearch() {
    if (corpusQuery.trim().length < 2) return;
    try {
      const r = await doSearch({ data: { q: corpusQuery.trim() } });
      setHits(r.hits);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Search failed");
    }
  }

  if (err && items === null) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede={err} confidentiality="C2" />
      </PageShell>
    );
  }

  const decades = Object.entries(map?.byDecade ?? {}).sort(([a], [b]) => a.localeCompare(b));
  const sources = Object.entries(map?.bySource ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console"
        title="The intake lane."
        lede="Drop material here before you know where it belongs. Date it, tag the layer it feeds, and file it against a chapter or dossier when it earns a place."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link
          to="/admin"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
        >
          ← Console
        </Link>

        {/* How this lane works */}
        <div className="mt-6 border border-border">
          <button
            type="button"
            onClick={() => setProtocolOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              How this lane works — the working protocol
            </span>
            <span className="font-mono text-[10px] text-silver">{protocolOpen ? "−" : "+"}</span>
          </button>
          {protocolOpen ? (
            <div className="border-t border-border px-4 py-5">
              <p className="max-w-3xl font-serif text-sm leading-relaxed text-ink">{PROTOCOL_LEDE}</p>

              <pre className="mt-4 overflow-x-auto border border-border bg-background/60 p-4 font-mono text-[10px] leading-relaxed text-silver">
                {PROTOCOL_DIAGRAM}
              </pre>

              <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
                {LAYERS.map((l) => (
                  <div key={l} className="bg-background px-4 py-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">
                      {LAYER_LABEL[l]}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-ink/80">{LAYER_GUIDE[l]}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2">
                {PROTOCOL_STEPS.map((s) => (
                  <div key={s.title} className="bg-background px-4 py-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">{s.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-ink/80">{s.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                Full protocol: {PROTOCOL_DOC}
              </p>
            </div>
          ) : null}
        </div>



        {/* Archive map */}
        <div className="mt-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "In the lane", value: map?.total ?? "—" },
            { label: "Needs triage", value: map?.byState.new ?? "—" },
            { label: "Filed", value: map?.byState.filed ?? "—" },
            { label: "Parked", value: map?.byState.parked ?? "—" },
            { label: "Undated", value: map?.undated ?? "—" },
            { label: "Sources", value: Object.keys(map?.bySource ?? {}).length },
          ].map((s) => (
            <div key={s.label} className="bg-background px-4 py-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">{s.label}</div>
              <div className="mt-1 font-serif text-xl text-ink">{String(s.value)}</div>
            </div>
          ))}
        </div>

        <div className="mt-px grid gap-px border border-border bg-border sm:grid-cols-3">
          <div className="bg-background px-4 py-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">By layer</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {LAYERS.map((l) => (
                <li key={l}>
                  {LAYER_LABEL[l]} — <span className="text-ink">{map?.byLayer[l] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background px-4 py-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">By decade</div>
            {decades.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nothing dated yet.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {decades.map(([d, n]) => (
                  <li key={d}>
                    {d} — <span className="text-ink">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-background px-4 py-4">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">By source</div>
            {sources.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No sources recorded yet.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {sources.map(([s, n]) => (
                  <li key={s}>
                    {s} — <span className="text-ink">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Corpus search */}
        <div className="mt-8 border border-border p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Search the whole corpus
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={corpusQuery}
              onChange={(e) => setCorpusQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runCorpusSearch();
              }}
              placeholder="Search intake notes, chapters, and dossier sections…"
              className={`${input} max-w-md flex-1`}
            />
            <button
              onClick={runCorpusSearch}
              className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
            >
              Search
            </button>
          </div>
          {hits ? (
            hits.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No matches.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {hits.map((h) => (
                  <li key={`${h.source}-${h.id}`} className="text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy">{h.source}</span>{" "}
                    <span className="text-ink">{h.title}</span>
                    <p className="text-muted-foreground">{h.snippet}</p>
                  </li>
                ))}
              </ul>
            )
          ) : null}
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setState("all")}
            className={`${chip} ${state === "all" ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
          >
            All
          </button>
          {TRIAGE_STATES.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={`${chip} ${state === s ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
            >
              {TRIAGE_LABEL[s]}
            </button>
          ))}
          <span className="mx-2 h-4 w-px bg-border" />
          <button
            onClick={() => setLayer("all")}
            className={`${chip} ${layer === "all" ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
          >
            Any layer
          </button>
          {LAYERS.map((l) => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={`${chip} ${layer === l ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
            >
              {LAYER_LABEL[l]}
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter the lane…"
            className={`${input} ml-auto w-48`}
          />
          <button
            onClick={() => setAdding("file")}
            className={`${chip} border-border text-muted-foreground hover:border-navy hover:text-navy`}
          >
            + File
          </button>
          <button
            onClick={() => setAdding("link")}
            className={`${chip} border-border text-muted-foreground hover:border-navy hover:text-navy`}
          >
            + Link
          </button>
        </div>

        {err ? (
          <div className="mt-4 border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>
        ) : null}

        {adding ? (
          <IntakeForm
            kind={adding}
            onDone={() => {
              setAdding(null);
              refresh();
            }}
            onCancel={() => setAdding(null)}
          />
        ) : null}

        {/* Lane */}
        <div className="mt-8">
          {items === null ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Loading…</p>
          ) : items.length === 0 ? (
            <p className="max-w-[64ch] text-sm leading-relaxed text-muted-foreground">
              The lane is empty. Drop documents, decks, screenshots, and links here as they come to hand — nothing has to
              be filed the moment it arrives.
            </p>
          ) : (
            <ol className="grid gap-px border border-border bg-border">
              {items.map((it) => (
                <li key={it.id} className="bg-background px-4 py-4">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                      {formatDate(it.original_date)}
                    </span>
                    <button onClick={() => open(it.id)} className="text-left font-serif text-lg text-ink hover:underline">
                      {it.title}
                    </button>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                      {it.kind === "file" ? "File" : "Link"}
                      {it.source_label ? ` · ${it.source_label}` : ""}
                    </span>
                    <span className="ml-auto flex flex-wrap items-center gap-2">
                      {TRIAGE_STATES.map((s) => (
                        <button
                          key={s}
                          disabled={busy}
                          onClick={() => patch(it, { triageState: s })}
                          className={`${chip} ${
                            it.triage_state === s
                              ? "border-navy bg-navy/10 text-navy"
                              : "border-border text-muted-foreground hover:border-navy"
                          }`}
                        >
                          {TRIAGE_LABEL[s]}
                        </button>
                      ))}
                      <button
                        disabled={busy}
                        onClick={() => setFiling(it)}
                        className={`${chip} border-ink bg-ink text-paper`}
                      >
                        File it
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => handleDelete(it.id)}
                        className={`${chip} border-border text-muted-foreground hover:border-destructive hover:text-destructive`}
                      >
                        Remove
                      </button>
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {LAYERS.map((l) => {
                      const on = (it.layers ?? []).includes(l);
                      return (
                        <button
                          key={l}
                          disabled={busy}
                          onClick={() =>
                            patch(it, {
                              layers: on
                                ? ((it.layers ?? []) as Layer[]).filter((x) => x !== l)
                                : ([...(it.layers ?? []), l] as Layer[]),
                            })
                          }
                          className={`${chip} ${
                            on ? "border-navy bg-navy/10 text-navy" : "border-border text-silver hover:border-navy"
                          }`}
                        >
                          {LAYER_LABEL[l]}
                        </button>
                      );
                    })}
                  </div>

                  {it.notes ? (
                    <p className="mt-2 max-w-[74ch] text-sm leading-relaxed text-muted-foreground">{it.notes}</p>
                  ) : null}
                  {it.filed_as ? (
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                      Filed against {it.filed_as} · {it.filed_ref}
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {filing ? (
        <FileDialog
          item={filing}
          targets={targets}
          onClose={() => setFiling(null)}
          onDone={() => {
            setFiling(null);
            refresh();
          }}
        />
      ) : null}
    </PageShell>
  );
}

function IntakeForm({
  kind,
  onDone,
  onCancel,
}: {
  kind: "file" | "link";
  onDone: () => void;
  onCancel: () => void;
}) {
  const upsert = useServerFn(upsertIntakeItem);
  const [title, setTitle] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [layers, setLayers] = useState<Layer[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    setSaving(true);
    try {
      if (kind === "file") {
        if (files.length === 0) throw new Error("Choose at least one file");
        for (const file of files) {
          const ext = file.name.split(".").pop() ?? "bin";
          const path = `intake/${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
            contentType: file.type || "application/octet-stream",
          });
          if (upErr) throw new Error(upErr.message || "Upload failed");
          await upsert({
            data: {
              kind: "file",
              storagePath: path,
              title: files.length === 1 && title.trim() ? title.trim() : file.name,
              originalDate: originalDate || null,
              sourceLabel: sourceLabel.trim() || null,
              notes: notes.trim() || null,
              layers,
              triageState: "new",
              mimeType: file.type || null,
              sizeBytes: file.size,
            },
          });
        }
      } else {
        if (!externalUrl.trim()) throw new Error("URL is required");
        await upsert({
          data: {
            kind: "link",
            externalUrl: externalUrl.trim(),
            title: title.trim() || externalUrl.trim(),
            originalDate: originalDate || null,
            sourceLabel: sourceLabel.trim() || null,
            notes: notes.trim() || null,
            layers,
            triageState: "new",
          },
        });
      }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-3 border border-navy/40 bg-muted/20 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
        Drop {kind === "file" ? "files" : "a link"} into the lane
      </div>
      {kind === "file" ? (
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full text-xs"
        />
      ) : (
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://docs.google.com/…"
          className={input}
        />
      )}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={kind === "file" ? "Title (optional for batches — filenames are used)" : "Title"}
        className={input}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Original date</span>
          <input
            type="date"
            value={originalDate}
            onChange={(e) => setOriginalDate(e.target.value)}
            className={`mt-1 ${input}`}
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Source</span>
          <input
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder="Drive, Siteforum, NotebookLM, ChatGPT session…"
            className={`mt-1 ${input}`}
          />
        </label>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="What this is, and what you think it proves"
        className={input}
      />
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((l) => (
          <button
            key={l}
            onClick={() => setLayers((cur) => (cur.includes(l) ? cur.filter((x) => x !== l) : [...cur, l]))}
            className={`${chip} ${
              layers.includes(l) ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"
            }`}
          >
            {LAYER_LABEL[l]}
          </button>
        ))}
      </div>
      {err ? <div className="text-xs text-destructive">{err}</div> : null}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
        >
          {saving ? "Loading…" : "Add to lane"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FileDialog({
  item,
  targets,
  onClose,
  onDone,
}: {
  item: IntakeRow;
  targets: {
    chapters: Array<{ slug: string; title: string; part: string }>;
    dossiers: Array<{ slug: string; title: string }>;
  } | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const file = useServerFn(fileIntakeItem);
  const [corpus, setCorpus] = useState<"manual" | "dossier">("manual");
  const [ref, setRef] = useState("");
  const [significance, setSignificance] = useState("");
  const [publish, setPublish] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const options = corpus === "manual" ? targets?.chapters ?? [] : targets?.dossiers ?? [];

  async function submit() {
    if (!ref) {
      setErr("Choose a destination");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      await file({ data: { id: item.id, corpus, ref, significance: significance.trim() || null, publish } });
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to file");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div className="w-full max-w-lg space-y-3 border border-border bg-background p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">File this exhibit</div>
        <div className="font-serif text-lg text-ink">{item.title}</div>

        <div className="flex gap-2">
          {(["manual", "dossier"] as const).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCorpus(c);
                setRef("");
              }}
              className={`${chip} ${corpus === c ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
            >
              {c === "manual" ? "Manual chapter" : "Dossier"}
            </button>
          ))}
        </div>

        <select value={ref} onChange={(e) => setRef(e.target.value)} className={input}>
          <option value="">Choose a destination…</option>
          {options.map((o: any) => (
            <option key={o.slug} value={o.slug}>
              {o.part ? `${o.part} — ` : ""}
              {o.title}
            </option>
          ))}
        </select>

        <textarea
          value={significance}
          onChange={(e) => setSignificance(e.target.value)}
          rows={3}
          placeholder="Why it matters — what carried forward, what died"
          className={input}
        />

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          Publish to insiders immediately
        </label>

        {err ? <div className="text-xs text-destructive">{err}</div> : null}

        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={saving}
            className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
          >
            {saving ? "Filing…" : "File exhibit"}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
