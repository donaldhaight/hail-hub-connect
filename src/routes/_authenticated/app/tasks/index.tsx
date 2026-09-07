import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle } from "lucide-react";
import { AppShell } from "@/components/apphome/AppShell";
import { getAppHome, type AppHomeTask } from "@/lib/apphome.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/app/tasks/")({
  head: () => ({
    meta: [
      { title: "All tasks — Kimosabe" },
      {
        name: "description",
        content:
          "Everything waiting on you, and everything already settled. The workflow toll booth in full.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AllTasksPage,
});

function AllTasksPage() {
  const fetchHome = useServerFn(getAppHome);
  const { data, isLoading } = useQuery({
    queryKey: ["app-home"],
    queryFn: () => fetchHome(),
  });
  const [query, setQuery] = useState("");

  const roles = data?.roles ?? [];
  const activeRole =
    typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_ROLE_KEY) : null;

  const tasks: AppHomeTask[] = (data?.tasks ?? []).filter((t) =>
    query ? (t.label + " " + t.detail).toLowerCase().includes(query.toLowerCase()) : true,
  );
  const open = tasks.filter((t) => !t.done);
  const settled = tasks.filter((t) => t.done);

  return (
    <AppShell
      roles={roles}
      activeRole={activeRole}
      onSwitchRole={(r) => window.localStorage.setItem(ACTIVE_ROLE_KEY, r)}
      onSearch={setQuery}
    >
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to="/app"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver hover:text-ink"
        >
          ← App Home
        </Link>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">All tasks</h1>
        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
          Every workflow stops here before it stops anywhere else. Open a task to see what is
          being asked and why.
        </p>

        {isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading tasks…</p>
        ) : (
          <>
            <TaskGroup title="Waiting on you" tasks={open} empty="Nothing waiting on you." />
            <TaskGroup title="Settled" tasks={settled} empty="Nothing settled yet." />
          </>
        )}
      </div>
    </AppShell>
  );
}

function TaskGroup({
  title,
  tasks,
  empty,
}: {
  title: string;
  tasks: AppHomeTask[];
  empty: string;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
        {title}
      </div>
      {tasks.length ? (
        <div className="divide-y divide-border border border-border">
          {tasks.map((t) => (
            <Link
              key={t.id}
              to="/app/tasks/$taskId"
              params={{ taskId: t.id }}
              className="group flex gap-3 p-5 transition-colors hover:bg-secondary"
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
            </Link>
          ))}
        </div>
      ) : (
        <p className="border border-border p-5 text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}
