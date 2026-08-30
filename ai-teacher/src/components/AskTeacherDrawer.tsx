import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  FileText
} from 'lucide-react';
import { LanguageType } from '../types';

interface AskTeacherDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageType;
  onSpeakText: (text: string) => void;
}

export const AskTeacherDrawer: React.FC<AskTeacherDrawerProps> = ({
  isOpen,
  onClose,
  onSpeakText,
}) => {
  const [questionInput, setQuestionInput] = useState<string>("");
  const [conversation, setConversation] = useState<{
    id: number;
    sender: 'student' | 'teacher';
    text: string;
    citation?: string;
  }[]>([
    {
      id: 1,
      sender: 'teacher',
      text: "I'm listening! You can ask anything about Ohm's Law, voltage pressure, resistance, or ask me to explain in another language or with household analogies.",
    },
  ]);

  if (!isOpen) return null;

  const quickQuestions = [
    "Why does current decrease when resistance increases?",
    "Can you give me a real-world example like a toaster or fan?",
    "Explain this in Hinglish with a simple trick.",
    "What is the difference between an Ohm and a Volt?",
  ];

  const handleAsk = (queryText: string) => {
    const q = queryText || questionInput;
    if (!q.trim()) return;

    const studentMsg = {
      id: Date.now(),
      sender: 'student' as const,
      text: q,
    };

    setConversation((prev) => [...prev, studentMsg]);
    setQuestionInput("");

    // Simulate AI Teacher Pedagogical Response maintaining lesson context
    setTimeout(() => {
      let teacherResponse = "";
      let cite = "Physics_Class_10.pdf • Page 89";

      if (q.includes("decrease") || q.includes("resistance")) {
        teacherResponse = "Great question! Electrons move because Voltage pushes them. When Resistance increases, the metal atoms inside the conductor collide more frequently with moving electrons, reducing their drift velocity. That's why fewer electrons reach the other end per second (lower Current).";
      } else if (q.includes("toaster") || q.includes("real-world") || q.includes("appliance")) {
        teacherResponse = "Think of an electric toaster! Inside, the heating wire (nichrome) has high resistance. When 120V is applied, the high resistance limits the current to around 8 Amperes while causing the energy to convert efficiently into glowing heat to toast your bread.";
      } else if (q.includes("Hinglish") || q.includes("Hindi")) {
        teacherResponse = "Haan bilkul! Simple trick ye hai: Voltage ko samjho 'Dhakka' (Push), Current ko samjho 'Speed/Flow', aur Resistance ko samjho 'Speed Breaker'. Agar road pe bade speed breakers (high resistance) honge, toh traffic ka flow (current) naturally slow ho jayega!";
      } else {
        teacherResponse = `Based on our current lesson on ${q}, Ohm's Law dictates that Current equals Voltage divided by Resistance (I = V/R). As long as temperature remains constant, the potential difference across conductor ends stays strictly proportional to current.`;
      }

      const teacherMsg = {
        id: Date.now() + 1,
        sender: 'teacher' as const,
        text: teacherResponse,
        citation: cite,
      };

      setConversation((prev) => [...prev, teacherMsg]);
      onSpeakText(teacherResponse);
    }, 700);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-[#E2EAE6] shadow-xl flex flex-col justify-between animate-fadeIn">
      {/* Drawer Header */}
      <div className="p-4 bg-[#F8FBFA] border-b border-[#E2EAE6] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#25312D]">
              Ask Your AI Teacher
            </h3>
            <p className="text-[10px] text-[#687570]">
              Context-Preserving Classroom Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-[#EAF7F1] text-[#687570] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {conversation.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'student' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed space-y-1.5 ${
                msg.sender === 'student'
                  ? 'bg-[#3D8C68] text-white rounded-br-xs'
                  : 'bg-[#F8FBFA] text-[#25312D] border border-[#E2EAE6] rounded-bl-xs'
              }`}
            >
              <p>{msg.text}</p>
              {msg.citation && (
                <div className="flex items-center gap-1 text-[10px] text-[#2E7D5B] font-semibold bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
                  <FileText className="w-3 h-3 text-[#3D8C68]" />
                  <span>Grounded in {msg.citation}</span>
                </div>
              )}
            </div>
            <span className="text-[9px] text-[#687570] px-1 mt-0.5">
              {msg.sender === 'student' ? 'You' : 'AI Teacher'}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Prompts & Input Area */}
      <div className="p-4 bg-[#F8FBFA] border-t border-[#E2EAE6] space-y-2.5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
            Suggested Queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                className="text-[10px] text-[#2E7D5B] bg-white hover:bg-[#EAF7F1] px-2.5 py-1 rounded-lg border border-[#E2EAE6] transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(questionInput);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Ask a clarifying question..."
            className="flex-1 p-2 text-xs bg-white rounded-lg border border-[#E2EAE6] focus:border-[#3D8C68] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!questionInput.trim()}
            className="p-2 bg-[#3D8C68] text-white rounded-lg hover:bg-[#2E7D5B] disabled:bg-stone-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

