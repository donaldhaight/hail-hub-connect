import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type { AppHomeTask, AppHomeView } from "@/lib/apphome.types";

/**
 * Everything the App Home needs in one call: identity, roles, wallet, and a
 * server-derived task list (the workflow toll booth). Client-side state such
 * as an unclaimed Interested User anchor is layered on by the page.
 */
export const getAppHome = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { buildAppHome } = await import("@/lib/apphome.server");
    const email = (context.claims as { email?: string } | undefined)?.email ?? null;
    return buildAppHome(context.supabase, context.userId, email);
  });

/**
 * Mark a task done — or reopen it. Only tasks that a person can honestly
 * settle themselves may be set this way; derived tasks (certification,
 * grants) finish when the underlying record says so.
 */
export const setAppTaskDone = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ taskId: z.string(), done: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    const { DISMISSIBLE_TASKS } = await import("@/lib/apphome.server");
    if (!DISMISSIBLE_TASKS.has(data.taskId)) {
      return { ok: false as const, reason: "not_dismissible" as const };
    }
    if (data.done) {
      await context.supabase
        .from("app_task_states")
        .upsert(
          { user_id: context.userId, task_id: data.taskId },
          { onConflict: "user_id,task_id" },
        );
    } else {
      await context.supabase
        .from("app_task_states")
        .delete()
        .eq("user_id", context.userId)
        .eq("task_id", data.taskId);
    }
    return { ok: true as const };
  });
