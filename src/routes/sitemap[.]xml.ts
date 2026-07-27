import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://hail-hub-connect.lovable.app";

interface Entry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const ENTRIES: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/why-rrca", changefreq: "monthly", priority: "0.9" },
  { path: "/industry-problem", changefreq: "monthly", priority: "0.9" },
  { path: "/proof-of-concept", changefreq: "monthly", priority: "0.9" },
  { path: "/vision", changefreq: "monthly", priority: "0.9" },
  { path: "/prepare-america", changefreq: "weekly", priority: "0.9" },
  { path: "/why-prepare-america", changefreq: "monthly", priority: "0.8" },
  { path: "/investors", changefreq: "monthly", priority: "0.8" },
  { path: "/policy", changefreq: "monthly", priority: "0.8" },
  { path: "/founder", changefreq: "monthly", priority: "0.7" },
  { path: "/architecture", changefreq: "monthly", priority: "0.8" },
  { path: "/b/united-stakeholders", changefreq: "monthly", priority: "0.8" },
  { path: "/b/market-applications", changefreq: "monthly", priority: "0.8" },
  { path: "/b/buddy-claim", changefreq: "monthly", priority: "0.8" },
  { path: "/b/selfinsurity", changefreq: "monthly", priority: "0.8" },
  { path: "/b/claimstore", changefreq: "monthly", priority: "0.8" },
  { path: "/b/rrca", changefreq: "monthly", priority: "0.8" },
  { path: "/b/kimosabe", changefreq: "monthly", priority: "0.8" },
  { path: "/request-briefing", changefreq: "monthly", priority: "0.6" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = ENTRIES.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
