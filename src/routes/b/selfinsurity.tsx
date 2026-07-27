import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("selfinsurity")!;

export const Route = createFileRoute("/b/selfinsurity")({
  head: () =>
    routeHead({
      title: `${brand.brandName} — ${brand.vertical}`,
      description: brand.oneLineValue,
      path: "/b/selfinsurity",
    }),
  component: () => <BrandShell brand={brand} />,
});
