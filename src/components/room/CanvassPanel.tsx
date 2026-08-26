import { useMemo, useState } from "react";
import type { CanvassRow, MissionTrackRow } from "@/lib/economics.functions";
import { count, pct } from "@/content/economics";

interface Props {
  canvass: CanvassRow[];
  tracks: MissionTrackRow[];
  /** Counties currently lit by the scenario, so the two footprints line up. */
  activeCounties: string[];
}

export function CanvassPanel({ canvass, tracks, activeCounties }: Props) {
  const [onlyActive, setOnlyActive] = useState(true);
  const active = useMemo(() => new Set(activeCounties), [activeCounties]);

  const rows = useMemo(
    () => (onlyActive ? canvass.filter((c) => active.has(c.county)) : canvass),
    [canvass, onlyActive, active],
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          precincts: acc.precincts + r.precincts,
          records: acc.records + Number(r.records),
          voters: acc.voters + Number(r.registered_voters),
          households: acc.households + Number(r.households),
        }),
        { precincts: 0, records: 0, voters: 0, households: 0 },
      ),
    [rows],
  );

  const cycleSpan = useMemo(() => {
    if (!rows.length) return "—";
    const earliest = Math.min(...rows.map((r) => r.earliest_cycle));
    const latest = Math.max(...rows.map((r) => r.latest_cycle));
    return `${earliest}–${latest}`;
  }, [rows]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-silver">
              Track Two · Canvass
            </div>
            <h2 className="mt-2 font-serif text-2xl text-ink">
              Public records, at the same county grain as the storm
            </h2>
            <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
              Coverage only. Precincts, cycles, registered voters, households — every figure from a
              public source, at the identical geography the weather track already works. No
              conclusion is drawn on this screen.
            </p>
          </div>
          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Match the storm footprint
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px md:grid-cols-5">
          {[
            ["Counties", String(rows.length)],
            ["Precincts", count(totals.precincts)],
            ["Cycles covered", cycleSpan],
            ["Registered voters", count(totals.voters)],
            ["Households", count(totals.households)],
          ].map(([label, value]) => (
            <div key={label} className="border border-border bg-ink/[0.02] p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                {label}
              </div>
              <div className="mt-1 font-serif text-2xl text-ink">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink/[0.03]">
              <tr>
                {[
                  "County",
                  "Precincts",
                  "Cycles",
                  "Records",
                  "Registered",
                  "Turnout",
                  "Households",
                  "Truth",
                ].map((h) => (
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
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-2 text-ink">
                    {r.county}
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
                      {r.state}
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{count(r.precincts)}</td>
                  <td className="px-3 py-2 tabular-nums">
                    {r.cycles_covered}{" "}
                    <span className="text-[11px] text-muted-foreground">
                      ({r.earliest_cycle}–{r.latest_cycle})
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{count(Number(r.records))}</td>
                  <td className="px-3 py-2 tabular-nums">{count(Number(r.registered_voters))}</td>
                  <td className="px-3 py-2 tabular-nums">{pct(Number(r.turnout_rate))}</td>
                  <td className="px-3 py-2 tabular-nums">{count(Number(r.households))}</td>
                  <td className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                    {r.truth_label}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-sm text-muted-foreground">
                    No coverage rows for the counties in view.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-silver">
          Source: {rows[0]?.source ?? "Public election records"} · county grain · records only
        </p>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="font-serif text-xl text-ink">Tracks in play</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <article key={t.id} className="border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                  {t.kind}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-navy">
                  {t.truth_label}
                </span>
              </div>
              <h3 className="mt-2 font-serif text-lg text-ink">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.purpose}</p>
              <p className="mt-2 text-[12px] text-silver">{t.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
