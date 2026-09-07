import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle } from "lucide-react";
import { AppShell } from "@/components/apphome/AppShell";
import { getAppHome, setAppTaskDone } from "@/lib/apphome.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/app/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task — Kimosabe" },
      {
        name: "description",
        content: "One task: what is being asked, why it is being asked, and one way to settle it.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TaskPage,
});

function TaskPage() {
  const { taskId } = Route.useParams();
  const fetchHome = useServerFn(getAppHome);
  const setDone = useServerFn(setAppTaskDone);
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["app-home"],
    queryFn: () => fetchHome(),
  });

  const mutate = useMutation({
    mutationFn: (done: boolean) => setDone({ data: { taskId, done } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app-home"] }),
  });

  const roles = data?.roles ?? [];
  const activeRole =
    typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_ROLE_KEY) : null;
  const task = data?.tasks.find((t) => t.id === taskId);

  return (
    <AppShell
      roles={roles}
      activeRole={activeRole}
      onSwitchRole={(r) => window.localStorage.setItem(ACTIVE_ROLE_KEY, r)}
      onSearch={setQuery}
    >
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          to="/app/tasks"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver hover:text-ink"
        >
          ← All tasks
        </Link>

        {isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading this task…</p>
        ) : !task ? (
          <>
            <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">
              This task is not on your list.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              It may have been settled already, or it belongs to a role you are not wearing.
            </p>
          </>
        ) : (
          <>
            <div className="mt-3 flex items-start gap-3">
              {task.done ? (
                <CheckCircle2 className="mt-2 h-5 w-5 shrink-0 text-navy" />
              ) : (
                <Circle className="mt-2 h-5 w-5 shrink-0 text-silver" />
              )}
              <h1 className="font-serif text-3xl tracking-tight text-ink">{task.label}</h1>
            </div>

            <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-ink/85">
              {task.detail}
            </p>

            <div className="mt-8 border-l-2 border-navy/40 pl-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Why this is asked
              </div>
              <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
                {task.why}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={task.href}
                className="border border-navy bg-navy px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                {task.action}
              </a>
              {task.dismissible ? (
                <button
                  type="button"
                  disabled={mutate.isPending}
                  onClick={() => mutate.mutate(!task.done)}
                  className="border border-border px-5 py-3 text-sm text-ink transition-colors hover:border-navy disabled:opacity-60"
                >
                  {task.done ? "Reopen this task" : "Mark it done"}
                </button>
              ) : (
                <span className="text-xs leading-relaxed text-silver">
                  This one settles itself when the record says so.
                </span>
              )}
            </div>
          </>
        )}
        {query ? null : null}
      </div>
    </AppShell>
  );
}
