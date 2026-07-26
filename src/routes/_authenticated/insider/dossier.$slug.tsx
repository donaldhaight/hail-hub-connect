import { createFileRoute, redirect, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { TruthChip } from "@/components/briefing/Badges";
import { DOSSIERS_BY_SLUG, neighbors } from "@/content/dossiers";
import { logDossierOpen } from "@/lib/dossier.functions";

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

function DossierReader() {
  const { slug } = Route.useParams();
  const dossier = DOSSIERS_BY_SLUG[slug];
  const { prev, next } = neighbors(slug);
  const logOpen = useServerFn(logDossierOpen);
  const hasSim = dossier.sections.some((s) => s.truth === "SIMULATION");

  useEffect(() => {
    logOpen({ data: { slug } }).catch(() => {});
  }, [logOpen, slug]);

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Dossier ${dossier.code}`}
        title={dossier.title}
        lede={dossier.summary}
        confidentiality={dossier.confidentiality}
      />

      <section className="mx-auto max-w-3xl px-6 pt-6">
        <Link to="/insider" className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver hover:text-ink">
          ← Back to Index
        </Link>
      </section>

      {hasSim ? (
        <section className="mx-auto max-w-3xl px-6 pt-4">
          <div className="border border-border bg-muted p-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            This dossier contains simulated material. Figures are illustrative pending founder review.
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl space-y-10 px-6 py-10">
        {dossier.sections.map((s, i) => (
          <article key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                § {String(i + 1).padStart(2, "0")}
              </span>
              <TruthChip value={s.truth} />
            </div>
            <h2 className="font-serif text-2xl text-ink">{s.heading}</h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-ink/90">
              {s.body.split(/\n\s*\n/).map((p, j) => (
                <p key={j} className="max-w-[68ch]">{p}</p>
              ))}
            </div>
          </article>
        ))}
      </section>

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
