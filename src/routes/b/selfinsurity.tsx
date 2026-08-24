import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/selfinsurity")({
  head: () => {
    const brand = getBrand("selfinsurity")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/selfinsurity",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("selfinsurity")!;
  return <BrandShell brand={brand} />;
}
