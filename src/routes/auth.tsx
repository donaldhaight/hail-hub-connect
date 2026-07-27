import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { claimFounderIfUnclaimed } from "@/lib/inbox.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

const TITLE = "Founder Sign In";
const DESC = "Private access to the ClaimStore founder inbox.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) redirectAfterAuth(navigate);
    });
  }, [navigate]);

  async function handleEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await redirectAfterAuth(navigate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      await redirectAfterAuth(navigate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign in failed");
      setBusy(false);
    }
  }

  async function handleForgot() {
    setError(null);
    setInfo(null);
    if (!email) {
      setError("Enter your email above, then click Forgot password.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setInfo("If an account exists for that email, a reset link is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Access"
        title="Founder sign in."
        lede="Private admin access. If you are the first sign-in on this project, you will be granted founder rights automatically."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-md px-6 py-16">
        <form onSubmit={handleEmail} className="space-y-4 border border-border bg-card p-6">
          <div className="flex gap-2 text-xs font-mono uppercase tracking-[0.18em]">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={mode === "signin" ? "text-ink" : "text-silver"}
            >
              Sign in
            </button>
            <span className="text-silver">/</span>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={mode === "signup" ? "text-ink" : "text-silver"}
            >
              Create account
            </button>
          </div>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full border border-border bg-paper px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none"
            />
          </label>
          {error ? (
            <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {info ? (
            <div className="border border-border bg-paper p-3 text-sm text-ink/80">
              {info}
            </div>
          ) : null}
          {mode === "signin" ? (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgot}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver hover:text-ink"
              >
                Forgot password?
              </button>
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-navy hover:border-navy disabled:opacity-60"
          >
            {busy ? "…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <div className="relative py-2 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">or</span>
          </div>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="w-full border border-border bg-paper px-5 py-3 text-sm font-medium text-ink hover:border-navy disabled:opacity-60"
          >
            Continue with Google
          </button>
        </form>
      </section>
    </PageShell>
  );
}

async function redirectAfterAuth(navigate: ReturnType<typeof useNavigate>) {
  try {
    await claimFounderIfUnclaimed();
  } catch {
    // ignore — non-fatal
  }
  navigate({ to: "/admin/inbox" });
}
