import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { AppShell } from "@/components/apphome/AppShell";
import { searchMyFile, type SearchHit } from "@/lib/search.functions";
import { getAppHome } from "@/lib/apphome.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/app/search")({
  validateSearch: z.object({ q: z.string().optional() }).parse,
  head: () => ({
    meta: [
      { title: "Search — Kimosabe" },
      {
        name: "description",
        content: "Search your own file: tasks, the Owner's Manual, and the rooms your roles open.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SearchPage,
});

function Group({ title, hits }: { title: string; hits: SearchHit[] }) {
  if (!hits.length) return null;
  return (
    <section className="mb-8">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
        {title}
      </div>
      <div className="divide-y divide-border border border-border">
        {hits.map((h) => (
          <Link key={h.id} to={h.href} className="block p-5 transition-colors hover:bg-secondary">
            <div className="text-sm font-medium text-ink">{h.title}</div>
            <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
              {h.snippet}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const runSearch = useServerFn(searchMyFile);
  const fetchHome = useServerFn(getAppHome);

  const { data: home } = useQuery({ queryKey: ["app-home"], queryFn: () => fetchHome() });
  const roles = useMemo(() => home?.roles ?? [], [home]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  useEffect(() => {
    const stored = window.localStorage.getItem(ACTIVE_ROLE_KEY);
    if (stored) setActiveRole(stored);
  }, []);

  const enabled = q.trim().length >= 2;
  const { data, isFetching } = useQuery({
    queryKey: ["app-search", q],
    queryFn: () => runSearch({ data: { q: q.trim() } }),
    enabled,
  });

  const empty =
    enabled && data && !data.tasks.length && !data.chapters.length && !data.dossiers.length && !data.people.length;

  return (
    <AppShell
      roles={roles}
      activeRole={activeRole}
      onSwitchRole={(r) => {
        setActiveRole(r);
        window.localStorage.setItem(ACTIVE_ROLE_KEY, r);
      }}
    >
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
            Search
          </div>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
            {q ? `“${q}”` : "Search your file."}
          </h1>
        </div>

        {!enabled ? (
          <p className="text-sm text-muted-foreground">
            Type at least two letters in the search field above.
          </p>
        ) : isFetching ? (
          <p className="text-sm text-muted-foreground">Searching…</p>
        ) : empty ? (
          <p className="border border-border p-5 text-sm text-muted-foreground">
            Nothing in your file matches. Search only covers what your roles let you read.
          </p>
        ) : null}

        {data ? (
          <>
            <Group title="Tasks" hits={data.tasks} />
            <Group title="Owner's Manual" hits={data.chapters} />
            <Group title="Dossiers" hits={data.dossiers} />
            <Group title="People" hits={data.people} />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
