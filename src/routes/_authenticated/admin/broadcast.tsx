import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import {
  getBroadcastConfig,
  updateBroadcastConfig,
  transitionBroadcastState,
  toggleBroadcastChecklist,
} from "@/lib/broadcast.functions";

export const Route = createFileRoute("/_authenticated/admin/broadcast")({
  head: () => ({
    meta: [
      { title: "Broadcast Production — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BroadcastAdmin,
});

const PROVIDERS = [
  { id: "youtube", label: "YouTube Live" },
  { id: "vimeo", label: "Vimeo Live" },
  { id: "other", label: "Other / Custom embed" },
];

const STATES = [
  { id: "scheduled", label: "Scheduled", color: "bg-muted text-muted-foreground" },
  { id: "rehearsing", label: "Rehearsing", color: "bg-amber-100 text-amber-900" },
  { id: "live", label: "Live", color: "bg-red-600 text-white" },
  { id: "ended", label: "Ended", color: "bg-navy text-paper" },
];

function BroadcastAdmin() {
  const navigate = useNavigate();
  const load = useServerFn(getBroadcastConfig);
  const saveConfig = useServerFn(updateBroadcastConfig);
  const transition = useServerFn(transitionBroadcastState);
  const toggleCheck = useServerFn(toggleBroadcastChecklist);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [draft, setDraft] = useState({
    provider: "youtube",
    streamId: "",
    embedUrl: "",
    replayUrl: "",
    fallbackMessage: "",
  });

  useEffect(() => {
    load()
      .then((r) => {
        setConfig(r.config);
        setChecklist(r.checklist);
        setDraft({
          provider: r.config?.provider ?? "youtube",
          streamId: r.config?.stream_id ?? "",
          embedUrl: r.config?.embed_url ?? "",
          replayUrl: r.config?.replay_url ?? "",
          fallbackMessage: r.config?.fallback_message ?? "",
        });
        setAuthorized(true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setAuthorized(false);
      })
      .finally(() => setLoading(false));
  }, [load]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  async function handleSaveConfig() {
    setError(null);
    try {
      await saveConfig({ data: draft });
      const r = await load();
      setConfig(r.config);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function handleTransition(state: string) {
    setError(null);
    try {
      await transition({ data: { state: state as any } });
      const r = await load();
      setConfig(r.config);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transition failed");
    }
  }

  async function handleToggle(itemKey: string, checked: boolean) {
    try {
      await toggleCheck({ data: { itemKey, checked } });
      const r = await load();
      setChecklist(r.checklist);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checklist update failed");
    }
  }

  if (authorized === null || loading) {
    return (
      <PageShell>
        <div className="p-16 text-center text-silver">Loading…</div>
      </PageShell>
    );
  }

  if (!authorized) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede="Founder admin only." confidentiality="C2" />
        <div className="mx-auto max-w-md px-6 py-8">
          <button onClick={signOut} className="border border-ink px-4 py-2 text-sm">Sign out</button>
        </div>
      </PageShell>
    );
  }

  const currentState = STATES.find((s) => s.id === (config?.state ?? "scheduled")) ?? STATES[0];
  const completedCount = checklist.filter((c) => c.checked_at).length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Controls"
        title="First Congress Broadcast Production"
        lede="Configure the stream, rehearse the page, control the state machine, and run the pre-event checklist."
        confidentiality="C2"
        status={currentState.label}
      />

      <section className="mx-auto max-w-6xl px-6 py-8">
        {error ? <div className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</div> : null}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/inbox"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              ← Founder Inbox
            </Link>
            <Link
              to="/admin/tickets"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Ticket ledger →
            </Link>
            <Link
              to="/admin/digest"
              className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-navy"
            >
              Digest →
            </Link>
          </div>
          <button onClick={signOut} className="text-xs text-silver hover:text-ink">Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Section number="01" title="Stream configuration">
              <div className="space-y-4">
                <label className="block text-xs">
                  <span className="font-mono uppercase tracking-[0.14em] text-silver">Provider</span>
                  <select
                    value={draft.provider}
                    onChange={(e) => setDraft({ ...draft, provider: e.target.value })}
                    className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs">
                  <span className="font-mono uppercase tracking-[0.14em] text-silver">Stream ID or video ID</span>
                  <input
                    value={draft.streamId}
                    onChange={(e) => setDraft({ ...draft, streamId: e.target.value })}
                    placeholder={draft.provider === "youtube" ? "dQw4w9WgXcQ" : "Vimeo video ID"}
                    className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-mono uppercase tracking-[0.14em] text-silver">Full embed URL (optional)</span>
                  <input
                    value={draft.embedUrl}
                    onChange={(e) => setDraft({ ...draft, embedUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-mono uppercase tracking-[0.14em] text-silver">Replay URL (shown after ended)</span>
                  <input
                    value={draft.replayUrl}
                    onChange={(e) => setDraft({ ...draft, replayUrl: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 w-full border border-border bg-paper px-2 py-1.5 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-mono uppercase tracking-[0.14em] text-silver">Fallback message</span>
                  <textarea
                    rows={2}
                    value={draft.fallbackMessage}
                    onChange={(e) => setDraft({ ...draft, fallbackMessage: e.target.value })}
                    className="mt-1 w-full border border-border bg-paper p-2 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </label>
                <button
                  onClick={handleSaveConfig}
                  className="border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink"
                >
                  Save stream config
                </button>
              </div>
            </Section>

            <Section number="02" title="State machine">
              <Prose>
                <p>
                  <strong>Scheduled</strong> shows the countdown. <strong>Rehearsing</strong> renders the stream embed
                  with a watermark for founders only. <strong>Live</strong> opens the stream to all ticket holders.
                  <strong>Ended</strong> switches to replay and the Second Congress invitation CTA.
                </p>
              </Prose>
              <div className="mt-4 flex flex-wrap gap-2">
                {STATES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleTransition(s.id)}
                    disabled={config?.state === s.id}
                    className={`border px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] ${
                      config?.state === s.id
                        ? `${s.color} border-transparent`
                        : "border-border text-muted-foreground hover:border-navy hover:text-ink"
                    }`}
                  >
                    {config?.state === s.id ? `● ${s.label}` : `Set ${s.label}`}
                  </button>
                ))}
              </div>
              <div className="mt-6 border border-border bg-card p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Public preview</div>
                <div className="mt-2 text-sm text-ink">
                  {config?.state === "scheduled" && "Ticket holders see the countdown."}
                  {config?.state === "rehearsing" && "Founders see the embed watermarked; public still sees countdown."}
                  {config?.state === "live" && "Ticket holders see the live stream embed."}
                  {config?.state === "ended" && "Ticket holders see replay + Second Congress CTA."}
                </div>
              </div>
            </Section>

            <Section number="03" title="Run of show editor">
              <Prose>
                <p>
                  Edit the sequence in the <Link to="/admin/inbox" className="underline">Founder Inbox → Itinerary</Link>{" "}
                  tab. Published items appear on the public broadcast page automatically.
                </p>
              </Prose>
            </Section>
          </div>

          <div className="lg:col-span-1">
            <div className="border border-border bg-card p-5">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Production checklist
              </div>
              <div className="mb-4 text-sm text-ink">
                {completedCount} of {checklist.length} complete
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <label
                    key={item.item_key}
                    className="flex items-start gap-3 border-b border-border pb-2 last:border-b-0 last:pb-0"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(item.checked_at)}
                      onChange={(e) => handleToggle(item.item_key, e.target.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className={`text-sm ${item.checked_at ? "text-ink line-through opacity-60" : "text-ink"}`}>
                        {item.label}
                      </div>
                      {item.checked_at ? (
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {new Date(item.checked_at).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border border-border bg-card p-5">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-silver">Test credential</div>
              <Prose>
                <p className="text-sm">
                  Open the broadcast room as a ticket holder to verify the embed, countdown, and CTA render correctly.
                </p>
              </Prose>
              <Link
                to="/first-congress"
                className="mt-4 inline-block border border-navy bg-navy px-3 py-1.5 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-ink hover:border-ink"
              >
                Open broadcast room
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
