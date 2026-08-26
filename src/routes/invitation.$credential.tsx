import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { routeHead } from "@/lib/seo";
import { FIRST_CONGRESS } from "@/content/calendar";

const TITLE = "Your Invitation";
const DESC = `Your invitation to the First Congress — ${FIRST_CONGRESS.dateLabel}.`;

export const Route = createFileRoute("/invitation/$credential")({
  head: () => ({
    meta: routeHead({ title: TITLE, description: DESC, path: "/invitation" }),
  }),
  component: InvitationRoute,
});

function InvitationRoute() {
  const { credential } = Route.useParams();
  return <InvitationPage credential={credential} mode="invitation" />;
}
