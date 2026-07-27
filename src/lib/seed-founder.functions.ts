import { createServerFn } from "@tanstack/react-start";

// One-shot seed: creates the founder account if no founder_admin exists yet.
// Self-disables once a founder is present. Safe to leave deployed.
export const seedFounder = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Refuse if a founder already exists.
    const { data: existing, error: existingErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "founder_admin")
      .limit(1);
    if (existingErr) throw new Error(existingErr.message);
    if (existing && existing.length > 0) {
      return { ok: false, reason: "founder_exists" as const };
    }

    // Try to create the user; if it already exists, look them up.
    let userId: string | null = null;
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createErr) {
      const msg = (createErr as { message?: string }).message ?? "";
      const isDuplicate = /already|registered|exists/i.test(msg);
      if (!isDuplicate) return { ok: false, reason: "create_failed" as const, message: msg };
      // Find existing user.
      const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      if (listErr) return { ok: false, reason: "lookup_failed" as const, message: listErr.message };
      const match = list.users.find(
        (u) => (u.email ?? "").toLowerCase() === data.email.toLowerCase(),
      );
      if (!match) return { ok: false, reason: "user_not_found" as const };
      userId = match.id;
      // Reset password to requested value.
      await supabaseAdmin.auth.admin.updateUserById(match.id, {
        password: data.password,
        email_confirm: true,
      });
    } else {
      userId = created.user?.id ?? null;
    }

    if (!userId) return { ok: false, reason: "no_user_id" as const };

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "founder_admin" });
    if (roleErr && !/duplicate|unique/i.test(roleErr.message)) {
      return { ok: false, reason: "role_insert_failed" as const, message: roleErr.message };
    }

    return { ok: true, userId };
  });
