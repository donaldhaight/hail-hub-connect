/**
 * Entry context — arrival attribution, captured in the browser only.
 *
 * Founder ruling (2026-09-22): a minimal additive `entry_context` column on the
 * anchor/request record was PROPOSED and is NOT authorized. Until it is, the
 * context below is captured in the browser, shown to the person on screen, and
 * carried into a request as free text. Nothing is persisted server-side.
 *
 * It is marketing context and never authority: it creates no role, credential,
 * Stakeholder Group or permission.
 */
export const ENTRY_CONTEXT_STORAGE_KEY = "prepareamerica.entry_context";

export interface EntryContext {
  entry_door: string;
  campaign: string | null;
  initial_intent: string | null;
  interest: string | null;
  promise_version: string;
  referral_source: string | null;
  captured_at: string;
}

export function readEntryContext(): EntryContext | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ENTRY_CONTEXT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EntryContext;
  } catch {
    return null;
  }
}

/** Written once per browser per door. Never rewritten afterwards. */
export function captureEntryContext(input: {
  entryDoor: string;
  promiseVersion: string;
  campaign?: string | null;
  initialIntent?: string | null;
}): EntryContext {
  const existing = readEntryContext();
  if (existing && existing.entry_door === input.entryDoor) return existing;

  const params = new URLSearchParams(window.location.search);
  const next: EntryContext = {
    entry_door: input.entryDoor,
    campaign: input.campaign ?? params.get("campaign") ?? params.get("utm_campaign"),
    initial_intent: input.initialIntent ?? null,
    interest: null,
    promise_version: input.promiseVersion,
    referral_source:
      params.get("utm_source") ?? (document.referrer ? document.referrer : null),
    captured_at: new Date().toISOString(),
  };
  window.localStorage.setItem(ENTRY_CONTEXT_STORAGE_KEY, JSON.stringify(next));
  return next;
}

/** An interest statement is the one field a visitor may set themselves. */
export function setEntryInterest(interest: string): EntryContext | null {
  const existing = readEntryContext();
  if (!existing) return null;
  const next = { ...existing, interest };
  window.localStorage.setItem(ENTRY_CONTEXT_STORAGE_KEY, JSON.stringify(next));
  return next;
}
