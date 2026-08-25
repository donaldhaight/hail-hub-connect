import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { TicketView } from "./ticket.server";

/**
 * Open a ticket by its credential. The credential IS the authentication —
 * the database function refuses anything that is not an approved ticket.
 */
export const getTicketView = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ credential: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { publicClient } = await import("./ticket.server");
    const sb = publicClient();
    const { data: result, error } = await sb.rpc("get_ticket_view", {
      _credential: data.credential,
    });
    if (error) throw new Error(error.message || "Failed to load ticket");
    return result as unknown as TicketView;
  });

const issueSchema = z.object({
  id: z.string().uuid(),
  tier: z.enum(["observer", "stakeholder"]),
  status: z.enum(["pending", "approved", "declined", "waitlisted"]),
  note: z.string().trim().max(2000).optional(),
});

/** Founder-only: set a request's ticket tier and status. */
export const issueTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => issueSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder } = await import("./conference.server");
    await assertFounder(context);

    const { data: row, error } = await supabaseAdmin
      .from("conference_applications")
      .update({
        ticket_tier: data.tier,
        ticket_status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select("id, ticket_credential, ticket_tier, ticket_status")
      .single();
    if (error || !row) throw new Error(error?.message || "Failed to issue ticket");

    await supabaseAdmin.from("conference_seat_events").insert({
      application_id: data.id,
      actor_id: context.userId,
      action: `ticket:${data.status}`,
      note: data.note ?? `tier=${data.tier}`,
    });

    return {
      ok: true,
      credential: row.ticket_credential,
      tier: row.ticket_tier,
      status: row.ticket_status,
    };
  });

/** Founder-only: ticket ledger for the invitation ladder. */
export const listTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder } = await import("./conference.server");
    await assertFounder(context);

    const { data, error } = await supabaseAdmin
      .from("conference_applications")
      .select(
        "id, name, email, organization, title, ticket_tier, ticket_status, ticket_credential, seat_status, season_id, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error("Failed to load tickets");
    return { rows: data ?? [] };
  });

/** Founder-only: counts at each rung of the invitation ladder. */
export const getLadderFunnel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder } = await import("./conference.server");
    await assertFounder(context);

    const [apps, referrals, invitations] = await Promise.all([
      supabaseAdmin
        .from("conference_applications")
        .select("ticket_status, ticket_tier, seat_status"),
      supabaseAdmin.from("insider_referrals").select("status"),
      supabaseAdmin.from("insider_invitations").select("status"),
    ]);

    const rows = apps.data ?? [];
    const count = (fn: (r: (typeof rows)[number]) => boolean) => rows.filter(fn).length;

    return {
      referrals: (referrals.data ?? []).length,
      referralsAccepted: (referrals.data ?? []).filter((r) => r.status === "accepted").length,
      requests: rows.length,
      ticketsIssued: count((r) => r.ticket_status === "approved"),
      ticketsObserver: count((r) => r.ticket_status === "approved" && r.ticket_tier === "observer"),
      ticketsStakeholder: count(
        (r) => r.ticket_status === "approved" && r.ticket_tier === "stakeholder",
      ),
      ticketsDeclined: count((r) => r.ticket_status === "declined"),
      invitationsSent: (invitations.data ?? []).length,
      invitationsRedeemed: (invitations.data ?? []).filter((i) => i.status === "redeemed").length,
      seatsConfirmed: count((r) => r.seat_status === "confirmed"),
      seatsWaitlisted: count((r) => r.seat_status === "waitlisted"),
    };
  });
