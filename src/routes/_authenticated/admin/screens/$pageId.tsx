import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/inbox.functions";
import {
  getScreen,
  saveFacet,
  listFacetRevisions,
  updateScreenPage,
  addScreenAttachment,
  deleteScreenAttachment,
  getScreenAttachmentUrl,
  sendQuestionToBacklog,
  FACET_KEYS,
  FACET_LABELS,
  type FacetKey,
  type ScreenPage,
  type ScreenFacet,
  type ScreenAttachment,
} from "@/lib/screens.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

const BUCKET = "dossier-artifacts";

export const Route = createFileRoute("/_authenticated/admin/screens/$pageId")({
  head: () => ({
    meta: [
      { title: "Screen — PrepareAmerica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ScreenDetailPage,
});

const PLACEHOLDERS: Record<FacetKey, string> = {
  purpose: "One line. Why this container exists, and what ends when the person is done with it.",
  permissions: "Role + applicable Relationship + applicable Assignment. What a denied person sees.",
  records: "Which records may appear here, and how they are scoped to the person.",
  actions: "What may be done here, by whom, what it writes, whether it is reversible.",
  tools: "What the guide may operate on the person's behalf, and what needs confirmation.",
  context: "What must be known before this can render. Which memory partition it reads.",
  completion: "What ends the work this container holds. Say 'nothing yet' if that is true.",
  content: "The default copy. Plain mood, intensity 1.",
  layout: "Structure and order, not pixels.",
  components: "Which components exist, and which would have to be built.",
  states: "Empty · loading · partial · error · denied · done.",
  persona: "How PrepareAmerica, Kimosabe and Buddy Claim each wear this screen.",
  open_questions: "One question per line. Use the button below to send one to the backlog.",
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ScreenDetailPage() {
  const { pageId } = Route.useParams();
  const myRoles = useServerFn(getMyRoles);
  const load = useServerFn(getScreen);
  const save = useServerFn(saveFacet);
  const history = useServerFn(listFacetRevisions);
  const updatePage = useServerFn(updateScreenPage);
  const attach = useServerFn(addScreenAttachment);
  const detach = useServerFn(deleteScreenAttachment);
  const openUrl = useServerFn(getScreenAttachmentUrl);
  const toBacklog = useServerFn(sendQuestionToBacklog);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [page, setPage] = useState<ScreenPage | null>(null);
  const [facets, setFacets] = useState<Record<string, string>>({});
  const [stamps, setStamps] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<ScreenAttachment[]>([]);
  const [revisions, setRevisions] = useState<Record<string, Array<{ id: string; body: string; created_at: string }>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  const refresh = () => {
    load({ data: { id: pageId } })
      .then((r) => {
        setPage(r.page);
        const bodies: Record<string, string> = {};
        const times: Record<string, string> = {};
        (r.facets as ScreenFacet[]).forEach((f) => {
          bodies[f.facet_key] = f.body;
          times[f.facet_key] = f.updated_at;
        });
        setFacets(bodies);
        setStamps(times);
        setAttachments(r.attachments);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  };

  useEffect(() => {
    if (!authorized) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, pageId]);

  async function handleSave(key: FacetKey) {
    setSaving(key);
    try {
      const r = await save({ data: { page_id: pageId, facet_key: key, body: facets[key] ?? "" } });
      setStamps((s) => ({ ...s, [key]: r.facet.updated_at }));
      setRevisions((r2) => ({ ...r2, [key]: [] }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(null);
    }
  }

  async function toggleHistory(key: FacetKey) {
    if (revisions[key]?.length) {
      setRevisions((r) => ({ ...r, [key]: [] }));
      return;
    }
    const r = await history({ data: { page_id: pageId, facet_key: key } });
    setRevisions((prev) => ({ ...prev, [key]: r.revisions }));
    if (r.revisions.length === 0) setErr("No previous state recorded for this one yet.");
  }

  async function patchPage(patch: Partial<ScreenPage>) {
    const r = await updatePage({ data: { id: pageId, ...(patch as any) } });
    setPage(r.page);
  }

  async function handleUpload(file: File) {
    setBusy(true);
    try {
      const path = `screens/${pageId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) throw new Error(error.message);
      await attach({
        data: {
          page_id: pageId,
          kind: "file",
          storage_path: path,
          title: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
        },
      });
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleLink() {
    if (!linkUrl.trim()) return;
    setBusy(true);
    try {
      await attach({
        data: {
          page_id: pageId,
          kind: "link",
          external_url: linkUrl.trim(),
          title: linkTitle.trim() || linkUrl.trim(),
        },
      });
      setLinkUrl("");
      setLinkTitle("");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to attach");
    } finally {
      setBusy(false);
    }
  }

  async function handleQuestion() {
    if (question.trim().length < 3) return;
    setBusy(true);
    try {
      await toBacklog({ data: { page_id: pageId, question: question.trim() } });
      setQuestion("");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to send");
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
  if (!page) {
    return (
      <PageShell>
        <div className="p-16 text-center text-silver">Loading screen…</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={page.branch}
        title={page.name}
        lede="Twelve facets and a question list. Each saves on its own, and keeps its previous state."
        confidentiality={page.class as any}
      />

      <section className="mx-auto max-w-4xl px-6 py-8">
        <Link to="/admin/screens" className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:underline">
          ← All screens
        </Link>

        {err ? (
          <div className="mt-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            {err}
            <button onClick={() => setErr(null)} className="ml-3 underline">
              dismiss
            </button>
          </div>
        ) : null}

        {/* Front matter */}
        <div className="mt-6 grid gap-3 border border-border bg-muted/20 p-4 sm:grid-cols-3">
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">Status</span>
            <select
              value={page.status}
              onChange={(e) => patchPage({ status: e.target.value as ScreenPage["status"] })}
              className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm text-ink"
            >
              <option value="empty">empty</option>
              <option value="specified">specified</option>
              <option value="built">built</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">Class</span>
            <select
              value={page.class}
              onChange={(e) => patchPage({ class: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm text-ink"
            >
              {["C0", "C1", "C2", "C3", "C4"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">Truth label</span>
            <select
              value={page.truth}
              onChange={(e) => patchPage({ truth: e.target.value })}
              className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm text-ink"
            >
              {["FACT", "ASSERTION", "DECISION", "HYPOTHESIS", "SIMULATION", "OPEN"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">Route</span>
            <input
              defaultValue={page.route ?? ""}
              onBlur={(e) => patchPage({ route: e.target.value || null })}
              placeholder="/kimosabe"
              className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm text-ink"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">
              Pattern — the corpus lines this expresses
            </span>
            <input
              defaultValue={(page.pattern_links ?? []).join(", ")}
              onBlur={(e) =>
                patchPage({
                  pattern_links: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="docs/law/DECISIONS.md ADR-019"
              className="mt-1 w-full border border-border bg-background px-2 py-1 text-sm text-ink"
            />
          </label>
          <div className="sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
            Register: {(page.register_ids ?? []).length ? page.register_ids.join(" · ") : "none"}
          </div>
        </div>

        {/* Facets */}
        <div className="mt-8 space-y-6">
          {FACET_KEYS.map((key) => (
            <div key={key} className="border border-border bg-background p-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                  {FACET_LABELS[key]}
                </h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver">
                  {stamps[key] ? `edited ${fmt(stamps[key])}` : "never written"}
                </span>
                <span className="ml-auto flex gap-2">
                  <button
                    onClick={() => toggleHistory(key)}
                    className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
                  >
                    Previous state
                  </button>
                  <button
                    onClick={() => handleSave(key)}
                    disabled={saving === key}
                    className="border border-navy px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-navy disabled:opacity-40"
                  >
                    {saving === key ? "Saving…" : "Save"}
                  </button>
                </span>
              </div>
              <textarea
                value={facets[key] ?? ""}
                onChange={(e) => setFacets((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={PLACEHOLDERS[key]}
                rows={key === "purpose" ? 3 : 6}
                className="mt-3 w-full border border-border bg-background p-3 font-mono text-sm text-ink"
              />
              {revisions[key]?.length ? (
                <div className="mt-3 space-y-2 border-t border-border pt-3">
                  {revisions[key].map((rev) => (
                    <div key={rev.id} className="border border-border bg-muted/30 p-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-silver">
                          {fmt(rev.created_at)}
                        </span>
                        <button
                          onClick={() => setFacets((f) => ({ ...f, [key]: rev.body }))}
                          className="ml-auto border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
                        >
                          Restore into editor
                        </button>
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                        {rev.body}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Question to backlog */}
        <div className="mt-8 border border-border bg-muted/20 p-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
            Send a question to the backlog
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The question is added to this screen's list and opened as a backlog row in the same act.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What happens when an ISR fails a module?"
              className="min-w-[260px] flex-1 border border-border bg-background px-2 py-1 text-sm text-ink"
            />
            <button
              onClick={handleQuestion}
              disabled={busy}
              className="border border-navy px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-navy disabled:opacity-40"
            >
              Open the row
            </button>
          </div>
        </div>

        {/* Evidence */}
        <div className="mt-8 border border-border bg-background p-4">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">Evidence</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Screenshots, PDFs and links. Source material outranks anything written about it, so nothing here is
            overwritten — a correction is a new dated artifact.
          </p>

          <ul className="mt-3 space-y-2">
            {attachments.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 border border-border px-3 py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                  {a.kind === "file" ? "FILE" : "LINK"}
                </span>
                <button
                  onClick={async () => {
                    const r = await openUrl({ data: { id: a.id } });
                    window.open(r.url, "_blank", "noopener,noreferrer");
                  }}
                  className="text-left text-sm text-ink hover:underline"
                >
                  {a.title}
                </button>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.14em] text-silver">
                  {fmt(a.created_at)}
                </span>
                <button
                  onClick={async () => {
                    if (!confirm("Remove this artifact?")) return;
                    await detach({ data: { id: a.id } });
                    refresh();
                  }}
                  className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  Remove
                </button>
              </li>
            ))}
            {attachments.length === 0 ? (
              <li className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Nothing attached yet.</li>
            ) : null}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="file"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
              className="text-xs text-muted-foreground"
            />
            <input
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="Link title"
              className="border border-border bg-background px-2 py-1 text-sm text-ink"
            />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://…"
              className="min-w-[200px] flex-1 border border-border bg-background px-2 py-1 text-sm text-ink"
            />
            <button
              onClick={handleLink}
              disabled={busy}
              className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              Attach link
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
