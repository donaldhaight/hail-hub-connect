export const SITE_URL = "https://hail-hub-connect.lovable.app";
export const SITE_NAME = "ClaimStore Briefing Room";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build the standard per-route leaf head meta/links block. */
export function routeHead(opts: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
}) {
  const fullTitle = `${opts.title} — ${SITE_NAME}`;
  const url = absoluteUrl(opts.path);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: opts.description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.ogType ?? "article" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
