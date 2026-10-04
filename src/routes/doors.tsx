import { createFileRoute, Link } from "@tanstack/react-router";
import { DOORS } from "@/content/doors";
import { PageShell, PageHeader } from "@/components/briefing/PageShell";

const TITLE = "Many Doors, One Platform — PrepareAmerica";
const DESC =
  "Seven market Doors, each speaking to one need, all leading to the same person, the same file and the same platform.";



export const Route = createFileRoute("/doors")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DoorsPage,
});

function DoorsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Preview"
        title="Many Doors, one platform."
        lede="Each Door speaks to one need in its own voice. Behind every one is the same person, the same file and the same platform. All copy here is preview until approved."
        confidentiality="C0"
      />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <ul className="divide-y divide-border border-y border-border">
          {DOORS.map((d) => (
            <li key={d.to}>
              <Link to={d.to} className="flex items-start justify-between gap-6 py-5 hover:bg-muted/40">
                <span>
                  <span className="block font-serif text-xl text-ink">{d.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{d.line}</span>
                </span>
                <span aria-hidden className="pt-1 text-silver">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
