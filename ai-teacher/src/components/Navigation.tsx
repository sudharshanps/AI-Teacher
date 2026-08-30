import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Compass, 
  BarChart3, 
  User, 
  Cpu, 
  Flame,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Bell,
  Eye,
  Type
} from 'lucide-react';
import { LanguageType, ScreenType } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  currentLanguage: LanguageType;
  onLanguageChange: (lang: LanguageType) => void;
  streakDays: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  currentLanguage,
  onLanguageChange,
  streakDays,
}) => {
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const languages: LanguageType[] = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Kannada',
    'Hinglish',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2EAE6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF7F1] border border-[#A8DCC5] flex items-center justify-center shadow-2xs group-hover:border-[#3D8C68] transition-all">
            <GraduationCap className="w-5 h-5 text-[#3D8C68]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#25312D]">
                AI TEACHER
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]/60">
                Active Ready
              </span>
            </div>
            <p className="text-[12px] text-[#687570] hidden sm:block">
              Understands, Teaches, Adapts & Remembers
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          <button
            id="nav-home"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'home'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            id="nav-learn"
            onClick={() => onNavigate('start-learning')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'start-learning' || currentScreen === 'personalize' || currentScreen === 'lesson-planner' || currentScreen === 'classroom'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#3D8C68]" />
            <span>Learn</span>
          </button>

          <button
            id="nav-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'dashboard' || currentScreen === 'learning-report'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>My Learning</span>
          </button>

          <button
            id="nav-learning-path"
            onClick={() => onNavigate('learning-path')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'learning-path'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Learning Path</span>
          </button>

          <button
            id="nav-architecture"
            onClick={() => onNavigate('architecture')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'architecture'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#467FB2]" />
            <span>AI Architecture</span>
          </button>

          <button
            id="nav-profile"
            onClick={() => onNavigate('profile')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              currentScreen === 'profile'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] font-semibold border border-[#A8DCC5]/70'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right side: Accessibility, Streak & Language */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Notifications */}
          <div className="relative">
            <button
              id="nav-notifications-btn"
              onClick={() => setShowNotification(!showNotification)}
              aria-label="Notifications"
              className="w-8 h-8 rounded-lg border border-[#E2EAE6] bg-white flex items-center justify-center text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA] transition-colors relative"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-2 h-2 rounded-full bg-[#3D8C68] absolute top-1.5 right-1.5 ring-1 ring-white" />
            </button>

            {showNotification && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-[#E2EAE6] shadow-lg p-3.5 z-50 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2EAE6] mb-2">
                  <span className="text-xs font-semibold text-[#25312D]">AI Teacher Notice</span>
                  <span className="text-[11px] text-[#2E7D5B] bg-[#EAF7F1] px-1.5 py-0.5 rounded">New</span>
                </div>
                <p className="text-xs text-[#687570] leading-relaxed">
                  Your 5-minute revision on <strong className="text-[#25312D]">Resistance</strong> is ready based on your quiz performance.
                </p>
                <button
                  onClick={() => {
                    setShowNotification(false);
                    onNavigate('classroom');
                  }}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#EAF7F1] text-[#2E7D5B] hover:bg-[#A8DCC5]/40 text-xs font-semibold text-center transition-colors"
                >
                  Start Revision
                </button>
              </div>
            )}
          </div>

          {/* Accessibility toggle */}
          <div className="relative">
            <button
              id="nav-accessibility-btn"
              onClick={() => setShowAccessibility(!showAccessibility)}
              title="Accessibility & Learning Options"
              className="w-8 h-8 rounded-lg border border-[#E2EAE6] bg-white flex items-center justify-center text-[#687570] hover:text-[#25312D] hover:bg-[#F8FBFA] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {showAccessibility && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#E2EAE6] shadow-lg p-3 z-50 text-left">
                <div className="text-xs font-semibold text-[#25312D] pb-2 border-b border-[#E2EAE6] mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#3D8C68]" />
                  <span>Accessibility Preferences</span>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs text-[#25312D] cursor-pointer">
                    <span className="flex items-center gap-1.5"><Type className="w-3 h-3 text-[#687570]" /> Larger Reading Text</span>
                    <input 
                      type="checkbox" 
                      checked={largeText} 
                      onChange={(e) => setLargeText(e.target.checked)} 
                      className="rounded accent-[#3D8C68]"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs text-[#25312D] cursor-pointer">
                    <span>High Contrast Borders</span>
                    <input 
                      type="checkbox" 
                      checked={highContrast} 
                      onChange={(e) => setHighContrast(e.target.checked)} 
                      className="rounded accent-[#3D8C68]"
                    />
                  </label>
                  <div className="pt-2 border-t border-[#E2EAE6] text-[11px] text-[#687570]">
                    ✓ Web Speech voice active<br />
                    ✓ Live subtitles enabled
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Daily Streak */}
          <div 
            title={`${streakDays} Day Learning Streak`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF7F1] border border-[#A8DCC5]/60 text-xs font-semibold text-[#2E7D5B]"
          >
            <Flame className="w-3.5 h-3.5 text-[#3D8C68] fill-[#3D8C68]" />
            <span>{streakDays}d</span>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-[#687570] absolute left-2.5 pointer-events-none" />
            <select
              id="global-language-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageType)}
              className="appearance-none bg-white pl-8 pr-6 py-1.5 text-xs font-medium text-[#25312D] rounded-lg border border-[#E2EAE6] hover:border-[#A8DCC5] focus:outline-none focus:ring-1 focus:ring-[#3D8C68] cursor-pointer shadow-2xs"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Primary CTA */}
          <button
            id="nav-quick-start"
            onClick={() => onNavigate('start-learning')}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#3D8C68] hover:bg-[#2E7D5B] shadow-2xs transition-all cursor-pointer"
          >
            Start Lesson
          </button>
        </div>
      </div>
    </header>
  );
};
