import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import {
  getAttendeeView,
  updateAttendeeDetails,
  listPublishedItinerary,
} from "@/lib/attendee.functions";
import { routeHead } from "@/lib/site";

const search = z.object({ t: z.string().uuid().optional() });

const TITLE = "Confirmed Attendee";
const DESC = "Your private page for the PrepareAmerica Conference — November 1, 2026.";

export const Route = createFileRoute("/prepare-america/confirmed")({
  validateSearch: (s) => search.parse(s),
  head: () => {
    const base = routeHead({ title: TITLE, description: DESC, path: "/prepare-america/confirmed" });
    return {
      ...base,
      meta: [...base.meta, { name: "robots", content: "noindex, nofollow" }],
    };
  },
  component: Confirmed,
});

function Confirmed() {
  const { t } = Route.useSearch();

  if (!t) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Private"
          title="This page needs your invitation link."
          lede="Confirmed attendees receive a personal link with an access token. Open it from your invitation email."
          confidentiality="C1"
        />
        <Section number="01" title="No token">
          <Prose>
            <p>
              If you believe this is a mistake,{" "}
              <Link to="/request-briefing" className="underline">contact the convener</Link>.
            </p>
          </Prose>
        </Section>
      </PageShell>
    );
  }

  return <ConfirmedLoaded token={t} />;
}

function ConfirmedLoaded({ token }: { token: string }) {
  const getView = useServerFn(getAttendeeView);
  const listItin = useServerFn(listPublishedItinerary);

  const view = useQuery({
    queryKey: ["attendee", token],
    queryFn: () => getView({ data: { token } }),
  });
  const itin = useQuery({
    queryKey: ["itinerary-public"],
    queryFn: () => listItin(),
  });

  if (view.isLoading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Private" title="Loading…" lede="Fetching your details." confidentiality="C1" />
      </PageShell>
    );
  }

  const data = view.data;
  if (!data || !data.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Private"
          title="This link is not valid."
          lede="The token was not recognized. Please use the exact link from your invitation, or contact the convener."
          confidentiality="C1"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow={`Confirmed · ${data.name ?? "Attendee"}`}
        title="You are confirmed."
        lede="November 1, 2026 · Gratitude Ranch, Flower Mound, Texas. This page is yours — update your logistics as anything changes."
        confidentiality="C1"
        status={data.seatStatus === "confirmed" ? "Seat Confirmed" : `Seat: ${data.seatStatus}`}
      />

      <Section number="01" title="Your seat">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Fact label="Name" value={data.name ?? "—"} />
          <Fact label="Organization" value={data.organization ?? "—"} />
          <Fact label="Email of record" value={data.email ?? "—"} />
          <Fact
            label="Confirmed"
            value={data.confirmedAt ? new Date(data.confirmedAt).toLocaleDateString() : "—"}
          />
        </dl>
      </Section>

      <Section number="02" title="Your logistics">
        {data.seatStatus === "confirmed" ? (
          <LogisticsForm
            token={token}
            initial={{
              plusOnes: data.plusOnes ?? 0,
              hotelNeeded: !!data.hotelNeeded,
              dietary: data.dietaryRestrictions ?? "",
              notes: data.attendeeNotes ?? "",
            }}
            onSaved={() => view.refetch()}
          />
        ) : (
          <Prose>
            <p>
              Your seat status is currently <strong>{data.seatStatus}</strong>. Logistics
              editing opens once your seat is confirmed.
            </p>
          </Prose>
        )}
      </Section>

      <Section number="03" title="Working itinerary">
        <ItineraryList rows={itin.data?.rows ?? []} loading={itin.isLoading} />
      </Section>

      <Section number="04" title="Insider room">
        <InsiderBridge attendeeEmail={data.email ?? ""} />
      </Section>
    </PageShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">{label}</dt>
      <dd className="mt-2 text-ink">{value}</dd>
    </div>
  );
}

type Initial = { plusOnes: number; hotelNeeded: boolean; dietary: string; notes: string };

function LogisticsForm({
  token,
  initial,
  onSaved,
}: {
  token: string;
  initial: Initial;
  onSaved: () => void;
}) {
  const update = useServerFn(updateAttendeeDetails);
  const [state, setState] = useState<Initial>(initial);
  const [msg, setMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      update({
        data: {
          token,
          plusOnes: state.plusOnes,
          hotelNeeded: state.hotelNeeded,
          dietary: state.dietary,
          notes: state.notes,
        },
      }),
    onSuccess: (r) => {
      if (r?.ok) {
        setMsg("Saved.");
        onSaved();
      } else {
        setMsg(r?.reason ?? "Save failed.");
      }
    },
    onError: (e: any) => setMsg(e?.message ?? "Save failed."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    mutation.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 border border-border bg-card p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
            Guests you'll bring (max 3)
          </span>
          <input
            type="number"
            min={0}
            max={3}
            value={state.plusOnes}
            onChange={(e) =>
              setState((s) => ({ ...s, plusOnes: Math.max(0, Math.min(3, Number(e.target.value) || 0)) }))
            }
            className="mt-2 w-full border border-input bg-background px-3 py-2 text-ink"
          />
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={state.hotelNeeded}
            onChange={(e) => setState((s) => ({ ...s, hotelNeeded: e.target.checked }))}
            className="mt-1"
          />
          <span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Hotel needed
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Check if you'd like the convener to hold hotel information for you.
            </span>
          </span>
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Dietary / accessibility notes
        </span>
        <textarea
          rows={2}
          value={state.dietary}
          onChange={(e) => setState((s) => ({ ...s, dietary: e.target.value }))}
          className="mt-2 w-full border border-input bg-background px-3 py-2 text-ink"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Anything else for the convener
        </span>
        <textarea
          rows={3}
          value={state.notes}
          onChange={(e) => setState((s) => ({ ...s, notes: e.target.value }))}
          className="mt-2 w-full border border-input bg-background px-3 py-2 text-ink"
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center border border-ink bg-ink px-4 py-2 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {mutation.isPending ? "Saving…" : "Save details"}
        </button>
        {msg ? <span className="text-sm text-muted-foreground">{msg}</span> : null}
      </div>
    </form>
  );
}

function ItineraryList({
  rows,
  loading,
}: {
  rows: Array<{
    id: string;
    time_label: string;
    title: string;
    description: string | null;
    location: string | null;
  }>;
  loading: boolean;
}) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading itinerary…</p>;
  if (rows.length === 0) {
    return (
      <Prose>
        <p>
          The working itinerary will be published here as the convener finalizes it.
          Check back — anything that changes will show up on this page.
        </p>
      </Prose>
    );
  }
  return (
    <ol className="divide-y divide-border border-y border-border">
      {rows.map((r) => (
        <li key={r.id} className="grid grid-cols-12 items-baseline gap-6 py-5">
          <span className="col-span-12 font-mono text-xs uppercase tracking-[0.14em] text-silver md:col-span-3">
            {r.time_label}
          </span>
          <div className="col-span-12 md:col-span-9">
            <div className="font-serif text-xl text-ink">{r.title}</div>
            {r.location ? (
              <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-silver">{r.location}</div>
            ) : null}
            {r.description ? (
              <p className="mt-2 text-ink/85 leading-relaxed">{r.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function InsiderBridge({ attendeeEmail }: { attendeeEmail: string }) {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSessionEmail(data.user?.email ?? null);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  const matches =
    sessionEmail && attendeeEmail && sessionEmail.toLowerCase() === attendeeEmail.toLowerCase();

  if (matches) {
    return (
      <div className="border border-border bg-card p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          You are signed in as {sessionEmail}
        </div>
        <p className="mt-3 text-ink">
          You also have access to the qualified-insider room — working dossiers, notes,
          and Q&amp;A with the convener.
        </p>
        <Link
          to="/insider"
          className="mt-4 inline-flex items-center gap-2 border border-ink bg-ink px-3 py-1.5 text-[12px] font-medium text-paper"
        >
          Open the Insider Room <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <Prose>
      <p>
        Sign in with the email on your invitation to access the qualified-insider room
        — dossiers, Q&amp;A, and notes from the convener.
      </p>
      <p>
        <Link to="/auth" className="underline">Sign in</Link>. If you have not been
        issued an insider invitation, the convener will follow up separately.
      </p>
    </Prose>
  );
}
