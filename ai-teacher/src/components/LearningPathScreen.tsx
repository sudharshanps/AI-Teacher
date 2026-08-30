import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Play
} from 'lucide-react';
import { ScreenType } from '../types';

interface LearningPathScreenProps {
  onStartTopic: (topic: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  onStartTopic,
}) => {
  const [activeTrack, setActiveTrack] = useState<'physics' | 'ml'>('physics');

  const physicsTrack = [
    {
      step: "01",
      title: "Electric Charge & Potential",
      status: "completed" as const,
      mastery: 95,
      desc: "Fundamental electric forces, Coulomb's Law, and potential energy.",
    },
    {
      step: "02",
      title: "Ohm's Law & Circuit Resistance",
      status: "completed" as const,
      mastery: 82,
      desc: "Voltage, current, hydraulic analogy, and V = I × R formula derivations.",
    },
    {
      step: "03",
      title: "Series & Parallel Circuits",
      status: "active" as const,
      mastery: 40,
      desc: "Equivalent resistance calculations, voltage dividers, and current branching.",
    },
    {
      step: "04",
      title: "Kirchhoff's Current & Voltage Laws",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Nodal analysis and mesh loop equations for multi-loop networks.",
    },
    {
      step: "05",
      title: "Capacitors & Energy Storage",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Electric field dielectric storage, RC time constants, and charge curves.",
    },
    {
      step: "06",
      title: "Electromagnetic Induction & Faraday's Law",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Magnetic flux, Lenz's Law, transformers, and AC generation.",
    },
    {
      step: "07",
      title: "Semiconductor Physics & Diodes",
      status: "upcoming" as const,
      mastery: 0,
      desc: "P-N junctions, transistor amplification, and modern logic gates.",
    },
    {
      step: "08",
      title: "Advanced Quantum Electronics",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Photoelectric effect, electron band gaps, and quantum tunnelling.",
    },
  ];

  const mlTrack = [
    {
      step: "01",
      title: "Python Fundamentals & Vectorization",
      status: "completed" as const,
      mastery: 91,
      desc: "NumPy arrays, list comprehensions, and matrix broadcasting.",
    },
    {
      step: "02",
      title: "Mathematics for Machine Learning",
      status: "completed" as const,
      mastery: 88,
      desc: "Linear algebra, matrix eigenvalues, multivariate calculus gradients.",
    },
    {
      step: "03",
      title: "Data Processing & Feature Engineering",
      status: "active" as const,
      mastery: 55,
      desc: "Scaling, categorical encoding, dimensionality reduction (PCA).",
    },
    {
      step: "04",
      title: "Supervised Learning Algorithms",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Linear regression, logistic classifiers, decision trees, SVMs.",
    },
    {
      step: "05",
      title: "Unsupervised Learning & Clustering",
      status: "upcoming" as const,
      mastery: 0,
      desc: "K-Means, Gaussian Mixture Models, and t-SNE latent embeddings.",
    },
    {
      step: "06",
      title: "Model Evaluation & Loss Optimization",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Cross-validation, ROC-AUC, precision-recall, Adam optimizers.",
    },
    {
      step: "07",
      title: "Neural Networks & Backpropagation",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Multi-layer perceptrons, activation functions, chain rule gradients.",
    },
    {
      step: "08",
      title: "Advanced Machine Learning & Transformers",
      status: "upcoming" as const,
      mastery: 0,
      desc: "Self-Attention, Transformer architecture, LLM fine-tuning.",
    },
  ];

  const currentPath = activeTrack === 'physics' ? physicsTrack : mlTrack;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#A8DCC5]">
            Curriculum Progression
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D] mt-1">
            Your AI Learning Path
          </h1>
          <p className="text-xs sm:text-sm text-[#687570]">
            Adaptive, step-by-step masteries calibrated to your performance history.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2EAE6]">
          <button
            onClick={() => setActiveTrack('physics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === 'physics'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5] shadow-2xs font-bold'
                : 'text-[#687570] hover:text-[#25312D]'
            }`}
          >
            Physics & Circuits Track
          </button>
          <button
            onClick={() => setActiveTrack('ml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTrack === 'ml'
                ? 'bg-[#EAF3FB] text-[#467FB2] border border-[#A9CDE8] shadow-2xs font-bold'
                : 'text-[#687570] hover:text-[#25312D]'
            }`}
          >
            Machine Learning Track
          </button>
        </div>
      </div>

      {/* AI Precision Recommendation Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#A8DCC5] flex items-start gap-3 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#3D8C68]" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#25312D]">
            AI Dynamic Path Recommendation
          </p>
          <p className="text-xs text-[#687570] leading-relaxed">
            {activeTrack === 'physics' ? (
              <span>
                "Based on your recent performance in Ohm's Law, strengthen <strong>Series & Parallel Circuits</strong> before moving to <strong>Kirchhoff's Laws</strong>."
              </span>
            ) : (
              <span>
                "Based on your recent performance, strengthen <strong>Data Processing</strong> before moving to <strong>Supervised Learning</strong>."
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Structured Path Vertical Stepper */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-4">
        <div className="space-y-2.5 relative before:absolute before:left-4.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E2EAE6]">
          {currentPath.map((item) => {
            const isCompleted = item.status === 'completed';
            const isActive = item.status === 'active';
            const isUpcoming = item.status === 'upcoming';

            return (
              <div
                key={item.step}
                className={`relative pl-12 pr-4 py-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#EAF7F1] border-[#3D8C68] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                    : isCompleted
                    ? 'bg-[#F8FBFA] border-[#E2EAE6]'
                    : 'bg-[#F8FBFA]/50 border-[#E2EAE6]/50 opacity-75'
                }`}
              >
                {/* Node Icon on left line */}
                <div className={`absolute left-2 top-4 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-2xs ${
                  isCompleted
                    ? 'bg-[#3D8C68] text-white'
                    : isActive
                    ? 'bg-[#3D8C68] text-white ring-3 ring-[#A8DCC5]'
                    : 'bg-white border border-[#E2EAE6] text-[#687570]'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : item.step}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono-custom text-[#2E7D5B]">
                      Stage {item.step}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#25312D]">
                      {item.title}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white text-[#2E7D5B] border border-[#A8DCC5]">
                        Current Focus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#687570] max-w-xl">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isCompleted && (
                    <span className="text-[11px] font-mono-custom font-bold text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
                      {item.mastery}% Mastery
                    </span>
                  )}
                  {isActive && (
                    <button
                      onClick={() => onStartTopic(item.title)}
                      className="px-3 py-1.5 rounded-lg bg-[#3D8C68] hover:bg-[#2E7D5B] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current text-white" />
                      <span>Start Lesson</span>
                    </button>
                  )}
                  {isUpcoming && (
                    <div className="flex items-center gap-1 text-[11px] text-[#687570] bg-white px-2 py-0.5 rounded border border-[#E2EAE6]">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

