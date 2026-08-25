import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/briefing/PageShell";
import { Meta, type TruthClass, type ConfidentialityClass } from "@/components/briefing/Badges";
import { getManualChapter, updateManualChapter } from "@/lib/manual.functions";
import { ManualEvidence } from "@/components/briefing/ManualEvidence";
import {
  GlossaryParagraph,
  type GlossaryTerm,
} from "@/components/briefing/GlossaryProse";
import {
  PART_TITLES,
  TRUTH_OPTIONS,
  CONFIDENTIALITY_OPTIONS,
  DRAFT_STATUS_OPTIONS,
  DRAFT_STATUS_LABEL,
  readingMinutes,
  wordCount,
  toParagraphs,
  type DraftStatus,
  type ManualChapter,
} from "@/content/manual";

export const Route = createFileRoute("/_authenticated/manual/$slug")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id);
    const set = new Set((roles ?? []).map((r) => r.role));
    if (!set.has("qualified_insider") && !set.has("founder_admin")) {
      throw redirect({ to: "/" });
    }
    return { roles: Array.from(set) as string[] };
  },
  head: () => ({
    meta: [
      { title: "Owner's Manual — United Stakeholders of America" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ManualChapterPage,
});

type NavItem = { slug: string; title: string; position: number; part: string };

function ManualChapterPage() {
  const { slug } = Route.useParams();
  const { roles } = Route.useRouteContext();
  const isFounder = roles.includes("founder_admin");

  const load = useServerFn(getManualChapter);
  const save = useServerFn(updateManualChapter);

  const [chapter, setChapter] = useState<ManualChapter | null>(null);
  const [nav, setNav] = useState<NavItem[]>([]);
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ManualChapter | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const refresh = useCallback(() => {
    load({ data: { slug } })
      .then((r) => {
        setChapter(r.chapter as ManualChapter | null);
        setNav(r.nav as NavItem[]);
        setTerms((r.terms ?? []) as GlossaryTerm[]);
      })
      .catch(() => setStatus("Could not load this chapter."));
  }, [load, slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const index = nav.findIndex((n) => n.slug === slug);
  const prev = index > 0 ? nav[index - 1] : null;
  const next = index >= 0 && index < nav.length - 1 ? nav[index + 1] : null;
  const partNav = chapter ? nav.filter((n) => n.part === chapter.part) : [];

  async function onSave() {
    if (!draft) return;
    setStatus("Saving…");
    try {
      await save({
        data: {
          slug,
          title: draft.title,
          subtitle: draft.subtitle,
          truth: draft.truth,
          confidentiality: draft.confidentiality,
          body: draft.body,
          draft_status: draft.draft_status,
          pull_quote: draft.pull_quote,
          provenance_note: draft.provenance_note,
        },
      });
      setEditing(false);
      setStatus("Saved.");
      refresh();
    } catch {
      setStatus("Save failed.");
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Link
          to="/manual"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
        >
          ← Owner&rsquo;s Manual
        </Link>
      </div>

      {!chapter ? (
        <div className="mx-auto max-w-6xl px-6 py-24 text-sm text-muted-foreground">
          {status ?? "Loading…"}
        </div>
      ) : (
        <>
          <section className="border-b border-border">
            <div className="mx-auto max-w-6xl px-6 pt-10 pb-14 md:pb-20">
              <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
                <span>{PART_TITLES[chapter.part] ?? chapter.part}</span>
                {chapter.number_label ? <span>· {chapter.number_label}</span> : null}
                <span>· {readingMinutes(chapter.body)} min read</span>
                <span>· {wordCount(chapter.body).toLocaleString()} words</span>
                <span className="border border-silver/50 px-1.5 py-0.5 text-ink/70">
                  {DRAFT_STATUS_LABEL[chapter.draft_status] ?? chapter.draft_status}
                </span>
              </div>
              <h1 className="max-w-[24ch] font-serif text-4xl leading-[1.04] tracking-tight text-balance text-ink md:text-6xl">
                {chapter.title}
              </h1>
              {chapter.subtitle ? (
                <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-pretty text-muted-foreground">
                  {chapter.subtitle}
                </p>
              ) : null}
              {chapter.provenance_note ? (
                <p className="mt-6 max-w-[58ch] border-l-2 border-navy/40 pl-4 font-mono text-[11px] uppercase tracking-[0.14em] leading-relaxed text-silver">
                  {chapter.provenance_note}
                </p>
              ) : null}
              <div className="mt-8">
                <Meta
                  truth={chapter.truth as TruthClass}
                  confidentiality={chapter.confidentiality as ConfidentialityClass}
                />
              </div>
              {isFounder ? (
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(chapter);
                      setEditing((v) => !v);
                      setStatus(null);
                    }}
                    className="border border-ink/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    {editing ? "Cancel" : "Edit chapter"}
                  </button>
                  {status ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                      {status}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            {editing && draft ? (
              <div className="max-w-3xl space-y-5">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Title
                  </span>
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-base text-ink"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Subtitle
                  </span>
                  <input
                    value={draft.subtitle ?? ""}
                    onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-base text-ink"
                  />
                </label>
                <div className="flex flex-wrap gap-5">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                      Truth label
                    </span>
                    <select
                      value={draft.truth}
                      onChange={(e) =>
                        setDraft({ ...draft, truth: e.target.value as TruthClass })
                      }
                      className="mt-2 block border border-border bg-background px-3 py-2 text-sm text-ink"
                    >
                      {TRUTH_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                      Confidentiality
                    </span>
                    <select
                      value={draft.confidentiality}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          confidentiality: e.target.value as ConfidentialityClass,
                        })
                      }
                      className="mt-2 block border border-border bg-background px-3 py-2 text-sm text-ink"
                    >
                      {CONFIDENTIALITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Draft status
                  </span>
                  <select
                    value={draft.draft_status}
                    onChange={(e) =>
                      setDraft({ ...draft, draft_status: e.target.value as DraftStatus })
                    }
                    className="mt-2 block border border-border bg-background px-3 py-2 text-sm text-ink"
                  >
                    {DRAFT_STATUS_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {DRAFT_STATUS_LABEL[d]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Pull quote — one line, rendered large in the margin
                  </span>
                  <textarea
                    value={draft.pull_quote ?? ""}
                    onChange={(e) => setDraft({ ...draft, pull_quote: e.target.value })}
                    rows={2}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-base text-ink"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Provenance — what dated artifact backs this chapter
                  </span>
                  <textarea
                    value={draft.provenance_note ?? ""}
                    onChange={(e) => setDraft({ ...draft, provenance_note: e.target.value })}
                    rows={2}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 text-base text-ink"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    Body — blank line between paragraphs
                  </span>
                  <textarea
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    rows={22}
                    className="mt-2 w-full border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed text-ink"
                  />
                </label>
                <button
                  type="button"
                  onClick={onSave}
                  className="border border-ink bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper"
                >
                  Save chapter
                </button>
              </div>
            ) : (
              <div className="grid gap-10 md:grid-cols-12">
                <aside className="md:col-span-3">
                  <div className="md:sticky md:top-10">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                      {PART_TITLES[chapter.part] ?? chapter.part}
                    </div>
                    <ol className="mt-4 space-y-2">
                      {partNav.map((n) => (
                        <li key={n.slug}>
                          <Link
                            to="/manual/$slug"
                            params={{ slug: n.slug }}
                            className={
                              n.slug === slug
                                ? "block text-sm leading-snug text-ink"
                                : "block text-sm leading-snug text-muted-foreground hover:text-ink"
                            }
                          >
                            {n.slug === slug ? "— " : ""}
                            {n.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                </aside>
                <div className="md:col-span-9">
                  {chapter.pull_quote ? (
                    <blockquote className="mb-10 border-l-2 border-navy pl-6 font-serif text-2xl leading-snug text-balance text-ink md:text-3xl">
                      {chapter.pull_quote}
                    </blockquote>
                  ) : null}
                  <div className="max-w-[68ch] space-y-6 text-[17px] leading-[1.7] text-ink/85">
                    {toParagraphs(chapter.body).map((p, i) => (
                      <GlossaryParagraph key={i} text={p} terms={terms} />
                    ))}
                  </div>
                  <ManualEvidence slug={slug} isFounder={isFounder} />
                </div>
              </div>
            )}
          </section>

          <nav className="border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
              {prev ? (
                <Link
                  to="/manual/$slug"
                  params={{ slug: prev.slug }}
                  className="group max-w-[45%]"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                    Previous
                  </span>
                  <span className="mt-1 block font-serif text-lg text-ink group-hover:underline">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to="/manual/$slug"
                  params={{ slug: next.slug }}
                  className="group max-w-[45%] sm:text-right"
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                    Next
                  </span>
                  <span className="mt-1 block font-serif text-lg text-ink group-hover:underline">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </nav>
        </>
      )}
    </PageShell>
  );
}
