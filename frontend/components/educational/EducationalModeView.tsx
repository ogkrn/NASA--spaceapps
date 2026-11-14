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
    {
      title: "The Golden Rule: Eternal Sunlight vs Deep Cold",
      icon: Sun,
      color: "text-amber-400",
      content: (
        <>
          <p className="mb-3 text-slate-300">
            Unlike Earth with its gentle 24-hour day, the Moon experiences a brutal 14-day night where temperatures plunge
            to -130°C (-200°F). However, at the lunar South Pole, giant peaks like <strong>Malapert Mountain</strong> and crater rims
            stand so tall that the sun barely dips below the horizon!
          </p>
          <div className="p-3.5 rounded-xl bg-space-950/80 border border-amber-900/40 text-xs text-amber-200">
            💡 <strong>Why it matters:</strong> Continuous sunlight means solar panels can generate electricity almost non-stop,
            drastically reducing the hundreds of tons of heavy batteries that astronauts would otherwise need to launch from Earth!
          </div>
        </>
      ),
    },
    {
      title: "Water is Gold: Mining Frozen Ice Traps",
      icon: Droplets,
      color: "text-cyan-400",
      content: (
        <>
          <p className="mb-3 text-slate-300">
            In crater hollows like <strong>Shackleton</strong>, sunlight has not entered for over 2 billion years. These are called
            <strong> Permanently Shadowed Regions (PSRs)</strong>. They act as cosmic cold traps, hoarding billions of tons of water ice
            delivered by ancient comets.
          </p>
          <div className="p-3.5 rounded-xl bg-space-950/80 border border-cyan-900/40 text-xs text-cyan-200">
            💧 <strong>Space Secret:</strong> Water isn&apos;t just for drinking! We can split water ($H_2O$) using solar electricity
            into liquid hydrogen ($H_2$) and liquid oxygen ($O_2$)—the most powerful rocket propellant in human history!
          </div>
        </>
      ),
    },
    {
      title: "The Silent Threat: Cosmic Radiation & Lava Tubes",
      icon: ShieldCheck,
      color: "text-purple-400",
      content: (
        <>
          <p className="mb-3 text-slate-300">
            Earth has a magnetic field and a thick atmosphere that shields us from cosmic rays and solar flares.
            On the Moon and Mars, surface astronauts receive dangerous radiation doses that limit mission durations.
          </p>
          <div className="p-3.5 rounded-xl bg-space-950/80 border border-purple-900/40 text-xs text-purple-200">
            🛡️ <strong>Nature&apos;s Fortress:</strong> Collapsed volcanic lava tubes like <strong>Marius Hills</strong> offer natural
            underground caves over 50 meters tall! By building our habitat inside, astronauts get 99.4% radiation shielding
            and a constant temperature of -20°C without having to dig.
          </div>
        </>
      ),
    },
    {
      title: "Why Earth Analogs are Mission-Critical",
      icon: Compass,
      color: "text-emerald-400",
      content: (
        <>
          <p className="mb-3 text-slate-300">
            Before launching a $10 billion rocket, space agencies test everything on Earth&apos;s most extreme landscapes:
            Devon Island in the Arctic, the hyper-arid Atacama Desert, and the volcanic tubes of Hawaii and Lanzarote.
          </p>
          <div className="p-3.5 rounded-xl bg-space-950/80 border border-emerald-900/40 text-xs text-emerald-200">
            🧪 <strong>Ground Truth:</strong> When rovers drive over abrasive volcanic dust at HI-SEAS, engineers learn how to
            prevent lunar dust from shredding spacesuit seals and clogging rover bearings.
          </div>
        </>
      ),
    },
  ];

  const quiz = [
    {
      question: "Why is the Lunar South Pole preferred over the lunar equator for a permanent base?",
      options: [
        "It is closer to Earth and easier to see with binoculars",
        "It combines near-permanent solar illumination with frozen water ice in shadowed craters",
        "It has a denser atmosphere than the rest of the Moon",
        "It experiences warmer temperatures all year round",
      ],
      correct: 1,
    },
    {
      question: "What makes lava tubes like Marius Hills attractive for human habitats?",
      options: [
        "They have flowing rivers of liquid water",
        "They provide near-total natural protection from deadly cosmic radiation and micrometeorites",
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
            How to Build a Permanent Home on the {currentPlanet}
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
                {quizScore === quiz.length ? "Astronaut Certified! 🚀" : "Review Lessons!"}
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

