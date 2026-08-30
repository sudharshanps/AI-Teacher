import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  BookOpen, 
  Compass, 
  Sparkles,
  Download
} from 'lucide-react';

interface LearningReportScreenProps {
  scorePercentage: number;
  strongAreas: string[];
  weakAreas: string[];
  misconceptions: string[];
  onReviewWeakArea: () => void;
  onContinueLearning: () => void;
  onViewLearningPath: () => void;
}

export const LearningReportScreen: React.FC<LearningReportScreenProps> = ({
  scorePercentage = 82,
  strongAreas = ["Voltage Potential", "Electric Current Flow", "Basic Formula (V=IR)"],
  weakAreas = ["Resistance Inverse Scaling", "Applying Ohm's Law in Complex Circuits"],
  onReviewWeakArea,
  onContinueLearning,
  onViewLearningPath,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-2">
      {/* Report Header */}
      <div className="text-center space-y-1.5">
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
          Personalized Learning Summary
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
          Your Learning Report
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-xl mx-auto">
          Topic: <strong className="text-[#25312D]">Ohm's Law & Circuit Analysis</strong> • Grounded in Physics_Class_10.pdf
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {/* Big Circular Score Display */}
          <div className="w-20 h-20 rounded-full bg-[#EAF7F1] border-2 border-[#3D8C68] flex flex-col items-center justify-center shadow-2xs shrink-0">
            <span className="text-2xl font-bold font-mono-custom text-[#25312D]">
              {scorePercentage}%
            </span>
            <span className="text-[10px] font-bold text-[#2E7D5B]">Mastery</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
              Overall Assessment
            </span>
            <h2 className="text-lg font-bold text-[#25312D]">
              Good Progress!
            </h2>
            <p className="text-xs text-[#687570] max-w-md">
              You showed strong grasp of voltage potential and basic formula derivation, with the initial resistance misconception successfully remediated.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-lg bg-[#F8FBFA] hover:bg-[#EAF7F1] border border-[#E2EAE6] text-[#687570] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Concept Mastery Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5B]">
                Verified Competence
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
                Strong Areas
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {strongAreas.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#EAF7F1]/50 border border-[#A8DCC5]/80 flex items-center gap-2 text-xs text-[#25312D] font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D8C68] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FB] border border-[#A9CDE8] flex items-center justify-center text-[#467FB2]">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#467FB2]">
                Growth Opportunities
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
                Needs Improvement
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {weakAreas.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#EAF3FB]/50 border border-[#A9CDE8]/80 flex items-center gap-2 text-xs text-[#25312D] font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 text-[#467FB2] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Misconception Diagnostic & Recommended Revision Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#A8DCC5] shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3D8C68]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#25312D]">
              AI Teacher Diagnostic & Revision Plan
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-[#EAF7F1] text-[#2E7D5B] px-2 py-0.5 rounded border border-[#A8DCC5]">
            Adaptive Memory Updated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6] space-y-1">
            <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
              Diagnosed Misconception:
            </span>
            <p className="font-bold text-[#25312D]">
              "Relationship between resistance and current"
            </p>
            <p className="text-[#687570] text-[11px] leading-relaxed">
              Initially perceived resistance as increasing electron speed. Resolved through the hydraulic water-pipe model.
            </p>
          </div>

          <div className="bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6] space-y-1">
            <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
              Recommended Revision:
            </span>
            <p className="font-bold text-[#25312D]">
              "Review Ohm's Law and complete two additional practice problems."
            </p>
            <p className="text-[#687570] text-[11px] leading-relaxed">
              Targeted 3-minute mini review ready on internal resistance and series circuits.
            </p>
          </div>
        </div>

        {/* Next Recommended Topic */}
        <div className="bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6] flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
              Next Recommended Topic
            </span>
            <h4 className="text-sm sm:text-base font-bold text-[#25312D]">
              Series & Parallel Circuits
            </h4>
            <p className="text-xs text-[#687570]">
              Chapter 4.4 • Builds directly on current and resistance knowledge
            </p>
          </div>

          <button
            onClick={onContinueLearning}
            className="px-3.5 py-2 rounded-lg bg-[#EAF7F1] hover:bg-[#A8DCC5]/40 border border-[#A8DCC5] text-[#2E7D5B] text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Next Topic</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#3D8C68]" />
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onReviewWeakArea}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-[#F8FBFA] text-[#25312D] font-semibold text-xs border border-[#E2EAE6] hover:border-[#3D8C68] shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#3D8C68]" />
          <span>Review Weak Area</span>
        </button>

        <button
          onClick={onContinueLearning}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#3D8C68] hover:bg-[#2E7D5B] text-white font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-white" />
          <span>Continue Learning</span>
        </button>

        <button
          onClick={onViewLearningPath}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#EAF3FB] hover:bg-[#A9CDE8]/50 border border-[#A9CDE8] text-[#467FB2] font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[#467FB2]" />
          <span>View Learning Path</span>
        </button>
      </div>
    </div>
  );
};

