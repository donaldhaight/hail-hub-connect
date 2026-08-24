import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QuantumSwitcher } from "./QuantumSwitcher";

const NAV = [
  { to: "/why-prepare-america", label: "The Thesis" },
  { to: "/briefing", label: "The Case Study" },
  { to: "/architecture", label: "The Architecture" },
  { to: "/prepare-america", label: "The Conference" },
  { to: "/founder", label: "Founder" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      setSignedIn(!!session);
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);
        setIsFounder((roles ?? []).some((r) => r.role === "founder_admin"));
      } else {
        setIsFounder(false);
      }
    }
    checkAuth();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
      if (!session) setIsFounder(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="ClaimStore Briefing Room — home">
          <span className="truncate font-serif text-xl leading-none text-ink">ClaimStore</span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-silver sm:inline">
            Briefing Room
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] text-muted-foreground transition-colors hover:text-ink"
              activeProps={{ className: "text-ink", "aria-current": "page" }}
            >
              {item.label}
            </Link>
          ))}
          <QuantumSwitcher />
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {signedIn ? (
            <>
              <Link
                to="/admin/tour"
                className="hidden text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink xl:inline"
              >
                Tour
              </Link>
              <Link
                to="/admin/digest"
                className="hidden text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink xl:inline"
              >
                Digest
              </Link>
              <Link
                to="/admin/inbox"
                className="hidden text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink xl:inline"
              >
                Inbox
              </Link>
              {isFounder ? (
                <Link
                  to="/admin/invite"
                  className="hidden border border-navy px-3 py-1.5 text-[12px] font-mono uppercase tracking-[0.14em] text-navy hover:bg-navy hover:text-paper xl:inline"
                >
                  Invite
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink xl:inline"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground hover:text-ink xl:inline"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/request-briefing"
            className="hidden items-center gap-2 border border-ink bg-ink px-3 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-navy hover:border-navy sm:inline-flex"
          >
            Request a Private Briefing
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/request-briefing"
            className="inline-flex shrink-0 items-center border border-ink bg-ink px-2.5 py-1.5 text-[11px] font-medium text-paper sm:hidden"
          >
            Briefing
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-border text-ink lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <ul className="divide-y divide-border">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 text-[15px] text-ink"
                    activeProps={{ "aria-current": "page" }}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className="text-silver">
                      →
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <QuantumSwitcher variant="mobile" />
              </li>
              {signedIn ? (
                <>
                  <li>
                    <Link
                      to="/admin/tour"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Tour
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/digest"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Digest
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/inbox"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Inbox
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                  {isFounder ? (
                    <li>
                      <Link
                        to="/admin/invite"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-navy"
                      >
                        Invite
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      Sign out
                      <span aria-hidden="true">→</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    Sign in
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
