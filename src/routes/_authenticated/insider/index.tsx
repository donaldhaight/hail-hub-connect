import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

export const Route = createFileRoute("/_authenticated/insider/")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    // Check qualified_insider OR founder_admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id);
    const set = new Set((roles ?? []).map((r) => r.role));
    if (!set.has("qualified_insider") && !set.has("founder_admin")) {
      throw redirect({ to: "/" });
    }
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
  return (
    <PageShell>
      <PageHeader
        eyebrow="Qualified Insider Room"
        title="Welcome to the private layer."
        lede="This is the qualified-insider layer of the ClaimStore Briefing Room. Materials below are placeholders — the working artifacts will appear here as they are cleared for insider review."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-16">
        {[
          { title: "RRCA Restructuring Dossier", note: "Case study working draft — pending founder release." },
          { title: "ClaimStore Proof of Concept", note: "Operational model + simulated flows." },
          { title: "USA Foundry Portfolio Map", note: "ClaimsBank · ClaimLoan · ClaimCoin — narrative only." },
          { title: "PrepareAmerica Conference Agenda", note: "Draft — invited participants only." },
        ].map((m) => (
          <article key={m.title} className="border border-border bg-card p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Placeholder</div>
            <h2 className="mt-2 font-serif text-2xl text-ink">{m.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{m.note}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
