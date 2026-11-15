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
import { CompareView } from "@/components/compare/CompareView";
import { ReferencesView } from "@/components/data/ReferencesView";
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
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  Heart,
  Rocket,
  Star,
  ChevronDown,
} from "lucide-react";

function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="landing-page min-h-screen bg-[#040916] text-white">
      <header className="landing-topbar">
        <div className="flex items-center gap-3">
          <div className="landing-avatar"><Rocket className="h-4 w-4" /></div>
          <div>
            <div className="text-sm font-bold tracking-tight">ARES·LUNA</div>
            <div className="text-[11px] text-slate-500">Planetary analog intelligence</div>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">For NASA Space Apps</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="landing-icon-button" aria-label="Save project"><Heart className="h-4 w-4" /></button>
          <button className="landing-icon-button" aria-label="Bookmark project"><Bookmark className="h-4 w-4" /></button>
          <button onClick={onEnter} className="landing-contact-button">Open mission console <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-image" />
          <div className="landing-hero-shade" />
          <div className="landing-hero-content">
            <div className="landing-kicker"><span /> THE NEXT ERA OF EXPLORATION</div>
            <h1>PLANETARY<br /><em>ANALOGS</em></h1>
            <p>Find the place before you go.</p>
            <button onClick={onEnter} className="landing-hero-cta">
              Start exploring <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="landing-hero-meta">
            <span>01 / 06</span>
            <span className="landing-line" />
            <span>Moon · Mars · Earth</span>
          </div>
        </section>

        <section className="landing-discovery">
          <div className="landing-discovery-copy">
            <div className="landing-kicker"><Star className="h-3 w-3" /> ARES·LUNA FIELD GUIDE</div>
            <h2>Journey<br /><em>beyond</em></h2>
            <p>Compare target worlds with real Earth proving grounds, then test the mission before the mission begins.</p>
            <button onClick={onEnter} className="landing-text-link">Explore the catalogue <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="landing-destination-grid">
            <button onClick={onEnter} className="destination-card destination-moon">
              <span className="destination-orb orb-moon" />
              <span className="destination-label">THE MOON</span>
              <strong>Polar<br />Frontier</strong>
              <ArrowRight className="destination-arrow h-4 w-4" />
            </button>
            <button onClick={onEnter} className="destination-card destination-mars">
              <span className="destination-orb orb-mars" />
              <span className="destination-label">MARS</span>
              <strong>Red Planet<br />Expedition</strong>
              <ArrowRight className="destination-arrow h-4 w-4" />
            </button>
            <button onClick={onEnter} className="destination-card destination-earth">
              <span className="destination-orb orb-earth" />
              <span className="destination-label">EARTH</span>
              <strong>Analog<br />Proving Grounds</strong>
              <ArrowRight className="destination-arrow h-4 w-4" />
            </button>
          </div>
        </section>

        <div className="landing-scroll-cue"><ChevronDown className="h-4 w-4" /> Scroll to discover</div>
      </main>
    </div>
  );
}

export default function HomePage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState<"Moon" | "Mars">("Moon");
  const [mode, setMode] = useState<"scientific" | "educational">("scientific");
  const [activeTab, setActiveTab] = useState<"explorer" | "analogs" | "simulator" | "benchmarks" | "compare" | "references">("explorer");

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

  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="site-shell min-h-screen bg-space-grid text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar
        onShowWelcome={() => setHasEntered(false)}
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
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 py-8 space-y-8">
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
        ) : activeTab === "compare" ? (
          <CompareView initialBody={currentPlanet} initialSites={candidates} />
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
        ) : activeTab === "references" ? (
          <ReferencesView />
        ) : (
          /* 3D Explorer & Candidate Roster View */
          <div className="space-y-8">
            {/* Mission-control hero: a large live globe surrounded by operational context. */}
            <div className="hero-shell rounded-[2rem] p-5 sm:p-8 lg:p-10 space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                  <div className="relative z-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-sky-300">
                    <span className="h-2 w-2 rounded-full bg-sky-300 animate-pulse" />
                    Mission preparation / Earth analog intelligence
                  </div>
                  <h1 className="display-font relative z-10 mt-3 max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.92] text-slate-100">
                    Find the place<br /><span className="text-sky-300">before you go.</span>
                  </h1>
                  <p className="relative z-10 mt-5 max-w-xl text-sm leading-7 text-[#b3afa7]">
                    ARES·LUNA turns Moon and Mars site concepts into an evidence-led mission conversation:
                    explore a target, find the right Earth proving ground, and test a transparent resource budget.
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-[10px] font-mono text-[#a7a49d]">
                  <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5">LIVE CATALOGUE</span>
                  <span className="rounded-full border border-sky-800/70 bg-sky-950/50 px-3 py-1.5 text-sky-300">SCENARIO MODE</span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="relative z-10 xl:col-span-9">
                <PlanetaryGlobe
                  planet={currentPlanet}
                  sites={candidates}
                  selectedSiteId={selectedSite?.id || null}
                  onSelectSite={(s) => setSelectedSite(s)}
                />
                </div>

                {/* Selected Site Telemetry & Radar Spider Chart */}
                <div className="relative z-10 xl:col-span-3 p-5 rounded-[1.5rem] cyber-card border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="border-b border-space-700 pb-3 mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-sky-300 uppercase tracking-wider">
                          {currentPlanet} / candidate telemetry
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
                  <h3 className="display-font text-2xl font-medium text-slate-100 tracking-tight flex items-center gap-2">
                  <Orbit className="w-4 h-4 text-sky-300" />
                  {currentPlanet} candidate roster
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
      <footer className="w-full border-t border-sky-900/40 bg-[#040916] py-8 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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

