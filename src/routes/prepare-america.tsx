import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PageShell, PageHeader, Section, Prose } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import {
  CONFERENCE_CATEGORIES,
  conferenceApplicationSchema,
  type ConferenceApplicationInput,
} from "@/lib/briefing.schemas";
import { submitConferenceApplication } from "@/lib/briefing.functions";
import { getPublicConferenceStatus } from "@/lib/conference.functions";

const TITLE = "PrepareAmerica Conference";
const DESC =
  "The first annual PrepareAmerica Conference. 300 seats. Private. Gratitude Ranch, Flower Mound, Texas. November 1, 2026.";

export const Route = createFileRoute("/prepare-america")({
  head: () => ({
    meta: [
      { title: `${TITLE} — ClaimStore Briefing Room` },
      { name: "description", content: DESC },
      { property: "og:title", content: `${TITLE} — ClaimStore Briefing Room` },
      { property: "og:description", content: DESC },
    ],
  }),
  component: PrepareAmerica,
});

function PrepareAmerica() {
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Convening"
        title="PrepareAmerica · The first annual convening."
        lede="A private convening of 300 industry executives, counsel, capital, and government advisors. Held once per year to review the ClaimStore proof of concept in the open."
        confidentiality="C0"
        status="Invitation Only"
      />

      <Section number="01" title="The details">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            ["Date", "November 1, 2026"],
            ["Location", "Gratitude Ranch, Flower Mound, Texas"],
            ["Capacity", "300 seats — private"],
            ["Convener", "United Stakeholders of America LLC"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                {k}
              </dt>
              <dd className="mt-2 font-serif text-2xl text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section number="02" title="Who is invited">
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

      <Section number="03" title="What will be presented">
        <Prose>
          <p>
            The RRCA case study, the current state of the ClaimExpress
            Protocol design, the entity and governance architecture of
            United Stakeholders of America, and the proposed sponsorship
            pathways for ClaimStore.
          </p>
          <p>
            All material will be presented with truth-classification labels.
            Nothing at the convening will be sold, transacted, or publicly
            offered.
          </p>
        </Prose>
      </Section>

      <Section number="04" title="Apply for an invitation">
        <div className="grid gap-10 md:grid-cols-12">
          <aside className="md:col-span-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              How review works
            </div>
            <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li><span className="mr-2 font-mono text-ink">01</span>The convener personally reviews every application.</li>
              <li><span className="mr-2 font-mono text-ink">02</span>Confirmed attendees receive a private invitation with logistics and access to the qualified-insider room.</li>
              <li><span className="mr-2 font-mono text-ink">03</span>Seating is not first-come-first-served.</li>
            </ol>
            <div className="mt-8"><Meta status="No transaction · No offering" /></div>
          </aside>

          <div className="md:col-span-8">
            {submitted ? (
              <SubmittedNotice already={alreadySubmitted} />
            ) : (
              <ApplicationForm
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

function ApplicationForm({ onSubmit }: { onSubmit: (already: boolean) => void }) {
  const submit = useServerFn(submitConferenceApplication);
  const [errors, setErrors] = useState<Partial<Record<keyof ConferenceApplicationInput, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, unknown>;
    const parsed = conferenceApplicationSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Partial<Record<keyof ConferenceApplicationInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof ConferenceApplicationInput;
        next[key] = err.message;
      });
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      const r = await submit({ data: parsed.data });
      onSubmit(!!r.alreadySubmitted);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" name="name" required maxLength={120} error={errors.name} />
        <Field label="Institutional email" name="email" type="email" required maxLength={255} error={errors.email} />
        <Field label="Organization" name="organization" required maxLength={160} error={errors.organization} />
        <Field label="Title / role" name="title" required maxLength={160} error={errors.title} />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Category
        </legend>
        {errors.category ? <p className="text-sm text-destructive">{errors.category}</p> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {CONFERENCE_CATEGORIES.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 border border-border bg-card p-3 text-sm hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy/5"
            >
              <input type="radio" name="category" value={opt.id} required className="mt-1 accent-navy" />
              <span className="text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Referral (optional)" name="referral" maxLength={200} error={errors.referral} />

      <div>
        <label htmlFor="context" className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Why you want a seat (optional)
        </label>
        <textarea
          id="context"
          name="context"
          rows={5}
          maxLength={1500}
          placeholder="The specific question, decision, or outcome that draws you to the convening."
          className="mt-2 block w-full border border-border bg-card p-3 text-[15px] leading-relaxed text-ink placeholder:text-silver focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
        {errors.context ? <p className="mt-1 text-sm text-destructive">{errors.context}</p> : null}
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="acknowledged" required className="mt-1 accent-navy" />
        <span>
          I acknowledge this is an application to a private convening and not an
          investment, sponsorship, or transaction. Nothing on this website is an
          offer to buy or sell securities.
        </span>
      </label>
      {errors.acknowledged ? <p className="text-sm text-destructive">{errors.acknowledged}</p> : null}

      {globalError ? (
        <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {globalError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-navy hover:border-navy disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : "Apply for an invitation"}
          <span aria-hidden="true">→</span>
        </button>
        <span className="text-xs text-muted-foreground">
          Reviewed by the convener. No third-party marketing.
        </span>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", required, maxLength, error,
}: {
  label: string; name: string; type?: string; required?: boolean; maxLength?: number; error?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={maxLength}
        aria-invalid={!!error}
        className={`mt-2 block w-full border bg-card px-3 py-2.5 text-[15px] text-ink placeholder:text-silver focus:outline-none focus:ring-1 focus:ring-navy ${error ? "border-destructive focus:border-destructive" : "border-border focus:border-navy"}`}
      />
      {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
    </label>
  );
}
