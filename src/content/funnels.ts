/**
 * Phase 1 funnel tracks — SIMULATION content.
 *
 * Three audiences walk one spine: arrival → file → App Home → getting started →
 * reader → offer → request → confirmation → activity. A track changes the
 * framing, the starter tasks, the chapter read first, and the offer shown.
 * It never changes the record, the wallet, the ledger, a role, or a permission.
 *
 * Nothing written here is approved public copy and nothing here is a
 * commercial offer. Every offer carries the SIMULATION label on screen.
 */

export type FunnelTaskSeed = {
  /** Suffix only; the full task id is `track:<trackKey>:<id>`. */
  id: string;
  label: string;
  detail: string;
  why: string;
  action: string;
  href: string;
};

export type FunnelTrack = {
  key: string;
  label: string;
  /** One line under the wordmark when someone arrives on this track. */
  framing: string;
  /** The chapter this track is pointed at first. */
  readerChapter: string;
  readerLabel: string;
  /** The offer screen this track converges on. */
  offerSlug: string;
  offerTitle: string;
  offerLede: string;
  offerPoints: string[];
  /** What the offer asks for, in the person's own words. */
  offerAsk: string;
  /** What the confirmation says happens next. */
  confirmationNext: string;
  starterTasks: FunnelTaskSeed[];
};

export const FUNNEL_TRACKS: Record<string, FunnelTrack> = {
  builder: {
    key: "builder",
    label: "Experienced Builder",
    framing:
      "You have built things before. The question here is not whether you can run work — it is whether a market can be run honestly.",
    readerChapter: "the-wedge",
    readerLabel: "Leads Were Never the Product",
    offerSlug: "builder",
    offerTitle: "A seat at the table that writes the rules",
    offerLede:
      "A small number of experienced builders are being asked to read the operating model before it hardens, and to say where it breaks.",
    offerPoints: [
      "Read the working corpus, not a brochure.",
      "Say where the model fails against work you have actually run.",
      "Nothing is asked of your company, your systems, or your book of work.",
    ],
    offerAsk: "Ask for a briefing",
    confirmationNext:
      "Your file stays open. Read the chapter waiting in your tasks while the founder reviews the request — the reading is the part that matters before any conversation.",
    starterTasks: [
      {
        id: "read",
        label: "Read: Leads Were Never the Product",
        detail:
          "The one chapter that explains what is being sold, and why it is not a list of addresses.",
        why: "Everything else in this system reads differently once this chapter has been read. It is short and it is the argument.",
        action: "Open the chapter",
        href: "/manual/the-wedge",
      },
      {
        id: "offer",
        label: "See what is being asked of builders",
        detail: "A simulated Phase 1 offer, labelled as simulation and committing nobody.",
        why: "You should see the shape of the ask before anyone asks you anything in person.",
        action: "Open the offer",
        href: "/offer/builder",
      },
    ],
  },

  owner: {
    key: "owner",
    label: "Property Owner",
    framing:
      "Your roof is a record before it is a repair. What follows is about the record, and about who gets to read it.",
    readerChapter: "market-failure",
    readerLabel: "The Storm Is Not the Disaster",
    offerSlug: "owner",
    offerTitle: "Know what happened to your property, before anyone knocks",
    offerLede:
      "A property file that belongs to the owner — the events, the evidence, and the paper trail — rather than to whoever arrives first after a storm.",
    offerPoints: [
      "One file, held by you, that outlasts any contractor.",
      "Evidence and dates recorded once, readable later.",
      "No quote is generated here and no work is sold here.",
    ],
    offerAsk: "Register interest",
    confirmationNext:
      "There is no Property Owner area yet — this is honest, not a delay. Your interest is on file and your wallet and ledger are already yours.",
    starterTasks: [
      {
        id: "read",
        label: "Read: The Storm Is Not the Disaster",
        detail: "Why the damage is rarely the expensive part of what happens to a property.",
        why: "It explains the thing most owners only learn afterwards, at their own expense.",
        action: "Open the chapter",
        href: "/manual/market-failure",
      },
      {
        id: "offer",
        label: "See the property file idea",
        detail:
          "A simulated Phase 1 offer. No property record exists in this system yet and none is created.",
        why: "This track deliberately stops at a request. Nothing here will pretend to hold a property it cannot hold.",
        action: "Open the offer",
        href: "/offer/owner",
      },
    ],
  },

  contractor: {
    key: "contractor",
    label: "Licensed Contractor / ISR",
    framing:
      "A position here is earned, not bought and not granted. What it opens is the work, and the record of having done it well.",
    readerChapter: "group-construction",
    readerLabel: "Construction — Field Operations",
    offerSlug: "contractor",
    offerTitle: "The first paid position",
    offerLede:
      "The Independent Sales Rep is the first operating role the platform certifies: a fee paid from your own ledger, four modules, four quizzes, and the role writes itself.",
    offerPoints: [
      "Certification is earned. Nobody grants it and nobody buys past it.",
      "The fee is paid in JBK from the wallet you already hold.",
      "Licensed Contractor is catalogued and not yet open.",
    ],
    offerAsk: "Open the Role Store",
    confirmationNext:
      "Certification is the next step, and it happens in the Role Store rather than in a conversation. Your tasks will track it.",
    starterTasks: [
      {
        id: "read",
        label: "Read: Construction — Field Operations",
        detail: "What the Construction group actually owns, and what it refuses to own.",
        why: "The position only makes sense against the group it operates inside.",
        action: "Open the chapter",
        href: "/manual/group-construction",
      },
      {
        id: "offer",
        label: "See the ISR position",
        detail: "A simulated Phase 1 offer pointing at the one certifiable role that exists.",
        why: "The ISR curriculum is real and already built; the framing around it is simulation.",
        action: "Open the offer",
        href: "/offer/contractor",
      },
    ],
  },
};

export const FUNNEL_TRACK_KEYS = ["builder", "owner", "contractor"] as const;
export type FunnelTrackKey = (typeof FUNNEL_TRACK_KEYS)[number];

/** Where a track is remembered between the front door and App Home. */
export const FUNNEL_TRACK_STORAGE_KEY = "prepareamerica.track";

export function getTrack(key: string | null | undefined): FunnelTrack | null {
  if (!key) return null;
  return FUNNEL_TRACKS[key] ?? null;
}
