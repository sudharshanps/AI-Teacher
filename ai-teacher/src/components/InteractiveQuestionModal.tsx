import React, { useState } from 'react';
import { 
  HelpCircle, 
  Mic, 
  Type, 
  X
} from 'lucide-react';

interface InteractiveQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswer: (answerText: string, isWrongSelected: boolean) => void;
}

export const InteractiveQuestionModal: React.FC<InteractiveQuestionModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'mcq' | 'type' | 'voice'>('mcq');

  if (!isOpen) return null;

  const options = [
    { key: "A", label: "Current increases", isMisconception: true },
    { key: "B", label: "Current decreases", isMisconception: false },
    { key: "C", label: "Current remains the same", isMisconception: true },
    { key: "D", label: "I'm not sure", isMisconception: true },
  ];

  const handleVoiceSimulation = () => {
    setIsVoiceActive(true);
    setTimeout(() => {
      setSelectedOption("A");
      setTypedAnswer("I think current increases because resistance makes more energy...");
      setIsVoiceActive(false);
    }, 1800);
  };

  const handleSubmit = () => {
    const isMisconception = selectedOption === "A" || typedAnswer.toLowerCase().includes("increase");
    const chosenAnswer = selectedOption 
      ? options.find(o => o.key === selectedOption)?.label || selectedOption
      : typedAnswer || "Current increases";

    onSubmitAnswer(chosenAnswer, isMisconception);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E2EAE6] shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5B]">
                Understanding Checkpoint
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
                Let's check your understanding.
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-[#F8FBFA] text-[#687570] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question text */}
        <div className="bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6] space-y-0.5">
          <p className="text-xs sm:text-sm font-bold text-[#25312D]">
            What happens to current if resistance increases while voltage remains constant?
          </p>
          <p className="text-[11px] text-[#687570]">
            Select an option, type your thoughts, or respond with voice.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-1.5 border-b border-[#E2EAE6] pb-2">
          <button
            onClick={() => setInputMode('mcq')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              inputMode === 'mcq'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D]'
            }`}
          >
            Multiple Choice
          </button>

          <button
            onClick={() => setInputMode('type')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              inputMode === 'type'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D]'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>Type Answer</span>
          </button>

          <button
            onClick={() => {
              setInputMode('voice');
              handleVoiceSimulation();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              inputMode === 'voice'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D]'
            }`}
          >
            <Mic className="w-3 h-3 text-[#3D8C68]" />
            <span>Answer With Voice</span>
          </button>
        </div>

        {/* MCQ Option View */}
        {inputMode === 'mcq' && (
          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelectedOption(opt.key)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selectedOption === opt.key
                    ? 'bg-[#EAF7F1] border-[#3D8C68] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                    : 'bg-[#F8FBFA] border-[#E2EAE6] hover:border-[#3D8C68]/60 hover:bg-[#EAF7F1]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E2EAE6] text-xs font-bold text-[#2E7D5B] flex items-center justify-center font-mono-custom">
                    {opt.key}
                  </span>
                  <span className="text-xs font-bold text-[#25312D]">
                    {opt.label}
                  </span>
                </div>
                {opt.key === 'A' && (
                  <span className="text-[10px] text-[#2E7D5B] bg-white px-2 py-0.5 rounded border border-[#A8DCC5]">
                    Click to test adaptive loop
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Type Answer View */}
        {inputMode === 'type' && (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="e.g. As resistance increases, it provides more resistance so the current should drop..."
              className="w-full p-3 text-xs bg-[#F8FBFA] rounded-xl border border-[#E2EAE6] focus:border-[#3D8C68] focus:outline-none"
            />
          </div>
        )}

        {/* Voice Answer View */}
        {inputMode === 'voice' && (
          <div className="p-5 rounded-xl bg-[#EAF7F1]/60 border border-[#A8DCC5] text-center space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-white border border-[#A8DCC5] mx-auto flex items-center justify-center text-[#3D8C68] shadow-2xs">
              {isVoiceActive ? <Mic className="w-5 h-5 animate-pulse text-rose-600" /> : <Mic className="w-5 h-5" />}
            </div>
            <p className="text-xs font-bold text-[#25312D]">
              {isVoiceActive ? "Listening to your speech in real-time..." : "Transcribed Speech:"}
            </p>
            <p className="text-xs text-[#687570] italic">
              "{typedAnswer || "Current increases because the electrons have more voltage"}"
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-[#687570]">
            Tip: Option A demonstrates the AI Misconception Engine.
          </span>

          <button
            onClick={handleSubmit}
            disabled={!selectedOption && !typedAnswer}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedOption || typedAnswer
                ? 'bg-[#3D8C68] text-white hover:bg-[#2E7D5B] shadow-2xs'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

