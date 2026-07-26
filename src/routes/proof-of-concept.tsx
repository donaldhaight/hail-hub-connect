import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";

const TITLE = "The Proof of Concept";
const DESC =
  "RRCA's restructuring becomes the first documented case study for the ClaimStore operating model — six sequenced steps, human decisions throughout.";

export const Route = createFileRoute("/proof-of-concept")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { property: "og:title", content: `${TITLE} — ClaimStore Briefing Room` },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ProofOfConcept,
});

const STEPS = [
  ["Diagnose", "Review RRCA's current legal, financial, and operational condition."],
  ["Correct the model", "Establish compliant project-fund and draw procedures."],
  ["Establish controls", "Define standardized agreements, approvals, and evidence requirements."],
  ["Document the workflow", "Connect the process to existing operating software where practical."],
  ["Measure", "Test whether the new process improves compliance, transparency, cash control, and completion."],
  ["Convert to protocol", "Turn verified lessons into a repeatable industry protocol."],
];

function ProofOfConcept() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · 03"
        title="The proof of concept is one contractor, documented in the open."
        lede="Phase 1 does not attempt to build a new financial institution or software platform. It begins by documenting and improving one real contractor's process."
        confidentiality="C0"
        truth="DECISION"
      />

      <Section number="01" title="Six sequenced steps">
        <ol className="divide-y divide-border border-y border-border">
          {STEPS.map(([label, note], i) => (
            <li key={label} className="grid grid-cols-12 items-baseline gap-6 py-6">
              <span className="col-span-2 font-mono text-xs text-silver md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-10 md:col-span-11">
                <div className="font-medium text-ink">{label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{note}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section number="02" title="Principles">
        <Prose>
          <ul className="ml-5 list-disc space-y-2">
            <li><strong>Real problem first.</strong> RRCA restructuring precedes the larger vision.</li>
            <li><strong>Progressive disclosure.</strong> Users see only what their role and stage require.</li>
            <li><strong>Boundaries are explicit.</strong> RRCA, USA, ClaimStore, investors, sponsors, and counsel remain separate.</li>
            <li><strong>Status is visible.</strong> Existing, proposed, conceptual, approved, and deferred are never confused.</li>
            <li><strong>Truth is labeled.</strong> Every material claim receives a truth classification.</li>
            <li><strong>Humans decide.</strong> The system records professional judgment; it does not replace it.</li>
            <li><strong>One next action.</strong> Every open item identifies an owner, deadline, or blocking condition.</li>
          </ul>
        </Prose>
      </Section>

      <Section number="03" title="What Phase 1 will not do">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Solicit or accept investments</li>
            <li>Operate as a bank, escrow, lender, cryptocurrency platform, or securities exchange</li>
            <li>Hold or disburse construction project funds</li>
            <li>Determine legal compliance automatically</li>
            <li>Replace a law firm's document-management system</li>
            <li>Implement ClaimCoin</li>
            <li>Make automated legal, financial, tax, or investment decisions</li>
          </ul>
        </Prose>
      </Section>
    </PageShell>
  );
}
