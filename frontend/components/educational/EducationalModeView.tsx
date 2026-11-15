"use client";

import React, { useState } from "react";
import { CandidateSite } from "@/lib/types";
import { 
  BookOpen, 
  Sun, 
  Droplets, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  ArrowRight 
} from "lucide-react";

interface EducationalModeViewProps {
  currentPlanet: "Moon" | "Mars";
  sites: CandidateSite[];
  onSelectSite: (site: CandidateSite) => void;
  onOpenSimulator: (siteId: string) => void;
}

export const EducationalModeView: React.FC<EducationalModeViewProps> = ({
  currentPlanet,
  sites,
  onSelectSite,
  onOpenSimulator,
}) => {
  const isMoon = currentPlanet === "Moon";
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const lessons = [
    {title: "Power: sunlight and storage", icon: Sun, color: "text-amber-400", content: <p>{isMoon ? "Lunar illumination varies with location and time. Polar terrain can offer useful lighting opportunities, but continuous power must be checked for a particular site and mission period." : "Mars has a day-night cycle and dust can reduce sunlight reaching solar panels. A daily energy total alone cannot prove that batteries last through every dark interval."} The simulator lets you explore assumptions, not predict an actual mission.</p>},
    {title: "Water: evidence is not extraction", icon: Droplets, color: "text-cyan-400", content: <p>{isMoon ? "Shadowed polar environments are investigated for ice. Evidence for ice does not establish how much a particular mining system can recover." : "NASA maps identify regions such as Arcadia for buried-ice investigation. Jezero's ancient lake and delta record past water, not a verified modern drinking-water supply."} Extraction yield is an explicit scenario assumption here.</p>},
    {title: "Shelter: an open research question", icon: ShieldCheck, color: "text-purple-400", content: <p>Pits and possible lava tubes motivate exploration of sheltered environments. A visible opening does not establish a safe roof, a known cave volume or a fixed radiation reduction. The app's shielding inputs are illustrative; source links describe what observations actually support.</p>},
    {title: "Earth analogs: practise specific tasks", icon: Compass, color: "text-emerald-400", content: <p>NASA and ESA document field research at locations including Devon Island, Atacama, Svalbard and Lanzarote. A site can help test a particular instrument or operation while differing greatly in gravity, atmosphere and biology. Read the evidence links before interpreting the shortlist index.</p>},
  ];

  const quiz = [
    {
      question: "What makes lunar polar regions interesting for exploration?",
      options: [
        "It is closer to Earth and easier to see with binoculars",
        "Some areas offer useful illumination near shadowed environments investigated for ice",
        "It has a denser atmosphere than the rest of the Moon",
        "It experiences warmer temperatures all year round",
      ],
      correct: 1,
    },
    {
      question: "Why investigate pits and possible lava tubes?",
      options: [
        "They have flowing rivers of liquid water",
        "They may offer shelter, but access, structure and radiation conditions require investigation",
        "They already have breathable air trapped inside",
        "They are made of pure gold and titanium",
      ],
      correct: 1,
    },
    {
      question: "What is In-Situ Resource Utilization (ISRU)?",
      options: [
        "Bringing 100% of supplies from Earth in cargo rockets",
        "Mining and using local planetary materials (like ice and regolith) to make water, oxygen, and fuel",
        "Teleporting resources through deep space quantum links",
        "Abandoning bases after 3 days of scientific exploration",
      ],
      correct: 1,
    },
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
    setQuizScore(null);
  };

  const handleCheckQuiz = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
  };

  return (
    <div className="w-full space-y-8">
      {/* Educational Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl cyber-card border border-emerald-500/30 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Educational Exploration Mode · Designed for Judges & Learners
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Explore {currentPlanet}: evidence, assumptions and Earth analogs
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Discover the physics, geology, and survival engineering behind establishing humanity&apos;s first permanent
            extraterrestrial outposts—and see how Earth&apos;s extreme deserts prepare us for the journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenSimulator(sites[0]?.id || "luna-shackleton-rim")}
            className="px-5 py-3 rounded-xl font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-space-950 flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
          >
            <Sparkles className="w-4 h-4" />
            Try the Mission Simulator
          </button>
        </div>
      </div>

      {/* Interactive Core Concepts Carousel / Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Lesson Navigation */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1 mb-2">
            The 4 Survival Foundations
          </div>
          {lessons.map((lesson, idx) => {
            const Icon = lesson.icon;
            const isSelected = activeLesson === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveLesson(idx)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-space-850 border-emerald-400 text-white shadow-md shadow-emerald-950/30"
                    : "bg-space-900/60 border-space-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-space-950 ${lesson.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">{lesson.title.split(":")[0]}</span>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-transparent"}`} />
              </button>
            );
          })}
        </div>

        {/* Lesson Display Panel */}
        <div className="md:col-span-8 p-6 rounded-2xl cyber-card border border-space-700/80 bg-space-900/80 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-space-700">
            {React.createElement(lessons[activeLesson].icon, {
              className: `w-5 h-5 ${lessons[activeLesson].color}`,
            })}
            <h3 className="text-base font-bold text-white">{lessons[activeLesson].title}</h3>
          </div>

          <div className="text-sm leading-relaxed text-slate-200">
            {lessons[activeLesson].content}
          </div>
        </div>
      </div>

      {/* Interactive Knowledge Check Quiz */}
      <div className="p-6 sm:p-8 rounded-3xl cyber-card border border-cyan-500/30 bg-space-900/70 space-y-6">
        <div className="flex items-center justify-between border-b border-space-700 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Interactive Hackathon Knowledge Challenge
            </div>
            <h3 className="text-lg font-bold text-white">Judge & Student Mission Readiness Quiz</h3>
          </div>

          {quizScore !== null && (
            <div className="bg-cyan-950 border border-cyan-800 px-4 py-2 rounded-xl text-center">
              <span className="text-base font-mono font-bold text-cyan-300">
                Score: {quizScore} / {quiz.length}
              </span>
              <span className="text-[10px] block uppercase font-mono text-cyan-400">
                {quizScore === quiz.length ? "Concepts reviewed ✓" : "Review Lessons!"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {quiz.map((q, qIdx) => (
            <div key={qIdx} className="p-4 rounded-xl bg-space-950/70 border border-space-800 space-y-2">
              <p className="text-xs font-bold text-slate-200 font-mono">
                {qIdx + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isChosen = selectedAnswers[qIdx] === optIdx;
                  const isCorrect = quizScore !== null && optIdx === q.correct;
                  const isWrong = quizScore !== null && isChosen && optIdx !== q.correct;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-2.5 rounded-lg text-xs font-mono transition-all border ${
                        isCorrect
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold"
                          : isWrong
                          ? "bg-rose-950/80 border-rose-500 text-rose-200"
                          : isChosen
                          ? "bg-cyan-950/80 border-cyan-500 text-cyan-200"
                          : "bg-space-900 border-space-800 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCheckQuiz}
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-space-950 flex items-center gap-2 transition-all shadow-md shadow-cyan-950/40"
          >
            <CheckCircle className="w-4 h-4" />
            Check My Answers
          </button>
        </div>
      </div>
    </div>
  );
};

