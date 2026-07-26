import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendEmail } from "./email";

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

const grantSchema = z.object({ briefingRequestId: z.string().uuid() });
const grantConfSchema = z.object({ conferenceApplicationId: z.string().uuid() });

export const grantInsiderAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: req, error: reqErr } = await supabaseAdmin
      .from("briefing_requests")
      .select("id, name, email")
      .eq("id", data.briefingRequestId)
      .single();
    if (reqErr || !req) throw new Error("Briefing request not found");

    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("briefing_request_id", req.id)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        briefing_request_id: req.id,
        email: req.email,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error("Failed to create invitation");

    await supabaseAdmin
      .from("briefing_requests")
      .update({ status: "approved", updated_at: new Date().toISOString() })
      .eq("id", req.id);

    await supabaseAdmin.from("briefing_request_events").insert({
      briefing_request_id: req.id,
      actor_id: context.userId,
      action: "insider:invited",
      note: `invitation ${inv.id}`,
    });

    await sendEmail({
      kind: "insider_invitation",
      to: req.email,
      name: req.name,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { token: inv.token as string, expiresAt: inv.expires_at as string };
  });

export const getInvitationForRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("insider_invitations")
      .select("id, token, status, expires_at, redeemed_at, email")
      .eq("briefing_request_id", data.briefingRequestId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error("Failed to load invitation");
    return { invitation: rows?.[0] ?? null };
  });

export const grantInsiderAccessFromConference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantConfSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: app, error: appErr } = await supabaseAdmin
      .from("conference_applications")
      .select("id, name, email")
      .eq("id", data.conferenceApplicationId)
      .single();
    if (appErr || !app) throw new Error("Conference application not found");

    await supabaseAdmin
      .from("insider_invitations")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("conference_application_id", app.id)
      .is("redeemed_at", null)
      .neq("status", "revoked");

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("insider_invitations")
      .insert({
        conference_application_id: app.id,
        email: app.email,
        created_by: context.userId,
      })
      .select("id, token, expires_at")
      .single();
    if (invErr || !inv) throw new Error("Failed to create invitation");

    await supabaseAdmin
      .from("conference_applications")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", app.id);

    await sendEmail({
      kind: "insider_invitation",
      to: app.email,
      name: app.name,
      acceptUrl: `/insider/accept?token=${inv.token}`,
      expiresAt: new Date(inv.expires_at).toISOString(),
    });

    return { token: inv.token as string, expiresAt: inv.expires_at as string };
  });

export const getInvitationForConference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => grantConfSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("insider_invitations")
      .select("id, token, status, expires_at, redeemed_at, email")
      .eq("conference_application_id", data.conferenceApplicationId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw new Error("Failed to load invitation");
    return { invitation: rows?.[0] ?? null };
  });

const redeemSchema = z.object({ token: z.string().uuid() });

export const redeemInsiderInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => redeemSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { data: result, error } = await (context.supabase as any).rpc(
      "redeem_insider_invitation",
      { _token: data.token },
    );
    if (error) throw new Error(error.message ?? "Redemption failed");
    return result as { ok: boolean; reason?: string; already?: boolean; expected?: string };
  });
