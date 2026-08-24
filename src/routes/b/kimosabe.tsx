import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/kimosabe")({
  head: () => {
    const brand = getBrand("kimosabe")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/kimosabe",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("kimosabe")!;
  return <BrandShell brand={brand} />;
}
