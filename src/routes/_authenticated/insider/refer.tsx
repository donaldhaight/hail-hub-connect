import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import {
  submitInsiderReferral,
  listMyReferrals,
  type ReferralRow,
} from "@/lib/referrals.functions";

export const Route = createFileRoute("/_authenticated/insider/refer")({
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
  },
  head: () => ({
    meta: [
      { title: "Nominate an insider — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReferPage,
});

function ReferPage() {
  const submit = useServerFn(submitInsiderReferral);
  const listMine = useServerFn(listMyReferrals);

  const [nomineeName, setNomineeName] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");
  const [nomineeOrganization, setNomineeOrganization] = useState("");
  const [nomineeRole, setNomineeRole] = useState("");
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [mine, setMine] = useState<ReferralRow[]>([]);

  const refresh = () => {
    listMine()
      .then((r) => setMine(r.rows))
      .catch(() => {});
  };
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setSubmitting(true);
    try {
      await submit({
        data: {
          nomineeName: nomineeName.trim(),
          nomineeEmail: nomineeEmail.trim(),
          nomineeOrganization: nomineeOrganization.trim() || null,
          nomineeRole: nomineeRole.trim() || null,
          context: context.trim(),
        },
      });
      setOk("Nomination sent. The founder reviews every referral personally.");
      setNomineeName("");
      setNomineeEmail("");
      setNomineeOrganization("");
      setNomineeRole("");
      setContext("");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insider Nomination"
        title="Who should be in the room?"
        lede="Nominate someone whose presence at PrepareAmerica would materially move the mission. Every nomination is reviewed personally. Nothing here auto-approves; nothing here auto-emails."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-2xl px-6 py-8">
        <Link
          to="/insider"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver hover:text-ink"
        >
          ← Back to Index
        </Link>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 border border-border bg-card p-6">
          <Field label="Nominee's full name">
            <input
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              maxLength={160}
              required
              className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </Field>
          <Field label="Nominee's email">
            <input
              type="email"
              value={nomineeEmail}
              onChange={(e) => setNomineeEmail(e.target.value)}
              maxLength={255}
              required
              className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization (optional)">
              <input
                value={nomineeOrganization}
                onChange={(e) => setNomineeOrganization(e.target.value)}
                maxLength={200}
                className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
              />
            </Field>
            <Field label="Role / title (optional)">
              <input
                value={nomineeRole}
                onChange={(e) => setNomineeRole(e.target.value)}
                maxLength={160}
                className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
              />
            </Field>
          </div>
          <Field label="Why this person, and what would they bring?">
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              minLength={20}
              maxLength={4000}
              required
              placeholder="Be specific. Domain, network, capital, conviction — and what you'd want them to be exposed to first."
              className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
            />
          </Field>

          {err ? (
            <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {err}
            </div>
          ) : null}
          {ok ? (
            <div className="border border-navy/40 bg-navy/5 p-3 text-sm text-navy">{ok}</div>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="max-w-[42ch] text-xs text-muted-foreground">
              Max 5 pending nominations at once. Nothing is sent to the nominee automatically.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Submit nomination"}
            </button>
          </div>
        </form>

        {mine.length > 0 ? (
          <div className="mt-8">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Your nominations
            </div>
            <ul className="divide-y divide-border border border-border bg-card">
              {mine.map((r) => (
                <li key={r.id} className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-ink">{r.nominee_name}</span>
                    <span className="text-xs text-muted-foreground">{r.nominee_email}</span>
                    <span
                      className={`ml-auto border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        r.status === "invited"
                          ? "border-navy bg-navy/10 text-navy"
                          : r.status === "approved"
                          ? "border-navy/50 text-navy"
                          : r.status === "declined"
                          ? "border-destructive/40 text-destructive"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  {r.founder_note ? (
                    <p className="mt-2 border-l-2 border-navy/40 pl-3 text-xs text-muted-foreground">
                      Founder note: {r.founder_note}
                    </p>
                  ) : null}
                  <p className="mt-2 font-mono text-[10px] text-silver">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">{label}</span>
      {children}
    </label>
  );
}
