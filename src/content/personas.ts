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
 */
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
  },
};

export function getPersona(id: string): Persona {
  const persona = PERSONAS[id];
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}
