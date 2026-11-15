"use client";

import React from "react";
import { Compass, Cpu, Orbit, Sparkles, BookOpen, Layers } from "lucide-react";

interface NavbarProps {
  currentPlanet: "Moon" | "Mars";
  onSelectPlanet: (planet: "Moon" | "Mars") => void;
  mode: "scientific" | "educational";
  onToggleMode: (mode: "scientific" | "educational") => void;
  activeTab: "explorer" | "analogs" | "simulator" | "benchmarks";
  onSelectTab: (tab: "explorer" | "analogs" | "simulator" | "benchmarks") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPlanet,
  onSelectPlanet,
  mode,
  onToggleMode,
  activeTab,
  onSelectTab,
}) => {
  const isMoon = currentPlanet === "Moon";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-space-700/80 bg-space-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 flex flex-wrap gap-3 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-800 p-0.5 shadow-lg shadow-cyan-900/30">
            <Orbit className="w-6 h-6 text-cyan-200 animate-spin" style={{ animationDuration: "18s" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">
                ARES<span className="text-cyan-400">·</span>LUNA
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                v1.1 Evidence + Scenarios
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Planetary Analog Intelligence & Mission Simulator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="order-3 w-full md:order-none md:w-auto flex flex-wrap items-center gap-1 bg-space-900/90 p-1 rounded-xl border border-space-700">
          <button
            onClick={() => onSelectTab("explorer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "explorer"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            3D Explorer & Sites
          </button>

          <button
            onClick={() => onSelectTab("analogs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "analogs"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Analog Discovery
          </button>

          <button
            onClick={() => onSelectTab("simulator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "simulator"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Mission Simulator
          </button>

          <button
            onClick={() => onSelectTab("benchmarks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "benchmarks"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            MCDA Ranking
          </button>
        </nav>

        {/* Planet & Mode Selectors */}
        <div className="flex items-center gap-3">
          {/* Planet Switcher */}
          <div className="flex items-center bg-space-900 border border-space-700 p-0.5 rounded-lg">
            <button
              onClick={() => onSelectPlanet("Moon")}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                isMoon
                  ? "bg-slate-200 text-space-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Moon
            </button>
            <button
              onClick={() => onSelectPlanet("Mars")}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                !isMoon
                  ? "bg-orange-600 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              Mars
            </button>
          </div>

          {/* Mode Switcher */}
          <button
            onClick={() => onToggleMode(mode === "scientific" ? "educational" : "scientific")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${
              mode === "scientific"
                ? "bg-cyan-950/60 border-cyan-700/70 text-cyan-300 hover:bg-cyan-900/60"
                : "bg-emerald-950/60 border-emerald-700/70 text-emerald-300 hover:bg-emerald-900/60"
            }`}
            title="Toggle between scientific commander telemetry and intuitive educational mode"
          >
            {mode === "scientific" ? (
              <>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Scientist Mode</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Explorer Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

