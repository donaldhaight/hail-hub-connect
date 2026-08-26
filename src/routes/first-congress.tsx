import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { getTicketView } from "@/lib/ticket.functions";
import { getBroadcastState, getServerTime, verifyFounderForRehearsal } from "@/lib/broadcast.functions";
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
const DESC = `A streamed reveal on ${FIRST_CONGRESS.dateLabel}. Invitation holders only.`;

export const Route = createFileRoute("/first-congress")({
  validateSearch: z.object({
    t: z.string().optional(),
    rehearse: z.union([z.boolean(), z.literal("true")]).optional().catch(undefined),
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

const START = new Date(`${FIRST_CONGRESS.opensOn ?? "2026-11-01"}T00:00:00Z`).getTime();

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

function StreamEmbed({
  provider,
  streamId,
  embedUrl,
  replayUrl,
  fallback,
  ended,
}: {
  provider: string;
  streamId: string | null;
  embedUrl: string | null;
  replayUrl: string | null;
  fallback: string;
  ended: boolean;
}) {
  const src = ended ? replayUrl || embedUrl : embedUrl || buildEmbedUrl(provider, streamId);
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-dashed border-border bg-muted/30 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-silver">{fallback}</p>
      </div>
    );
  }
  return (
    <div className="relative aspect-video w-full border border-border bg-black">
      <iframe
        src={src}
        title="First Congress stream"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function buildEmbedUrl(provider: string, streamId: string | null) {
  if (!streamId) return null;
  if (provider === "youtube") return `https://www.youtube.com/embed/${streamId}?autoplay=1&rel=0`;
  if (provider === "vimeo") return `https://player.vimeo.com/video/${streamId}?autoplay=1`;
  return null;
}

function FirstCongressPage() {
  const search = Route.useSearch();
  const t = search.t;
  const rehearse = search.rehearse === true || search.rehearse === "true";
  const loadTicket = useServerFn(getTicketView);
  const loadBroadcast = useServerFn(getBroadcastState);
  const verifyRehearsal = useServerFn(verifyFounderForRehearsal);
  const clock = useCountdown();

  const { data: broadcast, isLoading: broadcastLoading } = useQuery({
    queryKey: ["broadcast-state"],
    queryFn: () => loadBroadcast(),
  });

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", t],
    queryFn: () => loadTicket({ data: { credential: t as string } }),
    enabled: Boolean(t),
    retry: false,
  });

  const { data: rehearsal } = useQuery({
    queryKey: ["broadcast-rehearsal"],
    queryFn: () => verifyRehearsal(),
    enabled: Boolean(rehearse),
    retry: false,
  });

  const loading = broadcastLoading || ticketLoading;
  const state = broadcast?.config?.state ?? "scheduled";
  const isRehearsingFounder = state === "rehearsing" && rehearsal?.ok;
  const showStream = state === "live" || state === "ended" || isRehearsingFounder;
  const stakeholder = ticket?.ok && ticket.tier === "stakeholder";

  if (loading) {
    return (
      <PageShell>
        <PageHeader eyebrow="First Congress" title="Checking your invitation…" confidentiality="C1" />
      </PageShell>
    );
  }

  if (!t) return <Locked reason="no_credential" />;
  if (!ticket?.ok) return <Locked reason={ticket?.reason ?? "not_found"} />;

  const tier = TICKET_TIERS.find((x) => x.id === ticket.tier);
  const statusLabel = isRehearsingFounder ? "Rehearsal" : state === "live" ? "In session" : state === "ended" ? "Ended" : "Scheduled";

  return (
    <PageShell>
      <PageHeader
        eyebrow={`${CONVENER} · ${tier?.label ?? "Observer"}`}
        title="The First Congress."
        lede={`${FIRST_CONGRESS.dateLabel}. Streamed to invitation holders. A reveal, an announcement, and an invitation.`}
        confidentiality="C1"
        status={statusLabel}
      />

      {isRehearsingFounder ? (
        <div className="fixed inset-x-0 top-0 z-50 bg-amber-500 text-center text-[10px] font-mono uppercase tracking-[0.22em] text-white py-1">
          Rehearsal mode — founders only
        </div>
      ) : null}

      <Section number="01" title={state === "live" ? "In session" : state === "ended" ? "Replay" : "Time to session"}>
        {state === "scheduled" ? (
          clock === null ? (
            <p className="font-mono text-sm text-silver">—</p>
          ) : clock.live ? (
            <Prose>
              <p>The session date has arrived. The stream will appear here as soon as the convener opens it.</p>
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
          )
        ) : null}

        {showStream ? (
          <div className="mt-6">
            <StreamEmbed
              provider={broadcast?.config?.provider ?? "youtube"}
              streamId={broadcast?.config?.stream_id ?? null}
              embedUrl={broadcast?.config?.embed_url ?? null}
              replayUrl={broadcast?.config?.replay_url ?? null}
              fallback={broadcast?.config?.fallback_message ?? "The stream will appear here when the session opens."}
              ended={state === "ended"}
            />
            {state === "live" ? (
              <div className="mt-3 inline-flex items-center gap-2 border border-red-600 bg-red-600 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.14em] text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Live
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 flex aspect-video w-full items-center justify-center border border-dashed border-border bg-muted/30">
            <p className="px-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-silver">
              {broadcast?.config?.fallback_message ?? `Stream opens ${FIRST_CONGRESS.dateLabel}`}
            </p>
          </div>
        )}
      </Section>

      <Section number="02" title="Run of show">
        {broadcast?.segments?.length ? (
          <div className="divide-y divide-border border border-border">
            {broadcast.segments.map((r: any) => (
              <div key={r.id} className="bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">{r.time_label}</span>
                  {r.segment_type && r.segment_type !== "segment" ? (
                    <span className="border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
                      {r.segment_type}
                    </span>
                  ) : null}
                  {r.duration_minutes ? (
                    <span className="text-[10px] text-muted-foreground">{r.duration_minutes} min</span>
                  ) : null}
                </div>
                <div className="mt-1 font-serif text-lg text-ink">{r.title}</div>
                {r.speaker ? <p className="text-xs text-muted-foreground">{r.speaker}</p> : null}
                {r.description ? <p className="mt-1 text-sm text-muted-foreground">{r.description}</p> : null}
                {r.location ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{r.location}</p>
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
            The Congress points at one document. The Owner's Manual of {CONVENER} carries the architecture, the seven
            stakeholder groups, the invitation ladder, and the season ladder in full.
          </p>
          <p>
            <Link to="/manual" className="underline">
              Open the Owner's Manual
            </Link>
          </p>
        </Prose>
      </Section>

      <Section number="04" title={state === "ended" ? "What follows now" : "What follows"}>
        <Prose>
          {state === "ended" ? (
            stakeholder ? (
              <p>
                The First Congress has ended. Your Stakeholder tier carries a standing right to a delegate seat at the
                Second Congress — {SECOND_CONGRESS.dateLabel}, {CONGRESS_VENUE}. The convener will send your seat
                confirmation directly. No application is required of you.
              </p>
            ) : (
              <>
                <p>
                  The First Congress has ended. Invitation holders may now apply for a delegate seat at the Second Congress —{" "}
                  {SECOND_CONGRESS.dateLabel}, {CONGRESS_VENUE}, three hundred delegates convened in person. An invitation is
                  not a delegate seat, and application does not imply admission.
                </p>
                <p>
                  <Link to="/prepare-america" className="underline">
                    Apply for an invitation
                  </Link>
                </p>
              </>
            )
          ) : stakeholder ? (
            <p>
              Your tier carries a standing right to a delegate seat at the Second Congress — {SECOND_CONGRESS.dateLabel},
              {CONGRESS_VENUE}. The convener will send your seat confirmation directly after the broadcast. No application
              is required of you.
            </p>
          ) : (
            <p>
              After the broadcast, holders may apply for a delegate seat at the Second Congress — {SECOND_CONGRESS.dateLabel},
              {CONGRESS_VENUE}, three hundred delegates convened in person. An invitation is not a delegate seat, and
              application does not imply admission.
            </p>
          )}
          <p>
            Delegates carry into Season One, which opens {SEASON_ONE.dateLabel} on an operating platform that already
            exists. The handoff instructions are issued with the seat confirmation.
          </p>
        </Prose>
      </Section>

      <Section number="05" title="Terms of this page">
        <Prose>
          <p>
            Your credential is your admission. Do not post or forward this link. Nothing here is a security, an offering,
            or a transaction.
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
            ? "Your request is on file but no invitation has been issued yet."
            : "The First Congress is streamed to invitation holders. Open this page from the link in your invitation."
        }
        confidentiality="C1"
      />
      <Section number="01" title="How to obtain an invitation">
        <Prose>
          <p>
            Invitations are issued by the convener to referred and qualified names.{" "}
            <Link to="/prepare-america" className="underline">
              Request an invitation
            </Link>
            .
          </p>
        </Prose>
      </Section>
    </PageShell>
  );
}
