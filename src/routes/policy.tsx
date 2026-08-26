import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "For Policy & Government";
const DESC =
  "How a standardized claims protocol, funds-control rail, and reference contractor reduce disaster-recovery friction for homeowners, carriers, and public agencies.";

export const Route = createFileRoute("/policy")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/policy" }),
  component: PolicyPage,
});

function PolicyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · Policy Track"
        title="Disaster recovery deserves a standardized rail."
        lede="Hail and hurricane recovery in the United States is bottlenecked not by capital or labor, but by the absence of a shared protocol for evidence, approvals, funds control, and dispute resolution. This is a policy problem with a private-sector on-ramp."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="What breaks after a storm">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Homeowners sign contracts under duress, often before scope is
              knowable.
            </li>
            <li>
              Carriers and contractors adjudicate scope and payment through
              adversarial back-and-forth rather than shared evidence.
            </li>
            <li>
              Funds move without standardized draw, approval, or
              completion evidence — creating fraud and abandonment risk on
              both sides.
            </li>
            <li>
              Public agencies have no register to see, in near-real-time,
              which properties are in what stage of recovery.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section number="02" title="What a standardized protocol changes">
        <Prose>
          <p>
            The <strong>ClaimExpress Protocol</strong> codifies scope,
            evidence, draw, approval, and completion into a shared record.
            The <strong>ClaimStore</strong> registers claims and connects
            qualified contractors. <strong>ClaimsBank</strong> and{" "}
            <strong>ClaimLoan</strong> supply working capital against
            standardized evidence rather than reputation alone.
          </p>
          <p>
            The public benefit is measurable: shorter time-to-dry-in,
            fewer abandoned projects, cleaner fraud posture, and a real
            register public agencies can query without displacing private
            actors.
          </p>
        </Prose>
      </Section>

      <Section number="03" title="Why start with one contractor">
        <Prose>
          <p>
            A live restructuring of Roofing &amp; Reconstruction Contractors
            of America LLC produces documented evidence, not slideware. The
            corrections made in one company become the protocol offered to
            the network.
          </p>
          <p>
            This is deliberately the opposite of a top-down mandate: the
            protocol earns adoption by working, then invites public-sector
            partners in.
          </p>
        </Prose>
      </Section>

      <Section number="04" title="How to engage">
        <Prose>
          <p>
            Government think tanks, state insurance departments, and
            disaster-recovery agencies are invited to request an invitation to the
            11-1-2026 <Link to="/prepare-america">First Congress</Link>{" "}
            and to <Link to="/request-briefing">request a private briefing</Link>.
            Access is individual and logged; nothing here is a lobbying
            position or a proposal for public funding.
          </p>

        </Prose>
      </Section>
    </PageShell>
  );
}
