import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { roleLabel } from "@/lib/roles";
import { PLATFORM_TOKEN } from "@/lib/wallet.schedule";

const KEY = "kimosabe.welcomeAck";

/**
 * The first-run greeting. It names what was granted and confirms that
 * anything earned before signing up now sits in this person's own wallet.
 * Acknowledged once, it does not return.
 */
export function WelcomeCard({
  identity,
  roles,
  balance,
  walletClaimedAt,
}: {
  identity: string | null;
  roles: string[];
  balance: number;
  walletClaimedAt: string | null;
}) {
  const [show, setShow] = useState(false);
  const storageKey = `${KEY}:${identity ?? "anon"}`;

  useEffect(() => {
    if (!identity) return;
    setShow(window.localStorage.getItem(storageKey) !== "1");
  }, [identity, storageKey]);

  if (!show) return null;

  const named = roles.filter((r) => r !== "interested_user").map(roleLabel);

  return (
    <section className="relative mb-8 border border-navy/40 bg-secondary/40 p-6">
      <button
        type="button"
        aria-label="Dismiss welcome"
        onClick={() => {
          window.localStorage.setItem(storageKey, "1");
          setShow(false);
        }}
        className="absolute right-3 top-3 text-silver transition-colors hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-navy">
        Welcome
      </div>
      <h2 className="mt-2 font-serif text-2xl tracking-tight text-ink">
        You are recognized here.
      </h2>
      <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-ink/85">
        {named.length
          ? `You hold ${named.join(", ")}. What you hold is what this home shows you — the menu, the tasks, and the rooms all read from it.`
          : "No group has been attached to your name yet. Introduce yourself and the founder can grant one in a single click."}
      </p>
      <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
        {walletClaimedAt
          ? `Everything you earned before you signed up has moved into your own wallet — ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(balance)} ${PLATFORM_TOKEN}, carried across by two ledger entries in the open.`
          : `Your wallet is open with ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(balance)} ${PLATFORM_TOKEN}. Anything you earned at the front door can still be claimed from a device that recognized you.`}
      </p>
    </section>
  );
}
