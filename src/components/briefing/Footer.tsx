import { Link } from "@tanstack/react-router";
import { DOORS } from "@/content/doors";

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-silver">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([to, label]) => (
          <li key={to}>
            <Link to={to as never} className="text-ink/80 hover:text-ink">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <>
      <footer className="mt-24 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl leading-none text-ink">PrepareAmerica</div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Convened by United Stakeholders of America LLC. The RRCA restructuring
              and the ClaimStore proof of concept, reviewed in the open. Circulated
              to referred insiders only.
            </p>
          </div>
          <FooterCol
            title="The Movement"
            links={[
              ["/why-prepare-america", "Why PrepareAmerica"],
              ["/prepare-america", "The First Congress"],
              ["/investors", "For Investors"],
              ["/policy", "For Policy & Government"],
              ["/founder", "Founder Statement"],
              ["/request-briefing", "Request a Briefing"],
            ]}
          />
          <FooterCol
            title="The Narrative"
            links={[
              ["/briefing", "The Case Study"],
              ["/why-rrca", "Why RRCA"],
              ["/industry-problem", "Industry Problem"],
              ["/proof-of-concept", "Proof of Concept"],
              ["/vision", "Vision"],
              ["/architecture", "Architecture"],
              ["/roles", "Roles"],
            ]}
          />
          <FooterCol
            title="The Doors"
            links={[["/doors", "All Doors"], ...DOORS.map((d) => [d.to, d.name] as [string, string])]}
          />
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
