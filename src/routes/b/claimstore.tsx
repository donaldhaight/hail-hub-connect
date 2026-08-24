import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("claimstore")!;

export const Route = createFileRoute("/b/claimstore")({
  head: () =>
    routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/claimstore",
    }),
  component: () => <BrandShell brand={brand} />,
});
