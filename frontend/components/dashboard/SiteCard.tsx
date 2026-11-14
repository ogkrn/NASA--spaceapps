"use client";

import React from "react";
import { CandidateSite } from "@/lib/types";
import { 
  Sun, 
  Droplets, 
  Mountain, 
  ShieldAlert, 
  Radio, 
  Sparkles, 
  Cpu, 
  Layers,
  ThermometerSnowflake 
} from "lucide-react";

interface SiteCardProps {
  site: CandidateSite;
  isSelected: boolean;
  onSelect: () => void;
  onOpenAnalogs: (siteId: string) => void;
  onOpenSimulator: (siteId: string) => void;
  onOpenAIExplain: (siteId: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isSelected,
  onSelect,
  onOpenAnalogs,
  onOpenSimulator,
  onOpenAIExplain,
}) => {
  const isMoon = site.body === "Moon";

  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
        isMoon ? "cyber-card" : "cyber-card-mars"
      } ${
        isSelected
          ? isMoon
            ? "border-cyan-400 bg-space-900/90 shadow-lg shadow-cyan-950/40"
            : "border-orange-500 bg-space-900/90 shadow-lg shadow-orange-950/40"
          : "border-space-700/60 hover:border-slate-500/80"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                isMoon
                  ? "bg-cyan-950 text-cyan-300 border border-cyan-800/60"
                  : "bg-orange-950 text-orange-300 border border-orange-800/60"
              }`}
            >
              {site.body} · {site.region}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {site.latitude > 0 ? `${site.latitude}°N` : `${Math.abs(site.latitude)}°S`},{" "}
              {site.longitude > 0 ? `${site.longitude}°E` : `${Math.abs(site.longitude)}°W`}
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">{site.name}</h3>
        </div>

        {isSelected && (
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isMoon ? "bg-cyan-400" : "bg-orange-400"
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isMoon ? "bg-cyan-500" : "bg-orange-500"
            }`} />
          </span>
        )}
      </div>

      <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {site.geological_context}
      </p>

      {/* Grid of Key Telemetry */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-space-950/60 border border-space-800/80 mb-4 text-xs font-mono">
        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <Sun className="w-3 h-3 text-amber-400" />
            Illumination
          </div>
          <div className="text-slate-100 font-bold">{site.solar_illumination_pct}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <Droplets className="w-3 h-3 text-cyan-400" />
            Water Ice
          </div>
          <div className="text-cyan-300 font-bold">{site.water_ice_probability_pct}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <Mountain className="w-3 h-3 text-emerald-400" />
            Slope / Elev
          </div>
          <div className="text-slate-100 font-bold">{site.slope_degrees}° / {site.elevation_m}m</div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <Radio className="w-3 h-3 text-blue-400" />
            Earth Link
          </div>
          <div className="text-slate-100 font-bold">{site.earth_visibility_pct}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <ShieldAlert className="w-3 h-3 text-purple-400" />
            Shielding
          </div>
          <div className="text-purple-300 font-bold">{site.natural_radiation_shielding_pct}%</div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <ThermometerSnowflake className="w-3 h-3 text-indigo-400" />
            Thermal K
          </div>
          <div className="text-slate-100 font-bold">{site.thermal_min_k} - {site.thermal_max_k}K</div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-space-800">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAnalogs(site.id);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono bg-space-850 hover:bg-space-800 text-slate-200 border border-space-700 flex items-center justify-center gap-1 transition-all"
        >
          <Layers className="w-3 h-3 text-cyan-400" />
          Earth Analogs
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenSimulator(site.id);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono bg-space-850 hover:bg-space-800 text-slate-200 border border-space-700 flex items-center justify-center gap-1 transition-all"
        >
          <Cpu className="w-3 h-3 text-amber-400" />
          Simulate
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAIExplain(site.id);
          }}
          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 flex items-center justify-center gap-1 transition-all"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          AI Briefing
        </button>
      </div>
    </div>
  );
};

