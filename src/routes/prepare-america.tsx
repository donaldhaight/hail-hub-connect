import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import { AccessRequestForm } from "@/components/access/AccessRequestForm";
import { getPublicConferenceStatus } from "@/lib/conference.functions";
import { routeHead } from "@/lib/site";
import {
  FIRST_CONGRESS,
  SECOND_CONGRESS,
  SEASON_ONE,
  CONGRESS_VENUE,
  DELEGATE_CAPACITY,
  CONVENER,
  TICKET_TIERS,
} from "@/content/calendar";

const TITLE = "The First Congress";
const DESC = `The First Congress of PrepareAmerica. ${FIRST_CONGRESS.dateLabel}, streamed to invitation holders. A reveal, an announcement, and an invitation to the convened Second Congress.`;

export const Route = createFileRoute("/prepare-america")({
  head: () => {
    const base = routeHead({ title: TITLE, description: DESC, path: "/prepare-america" });
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "PrepareAmerica · The First Congress",
            description: DESC,
            startDate: FIRST_CONGRESS.opensOn,
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "VirtualLocation",
              url: "https://prepareamerica.com/prepare-america",
            },
            organizer: {
              "@type": "Organization",
              name: CONVENER,
              url: "https://prepareamerica.com",
            },
            isAccessibleForFree: false,
          }),
        },
      ],
    };
  },
  component: PrepareAmerica,
});

function PrepareAmerica() {
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="The First Congress"
        title="You need an invitation to receive the invitation."
        lede={`On ${FIRST_CONGRESS.dateLabel} the First Congress is streamed to invitation holders. It is a reveal, an announcement, and an invitation to the Second Congress — where three hundred delegates convene in person.`}
        confidentiality="C0"
        status="Invitation Only"
      />

      <Section number="01" title="The ladder">
        <ol className="divide-y divide-border border-y border-border">
          {[
            ["Referral", "Someone already inside puts your name forward."],
            ["First-Congress Invitation", `Access to the streamed event on ${FIRST_CONGRESS.dateLabel}.`],
            ["Second-Congress Invitation", `An invitation to the convened Second Congress, ${SECOND_CONGRESS.dateLabel}.`],
            ["Delegate Seat", `One of ${DELEGATE_CAPACITY} seats at ${CONGRESS_VENUE}.`],
            ["Season One", `Participation in the operating season, ${SEASON_ONE.dateLabel}.`],
          ].map(([label, note], i) => (
            <li key={label} className="grid grid-cols-12 items-baseline gap-6 py-6">
              <span className="col-span-2 font-mono text-xs text-silver md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-10 font-medium text-ink md:col-span-3">{label}</span>
              <span className="col-span-12 text-sm text-muted-foreground md:col-span-8">
                {note}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section number="02" title="The two congresses">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">First Congress</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">
              {FIRST_CONGRESS.dateLabel} · streamed
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Second Congress</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">
              {SECOND_CONGRESS.dateLabel} · {CONGRESS_VENUE}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Delegates</dt>
            <dd className="mt-2 font-serif text-2xl text-ink"><CapacityDisplay /></dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Convener</dt>
            <dd className="mt-2 font-serif text-2xl text-ink">{CONVENER}</dd>
          </div>
        </dl>
      </Section>

      <Section number="03" title="Admission tiers">
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {TICKET_TIERS.map((tier) => (
            <div key={tier.id} className="bg-background p-6">
              <div className="font-serif text-2xl text-ink">{tier.label}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tier.grants}
              </p>
              <dl className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between gap-4">
                  <dt className="font-mono uppercase tracking-[0.18em] text-silver">Term</dt>
                  <dd className="text-right text-ink">{tier.term}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono uppercase tracking-[0.18em] text-silver">Seat right</dt>
                  <dd className="text-right text-ink">{tier.seatRight ? "Standing" : "None"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono uppercase tracking-[0.18em] text-silver">Transfer</dt>
                  <dd className="text-right text-ink">
                    {tier.transferable === "with-approval" ? "With convener approval" : "Not transferable"}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <Prose>
          <p className="mt-6">
            Tiers describe what a holder is granted. Nothing here is priced,
            sold, or offered. Tiers are assigned by the convener on review.
          </p>
        </Prose>
      </Section>

      <Section number="04" title="Who is invited">
        <Prose>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>C-level industry executives from insurance, restoration, and construction</li>
            <li>Institutional investors and venture capital</li>
            <li>Contractors with capital and operational maturity</li>
            <li>Government think tanks and infrastructure policy advisors</li>
            <li>Counsel: construction, restructuring, securities, regulatory</li>
            <li>Strategic technology and integration partners</li>
          </ul>
        </Prose>
      </Section>

      <Section number="05" title="What will be presented">
        <Prose>
          <p>
            The RRCA case study, the current state of the ClaimExpress
            Protocol design, the entity and governance architecture of
            United Stakeholders of America, and the shape of Season One.
          </p>
          <p>
            All material will be presented with truth-classification labels.
            Nothing at the Congress will be sold, transacted, or publicly
            offered.
          </p>
        </Prose>
      </Section>

      <Section number="06" title="Request an invitation">
        <div className="grid gap-10 md:grid-cols-12">
          <aside className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              How review works
            </div>
            <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li><span className="mr-2 font-mono text-ink">01</span>The convener personally reviews every request.</li>
              <li><span className="mr-2 font-mono text-ink">02</span>Approved holders receive an invitation credential for the stream and access to the qualified-insider room.</li>
              <li><span className="mr-2 font-mono text-ink">03</span>Invitations are not first-come-first-served, and an invitation is not a delegate seat.</li>
            </ol>
            <div className="mt-8"><Meta status="No transaction · No offering" /></div>
          </aside>

          <div className="md:col-span-8">
            {submitted ? (
              <SubmittedNotice already={alreadySubmitted} />
            ) : (
              <AccessRequestForm
                defaultAsk="conference"
                submitLabel="Apply for an invitation"
                reviewerNote="Reviewed by the convener. No third-party marketing."
                acknowledgement="I acknowledge this is an application to a private convening and not an investment, sponsorship, or transaction. Nothing on this website is an offer to buy or sell securities."
                onSubmit={(already) => {
                  setAlreadySubmitted(already);
                  setSubmitted(true);
                }}
              />
            )}
          </div>
        </div>
      </Section>
    </PageShell>
  );
}


function SubmittedNotice({ already }: { already: boolean }) {
  return (
    <div className="border border-border bg-card p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Received</div>
      <h2 className="mt-3 font-serif text-3xl text-ink">
        {already ? "Your application is on file." : "Your application has been received."}
      </h2>
      <p className="mt-4 max-w-[52ch] text-muted-foreground">
        {already
          ? "We already have a recent application from this email. The convener will follow up directly if a seat is confirmed."
          : "The convener will review it personally. If a seat is confirmed you will receive a private invitation with logistics and insider-room access."}
      </p>
    </div>
  );
}


function CapacityDisplay() {
  const load = useServerFn(getPublicConferenceStatus);
  const [state, setState] = useState<{ total: number; confirmed: number; waitlisted: number; available: number } | null>(null);

  useEffect(() => {
    load().then(setState).catch(() => {});
  }, [load]);

  if (!state) return <span className="text-muted-foreground">{DELEGATE_CAPACITY} delegates — private</span>;

  return (
    <span>
      {state.confirmed} of {state.total} confirmed
      {state.waitlisted > 0 ? ` · ${state.waitlisted} waitlisted` : ""}
      {state.available > 0 ? ` · ${state.available} open` : " · sold out"}
    </span>
  );
}
