import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Meta, type ConfidentialityClass, type TruthClass } from "./Badges";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
  truth,
  confidentiality,
  status,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  truth?: TruthClass;
  confidentiality?: ConfidentialityClass;
  status?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-silver">
          <span>{eyebrow}</span>
        </div>
        <h1 className="max-w-[22ch] font-serif text-4xl leading-[1.02] tracking-tight text-balance text-ink md:text-6xl">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-pretty text-muted-foreground">
            {lede}
          </p>
        ) : null}
        {truth || confidentiality || status ? (
          <div className="mt-8">
            <Meta truth={truth} confidentiality={confidentiality} status={status} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  number,
  title,
  children,
}: {
  number?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border last:border-b-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-12 md:py-20">
        {(number || title) && (
          <aside className="md:col-span-4">
            {number && (
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                {number}
              </div>
            )}
            {title && (
              <h2 className="max-w-xs font-serif text-2xl leading-tight text-ink md:text-3xl">
                {title}
              </h2>
            )}
          </aside>
        )}
        <div className={number || title ? "md:col-span-8" : "md:col-span-12"}>
          <div className="prose-briefing">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 text-[16px] leading-[1.65] text-ink/85 [&_p]:text-pretty [&_strong]:text-ink [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-4">
      {children}
    </div>
  );
}
