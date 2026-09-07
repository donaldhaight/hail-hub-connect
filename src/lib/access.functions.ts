import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canReachRoleArea, isEntityRole } from "@/lib/access";

export type RoleAreaView = {
  roleKey: string;
  name: string;
  summary: string;
  isActive: boolean;
  /** True when the caller is here as the founder rather than as the holder. */
  asFounder: boolean;
};

/**
 * Open an entity role's own area.
 *
 * The nav only shows the door, so this is where access is actually decided:
 * the caller must hold the role, or be the founder.
 */
export const getRoleArea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ roleKey: z.string().min(1).max(40) }).parse(d))
  .handler(async ({ context, data }): Promise<RoleAreaView> => {
    if (!isEntityRole(data.roleKey)) throw new Error("No such area");

    const { data: roleRows, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleErr) throw new Error("Your standing could not be read");
    const roles = (roleRows ?? []).map((r: { role: string }) => r.role);

    if (!canReachRoleArea(roles, data.roleKey)) throw new Error("Forbidden");

    const { data: row, error } = await context.supabase
      .from("role_catalog")
      .select("key, name, summary, is_active")
      .eq("key", data.roleKey)
      .maybeSingle();
    if (error || !row) throw new Error("No such area");

    return {
      roleKey: row.key,
      name: row.name,
      summary: row.summary,
      isActive: row.is_active,
      asFounder: !roles.includes(data.roleKey) && roles.includes("founder_admin"),
    };
  });
