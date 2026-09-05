import React from 'react';
import {
  Users,
  CreditCard,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { CustomerProfile, Transaction } from '../types';

interface CustomerBaselineViewProps {
  customer: CustomerProfile;
  allCustomers: CustomerProfile[];
  onSelectCustomer: (id: string) => void;
  onNavigateToInvestigation: (id: string) => void;
  historyTransactions: Transaction[];
}

export const CustomerBaselineView: React.FC<CustomerBaselineViewProps> = ({
  customer,
  allCustomers = [],
  onSelectCustomer,
  onNavigateToInvestigation,
  historyTransactions
}) => {
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
    hasSufficientData: false
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-[#002B49]">
            Customer Behavioral Baseline Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Compare customer activities against their individual historical norms (not solely global thresholds).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToInvestigation(customer.id)}
            className="px-3.5 py-2 bg-[#0072CE] hover:bg-[#005bb5] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Investigation Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customer Quick Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {allCustomers.map(c => {
          const isSelected = c.id === customer.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCustomer(c.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#002B49] text-white border-[#002B49] shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-[#FFC700]' : 'text-slate-400'}`}>
                  {c.id}
                </span>
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#00A3E0]' : 'bg-slate-300'}`} />
              </div>
              <div className="font-bold text-xs truncate">{c.name}</div>
              <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {c.branch}
              </div>
            </button>
          );
        })}
      </div>

      {/* Core Baseline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase font-mono text-[#002B49]">
              Account Credentials
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              KYC VERIFIED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Customer Name:</span>
              <span className="font-bold text-slate-800">{customer?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Customer ID:</span>
              <span className="font-mono font-bold text-slate-800">{customer?.id || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Account Number:</span>
              <span className="font-mono text-slate-800">{customer?.accountNumber || '—'} ({customer?.accountType || 'Account'})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Accountholder Since:</span>
              <span className="font-mono text-slate-800">{customer?.customerSince || '2020'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Home Branch:</span>
              <span className="text-slate-800">{customer?.branch || 'Main Branch'}</span>
            </div>
          </div>
        </div>

        {/* Statistical Baseline Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs uppercase font-mono text-[#002B49]">
              Statistical Baseline Metrics
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Calculated from historical ledger</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Mean Amount:</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">
                ₹{baseline.meanAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Median Amount:</span>
              <span className="text-base font-bold text-slate-700 font-mono">
                ₹{baseline.medianAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Std. Deviation:</span>
              <span className="text-base font-bold text-slate-700 font-mono">
                ±₹{baseline.stdDev.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
              <span className="text-slate-500 text-[11px] block">Monthly Velocity:</span>
              <span className="text-base font-bold text-slate-700 font-mono">
                ~{baseline.monthlyFrequency} txns
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 text-[11px] text-slate-700">
            <span className="font-bold text-[#0072CE] block mb-0.5">Active Operating Window:</span>
            <span>{baseline.activeHoursStart.toString().padStart(2, '0')}:00 to {baseline.activeHoursEnd.toString().padStart(2, '0')}:00 (Compliant daytime & evening hours)</span>
          </div>
        </div>

        {/* Habitual Ecosystem Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs uppercase font-mono text-[#002B49]">
              Habitual Beneficiaries & Channels
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Established behavioral vectors</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 text-[10px] uppercase font-mono block mb-1">
                Frequent Payment Channels:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {baseline.commonChannels.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 text-[10px] uppercase font-mono block mb-1">
                Top Historical Payees:
              </span>
              <div className="space-y-1">
                {baseline.commonPayees.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-1.5 rounded bg-slate-50 text-[11px] text-slate-700 border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="truncate">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Transaction Sample Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#002B49] uppercase font-mono">
              Historical Ledger Reference ({historyTransactions.length} sample entries)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Immutable Historical Data
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
              <tr>
                <th className="p-2.5">Txn ID</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Payee</th>
                <th className="p-2.5">Amount</th>
                <th className="p-2.5">Channel</th>
                <th className="p-2.5">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
              {historyTransactions.slice(0, 20).map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono font-semibold">{t.id}</td>
                  <td className="p-2.5 font-mono">{t.date}</td>
                  <td className="p-2.5 font-mono">{t.time}</td>
                  <td className="p-2.5 font-medium">{t.payee}</td>
                  <td className="p-2.5 font-mono font-bold">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="p-2.5 font-mono">{t.channel}</td>
                  <td className="p-2.5">{t.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
