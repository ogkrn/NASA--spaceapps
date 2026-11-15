"use client";

import React, { useState, useEffect, useRef } from "react";
import { CandidateSite, SimulationParameters, SimulationSummary } from "@/lib/types";
import { runMissionSimulation } from "@/lib/api";
import { 
  Cpu, 
  BatteryCharging, 
  Droplets, 
  ShieldAlert, 
  Sun, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Users,
  Clock,
  Layers,
  Loader2
} from "lucide-react";

interface MissionSimulatorViewProps {
  site: CandidateSite;
}

export const MissionSimulatorView: React.FC<MissionSimulatorViewProps> = ({ site }) => {
  const [params, setParams] = useState<SimulationParameters>({
    site_id: site.id,
    mission_duration_days: 60,
    crew_size: 4,
    power_system: "hybrid",
    solar_panel_area_m2: 350,
    nuclear_output_kw: 10,
    battery_capacity_kwh: 400,
    water_recycling_efficiency: 0.90,
    isru_excavation_rate_kg_day: 250,
    radiation_habitat_burial_depth_m: 1.5,
  });

  const [summary, setSummary] = useState<SimulationSummary | null>(null);
  const [running, setRunning] = useState<boolean>(false);

  const sequence = useRef(0);
  const [error, setError] = useState("");
  const run = (inputs: SimulationParameters) => {
    const id = ++sequence.current;
    setRunning(true); setError(""); setSummary(null);
    runMissionSimulation(inputs).then(res => { if (id === sequence.current) setSummary(res); })
      .catch(err => { if (id === sequence.current) setError(err.message); })
      .finally(() => { if (id === sequence.current) setRunning(false); });
  };
  const handleRunSimulation = () => run({ ...params, site_id: site.id });
  useEffect(() => {
    const inputs = { ...params, site_id: site.id };
    setParams(inputs); run(inputs);
    return () => { sequence.current++; };
    // Site changes intentionally retain the current user inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site.id]);
  const dirty = summary && JSON.stringify(summary.parameters) !== JSON.stringify({ ...params, site_id: site.id });

  return (
    <div className="w-full space-y-6">
      {/* Simulation Banner */}
      <div className="p-6 rounded-2xl cyber-card border border-amber-500/30 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Cpu className="w-4 h-4 text-amber-400" />
            Illustrative Resource-Budget Simulator
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Mission Planning: {site.name} ({site.body})
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Simulate day-by-day consumable drawdowns, solar irradiance cycles, nuclear baseload, regolith radiation
            attenuation, and closed-loop ECLSS water recycling over extended crew stays.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={running}
          className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-amber-500 hover:bg-amber-400 text-space-950 flex items-center gap-2 transition-all shadow-lg shadow-amber-950/40 shrink-0"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Calculating budget...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Execute Simulation
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl cyber-card border border-space-700/80 space-y-5">
          <div className="flex items-center justify-between border-b border-space-700 pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Mission Architecture Inputs
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-space-900 px-2 py-0.5 rounded border border-space-800">
              Interactive
            </span>
          </div>

          {/* Mission Duration */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Duration (24-hour Earth days)
              </span>
              <span className="text-amber-300 font-bold">{params.mission_duration_days} days</span>
            </div>
            <input aria-label="Duration in Earth days"
              type="range"
              min={14}
              max={180}
              step={1}
              value={params.mission_duration_days}
              onChange={(e) => setParams({ ...params, mission_duration_days: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Crew Size */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Crew Complement
              </span>
              <span className="text-amber-300 font-bold">{params.crew_size} Astronauts</span>
            </div>
            <input aria-label="Crew size"
              type="range"
              min={2}
              max={10}
              step={1}
              value={params.crew_size}
              onChange={(e) => setParams({ ...params, crew_size: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Power Architecture */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Power Generation Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "hybrid", label: "Hybrid PV+Nuclear" },
                { id: "solar_battery", label: "Solar + Storage" },
                { id: "nuclear_kilopower", label: "Kilopower Fission" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setParams({ ...params, power_system: p.id as any })}
                  className={`p-2 rounded-lg text-[11px] font-mono text-center border transition-all ${
                    params.power_system === p.id
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold"
                      : "bg-space-950 text-slate-400 border-space-800 hover:border-slate-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Battery Storage Capacity */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                Battery Storage Capacity
              </span>
              <span className="text-amber-300 font-bold">{params.battery_capacity_kwh} kWh</span>
            </div>
            <input aria-label="Battery capacity in kWh"
              type="range"
              min={100}
              max={1000}
              step={50}
              value={params.battery_capacity_kwh}
              onChange={(e) => setParams({ ...params, battery_capacity_kwh: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Habitat Regolith Burial Depth */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                Regolith Burial Shielding
              </span>
              <span className="text-amber-300 font-bold">{params.radiation_habitat_burial_depth_m} meters</span>
            </div>
            <input aria-label="Burial depth in meters"
              type="range"
              min={0.0}
              max={3.5}
              step={0.5}
              value={params.radiation_habitat_burial_depth_m}
              onChange={(e) => setParams({ ...params, radiation_habitat_burial_depth_m: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Water Recycling Efficiency */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                ECLSS Water Loop Closure
              </span>
              <span className="text-amber-300 font-bold">{Math.round(params.water_recycling_efficiency * 100)}%</span>
            </div>
            <input aria-label="Water recycling efficiency"
              type="range"
              min={0.70}
              max={0.98}
              step={0.02}
              value={params.water_recycling_efficiency}
              onChange={(e) => setParams({ ...params, water_recycling_efficiency: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* ISRU Excavation Rate */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                ISRU Regolith Mining Rate
              </span>
              <span className="text-amber-300 font-bold">{params.isru_excavation_rate_kg_day} kg/day</span>
            </div>
            <input aria-label="Excavation in kg per day"
              type="range"
              min={50}
              max={600}
              step={25}
              value={params.isru_excavation_rate_kg_day}
              onChange={(e) => setParams({ ...params, isru_excavation_rate_kg_day: Number(e.target.value) })}
              className="w-full accent-amber-400 bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results & Telemetry Charts Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && <p role="alert" className="border border-red-500 rounded p-4">{error} Use Execute Simulation to retry.</p>}
          {dirty && <p className="text-amber-200">Inputs changed. Results below belong to the last completed run. Execute again to update.</p>}
          {summary ? (
            <>
              {summary.warnings.map(warning => <p key={warning} className="text-xs text-amber-200">{warning}</p>)}
              {/* Scorecard Hero */}
              <div className="p-6 rounded-2xl cyber-card border border-space-700/80 bg-space-900/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      Resource-budget indicator (not survival probability)
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-3xl font-extrabold font-mono text-white">
                        {summary.mission_viability_score}
                        <span className="text-sm text-slate-400 font-normal"> / 100</span>
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider ${
                          summary.status === "NOMINAL"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : summary.status === "MARGINAL"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {summary.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-space-950 border border-space-800">
                      <div className="text-[10px] text-slate-400">Power Generated</div>
                      <div className="text-white font-bold">{summary.total_power_generated_mwh.toFixed(2)} MWh</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-space-950 border border-space-800">
                      <div className="text-[10px] text-slate-400">ISRU Water Yield</div>
                      <div className="text-cyan-300 font-bold">{summary.total_water_extracted_isru_liters.toFixed(1)} L</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-space-950 border border-space-800">
                      <div className="text-[10px] text-slate-400">Radiation Dose</div>
                      <div className="text-purple-300 font-bold">{summary.final_cumulative_radiation_msv.toFixed(2)} mSv</div>
                    </div>
                  </div>
                </div>

                {/* Telemetry Visual Graph (SVG Mini Timeline) */}
                <div className="mt-4 pt-4 border-t border-space-800">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                      Battery State of Charge (%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
                      Radiation trend (separate scale; total shown above)
                    </span>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full h-36 bg-space-950 rounded-xl border border-space-800 p-2 relative overflow-hidden">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />

                      {/* Battery Curve */}
                      <path
                        d={summary.daily_telemetry
                          .map((d, i) => {
                            const x = (i / Math.max(1, summary.daily_telemetry.length - 1)) * 500;
                            const y = 100 - d.battery_charge_pct;
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                      />

                      {/* Radiation Curve */}
                      <path
                        d={summary.daily_telemetry
                          .map((d, i) => {
                            const x = (i / Math.max(1, summary.daily_telemetry.length - 1)) * 500;
                            const y = 100 - (d.cumulative_radiation_msv / Math.max(1, summary.final_cumulative_radiation_msv)) * 100;
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                          })
                          .join(" ")}
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    </svg>

                    <div className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-500">
                      Day 1 → Day {summary.parameters.mission_duration_days}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-space-700 rounded-xl text-sm space-y-2">
                <p><strong>Final oxygen:</strong> {summary.daily_telemetry.at(-1)?.oxygen_stored_kg.toFixed(2)} kg · <strong>Final water:</strong> {summary.daily_telemetry.at(-1)?.water_stored_liters.toFixed(2)} L</p>
                <p>First unmet-demand day: {summary.first_failure_day ?? "none within this model"}</p>
                <details><summary className="cursor-pointer">Model assumptions and full telemetry</summary><ul className="list-disc pl-5">{summary.assumptions.map(x => <li key={x}>{x}</li>)}</ul>
                <div className="overflow-auto max-h-64 mt-3"><table className="w-full text-xs"><thead><tr><th>Day</th><th>Water L</th><th>Oxygen kg</th><th>Power deficit kWh</th><th>O2 deficit kg</th></tr></thead><tbody>{summary.daily_telemetry.map(d => <tr key={d.day}><td>{d.day}</td><td>{d.water_stored_liters.toFixed(2)}</td><td>{d.oxygen_stored_kg.toFixed(2)}</td><td>{d.power_deficit_kwh.toFixed(2)}</td><td>{d.oxygen_deficit_kg.toFixed(2)}</td></tr>)}</tbody></table></div></details>
              </div>
              {/* Bottlenecks and Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-space-900/70 border border-space-800">
                  <div className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Identified Bottlenecks
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {summary.bottlenecks.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-space-900/70 border border-space-800">
                  <div className="text-xs font-mono font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Commander Recommendations
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {summary.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : !error && running ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3 cyber-card rounded-2xl">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-sm font-mono text-slate-300">Calculating scenario budget...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

