"use client";

import React, { useState, useEffect } from "react";
import { CandidateSite } from "@/lib/types";
import { fetchCandidates } from "@/lib/api";
import { ServiceStatus } from "@/components/ServiceStatus";
import { EvidencePanel } from "@/components/EvidencePanel";
import { Navbar } from "@/components/Navbar";
import { PlanetaryGlobe } from "@/components/3d/PlanetaryGlobe";
import { RadarComparison } from "@/components/dashboard/RadarComparison";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { AnalogDiscoveryView } from "@/components/analog/AnalogDiscoveryView";
import { MissionSimulatorView } from "@/components/simulator/MissionSimulatorView";
import { MCDARankingView } from "@/components/dashboard/MCDARankingView";
import { EducationalModeView } from "@/components/educational/EducationalModeView";
import { AIExplanationModal } from "@/components/explanation/AIExplanationModal";
import { DataProvenance } from "@/components/data/DataProvenance";
import { 
  Sparkles, 
  Orbit, 
  Radio, 
  ShieldCheck, 
  Droplets, 
  Sun, 
  Layers, 
  Cpu, 
  Loader2,
  Activity,
  MapPin,
  ArrowUpRight
} from "lucide-react";

export default function HomePage() {
  const [currentPlanet, setCurrentPlanet] = useState<"Moon" | "Mars">("Moon");
  const [mode, setMode] = useState<"scientific" | "educational">("scientific");
  const [activeTab, setActiveTab] = useState<"explorer" | "analogs" | "simulator" | "benchmarks">("explorer");

  const [candidates, setCandidates] = useState<CandidateSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<CandidateSite | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [aiModalSiteId, setAiModalSiteId] = useState<string | null>(null);

  // Fetch candidates when planet changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setCandidates([]);
    setSelectedSite(null);
    fetchCandidates(currentPlanet)
      .then((data) => {
        if (isMounted) {
          setCandidates(data);
          if (data.length > 0) {
            setSelectedSite(data[0]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch candidates error", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPlanet]);

  const handleOpenAnalogs = (siteId: string) => {
    const s = candidates.find((c) => c.id === siteId);
    if (s) setSelectedSite(s);
    setActiveTab("analogs");
  };

  const handleOpenSimulator = (siteId: string) => {
    const s = candidates.find((c) => c.id === siteId);
    if (s) setSelectedSite(s);
    setActiveTab("simulator");
  };

  const handleOpenAIExplain = (siteId: string) => {
    setAiModalSiteId(siteId);
    setAiModalOpen(true);
  };

  const siteForModal = candidates.find((c) => c.id === aiModalSiteId) || selectedSite;

  return (
    <div className="min-h-screen bg-space-950 bg-space-grid text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar
        currentPlanet={currentPlanet}
        onSelectPlanet={(p) => {
          if (p !== currentPlanet) {
            setCurrentPlanet(p);
            setSelectedSite(null);
            setAiModalOpen(false);
          }
        }}
        mode={mode}
        onToggleMode={setMode}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <ServiceStatus />
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 gap-3">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-sm font-mono text-slate-400">Loading {currentPlanet} scenarios and evidence...</p>
          </div>
        ) : mode === "educational" && activeTab === "explorer" ? (
          /* Educational Mode View */
          <EducationalModeView
            currentPlanet={currentPlanet}
            sites={candidates}
            onSelectSite={(s) => setSelectedSite(s)}
            onOpenSimulator={handleOpenSimulator}
          />
        ) : activeTab === "analogs" && selectedSite ? (
          /* Planetary Analog Discovery View */
          <AnalogDiscoveryView site={selectedSite} />
        ) : activeTab === "simulator" && selectedSite ? (
          /* Mission Planning Simulator View */
          <MissionSimulatorView site={selectedSite} />
        ) : activeTab === "benchmarks" ? (
          /* MCDA Benchmarks View */
          <MCDARankingView
            currentPlanet={currentPlanet}
            onSelectSiteId={(id) => {
              const s = candidates.find((c) => c.id === id);
              if (s) {
                setSelectedSite(s);
                setActiveTab("explorer");
              }
            }}
          />
        ) : (
          /* 3D Explorer & Candidate Roster View */
          <div className="space-y-8">
            {/* Mission-control hero: a large live globe surrounded by operational context. */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Exploration dashboard / visual reference
                  </div>
                  <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-white">
                    {currentPlanet} settlement intelligence
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Explore candidate nodes, compare Earth proving grounds, and test whether a
                    resource budget meets its declared scenario assumptions.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="rounded border border-space-700 bg-space-900/80 px-2 py-1">LOCAL SCENARIOS</span>
                  <span className="rounded border border-emerald-800/60 bg-emerald-950/30 px-2 py-1 text-emerald-300">ILLUSTRATIVE INPUTS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-9">
                <PlanetaryGlobe
                  planet={currentPlanet}
                  sites={candidates}
                  selectedSiteId={selectedSite?.id || null}
                  onSelectSite={(s) => setSelectedSite(s)}
                />
                </div>

                {/* Selected Site Telemetry & Radar Spider Chart */}
                <div className="xl:col-span-3 p-5 rounded-2xl cyber-card border border-space-700/80 flex flex-col justify-between">
                <div>
                  <div className="border-b border-space-700 pb-3 mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        Illustrative scenario inputs & priority radar
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedSite?.name || "Select a Landing Node"}
                      </h3>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {selectedSite?.region || "Awaiting node selection"}
                    </div>
                  </div>

                  {selectedSite && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="rounded-lg border border-space-800 bg-black/30 p-2">
                          <div className="text-[9px] uppercase text-slate-500">Illumination</div>
                          <div className="mt-1 text-sm font-mono font-bold text-amber-300">{selectedSite.solar_illumination_pct}%</div>
                        </div>
                        <div className="rounded-lg border border-space-800 bg-black/30 p-2">
                          <div className="text-[9px] uppercase text-slate-500">Ice assumption</div>
                          <div className="mt-1 text-sm font-mono font-bold text-cyan-300">{selectedSite.water_ice_probability_pct}%</div>
                        </div>
                        <div className="rounded-lg border border-space-800 bg-black/30 p-2">
                          <div className="text-[9px] uppercase text-slate-500">Earth link</div>
                          <div className="mt-1 flex items-center gap-1 text-sm font-mono font-bold text-blue-300">
                            <Radio className="w-3 h-3" />{selectedSite.earth_visibility_pct}%
                          </div>
                        </div>
                        <div className="rounded-lg border border-space-800 bg-black/30 p-2">
                          <div className="text-[9px] uppercase text-slate-500">Slope</div>
                          <div className="mt-1 text-sm font-mono font-bold text-emerald-300">{selectedSite.slope_degrees}°</div>
                        </div>
                      </div>
                      {/* Radar Spider Chart */}
                      <RadarComparison site={selectedSite} />

                      {/* Brief Scientific Summary */}
                      <p className="text-xs text-slate-300 leading-relaxed mt-2 p-3 rounded-xl bg-space-950/70 border border-space-850">
                        {selectedSite.scientific_significance}
                      </p>
                      <DataProvenance site={selectedSite} />
                    </>
                  )}
                </div>

                {selectedSite && (
                  <div>
                    <div className="pt-4 mt-4 border-t border-space-800 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAnalogs(selectedSite.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-mono bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        Analogs
                      </button>
                      <button
                        onClick={() => handleOpenSimulator(selectedSite.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-mono bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        Simulate
                      </button>
                      <button
                        onClick={() => handleOpenAIExplain(selectedSite.id)}
                        className="py-2 px-3 rounded-xl text-xs font-mono bg-space-800 hover:bg-space-700 text-slate-200 border border-space-600 flex items-center justify-center gap-1.5 transition-all"
                        aria-label="Open evidence briefing"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    </div>
                    <button
                      onClick={() => setActiveTab("benchmarks")}
                      className="mt-2 w-full py-2 rounded-xl text-[10px] font-mono text-slate-400 hover:text-white border border-space-800 hover:border-cyan-700 transition-all flex items-center justify-center gap-1"
                    >
                      Open comparison console <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Candidate Sites Roster Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Orbit className="w-4 h-4 text-cyan-400" />
                    {currentPlanet} Settlement Candidate Roster
                  </h3>
                  <p className="text-xs text-slate-400">
                    Nine exploration scenarios with linked context. No landing approval or safety rating.
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  {candidates.length} Candidate Sites
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {candidates.map((site) => (
                  <SiteCard
                    key={site.id}
                    site={site}
                    isSelected={site.id === selectedSite?.id}
                    onSelect={() => setSelectedSite(site)}
                    onOpenAnalogs={handleOpenAnalogs}
                    onOpenSimulator={handleOpenSimulator}
                    onOpenAIExplain={handleOpenAIExplain}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedSite && <div className="max-w-7xl w-full mx-auto px-4"><EvidencePanel site={selectedSite} /></div>}
      {/* AI Explanation Modal */}
      {siteForModal && (
        <AIExplanationModal
          site={siteForModal}
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          initialMode={mode === "educational" ? "educational" : "scientific"}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-space-800/80 bg-space-950 py-6 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NASA Space Apps Challenge 2026 · Permanent Moon Base & Mars</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Context references: NASA · ESA · USGS / Numerical inputs: illustrative</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

