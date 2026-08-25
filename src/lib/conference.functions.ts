import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { updateConferenceSeatSchema } from "./inbox.schemas";
import { sendEmail } from "./email";
import { SECOND_CONGRESS, CONGRESS_VENUE } from "@/content/calendar";

export const getConferenceCapacitySummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder, capacitySnapshot } = await import("./conference.server");
    await assertFounder(context);
    return capacitySnapshot(supabaseAdmin);
  });

export const getPublicConferenceStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { capacitySnapshot } = await import("./conference.server");
  return capacitySnapshot(supabaseAdmin);
});

export const updateConferenceSeat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateConferenceSeatSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder, capacitySnapshot } = await import("./conference.server");
    await assertFounder(context);

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
    } else {
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
        eventDate: SECOND_CONGRESS.dateLabel,
        venue: CONGRESS_VENUE,
      }).catch(() => {});
    }

    return { ok: true, seatStatus: finalStatus, confirmedAt };
  });

export const promoteFromWaitlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid(), note: z.string().trim().max(2000).optional() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder, capacitySnapshot } = await import("./conference.server");
    await assertFounder(context);

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
      eventDate: SECOND_CONGRESS.dateLabel,
      venue: CONGRESS_VENUE,
    }).catch(() => {});

    return { ok: true, confirmedAt };
  });

export const listConferenceAttendees = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder } = await import("./conference.server");
    await assertFounder(context);
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertFounder } = await import("./conference.server");
    await assertFounder(context);
    const { data: rows, error } = await supabaseAdmin
      .from("conference_seat_events")
      .select("action, note, created_at")
      .eq("application_id", data.applicationId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Failed to load seat events");
    return { rows: rows ?? [] };
  });
