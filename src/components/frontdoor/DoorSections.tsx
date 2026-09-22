import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Persona } from "@/content/personas";
import {
  captureEntryContext,
  readEntryContext,
  setEntryInterest,
  type EntryContext,
} from "@/lib/entry-context";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

/**
 * Positioning copy rendered beneath the canonical Door.
 *
 * All copy here is preview copy. Interest selection is an interest statement
 * only: it creates no role, credential, Stakeholder Group or permission.
 */
export function DoorSections({ persona }: { persona: Persona }) {
  const [context, setContext] = useState<EntryContext | null>(null);
  const [interest, setInterest] = useState<string | null>(null);

  useEffect(() => {
    if (!persona.promiseVersion) return;
    const captured = captureEntryContext({
      entryDoor: persona.wordmark,
      promiseVersion: persona.promiseVersion,
    });
    setContext(captured);
    setInterest(captured.interest);
  }, [persona.promiseVersion, persona.wordmark]);

  function choose(id: string) {
    setInterest(id);
    setContext(setEntryInterest(id) ?? readEntryContext());
  }

  const selected = persona.interest?.options.find((o) => o.id === interest) ?? null;

  if (!persona.sections?.length) return null;

  return (
    <div className="border-t border-border">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        {persona.sections.map((section) => (
          <section key={section.id} className="mb-16 last:mb-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                {section.eyebrow}
              </div>
              {section.label ? <Chip>{section.label}</Chip> : null}
            </div>
            <h2 className="mt-3 max-w-[24ch] font-serif text-3xl leading-snug tracking-tight text-ink">
              {section.title}
            </h2>
            {section.body.map((p, i) => (
              <p
                key={i}
                className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground"
              >
                {p}
              </p>
            ))}

            {section.items?.length ? (
              <dl className="mt-7 border-t border-border">
                {section.items.map((item) => (
                  <div key={item.term} className="border-b border-border py-5">
                    <dt className="font-serif text-xl text-ink">{item.term}</dt>
                    <dd className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                      {item.boundary ? (
                        <span className="mt-2 block border-l-2 border-ink pl-3 text-ink/85">
                          {item.boundary}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {section.steps?.length ? (
              <ol className="mt-7 space-y-4">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-ink/85">
                    <span className="font-mono text-[11px] text-silver">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[58ch]">{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}

        {persona.interest ? (
          <section className="mb-16 border border-border p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              Interest
            </div>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-ink">
              {persona.interest.intro}
            </h2>
            <p className="mt-3 max-w-[58ch] border-l-2 border-ink pl-4 text-sm leading-relaxed text-ink/85">
              {persona.interest.note}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {persona.interest.options.map((option) => {
                const on = option.id === interest;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(option.id)}
                    className={`border p-4 text-left transition-colors ${
                      on ? "border-ink bg-muted" : "border-border hover:border-ink"
                    }`}
                  >
                    <span className="font-serif text-lg text-ink">{option.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {option.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {context ? (
          <section className="mb-16 border border-dashed border-border p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Arrival context
              </div>
              <Chip>Captured · not stored</Chip>
            </div>
            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
              This is everything this door noticed about how you arrived. It stays in
              your browser. It is not written to any record, and it grants nothing.
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-2 font-mono text-[11px] sm:grid-cols-2">
              {(
                [
                  ["entry_door", context.entry_door],
                  ["campaign", context.campaign ?? "—"],
                  ["interest", context.interest ?? "—"],
                  ["promise_version", context.promise_version],
                  ["referral_source", context.referral_source ?? "—"],
                  ["captured_at", new Date(context.captured_at).toLocaleString()],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border/60 py-1">
                  <dt className="text-silver">{k}</dt>
                  <dd className="text-right text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="mb-12">
          <Link
            to="/request-briefing"
            search={{
              ask: "briefing" as const,
              door: persona.id,
              interest: selected?.id,
            }}
            className="inline-block border border-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-background"
          >
            Ask for a briefing →
          </Link>
          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            Every request is read by the founder personally. No request commits either
            party to a transaction or a business relationship.
          </p>
        </section>

        {persona.disclosure ? (
          <p className="max-w-[70ch] border-t border-border pt-6 text-xs leading-relaxed text-silver">
            {persona.disclosure}
          </p>
        ) : null}
      </div>
    </div>
  );
}
