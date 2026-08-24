import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/rrca")({
  head: () => {
    const brand = getBrand("rrca")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/rrca",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("rrca")!;
  return <BrandShell brand={brand} />;
}
