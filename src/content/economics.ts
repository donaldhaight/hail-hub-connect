/**
 * The Economics Engine — pure math.
 *
 * Every number the room can put on a screen comes from here, and every input
 * to this function is a row in `economics_assumptions` with a truth label and
 * a source. Nothing is invented at render time.
 */
import type { AssumptionRow } from "@/lib/economics.functions";

export const BANDS = ["low", "base", "high"] as const;
export type Band = (typeof BANDS)[number];

export type Inputs = {
  roofsImpacted: number;
  adSpend: number;
  canvasserHours: number;
  captains: boolean;
  band: Band;
};

export type Funnel = {
  addressable: number;
  impressions: number;
  surveysPaid: number;
  doors: number;
  surveysDoor: number;
  surveys: number;
  leads: number;
  captainLift: number;
  jobs: number;
  jobRevenue: number;
  synergyRevenue: number;
  totalRevenue: number;
  mediaCost: number;
  laborCost: number;
  campaignCost: number;
  costPerSurvey: number;
  costPerLead: number;
  costPerJob: number;
  contribution: number;
  roas: number;
};

export function pick(assumptions: AssumptionRow[], key: string, band: Band): number {
  const row = assumptions.find((a) => a.key === key);
  if (!row) return 0;
  return Number(row[band] ?? 0);
}

export function runFunnel(assumptions: AssumptionRow[], input: Inputs): Funnel {
  const v = (key: string) => pick(assumptions, key, input.band);

  const addressable = input.roofsImpacted * v("addressable_rate");

  const cpm = v("cpm") || 1;
  const impressions = (input.adSpend / cpm) * 1000;
  const surveysPaid = impressions / (v("impressions_per_survey") || 1);

  const doors = input.canvasserHours * v("doors_per_hour");
  const surveysDoor = doors / (v("doors_per_survey") || 1);

  // You cannot survey more households than the storm actually touched.
  const surveys = Math.min(surveysPaid + surveysDoor, addressable);

  const captainLift = input.captains ? v("captain_multiplier") || 1 : 1;
  const leads = surveys * v("survey_to_lead") * captainLift;
  const jobs = leads * v("lead_to_job");

  const jobRevenue = jobs * v("job_average");
  const attachTotal =
    v("attach_selfinsurity") + v("attach_buddyclaim") + v("attach_claimstore");
  const synergyRevenue = jobs * attachTotal * v("synergy_value_per_attach");
  const totalRevenue = jobRevenue + synergyRevenue;

  const mediaCost = input.adSpend;
  const laborCost = input.canvasserHours * v("canvasser_hour_cost");
  const campaignCost = mediaCost + laborCost;

  return {
    addressable,
    impressions,
    surveysPaid,
    doors,
    surveysDoor,
    surveys,
    leads,
    captainLift,
    jobs,
    jobRevenue,
    synergyRevenue,
    totalRevenue,
    mediaCost,
    laborCost,
    campaignCost,
    costPerSurvey: surveys ? campaignCost / surveys : 0,
    costPerLead: leads ? campaignCost / leads : 0,
    costPerJob: jobs ? campaignCost / jobs : 0,
    contribution: totalRevenue - campaignCost,
    roas: campaignCost ? totalRevenue / campaignCost : 0,
  };
}

/** The pricing adventure: what a stated lead volume costs to originate. */
export function priceLeadProgram(
  funnel: Funnel,
  leadsWanted: number,
  buildCost: number,
): {
  campaigns: number;
  originationCost: number;
  buildCost: number;
  totalBid: number;
  varianceBand: number;
  expectedJobs: number;
  expectedRevenue: number;
  costPerLeadDelivered: number;
} {
  const campaigns = funnel.leads > 0 ? leadsWanted / funnel.leads : 0;
  const originationCost = campaigns * funnel.campaignCost;
  const totalBid = originationCost + buildCost;
  const expectedJobs = leadsWanted * (funnel.leads ? funnel.jobs / funnel.leads : 0);
  const expectedRevenue =
    expectedJobs * (funnel.jobs ? funnel.totalRevenue / funnel.jobs : 0);
  return {
    campaigns,
    originationCost,
    buildCost,
    totalBid,
    varianceBand: totalBid * 0.1,
    expectedJobs,
    expectedRevenue,
    costPerLeadDelivered: leadsWanted ? totalBid / leadsWanted : 0,
  };
}

export function usd(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}

export function count(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 10_000) return `${Math.round(n / 1000).toLocaleString()}K`;
  return Math.round(n).toLocaleString();
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}
