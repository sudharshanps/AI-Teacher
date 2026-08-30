import React, { useState } from 'react';
import { 
  User, 
  Sparkles,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { StudentProfileData } from '../types';

interface ProfileScreenProps {
  profile: StudentProfileData;
  onUpdateProfile: (updated: Partial<StudentProfileData>) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(profile.name);
  const [learningLevel, setLearningLevel] = useState<string>(profile.learningLevel);
  const [teachingStyle, setTeachingStyle] = useState<string>(profile.teachingStyle);

  const handleSave = () => {
    onUpdateProfile({
      name,
      learningLevel,
      teachingStyle,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#A8DCC5]">
            Learner Persona & Memory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#25312D] mt-1">
            Student Profile & AI Memory
          </h1>
          <p className="text-xs sm:text-sm text-[#687570]">
            How your AI Teacher models your cognitive strengths, pacing, and preferred modalities.
          </p>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-4 py-2 rounded-xl bg-[#3D8C68] hover:bg-[#2E7D5B] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF7F1] border-2 border-[#A8DCC5] flex items-center justify-center text-[#3D8C68] shadow-2xs shrink-0">
          <User className="w-8 h-8" />
        </div>

        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-[#25312D]">
              {profile.name}
            </h2>
            <span className="text-[10px] font-bold text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
              Active Learner
            </span>
          </div>
          <p className="text-xs text-[#687570]">{profile.email}</p>

          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap pt-0.5">
            <span className="text-xs font-semibold bg-[#F8FBFA] text-[#25312D] px-2.5 py-0.5 rounded-md border border-[#E2EAE6]">
              Level: <strong className="text-[#2E7D5B]">{profile.learningLevel}</strong>
            </span>
            <span className="text-xs font-semibold bg-[#F8FBFA] text-[#25312D] px-2.5 py-0.5 rounded-md border border-[#E2EAE6]">
              Language: <strong className="text-[#2E7D5B]">{profile.preferredLanguage}</strong>
            </span>
            <span className="text-xs font-semibold bg-[#EAF7F1] text-[#2E7D5B] px-2.5 py-0.5 rounded-md border border-[#A8DCC5]">
              Style: <strong className="text-[#25312D]">{profile.teachingStyle}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
        <div className="bg-white p-3.5 rounded-xl border border-[#E2EAE6] space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
            Topics Studied
          </span>
          <p className="text-xl font-bold font-mono-custom text-[#25312D]">
            {profile.topicsStudied}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E2EAE6] space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
            Strong Concepts
          </span>
          <p className="text-xl font-bold font-mono-custom text-[#2E7D5B]">
            {profile.strongConcepts.length + 4}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E2EAE6] space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
            Weak Concepts
          </span>
          <p className="text-xl font-bold font-mono-custom text-[#467FB2]">
            {profile.weakConcepts.length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E2EAE6] space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
            Average Score
          </span>
          <p className="text-xl font-bold font-mono-custom text-[#25312D]">
            84.2%
          </p>
        </div>
      </div>

      {/* AI Memory Traits & Pedagogical Adaptation Log */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#3D8C68]" />
          <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
            AI Teacher Long-Term Cognitive Memory
          </h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#3D8C68] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#25312D]">Visual Analogy Preference Verified</p>
              <p className="text-[#687570]">
                Student responds 40% faster to hydraulic water-pipe diagrams than raw mathematical formula derivations.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#3D8C68] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#25312D]">Misconception Resolution History</p>
              <p className="text-[#687570]">
                Successfully resolved inverse proportionality in Ohm's Law (Resistance vs Current) on August 29, 2026.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#3D8C68] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#25312D]">Optimal Lesson Duration</p>
              <p className="text-[#687570]">
                Peak retention occurs in 10-15 minute interactive modules with mid-session understanding checkpoints.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scores History */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2EAE6] shadow-2xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-[#25312D]">
          Learning History & Assessment Scores
        </h3>

        <div className="space-y-2">
          {profile.recentScores.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#F8FBFA] border border-[#E2EAE6] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EAF7F1] flex items-center justify-center text-[#3D8C68] font-bold text-xs font-mono-custom border border-[#A8DCC5]">
                  0{idx + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#25312D]">{item.topic}</p>
                  <p className="text-[10px] text-[#687570]">{item.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold font-mono-custom text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
                  {item.score}% Score
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

