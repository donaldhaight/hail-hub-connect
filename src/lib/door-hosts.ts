/**
 * One engine, many domains (ADR-030).
 *
 * Each venture domain serves its canonical Door as its own front page,
 * rendered by this same platform. A stranger arriving on claimstore.com
 * meets ClaimStore — not PrepareAmerica. Paths stay shared; only the
 * front page wears the domain's face.
 *
 * Only personas that exist are mapped. A domain whose Door has not been
 * built falls through to the movement home until it is.
 */
import { PERSONAS, type Persona } from "@/content/personas";

const HOST_TO_PERSONA: Record<string, string> = {
  "claimstore.com": "claimstore",
  "www.claimstore.com": "claimstore",
  "buddyclaim.com": "buddy-claim",
  "www.buddyclaim.com": "buddy-claim",
  "kimosabe.ai": "kimosabe",
  "www.kimosabe.ai": "kimosabe",
  "rrcausa.com": "rrca",
  "www.rrcausa.com": "rrca",
  "adjustingprofessionals.com": "adjusting-professionals",
  "www.adjustingprofessionals.com": "adjusting-professionals",
  "selfinsurity.com": "selfinsurity",
  "www.selfinsurity.com": "selfinsurity",
  "nationalroofingarmy.com": "national-roofing-army",
  "www.nationalroofingarmy.com": "national-roofing-army",
  "marketapplications.io": "market-applications",
  "www.marketapplications.io": "market-applications",
};


export function personaForHost(host: string | null | undefined): Persona | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  const id = HOST_TO_PERSONA[hostname];
  return id ? (PERSONAS[id] ?? null) : null;
}
