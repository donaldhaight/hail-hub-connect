import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("united-stakeholders")!;

export const Route = createFileRoute("/b/united-stakeholders")({
  head: () =>
    routeHead({
      title: `${brand.brandName} — ${brand.vertical}`,
      description: brand.oneLineValue,
      path: "/b/united-stakeholders",
    }),
  component: () => <BrandShell brand={brand} />,
});
