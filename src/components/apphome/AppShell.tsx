import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, Plus, X } from "lucide-react";
import { roleLabel } from "@/lib/roles";

export type AppNavLink = { label: string; href: string };

/** Base links every signed-in person sees. */
const BASE_LINKS: AppNavLink[] = [
  { label: "App Home", href: "/app" },
  { label: "Role Store", href: "/roles" },
  { label: "Kimosabe front door", href: "/kimosabe" },
  { label: "The Owner's Manual", href: "/manual" },
];

/** Role-shaped nav contents — what the person holds shapes what they receive. */
const ROLE_LINKS: Record<string, AppNavLink[]> = {
  founder_admin: [
    { label: "Access queue", href: "/admin/roles" },
    { label: "Platform ledger", href: "/ledger" },
    { label: "Broadcast control", href: "/admin/broadcast" },
    { label: "Situation Room", href: "/room" },
  ],
  isr: [{ label: "ISR certification", href: "/roles" }],
  qualified_insider: [{ label: "Situation Room", href: "/room" }],
};

function linksForRoles(roles: string[]): AppNavLink[] {
  const out = [...BASE_LINKS];
  for (const r of roles) {
    for (const l of ROLE_LINKS[r] ?? []) {
      if (!out.some((o) => o.href === l.href)) out.push(l);
    }
  }
  return out;
}

const COMING_SOON_APPS = ["BooksForge", "MusicApp", "MovieApp", "MyGPT.TV"];

/**
 * The App Home shell — desk-scale. One bar: nav menu upper left, search, New,
 * role settings, account settings. Footer: the app switcher. Same building as
 * the Situation Room; a different floor.
 */
export function AppShell({
  roles,
  activeRole,
  onSwitchRole,
  onSearch,
  children,
}: {
  roles: string[];
  activeRole: string | null;
  onSwitchRole: (role: string) => void;
  onSearch: (q: string) => void;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const links = linksForRoles(roles);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          {/* Nav menu — upper left */}
          <div className="relative">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => {
                setNavOpen((v) => !v);
                setNewOpen(false);
                setRoleOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center border border-border text-ink transition-colors hover:border-navy"
            >
              {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            {navOpen ? (
              <nav className="absolute left-0 top-11 z-50 w-64 border border-border bg-background shadow-lg">
                {links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    to={l.href}
                    onClick={() => setNavOpen(false)}
                    className="block border-b border-border/60 px-4 py-3 text-sm text-ink transition-colors last:border-b-0 hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <Link to="/app" className="font-serif text-lg tracking-tight text-ink">
            Kimosabe
          </Link>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-silver" />
            <input
              type="search"
              placeholder="Search your file"
              onChange={(e) => onSearch(e.target.value)}
              className="h-9 w-full border border-border bg-transparent pl-9 pr-3 text-sm text-ink placeholder:text-silver focus:border-navy focus:outline-none"
            />
          </div>

          {/* New */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNewOpen((v) => !v);
                setNavOpen(false);
                setRoleOpen(false);
              }}
              className="flex h-9 items-center gap-1.5 border border-border px-3 text-sm text-ink transition-colors hover:border-navy"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New</span>
            </button>
            {newOpen ? (
              <div className="absolute right-0 top-11 z-50 w-64 border border-border bg-background shadow-lg">
                <Link
                  to="/request-briefing"
                  onClick={() => setNewOpen(false)}
                  className="block border-b border-border/60 px-4 py-3 text-sm text-ink hover:bg-secondary"
                >
                  Request a role or invitation
                </Link>
                <Link
                  to="/roles"
                  onClick={() => setNewOpen(false)}
                  className="block px-4 py-3 text-sm text-ink hover:bg-secondary"
                >
                  Start a certification
                </Link>
              </div>
            ) : null}
          </div>

          {/* Role settings — switch roles */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRoleOpen((v) => !v);
                setNavOpen(false);
                setNewOpen(false);
              }}
              className="hidden h-9 items-center border border-border px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-silver transition-colors hover:border-navy hover:text-ink sm:flex"
            >
              {activeRole ? roleLabel(activeRole) : "Role settings"}
            </button>
            {roleOpen ? (
              <div className="absolute right-0 top-11 z-50 w-64 border border-border bg-background shadow-lg">
                <div className="border-b border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                  Switch role
                </div>
                {roles.length ? (
                  roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onSwitchRole(r);
                        setRoleOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-secondary ${
                        r === activeRole ? "font-medium text-navy" : "text-ink"
                      }`}
                    >
                      {roleLabel(r)}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No roles held yet.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Account settings */}
          <Link
            to="/ledger"
            className="hidden h-9 items-center border border-border px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-silver transition-colors hover:border-navy hover:text-ink md:flex"
          >
            Account
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-6">
          <Link
            to="/roles"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy hover:underline"
          >
            MarketApp
          </Link>
          {COMING_SOON_APPS.map((app) => (
            <span
              key={app}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver"
            >
              {app} · soon
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
