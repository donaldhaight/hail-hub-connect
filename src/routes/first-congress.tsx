import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { getTicketView } from "@/lib/ticket.functions";
import { listPublishedItinerary } from "@/lib/attendee.functions";
import { routeHead } from "@/lib/site";
import {
  FIRST_CONGRESS,
  SECOND_CONGRESS,
  SEASON_ONE,
  CONGRESS_VENUE,
  CONVENER,
  TICKET_TIERS,
} from "@/content/calendar";

const TITLE = "The First Congress";
const DESC = `A streamed reveal on ${FIRST_CONGRESS.dateLabel}. Ticket holders only.`;

export const Route = createFileRoute("/first-congress")({
  validateSearch: (s: Record<string, unknown>) => ({
    t: typeof s.t === "string" ? s.t : undefined,
  }),
  head: () => {
    const base = routeHead({ title: TITLE, description: DESC, path: "/first-congress" });
    return {
      ...base,
      meta: [...base.meta, { name: "robots", content: "noindex, nofollow" }],
    };
  },
  component: FirstCongressPage,
});

const START = new Date(`${FIRST_CONGRESS.opens}T00:00:00Z`).getTime();

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return null;
  const ms = START - now;
  if (ms <= 0) return { live: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    live: false,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

function FirstCongressPage() {
  const { t } = Route.useSearch();
  const load = useServerFn(getTicketView);
  const listItin = useServerFn(listPublishedItinerary);
  const clock = useCountdown();

  const { data, isLoading } = useQuery({
    queryKey: ["ticket", t],
    queryFn: () => load({ data: { credential: t as string } }),
    enabled: Boolean(t),
    retry: false,
  });

  const { data: itin } = useQuery({
    queryKey: ["itinerary-public"],
    queryFn: () => listItin(),
    enabled: Boolean(data?.ok),
  });

  if (!t) return <Locked reason="no_credential" />;
  if (isLoading) {
    return (
      <PageShell>
        <PageHeader eyebrow="First Congress" title="Checking your ticket…" confidentiality="C1" />
      </PageShell>
    );
  }
  if (!data?.ok) return <Locked reason={data?.reason ?? "not_found"} />;

  const tier = TICKET_TIERS.find((x) => x.id === data.tier);
  const stakeholder = data.tier === "stakeholder";

  return (
    <PageShell>
      <PageHeader
        eyebrow={`${CONVENER} · ${tier?.label ?? "Observer"}`}
        title="The First Congress."
        lede={`${FIRST_CONGRESS.dateLabel}. Streamed to ticket holders. A reveal, an announcement, and an invitation.`}
        confidentiality="C1"
        status={clock?.live ? "In session" : "Scheduled"}
      />

      <Section number="01" title={clock?.live ? "In session" : "Time to session"}>
        {clock === null ? (
          <p className="font-mono text-sm text-silver">—</p>
        ) : clock.live ? (
          <Prose>
            <p>
              The session is open. If the stream has not yet appeared below,
              hold this page — it will not require a reload.
            </p>
          </Prose>
        ) : (
          <div className="flex flex-wrap gap-8">
            {[
              ["Days", clock.days],
              ["Hours", clock.hours],
              ["Minutes", clock.minutes],
              ["Seconds", clock.seconds],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <div className="font-serif text-5xl tabular-nums text-ink">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex aspect-video w-full items-center justify-center border border-dashed border-border bg-muted/30">
          <p className="px-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-silver">
            {clock?.live ? "Stream" : `Stream opens ${FIRST_CONGRESS.dateLabel}`}
          </p>
        </div>
      </Section>

      <Section number="02" title="Run of show">
        {itin?.rows?.length ? (
          <div className="divide-y divide-border border border-border">
            {itin.rows.map((r) => (
              <div key={r.id} className="bg-card p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
                  {r.time_label}
                </div>
                <div className="mt-1 font-serif text-lg text-ink">{r.title}</div>
                {r.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                ) : null}
                {r.location ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    {r.location}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            The run of show is published here as the convener finalizes it.
          </div>
        )}
      </Section>

      <Section number="03" title="Read before the session">
        <Prose>
          <p>
            The Congress points at one document. The Owner's Manual of{" "}
            {CONVENER} carries the architecture, the seven stakeholder groups,
            the invitation ladder, and the season ladder in full.
          </p>
          <p>
            <Link to="/manual" className="underline">
              Open the Owner's Manual
            </Link>
          </p>
        </Prose>
      </Section>

      <Section number="04" title="What follows">
        <Prose>
          {stakeholder ? (
            <p>
              Your tier carries a standing right to a delegate seat at the
              Second Congress — {SECOND_CONGRESS.dateLabel}, {CONGRESS_VENUE}.
              The convener will send your seat confirmation directly after the
              broadcast. No application is required of you.
            </p>
          ) : (
            <p>
              After the broadcast, holders may apply for an invitation to the
              Second Congress — {SECOND_CONGRESS.dateLabel}, {CONGRESS_VENUE},
              three hundred delegates convened in person. A ticket is not a
              delegate seat, and application does not imply admission.
            </p>
          )}
          <p>
            Delegates carry into Season One, which opens {SEASON_ONE.dateLabel}{" "}
            on an operating platform that already exists. The handoff
            instructions are issued with the seat confirmation.
          </p>
          {stakeholder ? null : (
            <p>
              <Link to="/prepare-america" className="underline">
                Apply for an invitation
              </Link>
            </p>
          )}
        </Prose>
      </Section>

      <Section number="05" title="Terms of this page">
        <Prose>
          <p>
            Your credential is your admission. Do not post or forward this link.
            Nothing here is a security, an offering, or a transaction.
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}

function Locked({ reason }: { reason: string }) {
  return (
    <PageShell>
      <PageHeader
        eyebrow="First Congress"
        title="This session is closed to you."
        lede={
          reason === "not_approved"
            ? "Your request is on file but no ticket has been issued yet."
            : "The First Congress is streamed to ticket holders. Open this page from the link in your ticket."
        }
        confidentiality="C1"
      />
      <Section number="01" title="How to obtain a ticket">
        <Prose>
          <p>
            Tickets are issued by the convener to referred and qualified names.{" "}
            <Link to="/prepare-america" className="underline">
              Request a ticket
            </Link>
            .
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
