/** Client-safe shapes for the App Home. */

export type AppHomeTask = {
  id: string;
  label: string;
  detail: string;
  /** Why this is being asked — shown on the single-task view. */
  why: string;
  /** Label for the one action the task offers. */
  action: string;
  href: string;
  done: boolean;
  /** Whether the person may mark it done themselves. */
  dismissible: boolean;
};

export type AppHomeView = {
  email: string | null;
  roles: string[];
  balance: number;
  certification: {
    roleKey: string;
    feePaid: boolean;
    passed: number;
    total: number;
    completedAt: string | null;
  } | null;
  tasks: AppHomeTask[];
  walletClaimedAt: string | null;
};
