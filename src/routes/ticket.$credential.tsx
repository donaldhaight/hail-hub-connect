import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ticket/$credential")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/invitation/$credential", params: { credential: params.credential } });
  },
});
