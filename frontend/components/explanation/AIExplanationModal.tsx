"use client";

import React, { useState, useEffect } from "react";
import { CandidateSite, AIExplanationResponse } from "@/lib/types";
import { fetchAIExplanation } from "@/lib/api";
import { 
  X, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  AlertOctagon, 
  Compass, 
  Loader2 
} from "lucide-react";

interface AIExplanationModalProps {
  site: CandidateSite;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "scientific" | "educational" | "executive";
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  site,
  isOpen,
  onClose,
  initialMode = "scientific",
}) => {
  const [audienceMode, setAudienceMode] = useState<"scientific" | "educational" | "executive">(initialMode);
  const [explanation, setExplanation] = useState<AIExplanationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchAIExplanation(site.id, audienceMode)
      .then((data) => {
        setExplanation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AI Explain error", err);
        setLoading(false);
      });
  }, [site.id, audienceMode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl cyber-card border border-cyan-500/40 bg-space-950/95 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-space-900 border border-space-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Planetary Intelligence Engine · Multi-Criteria Synthesis
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {site.name} ({site.body})
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Coordinates: {site.latitude}° / {site.longitude}° · Region: {site.region}
          </p>
        </div>

        {/* Audience Mode Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-space-900 border border-space-800">
          {[
            { id: "scientific", label: "Scientific & Mission Commander", icon: ShieldCheck },
            { id: "educational", label: "Educational & Public Story", icon: BookOpen },
            { id: "executive", label: "Executive Trade-offs", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = audienceMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAudienceMode(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-sm font-mono text-slate-300">Generating AI planetary synthesis...</p>
          </div>
        ) : explanation ? (
          <div className="space-y-5">
            {/* Headline / Verdict */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
              <h3 className="text-base font-bold text-cyan-200 mb-1">{explanation.headline}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{explanation.suitability_verdict}</p>
            </div>

            {/* Geological Narrative */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Geological & Environmental Context
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-space-900/60 p-4 rounded-xl border border-space-800">
                {explanation.geological_narrative}
              </p>
            </div>

            {/* Earth Analog Parallels */}
            <div className="p-4 rounded-xl bg-space-900/80 border border-space-800 flex items-start gap-3">
              <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono text-cyan-300 font-bold mb-1">
                  Earth Proving Ground Correlation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {explanation.earth_analog_parallels}
                </p>
              </div>
            </div>

            {/* Challenges & Hazards */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                Key Critical Engineering & Environmental Challenges
              </h4>
              <ul className="space-y-2">
                {explanation.engineering_challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-space-900/40 p-2.5 rounded-lg border border-space-800/80">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Educational Takeaways */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Key Takeaways for Judges & Mission Planners
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {explanation.educational_takeaways.map((t, i) => (
                  <div key={i} className="p-3 rounded-xl bg-space-900/60 border border-space-800 text-xs text-slate-200 font-mono">
                    <span className="text-cyan-400 font-bold mr-1">#{i + 1}</span> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

