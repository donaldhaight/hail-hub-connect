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

  /**
   * RRCA — the third canonical Door (2026-09-29). Strategic Partner / Advisor
   * language only. No capital intake, no investment wording.
   */
  /**
   * Adjusting Professionals — the preferred public Door (2026-10-04, A120).
   * The dualling twin of RRCA: same engine, the adjusting mission instead of
   * the contractor mission. Member Network first; Claim Caller stays a
   * protocol concept. Preview copy only.
   */
  "adjusting-professionals": {
    id: "adjusting-professionals",
    wordmark: "Adjusting Professionals",
    eyebrow: "The adjuster's record, kept by the adjuster",
    promise:
      "A member network for the people who determine the claim — so the file you build follows you, not the firm or the carrier that hired you.",
    askPlaceholder: "Ask how an adjuster keeps their own record.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — yours, before any firm, carrier or claim. Adjusting Professionals is where the determination side of a loss learns to read from the same record the contractor and the owner read from.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "navy",
    path: "/adjusting-professionals",
    title: "Adjusting Professionals",
    description:
      "A member network for independent and staff adjusters, built on one shared claim record. Ask once and a file opens; no email or phone required.",
    promiseVersion: "Adjusting Professionals Door v0.1 — 2026-10-04",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "The adjuster is the only party who has to start over every storm.",
        body: [
          "The contractor keeps their jobs. The carrier keeps its claims. The adjuster deploys, documents, determines — and then the work belongs to someone else. Reputation lives in other people's systems, and every new assignment begins from zero.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "What this is",
        title: "A member network, on the same record as the job.",
        label: "PREVIEW",
        body: [
          "Adjusting Professionals is the determination side of the ClaimExpress Protocol: the place where adjusters hold a continuing professional file and read the loss from the same record everyone else reads.",
        ],
        items: [
          {
            term: "Member Network",
            detail: "Independent adjusters, adjusting firms and staff adjusters, each with a file they own.",
            boundary: "Membership is an interest today. No credential, licence or assignment is issued here.",
          },
          {
            term: "One claim record",
            detail: "What was observed, what was determined, and what remains — beside the contractor's job record, not inside it.",
            boundary: "An operating record, not a coverage decision or a guarantee of any outcome.",
          },
          {
            term: "Claim Caller",
            detail: "A protocol concept for how a loss is first called in and routed to the right professionals.",
            boundary: "Concept only. Not a service, a dispatch, or a referral arrangement.",
          },
        ],
      },
      {
        id: "dual",
        eyebrow: "The dualling alternative",
        title: "Two missions, one engine.",
        label: "PREVIEW",
        body: [
          "RRCA proves the production side: a contractor running its work on one record. Adjusting Professionals proves the determination side. Same file, same ledger, same person at every door — the mission is the only thing that changes.",
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "An adjuster whose work history holds up in front of any firm, carrier or owner — and a determination process every other party can read without anyone controlling it.",
          "It is not yet built. Everything above the disclosure describes intent.",
        ],
      },
    ],
    interest: {
      intro: "Which side of the claim are you standing on?",
      note: "An interest statement only — it creates no role, credential, licence, group or permission. The founder assigns every actual position, personally.",
      options: [
        { id: "independent_adjuster", label: "Independent adjuster", detail: "I deploy and determine." },
        { id: "adjusting_firm", label: "Adjusting firm", detail: "I run a team of adjusters." },
        { id: "staff_adjuster", label: "Carrier or staff adjuster", detail: "I adjust inside a carrier." },
        { id: "contractor", label: "Contractor", detail: "I am on the other side of the same loss." },
        { id: "observer", label: "Observer", detail: "I am reading, not participating." },
      ],
    },
    disclosure:
      "Preview copy. Adjusting Professionals is a proposed member network. Nothing on this page is an offer of employment, an adjusting licence or credential, a claim service, an insurance product, or an offer of securities, and no part of it has been approved for publication. Nothing here creates a business relationship.",
  },

  rrca: {
    id: "rrca",
    wordmark: "RRCA",
    eyebrow: "Restoration, run on one record",
    promise:
      "One operating contractor, running its work on a shared record — so the proof is a job site, not a slide.",
    askPlaceholder: "Ask how a restoration company runs on one record.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — yours, before any company, role or job. RRCA is where the same discipline is being tested against real work: what was scoped, what was performed, and what remains.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "steel",
    path: "/rrca",
    title: "RRCA",
    description:
      "A restoration contractor running its work on one shared record — the first operating proof. Ask once and a file opens; no email or phone required.",
    promiseVersion: "RRCA Door v0.1 — 2026-09-29",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "A restoration job is run from six different memories.",
        body: [
          "The rep remembers what was promised. The crew remembers what was found. The office remembers what was billed. The owner remembers what they were told. Each is honest, and the job still drifts, because nobody is reading the same page.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "What RRCA is doing",
        title: "The first operating proof, on a real job site.",
        label: "PREVIEW",
        body: [
          "RRCA is a working restoration contractor volunteering to run its work on one shared record first — so the idea is tested against weather, crews and deadlines rather than announced.",
        ],
        items: [
          {
            term: "One job record",
            detail: "Scope, work performed and what remains, written as it happens.",
            boundary: "An operating record, not a guarantee of any outcome.",
          },
          {
            term: "Construction management",
            detail: "What must happen next is decided from the state of the job, not from a menu.",
            boundary: "Being built in order; not yet a finished system.",
          },
          {
            term: "Strategic partners and advisors",
            detail:
              "People with operating, industry or public-sector experience who want to help shape the proof.",
            boundary: "A conversation only. No capital is being raised or accepted here.",
          },
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "A contractor whose record holds up in front of any owner, carrier or partner — and a pattern other contractors can adopt without giving up the systems they already run.",
          "It is not yet built. Everything above the disclosure describes intent.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no role, credential, group or permission. The founder assigns every actual position, personally.",
      options: [
        { id: "contractor", label: "Contractor or restorer", detail: "I run jobs and want the record to hold." },
        {
          id: "strategic_partner",
          label: "Strategic partner or advisor",
          detail: "I bring experience and want to help shape the proof.",
        },
        { id: "property_owner", label: "Property owner", detail: "It is my building." },
        { id: "observer", label: "Observer", detail: "I am reading, not participating." },
      ],
    },
    disclosure:
      "Preview copy. RRCA's participation is described as an operating test under development. Nothing on this page is an offer or solicitation of securities, an investment opportunity, or a request for capital, and no part of it has been approved for publication. Nothing here creates a business relationship.",
  },

  /**
   * SelfInsurity — the fourth canonical Door (2026-09-29). Message only:
   * no Property record, no quote, no offer, no payment.
   */
  selfinsurity: {
    id: "selfinsurity",
    wordmark: "SelfInsurity",
    eyebrow: "The roof, assured for as long as you own it",
    promise:
      "A roof is the most exposed part of a home. The idea is simple: assure it for life, and keep the record that proves it.",
    askPlaceholder: "Ask what lifetime roof assurance would mean for you.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — yours, not a policy and not an application. SelfInsurity is exploring what it would take to stand behind a roof for its whole life, and that starts with a record the owner holds.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "emerald",
    path: "/selfinsurity",
    title: "SelfInsurity",
    description:
      "Exploring lifetime roof assurance — RoofLac — and the owner-held record behind it. A preview; not insurance and not an offer.",
    promiseVersion: "SelfInsurity Door v0.1 — 2026-09-29",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "Every storm restarts the same argument about the same roof.",
        body: [
          "Age, condition, prior repairs, workmanship — each claim relitigates a roof's history because nobody kept it. The owner pays for that in time, deductibles and doubt.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "The concept",
        title: "RoofLac — Lifetime Roof Assurance.",
        label: "PREVIEW",
        body: [
          "RoofLac is a concept carried by SelfInsurity: a roof installed and maintained to a known standard, recorded from day one, and assured for the life of ownership.",
        ],
        items: [
          {
            term: "The roof's record",
            detail: "Installation, inspections and repairs, kept in one history.",
            boundary: "Not yet built for properties. Nothing is recorded about your home today.",
          },
          {
            term: "Lifetime assurance",
            detail: "The idea that a well-recorded roof can be stood behind for as long as you own it.",
            boundary: "A concept under review. Not insurance, not a warranty, not a quote.",
          },
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "An owner who never has to prove their roof's history again, because it was never lost.",
          "No product exists, no price exists, and nothing can be purchased. Everything above the disclosure describes intent.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no role, credential, group or permission, and no policy or quote.",
      options: [
        { id: "property_owner", label: "Property owner", detail: "I want to know if my roof could qualify someday." },
        { id: "contractor", label: "Roofing contractor", detail: "I install roofs and want mine to be assured." },
        { id: "rep", label: "Sales representative", detail: "I would offer this alongside the work." },
        { id: "observer", label: "Observer", detail: "I am reading, not participating." },
      ],
    },
    disclosure:
      "Preview copy. SelfInsurity and RoofLac / Lifetime Roof Assurance are described as concepts under development. This is not insurance, not a warranty, not a quote, not an offer or solicitation, and nothing can be purchased. No property information is collected. No part of this page has been approved for publication.",
  },

  /**
   * National Roofing Army — the fifth canonical Door (2026-09-29).
   * Visibly proposed (ADR-028 §7): no members, counties, deployments,
   * territories, coverage or national operation is claimed.
   */
  "national-roofing-army": {
    id: "national-roofing-army",
    wordmark: "National Roofing Army",
    eyebrow: "A proposed readiness network for independent roofing contractors",
    promise:
      "When a storm lands, the work is done by independent contractors who were never organized for it. This asks whether they could be — without anyone taking them over.",
    askPlaceholder: "Ask what an organized contractor network would have to do for you.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — yours, not a roster entry. The National Roofing Army is a proposal, not an organization with members. Nothing here enlists you, assigns you a territory, or commits you to anything.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "steel",
    path: "/national-roofing-army",
    title: "National Roofing Army",
    description:
      "A proposed readiness network for independent roofing contractors. No members, no territories, no coverage claimed — a question being asked out loud.",
    promiseVersion: "National Roofing Army Door v0.1 — 2026-09-29",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "The storm arrives organized. The contractors do not.",
        body: [
          "Hail and hurricane work is absorbed by thousands of independent crews who meet each other for the first time in a parking lot. Capacity exists; coordination does not. The people who show up first are rarely the people who stay.",
          "Every other party in that market — carriers, adjusters, suppliers, capital — arrives with structure. The contractor arrives alone.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "The proposal",
        title: "Organized readiness, owned by no one above the contractors.",
        label: "PROPOSED",
        body: [
          "This is a question being asked in public, not a network being announced. Nothing below exists yet.",
        ],
        items: [
          {
            term: "Readiness before the storm",
            detail:
              "Knowing who is ready, for what kind of work, before weather makes it urgent.",
            boundary:
              "No contractor is enrolled, verified or listed today. No count of members exists to quote.",
          },
          {
            term: "A record the contractor keeps",
            detail:
              "Work performed, on which job, to what standard — written as it happens and carried by the contractor.",
            boundary: "Not built. The Records layer has its own gate and has not opened.",
          },
          {
            term: "Coordination without capture",
            detail:
              "Shared standards and shared logistics that no single carrier, supplier or platform owner controls.",
            boundary:
              "A governance intention, not a structure. No entity, membership or agreement exists.",
          },
        ],
      },
      {
        id: "not-claimed",
        eyebrow: "What is not being claimed",
        title: "Read this part before the rest.",
        body: [
          "There are no members. There are no verified counties, no deployments, no territories available or reserved, no coverage map, and no national operation. Nothing on this page says otherwise, and nothing said elsewhere on our behalf should.",
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "An independent contractor who arrives at a storm with the readiness of a large organization and the independence they started with.",
          "It is not built. Everything above the disclosure describes intent.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no membership, role, credential, territory, group or permission. The founder assigns every actual position, personally.",
      options: [
        {
          id: "contractor",
          label: "Roofing contractor",
          detail: "I run a company and want to know what this would ask of me.",
        },
        { id: "crew_lead", label: "Crew lead or foreman", detail: "I run the work in the field." },
        {
          id: "supplier",
          label: "Supplier or partner",
          detail: "I serve contractors and want to understand the shape of this.",
        },
        { id: "observer", label: "Observer", detail: "I am reading, not participating." },
      ],
    },
    disclosure:
      "Preview copy. The National Roofing Army is a proposal under development. It has no members, no verified territories, no deployments, no coverage and no national operation. Nothing on this page is an offer, a solicitation, an enrollment, an employment or contracting opportunity, or a commitment of work, and no part of it has been approved for publication. Nothing here creates a business relationship.",
  },

  /**
   * Market Applications — the sixth canonical Door (2026-09-29).
   * The technology anchor (ADR-014, SAS A): it builds the stack and
   * never sells the funnel. Legal shape remains unsettled and is not asserted.
   */
  "market-applications": {
    id: "market-applications",
    wordmark: "Market Applications",
    eyebrow: "The technology layer underneath all of it",
    promise:
      "Every party in the restoration market keeps its own version of the truth. This is the neutral layer where one record can live without any single party owning it.",
    askPlaceholder: "Ask what a neutral record layer would have to guarantee.",
    askAgainPlaceholder: "Ask again — the file stays open.",
    openLabel: "Open my file",
    openedBody:
      "A file opened the moment you asked — an anchor, a holding wallet, and an append-only line. That mechanism is the thing Market Applications builds: one continuing record for a person, across every door they walk through.",
    walletBody:
      "JoeBack is earned, never bought. It buys one thing: entry. Nothing here transfers to another person, and nothing here has external value until a certified role exists.",
    paletteToken: "electric",
    path: "/market-applications",
    title: "Market Applications",
    description:
      "The neutral technology layer beneath the insurance restoration market: one continuing record, append-only history, and integration that leaves existing systems in place.",
    promiseVersion: "Market Applications Door v0.1 — 2026-09-29",
    sections: [
      {
        id: "problem",
        eyebrow: "The problem",
        title: "Six systems, six versions of the same job.",
        body: [
          "The owner has paperwork, the contractor has a job file, the carrier has a claim, the supplier has an order, the lender has an exposure. None of them reconcile, and the cost of reconciling them is paid by whoever has the least power — usually the owner, then the contractor.",
          "The usual fix is for one party to buy the others' visibility. That solves coordination by creating capture.",
        ],
      },
      {
        id: "pattern",
        eyebrow: "The approach",
        title: "Build the rails. Never own the traffic.",
        label: "PREVIEW",
        body: [
          "Market Applications is the technology administration of this work: it builds the shared record and the integration layer, and it does not sell into the market it coordinates.",
        ],
        items: [
          {
            term: "One continuing record",
            detail:
              "A person or a property is the same record at every door, rather than a new row per brand.",
            boundary: "Already true of the arrival file here. Not yet true of properties or jobs.",
          },
          {
            term: "Append-only history",
            detail: "What happened is added, never rewritten. No administrator can edit the past.",
            boundary: "In force for arrivals. The wider record model has not reached its gate.",
          },
          {
            term: "Integration, not replacement",
            detail:
              "An API and agent interface so a contractor keeps the systems they already run and still participates.",
            boundary: "Last in the locked order. Specified, not built, and no partner is named.",
          },
          {
            term: "Neutrality as a constraint",
            detail:
              "The party that builds the rails is barred from secretly or structurally controlling the rules, pricing, attribution or access that bind everyone else.",
            boundary:
              "A stated principle. The legal shape of Market Applications is not settled and is not asserted here.",
          },
        ],
      },
      {
        id: "future",
        eyebrow: "Focused future",
        title: "What this becomes if it is right.",
        label: "FUTURE",
        body: [
          "Infrastructure boring enough that nobody argues about it, and neutral enough that nobody has to.",
          "Most of it is not built. Everything above the disclosure describes intent.",
        ],
      },
    ],
    interest: {
      intro: "Which side of this are you standing on?",
      note: "An interest statement only — it creates no role, credential, partnership, integration agreement, group or permission.",
      options: [
        {
          id: "technology_partner",
          label: "Technology partner",
          detail: "I build software this would have to talk to.",
        },
        {
          id: "operator",
          label: "Operator with systems already running",
          detail: "I run a business and will not replace my stack.",
        },
        {
          id: "strategic_partner",
          label: "Strategic partner or advisor",
          detail: "I bring experience and want to help shape it.",
        },
        { id: "observer", label: "Observer", detail: "I am reading, not participating." },
      ],
    },
    disclosure:
      "Preview copy. Market Applications is described as a technology layer under development; its legal form, ownership and governance are unsettled and nothing here asserts them. This is not an offer or solicitation of securities, an investment opportunity, a request for capital, or an offer of a product, integration or partnership, and no part of it has been approved for publication. Nothing here creates a business relationship.",
  },
};


export function getPersona(id: string): Persona {
  const persona = PERSONAS[id];
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}
