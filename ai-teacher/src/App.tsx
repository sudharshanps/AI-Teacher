import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { StartLearningScreen } from './components/StartLearningScreen';
import { PersonalizeScreen } from './components/PersonalizeScreen';
import { LessonPlannerScreen } from './components/LessonPlannerScreen';
import { ClassroomScreen } from './components/ClassroomScreen';
import { FinalAssessmentScreen } from './components/FinalAssessmentScreen';
import { LearningReportScreen } from './components/LearningReportScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { LearningPathScreen } from './components/LearningPathScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ArchitectureView } from './components/ArchitectureView';

import { 
  ScreenType, 
  PersonalizationSettings, 
  LessonStep, 
  GroundingCitation, 
  LanguageType, 
  StudentProfileData 
} from './types';
import { 
  defaultLessonSteps, 
  defaultCitations, 
  defaultQuizQuestions, 
  defaultStudentProfile,
  defaultPersonalization 
} from './data/demoCurriculum';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('English');
  const [streak, setStreak] = useState<number>(6);

  // Lesson State
  const [settings, setSettings] = useState<PersonalizationSettings>(defaultPersonalization);
  const [lessonSteps, setLessonSteps] = useState<LessonStep[]>(defaultLessonSteps);
  const [citations, setCitations] = useState<GroundingCitation[]>(defaultCitations);
  const [profile, setProfile] = useState<StudentProfileData>(defaultStudentProfile);

  // Assessment results
  const [assessmentResults, setAssessmentResults] = useState<{
    score: number;
    total: number;
    percentage: number;
    strongAreas: string[];
    weakAreas: string[];
    misconceptions: string[];
  }>({
    score: 4,
    total: 5,
    percentage: 82,
    strongAreas: ["Voltage Potential", "Electric Current Flow", "Basic Formula (V=IR)"],
    weakAreas: ["Resistance Inverse Scaling", "Applying Ohm's Law in Complex Circuits"],
    misconceptions: ["Relationship between resistance and current"],
  });

  // Handler functions
  const handleStartLearningFromHome = (prefillTopic?: string) => {
    if (prefillTopic) {
      setSettings(prev => ({ ...prev, topic: prefillTopic }));
    }
    setCurrentScreen('start-learning');
  };

  const handleStartLearningMode = (mode: 'topic' | 'upload') => {
    setCurrentScreen('start-learning');
  };

  const handleSelectTopicFromHome = (topic: string) => {
    setSettings(prev => ({ ...prev, topic }));
    setCurrentScreen('start-learning');
  };

  const handleTopicOrUploadConfirmed = (topicName: string, uploadedDoc?: { name: string; size: string; pages: number }) => {
    setSettings(prev => ({
      ...prev,
      topic: topicName,
      sourceMaterialName: uploadedDoc?.name || prev.sourceMaterialName,
      sourceMaterialPages: uploadedDoc?.pages || prev.sourceMaterialPages,
    }));
    setCurrentScreen('personalize');
  };

  const handlePersonalizationSaved = (newSettings: PersonalizationSettings) => {
    setSettings(newSettings);
    setCurrentLanguage(newSettings.teachingLanguage);
    setCurrentScreen('lesson-planner');
  };

  const handleStartInteractiveClassroom = () => {
    setCurrentScreen('classroom');
  };

  const handleFinishClassroomLesson = (finalMastery: number) => {
    setCurrentScreen('final-assessment');
  };

  const handleCompleteAssessment = (results: {
    score: number;
    total: number;
    percentage: number;
    strongAreas: string[];
    weakAreas: string[];
    misconceptions: string[];
  }) => {
    setAssessmentResults(results);
    setProfile(prev => ({
      ...prev,
      overallProgress: Math.min(100, prev.overallProgress + 4),
      topicsStudied: prev.topicsStudied + 1,
      currentStreakDays: 6,
    }));
    setCurrentScreen('learning-report');
  };

  const handleLanguageChange = (lang: LanguageType) => {
    setCurrentLanguage(lang);
    setSettings(prev => ({ ...prev, teachingLanguage: lang }));
  };

  return (
    <div className="min-h-screen bg-[#F8FBFA] text-[#25312D] flex flex-col font-sans selection:bg-[#EAF7F1] selection:text-[#2E7D5B]">
      {/* Top Global Navigation Bar */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        streakDays={streak}
      />

      {/* Main Screen Router View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartLearning={handleStartLearningMode}
            onNavigate={setCurrentScreen}
            onSelectTopic={handleSelectTopicFromHome}
          />
        )}

        {currentScreen === 'start-learning' && (
          <StartLearningScreen
            initialTopic={settings.topic}
            onContinue={handleTopicOrUploadConfirmed}
          />
        )}

        {currentScreen === 'personalize' && (
          <PersonalizeScreen
            initialSettings={settings}
            onSaveAndContinue={handlePersonalizationSaved}
            onBack={() => setCurrentScreen('start-learning')}
          />
        )}

        {currentScreen === 'lesson-planner' && (
          <LessonPlannerScreen
            settings={settings}
            steps={lessonSteps}
            citations={citations}
            onStartLesson={handleStartInteractiveClassroom}
            onBack={() => setCurrentScreen('personalize')}
          />
        )}

        {currentScreen === 'classroom' && (
          <ClassroomScreen
            settings={settings}
            steps={lessonSteps}
            citations={citations}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            onFinishLesson={handleFinishClassroomLesson}
          />
        )}

        {currentScreen === 'final-assessment' && (
          <FinalAssessmentScreen
            questions={defaultQuizQuestions}
            onCompleteQuiz={handleCompleteAssessment}
            onBackToClassroom={() => setCurrentScreen('classroom')}
          />
        )}

        {currentScreen === 'learning-report' && (
          <LearningReportScreen
            scorePercentage={assessmentResults.percentage}
            strongAreas={assessmentResults.strongAreas}
            weakAreas={assessmentResults.weakAreas}
            misconceptions={assessmentResults.misconceptions}
            onReviewWeakArea={() => setCurrentScreen('classroom')}
            onContinueLearning={() => handleStartLearningFromHome("Series & Parallel Circuits")}
            onViewLearningPath={() => setCurrentScreen('learning-path')}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            profile={profile}
            onStartTopic={handleStartLearningFromHome}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'learning-path' && (
          <LearningPathScreen
            onStartTopic={handleStartLearningFromHome}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
          />
        )}

        {currentScreen === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Global Clean Educational Footer */}
      <footer className="bg-white border-t border-[#E2EAE6] py-4 text-center text-xs text-[#687570]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">
            <strong>AI Teacher</strong> • "An AI teacher that understands, teaches, adapts and remembers."
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              onClick={() => setCurrentScreen('architecture')}
              className="text-[#2E7D5B] hover:underline cursor-pointer font-semibold"
            >
              System Architecture
            </button>
            <span>AI Innovation Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
