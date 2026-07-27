import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

const brand = getBrand("kimosabe")!;

export const Route = createFileRoute("/b/kimosabe")({
  head: () =>
    routeHead({
      title: `${brand.brandName} — ${brand.vertical}`,
      description: brand.oneLineValue,
      path: "/b/kimosabe",
    }),
  component: () => <BrandShell brand={brand} />,
});
