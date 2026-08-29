/**
 * The Interested User earn schedule.
 *
 * Phase 1 grain: earn-and-enter only. An Interested User can earn JBK for a
 * small set of gestures, each once, and spend a portion of it on entry to the
 * platform. No peer transfers, no external value. Amounts are decided
 * server-side; the client never proposes a balance.
 */

export type EarnReason =
  | "earned:arrival"
  | "earned:share"
  | "earned:invite"
  | "earned:participate";

export const EARN_SCHEDULE: Record<EarnReason, { amount: number; label: string; note: string }> = {
  "earned:arrival": {
    amount: 25,
    label: "Arrival",
    note: "Minted when the file opens. No email, no phone, no form.",
  },
  "earned:share": {
    amount: 50,
    label: "Share",
    note: "Passing the door along to someone who belongs in the room.",
  },
  "earned:invite": {
    amount: 100,
    label: "Invite",
    note: "Naming a person by role. The strongest anonymous signal there is.",
  },
  "earned:participate": {
    amount: 75,
    label: "Participate",
    note: "Running numbers, watching a county, or driving the console.",
  },
};

/** What it costs an Interested User to buy standing. */
export const ENTRY_PRICE_JBK = 150;

export const PLATFORM_TOKEN = "JBK";

export const REASON_LABELS: Record<string, string> = {
  "earned:arrival": "Arrival",
  "earned:share": "Share",
  "earned:invite": "Invite",
  "earned:participate": "Participate",
  "spent:entry": "Entry",
  "claimed:merge": "Claim / merge",
  "granted:seed": "Seed grant",
  "transfer:out": "Moved out",
  "transfer:in": "Moved in",
};

export function reasonLabel(reason: string): string {
  return REASON_LABELS[reason] ?? reason;
}
