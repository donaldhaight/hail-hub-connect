import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { Meta } from "@/components/briefing/Badges";
import {
  INTERESTS,
  briefingRequestSchema,
  type BriefingRequestInput,
} from "@/lib/briefing.schemas";
import { submitBriefingRequest } from "@/lib/briefing.functions";
import { routeHead } from "@/lib/site";

const TITLE = "Request a Private Briefing";
const DESC =
  "Request a private briefing on the RRCA restructuring and the ClaimStore proof of concept. Reviewed by the founder personally.";

const searchSchema = z.object({
  interest: z
    .enum(["investor", "sponsor", "partner", "counsel", "advisor", "prepare-america"])
    .optional(),
});

export const Route = createFileRoute("/request-briefing")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => routeHead({ title: TITLE, description: DESC, path: "/request-briefing" }),
  component: RequestBriefing,
});

function RequestBriefing() {
  const { interest } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Access"
        title="Request a private briefing."
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
                Approved participants receive access to the qualified-insider
                materials in the Briefing Room.
              </li>
            </ol>
            <div className="mt-8">
              <Meta status="No transaction · No offering" />
            </div>
          </aside>

          <div className="md:col-span-8">
            {submitted ? (
              <SubmittedNotice />
            ) : (
              <BriefingForm
                defaultInterest={interest}
                onSubmit={() => setSubmitted(true)}
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SubmittedNotice() {
  return (
    <div className="border border-border bg-card p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
        Received
      </div>
      <h2 className="mt-3 font-serif text-3xl text-ink">
        Your request has been received.
      </h2>
      <p className="mt-4 max-w-[52ch] text-muted-foreground">
        We will review it personally. If a briefing is appropriate you will
        hear from us within seven business days. Nothing you submitted has
        been shared outside the founder's review.
      </p>
    </div>
  );
}

function BriefingForm({
  defaultInterest,
  onSubmit,
}: {
  defaultInterest?: string;
  onSubmit: () => void;
}) {
  const submit = useServerFn(submitBriefingRequest);
  const [errors, setErrors] = useState<Partial<Record<keyof BriefingRequestInput, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, unknown>;

    const parsed = briefingRequestSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Partial<Record<keyof BriefingRequestInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof BriefingRequestInput;
        next[key] = err.message;
      });
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      await submit({ data: parsed.data });
      onSubmit();
    } catch (err) {
      setGlobalError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Full name"
          name="name"
          required
          maxLength={120}
          error={errors.name}
        />
        <Field
          label="Institutional email"
          name="email"
          type="email"
          required
          maxLength={255}
          error={errors.email}
        />
        <Field
          label="Organization"
          name="organization"
          required
          maxLength={160}
          error={errors.organization}
        />
        <Field
          label="Title / role"
          name="title"
          required
          maxLength={160}
          error={errors.title}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          Primary interest
        </legend>
        {errors.interest ? (
          <p className="text-sm text-destructive">{errors.interest}</p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {INTERESTS.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 border border-border bg-card p-3 text-sm hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy/5"
            >
              <input
                type="radio"
                name="interest"
                value={opt.id}
                defaultChecked={defaultInterest === opt.id}
                required
                className="mt-1 accent-navy"
              />
              <span className="text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="requestedRole"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver"
        >
          Stakeholder Group requested (optional)
        </label>
        <select
          id="requestedRole"
          name="requestedRole"
          defaultValue=""
          className="mt-2 block w-full border border-border bg-card px-3 py-2.5 text-[15px] text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        >
          <option value="">No preference — you decide</option>
          {REQUESTABLE_ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-muted-foreground">
          Roles are granted by the founder personally. Nobody self-certifies.
        </p>
      </div>

      <input type="hidden" name="anchor" value={anchor} />

      <div>


        <label
          htmlFor="context"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver"
        >
          Context (optional)
        </label>
        <textarea
          id="context"
          name="context"
          rows={5}
          maxLength={1500}
          placeholder="Referral source, the specific question you want to explore, or the outcome you're evaluating."
          className="mt-2 block w-full border border-border bg-card p-3 text-[15px] leading-relaxed text-ink placeholder:text-silver focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
        {errors.context ? (
          <p className="mt-1 text-sm text-destructive">{errors.context}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="acknowledged"
          required
          className="mt-1 accent-navy"
        />
        <span>
          I acknowledge this is a private briefing request and not an
          investment, sponsorship, or transaction. Nothing on this website is
          an offer to buy or sell securities.
        </span>
      </label>
      {errors.acknowledged ? (
        <p className="text-sm text-destructive">{errors.acknowledged}</p>
      ) : null}

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
          {isSubmitting ? "Submitting…" : "Submit request"}
          <span aria-hidden="true">→</span>
        </button>
        <span className="text-xs text-muted-foreground">
          Reviewed by the founder. No third-party marketing.
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
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
