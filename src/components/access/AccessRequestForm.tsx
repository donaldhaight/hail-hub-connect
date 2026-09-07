import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ACCESS_ASKS,
  accessRequestSchema,
  type AccessAskId,
  type AccessRequestInput,
} from "@/lib/briefing.schemas";
import { submitAccessRequest } from "@/lib/briefing.functions";

/**
 * The single request form. No self-classification: we ask for facts a person
 * cannot get wrong, and the Founder sets the group at acceptance.
 */
export function AccessRequestForm({
  defaultAsk = "briefing",
  submitLabel = "Submit request",
  reviewerNote = "Reviewed by the founder. No third-party marketing.",
  acknowledgement,
  onSubmit,
}: {
  defaultAsk?: AccessAskId;
  submitLabel?: string;
  reviewerNote?: string;
  acknowledgement?: string;
  onSubmit: (already: boolean) => void;
}) {
  const submit = useServerFn(submitAccessRequest);
  const [errors, setErrors] = useState<Partial<Record<keyof AccessRequestInput, string>>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // The Interested User file travels with the request when they came via Kimosabe.
  const [anchor, setAnchor] = useState("");

  useEffect(() => {
    setAnchor(window.localStorage.getItem("kimosabe.anchor") ?? "");
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData) as Record<string, unknown>;

    const parsed = accessRequestSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Partial<Record<keyof AccessRequestInput, string>> = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof AccessRequestInput;
        next[key] = err.message;
      });
      setErrors(next);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submit({ data: parsed.data });
      onSubmit(!!res.alreadySubmitted);
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
        <Field label="Full name" name="name" required maxLength={120} error={errors.name} />
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
        <Field label="Title / role" name="title" required maxLength={160} error={errors.title} />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
          What are you asking for?
        </legend>
        {errors.ask ? <p className="text-sm text-destructive">{errors.ask}</p> : null}
        <div className="grid gap-2">
          {ACCESS_ASKS.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 border border-border bg-card p-3 text-sm hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy/5"
            >
              <input
                type="radio"
                name="ask"
                value={opt.id}
                defaultChecked={defaultAsk === opt.id}
                required
                className="mt-1 accent-navy"
              />
              <span>
                <span className="block text-ink">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{opt.note}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

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
        <input type="checkbox" name="acknowledged" required className="mt-1 accent-navy" />
        <span>
          {acknowledgement ??
            "I acknowledge this is a private request and not an investment, sponsorship, or transaction. Nothing on this website is an offer to buy or sell securities."}
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
          className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-navy hover:bg-navy disabled:opacity-60"
        >
          {isSubmitting ? "Submitting…" : submitLabel}
          <span aria-hidden="true">→</span>
        </button>
        <span className="text-xs text-muted-foreground">{reviewerNote}</span>
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
