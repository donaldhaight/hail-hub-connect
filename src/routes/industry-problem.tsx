import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "The Industry Problem";
const DESC =
  "Insurance-restoration participants coordinate around six questions and lack a shared, independently verifiable record.";

export const Route = createFileRoute("/industry-problem")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/industry-problem" }),
  component: IndustryProblem,
});

const QUESTIONS = [
  "What work is needed?",
  "What work was agreed?",
  "Who must act next?",
  "What evidence supports the action or payment?",
  "What is blocking completion?",
  "When is the obligation complete?",
];

function IndustryProblem() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · 02"
        title="The problem is not that participants fail. It is that they do not share one trusted record."
        lede="Insurance-restoration projects require property owners, contractors, insurers, lenders, adjusters, attorneys, and vendors to coordinate money, documents, approvals, and performance. The process is fragmented."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="Six coordination questions">
        <Prose>
          <p>Every insurance-restoration project turns on the same six questions:</p>
        </Prose>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {QUESTIONS.map((q, i) => (
            <li key={q} className="grid grid-cols-12 items-baseline gap-6 py-5">
              <span className="col-span-2 font-mono text-xs text-silver md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-10 text-ink md:col-span-11">{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section number="02" title="What is missing">
        <Prose>
          <p>Participants often lack a shared, independently verifiable record of:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>What work was agreed</li>
            <li>What funds were received</li>
            <li>How funds may be used</li>
            <li>What work has been completed</li>
            <li>What evidence supports payment</li>
            <li>Who must act next</li>
          </ul>
          <p>This produces delay, disputes, compliance risk, and mistrust.</p>
        </Prose>
      </Section>

      <Section number="03" title="What we are not saying">
        <Prose>
          <p>
            The message is not that every industry participant is failing.
            The message is that the participants do not share one trusted
            operating record — and that is a solvable coordination problem,
            not a character problem.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
