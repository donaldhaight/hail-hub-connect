import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";

const TITLE = "PrepareAmerica Conference";
const DESC =
  "The first annual PrepareAmerica Conference. 300 seats. Private. Gratitude Ranch, Flower Mound, Texas. November 1, 2026.";

export const Route = createFileRoute("/prepare-america")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { property: "og:title", content: `${TITLE} — ClaimStore Briefing Room` },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PrepareAmerica,
});

function PrepareAmerica() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Convening"
        title="PrepareAmerica · The first annual convening."
        lede="A private convening of 300 industry executives, counsel, capital, and government advisors. Held once per year to review the ClaimStore proof of concept in the open."
        confidentiality="C0"
        status="Invitation Only"
      />

      <Section number="01" title="The details">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            ["Date", "November 1, 2026"],
            ["Location", "Gratitude Ranch, Flower Mound, Texas"],
            ["Capacity", "300 seats — private"],
            ["Convener", "United Stakeholders of America LLC"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                {k}
              </dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section number="02" title="Who is invited">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>C-level industry executives from insurance, restoration, and construction</li>
            <li>Institutional investors and venture capital</li>
            <li>Contractors with capital and operational maturity</li>
            <li>Government think tanks and infrastructure policy advisors</li>
            <li>Counsel: construction, restructuring, securities, regulatory</li>
            <li>Strategic technology and integration partners</li>
          </ul>
        </Prose>
      </Section>

      <Section number="03" title="What will be presented">
        <Prose>
          <p>
            The RRCA case study, the current state of the ClaimExpress
            Protocol design, the entity and governance architecture of
            United Stakeholders of America, and the proposed sponsorship
            pathways for ClaimStore.
          </p>
          <p>
            All material will be presented with truth-classification labels.
            Nothing at the convening will be sold, transacted, or publicly
            offered.
          </p>
        </Prose>
      </Section>

      <Section number="—" title="Apply for an invitation">
        <Prose>
          <p>
            Seating is limited to 300. Applications are reviewed by the
            convener and are not first-come-first-served.
          </p>
        </Prose>
        <div className="mt-6">
          <Link
            to="/request-briefing"
            search={{ interest: "prepare-america" }}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
          >
            Apply for an invitation
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
