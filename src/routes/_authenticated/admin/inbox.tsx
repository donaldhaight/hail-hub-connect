import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  grantInsiderAccess,
  getInvitationForRequest,
  grantInsiderAccessFromConference,
  getInvitationForConference,
} from "@/lib/insider.functions";
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
  const [tab, setTab] = useState<"briefings" | "conference">("briefings");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const listBriefings = useServerFn(listBriefingRequests);
  const listConf = useServerFn(listConferenceApplications);
  const updBrief = useServerFn(updateBriefingStatus);
  const updConf = useServerFn(updateConferenceStatus);
  const updNotes = useServerFn(updateBriefingNotes);
  const myRoles = useServerFn(getMyRoles);
  const grant = useServerFn(grantInsiderAccess);
  const getInv = useServerFn(getInvitationForRequest);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  const statuses = tab === "briefings" ? BRIEFING_STATUSES : CONFERENCE_STATUSES;

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const fn = tab === "briefings" ? listBriefings : listConf;
      const r = await fn({ data: { status: status || undefined, search: search || undefined } });
      setRows(r.rows);
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
          <div className="flex gap-2 border border-border">
            <TabBtn active={tab === "briefings"} onClick={() => { setTab("briefings"); setStatus(""); setSelected(null); }}>
              Briefing Requests
            </TabBtn>
            <TabBtn active={tab === "conference"} onClick={() => { setTab("conference"); setStatus(""); setSelected(null); }}>
              PrepareAmerica Applications
            </TabBtn>
          </div>
          <button onClick={signOut} className="text-xs text-silver hover:text-ink">Sign out</button>
        </div>

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

        {error ? <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div> : null}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-[10px] font-mono uppercase tracking-[0.14em] text-silver">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Interest</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-6 text-center text-silver">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-silver">No records.</td></tr>
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
                    <td className="p-3 text-xs font-mono uppercase">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <DetailPanel
                key={selected.id}
                row={selected}
                tab={tab}
                onSaveStatus={async (s, note) => {
                  if (tab === "briefings") {
                    await updBrief({ data: { id: selected.id, status: s as BriefingStatus, note } });
                  } else {
                    await updConf({ data: { id: selected.id, status: s as ConferenceStatus, note } });
                  }
                  await load();
                  setSelected((cur) => (cur ? { ...cur, status: s } : cur));
                }}
                onSaveNotes={async (note) => {
                  await updNotes({ data: { id: selected.id, note } });
                  setSelected((cur) => (cur ? { ...cur, internal_notes: note } : cur));
                }}
                onApproveAndInvite={
                  tab === "briefings"
                    ? async () => {
                        const r = await grant({ data: { briefingRequestId: selected.id } });
                        await load();
                        setSelected((cur) => (cur ? { ...cur, status: "approved" } : cur));
                        return r;
                      }
                    : undefined
                }
                loadInvitation={
                  tab === "briefings"
                    ? () => getInv({ data: { briefingRequestId: selected.id } })
                    : undefined
                }
              />
            ) : (
              <div className="border border-dashed border-border p-8 text-center text-sm text-silver">
                Select a row to review.
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
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
