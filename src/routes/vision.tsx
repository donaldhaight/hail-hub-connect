import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";

const TITLE = "The Vision";
const DESC =
  "The proposed ClaimStore layer, its components — ClaimExpress, ClaimsBank, ClaimLoan, ClaimCoin — and the United Stakeholders of America foundry. All conceptual; nothing yet operational.";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { property: "og:title", content: `${TITLE} — ClaimStore Briefing Room` },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Vision,
});

const COMPONENTS = [
  {
    id: "InsuranceRestorationMarket",
    name: "InsuranceRestorationMarket",
    role: "The broader industry marketplace this work addresses.",
    status: "Context",
  },
  {
    id: "ClaimStore",
    name: "ClaimStore",
    role: "Proposed neutral transaction and coordination layer.",
    status: "Proposed",
  },
  {
    id: "ClaimExpress",
    name: "ClaimExpress Protocol",
    role: "The standardized workflow connecting contracts, approvals, evidence, payments, and completion.",
    status: "In design",
  },
  {
    id: "ClaimsBank",
    name: "ClaimsBank",
    role: "Controlled funds, escrow, and project-draw functions — subject to legal and regulatory design.",
    status: "Conceptual",
  },
  {
    id: "ClaimLoan",
    name: "ClaimLoan",
    role: "Project-funding and financing relationships within the protocol.",
    status: "Conceptual",
  },
  {
    id: "ClaimCoin",
    name: "ClaimCoin",
    role: "Digital financial or incentive component requiring separate securities and regulatory analysis.",
    status: "Conceptual — not implemented",
  },
];

function Vision() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · 04–05"
        title="A neutral coordination layer for the insurance-restoration market."
        lede="This is the larger vision that RRCA's case study is intended to inform. Nothing here is an operating product, an offering, or a regulated financial service."
        confidentiality="C0"
        truth="HYPOTHESIS"
        status="Proposed — Not Operational"
      />

      <Section number="04" title="Proposed components">
        <Prose>
          <p>
            ClaimStore is proposed as a neutral transaction and coordination
            layer. Each named component describes a developing concept.
            None represents current banking, escrow, lending, securities,
            or cryptocurrency operations.
          </p>
        </Prose>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {COMPONENTS.map((c) => (
            <article key={c.id} className="grid grid-cols-12 gap-6 py-6">
              <div className="col-span-12 md:col-span-4">
                <div className="font-medium text-ink">{c.name}</div>
                <div className="mt-2">
                  <Meta status={c.status} />
                </div>
              </div>
              <p className="col-span-12 text-sm leading-relaxed text-muted-foreground md:col-span-8">
                {c.role}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section number="05" title="United Stakeholders of America">
        <Prose>
          <p>
            United Stakeholders of America LLC (&ldquo;USA&rdquo;) was formed
            in Florida on July 24, 2026. Its proposed roles are to hold and
            organize the intellectual property of Donald Haight, serve as the
            venture-development vehicle for ClaimStore and future case
            studies, and establish governance designed around transparency
            and no conflicts of interest.
          </p>
          <p>
            These roles remain conceptual and require legal, tax, licensing,
            ownership, and conflict-of-interest review before implementation.
          </p>
        </Prose>
      </Section>

      <Section number="—" title="What this page is not">
        <Prose>
          <p>
            This page is not an investment solicitation, a sponsorship
            offer, a regulated financial disclosure, or a claim that any
            component listed above operates today. Participation pathways
            are documented separately and progress only under the
            supervision of counsel.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
