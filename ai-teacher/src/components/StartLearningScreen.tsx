import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Database,
  Layers,
  FileCheck2,
  Clock,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';

interface StartLearningScreenProps {
  initialMode?: 'topic' | 'upload';
  initialTopic?: string;
  onProceedToPersonalize?: (topic: string, materialName?: string, pages?: number) => void;
  onContinue?: (topicName: string, uploadedDoc?: { name: string; size: string; pages: number }) => void;
}

export const StartLearningScreen: React.FC<StartLearningScreenProps> = ({
  initialMode = 'topic',
  initialTopic = "Ohm's Law",
  onProceedToPersonalize,
  onContinue,
}) => {
  const [topicInput, setTopicInput] = useState<string>(initialTopic || "Ohm's Law");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStep, setUploadStep] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    pages: number;
    chapters: string[];
    conceptsExtracted: number;
    confidence: number;
  } | null>(null);

  const handleProceed = (topic: string, materialName = "Physics_Class_10_NCERT.pdf", pages = 124) => {
    if (onProceedToPersonalize) {
      onProceedToPersonalize(topic, materialName, pages);
    } else if (onContinue) {
      onContinue(topic, { name: materialName, size: "14.8 MB", pages });
    }
  };

  const sampleTopics = [
    {
      title: "Ohm's Law & Circuit Analysis",
      subject: "Physics",
      prompt: "Teach me Ohm's Law and circuit resistance from the beginning with visual analogies.",
      tag: "Recommended Demo",
    },
    {
      title: "Newton's Laws of Motion",
      subject: "Physics",
      prompt: "Teach me Newton's three laws of motion with real-world mechanical examples.",
      tag: "Mechanics",
    },
    {
      title: "Cell Mitosis & Meiosis",
      subject: "Biology",
      prompt: "Explain cell division phases: prophase, metaphase, anaphase, and telophase.",
      tag: "Life Sciences",
    },
    {
      title: "Quadratic Equations & Roots",
      subject: "Mathematics",
      prompt: "Teach me quadratic formulas, discriminant analysis, and geometric parabola derivations.",
      tag: "Algebra",
    },
    {
      title: "Transformer Attention Mechanism",
      subject: "Computer Science",
      prompt: "Teach me how Self-Attention and Query-Key-Value matrices work in Large Language Models.",
      tag: "AI & ML",
    },
    {
      title: "Photosynthesis & Light Reactions",
      subject: "Biology",
      prompt: "Explain the Calvin cycle, chloroplast thylakoid reactions, and ATP generation in plants.",
      tag: "Botany",
    },
  ];

  const handleSimulateUpload = (fileName = "Physics_Class_10_NCERT.pdf", pages = 124) => {
    setIsUploading(true);
    setUploadStep(1);

    setTimeout(() => {
      setUploadStep(2);
    }, 1100);

    setTimeout(() => {
      setUploadStep(3);
    }, 2200);

    setTimeout(() => {
      setIsUploading(false);
      setUploadedFile({
        name: fileName,
        size: "14.8 MB",
        pages: pages,
        chapters: [
          "Chapter 1: Light Reflection & Refraction",
          "Chapter 2: Human Eye & Colourful World",
          "Chapter 3: Sources of Energy",
          "Chapter 4: Electricity & Ohm's Law",
          "Chapter 5: Magnetic Effects of Electric Current",
        ],
        conceptsExtracted: 38,
        confidence: 98,
      });
      setTopicInput("Ohm's Law & Circuit Resistance (Grounded in Physics_Class_10_NCERT.pdf)");
    }, 3400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleSimulateUpload(file.name, Math.floor(Math.random() * 80) + 40);
    } else {
      handleSimulateUpload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3D8C68]" />
          <span>Step 1 of 4 • Ingest & Ground</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
          How Would You Like to Learn?
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-xl mx-auto">
          Choose any academic topic or upload your curriculum material. Your AI Teacher will ground every lesson in verified knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* OPTION 1: Teach Me a Topic */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E2EAE6] hover:border-[#A8DCC5] shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#3D8C68]">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D8C68]">
                  Option 1
                </span>
                <h2 className="text-base font-bold text-[#25312D]">
                  Enter Any Academic Topic
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#687570] leading-relaxed">
              Enter any concept from physics, mathematics, computer science, biology, or humanities.
            </p>

            <div className="space-y-1.5">
              <label htmlFor="topic-input" className="block text-xs font-semibold text-[#25312D]">
                Topic or learning goal:
              </label>
              <textarea
                id="topic-input"
                rows={3}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Teach me Ohm's Law and circuit resistance from the beginning..."
                className="w-full p-2.5 text-xs sm:text-sm text-[#25312D] bg-[#F8FBFA] rounded-lg border border-[#E2EAE6] focus:border-[#3D8C68] focus:ring-1 focus:ring-[#3D8C68] focus:outline-none transition-all placeholder:text-[#687570]/60 resize-none"
              />
            </div>

            {/* Popular Curated Topics */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#687570]">
                Quick Starter Topics:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {sampleTopics.map((sample) => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => setTopicInput(sample.prompt)}
                    className="w-full text-left p-2 rounded-lg bg-[#F8FBFA] hover:bg-[#EAF7F1]/60 border border-[#E2EAE6] hover:border-[#A8DCC5] transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#25312D] group-hover:text-[#3D8C68]">
                          {sample.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#687570] border border-[#E2EAE6]">
                          {sample.subject}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#687570] truncate">
                        {sample.prompt}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]/60 whitespace-nowrap">
                      {sample.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            id="topic-create-lesson-btn"
            onClick={() => handleProceed(topicInput, "Physics_Class_10_NCERT.pdf", 124)}
            className="w-full py-2.5 px-4 rounded-lg bg-[#3D8C68] hover:bg-[#2E7D5B] text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Personalize Lesson Plan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* OPTION 2: Learn From Your Material (RAG Grounding) */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E2EAE6] hover:border-[#A8DCC5] shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#EAF3FB] border border-[#A9CDE8] flex items-center justify-center text-[#467FB2]">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#467FB2]">
                  Option 2
                </span>
                <h2 className="text-base font-bold text-[#25312D]">
                  Learn From Document / PDF
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#687570] leading-relaxed">
              Upload textbooks, class notes, or syllabi. The AI indexes chapters, key formulas, and builds a strict citation ground.
            </p>

            {/* Drop Zone Area */}
            {!uploadedFile && !isUploading && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => handleSimulateUpload()}
                className="border-2 border-dashed border-[#E2EAE6] hover:border-[#3D8C68] bg-[#F8FBFA] hover:bg-[#EAF7F1]/30 p-5 rounded-xl text-center cursor-pointer transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E2EAE6] mx-auto flex items-center justify-center text-[#3D8C68] group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#25312D]">
                    Click to load sample material or drag & drop
                  </p>
                  <p className="text-[11px] text-[#687570]">
                    Loads <strong className="text-[#3D8C68]">Physics_Class_10_NCERT.pdf (124 pages)</strong>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {['PDF', 'DOCX', 'PPTX', 'EPUB', 'TXT'].map((ext) => (
                    <span
                      key={ext}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono-custom text-[#687570] bg-white border border-[#E2EAE6]"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading & Processing Status */}
            {isUploading && (
              <div className="p-4 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5] space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center animate-spin text-[#3D8C68]">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#25312D]">
                      Physics_Class_10_NCERT.pdf (124 pages)
                    </p>
                    <p className="text-[11px] text-[#2E7D5B] font-medium">
                      {uploadStep === 1 && "Ingesting document & extracting TOC..."}
                      {uploadStep === 2 && "Segmenting concepts & formulas..."}
                      {uploadStep === 3 && "Building vector index & citation grounding..."}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#A8DCC5]">
                    <div 
                      className="h-full bg-[#3D8C68] transition-all duration-700"
                      style={{ width: `${(uploadStep / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#687570]">
                    <span>Semantic Chunking & Knowledge Base</span>
                    <span>{Math.round((uploadStep / 3) * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded File Grounding Confirmation */}
            {uploadedFile && (
              <div className="p-3.5 rounded-xl bg-[#F8FBFA] border border-[#A8DCC5] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] flex items-center justify-center text-[#2E7D5B] border border-[#A8DCC5]">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#25312D]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[11px] text-[#687570]">
                        {uploadedFile.pages} pages • {uploadedFile.size} • {uploadedFile.conceptsExtracted} Concepts
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
                    {uploadedFile.confidence}% Grounded
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-[#E2EAE6] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3D8C68]" />
                    <span className="text-[11px] font-semibold text-[#25312D]">
                      Chapter 4: Electricity & Ohm's Law (Pages 88-102)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#687570]">
                    Formulas detected: V = I × R, P = V × I. Water pipe analogy mapped to potential difference.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            id="upload-proceed-btn"
            onClick={() => {
              if (!uploadedFile) {
                handleSimulateUpload();
              } else {
                handleProceed("Ohm's Law", uploadedFile.name, uploadedFile.pages);
              }
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#EAF7F1] hover:bg-[#A8DCC5]/40 border border-[#A8DCC5] text-[#2E7D5B] font-semibold text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>{uploadedFile ? "Personalize from Uploaded Material" : "Load Sample Textbook"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
