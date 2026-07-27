import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "Founder Statement";
const DESC =
  "A statement from Donald Haight, founder of United Stakeholders of America LLC and co-owner of Roofing & Reconstruction Contractors of America LLC.";

export const Route = createFileRoute("/founder")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/founder" }),
  component: Founder,
});

function Founder() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder"
        title="Donald Haight."
        lede="Co-owner, Roofing & Reconstruction Contractors of America LLC. Founder, United Stakeholders of America LLC. Twenty-five years in the insurance-restoration industry."
        confidentiality="C0"
      />

      <Section number="01" title="Statement">
        <Prose>
          <p>
            I have spent a career watching capable people — property owners,
            contractors, adjusters, lenders, attorneys — coordinate around
            problems that could be resolved if they shared one trusted
            operating record.
          </p>
          <p>
            RRCA is my company. It is real, it has operating history, and it
            needs to restructure. I am not going to hide that. I am going to
            use it — under counsel — as the first documented proof of
            concept for a better process.
          </p>
          <p>
            If that process becomes a repeatable protocol, the industry gets
            something it has needed for a long time. If it does not, RRCA is
            still corrected and its stakeholders are still protected. Those
            are both worthwhile outcomes.
          </p>
          <p>
            I am inviting a small group of experienced insiders to examine
            the problem, challenge the assumptions, and help structure the
            proof of concept. If you would like to be part of that
            conversation, request a briefing.
          </p>
          <div className="pt-4 font-serif text-2xl italic text-ink">
            — Donald Haight
          </div>
        </Prose>
      </Section>

      <Section number="02" title="Roles held today">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Co-Owner — Roofing &amp; Reconstruction Contractors of America LLC</li>
            <li>Founder — United Stakeholders of America LLC (formed July 24, 2026)</li>
            <li>Author — the ClaimStore Vision working documents</li>
          </ul>
        </Prose>
      </Section>
    </PageShell>
  );
}
