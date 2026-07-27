import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { BRANDS } from "@/content/brands";
import { routeHead } from "@/lib/site";

const TITLE = "The Architecture — 1 · 17 · 3,350";
const DESC =
  "The Metatron 7-position governance model, the four unnamed Constitutional Guardrails, and the 3,350-county Human Blockchain that coordinates the insurance-restoration market.";

export const Route = createFileRoute("/architecture")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/architecture" }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const center = BRANDS.find((b) => b.vertical === "Center")!;
  const outer = BRANDS.filter((b) => b.vertical !== "Center");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Briefing · Architecture"
        title="The Human Blockchain — 1 protocol, 17 roles, 3,350 counties."
        lede="A discovered pattern, not an academic theory. Twenty-five years of operational survival in the field, translated into a geometry that cannot be captured by any single interest."
        confidentiality="C0"
        truth="ASSERTION"
      />

      <Section number="01" title="The seven founding stakeholder groups">
        <Prose>
          <p>
            The founding period is governed by a focused 7-position model:
            six outer institutional groups arranged around one central
            intelligence. The deeper architecture contains a 17-position
            model — expanded in a later sprint.
          </p>
        </Prose>

        <div className="mt-8 border border-border bg-muted/30 p-6">
          <div className="grid gap-3 md:grid-cols-3">
            {outer.slice(0, 3).map((b) => (
              <BrandCard key={b.id} slug={b.slug} vertical={b.vertical} name={b.brandName} role={b.verticalRole} />
            ))}
          </div>
          <div className="my-6 flex items-center justify-center">
            <div className="w-full max-w-sm border border-navy bg-background p-4 text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-silver">
                Center
              </div>
              <Link
                to="/b/$slug"
                params={{ slug: center.slug }}
                className="mt-1 block font-serif text-xl text-ink hover:text-navy"
              >
                {center.brandName}
              </Link>
              <div className="mt-1 text-xs text-muted-foreground">
                {center.verticalRole}
              </div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {outer.slice(3).map((b) => (
              <BrandCard key={b.id} slug={b.slug} vertical={b.vertical} name={b.brandName} role={b.verticalRole} />
            ))}
          </div>
        </div>
      </Section>

      <Section number="02" title="The four Angels — Constitutional Guardrails">
        <Prose>
          <p>
            Beyond the seven, the architecture is protected by four unnamed
            positions at the corners of the geometry. These Angels ensure
            the system cannot be corrupted or collapsed from within by any
            majority interest.
          </p>
          <p>
            They are intentionally unnamed in the founding period. They are
            structural, not personal.
          </p>
        </Prose>
      </Section>

      <Section number="03" title="1 protocol · 17 roles · 3,350 counties">
        <Prose>
          <p>
            The Human Blockchain maps 17 stakeholder roles across all 3,350
            U.S. counties. No single entity can capture or collapse the
            ecosystem because governance is rooted in the physical
            boundaries of the American county system.
          </p>
          <p>
            The counties are the nodes. The stakeholder groups are the
            protocol. The four Angels are the guardrails. Platform
            parasitism is replaced by a cooperative coordination protocol.
          </p>
        </Prose>
      </Section>

      <Section number="04" title="The Three-Layer Reveal">
        <Prose>
          <p>
            Every brand front door presents its content in the same
            disciplined order:
          </p>
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              <strong>Vertical</strong> — the market sector (the movie).
            </li>
            <li>
              <strong>Brand</strong> — the operating name (the movie after
              the movie).
            </li>
            <li>
              <strong>Domain</strong> — the digital real estate (the
              afterthought).
            </li>
          </ol>
          <p>
            Show domains first and the project reads as speculation. Show
            verticals first, then brands, then domains, and the systems
            strategist recognizes sovereign infrastructure that was always
            inevitable.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}

function BrandCard({
  slug,
  vertical,
  name,
  role,
}: {
  slug: string;
  vertical: string;
  name: string;
  role: string;
}) {
  return (
    <Link
      to="/b/$slug"
      params={{ slug }}
      className="block border border-border bg-background p-4 hover:border-ink"
    >
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-silver">
        {vertical}
      </div>
      <div className="mt-1 font-serif text-lg text-ink">{name}</div>
      <div className="mt-1 text-xs text-muted-foreground">{role}</div>
    </Link>
  );
}
