"use client";

import React, { useState, useEffect } from "react";
import { MCDAWeights, MCDARankResult } from "@/lib/types";
import { runMCDA } from "@/lib/api";
import { Sparkles, Sliders, Trophy, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";

interface MCDARankingViewProps {
  currentPlanet: "Moon" | "Mars";
  onSelectSiteId: (siteId: string) => void;
}

const DEFAULT_WEIGHTS: MCDAWeights = {
  illumination: 0.25,
  water_ice: 0.25,
  slope_trafficability: 0.15,
  earth_communication: 0.15,
  radiation_shielding: 0.10,
  thermal_stability: 0.10,
};

export const MCDARankingView: React.FC<MCDARankingViewProps> = ({
  currentPlanet,
  onSelectSiteId,
}) => {
  const [weights, setWeights] = useState<MCDAWeights>(DEFAULT_WEIGHTS);
  const [ranks, setRanks] = useState<MCDARankResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    runMCDA(weights, currentPlanet)
      .then((data) => {
        if (isMounted) {
          setRanks(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("MCDA error", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [weights, currentPlanet]);

  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl cyber-card border border-purple-500/30 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Intermediate-Level Multi-Criteria Decision Analysis (TOPSIS Engine)
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Scientific Outpost Suitability Ranking for {currentPlanet}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Evaluate and prioritize settlement candidate sites by dynamically weighting the 6 critical planetary engineering
            attributes. Computes Euclidean distance to the theoretical ideal positive and negative solutions ($C_i$).
          </p>
        </div>

        <button
          onClick={handleResetWeights}
          className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 bg-space-950 border border-space-700 hover:border-slate-500 flex items-center gap-1.5 transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Weights
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl cyber-card border border-space-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-space-700 pb-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Weight Sensitivity Tuner
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Total: 100%</span>
          </div>

          {[
            { key: "illumination", label: "Solar Illumination", val: weights.illumination, color: "accent-amber-400" },
            { key: "water_ice", label: "Water Ice Confidence", val: weights.water_ice, color: "accent-cyan-400" },
            { key: "slope_trafficability", label: "Terrain Trafficability", val: weights.slope_trafficability, color: "accent-emerald-400" },
            { key: "earth_communication", label: "Direct Earth Comms", val: weights.earth_communication, color: "accent-blue-400" },
            { key: "radiation_shielding", label: "Radiation Shielding", val: weights.radiation_shielding, color: "accent-purple-400" },
            { key: "thermal_stability", label: "Thermal Stability", val: weights.thermal_stability, color: "accent-pink-400" },
          ].map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-purple-300 font-bold">{Math.round(item.val * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.50}
                step={0.05}
                value={item.val}
                onChange={(e) =>
                  setWeights({ ...weights, [item.key]: parseFloat(e.target.value) })
                }
                className={`w-full ${item.color} bg-space-950 h-1.5 rounded-lg appearance-none cursor-pointer`}
              />
            </div>
          ))}
        </div>

        {/* Ranking Table Column (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl cyber-card border border-space-700/80 space-y-4">
          <div className="flex items-center justify-between border-b border-space-700 pb-3">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              TOPSIS Suitability Ranks ({ranks.length} Candidates Evaluated)
            </h3>
            <span className="text-[10px] font-mono text-cyan-300 bg-space-950 px-2 py-0.5 rounded border border-space-800">
              Closeness Index $C_i \in [0, 1]$
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-2">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <p className="text-xs font-mono text-slate-400">Computing normalized TOPSIS matrix...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ranks.map((r) => {
                const isFirst = r.rank === 1;
                return (
                  <div
                    key={r.site_id}
                    onClick={() => onSelectSiteId(r.site_id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isFirst
                        ? "bg-space-850 border-amber-500/60 shadow-md shadow-amber-950/30"
                        : "bg-space-900/60 border-space-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold border ${
                            isFirst
                              ? "bg-amber-500 text-space-950 border-amber-400 font-extrabold"
                              : "bg-space-950 text-slate-300 border-space-700"
                          }`}
                        >
                          #{r.rank}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {r.site_name}
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                          </h4>
                          <div className="text-[11px] text-slate-400">
                            Strength: <span className="text-emerald-400">{r.primary_strength}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-mono font-extrabold text-purple-300">
                          {r.closeness_score.toFixed(3)}
                        </div>
                        <div className="text-[10px] uppercase font-mono text-slate-400">Score</div>
                      </div>
                    </div>

                    {/* Mini Dimension Badges */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px] font-mono pt-2 border-t border-space-800 text-slate-300">
                      <div>Solar: <span className="text-amber-400">{r.dimension_scores.illumination}%</span></div>
                      <div>Ice: <span className="text-cyan-400">{r.dimension_scores.water_ice}%</span></div>
                      <div>Slope: <span className="text-emerald-400">{r.dimension_scores.trafficability}%</span></div>
                      <div>Comm: <span className="text-blue-400">{r.dimension_scores.communication}%</span></div>
                      <div>Shield: <span className="text-purple-400">{r.dimension_scores.radiation_shielding}%</span></div>
                      <div>Therm: <span className="text-pink-400">{r.dimension_scores.thermal_stability}%</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

