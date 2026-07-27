import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("rrca")!;

export const Route = createFileRoute("/b/rrca")({
  head: () =>
    routeHead({
      title: `${brand.brandName} — ${brand.vertical}`,
      description: brand.oneLineValue,
      path: "/b/rrca",
    }),
  component: () => <BrandShell brand={brand} />,
});
