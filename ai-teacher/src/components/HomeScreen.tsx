import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Play, 
  ArrowRight, 
  BrainCircuit, 
  Layers, 
  Tv, 
  RefreshCw, 
  Award,
  Zap,
  CheckCircle2,
  FileText,
  Clock,
  ShieldCheck,
  Video,
  Lightbulb,
  TrendingUp,
  Activity,
  History,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onStartLearning: (mode: 'topic' | 'upload') => void;
  onNavigate?: (screen: ScreenType) => void;
  onSelectTopic?: (topic: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartLearning,
  onNavigate = (_screen: ScreenType) => {},
  onSelectTopic = (_topic: string) => {},
}) => {
  const steps = [
    {
      num: "01",
      title: "Understand",
      subtitle: "Material & RAG Grounding",
      desc: "Upload documents or enter goals. AI indexes chapters, extracts core concepts, and grounds every fact.",
      icon: BrainCircuit,
    },
    {
      num: "02",
      title: "Plan",
      subtitle: "Personalized Micro-Lesson",
      desc: "Tailors pacing, depth, style (visual, step-by-step, socratic), and language (7 Indian & global languages).",
      icon: Layers,
    },
    {
      num: "03",
      title: "Teach",
      subtitle: "Multimodal Video & Visuals",
      desc: "AI educator speaks with natural pacing, interactive physical simulations, and live whiteboard derivations.",
      icon: Tv,
    },
    {
      num: "04",
      title: "Adapt",
      subtitle: "Misconception Diagnosis",
      desc: "Checks comprehension. If you stumble, it diagnoses the misconception and dynamically re-explains with new analogies.",
      icon: RefreshCw,
    },
    {
      num: "05",
      title: "Remember",
      subtitle: "Long-Term Memory Graph",
      desc: "Retains what you mastered vs. struggled with, updating your cognitive profile and future lesson plans.",
      icon: Award,
    },
  ];

  const continueCourses = [
    {
      id: "ohms-law",
      title: "Ohm's Law",
      subject: "Physics — Class 10",
      progress: 82,
      lastStep: "Resistance & Hydraulic Analogy",
      duration: "10 min lesson",
      badge: "In Progress",
      isPrimaryDemo: true,
      weakArea: "Resistance Calculations",
    },
    {
      id: "python-fundamentals",
      title: "Python Fundamentals",
      subject: "Computer Science",
      progress: 91,
      lastStep: "List Comprehensions & Lambda",
      duration: "15 min lesson",
      badge: "Mastered",
      isPrimaryDemo: false,
      weakArea: "None",
    },
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      subject: "Machine Learning",
      progress: 76,
      lastStep: "Self-Attention & Transformers",
      duration: "20 min lesson",
      badge: "Active",
      isPrimaryDemo: false,
      weakArea: "Attention Matrix Math",
    },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 sm:pt-6 pb-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7F1] border border-[#A8DCC5]/70 text-xs font-semibold text-[#2E7D5B] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#3D8C68] animate-pulse" />
            <span>AI Teacher Ready</span>
            <span className="text-[#A8DCC5]">•</span>
            <span className="text-[#25312D] font-normal">Personalized & Adaptive Teaching</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#25312D] leading-tight">
            Your AI Teacher, <br className="hidden sm:block" />
            <span className="text-[#3D8C68]">Built Around You</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#687570] leading-relaxed">
            Learn from any topic or document with personalized explanations, visual teaching, interactive questions and adaptive guidance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-start-learning-btn"
              onClick={() => onStartLearning('topic')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#3D8C68] text-white font-semibold text-xs sm:text-sm hover:bg-[#2E7D5B] shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white group-hover:scale-110 transition-transform" />
              <span>Start Learning</span>
            </button>

            <button
              id="hero-upload-material-btn"
              onClick={() => onStartLearning('upload')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white hover:bg-[#F8FBFA] text-[#25312D] font-semibold text-xs sm:text-sm border border-[#E2EAE6] hover:border-[#A8DCC5] shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Upload Material</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto text-left">
            <div className="bg-white p-3 rounded-xl border border-[#E2EAE6]">
              <div className="flex items-center gap-1.5 text-xs text-[#687570]">
                <Video className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>Format</span>
              </div>
              <p className="font-semibold text-xs text-[#25312D] mt-0.5">Interactive Video & Visuals</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E2EAE6]">
              <div className="flex items-center gap-1.5 text-xs text-[#687570]">
                <RefreshCw className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>Pedagogy</span>
              </div>
              <p className="font-semibold text-xs text-[#25312D] mt-0.5">Adaptive Misconception Fix</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E2EAE6]">
              <div className="flex items-center gap-1.5 text-xs text-[#687570]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#467FB2]" />
                <span>Accuracy</span>
              </div>
              <p className="font-semibold text-xs text-[#25312D] mt-0.5">RAG Grounded Citations</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E2EAE6]">
              <div className="flex items-center gap-1.5 text-xs text-[#687570]">
                <Zap className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>Languages</span>
              </div>
              <p className="font-semibold text-xs text-[#25312D] mt-0.5">7 Indian & Global</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Row: Today's Learning Insight + AI Learning Readiness */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Learning Insight (2 cols) */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-[#E2EAE6] flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#25312D]">Today's Learning Insight</h3>
                <span className="text-[11px] text-[#687570]">Generated from your recent checkpoint responses</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF3FB] text-[#467FB2] border border-[#A9CDE8]">
              Targeted Action
            </span>
          </div>

          <div className="p-3 bg-[#F8FBFA] rounded-lg border border-[#E2EAE6] text-xs text-[#25312D] leading-relaxed">
            "You performed well in <strong className="text-[#2E7D5B]">Current and Voltage</strong>, but your answers show some uncertainty around <strong className="text-[#B25E46]">Resistance</strong>."
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-[#687570]">
              <strong className="text-[#25312D]">Recommended: </strong> Practice 2 problems on resistance before continuing.
            </div>
            <button
              onClick={() => onNavigate('classroom')}
              className="px-3.5 py-1.5 rounded-lg bg-[#EAF7F1] text-[#2E7D5B] hover:bg-[#A8DCC5]/40 border border-[#A8DCC5] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Start 5-Minute Revision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Learning Readiness (1 col) */}
        <div className="bg-white p-5 rounded-xl border border-[#E2EAE6] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EAF3FB] border border-[#A9CDE8] flex items-center justify-center text-[#467FB2]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#25312D]">Learning Readiness</h3>
                <span className="text-[11px] text-[#687570]">AI cognitive index</span>
              </div>
            </div>
            <span className="text-base font-bold text-[#3D8C68]">82%</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-[#EAF7F1] rounded-full overflow-hidden border border-[#E2EAE6]">
              <div className="h-full bg-[#3D8C68] rounded-full" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#687570]">
              <span>Foundational</span>
              <span className="text-[#3D8C68] font-medium">Ready for Next Topic</span>
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
            <div className="p-1.5 rounded bg-[#F8FBFA] border border-[#E2EAE6] text-[#2E7D5B] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Strong: Voltage</span>
            </div>
            <div className="p-1.5 rounded bg-[#F8FBFA] border border-[#E2EAE6] text-[#B25E46] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Review: Resistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#25312D]">
              Continue Learning
            </h2>
            <p className="text-xs text-[#687570]">
              Pick up right where your AI teacher left off
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold text-[#3D8C68] hover:text-[#2E7D5B] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {continueCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectTopic(course.title)}
              className={`bg-white p-4.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-full ${
                course.isPrimaryDemo
                  ? 'border-[#A8DCC5] shadow-xs ring-1 ring-[#3D8C68]/20'
                  : 'border-[#E2EAE6] hover:border-[#A8DCC5] hover:shadow-xs'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#687570] bg-[#F8FBFA] px-2 py-0.5 rounded border border-[#E2EAE6]">
                    {course.subject}
                  </span>
                  {course.isPrimaryDemo && (
                    <span className="text-[11px] font-semibold text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded-full border border-[#A8DCC5]/60 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#3D8C68]" />
                      Primary Demo
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-[#25312D] text-sm sm:text-base group-hover:text-[#3D8C68] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#687570] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#687570]">Progress</span>
                    <span className="font-semibold text-[#25312D]">{course.progress}% Mastery</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EAF7F1] rounded-full overflow-hidden border border-[#E2EAE6]">
                    <div 
                      className="h-full bg-[#3D8C68] rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#F8FBFA] p-2 rounded-lg border border-[#E2EAE6] text-xs text-[#687570]">
                  <span className="font-medium text-[#25312D]">Last Concept: </span>
                  {course.lastStep}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs font-semibold text-[#3D8C68] group-hover:text-[#2E7D5B] border-t border-[#E2EAE6] mt-3">
                <span>Resume Lesson</span>
                <div className="w-6 h-6 rounded-full bg-[#EAF7F1] flex items-center justify-center group-hover:bg-[#3D8C68] group-hover:text-white transition-all">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Teacher Memory Banner */}
      <section className="bg-white p-4.5 rounded-xl border border-[#E2EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68] shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#25312D]">Your Teacher Remembers</h4>
            <p className="text-xs text-[#687570] mt-0.5">
              "You previously struggled with resistance inverse scaling. This upcoming lesson includes an extra hydraulic worked example."
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="text-xs font-semibold text-[#3D8C68] hover:text-[#2E7D5B] whitespace-nowrap cursor-pointer flex items-center gap-1"
        >
          <span>View Memory Profile</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </section>

      {/* Pedagogical Loop Section */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#25312D]">
            How Your AI Teacher Works
          </h2>
          <p className="text-xs text-[#687570] max-w-xl mx-auto">
            A complete human-like teaching loop designed to eliminate misconceptions, verify mastery, and remember how you learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white p-4 rounded-xl border border-[#E2EAE6] hover:border-[#A8DCC5] hover:shadow-xs transition-all space-y-2 flex flex-col justify-between relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-custom text-[11px] font-bold text-[#2E7D5B] px-1.5 py-0.5 rounded bg-[#EAF7F1] border border-[#A8DCC5]/60">
                    {step.num}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#F8FBFA] border border-[#E2EAE6] flex items-center justify-center text-[#3D8C68] group-hover:bg-[#EAF7F1] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-bold text-[#25312D] text-sm">
                    {step.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#3D8C68]">
                    {step.subtitle}
                  </p>
                  <p className="text-[11px] text-[#687570] leading-relaxed pt-1">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#A8DCC5]">
                    <ArrowRight className="w-3.5 h-3.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* System Architecture Callout */}
      <section className="bg-[#EAF7F1] p-5 rounded-xl border border-[#A8DCC5]/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-[#2E7D5B] border border-[#A8DCC5]">
              AI Architecture
            </span>
            <h3 className="font-bold text-sm text-[#25312D]">
              Explore the Multi-Stage AI Teacher Architecture
            </h3>
          </div>
          <p className="text-xs text-[#687570] leading-relaxed">
            See how the Teacher Agent coordinates RAG grounding, real-time voice, dynamic simulations, Socratic questioning, and misconception analysis.
          </p>
        </div>

        <button
          onClick={() => onNavigate('architecture')}
          className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8FBFA] text-[#25312D] font-semibold text-xs border border-[#A8DCC5] shadow-2xs hover:shadow-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        >
          <span>View AI Architecture</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#3D8C68]" />
        </button>
      </section>
    </div>
  );
};
