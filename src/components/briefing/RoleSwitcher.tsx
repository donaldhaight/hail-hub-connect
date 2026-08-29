import { useActiveRole } from "@/hooks/useActiveRole";
import { roleLabel } from "@/lib/roles";

/**
 * The header role switcher. Only rendered when the person holds more than one
 * role — a single-role holder has nothing to switch between.
 */
export function RoleSwitcher() {
  const { roles, activeRole, setActiveRole, loading } = useActiveRole();

  if (loading || roles.length < 2 || !activeRole) return null;

  return (
    <label className="hidden items-center gap-2 xl:inline-flex">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-silver">Role</span>
      <select
        value={activeRole}
        onChange={(e) => setActiveRole(e.target.value)}
        aria-label="Switch role"
        className="border border-border bg-card px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink focus:outline-none focus:ring-1 focus:ring-navy"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {roleLabel(r)}
          </option>
        ))}
      </select>
    </label>
  );
}
