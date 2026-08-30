import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  HelpCircle, 
  MessageSquare, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Award, 
  Clock, 
  RefreshCw,
  FileText,
  Volume2
} from 'lucide-react';
import { TeacherAvatar } from './TeacherAvatar';
import { SubjectVisualizer } from './SubjectVisualizer';
import { InteractiveQuestionModal } from './InteractiveQuestionModal';
import { AdaptiveTeachingView } from './AdaptiveTeachingView';
import { AskTeacherDrawer } from './AskTeacherDrawer';
import { 
  GroundingCitation, 
  LanguageType, 
  LessonStep, 
  PersonalizationSettings 
} from '../types';
import { speakText, stopSpeech } from '../utils/speech';
import { multilingualTranslations } from '../data/demoCurriculum';

interface ClassroomScreenProps {
  settings: PersonalizationSettings;
  steps: LessonStep[];
  citations: GroundingCitation[];
  currentLanguage: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
  onFinishLesson: (mastery: number) => void;
}

export const ClassroomScreen: React.FC<ClassroomScreenProps> = ({
  settings,
  steps,
  citations,
  currentLanguage,
  onLanguageChange,
  onFinishLesson,
}) => {
  // Circuit physics state
  const [voltage, setVoltage] = useState<number>(12);
  const [resistance, setResistance] = useState<number>(4);

  // Lesson progression state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // Worked Example / Demo
  const [conceptMastery, setConceptMastery] = useState<number>(78);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(272); // 04:32

  // Teacher avatar playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [teacherStatus, setTeacherStatus] = useState<string>("AI Teacher is explaining...");

  // Modal / Adaptive flow state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [showAdaptiveEngine, setShowAdaptiveEngine] = useState<boolean>(false);
  const [isAskDrawerOpen, setIsAskDrawerOpen] = useState<boolean>(false);
  const [languageBanner, setLanguageBanner] = useState<string | null>(null);

  // Speech script according to current language
  const translation = multilingualTranslations[currentLanguage] || multilingualTranslations['English'];
  const [currentCaption, setCurrentCaption] = useState<string>(translation.concept);

  // Synchronize captions when language changes
  useEffect(() => {
    const t = multilingualTranslations[currentLanguage] || multilingualTranslations['English'];
    setCurrentCaption(t.concept);
    setLanguageBanner(`Language changed to ${currentLanguage}. Lesson context preserved.`);
    
    // Auto speak translated explanation
    if (isPlaying) {
      speakText(t.concept, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }

    const timer = setTimeout(() => {
      setLanguageBanner(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentLanguage]);

  // Elapsed timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsSpeaking(false);
      stopSpeech();
    } else {
      setIsPlaying(true);
      speakText(currentCaption, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleReplay = () => {
    setElapsedSeconds((prev) => Math.max(0, prev - 10));
    speakText(currentCaption, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  const handleTriggerCheckpoint = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    stopSpeech();
    setIsQuestionModalOpen(true);
  };

  const handleAnswerSubmit = (answerText: string, isMisconception: boolean) => {
    setIsQuestionModalOpen(false);

    if (isMisconception) {
      // Launch Screen 8 Adaptive Remediation!
      setShowAdaptiveEngine(true);
      setTeacherStatus("Adapting lesson: Misconception remediation active");
      const speech = translation.misconceptionSpeech;
      setCurrentCaption(speech);
      speakText(speech, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
    } else {
      // Correct direct answer
      setConceptMastery(85);
      setTeacherStatus("Understanding confirmed. Excellent!");
      const speech = translation.successSpeech;
      setCurrentCaption(speech);
      speakText(speech, currentLanguage, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleAdaptiveSuccess = (newMastery: number) => {
    setConceptMastery(newMastery);
    setShowAdaptiveEngine(false);
    setTeacherStatus("AI Teacher is explaining: Series & Parallel Circuits");
    setCurrentStepIndex(4);
  };

  return (
    <div className="space-y-4 pb-16 pt-2">
      {/* 1. Classroom Top Bar */}
      <div className="bg-white px-5 py-3 rounded-2xl border border-[#E2EAE6] shadow-2xs flex items-center justify-between flex-wrap gap-3">
        {/* Left: Topic & Timer */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center text-[#2E7D5B]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#25312D]">
                AI TEACHER: {settings.topic}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]">
                Understanding Resistance
              </span>
            </div>
            <p className="text-[11px] font-mono-custom text-[#687570] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#3D8C68]" />
              <span>{formatTime(elapsedSeconds)} / 10:00</span>
            </p>
          </div>
        </div>

        {/* Center: Global Progress Bar */}
        <div className="hidden md:flex items-center gap-3 w-64">
          <span className="text-[11px] font-semibold text-[#687570]">Lesson Progress</span>
          <div className="flex-1 h-2 bg-[#F8FBFA] rounded-full overflow-hidden border border-[#E2EAE6]">
            <div 
              className="h-full bg-[#3D8C68] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (elapsedSeconds / 600) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono-custom font-bold text-[#25312D]">
            {Math.round((elapsedSeconds / 600) * 100)}%
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Check Understanding CTA */}
          <button
            id="classroom-check-understanding-btn"
            onClick={handleTriggerCheckpoint}
            className="px-3 py-1.5 rounded-xl bg-[#EAF7F1] hover:bg-[#A8DCC5]/40 border border-[#A8DCC5] text-[#2E7D5B] text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>Check Understanding</span>
          </button>

          {/* Ask Teacher CTA */}
          <button
            id="classroom-ask-teacher-btn"
            onClick={() => setIsAskDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FBFA] border border-[#E2EAE6] text-[#25312D] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#467FB2]" />
            <span>Ask Teacher</span>
          </button>

          {/* Assessment Trigger */}
          <button
            id="classroom-finish-btn"
            onClick={() => onFinishLesson(conceptMastery)}
            className="px-3 py-1.5 rounded-xl bg-[#3D8C68] hover:bg-[#2E7D5B] text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Final Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multilingual Switch Context Notice */}
      {languageBanner && (
        <div className="p-3 bg-[#EAF7F1] rounded-xl border border-[#A8DCC5] flex items-center justify-between text-xs text-[#2E7D5B] font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#3D8C68]" />
            <span>{languageBanner}</span>
          </div>
          <span className="text-[10px] font-normal text-[#25312D]">Live Video Dubbing</span>
        </div>
      )}

      {/* 2. Main Desktop Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT / CENTER-LEFT: AI Teacher Educator Avatar Area (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <TeacherAvatar
            isSpeaking={isSpeaking}
            statusText={teacherStatus}
            currentSpeechText={currentCaption}
            language={currentLanguage}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />

          {/* Real-Time Concept Mastery Meter */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#25312D] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#3D8C68]" />
                Resistance Mastery
              </span>
              <span className="font-mono-custom font-bold text-[#2E7D5B]">
                {conceptMastery}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#F8FBFA] rounded-full overflow-hidden border border-[#E2EAE6]">
              <div 
                className="h-full bg-[#3D8C68] rounded-full transition-all duration-700"
                style={{ width: `${conceptMastery}%` }}
              />
            </div>
            <p className="text-[11px] text-[#687570]">
              Dynamically evaluated based on checkpoint questions and remediation accuracy.
            </p>
          </div>

          {/* RAG Knowledge Grounding Citation Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#25312D]">
                <ShieldCheck className="w-4 h-4 text-[#3D8C68]" />
                <span>Knowledge Grounding</span>
              </div>
              <span className="text-[10px] font-mono-custom text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
                Vector Score 0.98
              </span>
            </div>
            <p className="text-xs font-bold text-[#2E7D5B]">
              Physics_Class_10.pdf • Page 88
            </p>
            <p className="text-[11px] text-[#687570] italic bg-[#F8FBFA] p-2.5 rounded-xl border border-[#E2EAE6]">
              "Potential difference (V) is directly proportional to current (I), giving $V = I \times R$."
            </p>
          </div>
        </div>

        {/* CENTER & RIGHT: Visual Presentation OR Adaptive Engine View (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {showAdaptiveEngine ? (
            <AdaptiveTeachingView
              onSuccess={handleAdaptiveSuccess}
              onDismiss={() => setShowAdaptiveEngine(false)}
            />
          ) : (
            <SubjectVisualizer
              currentSubject="physics"
              voltage={voltage}
              setVoltage={setVoltage}
              resistance={resistance}
              setResistance={setResistance}
              highlightAnalogy={false}
            />
          )}

          {/* Bottom Live Subtitles / Captions Box */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2EAE6] shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7F1] flex items-center justify-center text-[#2E7D5B] shrink-0 mt-0.5 border border-[#A8DCC5]">
              <Volume2 className="w-4 h-4 text-[#3D8C68]" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D5B]">
                  Live Spoken Captions ({currentLanguage})
                </span>
                <span className="text-[10px] text-[#687570]">
                  Synchronized with AI Educator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#25312D] leading-relaxed font-medium">
                "{currentCaption}"
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Question Modal */}
      <InteractiveQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmitAnswer={handleAnswerSubmit}
      />

      {/* Ask Teacher Drawer */}
      <AskTeacherDrawer
        isOpen={isAskDrawerOpen}
        onClose={() => setIsAskDrawerOpen(false)}
        currentLanguage={currentLanguage}
        onSpeakText={(txt) => speakText(txt, currentLanguage)}
      />
    </div>
  );
};
