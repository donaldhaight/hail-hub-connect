/**
 * The supported channel. One person, one line to Kimosabe — guidance, not a
 * community. Items may carry roleKeys; when set, only holders of one of those
 * roles see the item.
 */
export type FeedItem = {
  id: string;
  from: string;
  body: string;
  roleKeys?: string[];
};

export const KIMOSABE_FEED: FeedItem[] = [
  {
    id: "arrival",
    from: "Kimosabe",
    body: "Your file is open. Everything you earn, request, and certify lands here — this channel is your direct line back to guidance. It is watched by humans, and it is yours alone.",
  },
  {
    id: "wallet",
    from: "Kimosabe",
    body: "JoeBack is earned, never bought. If you arrived through the front door, your holding wallet travels with you — claim it from any device you were recognized on and the balance moves with two ledger entries, in the open.",
  },
  {
    id: "role-store",
    from: "Kimosabe",
    body: "The Role Store has two kinds of doors. Stakeholder Groups are requested and granted by the founder. Certified roles — ISR first — are earned: a fee in JBK, a short curriculum, a quiz per module. Nobody can grant you a certification, and nobody can buy their way past one.",
  },
  {
    id: "isr-next",
    from: "Kimosabe",
    body: "You are enrolled in ISR certification. Work the modules in order — each quiz passed is recorded against your identity, permanently. When the last one clears, the role writes itself.",
    roleKeys: ["isr"],
  },
  {
    id: "isr-done",
    from: "Kimosabe",
    body: "Certified. Your ISR role is part of your identity now — it shapes what this home shows you and what the MarketApp will let you touch. The Season's sales work routes through you.",
    roleKeys: ["isr"],
  },
  {
    id: "founder",
    from: "Kimosabe",
    body: "The queue is yours. Every request for access lands in one table; a grant is one click, and an invitation rides with it. What you grant here reshapes someone's App Home the next time they arrive.",
    roleKeys: ["founder_admin"],
  },
];
