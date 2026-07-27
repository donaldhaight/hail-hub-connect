import { createFileRoute, redirect, Link, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { TruthChip, type TruthClass, type ConfidentialityClass } from "@/components/briefing/Badges";
import { DOSSIERS_BY_SLUG, ORDERED_DOSSIERS } from "@/content/dossiers";
import {
  logDossierOpen,
  getInsiderWhatsNew,
  getDossierFromDb,
  type DossierRow,
  type DossierSectionRow,
} from "@/lib/dossier.functions";
import { DossierDiscussion } from "@/components/briefing/DossierDiscussion";
import { DossierAttachments } from "@/components/briefing/DossierAttachments";
import { useSectionReads, formatDwell } from "@/hooks/useSectionReads";
import {
  DossierMetaEditor,
  DossierSectionEditor,
  SectionEditControls,
} from "@/components/briefing/DossierEditor";

export const Route = createFileRoute("/_authenticated/insider/dossier/$slug")({
  beforeLoad: async ({ params }) => {
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
    if (!DOSSIERS_BY_SLUG[params.slug]) throw notFound();
    return { isFounder: set.has("founder_admin") };
  },
  head: ({ params }) => {
    const d = DOSSIERS_BY_SLUG[params.slug];
    return {
      meta: [
        { title: d ? `${d.title} — Insider Dossier` : "Dossier — ClaimStore" },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <PageHeader eyebrow="Dossier" title="Not found." lede="This dossier slug does not exist." confidentiality="C2" />
    </PageShell>
  ),
  component: DossierReader,
});

type LiveDossier = {
  slug: string;
  code: string;
  title: string;
  summary: string;
  confidentiality: ConfidentialityClass;
  truth_default: TruthClass;
};

type LiveSection = {
  id: string | null;
  heading: string;
  truth: TruthClass;
  body: string;
};

function DossierReader() {
  const { slug } = Route.useParams();
  const { isFounder } = Route.useRouteContext();
  const logOpen = useServerFn(logDossierOpen);
  const loadWhatsNew = useServerFn(getInsiderWhatsNew);
  const loadDossier = useServerFn(getDossierFromDb);
  const reads = useSectionReads(slug);

  const fallback = DOSSIERS_BY_SLUG[slug];
  const [meta, setMeta] = useState<LiveDossier>(() => ({
    slug: fallback.slug,
    code: fallback.code,
    title: fallback.title,
    summary: fallback.summary,
    confidentiality: fallback.confidentiality,
    truth_default: fallback.truthDefault,
  }));
  const [metaRow, setMetaRow] = useState<DossierRow | null>(null);
  const [sections, setSections] = useState<LiveSection[]>(() =>
    fallback.sections.map((s) => ({ id: null, heading: s.heading, truth: s.truth, body: s.body })),
  );
  const [rawSections, setRawSections] = useState<DossierSectionRow[]>([]);

  const [sinceCutoff, setSinceCutoff] = useState<string | null>(null);
  const [sectionLatest, setSectionLatest] = useState<Record<string, string>>({});
  const [addingSection, setAddingSection] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await loadDossier({ data: { slug } });
      if (r.dossier) {
        setMetaRow(r.dossier);
        setMeta({
          slug: r.dossier.slug,
          code: r.dossier.code,
          title: r.dossier.title,
          summary: r.dossier.summary,
          confidentiality: r.dossier.confidentiality as ConfidentialityClass,
          truth_default: r.dossier.truth_default as TruthClass,
        });
      }
      if (r.sections.length > 0) {
        setRawSections(r.sections);
        setSections(
          r.sections.map((s) => ({
            id: s.id,
            heading: s.heading,
            truth: s.truth as TruthClass,
            body: s.body,
          })),
        );
      }
    } catch {
      // keep fallback
    }
  }, [loadDossier, slug]);

  useEffect(() => {
    loadWhatsNew()
      .then((r) => {
        setSinceCutoff(r.lastOpenBySlug[slug] ?? "");
        setSectionLatest(r.latestBySection[slug] ?? {});
      })
      .catch(() => {})
      .finally(() => {
        logOpen({ data: { slug } }).catch(() => {});
      });
    refresh();
  }, [logOpen, loadWhatsNew, slug, refresh]);

  const isNewSection = (heading: string) => {
    if (sinceCutoff === null) return false;
    if (sinceCutoff === "") return true;
    const ts = sectionLatest[heading];
    return !!ts && ts > sinceCutoff;
  };

  const hasSim = sections.some((s) => s.truth === "SIMULATION");

  const orderedFallback = ORDERED_DOSSIERS;
  const idx = orderedFallback.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? orderedFallback[idx - 1] : null;
  const next = idx < orderedFallback.length - 1 ? orderedFallback[idx + 1] : null;

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Dossier ${meta.code}`}
        title={meta.title}
        lede={meta.summary}
        confidentiality={meta.confidentiality}
      />

      <section className="mx-auto max-w-3xl px-6 pt-6">
        <Link to="/insider" className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver hover:text-ink">
          ← Back to Index
        </Link>
        {isFounder && metaRow ? (
          <DossierMetaEditor dossier={metaRow} onSaved={refresh} />
        ) : null}
      </section>

      {hasSim ? (
        <section className="mx-auto max-w-3xl px-6 pt-4">
          <div className="border border-border bg-muted p-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            This dossier contains simulated material. Figures are illustrative pending founder review.
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        {sections.map((s, i) => {
          const row = s.id ? rawSections.find((r) => r.id === s.id) ?? null : null;
          const editing = editingId && editingId === s.id;
          const readState = s.id ? reads.state[s.id] : undefined;
          return (
            <article
              key={s.id ?? i}
              ref={(node) => { if (s.id) reads.observe(s.id, node); }}
              className="space-y-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  § {String(i + 1).padStart(2, "0")}
                </span>
                <TruthChip value={s.truth} />
                {isNewSection(s.heading) ? (
                  <span className="border border-navy/50 bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-navy">
                    New
                  </span>
                ) : null}
                {!isFounder && readState ? (
                  readState.read_confirmed_at ? (
                    <span className="border border-navy/50 bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-navy">
                      Read ✓
                    </span>
                  ) : formatDwell(readState.dwell_ms) ? (
                    <span className="border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                      Seen {formatDwell(readState.dwell_ms)}
                    </span>
                  ) : null
                ) : null}
                {isFounder && row && !editing ? (
                  <div className="ml-auto">
                    <SectionEditControls
                      slug={slug}
                      section={row}
                      isFirst={i === 0}
                      isLast={i === sections.length - 1}
                      onChanged={refresh}
                      onEdit={() => setEditingId(row.id)}
                    />
                  </div>
                ) : null}
              </div>
              <h2 className="font-serif text-2xl text-ink">{s.heading}</h2>
              {editing && row ? (
                <DossierSectionEditor
                  slug={slug}
                  section={row}
                  onDone={() => { setEditingId(null); refresh(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="space-y-3 text-[15px] leading-relaxed text-ink/90">
                  {s.body.split(/\n\s*\n/).map((p, j) => (
                    <p key={j} className="max-w-[68ch]">{p}</p>
                  ))}
                </div>
              )}
              {s.id ? (
                <DossierAttachments slug={slug} sectionId={s.id} isFounder={isFounder} />
              ) : null}
              {s.id && !isFounder && !readState?.read_confirmed_at && !editing ? (
                <div className="pt-1">
                  <button
                    onClick={() => reads.confirm(s.id!)}
                    className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
                  >
                    Mark as read
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}

        {isFounder ? (
          addingSection ? (
            <DossierSectionEditor
              slug={slug}
              onDone={() => { setAddingSection(false); refresh(); }}
              onCancel={() => setAddingSection(false)}
            />
          ) : (
            <button
              onClick={() => setAddingSection(true)}
              className="w-full border border-dashed border-border p-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
            >
              + Add section
            </button>
          )
        ) : null}
      </section>

      <DossierDiscussion
        slug={slug}
        sectionHeadings={sections.map((s) => s.heading)}
        isFounder={isFounder}
      />

      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 border-t border-border px-6 py-8">
        {prev ? (
          <Link
            to="/_authenticated/insider/dossier/$slug"
            params={{ slug: prev.slug }}
            className="group flex flex-col text-left"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">← Previous</span>
            <span className="font-serif text-base text-ink group-hover:underline">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link
            to="/_authenticated/insider/dossier/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-col text-right"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Next →</span>
            <span className="font-serif text-base text-ink group-hover:underline">{next.title}</span>
          </Link>
        ) : <span />}
      </nav>

      <footer className="border-t border-border bg-muted/40 px-6 py-4">
        <div className="mx-auto max-w-3xl text-center font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Confidential Working Concept — Not an Offering
        </div>
      </footer>
    </PageShell>
  );
}
