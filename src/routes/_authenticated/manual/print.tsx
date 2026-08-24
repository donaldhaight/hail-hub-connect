import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listManualChapters, listManualGlossary } from "@/lib/manual.functions";
import { SHIELD_URL, PART_TITLES, toParagraphs, type ManualChapter } from "@/content/manual";

export const Route = createFileRoute("/_authenticated/manual/print")({
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
      { title: "Owner's Manual — Print Edition" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ManualPrint,
});

type Term = { id: string; term: string; definition: string; see_also: string | null };

function ManualPrint() {
  const loadChapters = useServerFn(listManualChapters);
  const loadGlossary = useServerFn(listManualGlossary);
  const [chapters, setChapters] = useState<ManualChapter[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  useEffect(() => {
    loadChapters()
      .then((r) => setChapters(r.chapters as ManualChapter[]))
      .catch(() => {});
    loadGlossary()
      .then((r) => setTerms(r.terms as Term[]))
      .catch(() => {});
  }, [loadChapters, loadGlossary]);

  const parts = Array.from(new Set(chapters.map((c) => c.part)));

  return (
    <div className="min-h-screen bg-background text-ink">
      <style>{`
        @page { size: letter; margin: 0.9in 0.85in; }
        @media print {
          .no-print { display: none !important; }
          .page-break { break-before: page; }
          .avoid-break { break-inside: avoid; }
          body { background: #fff; }
        }
      `}</style>

      <div className="no-print border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Link
            to="/manual"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver underline-offset-4 hover:underline"
          >
            ← Owner&rsquo;s Manual
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Cover */}
        <section className="avoid-break flex min-h-[8in] flex-col items-center justify-center border-b border-border pb-16 text-center">
          <img
            src={SHIELD_URL}
            alt="United Stakeholders of America shield"
            className="h-44 w-auto"
            width={176}
            height={176}
          />
          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-silver">
            United Stakeholders of America LLC
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight text-ink">
            The Owner&rsquo;s Manual
          </h1>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            First Pass Edition · C1 Confidential · Not an offering
          </p>
        </section>

        {/* Contents */}
        <section className="page-break pt-12">
          <h2 className="font-serif text-3xl text-ink">Contents</h2>
          <div className="mt-8 space-y-8">
            {parts.map((part) => (
              <div key={part} className="avoid-break">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                  {PART_TITLES[part] ?? part}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {chapters
                    .filter((c) => c.part === part)
                    .map((c) => (
                      <li key={c.slug} className="flex gap-4 text-[15px] text-ink/85">
                        <span className="w-8 shrink-0 font-mono text-[11px] text-silver">
                          {c.number_label ?? "—"}
                        </span>
                        <span>{c.title}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Chapters */}
        {chapters.map((c) => (
          <article key={c.slug} className="page-break pt-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
              {PART_TITLES[c.part] ?? c.part}
              {c.number_label ? ` · ${c.number_label}` : ""} · {c.truth} · {c.confidentiality}
            </div>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">{c.title}</h2>
            {c.subtitle ? (
              <p className="mt-2 text-base text-muted-foreground">{c.subtitle}</p>
            ) : null}
            <div className="mt-6 space-y-4 text-[15px] leading-[1.65] text-ink/85">
              {toParagraphs(c.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>
        ))}

        {/* Glossary */}
        <section className="page-break pt-12">
          <h2 className="font-serif text-3xl text-ink">Glossary</h2>
          <dl className="mt-6">
            {terms.map((t) => (
              <div key={t.id} className="avoid-break border-b border-border py-3 first:border-t">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
                  {t.term}
                </dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-ink/80">
                  {t.definition}
                  {t.see_also ? (
                    <span className="ml-2 text-muted-foreground">See also: {t.see_also}.</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
