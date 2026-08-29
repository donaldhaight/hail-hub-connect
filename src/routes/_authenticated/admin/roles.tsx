import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";
import {
  grantRoleToRequest,
  grantSeedTokens,
  listRoleRequests,
  type RoleRequestRow,
} from "@/lib/roles.functions";

import { listRoleCatalog } from "@/lib/roles.functions";
import { roleLabel } from "@/lib/roles";
import type { RoleCatalogRow } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  head: () =>
    routeHead({
      title: "Role Grants — Founder Console",
      description: "The access queue. Every role in the Human Blockchain is granted here, by one person.",
      path: "/admin/roles",
    }),
  component: AdminRoles,
});

function AdminRoles() {
  const load = useServerFn(listRoleRequests);
  const catalog = useServerFn(listRoleCatalog);
  const grant = useServerFn(grantRoleToRequest);

  const [rows, setRows] = useState<RoleRequestRow[]>([]);
  const [roles, setRoles] = useState<RoleCatalogRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(() => {
    load()
      .then((r) => setRows(r.rows as RoleRequestRow[]))
      .catch(() => setNotice("The queue could not be loaded."));
  }, [load]);

  useEffect(() => {
    refresh();
    catalog()
      .then((c) => setRoles((c.roles as RoleCatalogRow[]).filter((r) => r.requestable)))
      .catch(() => undefined);
  }, [refresh, catalog]);

  async function doGrant(requestId: string, roleKey: string) {
    if (!roleKey) return;
    setBusy(requestId);
    setNotice(null);
    try {
      const res = await grant({ data: { requestId, roleKey } });
      setNotice(res.appliedNow ? "Role granted and applied to their account." : "Role granted. It applies when they redeem their invitation.");
      refresh();
    } catch {
      setNotice("The grant could not be recorded.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console · Roles"
        title="Nobody gets through that you do not vet."
        lede="Every access request, the role they asked for, and the Interested User file they arrived with. Granting a role writes it to their account — or waits at their invitation."
        truth="DECISION"
        confidentiality="C3"
        status={`${rows.length} requests`}
      />

      <Section number="01" title="The queue">
        {notice ? (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
            {notice}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                <th className="py-2 pr-4">Who</th>
                <th className="py-2 pr-4">Requested</th>
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Granted</th>
                <th className="py-2">Grant</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    <div className="text-ink">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                    <div className="text-xs text-silver">
                      {r.organization} · {r.title}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink">
                    {r.requested_role ? roleLabel(r.requested_role) : "—"}
                    <div className="text-xs text-silver">{r.interest}</div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-silver">
                    {r.anchor ? (
                      <>
                        {r.anchor.slice(0, 8)}
                        <div>{r.wallet_jbk ?? 0} JBK</div>
                      </>
                    ) : (
                      "no anchor"
                    )}
                  </td>
                  <td className="py-3 pr-4 font-mono text-[11px] text-ink">
                    {r.granted_role ? roleLabel(r.granted_role) : "—"}
                  </td>
                  <td className="py-3">
                    <GrantControl
                      roles={roles}
                      preset={r.requested_role}
                      disabled={busy === r.id}
                      onGrant={(key) => doGrant(r.id, key)}
                    />
                  </td>
                </tr>
              ))}
              {!rows.length ? (
                <tr>
                  <td colSpan={5} className="py-6 text-muted-foreground">
                    The queue is empty.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>
    </PageShell>
  );
}

function GrantControl({
  roles,
  preset,
  disabled,
  onGrant,
}: {
  roles: RoleCatalogRow[];
  preset: string | null;
  disabled: boolean;
  onGrant: (key: string) => void;
}) {
  const [key, setKey] = useState(preset ?? "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={key}
        onChange={(e) => setKey(e.target.value)}
        aria-label="Role to grant"
        className="border border-border bg-card px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-navy"
      >
        <option value="">Choose role…</option>
        {roles.map((r) => (
          <option key={r.key} value={r.key}>
            {r.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={disabled || !key}
        onClick={() => onGrant(key)}
        className="border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background disabled:opacity-40"
      >
        Grant
      </button>
    </div>
  );
}
