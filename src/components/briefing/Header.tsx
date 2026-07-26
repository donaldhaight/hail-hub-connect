import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/why-rrca", label: "Why RRCA" },
  { to: "/industry-problem", label: "Industry Problem" },
  { to: "/proof-of-concept", label: "Proof of Concept" },
  { to: "/vision", label: "Vision" },
  { to: "/prepare-america", label: "PrepareAmerica" },
  { to: "/founder", label: "Founder" },
] as const;

export function Header() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-xl leading-none text-ink">ClaimStore</span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-silver sm:inline">
            Briefing Room
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] text-muted-foreground transition-colors hover:text-ink"
              activeProps={{ className: "text-ink" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {signedIn ? (
            <Link
              to="/admin/inbox"
              className="text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
            >
              Inbox
            </Link>
          ) : null}
          <Link
            to="/request-briefing"
            className="inline-flex items-center gap-2 border border-ink bg-ink px-3 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-navy hover:border-navy"
          >
            Request a Private Briefing
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
