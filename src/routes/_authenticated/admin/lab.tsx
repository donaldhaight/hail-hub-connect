import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import {
  listTracks,
  upsertTrack,
  deleteTrack,
  addTrackNote,
  toggleTrackNote,
  deleteTrackNote,
  adoptTrack,
  type TrackRow,
  type TrackNoteRow,
} from "@/lib/lab.functions";
import {
  LAYERS,
  LAYER_LABEL,
  TRACK_STATUSES,
  TRACK_STATUS_LABEL,
  NOTE_KINDS,
  NOTE_KIND_LABEL,
  type Layer,
  type NoteKind,
  type TrackStatus,
} from "@/content/intake";

export const Route = createFileRoute("/_authenticated/admin/lab")({
  head: () => ({
    meta: [
      { title: "Concept Lab — Founder Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LabPage,
});

const input = "w-full border border-border bg-background px-3 py-2 text-sm text-ink";
const chip = "border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors";

function LabPage() {
  const load = useServerFn(listTracks);
  const save = useServerFn(upsertTrack);
  const remove = useServerFn(deleteTrack);
  const addNote = useServerFn(addTrackNote);
  const toggleNote = useServerFn(toggleTrackNote);
  const removeNote = useServerFn(deleteTrackNote);
  const adopt = useServerFn(adoptTrack);

  const [tracks, setTracks] = useState<TrackRow[] | null>(null);
  const [notes, setNotes] = useState<TrackNoteRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    load()
      .then((r) => {
        setTracks(r.tracks);
        setNotes(r.notes);
        setErr(null);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Founder access only."));
  }, [load]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function setStatus(t: TrackRow, status: TrackStatus) {
    setBusy(true);
    try {
      await save({ data: { id: t.id, name: t.name, brief: t.brief, status, layers: t.layers as Layer[], position: t.position } });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function toggleLayer(t: TrackRow, l: Layer) {
    const on = (t.layers ?? []).includes(l);
    const layers = on ? (t.layers as Layer[]).filter((x) => x !== l) : ([...(t.layers ?? []), l] as Layer[]);
    setBusy(true);
    try {
      await save({ data: { id: t.id, name: t.name, brief: t.brief, status: t.status, layers, position: t.position } });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleAdopt(t: TrackRow) {
    if (!confirm(`Adopt "${t.name}"? Its decisions and open questions become backlog items.`)) return;
    setBusy(true);
    try {
      const r = await adopt({ data: { id: t.id } });
      setErr(null);
      alert(`Adopted. ${r.created} backlog item${r.created === 1 ? "" : "s"} written.`);
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to adopt");
    } finally {
      setBusy(false);
    }
  }

  if (err && tracks === null) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede={err} confidentiality="C2" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console"
        title="The concept lab."
        lede="Side ideas get a room of their own — the Dual Race Month, the cultural canon, anything that patterns onto the mission but isn't ready to touch the manual. Explore here, adopt when it converges."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
          >
            ← Console
          </Link>
          <Link
            to="/admin/intake"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
          >
            Intake lane →
          </Link>
          <button
            onClick={() => setCreating((v) => !v)}
            className={`${chip} ml-auto border-ink bg-ink text-paper`}
          >
            + New track
          </button>
        </div>

        {err ? (
          <div className="mt-4 border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>
        ) : null}

        {creating ? (
          <TrackForm
            onCancel={() => setCreating(false)}
            onDone={() => {
              setCreating(false);
              refresh();
            }}
          />
        ) : null}

        <div className="mt-8">
          {tracks === null ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Loading…</p>
          ) : tracks.length === 0 ? (
            <p className="max-w-[64ch] text-sm leading-relaxed text-muted-foreground">
              No tracks yet. Open one for the Dual Race Month theme and park everything it touches there — the main
              build path stays clean until the idea has earned its way in.
            </p>
          ) : (
            <ol className="grid gap-px border border-border bg-border">
              {tracks.map((t) => {
                const mine = notes.filter((n) => n.track_id === t.id);
                const open = openId === t.id;
                return (
                  <li key={t.id} className="bg-background px-4 py-4">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <button
                        onClick={() => setOpenId(open ? null : t.id)}
                        className="text-left font-serif text-lg text-ink hover:underline"
                      >
                        {t.name}
                      </button>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                        {mine.filter((n) => !n.resolved).length} open · {mine.length} notes
                      </span>
                      <span className="ml-auto flex flex-wrap items-center gap-2">
                        {TRACK_STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={busy}
                            onClick={() => setStatus(t, s)}
                            className={`${chip} ${
                              t.status === s
                                ? "border-navy bg-navy/10 text-navy"
                                : "border-border text-muted-foreground hover:border-navy"
                            }`}
                          >
                            {TRACK_STATUS_LABEL[s]}
                          </button>
                        ))}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {LAYERS.map((l) => {
                        const on = (t.layers ?? []).includes(l);
                        return (
                          <button
                            key={l}
                            disabled={busy}
                            onClick={() => toggleLayer(t, l)}
                            className={`${chip} ${
                              on ? "border-navy bg-navy/10 text-navy" : "border-border text-silver hover:border-navy"
                            }`}
                          >
                            {LAYER_LABEL[l]}
                          </button>
                        );
                      })}
                    </div>

                    {t.brief ? (
                      <p className="mt-3 max-w-[74ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {t.brief}
                      </p>
                    ) : null}

                    {open ? (
                      <TrackDetail
                        track={t}
                        notes={mine}
                        busy={busy}
                        onAdd={async (kind, body) => {
                          setBusy(true);
                          try {
                            await addNote({ data: { trackId: t.id, kind, body } });
                            refresh();
                          } finally {
                            setBusy(false);
                          }
                        }}
                        onToggle={async (id, resolved) => {
                          setBusy(true);
                          try {
                            await toggleNote({ data: { id, resolved } });
                            refresh();
                          } finally {
                            setBusy(false);
                          }
                        }}
                        onRemoveNote={async (id) => {
                          setBusy(true);
                          try {
                            await removeNote({ data: { id } });
                            refresh();
                          } finally {
                            setBusy(false);
                          }
                        }}
                        onAdopt={() => handleAdopt(t)}
                        onDelete={async () => {
                          if (!confirm("Retire and delete this track?")) return;
                          setBusy(true);
                          try {
                            await remove({ data: { id: t.id } });
                            setOpenId(null);
                            refresh();
                          } finally {
                            setBusy(false);
                          }
                        }}
                        onSaved={refresh}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function TrackDetail({
  track,
  notes,
  busy,
  onAdd,
  onToggle,
  onRemoveNote,
  onAdopt,
  onDelete,
  onSaved,
}: {
  track: TrackRow;
  notes: TrackNoteRow[];
  busy: boolean;
  onAdd: (kind: NoteKind, body: string) => Promise<void>;
  onToggle: (id: string, resolved: boolean) => Promise<void>;
  onRemoveNote: (id: string) => Promise<void>;
  onAdopt: () => void;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const save = useServerFn(upsertTrack);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(track.name);
  const [brief, setBrief] = useState(track.brief);
  const [kind, setKind] = useState<NoteKind>("note");
  const [body, setBody] = useState("");

  return (
    <div className="mt-4 space-y-4 border-t border-border pt-4">
      {editing ? (
        <div className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={6} className={input} />
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await save({
                  data: {
                    id: track.id,
                    name,
                    brief,
                    status: track.status,
                    layers: track.layers as Layer[],
                    position: track.position,
                  },
                });
                setEditing(false);
                onSaved();
              }}
              className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEditing(true)} className={`${chip} border-border text-muted-foreground hover:border-navy`}>
            Edit brief
          </button>
          <button onClick={onAdopt} disabled={busy} className={`${chip} border-ink bg-ink text-paper`}>
            Adopt into the backlog
          </button>
          <button
            onClick={onDelete}
            disabled={busy}
            className={`${chip} border-border text-muted-foreground hover:border-destructive hover:text-destructive`}
          >
            Delete track
          </button>
        </div>
      )}

      <div className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet on this track.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-3 border-l-2 border-border pl-3">
                <span
                  className={`mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${
                    n.kind === "decision" ? "text-navy" : n.kind === "question" ? "text-ink" : "text-silver"
                  }`}
                >
                  {NOTE_KIND_LABEL[n.kind]}
                </span>
                <p
                  className={`flex-1 whitespace-pre-wrap text-sm leading-relaxed ${
                    n.resolved ? "text-silver line-through" : "text-muted-foreground"
                  }`}
                >
                  {n.body}
                </p>
                <button
                  disabled={busy}
                  onClick={() => onToggle(n.id, !n.resolved)}
                  className={`${chip} border-border text-silver hover:border-navy hover:text-navy`}
                >
                  {n.resolved ? "Reopen" : "Resolve"}
                </button>
                <button
                  disabled={busy}
                  onClick={() => onRemoveNote(n.id)}
                  className={`${chip} border-border text-silver hover:border-destructive hover:text-destructive`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {NOTE_KINDS.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`${chip} ${kind === k ? "border-navy bg-navy/10 text-navy" : "border-border text-muted-foreground"}`}
            >
              {NOTE_KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Add a note, an open question, or a decision"
          className={input}
        />
        <button
          disabled={busy || !body.trim()}
          onClick={async () => {
            await onAdd(kind, body.trim());
            setBody("");
          }}
          className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function TrackForm({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  const save = useServerFn(upsertTrack);
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [layers, setLayers] = useState<Layer[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mt-4 space-y-3 border border-navy/40 bg-muted/20 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">Open a track</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Track name" className={input} />
      <textarea
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={5}
        placeholder="The brief — what the pattern is, and what it would change if true"
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
          disabled={saving || !name.trim()}
          onClick={async () => {
            setSaving(true);
            setErr(null);
            try {
              await save({ data: { name: name.trim(), brief, status: "exploring", layers, position: 0 } });
              onDone();
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Failed to save");
            } finally {
              setSaving(false);
            }
          }}
          className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-paper disabled:opacity-50"
        >
          {saving ? "Saving…" : "Open track"}
        </button>
        <button
          onClick={onCancel}
          className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
