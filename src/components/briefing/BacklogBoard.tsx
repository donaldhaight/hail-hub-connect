import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listBacklog,
  createBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  addBacklogComment,
  requestBuild,
} from "@/lib/backlog.functions";

export type BacklogItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  detail: string;
  status: string;
  priority: number;
  sprint_label: string | null;
  position: number;
  build_requested_at: string | null;
  created_at: string;
};

export type BacklogComment = {
  id: string;
  item_id: string;
  body: string;
  author_kind: string;
  created_at: string;
};

const STATUSES = ["idea", "planned", "building", "shipped", "parked"] as const;
const DEFAULT_CATEGORIES = [
  "Operations",
  "Domain & Email",
  "Broadcast",
  "Insider Room",
  "Manual",
  "Season 1 Platform",
  "Strategy",
  "Bugs",
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(status: string) {
  switch (status) {
    case "building":
      return "border-navy bg-navy/5 text-navy";
    case "shipped":
      return "border-border bg-muted text-muted-foreground line-through";
    case "parked":
      return "border-border text-silver";
    case "planned":
      return "border-ink/30 text-ink";
    default:
      return "border-border text-muted-foreground";
  }
}

function buildBrief(item: BacklogItem, comments: BacklogComment[]) {
  const thread = comments
    .filter((c) => c.item_id === item.id)
    .map((c) => `- (${fmtDate(c.created_at)}) ${c.body}`)
    .join("\n");
  return [
    `Build request — ${item.title}`,
    ``,
    `Category: ${item.category}${item.sprint_label ? ` · ${item.sprint_label}` : ""}`,
    `Created: ${fmtDate(item.created_at)}`,
    ``,
    `Summary: ${item.summary || "(none)"}`,
    ``,
    `Detail:`,
    item.detail || "(none)",
    ``,
    thread ? `Discussion:\n${thread}` : `Discussion: (none)`,
    ``,
    `Please build this now.`,
  ].join("\n");
}

export function BacklogBoard() {
  const load = useServerFn(listBacklog);
  const create = useServerFn(createBacklogItem);
  const update = useServerFn(updateBacklogItem);
  const remove = useServerFn(deleteBacklogItem);
  const comment = useServerFn(addBacklogComment);
  const build = useServerFn(requestBuild);

  const [items, setItems] = useState<BacklogItem[]>([]);
  const [comments, setComments] = useState<BacklogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("open");
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    load()
      .then((r) => {
        setItems(r.items as BacklogItem[]);
        setComments(r.comments as BacklogComment[]);
      })
      .finally(() => setLoading(false));
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    items.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [items]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "open") return items.filter((i) => i.status !== "shipped" && i.status !== "parked");
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, BacklogItem[]>();
    for (const i of visible) {
      const list = map.get(i.category) ?? [];
      list.push(i);
      map.set(i.category, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [visible]);

  async function onCreate(form: {
    category: string;
    title: string;
    summary: string;
    detail: string;
    sprint_label: string;
  }) {
    const r = await create({
      data: {
        category: form.category,
        title: form.title,
        summary: form.summary,
        detail: form.detail,
        status: "idea",
        priority: 2,
        sprint_label: form.sprint_label || null,
      },
    });
    setItems((prev) => [...prev, r.item as BacklogItem]);
    setAdding(false);
  }

  async function patch(id: string, patchData: Partial<BacklogItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patchData } : i)));
    await update({ data: { id, ...patchData } as never });
  }

  async function onBuild(item: BacklogItem) {
    const text = buildBrief(item, comments);
    setBrief(text);
    setCopied(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard unavailable — the brief is still shown on screen */
    }
    const r = await build({ data: { id: item.id } });
    setItems((prev) => prev.map((i) => (i.id === item.id ? (r.item as BacklogItem) : i)));
  }

  if (loading) return <div className="p-12 text-center text-silver">Loading the backlog…</div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["open", "all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
              filter === s ? "border-navy bg-navy/5 text-navy" : "border-border text-muted-foreground hover:border-navy"
            }`}
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="ml-auto border border-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:bg-navy hover:text-paper"
        >
          {adding ? "Cancel" : "New item"}
        </button>
      </div>

      {adding ? <NewItemForm categories={categories} onSubmit={onCreate} /> : null}

      {grouped.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([category, list]) => (
            <section key={category}>
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [category]: !c[category] }))}
                className="mb-3 flex w-full items-center gap-3 border-b border-border pb-2 text-left"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {collapsed[category] ? "▸" : "▾"} {category}
                </span>
                <span className="ml-auto font-mono text-[10px] text-silver">{list.length}</span>
              </button>
              {collapsed[category] ? null : (
                <ul className="divide-y divide-border border border-border">
                  {list.map((item) => (
                    <li key={item.id}>
                      <div className="flex flex-wrap items-start gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${statusClass(item.status)}`}
                            >
                              {item.status}
                            </span>
                            {item.sprint_label ? (
                              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver">
                                {item.sprint_label}
                              </span>
                            ) : null}
                            <span className="font-mono text-[9px] text-silver">{fmtDate(item.created_at)}</span>
                          </div>
                          <div className="mt-1 font-serif text-lg leading-snug text-ink">{item.title}</div>
                          {item.summary ? (
                            <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                            className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:border-navy"
                          >
                            {openItem === item.id ? "Close" : "Detail"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onBuild(item)}
                            className="border border-navy bg-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper hover:opacity-90"
                          >
                            Build
                          </button>
                        </div>
                      </div>

                      {openItem === item.id ? (
                        <ItemDrawer
                          item={item}
                          categories={categories}
                          comments={comments.filter((c) => c.item_id === item.id)}
                          onPatch={(p) => patch(item.id, p)}
                          onDelete={async () => {
                            await remove({ data: { id: item.id } });
                            setItems((prev) => prev.filter((i) => i.id !== item.id));
                            setOpenItem(null);
                          }}
                          onComment={async (body) => {
                            const r = await comment({ data: { item_id: item.id, body } });
                            setComments((prev) => [...prev, r.comment as BacklogComment]);
                          }}
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {brief ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-auto border border-border bg-background p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Build brief</span>
              <span className="ml-auto font-mono text-[10px] text-navy">
                {copied ? "Copied to clipboard" : "Copy manually"}
              </span>
            </div>
            <pre className="whitespace-pre-wrap border border-border bg-muted p-4 text-[13px] leading-relaxed text-ink">
              {brief}
            </pre>
            <p className="mt-3 text-sm text-muted-foreground">
              Paste this into the chat to start the build with full context.
            </p>
            <button
              type="button"
              onClick={() => setBrief(null)}
              className="mt-4 border border-navy px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:bg-navy hover:text-paper"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NewItemForm({
  categories,
  onSubmit,
}: {
  categories: string[];
  onSubmit: (f: { category: string; title: string; summary: string; detail: string; sprint_label: string }) => Promise<void>;
}) {
  const [category, setCategory] = useState(categories[0] ?? "Operations");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [detail, setDetail] = useState("");
  const [sprint, setSprint] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mb-8 space-y-3 border border-border p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        setBusy(true);
        try {
          await onSubmit({ category, title, summary, detail, sprint_label: sprint });
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Category</span>
          <input
            list="backlog-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          />
          <datalist id="backlog-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Sprint label</span>
          <input
            value={sprint}
            onChange={(e) => setSprint(e.target.value)}
            placeholder="Sprint 3.1"
            className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Summary</span>
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Detail</span>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={5}
          className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="border border-navy bg-navy px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper disabled:opacity-50"
      >
        {busy ? "Saving…" : "Add to backlog"}
      </button>
    </form>
  );
}

function ItemDrawer({
  item,
  categories,
  comments,
  onPatch,
  onDelete,
  onComment,
}: {
  item: BacklogItem;
  categories: string[];
  comments: BacklogComment[];
  onPatch: (p: Partial<BacklogItem>) => Promise<void>;
  onDelete: () => Promise<void>;
  onComment: (body: string) => Promise<void>;
}) {
  const [detail, setDetail] = useState(item.detail);
  const [summary, setSummary] = useState(item.summary);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="border-t border-border bg-muted/40 px-4 py-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Status</span>
          <select
            value={item.status}
            onChange={(e) => onPatch({ status: e.target.value })}
            className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Category</span>
          <select
            value={item.category}
            onChange={(e) => onPatch({ category: e.target.value })}
            className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Priority</span>
          <select
            value={item.priority}
            onChange={(e) => onPatch({ priority: Number(e.target.value) })}
            className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          >
            {[1, 2, 3, 4].map((p) => (
              <option key={p} value={p}>
                P{p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Summary</span>
        <input
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onBlur={() => summary !== item.summary && onPatch({ summary })}
          className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="mt-3 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Detail</span>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          onBlur={() => detail !== item.detail && onPatch({ detail })}
          rows={6}
          className="mt-1 w-full border border-border bg-background px-3 py-2 text-sm leading-relaxed text-ink"
        />
      </label>

      <div className="mt-6">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Discussion</div>
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="border-l-2 border-navy/30 pl-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver">
                  {c.author_kind} · {fmtDate(c.created_at)}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink/85">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
        <form
          className="mt-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!note.trim()) return;
            setBusy(true);
            try {
              await onComment(note.trim());
              setNote("");
            } finally {
              setBusy(false);
            }
          }}
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add a note to the thread…"
            className="w-full border border-border bg-background px-3 py-2 text-sm text-ink"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="border border-navy px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:bg-navy hover:text-paper disabled:opacity-50"
            >
              {busy ? "Posting…" : "Post note"}
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-silver hover:text-ink"
            >
              Delete item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
