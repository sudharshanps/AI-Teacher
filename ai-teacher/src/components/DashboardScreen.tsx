import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  RotateCcw,
  Target
} from 'lucide-react';
import { ScreenType, StudentProfileData } from '../types';

interface DashboardScreenProps {
  profile: StudentProfileData;
  onStartTopic: (topic: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  profile,
  onStartTopic,
  onNavigate,
}) => {
  const topics = [
    {
      title: "Ohm's Law & Electric Circuits",
      subject: "Physics",
      mastery: 82,
      lastPracticed: "Today",
      status: "Mastered",
      tags: ["Circuit Laws", "V=IR"],
    },
    {
      title: "Python Fundamentals & Memory Model",
      subject: "Computer Science",
      mastery: 91,
      lastPracticed: "Yesterday",
      status: "Mastered",
      tags: ["Iterators", "Scopes"],
    },
    {
      title: "Transformer Attention & Query-Key",
      subject: "AI & ML",
      mastery: 76,
      lastPracticed: "3 days ago",
      status: "In Progress",
      tags: ["Deep Learning", "Transformers"],
    },
    {
      title: "Newtonian Mechanics & Force Vectors",
      subject: "Physics",
      mastery: 88,
      lastPracticed: "5 days ago",
      status: "Mastered",
      tags: ["Kinematics", "F=ma"],
    },
  ];

  return (
    <div className="space-y-6 pb-12 pt-2 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]/70 mb-1">
            <BrainCircuit className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>Persistent Student Memory & Knowledge Graph</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
            Learner Dashboard & Memory Profile
          </h1>
          <p className="text-xs text-[#687570]">
            Continuous tracking of your conceptual mastery, retention curves, and customized learning adaptations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('start-learning')}
          className="px-4 py-2 rounded-lg bg-[#3D8C68] hover:bg-[#2E7D5B] text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>New AI Lesson</span>
        </button>
      </div>

      {/* 4 Core Metric KPI Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Overall Progress */}
        <div className="bg-white p-4 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#687570]">
            <span className="text-xs font-medium">Overall Progress</span>
            <div className="w-6 h-6 rounded-md bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] border border-[#A8DCC5]">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono-custom text-[#25312D]">
            {profile.overallProgress}%
          </p>
          <div className="w-full h-1.5 bg-[#F8FBFA] rounded-full overflow-hidden border border-[#E2EAE6] mt-1">
            <div 
              className="h-full bg-[#3D8C68] rounded-full"
              style={{ width: `${profile.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Topics Studied */}
        <div className="bg-white p-4 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#687570]">
            <span className="text-xs font-medium">Topics Studied</span>
            <div className="w-6 h-6 rounded-md bg-[#EAF3FB] flex items-center justify-center text-[#467FB2] border border-[#A9CDE8]">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono-custom text-[#25312D]">
            {profile.topicsStudied}
          </p>
          <p className="text-[11px] text-[#687570]">Across 4 Academic Disciplines</p>
        </div>

        {/* Learning Time */}
        <div className="bg-white p-4 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#687570]">
            <span className="text-xs font-medium">Learning Time</span>
            <div className="w-6 h-6 rounded-md bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] border border-[#A8DCC5]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono-custom text-[#25312D]">
            8h 24m
          </p>
          <p className="text-[11px] text-[#687570]">504 Total Active Minutes</p>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-4 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#687570]">
            <span className="text-xs font-medium">Daily Streak</span>
            <div className="w-6 h-6 rounded-md bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] border border-[#A8DCC5]">
              <Flame className="w-3.5 h-3.5 text-[#3D8C68]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono-custom text-[#2E7D5B]">
            {profile.currentStreakDays} Days
          </p>
          <p className="text-[11px] text-[#3D8C68] font-medium">Daily Target Achieved ✨</p>
        </div>
      </div>

      {/* Spaced Repetition & Retention Banner */}
      <div className="bg-[#EAF3FB] border border-[#A9CDE8] rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#467FB2] border border-[#A9CDE8] shadow-2xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <span>Spaced Repetition Decay Prediction</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-white text-[#467FB2] border border-[#A9CDE8]">Optimal Interval</span>
            </h3>
            <p className="text-[11px] text-[#687570]">
              AI Teacher predicts <strong className="text-[#25312D]">Ohm's Law: Resistors in Series</strong> will experience 15% memory decay in 2 days. Quick 3-minute quiz recommended.
            </p>
          </div>
        </div>
        <button
          onClick={() => onStartTopic("Ohm's Law & Electric Circuits")}
          className="px-3.5 py-1.5 rounded-lg bg-[#467FB2] hover:bg-[#386790] text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Quick Reinforce</span>
        </button>
      </div>

      {/* Strong Concepts & Weak Concepts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strong Concepts */}
        <div className="bg-white p-5 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-[#25312D]">
                Mastered Concepts ({profile.strongConcepts.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono-custom font-semibold text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
              90%+ Retention
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.strongConcepts.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#F8FBFA] border border-[#E2EAE6] flex items-center gap-2 text-xs font-medium text-[#25312D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D8C68] shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Concepts */}
        <div className="bg-white p-5 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FB] border border-[#A9CDE8] flex items-center justify-center text-[#467FB2]">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-[#25312D]">
                Concepts to Reinforce ({profile.weakConcepts.length})
              </h3>
            </div>
            <span className="text-[11px] font-mono-custom font-semibold text-[#467FB2] bg-[#EAF3FB] px-2 py-0.5 rounded border border-[#A9CDE8]">
              Target Practice
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.weakConcepts.map((c, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#F8FBFA] border border-[#E2EAE6] flex items-center justify-between text-xs font-medium text-[#25312D]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#467FB2] shrink-0" />
                  <span>{c}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Topics & Performance History */}
      <div className="bg-white p-5 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#25312D]">
              Recent Topics & Performance History
            </h3>
            <p className="text-xs text-[#687570]">
              Review your mastery scores and resume personalized video lessons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((t, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] hover:border-[#A8DCC5] transition-all flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#687570] bg-white px-2 py-0.5 rounded border border-[#E2EAE6]">
                    {t.subject}
                  </span>
                  <span className="text-xs font-bold text-[#2E7D5B] font-mono-custom">
                    {t.mastery}% Mastery
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
                  {t.title}
                </h4>
                <div className="flex gap-1.5 flex-wrap">
                  {t.tags.map(tg => (
                    <span key={tg} className="text-[9px] text-[#687570] bg-white px-1.5 py-0.5 rounded border border-[#E2EAE6]">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2EAE6]">
                <span className="text-[10px] text-[#687570]">
                  Practiced {t.lastPracticed}
                </span>
                <button
                  onClick={() => onStartTopic(t.title)}
                  className="text-xs font-semibold text-[#3D8C68] hover:text-[#2E7D5B] flex items-center gap-1 cursor-pointer"
                >
                  <span>Resume Lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

