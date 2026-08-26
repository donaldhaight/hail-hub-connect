/**
 * The Situation Room — lens configuration.
 *
 * A lens is not a page. It is the same signal corpus read through one of the
 * seven functions of the Human Blockchain. Each lens declares which variables
 * it leads with and what question it is answering.
 */
import type { BrandVertical } from "./brands";

export type Lens = BrandVertical;

export interface LensConfig {
  lens: Lens;
  label: string;
  question: string;
  /** Variable keys, in display order. First is the headline metric. */
  variables: string[];
}

export const LENSES: LensConfig[] = [
  {
    lens: "Foundation",
    label: "Foundation",
    question: "Who is obligated here, and under what governance?",
    variables: ["delegates_committed", "counties_touched", "coordination_index"],
  },
  {
    lens: "Tech",
    label: "Technology",
    question: "Is the instrumentation telling the truth right now?",
    variables: ["feeds_online", "counties_touched", "coordination_index"],
  },
  {
    lens: "Legal",
    label: "Legal",
    question: "Where is the resolution load concentrating?",
    variables: ["disputes_open", "claims_in_flight", "counties_touched"],
  },
  {
    lens: "Insurance",
    label: "Insurance",
    question: "How much claim volume is in flight, and how sure are we?",
    variables: ["claims_in_flight", "roofs_impacted", "disputes_open"],
  },
  {
    lens: "Banking",
    label: "Banking",
    question: "How much capital is staged against work not yet done?",
    variables: ["dollars_staged", "claims_in_flight", "counties_touched"],
  },
  {
    lens: "Construction",
    label: "Construction",
    question: "Is there capacity within reach of the damage?",
    variables: ["crews_available", "roofs_impacted", "counties_touched"],
  },
  {
    lens: "Center",
    label: "Center",
    question: "Does supply match demand across all six functions?",
    variables: [
      "coordination_index",
      "claims_in_flight",
      "crews_available",
      "dollars_staged",
      "roofs_impacted",
      "disputes_open",
      "feeds_online",
    ],
  },
];

export const LAYOUTS = ["table", "board", "map"] as const;
export type Layout = (typeof LAYOUTS)[number];

export function getLens(lens: string | undefined): LensConfig {
  return LENSES.find((l) => l.lens === lens) ?? LENSES[LENSES.length - 1]!;
}

export function formatValue(value: number, unit: string): string {
  if (unit === "usd") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1000)}K`;
    return `$${Math.round(value)}`;
  }
  if (unit === "index") return value.toFixed(1);
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}K`;
  return value >= 100 ? Math.round(value).toLocaleString() : value.toFixed(1);
}

/**
 * The one-prompt entry point. Resolves a plain sentence to a room state.
 * Deliberately transparent: it returns what it matched so the screen can say
 * out loud how it read the prompt.
 */
export function resolvePrompt(prompt: string): {
  lens?: Lens;
  scenario?: string;
  q?: string;
  layout?: Layout;
  matched: string[];
} {
  const p = prompt.toLowerCase();
  const matched: string[] = [];
  let lens: Lens | undefined;
  let scenario: string | undefined;
  let layout: Layout | undefined;

  const lensWords: Array<[Lens, string[]]> = [
    ["Banking", ["money", "capital", "dollars", "bank", "payment", "settle", "fund"]],
    ["Insurance", ["claim", "carrier", "insur", "policy", "adjuster"]],
    ["Construction", ["crew", "roof", "labor", "capacity", "build", "contractor"]],
    ["Legal", ["dispute", "denial", "legal", "litig", "supplement"]],
    ["Tech", ["feed", "data", "uptime", "platform", "sensor"]],
    ["Foundation", ["delegate", "governance", "stakeholder", "seat"]],
    ["Center", ["coordinat", "everything", "overall", "all seven", "center"]],
  ];
  for (const [candidate, words] of lensWords) {
    if (words.some((w) => p.includes(w))) {
      lens = candidate;
      matched.push(`lens → ${candidate}`);
      break;
    }
  }

  if (/beryl|hurricane|gulf|coast/.test(p)) {
    scenario = "beryl-2024";
    matched.push("scenario → Hurricane Beryl");
  } else if (/hail|metroplex|dallas|fort worth|north texas/.test(p)) {
    scenario = "north-texas-hail-2024";
    matched.push("scenario → North Texas Hail");
  }

  if (/map|where|geograph/.test(p)) {
    layout = "map";
    matched.push("layout → map");
  } else if (/board|group|by variable/.test(p)) {
    layout = "board";
    matched.push("layout → board");
  }

  const county = p.match(
    /\b(harris|matagorda|brazoria|galveston|fort bend|montgomery|wharton|jackson|tarrant|dallas|denton|collin|rockwall|ellis|johnson|parker)\b/,
  );
  const q = county ? county[1] : undefined;
  if (q) matched.push(`filter → ${q}`);

  return { lens, scenario, q, layout, matched };
}
