import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

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

type Dossier = {
  code: string;
  title: string;
  thesis: string;
  confidentiality: "C2" | "C3";
  truth: "DRAFT" | "SIMULATION" | "ASSERTION";
  state: string;
};

const DOSSIERS: Dossier[] = [
  {
    code: "01",
    title: "RRCA Restructuring — Case Study",
    thesis:
      "The working case study for restructuring the Roofing & Reconstruction Contractors of America into the operational proof of the ClaimStore thesis.",
    confidentiality: "C3",
    truth: "DRAFT",
    state: "Founder release pending.",
  },
  {
    code: "02",
    title: "ClaimExpress — Operational Layer",
    thesis:
      "The transaction rails: how a claim moves from event → sales → dispatch → project → completion → capital, standardized across restoration.",
    confidentiality: "C2",
    truth: "SIMULATION",
    state: "Simulated flows in preparation for the convening.",
  },
  {
    code: "03",
    title: "ClaimStore — Network Thesis",
    thesis:
      "The Barry-Diller-style rollup of the fragmented insurance-restoration market into a single, standardized, permissioned network.",
    confidentiality: "C2",
    truth: "ASSERTION",
    state: "Narrative-ready. Materials clearing insider review.",
  },
  {
    code: "04",
    title: "USA Foundry — ClaimsBank · ClaimLoan · ClaimCoin",
    thesis:
      "The capital layer of United Stakeholders of America: standardized ledgers, contractor financing, and the tokenized settlement unit.",
    confidentiality: "C3",
    truth: "DRAFT",
    state: "Structural map only. No offering, no security.",
  },
  {
    code: "05",
    title: "PrepareAmerica Conference — Agenda & Attendees",
    thesis:
      "The private convening on 11-01-2026. Draft agenda, invited categories, and the presentation order of the working artifacts above.",
    confidentiality: "C2",
    truth: "DRAFT",
    state: "Invited participants only. Confirmations rolling.",
  },
];

function InsiderRoom() {
  const { roles } = Route.useRouteContext();
  const isFounder = roles.includes("founder_admin");
  const roleLabel = isFounder ? "Founder Admin" : "Qualified Insider";

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
        {DOSSIERS.map((d) => (
          <article key={d.code} className="border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">{d.code}</span>
                <span className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {d.confidentiality}
                </span>
                <span className="border border-ink px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                  {d.truth}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                Not yet released
              </span>
            </div>
            <h2 className="mt-3 font-serif text-2xl text-ink">{d.title}</h2>
            <p className="mt-2 max-w-[62ch] text-sm text-muted-foreground">{d.thesis}</p>
            <p className="mt-3 text-xs text-silver">{d.state}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
