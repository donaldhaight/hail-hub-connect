import { createFileRoute } from "@tanstack/react-router";
import { BrandShell } from "@/components/briefing/BrandShell";
import { getBrand } from "@/content/brands";
import { routeHead } from "@/lib/site";

export const Route = createFileRoute("/b/claimstore")({
  head: () => {
    const brand = getBrand("claimstore")!;
    return routeHead({
      title: `${brand.vertical} — The Human Blockchain`,
      description: brand.oneLineValue,
      path: "/b/claimstore",
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const brand = getBrand("claimstore")!;
  return <BrandShell brand={brand} />;
}
