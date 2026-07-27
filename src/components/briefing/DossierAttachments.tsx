import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  listAttachments,
  upsertAttachment,
  deleteAttachment,
  getAttachmentSignedUrl,
  type AttachmentRow,
} from "@/lib/attachments.functions";

const BUCKET = "dossier-artifacts";

function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  slug: string;
  sectionId?: string | null;
  isFounder: boolean;
  // When true, this instance only manages dossier-level (section_id IS NULL) items.
  dossierLevel?: boolean;
};

export function DossierAttachments({ slug, sectionId, isFounder, dossierLevel }: Props) {
  const load = useServerFn(listAttachments);
  const upsert = useServerFn(upsertAttachment);
  const remove = useServerFn(deleteAttachment);
  const signedUrl = useServerFn(getAttachmentSignedUrl);

  const [all, setAll] = useState<AttachmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState<null | "file" | "link">(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    setLoading(true);
    load({ data: { slug } })
      .then((r) => setAll(r.attachments))
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const items = all.filter((a) =>
    dossierLevel ? a.section_id == null : sectionId ? a.section_id === sectionId : false,
  );

  async function openAttachment(id: string) {
    try {
      const r = await signedUrl({ data: { id } });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to open");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this attachment?")) return;
    setBusy(true);
    try {
      await remove({ data: { id } });
      refresh();
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish(row: AttachmentRow) {
    setBusy(true);
    try {
      await upsert({
        data: {
          id: row.id,
          slug: row.dossier_slug,
          sectionId: row.section_id,
          kind: row.kind,
          storagePath: row.storage_path,
          externalUrl: row.external_url,
          title: row.title,
          description: row.description,
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

  if (loading) {
    return (
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Loading evidence…</div>
    );
  }

  if (!isFounder && items.length === 0) return null;

  return (
    <div className="mt-4 border border-border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          {dossierLevel ? "Appendix" : "Evidence"}
        </div>
        {isFounder ? (
          <div className="flex gap-2">
            <button
              onClick={() => setAdding("file")}
              className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              + File
            </button>
            <button
              onClick={() => setAdding("link")}
              className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              + Link
            </button>
          </div>
        ) : null}
      </div>

      {err ? (
        <div className="mb-2 border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div>
      ) : null}

      {items.length === 0 && !adding ? (
        isFounder ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
            No evidence attached yet.
          </div>
        ) : null
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center gap-3 border border-border bg-background px-3 py-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                {a.kind === "file" ? "📄 FILE" : "🔗 LINK"}
              </span>
              <button
                onClick={() => openAttachment(a.id)}
                className="text-left text-sm text-ink hover:underline"
              >
                {a.title}
              </button>
              {a.description ? (
                <span className="text-xs text-muted-foreground">— {a.description}</span>
              ) : null}
              {a.kind === "file" && a.size_bytes ? (
                <span className="font-mono text-[10px] text-silver">{formatSize(a.size_bytes)}</span>
              ) : null}
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
                    Delete
                  </button>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <AttachmentForm
          kind={adding}
          slug={slug}
          sectionId={dossierLevel ? null : sectionId ?? null}
          onDone={() => {
            setAdding(null);
            refresh();
          }}
          onCancel={() => setAdding(null)}
        />
      ) : null}
    </div>
  );
}

function AttachmentForm({
  kind,
  slug,
  sectionId,
  onDone,
  onCancel,
}: {
  kind: "file" | "link";
  slug: string;
  sectionId: string | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const upsert = useServerFn(upsertAttachment);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    setErr(null);
    if (!title.trim()) {
      setErr("Title is required");
      return;
    }
    setUploading(true);
    try {
      if (kind === "file") {
        if (!file) throw new Error("Choose a file");
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${slug}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          contentType: file.type || "application/octet-stream",
        });
        if (upErr) throw new Error(upErr.message || "Upload failed");
        await upsert({
          data: {
            slug,
            sectionId,
            kind: "file",
            storagePath: path,
            title: title.trim(),
            description: description.trim() || null,
            mimeType: file.type || null,
            sizeBytes: file.size,
            isPublished,
          },
        });
      } else {
        if (!externalUrl.trim()) throw new Error("URL is required");
        await upsert({
          data: {
            slug,
            sectionId,
            kind: "link",
            externalUrl: externalUrl.trim(),
            title: title.trim(),
            description: description.trim() || null,
            isPublished,
          },
        });
      }
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-3 border border-navy/40 bg-background p-3 space-y-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
        New {kind === "file" ? "file" : "link"}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border border-border bg-paper px-2 py-1.5 text-sm"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description (optional)"
        className="w-full border border-border bg-paper px-2 py-1.5 text-sm"
      />
      {kind === "file" ? (
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-xs"
        />
      ) : (
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://…"
          className="w-full border border-border bg-paper px-2 py-1.5 text-sm"
        />
      )}
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        Publish to insiders immediately
      </label>
      {err ? <div className="text-xs text-destructive">{err}</div> : null}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={uploading}
          className="border border-ink bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
        >
          {uploading ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={uploading}
          className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
