import { createServerFn } from "@tanstack/react-start";
import {
  briefingRequestSchema,
  conferenceApplicationSchema,
  type BriefingRequestInput,
  type ConferenceApplicationInput,
} from "./briefing.schemas";

export const submitBriefingRequest = createServerFn({ method: "POST" })
  .validator((data: BriefingRequestInput) => briefingRequestSchema.parse(data))
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
      console.error("briefing_request rate-limit check failed", countError);
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
      interest: data.interest,
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
      console.error("briefing_request insert failed", insertError);
      throw new Error("Failed to save your submission.");
    }

    if (data.interest === "prepare-america") {
      const { error: confError } = await supabaseAdmin.from("conference_applications").insert({
        briefing_request_id: row.id,
        name: insert.name,
        email,
        organization: insert.organization,
        title: insert.title,
        interest: data.interest,
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

export const submitConferenceApplication = createServerFn({ method: "POST" })
  .validator((data: ConferenceApplicationInput) => conferenceApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const email = data.email.toLowerCase().trim();

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing, error: countError } = await supabaseAdmin
      .from("conference_applications")
      .select("id")
      .eq("email", email)
      .gte("created_at", since)
      .limit(1);

    if (countError) {
      console.error("conference_application rate-limit check failed", countError);
      throw new Error("Unable to process your submission right now.");
    }

    if (existing && existing.length > 0) {
      return { ok: true, id: existing[0].id, alreadySubmitted: true };
    }

    const contextComposed = [
      `Category: ${data.category}`,
      data.referral?.trim() ? `Referral: ${data.referral.trim()}` : null,
      data.context?.trim() ? `\n${data.context.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const insert = {
      name: data.name.trim(),
      email,
      organization: data.organization.trim(),
      title: data.title.trim(),
      interest: data.category,
      context: contextComposed || null,
      acknowledged: true,
      status: "applied" as const,
      seat_status: "applied" as const,
    };

    const { data: row, error: insertError } = await supabaseAdmin
      .from("conference_applications")
      .insert(insert)
      .select("id")
      .single();

    if (insertError || !row) {
      console.error("conference_application insert failed", insertError);
      throw new Error("Failed to save your application.");
    }

    return { ok: true, id: row.id, alreadySubmitted: false };
  });
