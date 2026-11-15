"use client";

import React from "react";
import { Compass, Cpu, Orbit, Sparkles, BookOpen, Layers, GitCompare, BookOpenCheck } from "lucide-react";

interface NavbarProps {
  onShowWelcome?: () => void;
  currentPlanet: "Moon" | "Mars";
  onSelectPlanet: (planet: "Moon" | "Mars") => void;
  mode: "scientific" | "educational";
  onToggleMode: (mode: "scientific" | "educational") => void;
  activeTab: "explorer" | "analogs" | "simulator" | "benchmarks" | "compare" | "references";
  onSelectTab: (tab: "explorer" | "analogs" | "simulator" | "benchmarks" | "compare" | "references") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onShowWelcome,
  currentPlanet,
  onSelectPlanet,
  mode,
  onToggleMode,
  activeTab,
  onSelectTab,
}) => {
  const isMoon = currentPlanet === "Moon";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-900/40 bg-[#040916]/90 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 min-h-[76px] py-4 flex flex-wrap gap-4 items-center justify-between">
        {/* Brand */}
        <button onClick={onShowWelcome} className="flex items-center gap-3 text-left" aria-label="Return to ARES-LUNA welcome page">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-sky-400/60 bg-sky-950/60 shadow-lg shadow-black/30">
            <Orbit className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-[0.18em] text-lg text-slate-100 font-mono">
              ARES<span className="text-sky-300">·</span>LUNA
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                FIELD INTELLIGENCE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Planetary analog intelligence / mission planning
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="order-3 w-full md:order-none md:w-auto flex flex-wrap items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/10">
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
            Explore
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
            Analogs
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
            Simulate
          </button>

          <button
            onClick={() => onSelectTab("compare")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "compare"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare
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
            Rank
          </button>

          <button
            onClick={() => onSelectTab("references")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "references"
                ? isMoon
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                  : "bg-mars-rust/30 text-orange-300 border border-orange-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            Sources
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
                  ? "bg-[#f4f0e8] text-[#17120f] font-bold shadow-sm"
                    : "text-[#a7a49d] hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              Moon
            </button>
            <button
              onClick={() => onSelectPlanet("Mars")}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                !isMoon
                  ? "bg-[#bd6944] text-white font-bold shadow-sm"
                  : "text-[#a7a49d] hover:text-white"
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

