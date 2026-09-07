import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/apphome/AppShell";
import { getRoleArea } from "@/lib/access.functions";
import { listMyRoleTags } from "@/lib/roles.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";
import { Meta } from "@/components/briefing/Badges";

export const Route = createFileRoute("/_authenticated/app/role/$roleKey")({
  head: () => ({
    meta: [
      { title: "Role area — Kimosabe" },
      {
        name: "description",
        content:
          "The operating area for a role you hold. Reachable only by the person who holds it.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RoleAreaPage,
});

function RoleAreaPage() {
  const { roleKey } = Route.useParams();
  const fetchArea = useServerFn(getRoleArea);
  const fetchRoles = useServerFn(listMyRoleTags);

  const { data, isLoading, error } = useQuery({
    queryKey: ["role-area", roleKey],
    queryFn: () => fetchArea({ data: { roleKey } }),
    retry: false,
  });
  const { data: roleData } = useQuery({
    queryKey: ["my-role-tags"],
    queryFn: () => fetchRoles(),
  });
  const roles = roleData?.roles ?? [];

  const [activeRole, setActiveRole] = useState<string | null>(null);
  useEffect(() => {
    setActiveRole(window.localStorage.getItem(ACTIVE_ROLE_KEY));
  }, []);
  const switchRole = (r: string) => {
    setActiveRole(r);
    window.localStorage.setItem(ACTIVE_ROLE_KEY, r);
  };

  return (
    <AppShell roles={roles} activeRole={activeRole} onSwitchRole={switchRole}>
      <div className="mx-auto max-w-3xl px-6 py-12">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Opening the area…</p>
        ) : error || !data ? (
          <div className="border border-border p-8">
            <h1 className="font-serif text-2xl tracking-tight text-ink">
              This area is not yours to open.
            </h1>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              An operating area belongs to the person who holds that role. If you believe
              you should be here, the role is granted or certified first — never by
              reaching the address.
            </p>
            <Link
              to="/app"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-navy hover:underline"
            >
              Back to App Home
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
                  Operating area
                </div>
                <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-4xl">
                  {data.name}
                </h1>
              </div>
              <Meta truth="DECISION" confidentiality="C1" />
            </div>

            <p className="max-w-[64ch] text-sm leading-relaxed text-ink/85">{data.summary}</p>

            {data.asFounder ? (
              <p className="mt-4 border-l-2 border-navy pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                You are here as the founder, not as a holder of this role.
              </p>
            ) : null}

            {!data.isActive ? (
              <p className="mt-4 border-l-2 border-border pl-4 text-sm text-muted-foreground">
                This role is listed but not yet open. The area exists so the door and the
                lock can be proven before the room is furnished.
              </p>
            ) : null}

            <div className="mt-10 border border-dashed border-border p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                Deliberately empty
              </div>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
                The screens, views, datasets, naming conventions and statuses for this role
                have not been written here yet. They are described by the owner, one role at
                a time, and built exactly as described. Nothing has been invented to fill
                this space.
              </p>
            </div>

            <Link
              to="/app"
              className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-navy hover:underline"
            >
              Back to App Home
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}
