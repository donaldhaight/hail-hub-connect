import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/united-stakeholders")({
  head: () => {
    const brand = getBrand("united-stakeholders")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/united-stakeholders",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("united-stakeholders")!;
  return <BrandShell brand={brand} />;
}
