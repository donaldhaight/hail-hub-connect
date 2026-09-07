import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import { AccessRequestForm } from "@/components/access/AccessRequestForm";
import type { AccessAskId } from "@/lib/briefing.schemas";
import { routeHead } from "@/lib/site";

const TITLE = "Request Access";
const DESC =
  "Request a private briefing on the RRCA restructuring and the ClaimStore proof of concept, or an invitation to the Congress. Reviewed by the founder personally.";

const searchSchema = z.object({
  ask: z.enum(["briefing", "conference", "both"]).optional(),
});

export const Route = createFileRoute("/request-briefing")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => routeHead({ title: TITLE, description: DESC, path: "/request-briefing" }),
  component: RequestAccess,
});

function RequestAccess() {
  const { ask } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [already, setAlready] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Access"
        title="Ask for a briefing, an invitation, or both."
        lede="Reviewed by the founder. Approved requests receive a follow-up within seven business days. No approval commits either party to a transaction or business relationship."
        confidentiality="C0"
      />

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:py-20">
          <aside className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              What happens next
            </div>
            <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li>
                <span className="mr-2 font-mono text-ink">01</span>
                We review your request personally.
              </li>
              <li>
                <span className="mr-2 font-mono text-ink">02</span>
                If appropriate, we schedule a private briefing and — where
                needed — send a mutual confidentiality agreement.
              </li>
              <li>
                <span className="mr-2 font-mono text-ink">03</span>
                On acceptance the founder places you in a stakeholder group and
                issues your invitation. Nobody self-certifies.
              </li>
            </ol>
            <div className="mt-8">
              <Meta status="No transaction · No offering" />
            </div>
          </aside>

          <div className="md:col-span-8">
            {submitted ? (
              <SubmittedNotice already={already} />
            ) : (
              <AccessRequestForm
                defaultAsk={(ask as AccessAskId | undefined) ?? "briefing"}
                onSubmit={(dup) => {
                  setAlready(dup);
                  setSubmitted(true);
                }}
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SubmittedNotice({ already }: { already: boolean }) {
  return (
    <div className="border border-border bg-card p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
        Received
      </div>
      <h2 className="mt-3 font-serif text-3xl text-ink">
        {already ? "Your request is already on file." : "Your request has been received."}
      </h2>
      <p className="mt-4 max-w-[52ch] text-muted-foreground">
        {already
          ? "We already have a recent request from this email. The founder will follow up directly."
          : "We will review it personally. If a briefing is appropriate you will hear from us within seven business days. Nothing you submitted has been shared outside the founder's review."}
      </p>
    </div>
  );
}
