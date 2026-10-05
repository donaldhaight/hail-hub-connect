import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import { FrontDoor } from "@/components/frontdoor/FrontDoor";
import { getPersona } from "@/content/personas";
import { personaForHost } from "@/lib/door-hosts";
import { getCurrentHost } from "@/lib/request-host";

const DESC =
  "The civic commons for American property restoration: one shared record for property owners, adjusters, contractors, underwriters and civic partners.";
const OG_TITLE = "PrepareAmerica · Restore the property. Preserve the truth.";

export const Route = createFileRoute("/")({
  // ADR-030: a venture domain serves its canonical Door as the front page.
  // ADR-037: unknown hosts get the Universal Commons; the movement home lives at /movement.
  // ?as=<domain> previews a domain's front page before DNS is pointed.
  validateSearch: (s: Record<string, unknown>): { as?: string } =>
    typeof s.as === "string" ? { as: s.as } : {},
  loaderDeps: ({ search }) => ({ as: search.as }),
  loader: ({ deps }) => {
    const host = deps.as ?? getCurrentHost();
    return { personaId: personaForHost(host)?.id ?? null };
  },
  head: ({ loaderData }) => {
    const persona = loaderData?.personaId ? getPersona(loaderData.personaId) : null;
    if (persona) {
      return {
        meta: [
          { title: persona.title },
          { name: "description", content: persona.description },
          { property: "og:title", content: persona.title },
          { property: "og:description", content: persona.description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ],
      };
    }
    return {
      meta: [
        { title: OG_TITLE },
        { name: "description", content: DESC },
        { property: "og:title", content: OG_TITLE },
        { property: "og:description", content: DESC },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://prepareamerica.com/" },
        { property: "og:site_name", content: "PrepareAmerica" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: OG_TITLE },
        { name: "twitter:description", content: DESC },
      ],
      links: [{ rel: "canonical", href: "https://prepareamerica.com/" }],
    };
  },
  component: Index,
});

const PORTALS = [
  {
    who: "Property Owners",
    label: "Advocacy & verified restoration",
    promise:
      "Never navigate a major loss alone. Hold an unalterable record of your property and its damage, and see your claim settled on fact.",
    to: "/buddy-claim" as const,
    cta: "The Property Owner Door",
  },
  {
    who: "Adjusting Professionals",
    label: "Attributable opinion & independence",
    promise:
      "Every estimate has an author. Your professional scope stays in the permanent file, preserved beside any later change.",
    to: "/adjusting-professionals" as const,
    cta: "Enter Adjusting Professionals",
  },
  {
    who: "Licensed Contractors & Construction Managers",
    label: "Craftsmanship, governance & RRCA standards",
    promise:
      "Step out of the retail mud. Execute on an audited protocol and take your seat in the movement and the First Congress.",
    to: "/movement" as const,
    cta: "The Contractor & Movement Portal",
  },
  {
    who: "Insurers, Underwriters & Risk Capital",
    label: "Objective evidence & corroboration",
    promise:
      "Settle legitimate claims sooner on tamper-evident baselines and verified proof of completion.",
    to: "/request-briefing" as const,
    cta: "Request an institutional briefing",
  },
  {
    who: "Civic, Municipal & Capital Partners",
    label: "Preparedness & infrastructure",
    promise:
      "Recovery after a storm needs mobilized labor, dependable supply and transparent capital. Coordinate before the next one.",
    to: "/request-briefing" as const,
    cta: "Request a civic briefing",
  },
];

function Index() {
  const { personaId } = Route.useLoaderData();
  if (personaId) return <FrontDoor persona={getPersona(personaId)} />;
  return (
    <PageShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mb-8">
            <Meta confidentiality="C0" status="Preview · Universal Home v0.1" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            The American Built Environment
          </div>
          <h1 className="mt-4 max-w-[22ch] font-serif text-4xl leading-[1.05] tracking-tight text-balance text-ink md:text-6xl lg:text-7xl">
            The Restoration of Property. The Preservation of Truth. The Alignment of Commerce.
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            Every year disaster collides with an insurance-restoration market that works
            without a shared record. We coordinate the property owners, adjusters,
            contractors and capital partners who rebuild the country.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#portals"
              className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
            >
              Find your door <span aria-hidden="true">→</span>
            </a>
            <Link
              to="/doors"
              className="inline-flex items-center justify-center gap-2 border border-border px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-muted"
            >
              See every Door
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                The structural problem
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="font-serif text-2xl leading-snug text-ink md:text-3xl">
                When catastrophe strikes, the owner waits in the dark, the adjuster is pressed
                to cut line items, the contractor is suspected of inflation and the carrier
                fights an opaque battle. The weather was never the problem. Every party works
                from a different version of the truth.
              </p>
              <p className="mt-6 max-w-[58ch] text-muted-foreground">
                A property can’t be restored in good faith on a contested record. Before
                estimates change hands, there has to be a common standard of evidence,
                authorship that can be attributed, and completion that can be verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="border-b border-border scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Five portals, one record
            </div>
            <h2 className="mt-3 max-w-[26ch] font-serif text-3xl text-ink md:text-4xl">
              Each stakeholder speaks for itself. The record underneath belongs to no one side.
            </h2>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {PORTALS.map((p) => (
              <article key={p.who} className="flex flex-col bg-background p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {p.label}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-ink">{p.who}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {p.promise}
                </p>
                <Link
                  to={p.to}
                  className="mt-6 text-sm font-medium text-ink underline underline-offset-4 hover:text-navy"
                >
                  {p.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                The foundation
              </div>
            </div>
            <blockquote className="md:col-span-8">
              <p className="font-serif text-3xl leading-tight text-ink md:text-4xl">
                Not another siloed system. An append-only record of damage, opinion,
                authorization and completion. When everyone reads the same file, the fight
                ends and the rebuilding begins.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {[
              { to: "/movement" as const, t: "The Movement & First Congress", n: "The contractor rallying cry, preserved." },
              { to: "/doors" as const, t: "The Doors", n: "Every stakeholder surface on one page." },
              { to: "/architecture" as const, t: "The Architecture", n: "How the shared record is built." },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="bg-background p-6 transition-colors hover:bg-muted">
                <div className="font-medium text-ink">{l.t} →</div>
                <p className="mt-2 text-sm text-muted-foreground">{l.n}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 max-w-[62ch] text-xs text-muted-foreground">
            Preview copy pending founder and counsel review. This is not a securities offering,
            a regulated financial service, or a claim of completed technology.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
