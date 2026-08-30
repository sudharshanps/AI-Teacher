import React from 'react';
import { 
  Play, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { GroundingCitation, LessonStep, PersonalizationSettings } from '../types';

interface LessonPlannerScreenProps {
  settings: PersonalizationSettings;
  steps: LessonStep[];
  citations: GroundingCitation[];
  onStartLesson: () => void;
}

export const LessonPlannerScreen: React.FC<LessonPlannerScreenProps> = ({
  settings,
  steps,
  citations,
  onStartLesson,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-2">
      {/* Top Banner */}
      <div className="text-center space-y-1.5">
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
          Step 3 of 4 • Structured Lesson Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
          Your Personalized Lesson Is Ready
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-xl mx-auto">
          Your AI Teacher has mapped out a 7-stage learning journey with real-time checkpoints, visual demonstrations, and adaptive misconception remediation.
        </p>
      </div>

      {/* Lesson Metadata Badges */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5B]">
              Topic
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#25312D]">
              {settings.topic}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 rounded-lg font-semibold bg-[#F8FBFA] text-[#25312D] border border-[#E2EAE6]">
            Level: <strong className="text-[#2E7D5B]">{settings.learningLevel}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg font-semibold bg-[#F8FBFA] text-[#25312D] border border-[#E2EAE6]">
            Duration: <strong className="text-[#2E7D5B]">{settings.availableTime}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg font-semibold bg-[#F8FBFA] text-[#25312D] border border-[#E2EAE6]">
            Language: <strong className="text-[#2E7D5B]">{settings.teachingLanguage}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
            Style: <strong className="text-[#25312D]">{settings.teachingStyle}</strong>
          </span>
        </div>
      </div>

      {/* Structured Lesson Timeline */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
              Pedagogical Timeline
            </h3>
            <p className="text-xs text-[#687570]">
              Dynamic learning stages orchestrated by the Teacher Agent
            </p>
          </div>
          <span className="text-xs font-mono-custom font-semibold text-[#2E7D5B] bg-[#EAF7F1] px-2.5 py-0.5 rounded-md border border-[#A8DCC5]">
            7 Structured Stages
          </span>
        </div>

        <div className="space-y-2.5 relative before:absolute before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E2EAE6]">
          {steps.map((step) => {
            const isCheckpoint = step.type === 'checkpoint';
            const isAdaptive = step.type === 'adaptive';

            return (
              <div 
                key={step.id}
                className={`relative pl-11 pr-3.5 py-3 rounded-xl border transition-all flex items-center justify-between ${
                  isAdaptive 
                    ? 'bg-[#EAF7F1] border-[#3D8C68] ring-1 ring-[#3D8C68]/30 shadow-2xs' 
                    : isCheckpoint
                    ? 'bg-[#EAF3FB] border-[#A9CDE8]'
                    : 'bg-[#F8FBFA] border-[#E2EAE6]'
                }`}
              >
                {/* Node icon */}
                <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-2xs ${
                  isAdaptive 
                    ? 'bg-[#3D8C68] text-white' 
                    : isCheckpoint 
                    ? 'bg-[#EAF3FB] text-[#467FB2] border border-[#A9CDE8]' 
                    : 'bg-white text-[#687570] border border-[#E2EAE6]'
                }`}>
                  {step.id}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#25312D]">
                      {step.title}
                    </span>
                    {isAdaptive && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-[#2E7D5B] border border-[#A8DCC5] flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        Adaptive Re-teaching
                      </span>
                    )}
                    {isCheckpoint && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-[#467FB2] border border-[#A9CDE8]">
                        Interactive Checkpoint
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#687570]">
                    {step.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono-custom text-[#687570] bg-white px-2 py-0.5 rounded border border-[#E2EAE6]">
                    {step.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RAG Knowledge Grounding Box */}
      <div className="bg-white p-5 rounded-2xl border border-[#A8DCC5] shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] border border-[#A8DCC5]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
                Curriculum Grounding
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
                Knowledge Grounded In Verified Textbook
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#2E7D5B] font-semibold bg-[#EAF7F1] px-2.5 py-1 rounded-full border border-[#A8DCC5]">
            <Sparkles className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>Cosine Similarity: 0.96+</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {citations.map((cite, idx) => (
            <div 
              key={idx}
              className="bg-[#F8FBFA] p-3 rounded-xl border border-[#E2EAE6] space-y-1 text-xs"
            >
              <div className="flex items-center justify-between text-[#2E7D5B] font-bold text-[11px]">
                <span>{cite.sourceFile}</span>
                <span className="font-mono-custom text-[#687570]">Page {cite.page}</span>
              </div>
              <p className="font-semibold text-[#25312D]">
                {cite.chapter} • {cite.section}
              </p>
              <p className="text-[11px] text-[#687570] italic bg-white p-2 rounded-lg border border-[#E2EAE6]">
                "{cite.snippet}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center pt-2">
        <button
          id="start-ai-lesson-btn"
          onClick={onStartLesson}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#3D8C68] hover:bg-[#2E7D5B] text-white font-bold text-sm shadow-sm transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer group"
        >
          <Play className="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" />
          <span>Start AI Lesson</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

