import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { redeemInsiderInvitation } from "@/lib/insider.functions";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

const TITLE = "Insider Access";
const DESC = "Redeem your qualified-insider invitation to the ClaimStore Briefing Room.";

export const Route = createFileRoute("/insider/accept")({
  validateSearch: (s) => z.object({ token: z.string().uuid().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: AcceptPage,
});

function AcceptPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const redeem = useServerFn(redeemInsiderInvitation);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleRedeem() {
    if (!token) return;
    setStatus("working");
    try {
      const r = await redeem({ data: { token } });
      if (r.ok) {
        setStatus("ok");
        setTimeout(() => navigate({ to: "/insider" }), 800);
        return;
      }
      setStatus("error");
      setMessage(
        r.reason === "email_mismatch"
          ? `This invitation is for ${r.expected}. Sign in with that email.`
          : r.reason === "expired"
          ? "This invitation has expired."
          : r.reason === "already_redeemed"
          ? "This invitation has already been redeemed."
          : r.reason === "revoked"
          ? "This invitation has been revoked."
          : "Invitation could not be redeemed.",
      );
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Redemption failed");
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insider access"
        title="Redeem your invitation."
        lede="Single-use, expiring access to the Qualified Insider Room. Confidentiality applies."
        confidentiality="C2"
      />
      <section className="mx-auto max-w-md px-6 py-16">
        <div className="space-y-4 border border-border bg-card p-6">
          {!token ? (
            <p className="text-sm text-destructive">Missing invitation token.</p>
          ) : signedIn === null ? (
            <p className="text-sm text-silver">Checking session…</p>
          ) : !signedIn ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sign in with the email on your invitation, then return to this page.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center border border-ink bg-ink px-4 py-2 text-sm text-paper hover:bg-navy hover:border-navy"
              >
                Sign in
              </Link>
            </>
          ) : status === "ok" ? (
            <p className="text-sm text-ink">Access granted. Redirecting…</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Click below to activate your insider access on this account.
              </p>
              <button
                onClick={handleRedeem}
                disabled={status === "working"}
                className="inline-flex items-center justify-center border border-ink bg-ink px-4 py-2 text-sm text-paper hover:bg-navy hover:border-navy disabled:opacity-60"
              >
                {status === "working" ? "Activating…" : "Activate insider access"}
              </button>
              {message ? (
                <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {message}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
