import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";
import {
  declineRequest,
  grantRoleToRequest,
  grantSeedTokens,
  listRoleCatalog,
  listRoleRequests,
  type RoleRequestRow,
} from "@/lib/roles.functions";
import { roleLabel } from "@/lib/roles";
import type { RoleCatalogRow } from "@/lib/roles";
import { askLabel } from "@/lib/briefing.schemas";

export const Route = createFileRoute("/_authenticated/admin/queue")({
  head: () =>
    routeHead({
      title: "The Request Queue — Founder Console",
      description:
        "One row per human. Who asked, what they arrived with, what has happened to them, and the single control that accepts them.",
      path: "/admin/queue",
    }),
  component: RequestQueue,
});

type Filter = "open" | "accepted" | "declined" | "all";

function RequestQueue() {
  const load = useServerFn(listRoleRequests);
  const catalog = useServerFn(listRoleCatalog);
  const grant = useServerFn(grantRoleToRequest);
  const decline = useServerFn(declineRequest);

  const [rows, setRows] = useState<RoleRequestRow[]>([]);
  const [roles, setRoles] = useState<RoleCatalogRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("open");
  const [search, setSearch] = useState("");

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

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "open" && (r.granted_role || r.status === "declined")) return false;
      if (filter === "accepted" && !r.granted_role) return false;
      if (filter === "declined" && r.status !== "declined") return false;
      if (!q) return true;
      return `${r.name} ${r.email} ${r.organization} ${r.title}`.toLowerCase().includes(q);
    });
  }, [rows, filter, search]);

  async function doGrant(requestId: string, roleKey: string, invite: boolean) {
    if (!roleKey) return;
    setBusy(requestId);
    setNotice(null);
    try {
      const res = await grant({ data: { requestId, roleKey, invite } });
      setNotice(
        res.appliedNow
          ? "Group set and applied to their account."
          : res.invited
            ? "Accepted. Their group is set and the invitation is on its way."
            : "Group set. It applies when they redeem their invitation.",
      );
      refresh();
    } catch {
      setNotice("The grant could not be recorded.");
    } finally {
      setBusy(null);
    }
  }

  async function doDecline(requestId: string) {
    setBusy(requestId);
    setNotice(null);
    try {
      await decline({ data: { requestId } });
      setNotice("Declined. The decision is recorded; nothing else happens to them.");
      refresh();
    } catch {
      setNotice("The decline could not be recorded.");
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(
    () => ({
      open: rows.filter((r) => !r.granted_role && r.status !== "declined").length,
      accepted: rows.filter((r) => !!r.granted_role).length,
      declined: rows.filter((r) => r.status === "declined").length,
      all: rows.length,
    }),
    [rows],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console · The queue"
        title="Nobody gets through that you do not vet."
        lede="One row per human. What they asked for, the anonymous file they arrived with, what has already happened to them — and one control that sets their group and opens the door together."
        truth="DECISION"
        confidentiality="C3"
        status={`${counts.open} waiting`}
      />

      <Section number="01" title="Requests">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {(["open", "accepted", "declined", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                filter === f
                  ? "border-navy bg-navy text-background"
                  : "border-border text-silver hover:border-navy hover:text-ink"
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, organization"
            className="ml-auto min-w-[16rem] border border-border bg-card px-3 py-1.5 text-sm text-ink placeholder:text-silver focus:border-navy focus:outline-none"
          />
        </div>

        {notice ? (
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
            {notice}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[60rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                <th className="py-2 pr-4">Who</th>
                <th className="py-2 pr-4">Asked for</th>
                <th className="py-2 pr-4">Arrived with</th>
                <th className="py-2 pr-4">Standing</th>
                <th className="py-2">Decision</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-b border-border/60 align-top">
                  <td className="py-3 pr-4">
                    <div className="text-ink">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                    <div className="text-xs text-silver">
                      {r.organization} · {r.title}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink">
                    {askLabel(r.interest)}
                    {r.context ? (
                      <div className="mt-1 max-w-[28ch] text-xs text-silver">{r.context}</div>
                    ) : null}
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
                    <Standing row={r} />
                  </td>
                  <td className="py-3">
                    <GrantControl
                      roles={roles}
                      preset={r.granted_role ?? r.requested_role}
                      disabled={busy === r.id}
                      onGrant={(key, invite) => doGrant(r.id, key, invite)}
                      onDecline={() => doDecline(r.id)}
                    />
                  </td>
                </tr>
              ))}
              {!visible.length ? (
                <tr>
                  <td colSpan={5} className="py-6 text-muted-foreground">
                    Nothing here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Seats, itinerary, referrals, and outstanding invitations live in the{" "}
          <Link to="/admin/inbox" className="text-navy underline">
            founder inbox
          </Link>
          .
        </p>
      </Section>

      <Section number="02" title="Seed a MarketApp wallet">
        <SeedGrant />
      </Section>
    </PageShell>
  );
}

function Standing({ row }: { row: RoleRequestRow }) {
  const bits: string[] = [];
  if (row.granted_role) bits.push(roleLabel(row.granted_role));
  if (row.redeemed_at) bits.push("redeemed");
  else if (row.invited_at) bits.push("invited");
  if (row.seat_status) bits.push(`seat: ${row.seat_status}`);
  if (row.status === "declined") bits.push("declined");
  if (!bits.length) return <span className="text-silver">waiting</span>;
  return (
    <span>
      {bits.map((b) => (
        <span key={b} className="block">
          {b}
        </span>
      ))}
    </span>
  );
}

function GrantControl({
  roles,
  preset,
  disabled,
  onGrant,
  onDecline,
}: {
  roles: RoleCatalogRow[];
  preset: string | null;
  disabled: boolean;
  onGrant: (key: string, invite: boolean) => void;
  onDecline: () => void;
}) {
  const [key, setKey] = useState(preset ?? "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={key}
        onChange={(e) => setKey(e.target.value)}
        aria-label="Group to assign"
        className="border border-border bg-card px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-navy"
      >
        <option value="">Choose group…</option>
        {roles.map((r) => (
          <option key={r.key} value={r.key}>
            {r.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={disabled || !key}
        onClick={() => onGrant(key, true)}
        className="border border-navy bg-navy px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Accept &amp; invite
      </button>
      <button
        type="button"
        disabled={disabled || !key}
        onClick={() => onGrant(key, false)}
        className="border border-ink px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background disabled:opacity-40"
      >
        Set group only
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onDecline}
        className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-silver transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40"
      >
        Decline
      </button>
    </div>
  );
}

function SeedGrant() {
  const seed = useServerFn(grantSeedTokens);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(500);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      await seed({ data: { email, amount } });
      setMsg(`Seeded ${amount} JBK to ${email}. The entry is permanent.`);
    } catch {
      setMsg("The seed grant could not be posted.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-muted-foreground">
        A certification fee has to come from somewhere. Seeding credits a signed-in
        person's MarketApp wallet with a permanent, append-only ledger entry.
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="person@example.com"
          className="min-w-[16rem] flex-1 border border-border bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-navy"
        />
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-28 border border-border bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-navy"
        />
        <button
          type="button"
          disabled={busy || !email}
          onClick={submit}
          className="border border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background disabled:opacity-40"
        >
          Seed JBK
        </button>
      </div>
      {msg ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver">{msg}</p>
      ) : null}
    </div>
  );
}
