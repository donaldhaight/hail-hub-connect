import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <>
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl leading-none text-ink">PrepareAmerica</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Convened by United Stakeholders of America LLC. The RRCA restructuring
              and the ClaimStore proof of concept, reviewed in the open. Circulated
              to referred insiders only.
            </p>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-silver">
              The Briefing
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/why-rrca" className="text-ink/80 hover:text-ink">Why RRCA</Link></li>
              <li><Link to="/industry-problem" className="text-ink/80 hover:text-ink">Industry Problem</Link></li>
              <li><Link to="/proof-of-concept" className="text-ink/80 hover:text-ink">Proof of Concept</Link></li>
              <li><Link to="/vision" className="text-ink/80 hover:text-ink">Vision</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-silver">
              Participate
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/prepare-america" className="text-ink/80 hover:text-ink">PrepareAmerica Conference</Link></li>
              <li><Link to="/why-prepare-america" className="text-ink/80 hover:text-ink">Why PrepareAmerica</Link></li>
              <li><Link to="/investors" className="text-ink/80 hover:text-ink">For Investors</Link></li>
              <li><Link to="/policy" className="text-ink/80 hover:text-ink">For Policy &amp; Government</Link></li>
              <li><Link to="/founder" className="text-ink/80 hover:text-ink">Founder Statement</Link></li>
              <li><Link to="/request-briefing" className="text-ink/80 hover:text-ink">Request a Briefing</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border px-6 py-6 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2026 United Stakeholders of America LLC. All rights reserved.</span>
          <span className="font-mono uppercase tracking-[0.16em]">
            Version 0.1 — Working Draft
          </span>
        </div>
      </footer>
      <div className="sticky bottom-0 z-30 border-t border-ink/20 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2 text-[10px] font-mono uppercase tracking-[0.22em]">
          <span>Confidential Working Concept — Not an Offering</span>
          <span className="hidden opacity-60 md:inline">Ref: CS-RRCA-0.1</span>
        </div>
      </div>
    </>
  );
}
