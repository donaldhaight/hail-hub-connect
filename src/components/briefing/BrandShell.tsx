import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "./PageShell";
import { StatusChip } from "./Badges";
import type { Brand } from "@/content/brands";

/**
 * BrandShell — a per-brand front door built on the shared PageShell.
 * Applies a brand-scoped accent via data-brand on the shell wrapper and
 * renders the Three-Layer Reveal hero (Vertical → Brand → Domain).
 */
export function BrandShell({
  brand,
  children,
}: {
  brand: Brand;
  children?: ReactNode;
}) {
  return (
    <PageShell>
      <div data-brand={brand.paletteToken} className="brand-scope">
        <BrandHero brand={brand} />
        {children}
        <ArchitectureFooter />
      </div>
    </PageShell>
  );
}

function BrandHero({ brand }: { brand: Brand }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-silver">
          <span>Quantum Dashboard · {brand.vertical}</span>
          <span aria-hidden>·</span>
          <StatusChip>{brand.status}</StatusChip>
        </div>

        {/* Layer 1 — Vertical (revealed first, largest) */}
        <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.28em] text-[color:var(--brand-accent)]">
          Vertical · Layer 1
        </div>
        <div className="font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
          {brand.vertical}
        </div>
        <p className="mt-2 max-w-[52ch] text-sm text-muted-foreground">
          {brand.verticalRole}
        </p>

        {/* Layer 2 — Brand */}
        <div className="mt-10 border-t border-border pt-8">
          <div className="mb-2 text-[11px] font-mono uppercase tracking-[0.28em] text-[color:var(--brand-accent)]">
            Brand · Layer 2
          </div>
          <div className="font-serif text-3xl leading-tight text-ink md:text-4xl">
            {brand.brandName}
          </div>
          <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            {brand.tagline}
          </p>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink/85">
            {brand.oneLineValue}
          </p>
        </div>

        {/* Layer 3 — Domain (the "afterthought") */}
        <div className="mt-10 border-t border-border pt-6">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.28em] text-silver">
            Domain · Layer 3
          </div>
          <div className="font-mono text-sm text-muted-foreground">
            {brand.domain}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/request-briefing"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
          >
            Request a private briefing
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/architecture"
            className="inline-flex items-center gap-2 border border-border px-4 py-2 text-[13px] text-ink transition-colors hover:border-ink"
          >
            See the architecture
          </Link>
        </div>

        <p className="mt-8 max-w-[62ch] text-xs italic text-silver">
          Presented in the order: Vertical → Brand → Domain. Substance
          precedes branding; branding precedes real estate.
        </p>
      </div>
    </section>
  );
}

function ArchitectureFooter() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-[11px] font-mono uppercase tracking-[0.22em] text-silver">
        <Link to="/architecture" className="hover:text-ink">
          1 protocol · 17 roles · 3,350 counties
        </Link>
        <span className="text-silver">
          Constitutional guardrails · four unnamed Angels
        </span>
      </div>
    </section>
  );
}
