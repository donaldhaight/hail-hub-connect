import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { FrontDoor } from "@/components/frontdoor/FrontDoor";
import { getPersona } from "@/content/personas";
import { getTrack } from "@/content/funnels";
import { routeHead } from "@/lib/site";

const persona = getPersona("adjusting-professionals");

const searchSchema = z.object({ track: z.string().optional() });

export const Route = createFileRoute("/adjusting-professionals")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () =>
    routeHead({
      title: persona.title,
      description: persona.description,
      path: persona.path,
      ogType: "website",
    }),
  component: AdjustingProfessionalsPage,
});

function AdjustingProfessionalsPage() {
  const { track } = Route.useSearch();
  return <FrontDoor persona={persona} track={getTrack(track)} />;
}
