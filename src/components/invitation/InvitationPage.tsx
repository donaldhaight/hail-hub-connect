import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { getTicketView } from "@/lib/ticket.functions";
import {
  FIRST_CONGRESS,
  SECOND_CONGRESS,
  CONGRESS_VENUE,
  TICKET_TIERS,
} from "@/content/calendar";

export function InvitationPage({
  credential,
  mode,
}: {
  credential: string;
  mode: "ticket" | "invitation";
}) {
  const load = useServerFn(getTicketView);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invitation", credential],
    queryFn: () => load({ data: { credential } }),
    retry: false,
  });

  const noun = mode === "invitation" ? "Invitation" : "Ticket";
  const nounLower = mode === "invitation" ? "invitation" : "ticket";

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader eyebrow="First Congress" title={`Opening your ${nounLower}…`} confidentiality="C1" />
      </PageShell>
    );
  }

  if (isError || !data?.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="First Congress"
          title={`This ${nounLower} is not open.`}
          lede={
            data?.reason === "not_approved"
              ? "Your request is on file but has not been approved yet. The convener reviews every request personally."
              : `We could not find an ${mode === "invitation" ? "invitation" : "admission"} for this link. Check that you opened the full link from your message.`
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
        eyebrow={`${noun} · ${tier?.label ?? "Observer"}`}
        title={`${data.name ?? "You"} are admitted to the First Congress.`}
        lede={`${FIRST_CONGRESS.dateLabel}. Streamed. This link is yours — it is how you enter.`}
        confidentiality="C1"
        status={`${noun} Issued`}
      />

      <Section number="01" title={`Your ${nounLower}`}>
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
                ? `This ${nounLower} may be transferred with the convener's approval.`
                : `This ${nounLower} is not transferable.`}
            </p>
          </Prose>
        ) : null}
      </Section>

      <Section number="02" title="What happens next">
        <Prose>
          <p>
            On {FIRST_CONGRESS.dateLabel} the First Congress is streamed to admitted holders. It is a reveal, an
            announcement, and an invitation.
          </p>
          <p>
            {data.tier === "stakeholder"
              ? `Your tier carries a standing right to a delegate seat at the Second Congress — ${SECOND_CONGRESS.dateLabel}, ${CONGRESS_VENUE}.`
              : `After the broadcast, admitted holders may apply for an invitation to the Second Congress — ${SECOND_CONGRESS.dateLabel}, ${CONGRESS_VENUE}. An ${nounLower} is not a delegate seat.`}
          </p>
          <p>
            <Link to="/first-congress" search={{ t: credential }} className="underline">
              Open the broadcast room
            </Link>{" "}
            — the countdown, run of show, and stream live there.
          </p>
        </Prose>
      </Section>

      <Section number="03" title="Keep this link private">
        <Prose>
          <p>
            This link is your credential. Do not post or forward it. Nothing on this page is a security, an offering,
            or a transaction.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
