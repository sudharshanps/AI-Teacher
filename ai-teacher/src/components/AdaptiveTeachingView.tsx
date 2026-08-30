import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdaptiveTeachingViewProps {
  onSuccess: (mastery: number) => void;
  onDismiss: () => void;
}

export const AdaptiveTeachingView: React.FC<AdaptiveTeachingViewProps> = ({
  onSuccess,
}) => {
  const [selectedRemediationAnswer, setSelectedRemediationAnswer] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [feedbackError, setFeedbackError] = useState<boolean>(false);

  const newQuestionOptions = ["2A", "3A", "4A", "6A"];
  const correctAnswer = "2A"; // Because I = 12V / 6Ω = 2A

  const handleSubmitRemediation = () => {
    if (selectedRemediationAnswer === correctAnswer) {
      setIsResolved(true);
      setFeedbackError(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3D8C68', '#A8DCC5', '#467FB2', '#A9CDE8'],
        });
      } catch (e) {
        // ignore if canvas-confetti is not loaded
      }

      setTimeout(() => {
        onSuccess(85);
      }, 2200);
    } else {
      setFeedbackError(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[#3D8C68] shadow-sm p-5 sm:p-6 space-y-4 animate-fadeIn">
      {/* 1. Header: Misconception Detected Banner */}
      <div className="bg-[#EAF7F1] border border-[#A8DCC5] p-3.5 rounded-xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68] shrink-0 mt-0.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-[#3D8C68]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Misconception Detected
            </span>
            <span className="text-xs font-semibold text-[#2E7D5B]">
              Direct vs Inverse Proportionality
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
            "Let's look at this another way."
          </h3>
          <p className="text-xs text-[#687570] leading-relaxed">
            Your answer (<em>"Current increases"</em>) indicates that the relationship between resistance and current needs clarification.
          </p>
        </div>
      </div>

      {/* 2. Visual Adaptation Pipeline Stepper */}
      <div className="bg-[#F8FBFA] p-3 rounded-xl border border-[#E2EAE6] flex items-center justify-between overflow-x-auto gap-2 text-xs">
        <div className="flex items-center gap-1 font-bold text-rose-700 shrink-0">
          <span className="w-4.5 h-4.5 rounded-full bg-rose-100 flex items-center justify-center text-[10px]">1</span>
          <span className="text-[11px]">Misconception</span>
        </div>
        <span className="text-[#3D8C68]">→</span>
        <div className="flex items-center gap-1 font-bold text-[#2E7D5B] shrink-0">
          <span className="w-4.5 h-4.5 rounded-full bg-[#EAF7F1] flex items-center justify-center text-[10px]">2</span>
          <span className="text-[11px]">New Explanation</span>
        </div>
        <span className="text-[#3D8C68]">→</span>
        <div className="flex items-center gap-1 font-bold text-[#467FB2] shrink-0">
          <span className="w-4.5 h-4.5 rounded-full bg-[#EAF3FB] flex items-center justify-center text-[10px]">3</span>
          <span className="text-[11px]">Alternative Analogy</span>
        </div>
        <span className="text-[#3D8C68]">→</span>
        <div className="flex items-center gap-1 font-bold text-[#2E7D5B] shrink-0">
          <span className="w-4.5 h-4.5 rounded-full bg-[#EAF7F1] flex items-center justify-center text-[10px]">4</span>
          <span className="text-[11px]">New Example</span>
        </div>
        <span className="text-[#3D8C68]">→</span>
        <div className="flex items-center gap-1 font-bold text-[#25312D] shrink-0">
          <span className="w-4.5 h-4.5 rounded-full bg-[#25312D] text-white flex items-center justify-center text-[10px]">5</span>
          <span className="text-[11px]">Re-evaluation</span>
        </div>
      </div>

      {/* 3. Side-by-Side Mathematical & Conceptual Dissection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Mathematical formulation */}
        <div className="bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6] space-y-1.5">
          <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
            Mathematical Law
          </span>
          <div className="bg-white p-2.5 rounded-lg border border-[#E2EAE6] font-mono-custom text-center space-y-0.5">
            <p className="text-xs text-[#687570]">V = I × R</p>
            <p className="text-base font-bold text-[#25312D] bg-[#EAF7F1] py-1 rounded border border-[#A8DCC5]">
              I = V / R
            </p>
          </div>
          <p className="text-xs text-[#687570]">
            Since Resistance (<strong>R</strong>) is in the <em>denominator</em>, as <strong>R</strong> gets bigger, <strong>I</strong> must get smaller.
          </p>
        </div>

        {/* The Water Pipe Analogy */}
        <div className="bg-[#EAF3FB] p-3.5 rounded-xl border border-[#A9CDE8] space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-[#467FB2]" />
            <span className="text-[10px] font-bold text-[#467FB2] uppercase tracking-wider">
              Alternative Water Pipe Analogy
            </span>
          </div>
          <p className="text-xs text-[#25312D] leading-relaxed">
            If the water pressure (Voltage) stays the same, but the pipe becomes narrower (Resistance), <strong>less water flows through each second</strong>.
          </p>
          <div className="p-2 rounded-lg bg-white border border-[#A9CDE8] text-xs font-semibold text-[#467FB2]">
            Therefore: If voltage stays constant and resistance increases, current decreases.
          </div>
        </div>
      </div>

      {/* Teacher Adaptation Badge */}
      <div className="p-2.5 bg-[#EAF7F1] rounded-lg border border-[#A8DCC5] flex items-center justify-between text-xs">
        <span className="font-semibold text-[#2E7D5B] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#3D8C68]" />
          Your teacher adapted the explanation based on your answer.
        </span>
        <span className="text-[10px] font-bold bg-white text-[#2E7D5B] px-2 py-0.5 rounded border border-[#A8DCC5]">
          Targeted Remediation
        </span>
      </div>

      {/* 4. NEW Question (Re-evaluation Checkpoint) */}
      {!isResolved ? (
        <div className="bg-white p-4 rounded-xl border border-[#E2EAE6] space-y-3.5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
              Verify Your New Understanding
            </span>
            <h4 className="text-sm font-bold text-[#25312D]">
              If voltage is 12V and resistance increases from 4Ω to 6Ω, what happens to current?
            </h4>
            <p className="text-xs text-[#687570]">
              Apply formula: I = V / R = 12V / 6Ω
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {newQuestionOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setSelectedRemediationAnswer(opt);
                  setFeedbackError(false);
                }}
                className={`py-2.5 px-3 rounded-lg font-mono-custom text-sm font-bold transition-all border text-center cursor-pointer ${
                  selectedRemediationAnswer === opt
                    ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#25312D] ring-2 ring-[#3D8C68]/30 shadow-2xs'
                    : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#3D8C68] hover:text-[#25312D]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedbackError && (
            <p className="text-xs text-rose-600 font-semibold">
              Not quite. Remember: 12 ÷ 6 = 2. Try selecting 2A.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={handleSubmitRemediation}
              disabled={!selectedRemediationAnswer}
              className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedRemediationAnswer
                  ? 'bg-[#3D8C68] text-white hover:bg-[#2E7D5B] shadow-2xs'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* CORRECT ANSWER & MASTERY UPDATE */
        <div className="p-4 sm:p-5 rounded-xl bg-[#EAF7F1] border-2 border-[#3D8C68] space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3D8C68] text-white flex items-center justify-center shadow-2xs shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#25312D]">
                Excellent! You've understood the relationship.
              </h4>
              <p className="text-xs text-[#2E7D5B]">
                Current dropped from 3A (12V/4Ω) to 2A (12V/6Ω) as resistance increased.
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-[#A8DCC5] flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
                Updated Concept Mastery
              </span>
              <p className="text-xs font-bold text-[#25312D]">
                Resistance & Ohm's Law: <strong className="text-[#3D8C68]">85% Mastery</strong>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D5B] bg-[#EAF7F1] px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Understanding Confirmed</span>
            </div>
          </div>

          <p className="text-[11px] text-[#687570] italic text-center">
            Continuing automatically to the next concept in your personalized lesson...
          </p>
        </div>
      )}
    </div>
  );
};

