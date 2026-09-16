import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/apphome/AppShell";
import { getMyActivity } from "@/lib/activity.functions";
import { listMyRoleTags } from "@/lib/roles.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";
import { PLATFORM_TOKEN, reasonLabel } from "@/lib/wallet.schedule";
import { Meta } from "@/components/briefing/Badges";

export const Route = createFileRoute("/_authenticated/app/activity")({
  head: () => ({
    meta: [
      { title: "Your activity — Kimosabe" },
      {
        name: "description",
        content:
          "Your own record: the wallet you hold and every line written against it, in order.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ActivityPage,
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function ActivityPage() {
  const fetchActivity = useServerFn(getMyActivity);
  const fetchRoles = useServerFn(listMyRoleTags);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-activity"],
    queryFn: () => fetchActivity(),
  });
  const { data: roleData } = useQuery({
    queryKey: ["my-role-tags"],
    queryFn: () => fetchRoles(),
  });

  const roles = roleData?.roles ?? [];
  const activeRole =
    typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_ROLE_KEY) : null;

  const entries = (data?.entries ?? []).filter((e) =>
    query ? (reasonLabel(e.reason) + " " + e.memo).toLowerCase().includes(query.toLowerCase()) : true,
  );

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
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-3xl tracking-tight text-ink">Your activity</h1>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              {PLATFORM_TOKEN} balance
            </div>
            <div className="font-serif text-2xl text-ink">
              {isLoading ? "…" : fmt(data?.balance ?? 0)}
            </div>
          </div>
        </div>
        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
          Your own lines only — nothing here is an aggregate and nothing here belongs to
          anyone else. The ledger is append-only: entries are added, never edited or removed.
          {data?.claimedAt
            ? ` Your file was claimed on ${new Date(data.claimedAt).toLocaleDateString()}.`
            : ""}
        </p>

        <div className="mt-8 overflow-x-auto border border-border p-5">
          <table className="w-full min-w-[30rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Reason</th>
                <th className="py-2 pr-4">Token</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4 font-mono text-[11px] text-silver">
                    {new Date(e.occurred_at).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-ink">
                    {reasonLabel(e.reason)}
                    {e.memo ? (
                      <div className="mt-1 max-w-[42ch] text-xs text-muted-foreground">
                        {e.memo}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-silver">{e.token_code}</td>
                  <td className="py-3 text-right font-mono text-ink">
                    {e.direction === "credit" ? "+" : "−"}
                    {fmt(e.amount)}
                  </td>
                </tr>
              ))}
              {!entries.length ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    {isLoading ? "Loading…" : "No entries yet."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Meta truth="FACT" confidentiality="C1" status="Your own rows only" />
        </div>
      </div>
    </AppShell>
  );
}
