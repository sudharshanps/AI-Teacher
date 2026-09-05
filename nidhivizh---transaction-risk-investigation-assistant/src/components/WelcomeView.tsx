import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Building,
  KeyRound
} from 'lucide-react';
import { NidhiLogo } from './NidhiLogo';

interface WelcomeViewProps {
  onEnter: (role: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onEnter }) => {
  const [selectedRole, setSelectedRole] = useState<'Fraud Investigator' | 'Senior Risk Analyst' | 'Compliance Officer'>('Fraud Investigator');

  return (
    <div className="min-h-screen bg-[#002B49] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Banner */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <NidhiLogo size="md" />
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-mono text-slate-300 border border-white/10 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#FFC700]" />
            <span>SECURE BANKING ENCLAVE</span>
          </span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center text-center space-y-8 my-auto">
        {/* Track Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse" />
          <span>TRACK PS6 • BANKING & RISK INTELLIGENCE</span>
        </div>

        {/* Big Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Transaction Risk Investigation Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            &ldquo;Don&apos;t decide fraud. Build the investigation case.&rdquo; Empowering bank risk officers with deterministic rule evaluation (R01–R04), behavioural baseline comparisons, and verifiable Gemini AI investigation briefs.
          </p>
        </div>

        {/* Role Selector Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl text-left">
          <label className="text-xs font-mono uppercase font-bold text-slate-300 block">
            Select Investigator Credential:
          </label>
          <div className="grid grid-cols-1 gap-2 text-xs">
            {[
              { role: 'Fraud Investigator', desc: 'Tier-2 Triage & Case Dossier Generation' },
              { role: 'Senior Risk Analyst', desc: 'Baseline Calibration & Heuristics Audit' },
              { role: 'Compliance Officer', desc: 'Regulatory Governance & Audit Review' }
            ].map(item => (
              <button
                key={item.role}
                type="button"
                onClick={() => setSelectedRole(item.role as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedRole === item.role
                    ? 'bg-[#0072CE] text-white border-[#00A3E0] shadow-md ring-1 ring-white/30'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <div>
                  <div className="font-bold">{item.role}</div>
                  <div className="text-[11px] text-slate-300/80">{item.desc}</div>
                </div>
                {selectedRole === item.role && (
                  <CheckCircle2 className="w-4 h-4 text-[#FFC700]" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => onEnter(selectedRole)}
            className="w-full mt-2 py-3 bg-[#FFC700] hover:bg-[#ffcf22] text-[#002B49] rounded-xl font-extrabold text-sm tracking-wide shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter Investigation Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-left text-xs">
            <ShieldCheck className="w-5 h-5 text-[#00A3E0] flex-shrink-0" />
            <div>
              <div className="font-bold text-white">Enterprise Grade</div>
              <div className="text-[10px] text-slate-400">Strict Human-in-the-Loop</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-left text-xs">
            <Sparkles className="w-5 h-5 text-[#FFC700] flex-shrink-0" />
            <div>
              <div className="font-bold text-white">Explainable AI</div>
              <div className="text-[10px] text-slate-400">Observed vs Inferred vs Unknown</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-left text-xs">
            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">Audit Compliant</div>
              <div className="text-[10px] text-slate-400">Local RAG Handbook Grounded</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 border-t border-white/10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span>NIDHIVIZH Banking Intelligence</span>
          <span>•</span>
          <span>PS6 Problem Statement Compliant</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Deterministic Engine v2.4 • Gemini 2.5 Flash
        </div>
      </footer>
    </div>
  );
};
