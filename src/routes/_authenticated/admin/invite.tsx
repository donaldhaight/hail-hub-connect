import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";
import { inviteInsiderDirect } from "@/lib/insider.functions";
import { renderTemplate } from "@/lib/email";

const inviteSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").min(1).max(255),
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  organization: z.string().trim().max(200).optional().default(""),
  roleCategory: z.string().trim().max(80).optional().default(""),
  internalNote: z.string().trim().max(2000).optional().default(""),
});

type InviteForm = z.infer<typeof inviteSchema>;

export const Route = createFileRoute("/_authenticated/admin/invite")({
  head: () => ({
    meta: [
      { title: "Invite an insider — ClaimStore" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InvitePage,
});

const ROLE_OPTIONS = [
  "C-level industry executive",
  "Institutional investor / venture capital",
  "Contractor with capital",
  "Government / policy / think tank",
  "Counsel — construction / restructuring / securities",
  "Strategic advisor / partner",
  "Other",
];

function InvitePage() {
  const invite = useServerFn(inviteInsiderDirect);

  const [form, setForm] = useState<InviteForm>({
    email: "",
    fullName: "",
    organization: "",
    roleCategory: ROLE_OPTIONS[0],
    internalNote: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InviteForm, string>>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ token: string; expiresAt: string } | null>(null);
  const [globalErr, setGlobalErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const acceptUrl = result
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/insider/accept?token=${result.token}`
    : "";

  function update<K extends keyof InviteForm>(key: K, value: InviteForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalErr(null);
    const parsed = inviteSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<keyof InviteForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as keyof InviteForm;
        if (!next[path]) next[path] = issue.message;
      }
      setErrors(next);
      return;
    }
    setBusy(true);
    try {
      const r = await invite({ data: parsed.data });
      setResult(r);
    } catch (e) {
      setGlobalErr(e instanceof Error ? e.message : "Failed to issue invitation");
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    if (!acceptUrl) return;
    navigator.clipboard.writeText(acceptUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function reset() {
    setForm({ email: "", fullName: "", organization: "", roleCategory: ROLE_OPTIONS[0], internalNote: "" });
    setResult(null);
    setErrors({});
    setGlobalErr(null);
  }

  const emailPreview = result
    ? renderTemplate({
        kind: "insider_invitation",
        to: form.email,
        name: form.fullName,
        acceptUrl,
        expiresAt: new Date(result.expiresAt).toISOString(),
      })
    : null;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder Invite"
        title="Invite someone into the room."
        lede="Issue a single-use, expiring invitation directly. The recipient signs in with the email on the invitation to activate insider access."
        confidentiality="C2"
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <Link
          to="/admin/inbox"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver hover:text-ink"
        >
          ← Back to Inbox
        </Link>

        <div className="mt-6 border border-border bg-card p-6 sm:p-8">
          {result ? (
            <div className="space-y-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-700">
                  Invitation issued
                </div>
                <h2 className="mt-1 font-serif text-2xl text-ink">Send this link.</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Email sending is not configured yet, so copy the link and send it manually. It expires{" "}
                  {new Date(result.expiresAt).toLocaleDateString()}.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  Invitation link
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    readOnly
                    value={acceptUrl}
                    className="min-w-0 flex-1 border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyLink}
                    className="border border-ink bg-ink px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy"
                  >
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </div>
              </div>

              {emailPreview ? (
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                    Email preview
                  </label>
                  <div className="border border-border bg-paper p-4 font-mono text-xs whitespace-pre-wrap text-ink/80">
                    <div className="mb-2 font-semibold text-ink">Subject: {emailPreview.subject}</div>
                    {emailPreview.text}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="border border-ink bg-ink px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy"
                >
                  Invite another
                </button>
                <Link
                  to="/admin/inbox"
                  search={{ tab: "invitations" }}
                  className="text-xs text-muted-foreground hover:text-ink"
                >
                  View all invitations →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                  Direct invitation
                </div>
                <h2 className="mt-1 font-serif text-2xl text-ink">Invite an insider.</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.fullName}>
                  <input
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    maxLength={200}
                    className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    maxLength={255}
                    className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </Field>
                <Field label="Organization" error={errors.organization}>
                  <input
                    value={form.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    maxLength={200}
                    className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
                  />
                </Field>
                <Field label="Role category" error={errors.roleCategory}>
                  <select
                    value={form.roleCategory}
                    onChange={(e) => update("roleCategory", e.target.value)}
                    className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Internal note (private to founder)" error={errors.internalNote}>
                <textarea
                  value={form.internalNote}
                  onChange={(e) => update("internalNote", e.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Why this person matters, expected contribution, follow-up intent, etc."
                  className="w-full border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
                />
              </Field>

              <div className="border border-navy/20 bg-navy/[0.03] p-3 text-xs text-navy">
                Email sending is not configured — after issuing, copy the invitation link and send it manually.
              </div>

              {globalErr ? (
                <div className="border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {globalErr}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  to="/admin/inbox"
                  className="text-xs text-silver hover:text-ink"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={busy}
                  className="border border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-paper hover:bg-navy hover:border-navy disabled:opacity-50"
                >
                  {busy ? "Issuing…" : "Issue invitation"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
