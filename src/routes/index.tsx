import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import {
  FIRST_CONGRESS,
  SECOND_CONGRESS,
  SEASON_ONE,
  CONGRESS_VENUE,
  DELEGATE_CAPACITY,
  CONVENER,
} from "@/content/calendar";

const TITLE = "If we can fix the Insurance Restoration Market, we can fix the Government of the United States of America.";
const DESC =
  `The First Congress · ${FIRST_CONGRESS.dateLabel} · streamed to invitation holders. A reveal, an announcement, and an invitation to the convened Second Congress.`;
const OG_TITLE = `PrepareAmerica · The First Congress · ${FIRST_CONGRESS.dateLabel}`;

export const Route = createFileRoute("/")({
  head: () => ({
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
  }),
  component: Index,
});

const LADDER = [
  { n: "01", label: "The Real Company", note: "RRCA operating history" },
  { n: "02", label: "The Case Study", note: "Restructuring in the open" },
  { n: "03", label: "The Repeatable System", note: "ClaimExpress Protocol" },
  { n: "04", label: "The Industry Vision", note: "ClaimStore coordination layer" },
  { n: "05", label: "The Venture Foundry", note: "United Stakeholders of America" },
];

function Index() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mb-8">
            <Meta confidentiality="C0" status="Working Draft v0.2" />
          </div>
          <h1 className="max-w-[22ch] font-serif text-4xl leading-[1.05] tracking-tight text-balance text-ink md:text-6xl lg:text-7xl">
            {TITLE}
          </h1>
          <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
            On {FIRST_CONGRESS.dateLabel} we convene{" "}
            <span className="text-ink">the First Congress</span> — streamed,
            not gathered. A reveal, an announcement, and an invitation.
            You need an invitation to receive the invitation.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/prepare-america"
              className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
            >
              Request an Invitation
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/request-briefing"
              className="inline-flex items-center justify-center gap-2 border border-border bg-transparent px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-muted"
            >
              Request a Private Briefing
            </Link>
          </div>
        </div>
      </section>

      {/* The two congresses */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Two Congresses
            </div>
            <h2 className="mt-3 max-w-[26ch] font-serif text-3xl text-ink md:text-4xl">
              One is announced. One is convened.
            </h2>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-2">
            {[FIRST_CONGRESS, SECOND_CONGRESS].map((c) => (
              <article key={c.id} className="bg-background p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {c.mode === "streamed" ? "Streamed" : "Convened"}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-ink">{c.label}</h3>
                <p className="mt-1 font-serif text-xl text-navy">{c.dateLabel}</p>
                <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                  {c.purpose}
                </p>
              </article>
            ))}
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Reveal</dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{FIRST_CONGRESS.dateLabel}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Convening</dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{CONGRESS_VENUE}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Delegates</dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{DELEGATE_CAPACITY} · private</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Convener</dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{CONVENER}</dd>
            </div>
          </dl>
          <p className="mt-8 max-w-[62ch] text-sm text-muted-foreground">
            {SEASON_ONE.label} follows the Second Congress and runs{" "}
            {SEASON_ONE.dateLabel} — short by design.
          </p>
        </div>
      </section>


      {/* Central proposition pull-quote */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Central Proposition
              </div>
            </div>
            <blockquote className="md:col-span-8">
              <p className="font-serif text-3xl leading-tight text-ink md:text-4xl">
                Restructure one real contractor. Document every correction.
                Prove a better process. Then determine whether it can become
                an industry standard — and a model for coordinated governance.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* The Ladder */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Message Hierarchy
              </div>
              <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                Five layers, always in order.
              </h2>
            </div>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {LADDER.map((row) => (
              <li key={row.n} className="grid grid-cols-12 items-baseline gap-6 py-6">
                <span className="col-span-2 font-mono text-xs text-silver md:col-span-1">
                  {row.n}
                </span>
                <span className="col-span-7 font-medium text-ink md:col-span-6">
                  {row.label}
                </span>
                <span className="col-span-3 text-right text-sm text-muted-foreground md:col-span-5 md:text-left">
                  {row.note}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[60ch] text-sm text-muted-foreground">
            No reader should reach layers 04 or 05 before understanding
            layers 01–03.
            <Link to="/briefing" className="ml-2 text-ink underline underline-offset-4 hover:text-navy">
              Read the full briefing
            </Link>
          </p>
        </div>
      </section>

      {/* Audience paths */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="mb-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Who this is for
            </div>
            <h2 className="mt-3 max-w-[24ch] font-serif text-3xl text-ink md:text-4xl">
              We are inviting a small group of experienced insiders.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Construction & restructuring counsel", "Help establish defensible legal foundations."],
              ["RRCA investor prospects", "Evaluate a defined corrective plan, not a rescue."],
              ["ClaimStore sponsors", "Fund a measurable proof of concept."],
              ["Strategic industry partners", "Help design a repeatable protocol."],
              ["Technology partners", "Begin with a narrow, integrable workflow."],
              ["Trusted advisors", "Challenge the structure before public release."],
            ].map(([title, note]) => (
              <div key={title} className="bg-background p-6">
                <div className="font-medium text-ink">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="max-w-[20ch] font-serif text-4xl leading-tight text-ink md:text-5xl">
                The first commitment is disciplined due diligence.
              </h2>
              <p className="mt-6 max-w-[56ch] text-lg text-muted-foreground">
                The larger vision must earn its credibility through the
                results of the RRCA case study. This is a private planning
                process — not a public securities offering, regulated financial
                service, or claim of completed technology.
              </p>
            </div>
            <div className="md:col-span-4">
              <Link
                to="/prepare-america"
                className="inline-flex w-full items-center justify-between border border-ink bg-ink px-5 py-4 text-sm font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
              >
                Request an Invitation
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/request-briefing"
                className="mt-3 inline-flex w-full items-center justify-between border border-border px-5 py-4 text-sm font-medium text-ink transition-colors hover:bg-muted"
              >
                Request a Private Briefing
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
