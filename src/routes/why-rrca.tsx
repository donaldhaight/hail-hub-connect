import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";

const TITLE = "Why RRCA";
const DESC =
  "RRCA is an established roofing and reconstruction company that requires restructuring. A live correction produces stronger evidence than a theoretical pilot.";

export const Route = createFileRoute("/why-rrca")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { property: "og:title", content: `${TITLE} — ClaimStore Briefing Room` },
      { property: "og:description", content: DESC },
    ],
  }),
  component: WhyRRCA,
});

function WhyRRCA() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · 01"
        title="Why start with a real, operating contractor."
        lede="RRCA has meaningful operating history and a present model that requires correction. A live restructuring produces stronger evidence than a theoretical pilot — and stronger evidence is what the industry, its counsel, and its capital need."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="The company">
        <Prose>
          <p>
            Roofing &amp; Reconstruction Contractors of America LLC is an
            established insurance-restoration contractor. Founder-supplied
            assertions requiring independent verification include:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Approximately twenty years of operating history</li>
            <li>Approximately twenty thousand completed projects</li>
            <li>More than two hundred million dollars in historical revenue</li>
            <li>Operations across more than fifteen states</li>
            <li>More than one million dollars in projects ready to build</li>
            <li>Infrastructure capable of producing more than ten million annually</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Each item above is presented as an <strong>assertion</strong>,
            not a verified fact, until confirmed in Phase 1 diligence.
          </p>
        </Prose>
      </Section>

      <Section number="02" title="The present condition">
        <Prose>
          <p>
            RRCA has operated at a loss for multiple years. The losses are
            not being hidden. They are the reason disciplined restructuring
            and external review are required.
          </p>
          <p>
            The immediate priority is to determine RRCA's legal and financial
            condition, correct its operating model, and preserve every
            available restructuring option — under counsel, with a defined
            corrective plan, before any capital transaction.
          </p>
        </Prose>
      </Section>

      <Section number="03" title="Why a live restructuring">
        <Prose>
          <p>
            A theoretical pilot produces theoretical results. A live
            restructuring produces documented evidence about draws,
            approvals, evidence, funds control, completion, and dispute
            resolution — the exact issues the industry needs to solve.
          </p>
          <p>
            Every correction becomes part of the record. That record becomes
            the raw material for the <strong>ClaimExpress Protocol</strong>.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
