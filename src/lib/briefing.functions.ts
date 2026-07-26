import { createServerFn } from "@tanstack/react-start";
import { briefingRequestSchema, type BriefingRequestInput } from "./briefing.schemas";

export const submitBriefingRequest = createServerFn({ method: "POST" })
  .inputValidator((data: BriefingRequestInput) => briefingRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const email = data.email.toLowerCase().trim();

    // Rate limit: one submission per email per 24 hours.
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

    // If the request is for PrepareAmerica, also create a conference application record.
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
      });

      if (confError) {
        console.error("conference_application insert failed", confError);
      }
    }

    // Founder notification email is wired once a Lovable email domain is configured.
    // For now the submission is persisted and auditable.

    return { ok: true, id: row.id, alreadySubmitted: false };
  });
