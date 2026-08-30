import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Globe, 
  Layers, 
  Lightbulb, 
  Target, 
  GraduationCap, 
  ArrowRight,
  FileCheck2,
  Sliders,
  Smile,
  HelpCircle,
  Zap,
  BookOpen,
  Sparkle
} from 'lucide-react';
import { LanguageType, PersonalizationSettings, TeacherPersonality } from '../types';

interface PersonalizeScreenProps {
  initialSettings: PersonalizationSettings;
  onGenerateLesson: (settings: PersonalizationSettings) => void;
  onBack: () => void;
}

export const PersonalizeScreen: React.FC<PersonalizeScreenProps> = ({
  initialSettings,
  onGenerateLesson,
  onBack,
}) => {
  const [settings, setSettings] = useState<PersonalizationSettings>({
    ...initialSettings,
    teacherPersonality: initialSettings.teacherPersonality || 'Encouraging',
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("Analyzing learner profile & grounding vectors...");

  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];
  const knowledgeLevels: ('New to this' | 'Basic understanding' | 'Comfortable with basics')[] = [
    'New to this',
    'Basic understanding',
    'Comfortable with basics',
  ];
  const objectives: ('Understand the concept' | 'Exam preparation' | 'Practical application' | 'Interview preparation')[] = [
    'Understand the concept',
    'Exam preparation',
    'Practical application',
    'Interview preparation',
  ];
  const languages: LanguageType[] = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Kannada',
    'Hinglish',
  ];
  const styles: ('Simple explanations' | 'Examples first' | 'Visual learning' | 'Step-by-step' | 'Socratic questioning')[] = [
    'Simple explanations',
    'Examples first',
    'Visual learning',
    'Step-by-step',
    'Socratic questioning',
  ];
  const times: ('5 minutes' | '10 minutes' | '20 minutes' | '30 minutes' | '60 minutes' | '7 days')[] = [
    '5 minutes',
    '10 minutes',
    '20 minutes',
    '30 minutes',
    '60 minutes',
    '7 days',
  ];
  const depths: ('Essential' | 'Balanced' | 'Detailed')[] = ['Essential', 'Balanced', 'Detailed'];

  const personalities: { id: TeacherPersonality; label: string; desc: string; icon: any }[] = [
    { id: 'Encouraging', label: 'Encouraging & Patient', desc: 'Positive reinforcement, empathetic pacing, low stress', icon: Smile },
    { id: 'Socratic', label: 'Socratic Inquirer', desc: 'Guides you to answers by asking deep probing questions', icon: HelpCircle },
    { id: 'Direct & Rigorous', label: 'Direct & Rigorous', desc: 'Concise, high-density, formula-first, zero fluff', icon: Zap },
    { id: 'Storyteller', label: 'Storyteller & Analogies', desc: 'Rich narrative framing and relatable real-world stories', icon: BookOpen },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const steps = [
      "Analyzing learner profile & grounding vectors...",
      "Structuring 7-step pedagogical timeline...",
      "Synthesizing subject-aware circuit visuals & analogies...",
      "Configuring AI Teacher Avatar...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setGenerationStep(steps[i]);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        onGenerateLesson(settings);
      }
    }, 550);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3D8C68]" />
          <span>Step 2 of 4 • Pedagogical Adaptation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D]">
          Personalize Your AI Teacher
        </h1>
        <p className="text-xs sm:text-sm text-[#687570] max-w-xl mx-auto">
          Tell your AI teacher how you learn best. Your lesson structure, video pacing, and analogies will be custom-generated.
        </p>
      </div>

      {/* Grounding Source Info */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E2EAE6] flex items-center justify-between flex-wrap gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] border border-[#A8DCC5]">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#3D8C68] uppercase tracking-wider">
              Topic & Grounding Source
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#25312D]">
              {settings.topic}
            </p>
            {settings.sourceMaterialName && (
              <p className="text-[11px] text-[#687570]">
                Knowledge Grounded in <strong className="text-[#25312D]">{settings.sourceMaterialName}</strong> ({settings.sourceMaterialPages} pages)
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-[#3D8C68] hover:text-[#2E7D5B] underline cursor-pointer"
        >
          Change Topic / Material
        </button>
      </div>

      {/* Main Personalization Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E2EAE6] shadow-2xs space-y-5">
          
          {/* Teacher Personality */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Teacher Personality & Demeanor</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {personalities.map((p) => {
                const Icon = p.icon;
                const isSelected = settings.teacherPersonality === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, teacherPersonality: p.id })}
                    className={`p-3 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#25312D] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                        : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${isSelected ? 'bg-[#3D8C68] text-white' : 'bg-white text-[#687570] border border-[#E2EAE6]'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-[#25312D]">{p.label}</span>
                    </div>
                    <p className="text-[11px] text-[#687570] mt-1.5 line-clamp-2">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Learning Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Learning Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSettings({ ...settings, learningLevel: lvl })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                    settings.learningLevel === lvl
                      ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Existing Knowledge */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Existing Knowledge</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {knowledgeLevels.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSettings({ ...settings, existingKnowledge: k })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                    settings.existingKnowledge === k
                      ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Learning Objective */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Learning Objective</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setSettings({ ...settings, learningObjective: obj })}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                    settings.learningObjective === obj
                      ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Teaching Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Teaching Language (Multilingual Video & Speech)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSettings({ ...settings, teachingLanguage: lang })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border text-center cursor-pointer ${
                    settings.teachingLanguage === lang
                      ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs font-semibold'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Teaching Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#3D8C68]" />
              <span>Teaching Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {styles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSettings({ ...settings, teachingStyle: st })}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all border text-center cursor-pointer ${
                    settings.teachingStyle === st
                      ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 6 & 7: Available Time and Desired Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>Available Time</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSettings({ ...settings, availableTime: t })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border text-center cursor-pointer ${
                      settings.availableTime === t
                        ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs font-semibold'
                        : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>Desired Depth</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {depths.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSettings({ ...settings, desiredDepth: d })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border text-center cursor-pointer ${
                      settings.desiredDepth === d
                        ? 'bg-[#EAF7F1] border-[#3D8C68] text-[#2E7D5B] ring-1 ring-[#3D8C68]/30 shadow-2xs font-semibold'
                        : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570] hover:border-[#A8DCC5] hover:text-[#25312D]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* AI Insight banner */}
        <div className="p-3.5 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5]/70 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-[#3D8C68] shrink-0 mt-0.5 border border-[#A8DCC5]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#25312D]">
              Adaptive Pedagogical Matrix Active
            </p>
            <p className="text-[11px] text-[#687570] leading-relaxed">
              "AI Teacher will present in <strong className="text-[#25312D]">{settings.teachingLanguage}</strong> with a <strong className="text-[#25312D]">{settings.teacherPersonality}</strong> demeanor, tailoring explanations for a <strong className="text-[#25312D]">{settings.learningLevel}</strong> ({settings.availableTime})."
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-1">
          {isGenerating ? (
            <div className="w-full p-3.5 rounded-xl bg-white border border-[#3D8C68] flex items-center justify-center gap-2.5 shadow-2xs">
              <div className="w-4 h-4 rounded-full border-2 border-[#3D8C68] border-t-transparent animate-spin" />
              <span className="text-xs font-semibold text-[#25312D]">
                {generationStep}
              </span>
            </div>
          ) : (
            <button
              id="personalize-generate-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#3D8C68] hover:bg-[#2E7D5B] text-white font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Generate Lesson Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
