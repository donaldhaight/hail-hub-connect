import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { TruthChip, ConfidentialityChip } from "@/components/briefing/Badges";
import { ORDERED_DOSSIERS } from "@/content/dossiers";
import { listMyDossierOpens } from "@/lib/dossier.functions";

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
  const loadOpens = useServerFn(listMyDossierOpens);
  const [lastBySlug, setLastBySlug] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOpens().then((r) => setLastBySlug(r.lastBySlug)).catch(() => {});
  }, [loadOpens]);

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

      <section className="mx-auto max-w-4xl space-y-4 px-6 py-10">
        {ORDERED_DOSSIERS.map((d) => {
          const last = lastBySlug[d.slug];
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
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                  {last ? `Opened ${new Date(last).toLocaleDateString()}` : "Not yet opened"}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-2xl text-ink">{d.title}</h2>
              <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{d.summary}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
                Read dossier →
              </p>
            </Link>
          );
        })}
      </section>
    </PageShell>
  );
}
