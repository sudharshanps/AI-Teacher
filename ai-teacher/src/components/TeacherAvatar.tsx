import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  UserCheck
} from 'lucide-react';
import { LanguageType } from '../types';

interface TeacherAvatarProps {
  isSpeaking: boolean;
  statusText: string;
  currentSpeechText: string;
  language: LanguageType;
  onTogglePlay: () => void;
  isPlaying: boolean;
  onReplay: () => void;
  onSpeedChange: (speed: number) => void;
  speed: number;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  isSpeaking,
  statusText,
  language,
  onTogglePlay,
  isPlaying,
  onReplay,
  onSpeedChange,
  speed,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);

  const avatars = [
    {
      name: "Dr. Elena Sharma",
      title: "Senior AI Educator",
      accent: "Clear Academic",
      hairBg: "bg-[#25312D]",
      coatBg: "bg-[#3D8C68]",
      badge: "Physics Specialist",
    },
    {
      name: "Prof. Andrew Vance",
      title: "STEM Pedagogy Specialist",
      accent: "Visual Socratic",
      hairBg: "bg-stone-700",
      coatBg: "bg-[#467FB2]",
      badge: "Intuitive Analogies",
    },
    {
      name: "Dr. Priya Raman",
      title: "Multilingual AI Lecturer",
      accent: "Indian Regional",
      hairBg: "bg-[#1E293B]",
      coatBg: "bg-[#2E7D5B]",
      badge: "Multilingual Specialist",
    },
  ];

  const currentAvatar = avatars[avatarIndex];

  return (
    <div className="bg-white rounded-xl border border-[#E2EAE6] shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Top Avatar Info */}
      <div className="p-3 bg-[#F8FBFA] border-b border-[#E2EAE6] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3D8C68] animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-[#25312D] flex items-center gap-1.5">
              <span>{currentAvatar.name}</span>
              <span className="text-[10px] font-normal text-[#687570]">({currentAvatar.title})</span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => setAvatarIndex((avatarIndex + 1) % avatars.length)}
          title="Switch Educator Avatar"
          className="text-[10px] font-semibold text-[#3D8C68] hover:text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5] cursor-pointer"
        >
          Switch Avatar
        </button>
      </div>

      {/* Main Video / Animated Avatar Canvas */}
      <div className="relative bg-gradient-to-b from-[#F8FBFA] via-[#EAF7F1]/30 to-[#EAF3FB]/30 p-5 flex flex-col items-center justify-center min-h-[240px] overflow-hidden">
        
        {/* Subtle Background Radial Ring */}
        <div className={`absolute w-48 h-48 rounded-full border-2 border-dashed border-[#A8DCC5]/50 transition-transform duration-1000 ${
          isSpeaking ? 'animate-spin' : ''
        }`} />

        {/* The Animated Educator Avatar Figure */}
        <div className="relative flex flex-col items-center z-10">
          
          {/* Avatar Head & Expression */}
          <div className="relative">
            {/* Hair */}
            <div className={`w-26 h-12 ${currentAvatar.hairBg} rounded-t-full absolute -top-2.5 inset-x-0 mx-auto shadow-2xs`} />
            
            {/* Face */}
            <div className="w-22 h-26 rounded-3xl bg-[#FCD5B5] border-2 border-[#3D8C68]/20 relative flex flex-col items-center justify-center shadow-2xs overflow-hidden">
              
              {/* Glasses */}
              <div className="absolute top-6 flex items-center gap-1.5 z-20">
                <div className="w-5 h-3.5 rounded-md border-2 border-[#25312D] bg-white/40" />
                <div className="w-1.5 h-0.5 bg-[#25312D]" />
                <div className="w-5 h-3.5 rounded-md border-2 border-[#25312D] bg-white/40" />
              </div>

              {/* Eyes */}
              <div className="absolute top-7.5 flex items-center gap-4 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#25312D]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#25312D]" />
              </div>

              {/* Cheeks */}
              <div className="absolute top-11 flex items-center gap-8">
                <div className="w-2.5 h-1.5 rounded-full bg-rose-300/60" />
                <div className="w-2.5 h-1.5 rounded-full bg-rose-300/60" />
              </div>

              {/* Nose */}
              <div className="absolute top-10 w-1.5 h-2 rounded-full bg-amber-600/30" />

              {/* Animated Speaking Mouth */}
              <div className="absolute bottom-4">
                {isSpeaking ? (
                  <div className="w-5 h-2.5 bg-rose-900 rounded-full animate-bounce flex items-center justify-center">
                    <div className="w-2.5 h-0.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <div className="w-4 h-1 bg-rose-800 rounded-full" />
                )}
              </div>
            </div>

            {/* Smart Microphone Headset */}
            <div className="absolute -left-1 top-7 w-1.5 h-5 bg-[#25312D] rounded-full" />
            <div className="absolute left-0 top-12 w-7 h-1 bg-[#25312D] rounded-full transform -rotate-12" />
            <div className="absolute left-5 top-14 w-2.5 h-2.5 bg-[#3D8C68] rounded-full border border-white" />
          </div>

          {/* Shoulders / Torso */}
          <div className="relative -mt-2">
            <div className={`w-36 h-14 ${currentAvatar.coatBg} rounded-t-3xl border-t-2 border-x-2 border-[#25312D]/10 flex items-center justify-center shadow-2xs`}>
              <div className="w-7 h-8 bg-white clip-triangle mt-1 rounded-b-sm border-x border-[#E2EAE6]" />
            </div>
          </div>
        </div>

        {/* Live Audio Waveform Animation when Teacher Speaks */}
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 h-7">
          {isSpeaking ? (
            <>
              <div className="w-1 bg-[#3D8C68] rounded-full animate-sound-wave-1" />
              <div className="w-1 bg-[#467FB2] rounded-full animate-sound-wave-2" />
              <div className="w-1.5 bg-[#3D8C68] rounded-full animate-sound-wave-3" />
              <div className="w-1 bg-[#467FB2] rounded-full animate-sound-wave-4" />
              <div className="w-1.5 bg-[#3D8C68] rounded-full animate-sound-wave-5" />
              <div className="w-1 bg-[#467FB2] rounded-full animate-sound-wave-2" />
              <div className="w-1 bg-[#3D8C68] rounded-full animate-sound-wave-1" />
            </>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-medium text-[#687570] bg-white px-2.5 py-0.5 rounded-full border border-[#E2EAE6]">
              <span>Teacher is listening</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar Under Avatar */}
      <div className="px-3.5 py-2 bg-[#F8FBFA] border-t border-[#E2EAE6] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#3D8C68]" />
          <span className="text-xs font-semibold text-[#25312D]">
            {statusText || "AI Teacher is explaining..."}
          </span>
        </div>

        <span className="text-[10px] font-mono-custom text-[#687570] bg-white px-2 py-0.5 rounded border border-[#E2EAE6]">
          {language}
        </span>
      </div>

      {/* Video / Speech Controls Bar */}
      <div className="p-2.5 bg-white border-t border-[#E2EAE6] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlay}
            title={isPlaying ? "Pause Teacher" : "Resume Teacher"}
            className="w-7 h-7 rounded-lg bg-[#EAF7F1] hover:bg-[#A8DCC5]/50 border border-[#A8DCC5] text-[#25312D] flex items-center justify-center cursor-pointer transition-all shadow-2xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onReplay}
            title="Replay previous 10s explanation"
            className="w-7 h-7 rounded-lg bg-[#F8FBFA] hover:bg-[#EAF7F1] border border-[#E2EAE6] text-[#687570] hover:text-[#25312D] flex items-center justify-center cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
            className="w-7 h-7 rounded-lg bg-[#F8FBFA] hover:bg-[#EAF7F1] border border-[#E2EAE6] text-[#687570] hover:text-[#25312D] flex items-center justify-center cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#3D8C68]" />}
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          {[0.75, 1.0, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono-custom font-semibold transition-all cursor-pointer ${
                speed === s
                  ? 'bg-[#3D8C68] text-white'
                  : 'bg-[#F8FBFA] text-[#687570] hover:text-[#25312D] border border-[#E2EAE6]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

