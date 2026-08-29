import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listMyRoleTags } from "@/lib/roles.functions";
import { ACTIVE_ROLE_KEY } from "@/lib/roles";

/**
 * Switch Role. A person may hold several roles; exactly one is worn at a time,
 * and Kimosabe reads the world through that one. The stored choice is only a
 * preference — every protected read still validates the role server-side.
 */
export function useActiveRole() {
  const load = useServerFn(listMyRoleTags);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    load()
      .then((res) => {
        if (!alive) return;
        const list = res.roles ?? [];
        setRoles(list);
        const stored = window.localStorage.getItem(ACTIVE_ROLE_KEY);
        setActive(stored && list.includes(stored) ? stored : (list[0] ?? null));
      })
      .catch(() => {
        if (alive) setRoles([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [load]);

  const setActiveRole = useCallback((role: string) => {
    window.localStorage.setItem(ACTIVE_ROLE_KEY, role);
    setActive(role);
  }, []);

  return { roles, activeRole, setActiveRole, loading };
}
