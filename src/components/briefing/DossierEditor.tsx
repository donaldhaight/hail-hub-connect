import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  upsertDossierMeta,
  upsertDossierSection,
  deleteDossierSection,
  reorderDossierSection,
  type DossierRow,
  type DossierSectionRow,
} from "@/lib/dossier.functions";

const CONF = ["C0", "C1", "C2", "C3", "C4"] as const;
const TRUTH = ["FACT", "ASSERTION", "DECISION", "HYPOTHESIS", "SIMULATION", "OPEN"] as const;

const editorFrame =
  "mt-3 border border-navy/40 bg-navy/[0.03] p-4 space-y-3";
const label = "block font-mono text-[10px] uppercase tracking-[0.22em] text-silver mb-1";
const input =
  "w-full border border-border bg-background px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none";
const btnPrimary =
  "border border-ink bg-ink px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-50";
const btnGhost =
  "border border-border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:border-ink";

export function DossierMetaEditor({
  dossier,
  onSaved,
}: {
  dossier: DossierRow;
  onSaved: () => void;
}) {
  const save = useServerFn(upsertDossierMeta);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(dossier.title);
  const [summary, setSummary] = useState(dossier.summary);
  const [conf, setConf] = useState(dossier.confidentiality);
  const [truth, setTruth] = useState(dossier.truth_default);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={btnGhost + " mt-4"}>
        Edit dossier meta
      </button>
    );
  }
  return (
    <div className={editorFrame + " mt-4"}>
      <div>
        <label className={label}>Title</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className={label}>Summary</label>
        <textarea rows={3} className={input} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={label}>Confidentiality</label>
          <select className={input} value={conf} onChange={(e) => setConf(e.target.value)}>
            {CONF.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className={label}>Truth default</label>
          <select className={input} value={truth} onChange={(e) => setTruth(e.target.value)}>
            {TRUTH.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      {err ? <div className="text-xs text-destructive">{err}</div> : null}
      <div className="flex gap-2">
        <button
          className={btnPrimary}
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setErr(null);
            try {
              await save({
                data: {
                  slug: dossier.slug,
                  title,
                  summary,
                  confidentiality: conf as any,
                  truth_default: truth as any,
                },
              });
              setOpen(false);
              onSaved();
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Save failed");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button className={btnGhost} onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

export function DossierSectionEditor({
  slug,
  section,
  onDone,
  onCancel,
}: {
  slug: string;
  section?: DossierSectionRow;
  onDone: () => void;
  onCancel: () => void;
}) {
  const save = useServerFn(upsertDossierSection);
  const [heading, setHeading] = useState(section?.heading ?? "");
  const [truth, setTruth] = useState(section?.truth ?? "ASSERTION");
  const [body, setBody] = useState(section?.body ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className={editorFrame}>
      <div>
        <label className={label}>Heading</label>
        <input className={input} value={heading} onChange={(e) => setHeading(e.target.value)} />
      </div>
      <div>
        <label className={label}>Truth label</label>
        <select className={input} value={truth} onChange={(e) => setTruth(e.target.value)}>
          {TRUTH.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={label}>Body (blank line = new paragraph)</label>
        <textarea
          rows={8}
          className={input + " font-mono text-[13px]"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      {err ? <div className="text-xs text-destructive">{err}</div> : null}
      <div className="flex gap-2">
        <button
          className={btnPrimary}
          disabled={saving || !heading.trim() || !body.trim()}
          onClick={async () => {
            setSaving(true);
            setErr(null);
            try {
              await save({
                data: {
                  id: section?.id,
                  slug,
                  heading: heading.trim(),
                  truth: truth as any,
                  body: body.trim(),
                },
              });
              onDone();
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Save failed");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving…" : "Save section"}
        </button>
        <button className={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export function SectionEditControls({
  slug,
  section,
  isFirst,
  isLast,
  onChanged,
  onEdit,
}: {
  slug: string;
  section: DossierSectionRow;
  isFirst: boolean;
  isLast: boolean;
  onChanged: () => void;
  onEdit: () => void;
}) {
  const reorder = useServerFn(reorderDossierSection);
  const remove = useServerFn(deleteDossierSection);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try { await fn(); onChanged(); } finally { setBusy(false); }
  };

  return (
    <div className="flex items-center gap-2">
      <button className={btnGhost} onClick={onEdit} disabled={busy}>Edit</button>
      <button
        className={btnGhost}
        disabled={busy || isFirst}
        onClick={() => run(() => reorder({ data: { slug, id: section.id, direction: "up" } }))}
      >↑</button>
      <button
        className={btnGhost}
        disabled={busy || isLast}
        onClick={() => run(() => reorder({ data: { slug, id: section.id, direction: "down" } }))}
      >↓</button>
      <button
        className={btnGhost + " hover:border-destructive hover:text-destructive"}
        disabled={busy}
        onClick={() => {
          if (!confirm(`Remove section "${section.heading}"? This cannot be undone.`)) return;
          run(() => remove({ data: { id: section.id, slug } }));
        }}
      >Remove</button>
    </div>
  );
}
