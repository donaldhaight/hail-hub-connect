import { createFileRoute } from "@tanstack/react-router";
import { FrontDoor } from "@/components/frontdoor/FrontDoor";
import { getPersona } from "@/content/personas";
import { routeHead } from "@/lib/site";

const persona = getPersona("buddy-claim");

export const Route = createFileRoute("/buddy-claim")({
  head: () =>
    routeHead({
      title: persona.title,
      description: persona.description,
      path: persona.path,
      ogType: "website",
    }),
  component: BuddyClaimPage,
});

function BuddyClaimPage() {
  return <FrontDoor persona={persona} />;
}
