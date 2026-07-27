import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { updateConferenceSeatSchema } from "./inbox.schemas";
import { sendEmail } from "./email";

const TOTAL_SEATS = 300;

async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

async function capacitySnapshot(supabaseAdmin: any) {
  const { data: confirmedRows, error: confErr } = await supabaseAdmin
    .from("conference_applications")
    .select("plus_ones")
    .eq("seat_status", "confirmed");
  if (confErr) throw new Error("Failed to read confirmed seats");

  const { count: waitlisted, error: waitErr } = await supabaseAdmin
    .from("conference_applications")
    .select("id", { count: "exact", head: true })
    .eq("seat_status", "waitlisted");
  if (waitErr) throw new Error("Failed to read waitlist");

  const confirmedSeats = (confirmedRows ?? []).reduce(
    (sum: number, r: { plus_ones: number }) => sum + 1 + (r.plus_ones ?? 0),
    0,
  );

  return {
    total: TOTAL_SEATS,
    confirmed: confirmedSeats,
    waitlisted: waitlisted ?? 0,
    available: Math.max(0, TOTAL_SEATS - confirmedSeats),
  };
}

export const getConferenceCapacitySummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return capacitySnapshot(supabaseAdmin);
  });

export const getPublicConferenceStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return capacitySnapshot(supabaseAdmin);
});

export const updateConferenceSeat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateConferenceSeatSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("conference_applications")
      .select("id, name, email, seat_status, plus_ones, confirmed_at")
      .eq("id", data.id)
      .single();
    if (fetchErr || !row) throw new Error("Application not found");

    const requestedSeats = 1 + data.plusOnes;
    const capacity = await capacitySnapshot(supabaseAdmin);

    let finalStatus = data.seatStatus;
    let confirmedAt: string | null = row.confirmed_at;

    if (data.seatStatus === "confirmed") {
      if (requestedSeats > capacity.available + (row.seat_status === "confirmed" ? 1 + row.plus_ones : 0)) {
        finalStatus = "waitlisted";
        confirmedAt = null;
      } else {
        confirmedAt = new Date().toISOString();
      }
    } else if (data.seatStatus !== "confirmed") {
      confirmedAt = null;
    }

    const update = {
      seat_status: finalStatus,
      status: finalStatus,
      plus_ones: data.plusOnes,
      dietary_restrictions: data.dietaryRestrictions ?? null,
      hotel_needed: data.hotelNeeded,
      logistics_notes: data.logisticsNotes ?? null,
      confirmed_at: confirmedAt,
      updated_at: new Date().toISOString(),
    };

    const { error: updErr } = await supabaseAdmin
      .from("conference_applications")
      .update(update)
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message || "Failed to update seat");

    await supabaseAdmin.from("conference_seat_events").insert({
      application_id: data.id,
      actor_id: context.userId,
      action: `seat:${finalStatus}`,
      note: data.note ?? null,
    });

    if (finalStatus === "confirmed") {
      await sendEmail({
        kind: "conference_seat_confirmed",
        to: row.email,
        name: row.name,
        seats: requestedSeats,
        eventDate: "November 1, 2026",
        venue: "Gratitude Ranch, Flower Mound, Texas",
      }).catch(() => {});
    }

    return { ok: true, seatStatus: finalStatus, confirmedAt };
  });

const promoteSchema = z.object({ id: z.string().uuid(), note: z.string().trim().max(2000).optional() });

export const promoteFromWaitlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => promoteSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error: fetchErr } = await supabaseAdmin
      .from("conference_applications")
      .select("id, name, email, seat_status, plus_ones")
      .eq("id", data.id)
      .single();
    if (fetchErr || !row) throw new Error("Application not found");
    if (row.seat_status !== "waitlisted") throw new Error("Only waitlisted applications can be promoted");

    const requestedSeats = 1 + (row.plus_ones ?? 0);
    const capacity = await capacitySnapshot(supabaseAdmin);
    if (requestedSeats > capacity.available) {
      throw new Error("Not enough seats available to promote this applicant");
    }

    const confirmedAt = new Date().toISOString();
    const { error: updErr } = await supabaseAdmin
      .from("conference_applications")
      .update({
        seat_status: "confirmed",
        status: "confirmed",
        confirmed_at: confirmedAt,
        updated_at: confirmedAt,
      })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message || "Failed to promote");

    await supabaseAdmin.from("conference_seat_events").insert({
      application_id: data.id,
      actor_id: context.userId,
      action: "seat:promoted_from_waitlist",
      note: data.note ?? null,
    });

    await sendEmail({
      kind: "conference_seat_confirmed",
      to: row.email,
      name: row.name,
      seats: requestedSeats,
      eventDate: "November 1, 2026",
      venue: "Gratitude Ranch, Flower Mound, Texas",
    }).catch(() => {});

    return { ok: true, confirmedAt };
  });

export const listConferenceAttendees = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("conference_applications")
      .select(
        "id, name, email, organization, title, interest, plus_ones, dietary_restrictions, hotel_needed, logistics_notes, confirmed_at",
      )
      .eq("seat_status", "confirmed")
      .order("confirmed_at", { ascending: true })
      .limit(500);
    if (error) throw new Error("Failed to load attendees");
    return { rows: data ?? [] };
  });

export const listConferenceSeatEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ applicationId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertFounder(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("conference_seat_events")
      .select("action, note, created_at")
      .eq("application_id", data.applicationId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Failed to load seat events");
    return { rows: rows ?? [] };
  });
