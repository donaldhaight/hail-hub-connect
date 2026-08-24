import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/briefing/PageShell";
import {
  TruthChip,
  ConfidentialityChip,
  type TruthClass,
  type ConfidentialityClass,
} from "@/components/briefing/Badges";
import { listManualChapters, listManualGlossary } from "@/lib/manual.functions";
import { SHIELD_URL, PART_TITLES, type ManualChapter } from "@/content/manual";

export const Route = createFileRoute("/_authenticated/manual/")({
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
  component: ManualIndex,
});

function ManualIndex() {
  const loadChapters = useServerFn(listManualChapters);
  const loadGlossary = useServerFn(listManualGlossary);
  const [chapters, setChapters] = useState<ManualChapter[]>([]);
  const [terms, setTerms] = useState<
    Array<{ id: string; term: string; definition: string; see_also: string | null }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChapters()
      .then((r) => setChapters(r.chapters as ManualChapter[]))
      .catch(() => setError("Could not load the manual."));
    loadGlossary()
      .then((r) => setTerms(r.terms as typeof terms))
      .catch(() => {});
  }, [loadChapters, loadGlossary]);

  const parts = Array.from(new Set(chapters.map((c) => c.part)));

  return (
    <PageShell>
      {/* Cover */}
      <section className="border-b border-border bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center md:py-28">
          <img
            src={SHIELD_URL}
            alt="United Stakeholders of America shield"
            className="h-40 w-auto md:h-52"
            width={208}
            height={208}
          />
          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50">
            United Stakeholders of America LLC
          </div>
          <h1 className="mt-5 max-w-[16ch] font-serif text-5xl leading-[1.02] tracking-tight text-balance md:text-7xl">
            The Owner&rsquo;s Manual
          </h1>
          <p className="mt-6 max-w-[52ch] text-pretty text-base leading-relaxed text-paper/70">
            The constitution, the seven groups, the convening, and the working
            instructions for everything behind this login.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50">
            <span className="border border-paper/25 px-2 py-1">First Pass Edition</span>
            <span className="border border-paper/25 px-2 py-1">C1 · Confidential</span>
            <span className="border border-paper/25 px-2 py-1">Not an offering</span>
          </div>
          <div className="mt-10">
            <Link
              to="/manual/print"
              className="border border-paper/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Print edition
            </Link>
          </div>
        </div>
      </section>

      {/* Table of contents */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
          Table of contents
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {chapters.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">Loading&hellip;</p>
        ) : null}

        <div className="space-y-14">
          {parts.map((part) => (
            <div key={part} className="grid gap-8 md:grid-cols-12">
              <aside className="md:col-span-4">
                <h2 className="font-serif text-2xl leading-tight text-ink md:text-3xl">
                  {PART_TITLES[part] ?? part}
                </h2>
              </aside>
              <ol className="md:col-span-8">
                {chapters
                  .filter((c) => c.part === part)
                  .map((c) => (
                    <li key={c.slug} className="border-b border-border first:border-t">
                      <Link
                        to="/manual/$slug"
                        params={{ slug: c.slug }}
                        className="group flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-6"
                      >
                        <span className="w-10 shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-silver">
                          {c.number_label ?? "—"}
                        </span>
                        <span className="flex-1">
                          <span className="block font-serif text-lg text-ink underline-offset-4 group-hover:underline">
                            {c.title}
                          </span>
                          {c.subtitle ? (
                            <span className="mt-1 block text-sm text-muted-foreground">
                              {c.subtitle}
                            </span>
                          ) : null}
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <TruthChip value={c.truth as TruthClass} />
                          <ConfidentialityChip value={c.confidentiality as ConfidentialityClass} />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-12 md:py-20">
          <aside className="md:col-span-4">
            <h2 className="font-serif text-2xl leading-tight text-ink md:text-3xl">Glossary</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {terms.length} terms. Read this before Part II.
            </p>
          </aside>
          <dl className="md:col-span-8">
            {terms.map((t) => (
              <div key={t.id} className="border-b border-border py-4 first:border-t">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink">
                  {t.term}
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/80">
                  {t.definition}
                  {t.see_also ? (
                    <span className="ml-2 text-muted-foreground">See also: {t.see_also}.</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
