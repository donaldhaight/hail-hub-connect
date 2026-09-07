/**
 * The access map — one place that answers two questions:
 *
 *   1. What does this person hold?
 *   2. What does holding it open?
 *
 * The nav menu reads it so the doors shown match the doors that exist.
 * The server re-checks the same map before it answers, because a hidden
 * menu item is not access control.
 *
 * Client-safe. No database, no secrets — only the shape of the building.
 */

export type AccessDoor = {
  label: string;
  href: string;
  /** Shown under the door in role settings; one honest line. */
  opens?: string;
};

/** Doors every signed-in person reaches, whatever they hold. */
export const BASE_DOORS: AccessDoor[] = [
  { label: "App Home", href: "/app" },
  { label: "Role Store", href: "/roles" },
  { label: "Kimosabe front door", href: "/kimosabe" },
  { label: "The Owner's Manual", href: "/manual" },
];

/**
 * Entity roles — the operating roles inside the MarketApp. Holding one opens
 * that role's own area and nothing else. The areas are deliberately empty
 * until each one is described.
 */
export const ENTITY_ROLE_KEYS = ["isr", "lc"] as const;

export function isEntityRole(key: string): boolean {
  return (ENTITY_ROLE_KEYS as readonly string[]).includes(key);
}

/** The route for an entity role's own area. */
export function roleAreaHref(key: string): string {
  return `/app/role/${key}`;
}

/** Doors a specific role opens, beyond the base set. */
const ROLE_DOORS: Record<string, AccessDoor[]> = {
  founder_admin: [
    { label: "The Request Queue", href: "/admin/queue" },
    { label: "Founder Console", href: "/admin" },
    { label: "Inbox", href: "/admin/inbox" },
    { label: "Invitations", href: "/admin/invite" },
    { label: "Digest", href: "/admin/digest" },
    { label: "Tour", href: "/admin/tour" },
    { label: "Platform ledger", href: "/ledger" },
    { label: "Broadcast control", href: "/admin/broadcast" },
    { label: "Situation Room", href: "/room" },
  ],
  qualified_insider: [{ label: "Situation Room", href: "/room" }],
};

/** One honest line about what holding a role opens. */
export const ROLE_OPENS: Record<string, string> = {
  founder_admin: "The queue, console, ledger, broadcast and Situation Room.",
  isr: "Your own area in the MarketApp, plus the certification curriculum.",
  lc: "Your own area in the MarketApp, when the role opens.",
  qualified_insider: "The Situation Room and the insider dossiers.",
  verified_member: "App Home, your wallet, and the open record.",
  interested_user: "The front door and a wallet that earns before you sign up.",
};

/**
 * Every door this set of roles opens, in menu order, de-duplicated.
 * Entity roles contribute their own area automatically.
 */
export function doorsForRoles(roles: string[]): AccessDoor[] {
  const out = [...BASE_DOORS];
  const push = (d: AccessDoor) => {
    if (!out.some((o) => o.href === d.href)) out.push(d);
  };
  for (const r of roles) {
    for (const d of ROLE_DOORS[r] ?? []) push(d);
    if (isEntityRole(r)) {
      push({ label: `${r.toUpperCase()} area`, href: roleAreaHref(r) });
    }
  }
  return out;
}

/**
 * Can this set of roles reach an entity role's area?
 * The founder reaches every area; everyone else reaches only what they hold.
 */
export function canReachRoleArea(roles: string[], roleKey: string): boolean {
  if (!isEntityRole(roleKey)) return false;
  return roles.includes("founder_admin") || roles.includes(roleKey);
}
