/**
 * The supported channel. One person, one line to the scout — guidance, not a
 * community. Items may carry roleKeys; when set, only holders of one of those
 * roles see the item.
 *
 * Voice: warm, plainspoken, memory-bearing. The scout has walked ahead and is
 * reporting back. Never cute, never a chatbot, never a broadcast.
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
    body: "Your file is open, and it is the only one you will ever need here. Everything you earn, request, and certify lands in this channel. I change shape depending on where you are standing — a different name, a different market, a different vocabulary — but the record underneath stays yours, and stays one.",
  },
  {
    id: "wallet",
    from: "Kimosabe",
    body: "JoeBack is earned, never bought. If you came in through any front door, your holding wallet travels with you — claim it from any device I recognized you on and the balance moves with two ledger entries, in the open. Nothing about your file is written where you cannot see it.",
  },
  {
    id: "role-store",
    from: "Kimosabe",
    body: "The Role Store has two kinds of doors. Stakeholder Groups are requested and granted by the founder. Certified roles — ISR first — are earned: a fee in JBK, a short curriculum, a quiz per module. Nobody can grant you a certification, and nobody can buy their way past one. That rule is the reason the badge means anything.",
  },
  {
    id: "isr-next",
    from: "Kimosabe",
    body: "You are enrolled in ISR certification. Work the modules in order — each quiz you pass is recorded against your identity, permanently. When the last one clears, the role writes itself. I will not skip you ahead, and I will not let anyone else.",
    roleKeys: ["isr"],
  },
  {
    id: "isr-done",
    from: "Kimosabe",
    body: "Certified. Your ISR role is part of your identity now — it shapes what this home shows you and what the MarketApp will let you touch. The Season's sales work routes through you from here.",
    roleKeys: ["isr"],
  },
  {
    id: "founder",
    from: "Kimosabe",
    body: "The queue is yours. Every request for access lands in one table; a grant is one click, and an invitation rides with it. What you grant here reshapes someone's App Home the next time they arrive.",
    roleKeys: ["founder_admin"],
  },
];
