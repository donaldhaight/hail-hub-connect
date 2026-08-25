import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

const TITLE = "Set a new password";
const DESC = "Complete your password reset for the PrepareAmerica briefing room.";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: `${TITLE} — PrepareAmerica` },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase drops a recovery session via the URL hash. Wait for it.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/admin/inbox" }), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Access"
        title="Set a new password."
        lede="Complete your password reset. This link is single-use and expires."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="space-y-4 border border-border bg-card p-6">
          {done ? (
            <p className="text-sm text-ink">Password updated. Redirecting…</p>
          ) : !ready ? (
            <p className="text-sm text-silver">Verifying reset link…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  New password
                </span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  Confirm password
                </span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
                />
              </label>
              {error ? (
                <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-navy hover:border-navy disabled:opacity-60"
              >
                {busy ? "…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}
