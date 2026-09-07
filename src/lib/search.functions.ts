import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SearchHit = { id: string; title: string; snippet: string; href: string };
export type SearchResults = {
  tasks: SearchHit[];
  chapters: SearchHit[];
  dossiers: SearchHit[];
  people: SearchHit[];
};

/**
 * One search across what the signed-in person may actually read: their own
 * tasks, the Owner's Manual, the dossiers their roles open — and, for the
 * founder, the people in the request queue. RLS does the scoping; nothing is
 * searched that the reader could not open.
 */
export const searchMyFile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ q: z.string().trim().min(2).max(120) }).parse(d))
  .handler(async ({ data, context }): Promise<SearchResults> => {
    const q = data.q;
    const like = `%${q.replace(/[%_]/g, "")}%`;
    const lower = q.toLowerCase();
    const results: SearchResults = { tasks: [], chapters: [], dossiers: [], people: [] };

    // Tasks — derived, so reuse the single derivation.
    const { buildAppHome } = await import("@/lib/apphome.server");
    const email = (context.claims as { email?: string } | undefined)?.email ?? null;
    const home = await buildAppHome(context.supabase, context.userId, email);
    results.tasks = home.tasks
      .filter((t) => (t.label + " " + t.detail + " " + t.why).toLowerCase().includes(lower))
      .map((t) => ({ id: t.id, title: t.label, snippet: t.detail, href: `/app/tasks/${t.id}` }));

    const isFounder = home.roles.includes("founder_admin");

    // Owner's Manual chapters.
    const { data: chapters } = await context.supabase
      .from("manual_chapters")
      .select("slug, title, subtitle")
      .or(`title.ilike.${like},subtitle.ilike.${like}`)
      .order("position")
      .limit(10);
    results.chapters = (chapters ?? []).map((c: { slug: string; title: string; subtitle: string | null }) => ({
      id: c.slug,
      title: c.title,
      snippet: c.subtitle ?? "Owner's Manual",
      href: `/manual/${c.slug}`,
    }));

    // Dossiers visible to this reader.
    const { data: dossiers } = await context.supabase
      .from("dossiers")
      .select("slug, title, summary")
      .or(`title.ilike.${like},summary.ilike.${like}`)
      .order("story_order")
      .limit(10);
    results.dossiers = (dossiers ?? []).map((d: { slug: string; title: string; summary: string }) => ({
      id: d.slug,
      title: d.title,
      snippet: d.summary,
      href: `/dossiers/${d.slug}`,
    }));

    // Founder only: the people in the queue.
    if (isFounder) {
      const { data: people } = await context.supabase
        .from("briefing_requests")
        .select("id, name, organization, status")
        .or(`name.ilike.${like},email.ilike.${like},organization.ilike.${like}`)
        .order("created_at", { ascending: false })
        .limit(10);
      results.people = (people ?? []).map(
        (p: { id: string; name: string; organization: string; status: string }) => ({
          id: p.id,
          title: p.name,
          snippet: `${p.organization} · ${p.status}`,
          href: "/admin/queue",
        }),
      );
    }

    return results;
  });
