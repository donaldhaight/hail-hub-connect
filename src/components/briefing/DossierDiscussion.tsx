import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listDossierNotes,
  upsertDossierNote,
  deleteDossierNote,
  listDossierMessages,
  postDossierMessage,
  deleteDossierMessage,
} from "@/lib/dossier.functions";

type Note = {
  id: string;
  dossier_slug: string;
  section_heading: string | null;
  body: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  section_heading: string | null;
  body: string;
  author_id: string;
  created_at: string;
  authorLabel: string;
  authorIsFounder: boolean;
};

export function DossierDiscussion({
  slug,
  sectionHeadings,
  isFounder,
}: {
  slug: string;
  sectionHeadings: string[];
  isFounder: boolean;
}) {
  const listNotes = useServerFn(listDossierNotes);
  const saveNote = useServerFn(upsertDossierNote);
  const removeNote = useServerFn(deleteDossierNote);
  const listMsgs = useServerFn(listDossierMessages);
  const postMsg = useServerFn(postDossierMessage);
  const removeMsg = useServerFn(deleteDossierMessage);

  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [noteBody, setNoteBody] = useState("");
  const [noteSection, setNoteSection] = useState<string>("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSection, setMsgSection] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [n, m] = await Promise.all([
        listNotes({ data: { slug } }),
        listMsgs({ data: { slug } }),
      ]);
      setNotes(n.notes as Note[]);
      setMessages(m.messages as Message[]);
      setViewerId(m.viewerId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load discussion");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submitNote() {
    if (!noteBody.trim()) return;
    setBusy(true);
    try {
      await saveNote({
        data: {
          slug,
          sectionHeading: noteSection || null,
          body: noteBody.trim(),
        },
      });
      setNoteBody("");
      setNoteSection("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save note");
    } finally {
      setBusy(false);
    }
  }

  async function submitMessage() {
    if (!msgBody.trim()) return;
    setBusy(true);
    try {
      await postMsg({
        data: {
          slug,
          sectionHeading: msgSection || null,
          body: msgBody.trim(),
        },
      });
      setMsgBody("");
      setMsgSection("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to post message");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl border-t border-border px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Discussion</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {error ? (
        <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {/* Founder notes */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-ink">Founder notes</h3>
        {loading ? (
          <div className="text-sm text-silver">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="text-sm text-silver">No founder notes yet.</div>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="border border-border bg-muted/40 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center border border-ink/30 bg-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper">
                    Founder note
                  </span>
                  {n.section_heading ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                      § {n.section_heading}
                    </span>
                  ) : null}
                  <span className="ml-auto font-mono text-[10px] text-silver">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink/90">{n.body}</p>
                {isFounder ? (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this note?")) return;
                        await removeNote({ data: { id: n.id } });
                        await refresh();
                      }}
                      className="text-[10px] font-mono uppercase tracking-[0.22em] text-silver hover:text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {isFounder ? (
          <div className="border border-dashed border-border p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Add founder note
            </div>
            <select
              value={noteSection}
              onChange={(e) => setNoteSection(e.target.value)}
              className="mb-2 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            >
              <option value="">— Whole dossier —</option>
              {sectionHeadings.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              rows={3}
              placeholder="Founder note visible to all insiders…"
              className="w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={submitNote}
                disabled={busy || !noteBody.trim()}
                className="border border-ink bg-ink px-4 py-1.5 text-xs text-paper disabled:opacity-50"
              >
                Post note
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Insider Q&A */}
      <div className="mt-10 space-y-4">
        <h3 className="font-serif text-lg text-ink">Insider Q&amp;A</h3>
        {loading ? (
          <div className="text-sm text-silver">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-silver">No messages yet. Be the first to redline.</div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => {
              const mine = viewerId === m.author_id;
              const canDelete = isFounder || mine;
              return (
                <li
                  key={m.id}
                  className={`border p-4 ${m.authorIsFounder ? "border-ink/40 bg-ink/[0.03]" : "border-border bg-card"}`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        m.authorIsFounder
                          ? "border-ink/30 bg-ink text-paper"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {m.authorLabel}
                    </span>
                    {m.section_heading ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                        § {m.section_heading}
                      </span>
                    ) : null}
                    <span className="ml-auto font-mono text-[10px] text-silver">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-ink/90">{m.body}</p>
                  {canDelete ? (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this message?")) return;
                          try {
                            await removeMsg({ data: { id: m.id } });
                            await refresh();
                          } catch (e) {
                            setError(e instanceof Error ? e.message : "Delete failed (over 15-min window?)");
                          }
                        }}
                        className="text-[10px] font-mono uppercase tracking-[0.22em] text-silver hover:text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        <div className="border border-dashed border-border p-4">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Post a message
          </div>
          <select
            value={msgSection}
            onChange={(e) => setMsgSection(e.target.value)}
            className="mb-2 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          >
            <option value="">— General (whole dossier) —</option>
            {sectionHeadings.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <textarea
            value={msgBody}
            onChange={(e) => setMsgBody(e.target.value)}
            rows={3}
            placeholder="Question, redline, or challenge — visible to founder and other insiders…"
            className="w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">
              You can edit or delete within 15 minutes.
            </p>
            <button
              onClick={submitMessage}
              disabled={busy || !msgBody.trim()}
              className="border border-ink bg-ink px-4 py-1.5 text-xs text-paper disabled:opacity-50"
            >
              Post message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
