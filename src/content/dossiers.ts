import type { TruthClass, ConfidentialityClass } from "@/components/briefing/Badges";

export type DossierSection = {
  heading: string;
  truth: TruthClass;
  body: string; // plain text; paragraphs split on blank lines
};

export type Dossier = {
  slug: string;
  code: string;
  storyOrder: number;
  title: string;
  summary: string;
  confidentiality: ConfidentialityClass;
  truthDefault: TruthClass;
  sections: DossierSection[];
};

export const DOSSIERS: Dossier[] = [
  {
    slug: "rrca-case-study",
    code: "01",
    storyOrder: 1,
    title: "RRCA Restructuring — Case Study",
    summary:
      "The working case study for restructuring the Roofing & Reconstruction Contractors of America into the operational proof of the ClaimStore thesis.",
    confidentiality: "C3",
    truthDefault: "HYPOTHESIS",
    sections: [
      {
        heading: "Why RRCA is the proof of concept",
        truth: "ASSERTION",
        body: `RRCA is a real, national trade association inside the insurance-restoration market — the exact fragmented category the ClaimStore thesis is designed to consolidate. Restructuring it in the open, with insider observers, is how we test the model before we scale it.

We are not building a hypothetical. We are documenting a live restructuring, on the record, with truth labels attached to every claim.`,
      },
      {
        heading: "Current state",
        truth: "SIMULATION",
        body: `Working artifacts — org chart, member registers, standardized workflows, and audit surfaces — are being staged for founder review. Numbers shown in any early screen are simulated pending real-data ingest.`,
      },
      {
        heading: "What insiders will see next",
        truth: "OPEN",
        body: `The next release opens the restructuring workspace: registers, standardized project workflow, and the first audit exports. Insiders will be asked to redline both the artifact and the labeling discipline itself.`,
      },
    ],
  },
  {
    slug: "claimexpress",
    code: "02",
    storyOrder: 2,
    title: "ClaimExpress — Operational Layer",
    summary:
      "The transaction rails: how a claim moves from event → sales → dispatch → project → completion → capital, standardized across restoration.",
    confidentiality: "C2",
    truthDefault: "SIMULATION",
    sections: [
      {
        heading: "The pipeline",
        truth: "ASSERTION",
        body: `Event → Lead → Qualified Claim → Contractor Dispatch → Project → Completion → Settlement → Capital Event. Every stage today is handled by a different fragmented actor with a different system of record. ClaimExpress standardizes the object and the handoff.`,
      },
      {
        heading: "Simulated end-to-end flow",
        truth: "SIMULATION",
        body: `Behind the paywall, the operational app renders a full simulated claim moving through the pipeline. This is the surface the PrepareAmerica attendees will see live. All parties, dollars, and timings are illustrative.`,
      },
    ],
  },
  {
    slug: "claimstore",
    code: "03",
    storyOrder: 3,
    title: "ClaimStore — Network Thesis",
    summary:
      "The Barry-Diller-style rollup of the fragmented insurance-restoration market into a single, standardized, permissioned network.",
    confidentiality: "C2",
    truthDefault: "ASSERTION",
    sections: [
      {
        heading: "The Diller pattern, applied",
        truth: "ASSERTION",
        body: `Diller's playbook: identify a fragmented category with poor information flow, aggregate the supply side into a network, standardize the transaction, take a small toll on every unit. Insurance restoration is that category — a hail or hurricane event dispatches thousands of independent actors with no shared spine.

ClaimStore is that spine.`,
      },
      {
        heading: "Why now",
        truth: "HYPOTHESIS",
        body: `Climate volatility increases event frequency. Carriers are consolidating and demand standardized settlement data. Contractors are cash-constrained and want capital access. The three sides of the market are, for the first time, motivated to accept a shared network.`,
      },
      {
        heading: "The toll",
        truth: "OPEN",
        body: `Pricing, take rate, and settlement mechanics are open questions. Any figure surfaced in insider materials is a simulation for discussion, not an offer.`,
      },
    ],
  },
  {
    slug: "usa-foundry",
    code: "04",
    storyOrder: 4,
    title: "USA Foundry — ClaimsBank · ClaimLoan · ClaimCoin",
    summary:
      "The capital layer of United Stakeholders of America: standardized ledgers, contractor financing, and the tokenized settlement unit.",
    confidentiality: "C3",
    truthDefault: "HYPOTHESIS",
    sections: [
      {
        heading: "Three instruments, one ledger",
        truth: "ASSERTION",
        body: `ClaimsBank standardizes settlement accounting. ClaimLoan finances the contractor's working-capital gap between dispatch and settlement. ClaimCoin is the internal unit of account on the network — not an offering, not a security, structurally described only.`,
      },
      {
        heading: "Structural map only",
        truth: "OPEN",
        body: `Every instrument here is described structurally for insider critique. Nothing in this dossier constitutes an offer to sell or a solicitation to buy any security, token, note, or interest.`,
      },
    ],
  },
  {
    slug: "prepare-america",
    code: "05",
    storyOrder: 5,
    title: "PrepareAmerica Conference — Agenda & Attendees",
    summary:
      "The two congresses. The streamed reveal on 11-01-2026, the convened ratification on Super Bowl weekend 2027, and the presentation order of the working artifacts.",
    confidentiality: "C2",
    truthDefault: "DECISION",
    sections: [
      {
        heading: "The First Congress",
        truth: "DECISION",
        body: `Sunday, November 1, 2026 · streamed to ticket holders. A reveal, an announcement, and an invitation — you need an invitation to receive the invitation. Presentation order follows the dossier index above.`,
      },
      {
        heading: "The Second Congress",
        truth: "DECISION",
        body: `Super Bowl weekend 2027 · Gratitude Ranch, Flower Mound, TX · 300 delegates convened in person to ratify Season One. Private, non-transferable invitations issued to First Congress ticket holders.`,
      },
      {
        heading: "Delegate categories",
        truth: "ASSERTION",
        body: `C-level insurance and restoration operators. Institutional and family-office capital. Contractors with balance sheet. Government and think-tank observers. Legal and regulatory counsel.`,
      },

      {
        heading: "Open logistics",
        truth: "OPEN",
        body: `Room block, transportation, and confidentiality protocol for the day are being finalized. Insiders will receive logistics separately from this dossier surface.`,
      },
    ],
  },
];

export const DOSSIERS_BY_SLUG: Record<string, Dossier> = Object.fromEntries(
  DOSSIERS.map((d) => [d.slug, d]),
);

export const ORDERED_DOSSIERS = [...DOSSIERS].sort((a, b) => a.storyOrder - b.storyOrder);

export function neighbors(slug: string): { prev: Dossier | null; next: Dossier | null } {
  const idx = ORDERED_DOSSIERS.findIndex((d) => d.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? ORDERED_DOSSIERS[idx - 1] : null,
    next: idx < ORDERED_DOSSIERS.length - 1 ? ORDERED_DOSSIERS[idx + 1] : null,
  };
}
