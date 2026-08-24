import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "Why PrepareAmerica";
const DESC =
  "The PrepareAmerica thesis: if we can fix the insurance restoration market, we can fix the government of the United States of America.";

export const Route = createFileRoute("/why-prepare-america")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/why-prepare-america" }),
  component: WhyPrepareAmerica,
});

function WhyPrepareAmerica() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · Thesis"
        title="Why the insurance restoration market is the right wedge."
        lede="A $20 billion annual market that everyone agrees is broken. A single real company being restructured in the open. And a coordination protocol that could scale from one contractor to 3,350 counties."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="The market is already broken">
        <Prose>
          <p>
            Insurance restoration is the largest recurring capital event most
            homeowners never chose. A hailstorm or hurricane creates a sudden
            demand for roofing, siding, windows, and interior repair. Carriers
            control the money. Contractors control the labor. Homeowners sit in
            the middle, under-informed and under-represented.
          </p>
          <p>
            The result is a coordination failure: delayed claims, disputed
            scopes, cash-flow starvation for contractors, and suboptimal outcomes
            for policyholders. No single party owns the whole process, so no
            party can fix it alone.
          </p>
        </Prose>
      </Section>

      <Section number="02" title="RRCA is the live case study">
        <Prose>
          <p>
            Roofing &amp; Reconstruction Contractors of America is not a
            hypothetical. It is a twenty-five-year operating company being
            restructured in public. Every correction — legal, financial,
            operational, technological — is being documented as it happens.
          </p>
          <p>
            That documentation is the proof. If the corrective process works
            for RRCA, it can be abstracted into the ClaimExpress Protocol. If
            the protocol works, it can be deployed across the industry.
          </p>
          <p>
            <Link to="/why-rrca" className="text-ink underline underline-offset-4 hover:text-navy">
              Read the RRCA case study
            </Link>
          </p>
        </Prose>
      </Section>

      <Section number="03" title="From one company to 3,350 counties">
        <Prose>
          <p>
            The Human Blockchain maps stakeholder roles across every U.S.
            county. The county is the node because it is the smallest durable
            unit of American governance. No platform can capture the entire
            ecosystem because no platform can capture 3,350 independent nodes.
          </p>
          <p>
            This is the structural answer to the centralization problem that
            has plagued every previous attempt to reform the market. The
            protocol is cooperative, not extractive. The governance is local, not
            platform-owned.
          </p>
          <p>
            <Link to="/architecture" className="text-ink underline underline-offset-4 hover:text-navy">
              Read the architecture
            </Link>
          </p>
        </Prose>
      </Section>

      <Section number="04" title="Why this scales to government">
        <Prose>
          <p>
            The same coordination failure exists in government: multiple
            parties, misaligned incentives, information asymmetry, and no single
            owner of the outcome. The insurance restoration market is a
            microcosm. It is complex enough to be meaningful, small enough to be
            fixable, and valuable enough to attract the capital and talent
            required.
          </p>
          <p>
            If we can prove a better coordination protocol in this market, we
            have a template. If we have a template, we can ask the next
            question: where else does the same geometry apply?
          </p>
        </Prose>
      </Section>

      <Section number="05" title="The convening">
        <Prose>
          <p>
            PrepareAmerica is the first annual review of this work. It is not a
            sales event. It is a private convening of executives, counsel,
            capital, and government advisors to examine the proof of concept in
            the open.
          </p>
          <p>
            <Link to="/prepare-america" className="text-ink underline underline-offset-4 hover:text-navy">
              Apply to attend PrepareAmerica
            </Link>
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
