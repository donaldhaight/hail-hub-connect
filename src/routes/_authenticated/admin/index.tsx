import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { getConsoleCounts } from "@/lib/backlog.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { BacklogBoard } from "@/components/briefing/BacklogBoard";
import { FIRST_CONGRESS, SECOND_CONGRESS } from "@/content/calendar";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Founder Console — PrepareAmerica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConsolePage,
});

const SURFACES = [
  { to: "/admin/inbox", label: "Inbox", note: "Triage requests, applications, invitations, and the run of show." },
  { to: "/admin/tickets", label: "Ticket Ledger", note: "Assign tiers and issue First Congress credentials." },
  { to: "/admin/broadcast", label: "Broadcast", note: "Stream config, state machine, and the pre-event checklist." },
  { to: "/admin/invite", label: "Invitations", note: "Issue and revoke qualified insider tokens." },
  { to: "/admin/digest", label: "Digest", note: "Daily rollup and the ladder funnel." },
  { to: "/admin/signals", label: "Signals", note: "Insider engagement across the dossier corpus." },
  { to: "/admin/reads", label: "Read Heatmap", note: "Section-level dwell and read confirmation." },
  { to: "/admin/edits", label: "Edit Log", note: "Audit trail of corpus changes." },
  { to: "/admin/evidence", label: "Evidence Index", note: "Every dated artifact behind the manual and the dossiers." },
  { to: "/admin/intake", label: "Intake Lane", note: "Drop documents and links before they're filed. Search the whole corpus." },
  { to: "/admin/lab", label: "Concept Lab", note: "Side tracks explored in the open, adopted into the backlog when they converge." },
  { to: "/admin/tour", label: "Tour", note: "Narrated walkthrough of every private surface." },
  { to: "/manual", label: "Owner's Manual", note: "The governing document, editable in place." },
] as const;

function daysUntil(dateLabel: string, iso: string | null) {
  if (!iso) return dateLabel;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return days > 0 ? `${days} days` : dateLabel;
}

function ConsolePage() {
  const myRoles = useServerFn(getMyRoles);
  const loadCounts = useServerFn(getConsoleCounts);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [counts, setCounts] = useState<{
    openRequests: number;
    pendingInvitations: number;
    confirmedSeats: number;
    broadcastState: string;
  } | null>(null);

  useEffect(() => {
    myRoles()
      .then((r) => setAuthorized(r.roles.includes("founder_admin")))
      .catch(() => setAuthorized(false));
  }, [myRoles]);

  useEffect(() => {
    if (!authorized) return;
    loadCounts()
      .then(setCounts)
      .catch(() => setCounts(null));
  }, [authorized, loadCounts]);

  if (authorized === null) {
    return (
      <PageShell>
        <div className="p-16 text-center text-silver">Loading…</div>
      </PageShell>
    );
  }
  if (!authorized) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede="Founder access only." confidentiality="C2" />
      </PageShell>
    );
  }

  const stats: Array<{ label: string; value: string }> = [
    { label: "Open requests", value: String(counts?.openRequests ?? "—") },
    { label: "Pending invitations", value: String(counts?.pendingInvitations ?? "—") },
    { label: "Seats confirmed", value: String(counts?.confirmedSeats ?? "—") },
    { label: "Broadcast", value: counts?.broadcastState ?? "—" },
    { label: "First Congress", value: daysUntil(FIRST_CONGRESS.dateLabel, FIRST_CONGRESS.opensOn) },
    { label: "Second Congress", value: daysUntil(SECOND_CONGRESS.dateLabel, SECOND_CONGRESS.opensOn) },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Console"
        title="The whole board, one screen."
        lede="Every private surface, and the working to-do list that governs what we build next."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-4 py-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-silver">{s.label}</div>
              <div className="mt-1 font-serif text-xl text-ink">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((s) => (
            <Link key={s.to} to={s.to} className="group bg-background px-4 py-4 hover:bg-muted">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy">{s.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-6 font-serif text-2xl text-ink">Backlog</h2>
        <BacklogBoard />
      </section>
    </PageShell>
  );
}
