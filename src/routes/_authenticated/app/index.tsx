import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle } from "lucide-react";
import { AppShell } from "@/components/apphome/AppShell";
import { getAppHome, type AppHomeTask } from "@/lib/apphome.functions";
import { listMyRoleTags } from "@/lib/roles.functions";
import { KIMOSABE_FEED } from "@/lib/kimosabe-feed";
import { ACTIVE_ROLE_KEY, roleLabel } from "@/lib/roles";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";
import { Meta } from "@/components/briefing/Badges";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "App Home — Kimosabe" },
      {
        name: "description",
        content:
          "The universal home frame: one bar, the task toll booth, and a supported channel to Kimosabe. The roles you hold shape what this home shows you.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AppHomePage,
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function AppHomePage() {
  const fetchHome = useServerFn(getAppHome);
  const fetchRoles = useServerFn(listMyRoleTags);
  const { data, isLoading, error } = useQuery({
    queryKey: ["app-home"],
    queryFn: () => fetchHome(),
  });
  const { data: roleData } = useQuery({
    queryKey: ["my-role-tags"],
    queryFn: () => fetchRoles(),
  });

  const roles = useMemo(
    () => roleData?.roles ?? data?.roles ?? [],
    [roleData, data],
  );

  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(ACTIVE_ROLE_KEY);
    if (stored) setActiveRole(stored);
  }, []);
  useEffect(() => {
    if (!activeRole && roles.length) {
      const preferred = roles.includes("founder_admin") ? "founder_admin" : roles[0];
      setActiveRole(preferred);
      window.localStorage.setItem(ACTIVE_ROLE_KEY, preferred);
    }
  }, [activeRole, roles]);

  const switchRole = (r: string) => {
    setActiveRole(r);
    window.localStorage.setItem(ACTIVE_ROLE_KEY, r);
  };

  const tasks: AppHomeTask[] = data?.tasks ?? [];
  const visibleTasks = query
    ? tasks.filter(
        (t) =>
          (t.label + " " + t.detail).toLowerCase().includes(query.toLowerCase()),
      )
    : tasks;

  const feed = KIMOSABE_FEED.filter((item) => {
    if (query && !(item.from + " " + item.body).toLowerCase().includes(query.toLowerCase()))
      return false;
    if (!item.roleKeys) return true;
    // Certification-complete guidance only shows when it is actually true.
    if (item.id === "isr-done") return !!data?.certification?.completedAt;
    if (item.id === "isr-next")
      return !!data?.certification?.feePaid && !data?.certification?.completedAt;
    return item.roleKeys.some((k) => roles.includes(k));
  });

  return (
    <AppShell roles={roles} activeRole={activeRole} onSwitchRole={switchRole} onSearch={setQuery}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
              App Home{activeRole ? ` · ${roleLabel(activeRole)}` : ""}
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
              Your file, open.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                {PLATFORM_TOKEN} balance
              </div>
              <div className="font-serif text-2xl text-ink">
                {isLoading ? "…" : fmt(data?.balance ?? 0)}
              </div>
            </div>
            <Meta truth="FACT" confidentiality="C1" />
          </div>
        </div>

        {error ? (
          <p className="text-muted-foreground">
            Your file could not be loaded for this account.
          </p>
        ) : null}

        {/* The toll booth: every workflow's tasks stop here first. */}
        <section aria-label="Tasks" className="mb-10">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Tasks
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading tasks…</p>
          ) : visibleTasks.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {visibleTasks.map((t) => (
                <a
                  key={t.id}
                  href={t.href}
                  className="group flex gap-3 border border-border p-5 transition-colors hover:border-navy"
                >
                  {t.done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-silver group-hover:text-navy" />
                  )}
                  <span>
                    <span className="block text-sm font-medium text-ink">{t.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {t.detail}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="border border-border p-5 text-sm text-muted-foreground">
              Nothing waiting on you right now. When a workflow needs you, it stops here first.
            </p>
          )}
        </section>

        {/* The supported channel. */}
        <section aria-label="Kimosabe channel">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            The channel
          </div>
          <div className="divide-y divide-border border border-border">
            {feed.map((item) => (
              <article key={item.id} className="p-5">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-navy">
                  {item.from}
                </div>
                <p className="max-w-[68ch] text-sm leading-relaxed text-ink/85">{item.body}</p>
              </article>
            ))}
            {!feed.length ? (
              <p className="p-5 text-sm text-muted-foreground">
                Nothing in the channel matches that search.
              </p>
            ) : null}
          </div>
          <p className="mt-3 max-w-[68ch] text-xs leading-relaxed text-silver">
            This is not a community and not a feed of other people. It is your direct line to
            Kimosabe — guidance written for where you stand, watched by humans.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
