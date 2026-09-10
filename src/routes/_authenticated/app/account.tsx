import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/apphome/AppShell";
import { getAppHome } from "@/lib/apphome.functions";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVE_ROLE_KEY, roleLabel } from "@/lib/roles";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";
import { Meta } from "@/components/briefing/Badges";

export const Route = createFileRoute("/_authenticated/app/account")({
  head: () => ({
    meta: [
      { title: "Account — Kimosabe" },
      {
        name: "description",
        content:
          "Your identity, the roles you hold, and your wallet — the account behind the file.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

function AccountPage() {
  const navigate = useNavigate();
  const fetchHome = useServerFn(getAppHome);
  const { data, isLoading, error } = useQuery({
    queryKey: ["app-home"],
    queryFn: () => fetchHome(),
  });

  const roles = useMemo(() => data?.roles ?? [], [data]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  useEffect(() => {
    const stored = window.localStorage.getItem(ACTIVE_ROLE_KEY);
    if (stored) setActiveRole(stored);
  }, []);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwNote, setPwNote] = useState<string | null>(null);

  async function handlePasswordChange(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);
    setPwNote(null);
    if (newPw.length < 8) return setPwError("New password must be at least 8 characters.");
    if (newPw !== confirmPw) return setPwError("The two new passwords don't match.");
    if (!currentPw) return setPwError("Enter your current password.");
    setPwBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPw,
        // Required for signed-in changes; not used by recovery links.
        current_password: currentPw,
      } as Parameters<typeof supabase.auth.updateUser>[0]);
      if (error) throw error;
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwNote("Password updated.");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setPwBusy(false);
    }
  }

  async function handleForgot() {
    setPwError(null);
    setPwNote(null);
    const email = data?.email;
    if (!email) return setPwError("Your email is still loading. Try again in a moment.");
    setPwBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setPwNote("A reset link is on its way to your email.");
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Could not send the reset email.");
    } finally {
      setPwBusy(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <AppShell
      roles={roles}
      activeRole={activeRole}
      onSwitchRole={(r) => {
        setActiveRole(r);
        window.localStorage.setItem(ACTIVE_ROLE_KEY, r);
      }}
    >
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
              Account settings
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
              The name behind the file.
            </h1>
          </div>
          <Meta truth="FACT" confidentiality="C1" />
        </div>

        {error ? (
          <p className="text-muted-foreground">Your account could not be loaded.</p>
        ) : null}

        <div className="divide-y divide-border border border-border">
          <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              Identity
            </div>
            <div className="text-sm text-ink">{isLoading ? "…" : (data?.email ?? "—")}</div>
          </div>

          <div className="p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              Password
            </div>
            <form onSubmit={handlePasswordChange} className="max-w-sm space-y-3">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  Current password
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  New password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  Confirm new password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
                />
              </label>
              {pwError ? (
                <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {pwError}
                </div>
              ) : null}
              {pwNote ? (
                <div className="border border-border bg-paper p-3 text-sm text-ink/80">{pwNote}</div>
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={pwBusy}
                  className="border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:border-navy hover:bg-navy disabled:opacity-60"
                >
                  {pwBusy ? "…" : "Update password"}
                </button>
                <button
                  type="button"
                  onClick={handleForgot}
                  disabled={pwBusy}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver hover:text-ink disabled:opacity-60"
                >
                  Forgot it?
                </button>
              </div>
            </form>
          </div>


          <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              {PLATFORM_TOKEN} wallet
            </div>
            <div className="font-serif text-xl text-ink">
              {isLoading ? "…" : fmt(data?.balance ?? 0)}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              Roles held
            </div>
            {roles.length ? (
              <ul className="space-y-2">
                {roles.map((r) => (
                  <li key={r} className="text-sm text-ink">
                    {roleLabel(r)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No roles held yet. Introduce yourself and the founder can grant one.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
              Session
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="border border-border px-4 py-2 text-sm text-ink transition-colors hover:border-navy"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
