import React, { useState, useMemo } from 'react';
import {
  Users,
  Activity,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  Filter,
  Grid,
  List,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DecisionStatus, InvestigationCase } from '../types';
import { maskAmount, maskCustomerName } from '../utils/privacy';

interface DashboardViewProps {
  investigations: InvestigationCase[];
  onSelectCustomer: (customerId: string) => void;
  onNavigateToInvestigation: (customerId: string) => void;
  onOpenUpload: () => void;
  isPrivacyMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  investigations,
  onSelectCustomer,
  onNavigateToInvestigation,
  onOpenUpload,
  isPrivacyMode = false
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [queueSearch, setQueueSearch] = useState<string>('');
  const [heatmapMetric, setHeatmapMetric] = useState<'exposure' | 'sla'>('exposure');

  const timelineData = [
    { time: '08:00', totalVolume: 1420, flaggedEvents: 0 },
    { time: '10:00', totalVolume: 3850, flaggedEvents: 1 },
    { time: '12:00', totalVolume: 5600, flaggedEvents: 0 },
    { time: '14:00', totalVolume: 6100, flaggedEvents: 2 },
    { time: '16:00', totalVolume: 5400, flaggedEvents: 0 },
    { time: '18:00', totalVolume: 4800, flaggedEvents: 1 },
    { time: '20:00', totalVolume: 3900, flaggedEvents: 0 },
    { time: '22:00', totalVolume: 2100, flaggedEvents: 1 },
    { time: '00:00', totalVolume: 840, flaggedEvents: 2 },
    { time: '02:00', totalVolume: 320, flaggedEvents: 6 },
    { time: '04:00', totalVolume: 180, flaggedEvents: 3 },
    { time: '06:00', totalVolume: 640, flaggedEvents: 0 }
  ];

  const donutData = [
    { name: 'Normal', value: 46250, color: '#0072CE' },
    { name: 'Low Attention', value: 1420, color: '#00A3E0' },
    { name: 'Medium Attention', value: 642, color: '#FFC700' },
    { name: 'High Attention', value: 80, color: '#DC2626' }
  ];

  // SLA and queue metrics
  const criticalSlaCount = investigations.filter(inv => inv.slaStatus === 'CRITICAL' || (inv.slaMinutesRemaining && inv.slaMinutesRemaining < 30)).length;
  const pendingCount = investigations.filter(inv => inv.status === 'PENDING').length;

  const kpis = [
    {
      title: 'Customers Reviewed',
      value: '1,248',
      change: '+14 today',
      icon: Users,
      color: 'text-[#0072CE]',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      title: 'Transactions Analysed',
      value: '48,392',
      change: '+3,820 in queue',
      icon: Activity,
      color: 'text-[#00A3E0]',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200'
    },
    {
      title: 'Pending Triage',
      value: `${pendingCount} Cases`,
      change: 'Active in queue',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    {
      title: 'Critical SLA Watch',
      value: `${criticalSlaCount} Imminent`,
      change: '< 30m response target',
      icon: Flame,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  ];

  const demoScenarios = [
    {
      id: 'CUS-10482',
      name: 'Arun Kumar',
      badge: 'HIGH PRIORITY',
      badgeColor: 'bg-red-100 text-red-700 border-red-300',
      title: 'Rapid Outbound Burst to New Payee',
      desc: '3 nocturnal transfers totalling ₹1,10,000 to unverified recipient XYZ Services Ltd between 02:41 AM and 03:02 AM. Triggers R01, R02, R03, R04.',
      sla: '18m SLA (Critical)'
    },
    {
      id: 'CUS-20831',
      name: 'Priya Sharma',
      badge: 'AMBIGUOUS / LEGITIMATE',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      title: 'Large ₹1,00,000 Transfer with Recurring History',
      desc: 'Transfer triggers mathematical threshold, but historical verification reveals consistent 1st-of-month supplier settlements. Priority attenuated.',
      sla: '185m SLA (Healthy)'
    },
    {
      id: 'CUS-30914',
      name: 'Vikram Rao',
      badge: 'CLEAN BASELINE',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      title: 'Normal Account Behaviour (Zero Flags)',
      desc: 'Routine daily salary/grocery transactions strictly adhering to 90-day baseline. Demonstrates the engine correctly clears ordinary accounts.',
      sla: 'Auto-Cleared'
    },
    {
      id: 'CUS-41920',
      name: 'Meera Patel',
      badge: 'INSUFFICIENT DATA',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      title: 'Sparse Baseline / New Onboarding Account',
      desc: 'Only 3 transactions on record. System correctly refuses to hallucinate statistical variance and requests secondary bank statements.',
      sla: '210m SLA'
    }
  ];

  // Filtered investigations queue
  const filteredInvestigations = useMemo(() => {
    return investigations.filter(inv => {
      const matchFilter = selectedStatusFilter === 'ALL' || inv.status === selectedStatusFilter;
      const matchSearch = queueSearch.trim() === '' ||
        inv.customerName.toLowerCase().includes(queueSearch.toLowerCase()) ||
        inv.customerId.toLowerCase().includes(queueSearch.toLowerCase()) ||
        inv.id.toLowerCase().includes(queueSearch.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [investigations, selectedStatusFilter, queueSearch]);

  // Heatmap Matrix Generation: Priority (High, Medium, Low) vs Exposure / SLA
  const heatmapBuckets = useMemo(() => {
    const matrix = {
      HIGH: { lowExposure: [] as InvestigationCase[], medExposure: [] as InvestigationCase[], highExposure: [] as InvestigationCase[] },
      MEDIUM: { lowExposure: [] as InvestigationCase[], medExposure: [] as InvestigationCase[], highExposure: [] as InvestigationCase[] },
      LOW_OR_CLEAN: { lowExposure: [] as InvestigationCase[], medExposure: [] as InvestigationCase[], highExposure: [] as InvestigationCase[] }
    };

    investigations.forEach(inv => {
      const p = inv.priority === 'HIGH' ? 'HIGH' : inv.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW_OR_CLEAN';
      const amt = inv.totalFlaggedAmount;
      if (amt < 10000) {
        matrix[p].lowExposure.push(inv);
      } else if (amt <= 100000) {
        matrix[p].medExposure.push(inv);
      } else {
        matrix[p].highExposure.push(inv);
      }
    });

    return matrix;
  }, [investigations]);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#003860] to-[#0072CE] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#FFC700] text-[#002B49] text-[10px] font-bold font-mono uppercase tracking-wider">
                TRACK PS6 • BANKING
              </span>
              <span className="text-xs text-slate-200 font-mono">
                INVESTIGATION CONSOLE ONLINE
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Evidence-Driven Transaction Risk Investigation
            </h1>
            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
              &ldquo;Don&apos;t decide fraud. Build the investigation case.&rdquo; Distinguish observed evidence, deterministic rule triggers (R01–R04), behavioural deviations, and AI-assisted investigation briefs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToInvestigation('CUS-10482')}
              className="px-4 py-2.5 bg-[#FFC700] hover:bg-[#ffcf22] text-[#002B49] rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <span>Launch High-Risk Demo Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              Upload CSV
            </button>
          </div>
        </div>

        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 border ${kpi.border} shadow-xs flex items-center justify-between transition-transform hover:-translate-y-0.5`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">
                  {kpi.title}
                </span>
                <span className="text-2xl font-black text-[#1E1E1E] tracking-tight block">
                  {kpi.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400 font-mono block">
                  {kpi.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Case Priority Heatmap Matrix */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#0072CE]" />
              <h2 className="text-sm font-bold text-[#002B49] uppercase tracking-wider font-mono">
                Case Priority Heatmap Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Two-dimensional risk triage: Severity Score vs. Flagged Exposure Amount &amp; SLA Pressure
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Triage Metric:</span>
            <button
              onClick={() => setHeatmapMetric('exposure')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer border ${
                heatmapMetric === 'exposure' ? 'bg-[#002B49] text-white border-[#002B49]' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Exposure (₹)
            </button>
            <button
              onClick={() => setHeatmapMetric('sla')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold cursor-pointer border ${
                heatmapMetric === 'sla' ? 'bg-[#002B49] text-white border-[#002B49]' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              SLA Urgency
            </button>
          </div>
        </div>

        {/* 2D Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3 w-36 bg-slate-50">Priority Tier</th>
                <th className="py-2.5 px-3 bg-slate-50/50">Low Exposure (&lt; ₹10k)</th>
                <th className="py-2.5 px-3 bg-slate-50/50">Moderate Exposure (₹10k – ₹1,00k)</th>
                <th className="py-2.5 px-3 bg-slate-50/50">High Exposure (&gt; ₹1,00k)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* High Priority Row */}
              <tr className="hover:bg-red-50/20 transition-colors">
                <td className="py-3 px-3 font-bold text-red-700 bg-red-50/40 border-r border-slate-100 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span>CRITICAL / HIGH</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Score &gt; 70</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 text-[11px] italic font-mono">—</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 text-[11px] italic font-mono">—</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-2">
                    {heatmapBuckets.HIGH.highExposure.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onNavigateToInvestigation(c.customerId)}
                        className="p-2.5 rounded-lg bg-red-50 border border-red-300 hover:border-red-500 hover:shadow-xs cursor-pointer transition-all max-w-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-red-900 text-xs">
                            {maskCustomerName(c.customerName, isPrivacyMode)}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-200 text-red-900">
                            {c.priorityScore}/100
                          </span>
                        </div>
                        <div className="text-[11px] text-red-700 font-mono">
                          {maskAmount(c.totalFlaggedAmount, isPrivacyMode)} • {c.triggeredRuleCount} Rules
                        </div>
                        {c.slaMinutesRemaining && (
                          <div className="text-[10px] font-mono text-red-600 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>SLA: {c.slaMinutesRemaining}m remaining</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Medium / Ambiguous Row */}
              <tr className="hover:bg-amber-50/20 transition-colors">
                <td className="py-3 px-3 font-bold text-amber-700 bg-amber-50/40 border-r border-slate-100 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>MEDIUM / TRIAGE</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Score 41 – 70</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 text-[11px] italic font-mono">—</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 text-[11px] italic font-mono">—</span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-slate-300 text-[11px] italic font-mono">—</span>
                </td>
              </tr>

              {/* Low Attention / Cleared Row */}
              <tr className="hover:bg-blue-50/20 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50 border-r border-slate-100 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0072CE]" />
                    <span>LOW / BENIGN</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Score &le; 40</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-2">
                    {heatmapBuckets.LOW_OR_CLEAN.lowExposure.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onNavigateToInvestigation(c.customerId)}
                        className="p-2 rounded-lg bg-blue-50/70 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all text-xs"
                      >
                        <div className="font-bold text-slate-800">
                          {maskCustomerName(c.customerName, isPrivacyMode)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {maskAmount(c.totalFlaggedAmount, isPrivacyMode)} • {c.priorityScore}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-2">
                    {heatmapBuckets.LOW_OR_CLEAN.medExposure.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onNavigateToInvestigation(c.customerId)}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#0072CE] cursor-pointer transition-all text-xs"
                      >
                        <div className="font-bold text-slate-800">
                          {maskCustomerName(c.customerName, isPrivacyMode)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {maskAmount(c.totalFlaggedAmount, isPrivacyMode)}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-2">
                    {heatmapBuckets.LOW_OR_CLEAN.highExposure.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onNavigateToInvestigation(c.customerId)}
                        className="p-2 rounded-lg bg-amber-50/60 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800">
                            {maskCustomerName(c.customerName, isPrivacyMode)}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-100 text-amber-800">
                            Recurring Vendor
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600">
                          {maskAmount(c.totalFlaggedAmount, isPrivacyMode)} • {c.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Scenario Test Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0072CE]" />
            <h2 className="text-sm font-bold text-[#002B49] uppercase tracking-wider font-mono">
              Judges &amp; Investigator Demo Scenarios
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Click any case to inspect live behavioral baselines &amp; deterministic findings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {demoScenarios.map(sc => (
            <div
              key={sc.id}
              onClick={() => onNavigateToInvestigation(sc.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#0072CE] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {sc.id}
                  </span>
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#002B49] group-hover:text-[#0072CE] transition-colors">
                  {maskCustomerName(sc.name, isPrivacyMode)}
                </h3>
                <div className="text-xs font-semibold text-slate-700">
                  {sc.title}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {sc.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0072CE] group-hover:translate-x-0.5 transition-transform">
                <span className="font-mono text-[10px] text-slate-400">{sc.sla}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Visual Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#002B49]">
                Real-Time Risk Activity Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Transaction volume vs flagged nocturnal events across rolling 24-hour cycle
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0072CE]" />
                Volume
              </span>
              <span className="flex items-center gap-1 text-red-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                Attention Required (02:00 - 04:00 AM)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0072CE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0072CE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#002B49',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalVolume"
                  stroke="#0072CE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#volumeGrad)"
                  name="Volume"
                />
                <Area
                  type="monotone"
                  dataKey="flaggedEvents"
                  stroke="#DC2626"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#flagGrad)"
                  name="Flagged Events"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#002B49]">
              Transaction Risk Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Categorization across 48,392 analysed records
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#002B49',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {donutData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 text-[11px] truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto text-[11px]">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Investigations Queue with SLA & Lifecycle Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#002B49]">
              Investigation Triage &amp; Lifecycle Queue
            </h3>
            <p className="text-xs text-slate-500">
              Prioritized case records with triggered deterministic rules, SLA timers, and investigator decisions
            </p>
          </div>

          {/* Quick Search in Queue */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter queue by name/ID..."
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0072CE] w-48 font-sans"
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#0072CE] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 whitespace-nowrap">
              {filteredInvestigations.length} CASES
            </span>
          </div>
        </div>

        {/* Status Lifecycle Filter Tabs */}
        <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Lifecycle State:
          </span>
          {[
            { key: 'ALL', label: 'All Cases' },
            { key: 'PENDING', label: 'Pending Review' },
            { key: 'ACTIVE_INVESTIGATION', label: 'Active Investigation' },
            { key: 'ESCALATED', label: 'Escalated' },
            { key: 'INFO_REQUESTED', label: 'Info Requested' },
            { key: 'REVIEWED_NO_ACTION', label: 'Closed / Benign' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusFilter(tab.key)}
              className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                selectedStatusFilter === tab.key
                  ? 'bg-[#002B49] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider font-mono">
                <th className="py-3 px-4">Investigation ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Triggered Rules</th>
                <th className="py-3 px-4">Flagged Amount</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4">Lifecycle State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvestigations.map((inv) => {
                const isHigh = inv.priority === 'HIGH';
                const isCriticalSla = inv.slaStatus === 'CRITICAL' || (inv.slaMinutesRemaining && inv.slaMinutesRemaining < 30);
                const isWarningSla = inv.slaStatus === 'WARNING' || (inv.slaMinutesRemaining && inv.slaMinutesRemaining < 60 && !isCriticalSla);

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#002B49]">
                        {maskCustomerName(inv.customerName, isPrivacyMode)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{inv.customerId} • {inv.accountNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      {isHigh ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">
                          <AlertTriangle className="w-3 h-3" /> Attention Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Low Attention
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {inv.triggeredRuleCount > 0 ? `${inv.triggeredRuleCount} Rules Triggered` : 'Baseline Compliant'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {maskAmount(inv.totalFlaggedAmount, isPrivacyMode)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isHigh ? 'bg-red-500' : 'bg-[#0072CE]'}`}
                            style={{ width: `${inv.priorityScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold">{inv.priorityScore}/100</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {inv.slaMinutesRemaining !== undefined ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          isCriticalSla
                            ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                            : isWarningSla
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{inv.slaMinutesRemaining}m remaining</span>
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400">Compliant</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onNavigateToInvestigation(inv.customerId)}
                        className="px-3 py-1.5 bg-[#0072CE] hover:bg-[#005bb5] text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Inspect Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

