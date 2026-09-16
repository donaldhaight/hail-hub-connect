import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import { routeHead } from "@/lib/site";
import { FUNNEL_TRACKS, getTrack } from "@/content/funnels";

export const Route = createFileRoute("/offer/$slug")({
  loader: ({ params }) => {
    const track = getTrack(params.slug);
    if (!track) throw notFound();
    return { track };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.track;
    return routeHead({
      title: `${t.offerTitle} — Prepare America`,
      description: t.offerLede,
      path: `/offer/${t.offerSlug}`,
    });
  },
  component: OfferPage,
  notFoundComponent: () => (
    <PageShell>
      <PageHeader
        eyebrow="Offer"
        title="No offer under that name."
        lede="Three Phase 1 tracks exist: builder, owner, contractor."
      />
    </PageShell>
  ),
});

function OfferPage() {
  const { track } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Phase 1 · ${track.label}`}
        title={track.offerTitle}
        lede={track.offerLede}
        truth="SIMULATION"
        confidentiality="C0"
        status="Simulation content · not a commercial offer"
      />

      <Section number="01" title="What this is">
        <ul className="space-y-4">
          {track.offerPoints.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
              <span className="mt-2 h-px w-4 shrink-0 bg-silver" aria-hidden />
              <span className="text-ink/85">{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[58ch] text-sm leading-relaxed text-silver">
          This page is a simulation used to test whether the platform can carry an
          acquisition flow through content and configuration. It is not approved copy, it is
          not a product, and it commits nobody to anything.
        </p>
      </Section>

      <Section number="02" title="What happens if you ask">
        <p className="max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
          {track.confirmationNext}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {track.key === "contractor" ? (
            <Link
              to="/roles"
              className="border border-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-background"
            >
              {track.offerAsk}
            </Link>
          ) : null}
          <Link
            to="/request-briefing"
            search={{ ask: "briefing" as const, track: track.key, offer: track.offerSlug }}
            className="border border-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-background"
          >
            {track.key === "contractor" ? "Ask for a briefing" : track.offerAsk}
          </Link>
          <Link
            to="/kimosabe"
            search={{ track: track.key }}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:underline"
          >
            Open a file first →
          </Link>
        </div>
        <div className="mt-8">
          <Meta truth="SIMULATION" status="No transaction · No offering" />
        </div>
      </Section>

      <Section number="03" title="The other tracks">
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.values(FUNNEL_TRACKS).map((t) => (
            <Link
              key={t.key}
              to="/offer/$slug"
              params={{ slug: t.offerSlug }}
              className="border border-border p-5 transition-colors hover:border-navy"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver">
                {t.label}
              </div>
              <div className="mt-2 font-serif text-lg leading-snug text-ink">{t.offerTitle}</div>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
