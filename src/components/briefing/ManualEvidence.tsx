import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  listManualAttachments,
  upsertManualAttachment,
  deleteManualAttachment,
  getManualAttachmentUrl,
  type ManualAttachmentRow,
} from "@/lib/manual-attachments.functions";

const BUCKET = "dossier-artifacts";

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });
}

export function ManualEvidence({ slug, isFounder }: { slug: string; isFounder: boolean }) {
  const load = useServerFn(listManualAttachments);
  const remove = useServerFn(deleteManualAttachment);
  const upsert = useServerFn(upsertManualAttachment);
  const openUrl = useServerFn(getManualAttachmentUrl);

  const [rows, setRows] = useState<ManualAttachmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState<null | "file" | "link">(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    setLoading(true);
    load({ data: { slug } })
      .then((r) => setRows(r.attachments))
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load evidence"))
      .finally(() => setLoading(false));
  }, [load, slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function open(id: string) {
    try {
      const r = await openUrl({ data: { id } });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to open");
    }
  }

  async function togglePublish(row: ManualAttachmentRow) {
    setBusy(true);
    try {
      await upsert({
        data: {
          id: row.id,
          slug: row.chapter_slug,
          kind: row.kind,
          storagePath: row.storage_path,
          externalUrl: row.external_url,
          title: row.title,
          description: row.description,
          originalDate: row.original_date,
          sourceLabel: row.source_label,
          significance: row.significance,
          mimeType: row.mime_type,
          sizeBytes: row.size_bytes,
          isPublished: !row.is_published,
          position: row.position,
        },
      });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this artifact from the record?")) return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;
  if (!isFounder && rows.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
          Exhibits — the record behind this chapter
        </h2>
        {isFounder ? (
          <div className="flex gap-2">
            <button
              onClick={() => setAdding("file")}
              className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              + File
            </button>
            <button
              onClick={() => setAdding("link")}
              className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              + Link
            </button>
          </div>
        ) : null}
      </div>

      {err ? (
        <div className="mb-3 border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>
      ) : null}

      {rows.length === 0 ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
          Nothing filed against this chapter yet.
        </p>
      ) : (
        <ol className="grid gap-px border border-border bg-border">
          {rows.map((a, i) => (
            <li key={a.id} className="bg-background px-4 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                  Exhibit {String(i + 1).padStart(2, "0")}
                </span>
                <button onClick={() => open(a.id)} className="text-left font-serif text-lg text-ink hover:underline">
                  {a.title}
                </button>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                  {a.kind === "file" ? "File" : "Link"}
                  {a.size_bytes ? ` · ${formatSize(a.size_bytes)}` : ""}
                </span>
                {isFounder ? (
                  <span className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => togglePublish(a)}
                      disabled={busy}
                      className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        a.is_published
                          ? "border-navy bg-navy/10 text-navy"
                          : "border-border text-muted-foreground hover:border-navy"
                      }`}
                    >
                      {a.is_published ? "Published" : "Draft"}
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={busy}
                      className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-destructive hover:text-destructive"
                    >
                      Remove
                    </button>
                  </span>
                ) : null}
              </div>
              {a.original_date || a.source_label ? (
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                  {[formatDate(a.original_date), a.source_label].filter(Boolean).join(" · ")}
                </div>
              ) : null}
              {a.description ? (
                <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              ) : null}
              {a.significance ? (
                <p className="mt-2 max-w-[68ch] border-l-2 border-navy/40 pl-3 text-sm leading-relaxed text-ink/80">
                  {a.significance}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      {adding ? (
        <EvidenceForm
          kind={adding}
          slug={slug}
          position={rows.length}
          onDone={() => {
            setAdding(null);
            refresh();
          }}
          onCancel={() => setAdding(null)}
        />
      ) : null}
    </section>
  );
}

function EvidenceForm({
  kind,
  slug,
  position,
  onDone,
  onCancel,
}: {
  kind: "file" | "link";
  slug: string;
  position: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const upsert = useServerFn(upsertManualAttachment);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [significance, setSignificance] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    setSaving(true);
    try {
      const common = {
        slug,
        title: title.trim(),
        description: description.trim() || null,
        originalDate: originalDate || null,
        sourceLabel: sourceLabel.trim() || null,
        significance: significance.trim() || null,
        isPublished,
        position,
      };
      if (kind === "file") {
        if (!file) throw new Error("Choose a file");
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `manual/${slug}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          contentType: file.type || "application/octet-stream",
        });
        if (upErr) throw new Error(upErr.message || "Upload failed");
        await upsert({
          data: {
            ...common,
            kind: "file",
            storagePath: path,
            mimeType: file.type || null,
            sizeBytes: file.size,
          },
        });
      } else {
        if (!externalUrl.trim()) throw new Error("URL is required");
        await upsert({ data: { ...common, kind: "link", externalUrl: externalUrl.trim() } });
      }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const input = "w-full border border-border bg-background px-3 py-2 text-sm text-ink";

  return (
    <div className="mt-4 space-y-3 border border-navy/40 bg-muted/20 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
        New {kind === "file" ? "file" : "link"} exhibit
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={input} />
      {kind === "file" ? (
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full text-xs" />
      ) : (
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://…"
          className={input}
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Original date</span>
          <input type="date" value={originalDate} onChange={(e) => setOriginalDate(e.target.value)} className={`mt-1 ${input}`} />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Source</span>
          <input
            value={sourceLabel}
            onChange={(e) => setSourceLabel(e.target.value)}
            placeholder="Siteforum build, RRCA filing, Drive…"
            className={`mt-1 ${input}`}
          />
        </label>
      </div>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What this document is"
        className={input}
      />
      <textarea
        value={significance}
        onChange={(e) => setSignificance(e.target.value)}
        rows={3}
        placeholder="Why it matters — what carried forward, what died"
        className={input}
      />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
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
