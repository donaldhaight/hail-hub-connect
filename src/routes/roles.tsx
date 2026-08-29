import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";
import { routeHead } from "@/lib/site";
import { useSignedIn } from "@/hooks/useSignedIn";
import {
  answerModuleQuiz,
  enrollInRole,
  getCertification,
  listRoleCatalog,
  type CertificationState,
} from "@/lib/roles.functions";
import type { RoleCatalogRow, RoleModuleRow } from "@/lib/roles";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";

const TITLE = "The Role Store";
const DESC =
  "Every role in the Human Blockchain, what it carries, and how it is earned. Phase 1 certifies one operating role: the Independent Sales Rep.";

export const Route = createFileRoute("/roles")({
  head: () => routeHead({ title: TITLE, description: DESC, path: "/roles" }),
  loader: () => listRoleCatalog(),
  component: RoleStore,
  errorComponent: () => (
    <PageShell>
      <PageHeader eyebrow="Roles" title="The catalog could not be loaded." lede="Try again shortly." />
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <PageHeader eyebrow="Roles" title="Nothing here." lede="No role catalog was found." />
    </PageShell>
  ),
});

function RoleStore() {
  const { roles, modules } = Route.useLoaderData();
  const stakeholder = roles.filter((r) => r.axis === "stakeholder" && r.key !== "interested_user");
  const entity = roles.filter((r) => r.axis === "entity");

  return (
    <PageShell>
      <PageHeader
        eyebrow="MarketApp · Role Store"
        title="Standing is earned, never assumed."
        lede="Stakeholder Groups are requested and granted by the founder — nobody self-certifies. Operating roles inside the MarketApp are certified: a fee, four modules, four quizzes, and the role is written to your file."
        truth="DECISION"
        confidentiality="C1"
        status="Phase 1 · one certifiable role"
      />

      <Section number="01" title="Stakeholder Groups — requested">
        <div className="grid gap-4 sm:grid-cols-2">
          {stakeholder.map((r) => (
            <div key={r.key} className="border border-border p-5">
              <div className="font-serif text-xl text-ink">{r.name}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
              <p className="mt-2 text-sm leading-relaxed text-silver">{r.detail}</p>
              {r.requestable ? (
                <Link
                  to="/request-briefing"
                  className="mt-4 inline-block border border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background"
                >
                  Request this role
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section number="02" title="Operating roles — certified">
        <div className="space-y-8">
          {entity.map((r) => (
            <RoleCard
              key={r.key}
              role={r}
              modules={modules.filter((m) => m.role_key === r.key)}
            />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

function RoleCard({ role, modules }: { role: RoleCatalogRow; modules: RoleModuleRow[] }) {
  const signedIn = useSignedIn();
  const load = useServerFn(getCertification);
  const enroll = useServerFn(enrollInRole);
  const answer = useServerFn(answerModuleQuiz);

  const [state, setState] = useState<CertificationState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    load({ data: { roleKey: role.key } })
      .then((s) => setState(s as CertificationState))
      .catch(() => setNotice("Your certification file could not be read."));
  }, [load, role.key]);

  useEffect(() => {
    if (signedIn) refresh();
  }, [signedIn, refresh]);

  async function doEnroll() {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const next = (await enroll({ data: { roleKey: role.key } })) as CertificationState & {
        error?: string;
      };
      setState(next);
      if (next.error) setNotice(next.error);
    } catch {
      setNotice("The enrollment could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  async function doAnswer(moduleId: string, choice: number) {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await answer({ data: { moduleId, choice } });
      if (res.correct) {
        setState(res.state as CertificationState);
        setNotice(null);
      } else {
        setNotice("Not quite. Read the module again and answer once more.");
      }
    } catch {
      setNotice("That answer could not be recorded.");
    } finally {
      setBusy(false);
    }
  }

  const passed = new Set(state?.passedModuleIds ?? []);

  return (
    <div className="border border-border">
      <div className="border-b border-border p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="font-serif text-2xl text-ink">{role.name}</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
            {role.fee_jbk > 0 ? `${role.fee_jbk} ${PLATFORM_TOKEN} fee` : "No fee"} ·{" "}
            {modules.length} modules
          </div>
        </div>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          {role.summary}
        </p>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-silver">{role.detail}</p>

        {signedIn === false ? (
          <Link
            to="/auth"
            className="mt-5 inline-block border border-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background"
          >
            Sign in to certify
          </Link>
        ) : null}

        {signedIn && state ? (
          state.completedAt ? (
            <p className="mt-4 border-l-2 border-ink pl-4 text-sm text-ink">
              Certified. The role is written to your file and your App Home is open.
            </p>
          ) : state.feePaidAt ? (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
              Enrolled · {passed.size}/{modules.length} modules passed
            </p>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={doEnroll}
              className="mt-5 border border-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-background disabled:opacity-40"
            >
              Pay {role.fee_jbk} {PLATFORM_TOKEN} and begin — balance {state.balance}
            </button>
          )
        ) : null}

        {notice ? (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
            {notice}
          </p>
        ) : null}
      </div>

      <ol className="divide-y divide-border">
        {modules.map((m) => {
          const done = passed.has(m.id);
          const open = !!state?.feePaidAt && !done;
          return (
            <li key={m.id} className="p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-lg text-ink">
                  {m.position}. {m.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
                  {done ? "passed" : open ? "open" : "locked"}
                </span>
              </div>
              <p className="mt-1 max-w-[60ch] text-sm text-muted-foreground">{m.summary}</p>
              {open ? (
                <div className="mt-4">
                  <p className="max-w-[62ch] text-sm leading-relaxed text-ink">{m.body}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-silver">
                    {m.quiz_question}
                  </p>
                  <div className="mt-2 space-y-2">
                    {m.quiz_options.map((opt, i) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={busy}
                        onClick={() => doAnswer(m.id, i)}
                        className="block w-full border border-border px-3 py-2 text-left text-sm text-ink transition-colors hover:border-ink disabled:opacity-40"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
