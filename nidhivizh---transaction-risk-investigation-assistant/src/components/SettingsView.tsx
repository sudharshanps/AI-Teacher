import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  BookOpen,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  FileText,
  RefreshCw
} from 'lucide-react';
import { RISK_HANDBOOK_CHUNKS } from '../services/ragService';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'ai' | 'handbook'>('rules');

  const rules = [
    {
      id: 'R01',
      name: 'Large Transaction Deviation',
      threshold: 'Amount > 3× Customer Mean OR Single Txn > ₹50,000',
      points: '+30 pts',
      severity: 'HIGH',
      description: 'Flags individual outbound debit transactions that exceed 3 times the established 90-day mean for the specific customer account, or exceed absolute high-value thresholds.'
    },
    {
      id: 'R02',
      name: 'Rapid Outbound Burst to New Payee',
      threshold: '≥ 2 Outbound Txns to Unverified Payee within 60 Minutes',
      points: '+20 pts',
      severity: 'HIGH',
      description: 'Detects micro-structuring or account-draining bursts where multiple debits are dispatched in rapid succession to a payee without historical settlement history.'
    },
    {
      id: 'R03',
      name: 'Odd Hours Activity',
      threshold: 'Transaction Occurring Between 01:00 AM – 05:00 AM IST',
      points: '+20 pts',
      severity: 'MEDIUM',
      description: 'Identifies nocturnal transaction activity executed outside the customer account customary operating hours (typically 08:00 to 22:00).'
    },
    {
      id: 'R04',
      name: 'Cumulative Velocity Deviation',
      threshold: 'Rolling Daily Velocity Exceeds 300% of Normal Velocity',
      points: '+16 pts',
      severity: 'HIGH',
      description: 'Monitors total funds dispatched within an active 24-hour cycle compared to the customer median daily turnover.'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h2 className="text-base font-extrabold text-[#002B49] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#0072CE]" />
          System Settings & Risk Architecture
        </h2>
        <p className="text-xs text-slate-500">
          Audit rule thresholds, Gemini 3.8 Flash model synthesis parameters, and internal regulatory RAG handbook.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4">
        {[
          { id: 'rules', label: 'Deterministic Risk Rules (R01–R04)', icon: Cpu },
          { id: 'ai', label: 'Gemini AI Configuration & Fallback', icon: Sparkles },
          { id: 'handbook', label: 'Local RAG Policy Knowledge Base', icon: BookOpen }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                isActive
                  ? 'border-[#0072CE] text-[#0072CE]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content: Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#002B49]">
                Configured Risk Detection Heuristics
              </h3>
              <p className="text-xs text-slate-500">
                Rule logic executes in milliseconds on Node.js/Python without requiring network calls or LLM prompts.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              RULES ENGINE: ACTIVE & SYNCHRONIZED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold bg-[#002B49] text-white px-2 py-0.5 rounded text-[11px]">
                      {r.id}
                    </span>
                    <h4 className="font-bold text-slate-900">{r.name}</h4>
                  </div>
                  <span className="font-mono font-bold text-[#0072CE]">{r.points}</span>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                  <span className="text-slate-400 font-semibold block text-[10px]">EVALUATION THRESHOLD:</span>
                  {r.threshold}
                </div>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content: AI Config */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-5 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#002B49]">
                Gemini GenAI Investigation Assistant Setup
              </h3>
              <p className="text-xs text-slate-500">
                Leverages @google/genai with gemini-2.5-flash for rapid, grounded case synthesis.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              GEMINI 2.5 FLASH
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-[#F8FAFC]">
              <span className="font-bold text-slate-800 text-xs block font-mono">
                Model Parameters & Temperature
              </span>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Selected Model:</span>
                  <span className="font-mono font-bold text-slate-900">gemini-2.5-flash</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Temperature:</span>
                  <span className="font-mono font-bold text-slate-900">0.1 (Strict Determinism)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Response Format:</span>
                  <span className="font-mono font-bold text-slate-900">Structured JSON Schema</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span>Evidence Guardrail:</span>
                  <span className="font-mono font-bold text-emerald-700">Observed/Inferred/Unknown Triad</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-[#F8FAFC]">
              <span className="font-bold text-slate-800 text-xs block font-mono">
                Zero-Downtime Deterministic Fallback
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                NidhiVizh includes a built-in algorithmic template engine. If an API key is missing or quota is exhausted, the system automatically falls back to an auditable, strictly deterministic investigation brief without interruption.
              </p>
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Fallback Engine: Operational & Pre-Tested</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content: Handbook Knowledge Base */}
      {activeTab === 'handbook' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-4 shadow-xs text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#002B49]">
                Local RAG Knowledge Base: Internal Banking Risk Handbook
              </h3>
              <p className="text-xs text-slate-500">
                Indexed operational documents used to ground every AI brief in official banking compliance directives.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              {RISK_HANDBOOK_CHUNKS.length} SECTIONS INDEXED
            </span>
          </div>

          <div className="space-y-3">
            {RISK_HANDBOOK_CHUNKS.map(chunk => (
              <div key={chunk.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0072CE]" />
                    <span className="font-bold text-slate-900 text-xs">{chunk.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {chunk.section}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
