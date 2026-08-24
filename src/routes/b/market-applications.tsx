import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("market-applications")!;

export const Route = createFileRoute("/b/market-applications")({
  head: () =>
    routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/market-applications",
    }),
  component: () => <BrandShell brand={brand} />,
});
