import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { getTicketView } from "@/lib/ticket.functions";
import { routeHead } from "@/lib/site";
import {
  FIRST_CONGRESS,
  SECOND_CONGRESS,
  CONGRESS_VENUE,
  TICKET_TIERS,
} from "@/content/calendar";

const TITLE = "Your Ticket";
const DESC = `Your ticket to the First Congress — ${FIRST_CONGRESS.dateLabel}.`;

export const Route = createFileRoute("/ticket/$credential")({
  head: () => {
    const base = routeHead({ title: TITLE, description: DESC, path: "/ticket" });
    return {
      ...base,
      meta: [...base.meta, { name: "robots", content: "noindex, nofollow" }],
    };
  },
  component: TicketPage,
});

function TicketPage() {
  const { credential } = Route.useParams();
  const load = useServerFn(getTicketView);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ticket", credential],
    queryFn: () => load({ data: { credential } }),
    retry: false,
  });

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Ticket" title="Opening your ticket…" confidentiality="C1" />
      </PageShell>
    );
  }

  if (isError || !data?.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Ticket"
          title="This ticket is not open."
          lede={
            data?.reason === "not_approved"
              ? "Your request is on file but has not been approved yet. The convener reviews every request personally."
              : "We could not find a ticket for this link. Check that you opened the full link from your invitation."
          }
          confidentiality="C1"
        />
        <Section number="01" title="What to do">
          <Prose>
            <p>
              If you believe this is a mistake,{" "}
              <Link to="/request-briefing" className="underline">
                contact the convener
              </Link>
              .
            </p>
          </Prose>
        </Section>
      </PageShell>
    );
  }

  const tier = TICKET_TIERS.find((t) => t.id === data.tier);

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Ticket · ${tier?.label ?? "Observer"}`}
        title={`${data.name ?? "You"} are admitted to the First Congress.`}
        lede={`${FIRST_CONGRESS.dateLabel}. Streamed. This link is yours — it is how you enter.`}
        confidentiality="C1"
        status="Ticket Issued"
      />

      <Section number="01" title="Your ticket">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Holder</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">{data.name}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Organization</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">{data.organization ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Tier</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">{tier?.label ?? "Observer"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Occasion</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">{FIRST_CONGRESS.dateLabel}</dd>
          </div>
        </dl>
        {tier ? (
          <Prose>
            <p className="mt-8">{tier.grants}</p>
            <p>
              Term: {tier.term}{" "}
              {tier.transferable === "with-approval"
                ? "This ticket may be transferred with the convener's approval."
                : "This ticket is not transferable."}
            </p>
          </Prose>
        ) : null}
      </Section>

      <Section number="02" title="What happens next">
        <Prose>
          <p>
            On {FIRST_CONGRESS.dateLabel} the First Congress is streamed to
            ticket holders. It is a reveal, an announcement, and an invitation.
          </p>
          <p>
            {data.tier === "stakeholder"
              ? `Your tier carries a standing right to a delegate seat at the Second Congress — ${SECOND_CONGRESS.dateLabel}, ${CONGRESS_VENUE}.`
              : `After the broadcast, holders may apply for an invitation to the Second Congress — ${SECOND_CONGRESS.dateLabel}, ${CONGRESS_VENUE}. A ticket is not a delegate seat.`}
          </p>
        </Prose>
      </Section>

      <Section number="03" title="Keep this link private">
        <Prose>
          <p>
            This link is your credential. Do not post or forward it. Nothing on
            this page is a security, an offering, or a transaction.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
