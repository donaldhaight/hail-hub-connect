// Runtime helpers for conference server functions.
// Kept out of *.functions.ts so serverFn splitting cannot strip them.

export const TOTAL_SEATS = 300;

export async function assertFounder(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "founder_admin",
  });
  if (error) throw new Error("Authorization check failed");
  if (!data) throw new Error("Forbidden");
}

export async function capacitySnapshot(supabaseAdmin: any) {
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
