import React, { useState } from 'react';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  FileCheck2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Printer,
  FileDown,
  UserCheck,
  Send,
  AlertCircle,
  Info,
  GitCommit,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  AIInvestigationBrief,
  CustomerProfile,
  DecisionStatus,
  InvestigationCase,
  RiskEvaluation,
  Transaction
} from '../types';
import { maskAmount, maskCustomerName, maskAccountNumber } from '../utils/privacy';

interface InvestigationHeroViewProps {
  customer: CustomerProfile;
  evaluation: RiskEvaluation;
  flaggedTransactions: Transaction[];
  brief: AIInvestigationBrief;
  onOpenBriefModal: () => void;
  onSaveDecision: (status: DecisionStatus, notes: string) => void;
  onSelectTransaction: (txn: Transaction) => void;
  isPrivacyMode?: boolean;
  slaRemainingMinutes?: number;
}

export const InvestigationHeroView: React.FC<InvestigationHeroViewProps> = ({
  customer,
  evaluation,
  flaggedTransactions,
  brief,
  onOpenBriefModal,
  onSaveDecision,
  onSelectTransaction,
  isPrivacyMode = false,
  slaRemainingMinutes = 18
}) => {
  const [activeBottomTab, setActiveBottomTab] = useState<'rules' | 'why_analysis' | 'evidence_chain' | 'circadian' | 'clusters' | 'evidence' | 'decision'>('why_analysis');
  const [selectedDecision, setSelectedDecision] = useState<DecisionStatus>('PENDING');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionSavedToast, setDecisionSavedToast] = useState(false);

  const baseline = customer?.baseline || {
    meanAmount: 0,
    medianAmount: 0,
    stdDev: 0,
    monthlyFrequency: 0,
    activeHoursStart: 9,
    activeHoursEnd: 21,
    commonPayees: [],
    commonChannels: [],
    typicalLocations: [],
    totalHistoricalTransactions: 0,
    largestHistoricalTxn: 0,
    hasSufficientData: false,
    regularLargePaymentPattern: false,
    circadianHourlyVolumes: Array(24).fill(0)
  };
  const isHighPriority = evaluation.priorityCategory === 'HIGH PRIORITY';
  const isClean = evaluation.status === 'NO ATTENTION REQUIRED';
  const isInsufficient = evaluation.status === 'INSUFFICIENT EVIDENCE';

  // Comparison Bar Chart data: Baseline vs Flagged Transactions
  const comparisonData = [
    {
      name: 'Normal Avg',
      amount: baseline.meanAmount,
      type: 'baseline',
      color: '#0072CE'
    },
    ...flaggedTransactions.map(t => ({
      name: `${t.id.slice(-4)} (${t.time})`,
      amount: t.amount,
      type: 'flagged',
      color: '#DC2626'
    }))
  ];

  // Hourly Circadian Data (24 hours)
  const circadianChartData = Array.from({ length: 24 }, (_, hour) => {
    const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
    const baselineVol = baseline.circadianHourlyVolumes ? (baseline.circadianHourlyVolumes[hour] || 0) : 0;
    
    // Count how many flagged transactions fell in this hour
    const flaggedInHour = flaggedTransactions.filter(t => {
      const h = parseInt(t.time.split(':')[0], 10);
      return h === hour;
    }).length;

    return {
      hour: hourLabel,
      baselineVolume: baselineVol,
      flaggedEvents: flaggedInHour,
      isNocturnal: hour >= 23 || hour <= 5
    };
  });

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDecision === 'PENDING') return;
    onSaveDecision(selectedDecision, decisionNotes);
    setDecisionSavedToast(true);
    setTimeout(() => setDecisionSavedToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isHighPriority ? 'bg-red-50 text-red-600 border border-red-200' :
            isClean ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            'bg-amber-50 text-amber-600 border border-amber-200'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                CASE #{customer?.id || '—'}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isHighPriority ? 'bg-red-100 text-red-700 border-red-300' :
                isClean ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {evaluation.status}
              </span>
              {isHighPriority && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 animate-pulse">
                  <Clock className="w-3 h-3" />
                  SLA: {slaRemainingMinutes}m REMAINING
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-[#002B49] tracking-tight">
              {maskCustomerName(customer?.name || 'Customer', isPrivacyMode)} — Transaction Risk Investigation
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBriefModal}
            className="px-3.5 py-2 bg-[#002B49] hover:bg-[#003c66] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <FileDown className="w-4 h-4 text-[#FFC700]" />
            <span>Formal Investigation Brief</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE HERO WORKSPACE: 3-Column Split
          [LEFT: Customer Baseline] [CENTER: Score & Deviations] [RIGHT: AI Brief]
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* -------------------------------------------------------------
            LEFT COLUMN (3.5 cols): Customer Profile & Historical Baseline
           ------------------------------------------------------------- */}
        <div className="lg:col-span-3.5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-[#002B49] uppercase font-mono tracking-wider">
                  Accountholder Profile
                </h3>
                <div className="font-extrabold text-base text-[#1E1E1E]">
                  {maskCustomerName(customer?.name || 'Customer', isPrivacyMode)}
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0072CE] border border-blue-200 font-bold">
                {customer?.kycStatus || 'Verified'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-mono font-bold text-slate-800">{maskAccountNumber(customer?.accountNumber || '—', isPrivacyMode)} ({customer?.accountType || 'Account'})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Customer Since:</span>
                <span className="font-mono text-slate-800">{customer?.customerSince || '2020'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Branch Location:</span>
                <span className="text-slate-800 font-medium">{customer?.branch || 'Main Branch'}</span>
              </div>
            </div>

            {/* Behavioral Baseline Box */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#002B49] uppercase font-mono">
                  Historical Behavioral Baseline
                </span>
                <span className="text-[10px] text-slate-400 font-mono">90-Day Rolling</span>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-3 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Historical Mean:</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {maskAmount(baseline.meanAmount, isPrivacyMode)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Median Transaction:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {maskAmount(baseline.medianAmount, isPrivacyMode)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Normal Active Hours:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {baseline.activeHoursStart.toString().padStart(2, '0')}:00 – {baseline.activeHoursEnd.toString().padStart(2, '0')}:00
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Monthly Frequency:</span>
                  <span className="font-mono text-slate-700">
                    ~{baseline.monthlyFrequency} txns/mo
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Standard Deviation:</span>
                  <span className="font-mono text-slate-700">
                    ±{maskAmount(baseline.stdDev, isPrivacyMode)}
                  </span>
                </div>
              </div>
            </div>

            {/* Habitual Channels & Payees */}
            <div className="space-y-2 text-xs pt-1">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                  Established Payment Channels:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {baseline.commonChannels.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                  Top Historical Beneficiaries:
                </span>
                <div className="space-y-1">
                  {baseline.commonPayees.slice(0, 4).map((p, i) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            CENTER COLUMN (4.5 cols): Priority Score & Behavioral Deviation
           ------------------------------------------------------------- */}
        <div className="lg:col-span-4.5 space-y-4">
          {/* Priority Score Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Explainable Risk Metric
                </span>
                <h3 className="text-base font-extrabold text-[#002B49]">
                  Investigation Priority Score
                </h3>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black font-mono ${
                  isHighPriority ? 'text-red-600' :
                  isClean ? 'text-emerald-600' :
                  'text-amber-600'
                }`}>
                  {evaluation.priorityScore}<span className="text-xs text-slate-400">/100</span>
                </div>
                <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
                  {evaluation.priorityCategory}
                </div>
              </div>
            </div>

            {/* Score Contributors */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Deterministic Score Breakdown:
              </span>
              <div className="space-y-1.5">
                {evaluation.scoreContributors.length > 0 ? (
                  evaluation.scoreContributors.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 font-bold text-slate-700">
                          {c.ruleId}
                        </span>
                        <span className="font-medium text-slate-800">{c.label}</span>
                      </div>
                      <span className="font-mono font-bold text-[#0072CE]">
                        +{c.points}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>0 Rule points added. Account fully baseline compliant.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mathematical Deviation Visualizer */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Amount vs Customer Mean</span>
                {flaggedTransactions.length > 0 && !customer.baseline.regularLargePaymentPattern && (
                  <span className="text-red-600 font-bold font-mono text-[11px]">
                    +{Math.round(((flaggedTransactions[0].amount - baseline.meanAmount) / baseline.meanAmount) * 100)}% Deviation
                  </span>
                )}
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#002B49',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '11px',
                        border: 'none'
                      }}
                    />
                    <ReferenceLine y={baseline.meanAmount} stroke="#0072CE" strokeDasharray="3 3" />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            RIGHT COLUMN (4 cols): AI Investigation Assistant (Gemini)
           ------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-sm space-y-3.5 relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0072CE] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#0072CE]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#002B49] uppercase font-mono">
                    AI Investigation Brief
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Gemini 3.8 Flash Synthesis
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                VERIFIED EVIDENCE
              </span>
            </div>

            {/* AI Summary Text */}
            <div className="text-xs text-slate-800 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              {brief.summary}
            </div>

            {/* Strict Triad: OBSERVED vs INFERRED vs UNKNOWN */}
            <div className="space-y-2 pt-1">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Strict Evidence Categorization
              </div>

              {/* Observed */}
              <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                <span className="font-bold text-[#0072CE] text-[10px] font-mono uppercase block mb-1">
                  Observed Facts:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                  {brief.observed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Inferred */}
              <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100 text-xs">
                <span className="font-bold text-amber-800 text-[10px] font-mono uppercase block mb-1">
                  Inferred Patterns:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                  {brief.inferred.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Unknown */}
              <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200 text-xs">
                <span className="font-bold text-slate-600 text-[10px] font-mono uppercase block mb-1">
                  Unknown / Unverified Information:
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                  {brief.unknown.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verified Sources Cited */}
            {brief.sourcesCited.length > 0 && (
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                <span className="font-bold text-slate-700 block mb-1">
                  Local RAG Source Grounding:
                </span>
                <div className="space-y-1">
                  {brief.sourcesCited.map((src, i) => (
                    <div key={i} className="flex items-start gap-1 font-mono text-slate-600">
                      <span className="text-[#0072CE] font-bold">[{src.section}]</span>
                      <span className="truncate">{src.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM TABS: Deterministic Rules | Risk Clusters | Evidence | Decision
         ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto">
          {[
            { id: 'why_analysis', label: 'Why This Case? & Why Not Flagged?', icon: HelpCircle, count: null },
            { id: 'evidence_chain', label: 'Chronological Evidence Chain', icon: GitCommit, count: (evaluation.evidenceChain || []).length },
            { id: 'circadian', label: 'Circadian 24h Velocity', icon: Clock, count: null },
            { id: 'rules', label: 'Deterministic Rules (R01–R04)', icon: Cpu, count: evaluation.ruleFindings.filter(r => r.status === 'TRIGGERED').length },
            { id: 'clusters', label: 'Transaction Risk Clusters', icon: Layers, count: evaluation.clusters.length },
            { id: 'evidence', label: 'Verified Evidence Vault', icon: FileCheck2, count: flaggedTransactions.length },
            { id: 'decision', label: 'Investigator Review & Escalation', icon: UserCheck, count: null }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeBottomTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveBottomTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#0072CE] text-[#0072CE] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    tab.count > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Why This Case & Why Not Flagged */}
        {activeBottomTab === 'why_analysis' && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel A: Why This Case? */}
              <div className="rounded-xl p-5 border border-red-200 bg-red-50/20 space-y-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-extrabold text-red-950">
                        Why This Case Was Flagged
                      </h4>
                      <p className="text-xs text-red-700">
                        Deterministic mathematical derivation of risk priority & standard deviations
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black px-2 py-1 rounded bg-red-100 text-red-800 border border-red-200">
                    SCORE: {evaluation.priorityScore}/100
                  </span>
                </div>

                {evaluation.whyThisCase ? (
                  <div className="space-y-3 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-red-100">
                      <div className="font-bold text-slate-900 text-xs mb-1">
                        {evaluation.whyThisCase.headline}
                      </div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {evaluation.whyThisCase.mathematicalSummary}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1.5 font-mono uppercase text-[10px]">
                        Primary Contributing Risk Drivers:
                      </span>
                      <ul className="space-y-2">
                        {evaluation.whyThisCase.primaryDrivers.map((driver, i) => (
                          <li key={i} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 font-mono text-xs flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${driver.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                {driver.ruleId} — {driver.ruleName}
                              </span>
                              <span className="font-mono font-bold text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                                +{driver.pointsContributed} pts
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-mono leading-relaxed pl-3.5">
                              {driver.mathBreakdown}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {evaluation.whyThisCase.burstVelocitySummary && (
                      <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-[11px]">
                        <strong>Velocity Flag:</strong> {evaluation.whyThisCase.burstVelocitySummary}
                      </div>
                    )}

                    <div className="pt-2 border-t border-red-100 flex items-center justify-between font-mono text-[11px] text-slate-600">
                      <span>Max Deviation: <strong className="text-red-700">+{evaluation.whyThisCase.zScoreMagnitude}σ</strong></span>
                      <span>Category: <strong className="text-red-700">{evaluation.priorityCategory}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg text-slate-500 text-xs">
                    Analysis not available for this case.
                  </div>
                )}
              </div>

              {/* Panel B: Why Not Flagged / Risk Mitigations */}
              <div className="rounded-xl p-5 border border-emerald-200 bg-emerald-50/20 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-950">
                        Why Not Flagged / Mitigating Context
                      </h4>
                      <p className="text-xs text-emerald-700">
                        Historical habits, recurring vendor verification, and suppression logic
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-1 rounded border ${
                    evaluation.whyNotFlagged?.isExemptedOrDowngraded
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {evaluation.whyNotFlagged?.isExemptedOrDowngraded ? 'ATTENUATED' : 'STANDARD EVALUATION'}
                  </span>
                </div>

                {evaluation.whyNotFlagged ? (
                  <div className="space-y-3 text-xs">
                    {evaluation.whyNotFlagged.mitigatingFactors.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700 block mb-1.5 font-mono uppercase text-[10px]">
                          Verified Mitigating Indicators:
                        </span>
                        <ul className="space-y-1.5">
                          {evaluation.whyNotFlagged.mitigatingFactors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200 text-slate-800 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evaluation.whyNotFlagged.safePatternsIdentified.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700 block mb-1.5 font-mono uppercase text-[10px]">
                          Historical Safe Patterns Grounding:
                        </span>
                        <ul className="space-y-1.5">
                          {evaluation.whyNotFlagged.safePatternsIdentified.map((pattern, i) => (
                            <li key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                              <span>{pattern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evaluation.whyNotFlagged.clearedRules.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-700 block mb-1.5 font-mono uppercase text-[10px]">
                          Cleared Rules Evaluation:
                        </span>
                        <div className="space-y-1">
                          {evaluation.whyNotFlagged.clearedRules.map((cr, i) => (
                            <div key={i} className="bg-white p-2 rounded border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-800">{cr.ruleId}: {cr.ruleName}</span>
                              <span className="text-emerald-700 font-medium">{cr.thresholdRequired}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg text-slate-500 text-xs">
                    No mitigating factors recorded.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Chronological Evidence Chain */}
        {activeBottomTab === 'evidence_chain' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#002B49]">
                  Ordered Chronological Evidence Chain
                </h4>
                <p className="text-xs text-slate-500">
                  Step-by-step verified facts rated by evidentiary strength with mathematical deviations and source audit trails
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {(evaluation.evidenceChain || []).length} EVIDENCE POINTS
              </span>
            </div>

            {(evaluation.evidenceChain || []).length > 0 ? (
              <div className="space-y-3">
                {evaluation.evidenceChain.map((ev, index) => {
                  const strengthBadge =
                    ev.strength === 'FACTUAL_DIRECT'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : ev.strength === 'STATISTICAL_DEVIATION'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : ev.strength === 'BEHAVIORAL_DRIFT'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300';

                  return (
                    <div
                      key={ev.id || index}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0072CE] transition-all flex flex-col md:flex-row md:items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                          {index + 1}.
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {ev.title}
                            </span>
                            <span className={`text-[9px] font-bold font-mono px-2 py-0.2 rounded-full border ${strengthBadge}`}>
                              {ev.strength.replace('_', ' ')} ({ev.strengthScore}/100)
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {ev.category}
                            </span>
                          </div>

                          <div className="text-xs text-slate-800 font-medium">
                            <strong className="text-slate-500 mr-1">Observed:</strong>
                            {ev.observedValue}
                          </div>

                          <div className="text-[11px] text-slate-600">
                            <strong className="text-slate-500 mr-1">Baseline Standard:</strong>
                            {ev.expectedBaseline}
                          </div>

                          <div className="text-[10px] text-slate-400 font-mono">
                            Verification Source: <span className="text-slate-600 font-bold">{ev.verificationSource}</span>
                          </div>
                        </div>
                      </div>

                      {ev.deviationMultiplier && (
                        <div className="text-right shrink-0">
                          <span className="font-mono font-black text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded">
                            {ev.deviationMultiplier}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No chronological evidence records found for this account.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Circadian 24h Velocity */}
        {activeBottomTab === 'circadian' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#002B49]">
                  Circadian 24-Hour Velocity Analysis
                </h4>
                <p className="text-xs text-slate-500">
                  Hourly transaction distribution across 24 hours. Compares 90-day baseline habits vs flagged nocturnal spikes.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0072CE]" />
                  Baseline Volume
                </span>
                <span className="flex items-center gap-1 text-red-600 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Flagged Events
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={circadianChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#002B49',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="baselineVolume" fill="#0072CE" name="Baseline Volume" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="flaggedEvents" fill="#DC2626" name="Flagged Events" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <strong>Customer Normal Active Window:</strong> {baseline.activeHoursStart}:00 to {baseline.activeHoursEnd}:00.
                <span className="text-slate-400 ml-2">Transactions occurring outside this window receive elevated circadian anomaly scores.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 1: Deterministic Rules */}
        {activeBottomTab === 'rules' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#002B49]">
                  Deterministic Risk Engine Evaluation
                </h4>
                <p className="text-xs text-slate-500">
                  Calculated purely via rule logic without LLM generation. Grounded strictly in customer transaction history.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold">
                AUDITABLE RULES ENGINE ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluation.ruleFindings.map(finding => {
                const isTriggered = finding.status === 'TRIGGERED';
                const isInsufficient = finding.status === 'INSUFFICIENT_DATA';
                return (
                  <div
                    key={finding.ruleId}
                    className={`rounded-xl p-4 border transition-all ${
                      isTriggered
                        ? 'bg-red-50/40 border-red-200'
                        : isInsufficient
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                          {finding.ruleId}
                        </span>
                        <h5 className="font-bold text-xs text-[#002B49]">
                          {finding.ruleName}
                        </h5>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isTriggered
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : isInsufficient
                          ? 'bg-slate-100 text-slate-600 border-slate-300'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}>
                        {finding.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                      {finding.reason}
                    </p>

                    {/* Evidence Points */}
                    {finding.evidence.length > 0 && (
                      <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200 space-y-1.5 text-xs">
                        {finding.evidence.map((ev, i) => (
                          <div key={i} className="flex items-start justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">{ev.label}:</span>
                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-800">{ev.value}</span>
                              {ev.comparison && (
                                <div className="text-[10px] text-slate-400">{ev.comparison}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Risk Clusters */}
        {activeBottomTab === 'clusters' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#002B49]">
                  Transaction Relationship & Burst Clusters
                </h4>
                <p className="text-xs text-slate-500">
                  Transactions grouped algorithmically based on shared recipient, temporal proximity, and structured velocity.
                </p>
              </div>
            </div>

            {evaluation.clusters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluation.clusters.map(cluster => (
                  <div key={cluster.id} className="bg-amber-50/40 rounded-xl p-4 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#002B49] text-white px-2 py-0.5 rounded">
                          {cluster.id}
                        </span>
                        <h5 className="font-bold text-xs text-[#002B49]">{cluster.title}</h5>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-red-600">
                        Total: ₹{cluster.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">{cluster.description}</p>

                    <div className="bg-white rounded-lg p-3 border border-amber-200 text-xs space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Time Window:</span>
                        <span className="font-mono font-bold text-slate-800">{cluster.timeSpan}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Beneficiary:</span>
                        <span className="font-bold text-red-700">{cluster.commonPayee}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Channel Used:</span>
                        <span className="font-mono text-slate-800">{cluster.commonChannel}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400">Transactions:</span>
                        {cluster.transactionIds.map(id => (
                          <span key={id} className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No concentrated transaction clusters detected for this customer.
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Evidence Vault */}
        {activeBottomTab === 'evidence' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#002B49]">
                  Evidence Itemization & Audit Trace
                </h4>
                <p className="text-xs text-slate-500">
                  Every claim is directly tied to an immutable transaction record or verified historical baseline.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Txn ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Payee / Beneficiary</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Historical Mean</th>
                    <th className="py-2.5 px-3">Deviation</th>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3 text-right">Inspection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {flaggedTransactions.map(t => {
                    const devPct = Math.round(((t.amount - baseline.meanAmount) / baseline.meanAmount) * 100);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{t.id}</td>
                        <td className="py-2.5 px-3 font-mono">{t.date} {t.time}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900">{t.payee}</span>
                          <span className="ml-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                            {t.payeeStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          ₹{t.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          ₹{baseline.meanAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-red-600">
                          +{devPct}%
                        </td>
                        <td className="py-2.5 px-3 font-mono">{t.channel}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => onSelectTransaction(t)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#0072CE] hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 4: Investigator Decision & Escalation */}
        {activeBottomTab === 'decision' && (
          <div className="p-5 space-y-4 max-w-3xl">
            <div>
              <h4 className="text-sm font-bold text-[#002B49]">
                Human Investigator Decision & Outcome
              </h4>
              <p className="text-xs text-slate-500">
                Mandatory human-in-the-loop review. In accordance with banking risk directives, the system does not declare fraud autonomously.
              </p>
            </div>

            {decisionSavedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Investigator decision recorded successfully in audit log.</span>
              </div>
            )}

            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select Investigation Outcome:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'REVIEWED_NO_ACTION',
                      label: 'Reviewed — No Further Action',
                      desc: 'Legitimate context verified. No ongoing risk.'
                    },
                    {
                      id: 'ESCALATED',
                      label: 'Escalated for Investigation',
                      desc: 'Escalate case to Cyber Fraud Liaison Unit (Tier-2).'
                    },
                    {
                      id: 'INFO_REQUESTED',
                      label: 'Additional Information Required',
                      desc: 'Request ID documents or accountholder outreach.'
                    },
                    {
                      id: 'MONITORING',
                      label: 'Monitoring Recommended',
                      desc: 'Place on active 14-day enhanced surveillance.'
                    }
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs cursor-pointer flex flex-col justify-between transition-all ${
                        selectedDecision === opt.id
                          ? 'bg-blue-50/80 border-[#0072CE] ring-1 ring-[#0072CE]'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-[#002B49]">
                        <input
                          type="radio"
                          name="decision"
                          value={opt.id}
                          checked={selectedDecision === opt.id}
                          onChange={() => setSelectedDecision(opt.id as DecisionStatus)}
                          className="text-[#0072CE]"
                        />
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 pl-5">
                        {opt.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Investigator Audit Notes:
                </label>
                <textarea
                  rows={3}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Record verification details, telephone outreach attempt, device logs, or justification..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Investigator: S. Nambiar (Risk Officer #8092)
                </span>
                <button
                  type="submit"
                  disabled={selectedDecision === 'PENDING'}
                  className="px-4 py-2 bg-[#0072CE] hover:bg-[#005bb5] disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Commit Official Decision</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
