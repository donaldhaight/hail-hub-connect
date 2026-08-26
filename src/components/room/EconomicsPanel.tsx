import { useMemo, useState } from "react";
import type { AssumptionRow, ProgramCostRow } from "@/lib/economics.functions";
import {
  BANDS,
  count,
  pct,
  priceLeadProgram,
  runFunnel,
  usd,
  type Band,
} from "@/content/economics";

interface Props {
  scenarioName: string;
  roofsImpacted: number;
  assumptions: AssumptionRow[];
  costs: ProgramCostRow[];
}

function Rung({
  label,
  value,
  note,
  emphasis,
}: {
  label: string;
  value: string;
  note: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`border-l-2 py-3 pl-4 ${emphasis ? "border-navy" : "border-border"}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{label}</div>
      <div className={`mt-1 font-serif ${emphasis ? "text-3xl text-navy" : "text-2xl text-ink"}`}>
        {value}
      </div>
      <div className="mt-1 text-[12px] text-muted-foreground">{note}</div>
    </div>
  );
}

export function EconomicsPanel({ scenarioName, roofsImpacted, assumptions, costs }: Props) {
  const [band, setBand] = useState<Band>("low");
  const [adSpend, setAdSpend] = useState(250_000);
  const [canvasserHours, setCanvasserHours] = useState(12_000);
  const [captains, setCaptains] = useState(false);
  const [leadsWanted, setLeadsWanted] = useState(25_000);

  const funnel = useMemo(
    () => runFunnel(assumptions, { roofsImpacted, adSpend, canvasserHours, captains, band }),
    [assumptions, roofsImpacted, adSpend, canvasserHours, captains, band],
  );

  const buildCost = useMemo(
    () => costs.reduce((acc, c) => acc + Number(c.est_amount), 0),
    [costs],
  );
  const offer = useMemo(
    () => priceLeadProgram(funnel, leadsWanted, buildCost),
    [funnel, leadsWanted, buildCost],
  );

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
              Track One · Weather
            </div>
            <h2 className="mt-2 font-serif text-2xl text-ink">
              From footprint to closed job — {scenarioName}
            </h2>
            <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
              Every rung below multiplies one signal by one published assumption. The band selector
              swaps the assumption set; the ladder never changes shape. The low band is what gets
              shown in the room.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {BANDS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBand(b)}
                className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
                  band === b ? "border-navy text-navy" : "border-border text-muted-foreground hover:text-ink"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign inputs */}
        <div className="mt-6 grid gap-4 border border-border bg-ink/[0.02] p-4 md:grid-cols-3">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
              Ad spend — {usd(adSpend)}
            </span>
            <input
              type="range"
              min={0}
              max={2_000_000}
              step={25_000}
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
              Door-to-door hours — {count(canvasserHours)}
            </span>
            <input
              type="range"
              min={0}
              max={80_000}
              step={1_000}
              value={canvasserHours}
              onChange={(e) => setCanvasserHours(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <label className="flex items-center gap-3 self-end">
            <input
              type="checkbox"
              checked={captains}
              onChange={(e) => setCaptains(e.target.checked)}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
              Neighborhood Captains ×{funnel.captainLift.toFixed(2)}
            </span>
          </label>
        </div>

        {/* The ladder */}
        <div className="mt-8 grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
          <Rung
            label="Footprint"
            value={count(roofsImpacted)}
            note="Roofs impacted at the current clock step — from signals, not assumed."
          />
          <Rung
            label="Addressable"
            value={count(funnel.addressable)}
            note="Impacted properties a campaign can actually reach."
          />
          <Rung
            label="Surveys completed"
            value={count(funnel.surveys)}
            note={`${count(funnel.surveysPaid)} from ${count(funnel.impressions)} impressions · ${count(funnel.surveysDoor)} from ${count(funnel.doors)} doors`}
          />
          <Rung
            label="Leads originated"
            value={count(funnel.leads)}
            note="Surveys that become a named, routable lead."
            emphasis
          />
          <Rung
            label="Jobs contracted"
            value={count(funnel.jobs)}
            note="Leads that close to a signed job."
            emphasis
          />
          <Rung
            label="Revenue"
            value={usd(funnel.totalRevenue)}
            note={`${usd(funnel.jobRevenue)} roofing · ${usd(funnel.synergyRevenue)} network attach`}
            emphasis
          />
          <Rung
            label="Campaign cost"
            value={usd(funnel.campaignCost)}
            note={`${usd(funnel.mediaCost)} media · ${usd(funnel.laborCost)} labor`}
          />
          <Rung
            label="Cost per lead"
            value={usd(funnel.costPerLead)}
            note={`${usd(funnel.costPerSurvey)} per survey · ${usd(funnel.costPerJob)} per job`}
          />
          <Rung
            label="Contribution"
            value={usd(funnel.contribution)}
            note={`${funnel.roas.toFixed(2)}× return on campaign cost`}
          />
        </div>
      </section>

      {/* Pricing adventure */}
      <section className="border-t border-border pt-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
          The pricing adventure
        </div>
        <h2 className="mt-2 font-serif text-2xl text-ink">
          Name the lead volume; the bid writes itself
        </h2>
        <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
          Origination cost scales off the ladder above. The build-out is carried in the same bid, so
          the offer is complete — and it closes against the ledger inside a ten percent band.
        </p>

        <label className="mt-6 block max-w-xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
            Leads to purchase — {count(leadsWanted)}
          </span>
          <input
            type="range"
            min={1_000}
            max={250_000}
            step={1_000}
            value={leadsWanted}
            onChange={(e) => setLeadsWanted(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <div className="mt-6 grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-4">
          <Rung
            label="Origination"
            value={usd(offer.originationCost)}
            note={`${offer.campaigns.toFixed(1)} campaigns at this footprint`}
          />
          <Rung label="Build-out" value={usd(offer.buildCost)} note="Every cost line, one bid." />
          <Rung
            label="Turnkey bid"
            value={usd(offer.totalBid)}
            note={`±${usd(offer.varianceBand)} — the ten percent commitment`}
            emphasis
          />
          <Rung
            label="Delivered cost per lead"
            value={usd(offer.costPerLeadDelivered)}
            note={`${count(offer.expectedJobs)} expected jobs · ${usd(offer.expectedRevenue)} expected revenue`}
            emphasis
          />
        </div>

        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/[0.03]">
              <tr>
                {["Category", "Line", "Estimate", "Actual"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-silver"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costs.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {c.category}
                  </td>
                  <td className="px-3 py-2 text-ink">
                    {c.label}
                    <div className="text-[12px] text-muted-foreground">{c.note}</div>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-ink">{usd(Number(c.est_amount))}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">
                    {Number(c.act_amount) ? usd(Number(c.act_amount)) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assumption register */}
      <section className="border-t border-border pt-8">
        <h2 className="font-serif text-xl text-ink">Assumption register</h2>
        <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
          Nothing above is unattributed. Each row carries its own truth label and source.
        </p>
        <div className="mt-4 overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/[0.03]">
              <tr>
                {["Stage", "Assumption", "Low", "Base", "High", "Truth", "Source"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-silver"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assumptions.map((a) => {
                const fmt = (n: number) =>
                  a.unit === "usd" ? usd(n) : a.unit === "rate" ? pct(n) : count(n);
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {a.stage}
                    </td>
                    <td className="px-3 py-2 text-ink">
                      {a.label}
                      <div className="text-[12px] text-muted-foreground">{a.definition}</div>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{fmt(a.low)}</td>
                    <td className="px-3 py-2 tabular-nums font-medium text-ink">{fmt(a.base)}</td>
                    <td className="px-3 py-2 tabular-nums">{fmt(a.high)}</td>
                    <td className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                      {a.truth_label}
                    </td>
                    <td className="px-3 py-2 text-[12px] text-muted-foreground">{a.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
