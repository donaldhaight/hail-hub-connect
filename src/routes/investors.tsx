import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";

const TITLE = "For Investors";
const DESC =
  "A disciplined thesis for venture and strategic capital: fix one contractor in public, then productize the corrections into ClaimExpress, ClaimStore, ClaimsBank, ClaimLoan, and ClaimCoin.";

export const Route = createFileRoute("/investors")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/investors" }),
  component: InvestorsPage,
});

function InvestorsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · Investor Track"
        title="A rollup thesis inside a live restructuring."
        lede="We are not raising on a deck. We are correcting a real operating contractor, documenting the corrections, and turning the resulting protocol into a network of standardized instruments — Diller-style category ownership, YC-style qualification."
        confidentiality="C1"
        truth="ASSERTION"
      />

      <Section number="01" title="The shape of the opportunity">
        <Prose>
          <p>
            The U.S. insurance-restoration market is one of the last
            large-dollar categories still transacted through paper, phone
            calls, and adversarial workflow. The dysfunction is legible in
            every direction — carriers, contractors, capital, counsel,
            homeowners.
          </p>
          <p>
            The thesis is not "another SaaS for contractors." It is
            <strong> category ownership</strong>: the rails, the register,
            the reference contractor, and the standardized instruments that
            move claims, evidence, and money through the network.
          </p>
        </Prose>
      </Section>

      <Section number="02" title="Why this is investable now">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <strong>Live proof, not a pilot.</strong> RRCA is an operating
              contractor being restructured under counsel. Every correction
              is documented and becomes protocol.
            </li>
            <li>
              <strong>Sequenced instruments.</strong> ClaimExpress (protocol)
              → ClaimStore (marketplace) → ClaimsBank / ClaimLoan (working
              capital) → ClaimCoin (settlement rail).
            </li>
            <li>
              <strong>Convening event.</strong> The 11-1-2026 PrepareAmerica
              Conference at Gratitude Ranch qualifies the first 300
              stakeholders in one room.
            </li>
            <li>
              <strong>Founder domain depth.</strong> 25+ years in insurance
              restoration; multiple prior attempts inform the current
              structure.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section number="03" title="What we will and will not share here">
        <Prose>
          <p>
            The public site is intentionally understated. Financial detail,
            cap-table structure, restructuring counsel work product, and the
            operating dossiers live behind an insider layer with explicit
            confidentiality classes (C1–C4).
          </p>
          <p>
            Serious investors are invited to request a private briefing.
            Access is granted individually and logged.
          </p>
          <p className="text-sm text-muted-foreground">
            Nothing on this page constitutes an offer to sell or a
            solicitation to buy any security. All forward-looking statements
            are assertions of the founder pending independent diligence.
          </p>
        </Prose>
      </Section>

      <Section number="04" title="Next step">
        <Prose>
          <p>
            If you invest at the intersection of insurance, real assets,
            protocol networks, or working-capital rails,{" "}
            <Link to="/request-briefing">request a private briefing</Link>{" "}
            and note "investor" in your message. We will respond
            individually.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
