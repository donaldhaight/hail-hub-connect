import { createFileRoute } from "@tanstack/react-router";

// TEMPORARY seed endpoint — self-disables once a founder_admin exists.
// Remove after initial founder is provisioned.
export const Route = createFileRoute("/api/public/seed-founder")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const body = (await request.json().catch(() => ({}))) as {
          email?: string;
          password?: string;
        };
        const email = (body.email ?? "").trim();
        const password = body.password ?? "";
        if (!email || !password) {
          return new Response(JSON.stringify({ ok: false, reason: "missing_fields" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const { data: existing, error: existingErr } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "founder_admin")
          .limit(1);
        if (existingErr) {
          return new Response(JSON.stringify({ ok: false, reason: existingErr.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
        if (existing && existing.length > 0) {
          return new Response(JSON.stringify({ ok: false, reason: "founder_exists" }), {
            status: 409,
            headers: { "content-type": "application/json" },
          });
        }

        let userId: string | null = null;
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (createErr) {
          const msg = createErr.message ?? "";
          if (!/already|registered|exists/i.test(msg)) {
            return new Response(
              JSON.stringify({ ok: false, reason: "create_failed", message: msg }),
              { status: 500, headers: { "content-type": "application/json" } },
            );
          }
          const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 200,
          });
          if (listErr) {
            return new Response(
              JSON.stringify({ ok: false, reason: "lookup_failed", message: listErr.message }),
              { status: 500, headers: { "content-type": "application/json" } },
            );
          }
          const match = list.users.find(
            (u) => (u.email ?? "").toLowerCase() === email.toLowerCase(),
          );
          if (!match) {
            return new Response(JSON.stringify({ ok: false, reason: "user_not_found" }), {
              status: 404,
              headers: { "content-type": "application/json" },
            });
          }
          userId = match.id;
          await supabaseAdmin.auth.admin.updateUserById(match.id, {
            password,
            email_confirm: true,
          });
        } else {
          userId = created.user?.id ?? null;
        }

        if (!userId) {
          return new Response(JSON.stringify({ ok: false, reason: "no_user_id" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const { error: roleErr } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: "founder_admin" });
        if (roleErr && !/duplicate|unique/i.test(roleErr.message)) {
          return new Response(
            JSON.stringify({ ok: false, reason: "role_insert_failed", message: roleErr.message }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        return new Response(JSON.stringify({ ok: true, userId }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
