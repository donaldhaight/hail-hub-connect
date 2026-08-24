import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/market-applications")({
  head: () => {
    const brand = getBrand("market-applications")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/market-applications",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("market-applications")!;
  return <BrandShell brand={brand} />;
}
