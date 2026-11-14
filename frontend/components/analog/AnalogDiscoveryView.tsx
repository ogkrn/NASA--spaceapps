"use client";

import React, { useState, useEffect } from "react";
import { CandidateSite, AnalogMatchResult } from "@/lib/types";
import { matchAnalogsForSite } from "@/lib/api";
import { Compass, CheckCircle2, ChevronRight, Sparkles, MapPin, Loader2 } from "lucide-react";

interface AnalogDiscoveryViewProps {
  site: CandidateSite;
  onSelectSite?: (siteId: string) => void;
}

export const AnalogDiscoveryView: React.FC<AnalogDiscoveryViewProps> = ({ site }) => {
  const [analogs, setAnalogs] = useState<AnalogMatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeAnalogId, setActiveAnalogId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    matchAnalogsForSite(site.id)
      .then((data) => {
        if (isMounted) {
          setAnalogs(data);
          if (data.length > 0) setActiveAnalogId(data[0].analog_id);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Analog match error", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [site.id]);

  const activeAnalog = analogs.find((a) => a.analog_id === activeAnalogId) || analogs[0];

  return (
    <div className="w-full space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl cyber-card border border-cyan-500/30 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            Automated Planetary Analog Discovery Engine
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Terrestrial Proving Grounds for {site.name} ({site.body})
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Our machine learning similarity engine computes 5-dimensional environmental vectors to pinpoint Earth&apos;s
            highest-fidelity analog testing grounds for rover navigation, drilling, and human habitat operations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-space-950/80 px-4 py-2.5 rounded-xl border border-space-700/80 shrink-0">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Target Geomorphology</div>
            <div className="text-sm font-bold text-cyan-300 capitalize">
              {site.recommended_analog_type.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 gap-3 cyber-card rounded-2xl">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-mono text-slate-300">Computing multidimensional environmental distance vectors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Match Roster Cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 px-1">
              Top Ranked Terrestrial Analogs ({analogs.length} Identified)
            </div>

            {analogs.map((item, idx) => {
              const isSelected = item.analog_id === activeAnalogId;
              return (
                <div
                  key={item.analog_id}
                  onClick={() => setActiveAnalogId(item.analog_id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-space-850 border-cyan-400 shadow-md shadow-cyan-950/40"
                      : "bg-space-900/70 border-space-700/70 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-space-800 text-cyan-300 border border-space-700 flex items-center justify-center text-xs font-mono font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.analog_name}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {item.location}, {item.country}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-mono font-extrabold text-cyan-300">
                        {item.overall_similarity_pct}%
                      </div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">Similarity</div>
                    </div>
                  </div>

                  {/* Similarity Progress Bar */}
                  <div className="w-full bg-space-950 h-2 rounded-full overflow-hidden border border-space-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.overall_similarity_pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Active Analog Detail */}
          {activeAnalog && (
            <div className="lg:col-span-7 p-6 rounded-2xl cyber-card border border-space-700/80 space-y-6">
              <div className="flex items-start justify-between border-b border-space-700 pb-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Selected Planetary Analog Profile
                  </div>
                  <h3 className="text-xl font-bold text-white">{activeAnalog.analog_name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeAnalog.location} · {activeAnalog.country}
                  </p>
                </div>

                <div className="bg-cyan-950/70 border border-cyan-800 px-3.5 py-1.5 rounded-xl text-center">
                  <div className="text-xl font-mono font-extrabold text-cyan-300">
                    {activeAnalog.overall_similarity_pct}%
                  </div>
                  <div className="text-[10px] uppercase font-mono text-cyan-400">Fidelity Match</div>
                </div>
              </div>

              {/* Sub-Score Breakdown Matrix */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Environmental Dimension Fidelity
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-space-950 border border-space-800">
                    <div className="text-[11px] text-slate-400 mb-1">Topography</div>
                    <div className="text-base font-bold text-emerald-400">{activeAnalog.topography_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-950 border border-space-800">
                    <div className="text-[11px] text-slate-400 mb-1">Geology / Regolith</div>
                    <div className="text-base font-bold text-cyan-400">{activeAnalog.geology_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-950 border border-space-800">
                    <div className="text-[11px] text-slate-400 mb-1">Thermal Range</div>
                    <div className="text-base font-bold text-amber-400">{activeAnalog.thermal_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-space-950 border border-space-800">
                    <div className="text-[11px] text-slate-400 mb-1">Volatiles / Ice</div>
                    <div className="text-base font-bold text-purple-400">{activeAnalog.volatiles_score}%</div>
                  </div>
                </div>
              </div>

              {/* Scientific Rationale */}
              <div className="p-4 rounded-xl bg-space-950/80 border border-cyan-900/50">
                <div className="text-xs font-mono text-cyan-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Mission Commander Justification
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeAnalog.scientific_rationale}
                </p>
              </div>

              {/* NASA / Flight Agency Test Protocols */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Established NASA / ESA Field Protocols at this Analog
                </h4>
                <div className="space-y-2">
                  {activeAnalog.key_analog_activities.map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

