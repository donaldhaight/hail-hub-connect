import { createServerFn } from "@tanstack/react-start";
import { accessRequestSchema, type AccessRequestInput } from "./briefing.schemas";

/**
 * One intake. Every door — the briefing page, the Congress page, a brand page —
 * posts here. A conference ask also opens a seat record, linked to the same row,
 * so the Founder still sees one human per line.
 */
export const submitAccessRequest = createServerFn({ method: "POST" })
  .validator((data: AccessRequestInput) => accessRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const email = data.email.toLowerCase().trim();

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing, error: countError } = await supabaseAdmin
      .from("briefing_requests")
      .select("id")
      .eq("email", email)
      .gte("created_at", since)
      .limit(1);

    if (countError) {
      console.error("access_request rate-limit check failed", countError);
      throw new Error("Unable to process your submission right now.");
    }

    if (existing && existing.length > 0) {
      return { ok: true, id: existing[0].id, alreadySubmitted: true };
    }

    const insert = {
      name: data.name.trim(),
      email,
      organization: data.organization.trim(),
      title: data.title.trim(),
      interest: data.ask,
      requested_role: null,
      anchor: data.anchor ?? null,
      context: data.context?.trim() || null,
      acknowledged: true,
      status: "pending" as const,
    };

    const { data: row, error: insertError } = await supabaseAdmin
      .from("briefing_requests")
      .insert(insert)
      .select("id")
      .single();

    if (insertError || !row) {
      console.error("access_request insert failed", insertError);
      throw new Error("Failed to save your submission.");
    }

    if (data.ask === "conference" || data.ask === "both") {
      const { error: confError } = await supabaseAdmin.from("conference_applications").insert({
        briefing_request_id: row.id,
        name: insert.name,
        email,
        organization: insert.organization,
        title: insert.title,
        interest: data.ask,
        context: insert.context,
        acknowledged: true,
        status: "applied" as const,
        seat_status: "applied" as const,
      });

      if (confError) {
        console.error("conference_application insert failed", confError);
      }
    }

    return { ok: true, id: row.id, alreadySubmitted: false };
  });
