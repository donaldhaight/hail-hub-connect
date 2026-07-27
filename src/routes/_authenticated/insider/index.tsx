import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { TruthChip, ConfidentialityChip } from "@/components/briefing/Badges";
import { ORDERED_DOSSIERS } from "@/content/dossiers";
import { listDossierCounts, getInsiderWhatsNew } from "@/lib/dossier.functions";

export const Route = createFileRoute("/_authenticated/insider/")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id);
    const set = new Set((roles ?? []).map((r) => r.role));
    if (!set.has("qualified_insider") && !set.has("founder_admin")) {
      throw redirect({ to: "/" });
    }
    return { roles: Array.from(set) as string[] };
  },
  head: () => ({
    meta: [
      { title: "Qualified Insider Room — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InsiderRoom,
});

function InsiderRoom() {
  const { roles } = Route.useRouteContext();
  const isFounder = roles.includes("founder_admin");
  const roleLabel = isFounder ? "Founder Admin" : "Qualified Insider";
  const loadWhatsNew = useServerFn(getInsiderWhatsNew);
  const loadCounts = useServerFn(listDossierCounts);
  const [lastBySlug, setLastBySlug] = useState<Record<string, string>>({});
  const [latestBySlug, setLatestBySlug] = useState<Record<string, string>>({});
  const [notesBySlug, setNotesBySlug] = useState<Record<string, number>>({});
  const [messagesBySlug, setMessagesBySlug] = useState<Record<string, number>>({});

  useEffect(() => {
    loadWhatsNew()
      .then((r) => {
        setLastBySlug(r.lastOpenBySlug);
        setLatestBySlug(r.latestBySlug);
      })
      .catch(() => {});
    loadCounts()
      .then((r) => {
        setNotesBySlug(r.notesBySlug);
        setMessagesBySlug(r.messagesBySlug);
      })
      .catch(() => {});
  }, [loadWhatsNew, loadCounts]);

  const whatsNew = useMemo(() => {
    return ORDERED_DOSSIERS.map((d) => {
      const opened = lastBySlug[d.slug];
      const latest = latestBySlug[d.slug];
      let label: string | null = null;
      if (!opened) label = "Unread";
      else if (latest && latest > opened) label = "New activity";
      return label ? { slug: d.slug, title: d.title, label } : null;
    }).filter(Boolean) as Array<{ slug: string; title: string; label: string }>;
  }, [lastBySlug, latestBySlug]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Qualified Insider Room"
        title="Working Dossier Index."
        lede="Every artifact behind the front door — labeled, versioned, and cleared for insider review. Nothing here is an offering. Nothing here is final. Everything here is on the path to the PrepareAmerica convening."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-4xl px-6 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Session</div>
            <div className="text-sm text-ink">Signed in as <span className="font-mono">{roleLabel}</span></div>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Confidential Working Concept — Not an Offering
          </div>
        </div>
      </section>

      {whatsNew.length > 0 ? (
        <section className="mx-auto max-w-4xl px-6 pt-6">
          <div className="border border-navy/30 bg-navy/[0.03] p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-navy">What's new for you</div>
            <ul className="flex flex-wrap gap-2">
              {whatsNew.map((n) => (
                <li key={n.slug}>
                  <Link
                    to="/_authenticated/insider/dossier/$slug"
                    params={{ slug: n.slug }}
                    className="inline-flex items-center gap-2 border border-navy/40 bg-background px-3 py-1.5 text-xs text-ink hover:border-navy"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy">{n.label}</span>
                    <span>{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl space-y-4 px-6 py-10">
        {ORDERED_DOSSIERS.map((d) => {
          const last = lastBySlug[d.slug];
          const latest = latestBySlug[d.slug];
          const isNew = !last || (latest && latest > last);
          return (
            <Link
              key={d.slug}
              to="/_authenticated/insider/dossier/$slug"
              params={{ slug: d.slug }}
              className="block border border-border bg-card p-6 transition hover:border-ink"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">{d.code}</span>
                  <ConfidentialityChip value={d.confidentiality} />
                  <TruthChip value={d.truthDefault} />
                  {isNew ? (
                    <span className="border border-navy/50 bg-navy/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-navy">
                      {last ? "New" : "Unread"}
                    </span>
                  ) : null}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                  {last ? `Opened ${new Date(last).toLocaleDateString()}` : "Not yet opened"}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-2xl text-ink">{d.title}</h2>
              <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{d.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
                  Read dossier →
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                  {(notesBySlug[d.slug] ?? 0)} note{(notesBySlug[d.slug] ?? 0) === 1 ? "" : "s"}
                  {" · "}
                  {(messagesBySlug[d.slug] ?? 0)} message{(messagesBySlug[d.slug] ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </PageShell>
  );
}
