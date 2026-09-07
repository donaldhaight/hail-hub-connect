import { createFileRoute, redirect } from "@tanstack/react-router";

/** The access queue merged into the one founder queue. */
export const Route = createFileRoute("/_authenticated/admin/roles")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/queue" });
  },
});
