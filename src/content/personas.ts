/**
 * Front-door personas.
 *
 * One engine, many faces. Every persona below renders through the same
 * `FrontDoor` component and shares the same wallet, ledger, and anchor —
 * a person recognized at one door is the same person at every other.
 * Only the voice, the palette, and the vocabulary change.
 *
 * This is the shapeshifting thesis expressed in code rather than in copy:
 * the scout adapts its face to the market it is standing in, and never
 * splits the person's file to do it.
 *
 * Founder ruling (2026-09-22): this engine is the canonical Door. Positioning
 * copy for a venture renders as `sections` beneath the door rather than as a
 * second public page with a different promise. All such copy is PREVIEW copy
 * pending founder and counsel approval.
 */

/** One positioning block rendered beneath the door. */
export interface DoorSection {
  id: string;
  eyebrow: string;
  title: string;
  /** One or more paragraphs. */
  body: string[];
  /** Named items with a boundary line each. */
  items?: { term: string; detail: string; boundary?: string }[];
  /** An ordered sequence. */
  steps?: string[];
  /** Shown as a chip on the section — e.g. SIMULATION, FUTURE, PROPOSED. */
  label?: string;
}

/** A self-declared interest statement. Never a role, credential or permission. */
export interface DoorInterest {
  intro: string;
  note: string;
  options: { id: string; label: string; detail: string }[];
}

export interface Persona {
  /** Stable key. Also the palette selector via [data-brand]. */
  id: string;
  /** The name shown at the top of the door. */
  wordmark: string;
  /** One line under the wordmark. Small caps, no period. */
  eyebrow: string;
  /** The promise, in one sentence, on the opened file. */
  promise: string;
  /** Placeholder in the first, unopened ask field. */
  askPlaceholder: string;
  /** Placeholder once the file is open and the person asks again. */
  askAgainPlaceholder: string;
  /** The button that opens the file. */
  openLabel: string;
  /** What this door says the moment a file opens. */
  openedBody: string;
  /** How this door explains the holding wallet. */
  walletBody: string;
  /** Palette token; matches [data-brand="…"] in styles.css. */
  paletteToken: string;
  /** Route path for canonical/meta. */
  path: string;
  /** Page title. */
  title: string;
  /** Page description. */
  description: string;
  /** Optional positioning copy rendered beneath the door. */
  sections?: DoorSection[];
  /** Optional interest selection. Interest is not authority. */
  interest?: DoorInterest;
  /** Regulatory / status disclosure shown at the foot of the sections. */
  disclosure?: string;
  /** The exact wording version this door is showing. Recorded on arrival. */
  promiseVersion?: string;
}

export const PERSONAS: Record<string, Persona> = {
  kimosabe: {
    id: "kimosabe",
    wordmark: "Kimosabe",
    eyebrow: "No email. No phone. No form.",
    promise:
      "A scout who goes ahead, reads the ground, and comes back with the path. You do not have to know the terrain — that is the whole point of bringing one.",
    askPlaceholder: "Ask anything. The first question opens your file.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — an opaque anchor, a holding wallet, and a permanent line in an append-only ledger. Kimosabe changes shape to fit whatever you are trying to do; what it never changes is your record. One person, one file, every door.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "ochre",
    path: "/kimosabe",
    title: "Kimosabe",
    description:
      "The scout who walks ahead. Arrive with no email and no phone — ask once, and a file opens: a holding wallet, an append-only ledger, and a direct line to guidance that remembers you.",
  },
  "buddy-claim": {
    id: "buddy-claim",
    wordmark: "Buddy Claim",
    eyebrow: "For property owners, reps, and contractors",
    promise:
      "The same scout, standing in the insurance restoration market — speaking for SelfInsurity and the ClaimStore vision, on the side of whoever owns the roof.",
    askPlaceholder: "Ask about your roof, your claim, or your next job.",
    askAgainPlaceholder: "Ask again — Buddy keeps the file open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — tied to you, not to a claim number. Buddy Claim is how the insurance restoration market looks when somebody is finally keeping your side of the record: what was promised, when, and by whom.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry into the market as a recognized position. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "burgundy",
    path: "/buddy-claim",
    title: "Buddy Claim",
    description:
      "The insurance restoration market with somebody finally on your side of the record. Ask once and a file opens — no email, no phone, no claim number required.",
    promiseVersion: "Buddy Claim Door v0.1 — 2026-09-23",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "You are the only party to your claim without a record.",
        body: [
          "The carrier keeps a file. The adjuster keeps notes. The contractor keeps a scope. You keep a folder of emails and a memory of a phone call, and when the accounts disagree, yours is the one that cannot be produced.",
          "That asymmetry is not usually malice. It is simply that everyone else in the room does this for a living, writes things down as a matter of routine, and you do it once or twice in your lifetime, under a tarp, in a hurry.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "What Buddy Claim is",
        title: "A record kept on your side, from the first question.",
        label: "PREVIEW",
        body: [
          "Buddy Claim is not a company that handles your claim for you. It is a file that belongs to you, kept from the moment you first ask a question, so that what was said and when it was said stops being a matter of recollection.",
        ],
        items: [
          {
            term: "Your file",
            detail:
              "Opens on your first question. No email, no phone number, no claim number required.",
            boundary: "A record of your own, not a claim submission.",
          },
          {
            term: "The append-only ledger",
            detail:
              "Every entry is added; nothing is edited away later. What the record said last month still says it.",
            boundary: "A history, not a legal filing and not evidence of coverage.",
          },
          {
            term: "The scout",
            detail:
              "Ask anything at any hour and get a plain answer about what typically comes next, in your words.",
            boundary:
              "Guidance, not advice. Not a public adjuster, not a lawyer, not your carrier.",
          },
          {
            term: "The shared record",
            detail:
              "The intent is that authorized parties eventually read the same account of the same event.",
            boundary: "A concept under development. Nothing is shared with anyone today.",
          },
        ],
      },
      {
        id: "sequence",
        eyebrow: "How it would work",
        title: "The order it actually happens in.",
        label: "PREVIEW",
        body: [
          "Nothing here asks you to commit to anything. The first four steps exist today; the rest describe intent.",
        ],
        steps: [
          "You ask one question, and a file opens in your name.",
          "You say what happened to the property and when.",
          "What you were told, and by whom, gets written down as you learn it.",
          "You can see your own history at any time, and it is only yours.",
          "Authorized parties read the same account rather than three different ones.",
          "The work performed is written to the record as it happens.",
          "The claim closes with a history nobody had to reconstruct from memory.",
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "A property owner walks into a claim with the same quality of record as everyone else in the room. Not an advantage — parity.",
          "It is deliberately a smaller claim than this industry usually makes, and it is not yet built. Everything above the disclosure describes intent, tested first with one operating contractor rather than announced as a national service.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no role, credential, group or permission. The founder assigns every actual position, personally.",
      options: [
        {
          id: "property_owner",
          label: "Property owner",
          detail: "It is my roof, my building, my claim.",
        },
        {
          id: "contractor",
          label: "Contractor or restorer",
          detail: "I perform the work and carry the risk of getting paid late.",
        },
        {
          id: "rep",
          label: "Sales representative",
          detail: "I stand between the owner and the work, and I need the record to hold.",
        },
        {
          id: "carrier_adjuster",
          label: "Carrier or adjuster",
          detail: "I hold a position on claims and have to defend it.",
        },
        {
          id: "observer",
          label: "Observer",
          detail: "I am reading, not participating.",
        },
      ],
    },
    disclosure:
      "Preview copy. Buddy Claim is described here as a concept under development. It is not insurance, not a public adjusting service, not legal advice, not a lender, and not an offer or solicitation of any kind. Nothing on this page creates a business relationship, and no part of it has been approved for publication.",
  },

  /**
   * ClaimStore — the first canonical Door built under the 2026-09-22 rulings.
   * Message-only: no Claim File, no workflow, no payments, no new record.
   */
  claimstore: {
    id: "claimstore",
    wordmark: "ClaimStore",
    eyebrow: "ClaimStore Vision for the Insurance Restoration Market",
    promise:
      "One claim. One operating record. Every authorized party knows what comes next.",
    askPlaceholder: "Ask what a shared claim record would change for you.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — an opaque anchor, a holding wallet, and a permanent line in an append-only ledger. It is yours before any company, any claim number, and any role. ClaimStore is what the same discipline looks like applied to a claim instead of a person.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "teal",
    path: "/claimstore",
    title: "ClaimStore",
    description:
      "One claim, one operating record, every authorized party knowing what comes next. A preview of the ClaimStore vision for the insurance restoration market.",
    promiseVersion: "ClaimStore Door v0.1 — 2026-09-22",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "Nobody in a claim is reading the same record.",
        body: [
          "A property owner, a contractor, an adjuster, a lender and a supplier each hold a partial account of the same event. None of them is lying. They are simply reading different documents, written at different moments, none of which is the record.",
          "The cost of that is not drama. It is delay — weeks of re-proving what somebody already proved, paid for by whoever has the least ability to wait.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "The market pattern",
        title: "One record, and the things that can stand on it.",
        label: "PREVIEW",
        body: [
          "These are names for parts of a single pattern, not five products for sale. Each carries its boundary in the same breath as its description.",
        ],
        items: [
          {
            term: "ClaimStore",
            detail:
              "The shared operating record of a claim: what happened, what was agreed, what remains.",
            boundary: "A record, not an insurer and not an adjuster.",
          },
          {
            term: "ClaimExpress",
            detail:
              "The protocol — the ordered sequence every authorized party follows against that record.",
            boundary: "A protocol, not a promise of any outcome.",
          },
          {
            term: "ClaimsBank",
            detail:
              "The idea that a settled, evidenced claim is a financial object other parties can rely on.",
            boundary:
              "A concept under review. Not a bank, not a deposit, not a chartered institution.",
          },
          {
            term: "ClaimLoan",
            detail:
              "The idea that waiting for money is the expensive part of a claim, and can be financed against evidence.",
            boundary:
              "A concept under review. Not a lender, not a credit offer, not an application.",
          },
          {
            term: "ClaimCoin",
            detail:
              "A unit of account inside the system for participation and settlement between parties.",
            boundary:
              "A concept under review. Not a security, not an investment, not a tradable instrument.",
          },
        ],
      },
      {
        id: "sequence",
        eyebrow: "ClaimExpress",
        title: "The sequence, in the order it actually happens.",
        label: "PREVIEW",
        body: [
          "The value is not any one step. It is that every authorized party can see which step the claim is on without calling somebody to ask.",
        ],
        steps: [
          "An event is observed and recorded, with its date and its evidence.",
          "The property and the parties are identified against that event.",
          "Scope and cost are stated, in the open, by whoever is authorized to state them.",
          "The carrier position is recorded as given — not as remembered.",
          "Work is performed, and performance is written to the record as it happens.",
          "Money moves against what the record already says.",
          "The claim closes with a history no party had to reconstruct.",
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "A market where the record is neutral, the sequence is known, and no participant has to own the protocol in order to trust it.",
          "That is the whole ambition, and it is deliberately smaller than the language usually used in this industry. It is also not yet built. Everything on this page above the disclosure is a description of intent, tested first on one operating contractor rather than announced as a national system.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no role, credential, group or permission. The founder assigns every actual position, personally.",
      options: [
        {
          id: "property_owner",
          label: "Property owner",
          detail: "I own the building the claim is about.",
        },
        {
          id: "contractor",
          label: "Contractor or restorer",
          detail: "I perform the work and carry the risk of getting paid late.",
        },
        {
          id: "carrier_adjuster",
          label: "Carrier or adjuster",
          detail: "I hold a position on the claim and have to defend it.",
        },
        {
          id: "capital_supplier",
          label: "Supplier, lender or capital",
          detail: "I fund or supply the work and want the evidence to be legible.",
        },
        {
          id: "observer",
          label: "Observer",
          detail: "I am reading, not participating.",
        },
      ],
    },
    disclosure:
      "Preview copy. ClaimStore, ClaimExpress, ClaimsBank, ClaimLoan and ClaimCoin are described here as concepts under development. Nothing on this page is an offer, a solicitation, insurance, banking, lending, a security or financial advice, and no part of it has been approved for publication. Nothing here creates a business relationship between any party.",
  },
};

export function getPersona(id: string): Persona {
  const persona = PERSONAS[id];
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}
