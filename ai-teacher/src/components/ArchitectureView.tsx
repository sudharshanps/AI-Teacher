import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  Video, 
  Brain
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-2">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
          AI Innovation Hackathon 2026 Round 2
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
          AI Teacher System Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-xl mx-auto">
          Deep architectural breakdown of how AI Teacher delivers multimodal, adaptive, and RAG-grounded human-like education.
        </p>
      </div>

      {/* 1. Core Pedagogical Closed-Loop Pipeline */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#3D8C68]" />
          <h2 className="text-sm sm:text-base font-bold text-[#25312D]">
            1. The 8-Stage Pedagogical Loop (Not a Chatbot)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {[
            { step: "1. UNDERSTAND", desc: "Assesses learner profile, prior mastery, and language context." },
            { step: "2. PLAN", desc: "Generates structured micro-lessons with timeline and RAG citations." },
            { step: "3. EXPLAIN", desc: "Synthesizes human-like video educator with clear conceptual foundations." },
            { step: "4. DEMONSTRATE", desc: "Renders interactive physics simulations and visual analogies." },
            { step: "5. QUESTION", desc: "Injects mid-session multimodal checkpoints (MCQ, text, voice)." },
            { step: "6. EVALUATE", desc: "Diagnoses cognitive misconceptions beyond binary right/wrong." },
            { step: "7. ADAPT", desc: "Dynamic remediation via hydraulic analogies and new checks." },
            { step: "8. CONTINUE", desc: "Updates student memory, mastery graph, and progresses curriculum." },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] space-y-1"
            >
              <p className="font-bold text-[#2E7D5B] text-[11px]">{item.step}</p>
              <p className="text-[11px] text-[#687570] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Three Pillars of the AI Teacher Engine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Multimodal Video & Voice */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#25312D]">
            Multimodal Video Engine
          </h3>
          <p className="text-xs text-[#687570] leading-relaxed">
            Synthesizes lip-synced educator avatar expressions, real-time Web Speech audio, and interactive animated sound waves across 6 languages.
          </p>
        </div>

        {/* RAG Knowledge Retrieval */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3FB] border border-[#A9CDE8] flex items-center justify-center text-[#467FB2]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#25312D]">
            Grounded RAG Pipeline
          </h3>
          <p className="text-xs text-[#687570] leading-relaxed">
            Ingests uploaded textbooks, PDFs, and notes. Performs vector embeddings, cosine semantic matching, and outputs verified textbook citations.
          </p>
        </div>

        {/* Cognitive Adaptive Memory */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#25312D]">
            Long-Term Learner Memory
          </h3>
          <p className="text-xs text-[#687570] leading-relaxed">
            Maintains student mastery graph, logs diagnosed misconceptions, tracks learning velocity, and calibrates difficulty over time.
          </p>
        </div>
      </div>
    </div>
  );
};

