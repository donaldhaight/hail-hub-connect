import { createFileRoute } from "@tanstack/react-router";

// TEMPORARY endpoint — resets the founder password. Delete after use.
export const Route = createFileRoute("/api/public/reset-founder")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const body = (await request.json().catch(() => ({}))) as {
          email?: string;
          password?: string;
        };
        const email = (body.email ?? "").trim().toLowerCase();
        const password = body.password ?? "";
        if (!email || password.length < 8) {
          return new Response(
            JSON.stringify({ ok: false, reason: "missing_or_short" }),
            { status: 400, headers: { "content-type": "application/json" } },
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
        const match = list.users.find((u) => (u.email ?? "").toLowerCase() === email);
        if (!match) {
          return new Response(JSON.stringify({ ok: false, reason: "user_not_found" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          });
        }
        const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(match.id, {
          password,
          email_confirm: true,
        });
        if (updErr) {
          return new Response(
            JSON.stringify({ ok: false, reason: "update_failed", message: updErr.message }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
