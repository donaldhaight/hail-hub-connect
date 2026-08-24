import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/buddy-claim")({
  head: () => {
    const brand = getBrand("buddy-claim")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/buddy-claim",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("buddy-claim")!;
  return <BrandShell brand={brand} />;
}
