import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { claimWallet } from "@/lib/wallet.functions";
import { KIMOSABE_ANCHOR_KEY } from "@/lib/wallet.schedule";

/**
 * Keeps the promise made at the front door.
 *
 * An anonymous visitor earns JBK into a holding wallet keyed by an opaque
 * anchor in browser storage. The moment that person signs in, the holding
 * wallet is attached to their identity and its balance is moved onto the
 * MarketApp ledger-wallet — one claim, recorded as two ledger entries.
 *
 * Runs once per authenticated mount. The anchor is cleared whether the claim
 * succeeds or the wallet was already claimed, so it never runs twice against
 * the same file. A failure leaves the anchor in place to retry on the next
 * visit, and never blocks the person from using the application.
 */
export function useWalletClaim() {
  const claim = useServerFn(claimWallet);
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (typeof window === "undefined") return;

    const anchor = window.localStorage.getItem(KIMOSABE_ANCHOR_KEY);
    if (!anchor) return;

    let cancelled = false;
    claim({ data: { anchor } })
      .then((result) => {
        if (cancelled) return;
        window.localStorage.removeItem(KIMOSABE_ANCHOR_KEY);
        // Only a claim that actually moved value changes what the home shows.
        if (result.ok && result.movedJbk > 0) void router.invalidate();
      })
      .catch(() => {
        // Silent. The anchor stays put and the claim is retried next visit.
      });

    return () => {
      cancelled = true;
    };
  }, [claim, router]);
}
