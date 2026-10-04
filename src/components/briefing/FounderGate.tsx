import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/inbox.functions";
import { PageShell, PageHeader } from "./PageShell";

/** Refuses the page frame to anyone without the founder role. Data stays server-checked. */
export function FounderGate({ children }: { children: ReactNode }) {
  const fetchRoles = useServerFn(getMyRoles);
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    fetchRoles()
      .then((r) => setOk(r.roles.includes("founder_admin")))
      .catch(() => setOk(false));
  }, [fetchRoles]);
  if (ok === null) {
    return <PageShell><div className="p-16 text-center text-silver">Loading…</div></PageShell>;
  }
  if (!ok) {
    return (
      <PageShell>
        <PageHeader eyebrow="Access" title="Not authorized." lede="Founder access only." confidentiality="C2" />
      </PageShell>
    );
  }
  return <>{children}</>;
}
