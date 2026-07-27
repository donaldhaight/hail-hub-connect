import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  listBriefingRequests,
  listConferenceApplications,
  updateBriefingStatus,
  updateConferenceStatus,
  updateBriefingNotes,
  updateConferenceNotes,
  getMyRoles,
} from "@/lib/inbox.functions";
import {
  getConferenceCapacitySummary,
  updateConferenceSeat,
  promoteFromWaitlist,
  listConferenceAttendees,
} from "@/lib/conference.functions";
import {
  grantInsiderAccess,
  getInvitationForRequest,
  grantInsiderAccessFromConference,
  getInvitationForConference,
  inviteInsiderDirect,
  listInvitations,
  revokeInvitation,
  resendInvitation,
} from "@/lib/insider.functions";
import { listInsiderActivity, listRecentDossierMessages } from "@/lib/dossier.functions";
import {
  listItineraryItems,
  upsertItineraryItem,
  deleteItineraryItem,
} from "@/lib/itinerary.functions";
import {
  listReferrals,
  updateReferralStatus,
  approveReferralAndInvite,
} from "@/lib/referrals.functions";
import { DOSSIERS_BY_SLUG } from "@/content/dossiers";
import {
  BRIEFING_STATUSES,
  CONFERENCE_STATUSES,
  type BriefingStatus,
  type ConferenceStatus,
} from "@/lib/inbox.schemas";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  head: () => ({
    meta: [
      { title: "Founder Inbox — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Inbox,
});

type Row = Record<string, any>;

function Inbox() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"briefings" | "conference" | "activity" | "discussion" | "invitations" | "itinerary" | "referrals">("briefings");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const rowsRef = useRef<Row[]>(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  const [selected, setSelected] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [capacity, setCapacity] = useState({ total: 300, confirmed: 0, waitlisted: 0, available: 300 });

  const listBriefings = useServerFn(listBriefingRequests);
  const listConf = useServerFn(listConferenceApplications);
  const updBrief = useServerFn(updateBriefingStatus);
  const updConf = useServerFn(updateConferenceStatus);
  const updNotes = useServerFn(updateBriefingNotes);
  const updConfNotes = useServerFn(updateConferenceNotes);
  const myRoles = useServerFn(getMyRoles);
  const grant = useServerFn(grantInsiderAccess);
  const getInv = useServerFn(getInvitationForRequest);
  const grantConf = useServerFn(grantInsiderAccessFromConference);
  const getInvConf = useServerFn(getInvitationForConference);
  const listActivity = useServerFn(listInsiderActivity);
  const listDiscussion = useServerFn(listRecentDossierMessages);
  const listInv = useServerFn(listInvitations);
  const revokeInv = useServerFn(revokeInvitation);
  const resendInv = useServerFn(resendInvitation);
  const inviteDirect = useServerFn(inviteInsiderDirect);
  const loadCapacity = useServerFn(getConferenceCapacitySummary);
  const updateSeat = useServerFn(updateConferenceSeat);
  const promoteSeat = useServerFn(promoteFromWaitlist);
  const loadAttendees = useServerFn(listConferenceAttendees);
  const listRefs = useServerFn(listReferrals);
  const updRef = useServerFn(updateReferralStatus);
  const approveRef = useServerFn(approveReferralAndInvite);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  const statuses = tab === "briefings" ? BRIEFING_STATUSES : tab === "conference" ? CONFERENCE_STATUSES : [];

  async function load() {
    setLoading(true);
    setError(null);
    try {
      if (tab === "itinerary") {
        setRows([]);
      } else if (tab === "activity") {
        const r = await listActivity();
        setRows(r.rows);
      } else if (tab === "discussion") {
        const r = await listDiscussion();
        setRows(r.rows);
      } else if (tab === "invitations") {
        const r = await listInv({ data: { status: (status as any) || "", source: "", search: search || "" } });
        setRows(r.rows);
      } else {
        const fn = tab === "briefings" ? listBriefings : listConf;
        const r = await fn({ data: { status: status || undefined, search: search || undefined } });
        setRows(r.rows);
      }
      if (tab === "conference") {
        const cap = await loadCapacity();
        setCapacity(cap);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorized) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, tab, status]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const csv = useMemo(() => rowsToCsv(rows), [rows]);

  if (authorized === null) {
    return <PageShell><div className="p-16 text-center text-silver">Loading…</div></PageShell>;
  }
  if (!authorized) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede="Your account does not have founder admin access." confidentiality="C2" />
        <div className="mx-auto max-w-md px-6 py-8">
          <button onClick={signOut} className="border border-ink px-4 py-2 text-sm">Sign out</button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Inbox"
        title="Review private requests."
        lede="All submissions from the front door. Approvals are recorded to the audit log; applicant emails route through Lovable email once the sender domain is verified."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 border border-border">
            <TabBtn active={tab === "briefings"} onClick={() => { setTab("briefings"); setStatus(""); setSelected(null); }}>
              Briefing Requests
            </TabBtn>
            <TabBtn active={tab === "conference"} onClick={() => { setTab("conference"); setStatus(""); setSelected(null); }}>
              PrepareAmerica Applications
            </TabBtn>
            <TabBtn active={tab === "invitations"} onClick={() => { setTab("invitations"); setStatus(""); setSelected(null); }}>
              Invitations
            </TabBtn>
            <TabBtn active={tab === "activity"} onClick={() => { setTab("activity"); setStatus(""); setSelected(null); }}>
              Insider Activity
            </TabBtn>
            <TabBtn active={tab === "discussion"} onClick={() => { setTab("discussion"); setStatus(""); setSelected(null); }}>
              Discussion
            </TabBtn>
            <TabBtn active={tab === "itinerary"} onClick={() => { setTab("itinerary"); setStatus(""); setSelected(null); }}>
              Itinerary
            </TabBtn>
            <TabBtn active={tab === "referrals"} onClick={() => { setTab("referrals"); setStatus(""); setSelected(null); }}>
              Referrals
            </TabBtn>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInviteOpen(true)}
              className="border border-ink bg-ink px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy"
            >
              Invite insider directly
            </button>
            <a href="/admin/signals" className="text-xs text-muted-foreground hover:text-ink">Signals →</a>
            <button onClick={signOut} className="text-xs text-silver hover:text-ink">Sign out</button>
          </div>
        </div>

        {tab === "conference" ? (
          <div className="mb-4 border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Capacity</div>
                <div className="mt-1 text-sm text-ink">
                  {capacity.confirmed} of {capacity.total} seats confirmed
                  {capacity.waitlisted > 0 ? ` · ${capacity.waitlisted} waitlisted` : ""}
                  {capacity.available > 0 ? ` · ${capacity.available} available` : " · sold out"}
                </div>
              </div>
              <div className="flex flex-1 min-w-[200px] max-w-md items-center gap-3">
                <div className="h-2 flex-1 bg-muted">
                  <div
                    className="h-2 bg-navy transition-all"
                    style={{ width: `${Math.min(100, (capacity.confirmed / capacity.total) * 100)}%` }}
                  />
                </div>
                <button
                  onClick={async () => {
                    const r = await loadAttendees();
                    const csv = attendeesToCsv(r.rows);
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `prepare-america-attendees-${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="shrink-0 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
                >
                  Export attendees
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "briefings" || tab === "conference" ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatus("")}
              className={`border px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] ${status === "" ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"}`}
            >
              All
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`border px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] ${status === s ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"}`}
              >
                {s}
              </button>
            ))}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Search name, email, org…"
              className="ml-2 flex-1 min-w-[200px] border border-border bg-paper px-3 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            />
            <button onClick={load} className="border border-ink px-3 py-1.5 text-xs font-medium">Search</button>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
              download={`${tab}-${new Date().toISOString().slice(0, 10)}.csv`}
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Export CSV
            </a>
          </div>
        ) : tab === "activity" ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Every dossier open by every insider, most recent first.
            </div>
            <a
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(activityCsv(rows))}`}
              download={`insider-activity-${new Date().toISOString().slice(0, 10)}.csv`}
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Export CSV
            </a>
          </div>
        ) : tab === "discussion" ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Cross-dossier insider Q&amp;A feed, most recent first. Click through to reply in-context.
            </div>
          </div>
        ) : tab === "itinerary" ? (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Working itinerary for PrepareAmerica 2026. Published rows appear on every confirmed attendee's private page immediately.
            </div>
          </div>
        ) : (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["", "pending", "redeemed", "expired", "revoked"] as const).map((s) => (
              <button
                key={s || "all"}
                onClick={() => setStatus(s)}
                className={`border px-3 py-1 text-xs font-mono uppercase tracking-[0.14em] ${status === s ? "border-ink bg-ink text-paper" : "border-border text-muted-foreground"}`}
              >
                {s || "All"}
              </button>
            ))}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Search email, name, org…"
              className="ml-2 flex-1 min-w-[200px] border border-border bg-paper px-3 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            />
            <button onClick={load} className="border border-ink px-3 py-1.5 text-xs font-medium">Search</button>
          </div>
        )}


        {error ? <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div> : null}

        {tab === "activity" ? (
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                <tr>
                  <th className="p-3">Opened</th>
                  <th className="p-3">Insider</th>
                  <th className="p-3">Dossier</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="p-6 text-center text-silver">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={3} className="p-6 text-center text-silver">No opens yet.</td></tr>
                ) : rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-3 text-xs text-muted-foreground font-mono">{new Date(r.opened_at).toLocaleString()}</td>
                    <td className="p-3 text-ink">{r.email}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {DOSSIERS_BY_SLUG[r.dossier_slug]?.title ?? r.dossier_slug}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === "discussion" ? (
          <div className="border border-border">
            <ul className="divide-y divide-border">
              {loading ? (
                <li className="p-6 text-center text-silver">Loading…</li>
              ) : rows.length === 0 ? (
                <li className="p-6 text-center text-silver">No insider messages yet.</li>
              ) : rows.map((r) => {
                const dossier = DOSSIERS_BY_SLUG[r.dossier_slug];
                return (
                  <li key={r.id} className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                          r.author_is_founder
                            ? "border-ink/30 bg-ink text-paper"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {r.author_is_founder ? "Founder" : r.email}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
                        {dossier?.title ?? r.dossier_slug}
                      </span>
                      {r.section_heading ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                          § {r.section_heading}
                        </span>
                      ) : null}
                      <span className="ml-auto font-mono text-[10px] text-silver">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink/90">{r.body}</p>
                    <div className="mt-2">
                      <a
                        href={`/insider/dossier/${r.dossier_slug}`}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy hover:underline"
                      >
                        Open dossier →
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : tab === "invitations" ? (
          <InvitationsTable
            rows={rows}
            loading={loading}
            onRevoke={async (id) => { await revokeInv({ data: { id } }); await load(); }}
            onResend={async (id) => { await resendInv({ data: { id } }); await load(); }}
          />
        ) : tab === "itinerary" ? (
          <ItineraryEditor />
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">{tab === "conference" ? "Category" : "Interest"}</th>
                    {tab === "conference" ? <th className="p-3">Seats</th> : null}
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={tab === "conference" ? 6 : 5} className="p-6 text-center text-silver">Loading…</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={tab === "conference" ? 6 : 5} className="p-6 text-center text-silver">No records.</td></tr>
                  ) : rows.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={`cursor-pointer border-t border-border hover:bg-muted/50 ${selected?.id === r.id ? "bg-muted/70" : ""}`}
                    >
                      <td className="p-3 text-xs text-muted-foreground font-mono">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-ink">{r.name}</td>
                      <td className="p-3 text-muted-foreground">{r.organization}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.interest}</td>
                      {tab === "conference" ? (
                        <td className="p-3 text-xs font-mono text-muted-foreground">
                          {1 + (r.plus_ones ?? 0)}
                        </td>
                      ) : null}
                      <td className="p-3 text-xs font-mono uppercase">{r.seat_status ?? r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                tab === "conference" ? (
                  <ConferenceDetailPanel
                    key={selected.id}
                    row={selected}
                    capacity={capacity}
                    onChanged={async () => {
                      await load();
                      const fresh = rowsRef.current.find((r) => r.id === selected.id);
                      if (fresh) setSelected(fresh);
                    }}
                    onApproveAndInvite={async () => {
                      const r = await grantConf({ data: { conferenceApplicationId: selected.id } });
                      await load();
                      setSelected((cur) => (cur ? { ...cur, status: r.seatStatus, seat_status: r.seatStatus } : cur));
                      return r;
                    }}
                    loadInvitation={() => getInvConf({ data: { conferenceApplicationId: selected.id } })}
                    updateSeat={async (payload) => {
                      const r = await updateSeat({ data: payload });
                      await load();
                      setSelected((cur) => (cur ? { ...cur, seat_status: r.seatStatus, status: r.seatStatus, confirmed_at: r.confirmedAt } : cur));
                    }}
                    promote={async (note) => {
                      const r = await promoteSeat({ data: { id: selected.id, note } });
                      await load();
                      setSelected((cur) => (cur ? { ...cur, seat_status: "confirmed", status: "confirmed", confirmed_at: r.confirmedAt } : cur));
                    }}
                    saveNotes={async (note) => {
                      await updConfNotes({ data: { id: selected.id, note } });
                      setSelected((cur) => (cur ? { ...cur, internal_notes: note } : cur));
                    }}
                  />
                ) : (
                  <DetailPanel
                    key={selected.id}
                    row={selected}
                    tab={tab as "briefings"}
                    onSaveStatus={async (s, note) => {
                      await updBrief({ data: { id: selected.id, status: s as BriefingStatus, note } });
                      await load();
                      setSelected((cur) => (cur ? { ...cur, status: s } : cur));
                    }}
                    onSaveNotes={async (note) => {
                      await updNotes({ data: { id: selected.id, note } });
                      setSelected((cur) => (cur ? { ...cur, internal_notes: note } : cur));
                    }}
                    onApproveAndInvite={async () => {
                      const r = await grant({ data: { briefingRequestId: selected.id } });
                      await load();
                      setSelected((cur) => (cur ? { ...cur, status: "approved" } : cur));
                      return r;
                    }}
                    loadInvitation={() => getInv({ data: { briefingRequestId: selected.id } })}
                  />
                )
              ) : (
                <div className="border border-dashed border-border p-8 text-center text-sm text-silver">
                  Select a row to review.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      {inviteOpen ? (
        <DirectInviteModal
          onClose={() => setInviteOpen(false)}
          onSubmit={async (payload) => {
            await inviteDirect({ data: payload });
            setInviteOpen(false);
            if (tab === "invitations") await load();
          }}
        />
      ) : null}
    </PageShell>
  );
}

function InvitationsTable({
  rows,
  loading,
  onRevoke,
  onResend,
}: {
  rows: Row[];
  loading: boolean;
  onRevoke: (id: string) => Promise<void>;
  onResend: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function doAction(id: string, label: string, fn: () => Promise<void>) {
    setBusy(`${id}:${label}`);
    try { await fn(); } finally { setBusy(null); }
  }

  function copyLink(id: string, token: string) {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/insider/accept?token=${token}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    }
  }

  return (
    <div className="border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
          <tr>
            <th className="p-3">Created</th>
            <th className="p-3">Recipient</th>
            <th className="p-3">Lane</th>
            <th className="p-3">Status</th>
            <th className="p-3">Expires</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="p-6 text-center text-silver">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={6} className="p-6 text-center text-silver">No invitations match.</td></tr>
          ) : rows.map((r) => {
            const eff = r.effective_status as string;
            const canRevoke = eff === "pending";
            const canResend = !r.redeemed_at;
            return (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="p-3 text-xs text-muted-foreground font-mono">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="text-ink">{r.full_name ?? r.email}</div>
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                  {r.organization ? (
                    <div className="text-xs text-silver">{r.organization}</div>
                  ) : null}
                  {r.redeemed_by_email && r.redeemed_by_email !== r.email ? (
                    <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                      redeemed by {r.redeemed_by_email}
                    </div>
                  ) : null}
                </td>
                <td className="p-3 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                  {r.source}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                      eff === "pending"  ? "border-navy/40 bg-navy/5 text-navy"
                    : eff === "redeemed" ? "border-emerald-600/40 bg-emerald-50 text-emerald-700"
                    : eff === "expired"  ? "border-amber-600/40 bg-amber-50 text-amber-700"
                    :                      "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {eff}
                  </span>
                  {r.redeemed_at ? (
                    <div className="mt-1 text-[10px] text-silver font-mono">
                      {new Date(r.redeemed_at).toLocaleDateString()}
                    </div>
                  ) : null}
                </td>
                <td className="p-3 text-xs text-muted-foreground font-mono">
                  {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {canRevoke ? (
                      <button
                        onClick={() => copyLink(r.id, r.token)}
                        className="border border-border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:border-navy hover:text-navy"
                      >
                        {copiedId === r.id ? "Copied" : "Copy link"}
                      </button>
                    ) : null}
                    {canResend ? (
                      <button
                        disabled={busy === `${r.id}:resend`}
                        onClick={() => doAction(r.id, "resend", () => onResend(r.id))}
                        className="border border-ink px-2 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-ink hover:bg-ink hover:text-paper disabled:opacity-50"
                      >
                        {busy === `${r.id}:resend` ? "…" : "Resend"}
                      </button>
                    ) : null}
                    {canRevoke ? (
                      <button
                        disabled={busy === `${r.id}:revoke`}
                        onClick={() => doAction(r.id, "revoke", () => onRevoke(r.id))}
                        className="border border-destructive/40 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-destructive hover:bg-destructive hover:text-paper disabled:opacity-50"
                      >
                        {busy === `${r.id}:revoke` ? "…" : "Revoke"}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DirectInviteModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: { email: string; fullName: string; organization: string; roleCategory: string; internalNote: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [roleCategory, setRoleCategory] = useState("Executive");
  const [internalNote, setInternalNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      await onSubmit({ email: email.trim(), fullName: fullName.trim(), organization: organization.trim(), roleCategory, internalNote: internalNote.trim() });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to invite");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg space-y-4 border border-border bg-paper p-6"
      >
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Direct invitation</div>
          <h2 className="mt-1 font-serif text-2xl text-ink">Invite an insider.</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Bypass the public form. Creates a single-use token valid for 30 days. Applicant email will send once the sender domain is verified.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Full name</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none" />
          </label>
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none" />
          </label>
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Organization</span>
            <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none" />
          </label>
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Role category</span>
            <select value={roleCategory} onChange={(e) => setRoleCategory(e.target.value)} className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none">
              {["Executive", "Investor", "Contractor", "Government", "Counsel", "Advisor", "Other"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Internal note (private)</span>
          <textarea value={internalNote} onChange={(e) => setInternalNote(e.target.value)} rows={3} className="mt-1 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none" />
        </label>
        {err ? <div className="border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{err}</div> : null}
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="text-xs text-silver hover:text-ink">Cancel</button>
          <button type="submit" disabled={busy} className="border border-ink bg-ink px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-50">
            {busy ? "Sending…" : "Issue invitation"}
          </button>
        </div>
      </form>
    </div>
  );
}


function activityCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const cols = ["opened_at", "email", "dossier_slug"];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}





function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm ${active ? "bg-ink text-paper" : "bg-paper text-muted-foreground hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

function DetailPanel({
  row,
  tab,
  onSaveStatus,
  onSaveNotes,
  onApproveAndInvite,
  loadInvitation,
}: {
  row: Row;
  tab: "briefings" | "conference";
  onSaveStatus: (s: string, note?: string) => Promise<void>;
  onSaveNotes: (note: string) => Promise<void>;
  onApproveAndInvite?: () => Promise<{ token: string; expiresAt: string }>;
  loadInvitation?: () => Promise<{ invitation: Row | null }>;
}) {
  const [notes, setNotes] = useState<string>(row.internal_notes ?? "");
  const [actionNote, setActionNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Row | null>(null);
  const [copied, setCopied] = useState(false);
  const statuses = tab === "briefings" ? BRIEFING_STATUSES : CONFERENCE_STATUSES;

  useEffect(() => {
    if (!loadInvitation) return;
    loadInvitation().then((r) => setInvitation(r.invitation)).catch(() => {});
  }, [loadInvitation, row.id]);

  async function doStatus(s: string) {
    setBusy(s);
    try { await onSaveStatus(s, actionNote || undefined); setActionNote(""); }
    finally { setBusy(null); }
  }

  async function doApproveAndInvite() {
    if (!onApproveAndInvite) return;
    setBusy("invite");
    try {
      await onApproveAndInvite();
      if (loadInvitation) {
        const r = await loadInvitation();
        setInvitation(r.invitation);
      }
    } finally {
      setBusy(null);
    }
  }

  const inviteUrl = invitation
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/insider/accept?token=${invitation.token}`
    : null;

  return (
    <div className="space-y-4 border border-border bg-card p-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Contact</div>
        <div className="mt-1 font-serif text-xl text-ink">{row.name}</div>
        <div className="text-sm text-muted-foreground">{row.title} · {row.organization}</div>
        <a href={`mailto:${row.email}`} className="mt-1 block text-sm text-navy hover:underline">{row.email}</a>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Interest</div>
        <div className="mt-1 text-sm text-ink">{row.interest}</div>
      </div>
      {row.context ? (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Context</div>
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{row.context}</p>
        </div>
      ) : null}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Internal notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (row.internal_notes ?? "") && onSaveNotes(notes)}
          rows={3}
          className="mt-2 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
        />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Action note (audit log)</div>
        <input
          value={actionNote}
          onChange={(e) => setActionNote(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          placeholder="Optional — recorded with the status change"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            disabled={busy !== null || row.status === s}
            onClick={() => doStatus(s)}
            className={`border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] ${row.status === s ? "border-navy bg-navy/10 text-navy" : "border-ink text-ink hover:bg-ink hover:text-paper"} disabled:opacity-50`}
          >
            {busy === s ? "…" : s}
          </button>
        ))}
      </div>

      {onApproveAndInvite ? (
        <div className="space-y-2 border-t border-border pt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Insider access
          </div>
          {invitation && invitation.status !== "revoked" ? (
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
                Status: <span className="text-ink">{invitation.status}</span>
                {invitation.redeemed_at
                  ? ` · redeemed ${new Date(invitation.redeemed_at).toLocaleDateString()}`
                  : ` · expires ${new Date(invitation.expires_at).toLocaleDateString()}`}
              </div>
              {invitation.status === "pending" && inviteUrl ? (
                <>
                  <div className="break-all border border-border bg-paper p-2 text-xs font-mono text-ink">
                    {inviteUrl}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteUrl);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
                  >
                    {copied ? "Copied" : "Copy invite link"}
                  </button>
                  <button
                    onClick={doApproveAndInvite}
                    disabled={busy !== null}
                    className="ml-2 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy disabled:opacity-50"
                  >
                    Re-issue
                  </button>
                </>
              ) : null}
            </div>
          ) : (
            <button
              onClick={doApproveAndInvite}
              disabled={busy !== null}
              className="border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink disabled:opacity-50"
            >
              {busy === "invite" ? "Working…" : "Approve & invite"}
            </button>
          )}
        </div>
      ) : null}

      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
        Applicant reply email queues once sender domain is verified.
      </div>
    </div>
  );
}

function rowsToCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const cols = ["created_at", "name", "email", "organization", "title", "interest", "status", "context", "internal_notes"];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function attendeesToCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const cols = ["confirmed_at", "name", "email", "organization", "title", "interest", "plus_ones", "dietary_restrictions", "hotel_needed", "logistics_notes"];
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

function ConferenceDetailPanel({
  row,
  capacity,
  onChanged,
  onApproveAndInvite,
  loadInvitation,
  updateSeat,
  promote,
  saveNotes,
}: {
  row: Row;
  capacity: { total: number; confirmed: number; waitlisted: number; available: number };
  onChanged: () => Promise<void>;
  onApproveAndInvite: () => Promise<{ token: string; expiresAt: string; seatStatus: string }>;
  loadInvitation: () => Promise<{ invitation: Row | null }>;
  updateSeat: (payload: {
    id: string;
    seatStatus: ConferenceStatus;
    plusOnes: number;
    dietaryRestrictions?: string;
    hotelNeeded?: boolean;
    logisticsNotes?: string;
    note?: string;
  }) => Promise<void>;
  promote: (note?: string) => Promise<void>;
  saveNotes: (note: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState<string>(row.internal_notes ?? "");
  const [actionNote, setActionNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<Row | null>(null);
  const [copied, setCopied] = useState(false);
  const [plusOnes, setPlusOnes] = useState<number>(row.plus_ones ?? 0);
  const [dietary, setDietary] = useState<string>(row.dietary_restrictions ?? "");
  const [hotel, setHotel] = useState<boolean>(row.hotel_needed ?? false);
  const [logisticsNotes, setLogisticsNotes] = useState<string>(row.logistics_notes ?? "");

  const seatStatus: string = row.seat_status ?? row.status ?? "applied";
  const seats = 1 + plusOnes;
  const canPromote = seatStatus === "waitlisted" && seats <= capacity.available;

  useEffect(() => {
    loadInvitation().then((r) => setInvitation(r.invitation)).catch(() => {});
  }, [loadInvitation, row.id]);

  async function doAction(label: string, fn: () => Promise<void>) {
    setBusy(label);
    try { await fn(); } finally { setBusy(null); }
  }

  async function setSeat(status: ConferenceStatus) {
    await updateSeat({
      id: row.id,
      seatStatus: status,
      plusOnes,
      dietaryRestrictions: dietary || undefined,
      hotelNeeded: hotel,
      logisticsNotes: logisticsNotes || undefined,
      note: actionNote || undefined,
    });
    setActionNote("");
    await onChanged();
  }

  async function doPromote() {
    await promote(actionNote || undefined);
    setActionNote("");
    await onChanged();
  }

  async function doApproveAndInvite() {
    setBusy("invite");
    try {
      const r = await onApproveAndInvite();
      const fresh = await loadInvitation();
      setInvitation(fresh.invitation);
      await onChanged();
      return r;
    } finally {
      setBusy(null);
    }
  }

  const inviteUrl = invitation && invitation.status !== "revoked"
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/insider/accept?token=${invitation.token}`
    : null;

  return (
    <div className="space-y-4 border border-border bg-card p-5">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Contact</div>
        <div className="mt-1 font-serif text-xl text-ink">{row.name}</div>
        <div className="text-sm text-muted-foreground">{row.title} · {row.organization}</div>
        <a href={`mailto:${row.email}`} className="mt-1 block text-sm text-navy hover:underline">{row.email}</a>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Category</div>
        <div className="mt-1 text-sm text-ink">{row.interest}</div>
      </div>
      {row.context ? (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Context</div>
          <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{row.context}</p>
        </div>
      ) : null}

      <div className="border-t border-border pt-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Logistics</div>
        <div className="mt-3 grid gap-3">
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Plus-ones</span>
            <input
              type="number"
              min={0}
              max={10}
              value={plusOnes}
              onChange={(e) => setPlusOnes(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
              className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </label>
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Dietary restrictions</span>
            <input
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={hotel}
              onChange={(e) => setHotel(e.target.checked)}
              className="h-4 w-4 border-border"
            />
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Hotel needed</span>
          </label>
          <label className="block text-xs">
            <span className="font-mono uppercase tracking-[0.14em] text-silver">Logistics notes</span>
            <textarea
              value={logisticsNotes}
              onChange={(e) => setLogisticsNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Internal notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (row.internal_notes ?? "") && saveNotes(notes)}
          rows={3}
          className="mt-2 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
        />
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Action note (audit log)</div>
        <input
          value={actionNote}
          onChange={(e) => setActionNote(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          placeholder="Optional — recorded with the seat action"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {seatStatus !== "confirmed" ? (
          <button
            disabled={busy !== null}
            onClick={() => doAction("confirm", () => setSeat("confirmed"))}
            className="border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink disabled:opacity-50"
          >
            {busy === "confirm" ? "…" : "Confirm seat"}
          </button>
        ) : null}
        {seatStatus !== "waitlisted" ? (
          <button
            disabled={busy !== null}
            onClick={() => doAction("waitlist", () => setSeat("waitlisted"))}
            className="border border-border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:border-navy disabled:opacity-50"
          >
            {busy === "waitlist" ? "…" : "Waitlist"}
          </button>
        ) : null}
        {canPromote ? (
          <button
            disabled={busy !== null}
            onClick={() => doAction("promote", doPromote)}
            className="border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-emerald-700 hover:border-emerald-700 disabled:opacity-50"
          >
            {busy === "promote" ? "…" : "Promote from waitlist"}
          </button>
        ) : null}
        {seatStatus !== "declined" ? (
          <button
            disabled={busy !== null}
            onClick={() => doAction("decline", () => setSeat("declined"))}
            className="border border-border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-50"
          >
            {busy === "decline" ? "…" : "Decline"}
          </button>
        ) : null}
        {seatStatus !== "cancelled" ? (
          <button
            disabled={busy !== null}
            onClick={() => doAction("cancel", () => setSeat("cancelled"))}
            className="border border-destructive/40 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-destructive hover:bg-destructive hover:text-paper disabled:opacity-50"
          >
            {busy === "cancel" ? "…" : "Cancel"}
          </button>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Insider access
        </div>
        {invitation && invitation.status !== "revoked" ? (
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.14em] text-muted-foreground">
              Status: <span className="text-ink">{invitation.status}</span>
              {invitation.redeemed_at
                ? ` · redeemed ${new Date(invitation.redeemed_at).toLocaleDateString()}`
                : ` · expires ${new Date(invitation.expires_at).toLocaleDateString()}`}
            </div>
            {invitation.status === "pending" && inviteUrl ? (
              <>
                <div className="break-all border border-border bg-paper p-2 text-xs font-mono text-ink">
                  {inviteUrl}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
                >
                  {copied ? "Copied" : "Copy invite link"}
                </button>
                <button
                  onClick={doApproveAndInvite}
                  disabled={busy !== null}
                  className="ml-2 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy disabled:opacity-50"
                >
                  Re-issue
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <button
            onClick={doApproveAndInvite}
            disabled={busy !== null}
            className="border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink disabled:opacity-50"
          >
            {busy === "invite" ? "Working…" : "Approve & invite"}
          </button>
        )}
      </div>

      {seatStatus === "confirmed" && row.access_token ? (
        <div className="space-y-2 border-t border-border pt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Attendee private page
          </div>
          <AttendeeLink token={row.access_token} />
        </div>
      ) : null}

      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
        Applicant reply email queues once sender domain is verified.
      </div>
    </div>
  );
}

function AttendeeLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/prepare-america/confirmed?t=${token}`
      : `/prepare-america/confirmed?t=${token}`;
  return (
    <>
      <div className="break-all border border-border bg-paper p-2 text-xs font-mono text-ink">
        {url}
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
      >
        {copied ? "Copied" : "Copy attendee link"}
      </button>
    </>
  );
}

type ItineraryRow = {
  id: string;
  position: number;
  time_label: string;
  title: string;
  description: string | null;
  location: string | null;
  is_published: boolean;
};

function ItineraryEditor() {
  const listFn = useServerFn(listItineraryItems);
  const upsertFn = useServerFn(upsertItineraryItem);
  const delFn = useServerFn(deleteItineraryItem);
  const [items, setItems] = useState<ItineraryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const emptyDraft = {
    id: "",
    position: 0,
    time_label: "",
    title: "",
    description: "",
    location: "",
    is_published: true,
  };
  const [draft, setDraft] = useState<{
    id: string;
    position: number;
    time_label: string;
    title: string;
    description: string;
    location: string;
    is_published: boolean;
  }>(emptyDraft);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await listFn();
      setItems(r.rows as ItineraryRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!draft.time_label.trim() || !draft.title.trim()) {
      setError("Time label and title are required");
      return;
    }
    setError(null);
    try {
      await upsertFn({
        data: {
          id: draft.id || undefined,
          position: draft.position,
          timeLabel: draft.time_label,
          title: draft.title,
          description: draft.description,
          location: draft.location,
          isPublished: draft.is_published,
        },
      });
      setDraft(emptyDraft);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function togglePublished(row: ItineraryRow) {
    setBusyId(row.id);
    try {
      await upsertFn({
        data: {
          id: row.id,
          position: row.position,
          timeLabel: row.time_label,
          title: row.title,
          description: row.description ?? "",
          location: row.location ?? "",
          isPublished: !row.is_published,
        },
      });
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this itinerary item?")) return;
    setBusyId(id);
    try {
      await delFn({ data: { id } });
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  function editRow(row: ItineraryRow) {
    setDraft({
      id: row.id,
      position: row.position,
      time_label: row.time_label,
      title: row.title,
      description: row.description ?? "",
      location: row.location ?? "",
      is_published: row.is_published,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
            <tr>
              <th className="p-3 w-16">#</th>
              <th className="p-3">Time</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-silver">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-silver">No items yet.</td></tr>
            ) : items.map((r) => (
              <tr key={r.id} className={`border-t border-border ${draft.id === r.id ? "bg-muted/60" : ""}`}>
                <td className="p-3 font-mono text-xs text-silver">{r.position}</td>
                <td className="p-3 font-mono text-xs text-ink">{r.time_label}</td>
                <td className="p-3">
                  <button onClick={() => editRow(r)} className="text-left text-ink hover:underline">
                    {r.title}
                  </button>
                  {r.location ? <div className="text-xs text-muted-foreground">{r.location}</div> : null}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => togglePublished(r)}
                    disabled={busyId === r.id}
                    className={`border px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] ${
                      r.is_published
                        ? "border-navy bg-navy text-paper"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {r.is_published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => remove(r.id)}
                    disabled={busyId === r.id}
                    className="text-xs text-destructive hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:col-span-2 space-y-3 border border-border bg-card p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          {draft.id ? "Edit item" : "New item"}
        </div>
        {error ? <div className="border border-destructive/40 bg-destructive/5 p-2 text-xs text-destructive">{error}</div> : null}
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Position</span>
          <input
            type="number"
            value={draft.position}
            onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) || 0 })}
            className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Time label</span>
          <input
            value={draft.time_label}
            onChange={(e) => setDraft({ ...draft, time_label: e.target.value })}
            placeholder="9:00 AM"
            className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Title</span>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Location</span>
          <input
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="block text-xs">
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Description</span>
          <textarea
            rows={4}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="mt-1 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={draft.is_published}
            onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
          />
          <span className="font-mono uppercase tracking-[0.14em] text-silver">Published</span>
        </label>
        <div className="flex gap-2 pt-2">
          <button
            onClick={save}
            className="border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink"
          >
            {draft.id ? "Save changes" : "Add item"}
          </button>
          {draft.id ? (
            <button
              onClick={() => setDraft(emptyDraft)}
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
