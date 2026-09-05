import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CreditCard,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  X,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CustomerProfile, RiskLevel, Transaction } from '../types';

interface TransactionExplorerViewProps {
  customer: CustomerProfile;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  onSelectTransaction: (txn: Transaction | null) => void;
}

export const TransactionExplorerView: React.FC<TransactionExplorerViewProps> = ({
  customer,
  transactions,
  selectedTransaction,
  onSelectTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [newPayeeOnly, setNewPayeeOnly] = useState<boolean>(false);
  const [oddHoursOnly, setOddHoursOnly] = useState<boolean>(false);

  const baseline = customer.baseline;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesPayee = t.payee.toLowerCase().includes(query);
        const matchesDesc = t.description.toLowerCase().includes(query);
        if (!matchesId && !matchesPayee && !matchesDesc) return false;
      }

      // Channel
      if (channelFilter !== 'ALL' && t.channel !== channelFilter) return false;

      // Risk
      if (riskFilter !== 'ALL' && t.riskLevel !== riskFilter) return false;

      // New Payee
      if (newPayeeOnly && t.payeeStatus !== 'New') return false;

      // Odd Hours
      if (oddHoursOnly) {
        const hour = parseInt(t.time.split(':')[0], 10);
        const isOdd = hour < baseline.activeHoursStart || hour > baseline.activeHoursEnd;
        if (!isOdd) return false;
      }

      return true;
    });
  }, [transactions, searchTerm, channelFilter, riskFilter, newPayeeOnly, oddHoursOnly, baseline]);

  return (
    <div className="space-y-4 pb-16 relative">
      {/* Header & Filter Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-[#002B49]">
              Transaction Explorer & Audit Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Complete transaction log for {customer?.name || 'Accountholder'} ({transactions.length} total records evaluated)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Showing {filteredTransactions.length} of {transactions.length} records
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Transaction ID, Payee, or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
            />
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
            >
              <option value="ALL">All Channels</option>
              <option value="UPI">UPI</option>
              <option value="NEFT">NEFT</option>
              <option value="IMPS">IMPS</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>

          {/* Checkbox Toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={newPayeeOnly}
                onChange={(e) => setNewPayeeOnly(e.target.checked)}
                className="rounded text-[#0072CE]"
              />
              <span>New Payee</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={oddHoursOnly}
                onChange={(e) => setOddHoursOnly(e.target.checked)}
                className="rounded text-[#0072CE]"
              />
              <span>Odd Hours</span>
            </label>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Payee</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Payee Status</th>
                <th className="py-3 px-4">Triggered Rules</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.slice(0, 50).map((txn) => {
                const isSelected = selectedTransaction?.id === txn.id;
                const isHigh = txn.riskLevel === 'HIGH';
                const isOdd = parseInt(txn.time.split(':')[0], 10) < baseline.activeHoursStart || parseInt(txn.time.split(':')[0], 10) > baseline.activeHoursEnd;

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : isHigh ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {txn.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-900">{txn.date}</div>
                      <div className={`text-[11px] font-mono ${isOdd ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                        {txn.time} {isOdd && '• Nocturnal'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#002B49]">{txn.payee}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{txn.description}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {txn.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {txn.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        txn.payeeStatus === 'New'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {txn.payeeStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {txn.triggeredRules && txn.triggeredRules.length > 0 ? (
                        <div className="flex gap-1">
                          {txn.triggeredRules.map(r => (
                            <span key={r} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(txn);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#0072CE] hover:text-white border border-slate-200 rounded text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          SLIDING SIDE DRAWER: Transaction Detail & Evidence Inspector
         ========================================================================= */}
      {selectedTransaction && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-slate-200 bg-[#002B49] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FFC700]" />
              <h3 className="font-bold text-sm">Transaction Evidence Detail</h3>
            </div>
            <button
              onClick={() => onSelectTransaction(null)}
              className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {/* Top Stat */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-slate-500">{selectedTransaction.id}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  selectedTransaction.payeeStatus === 'New' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedTransaction.payeeStatus} Payee
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₹{selectedTransaction.amount.toLocaleString('en-IN')}
              </div>
              <div className="text-slate-600 font-medium">
                {selectedTransaction.description}
              </div>
            </div>

            {/* Core Fields */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient / Payee:</span>
                <span className="font-bold text-[#002B49]">{selectedTransaction.payee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Timestamp:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTransaction.date} at {selectedTransaction.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-mono text-slate-800">{selectedTransaction.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Type:</span>
                <span className="text-slate-800">{selectedTransaction.accountType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reported Geo Location:</span>
                <span className="text-slate-800">{selectedTransaction.location}</span>
              </div>
            </div>

            {/* Baseline Comparison Box */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 uppercase font-mono text-[10px]">
                Customer Baseline Comparison
              </span>
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Customer Normal Average:</span>
                  <span className="font-mono font-bold text-slate-900">₹{baseline.meanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Calculated Deviation:</span>
                  <span className="font-mono font-bold text-red-600">
                    +{Math.round(((selectedTransaction.amount - baseline.meanAmount) / baseline.meanAmount) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Customer Active Schedule:</span>
                  <span className="font-mono text-slate-800">{baseline.activeHoursStart}:00 – {baseline.activeHoursEnd}:00</span>
                </div>
              </div>
            </div>

            {/* Triggered Rules on This Txn */}
            {selectedTransaction.triggeredRules && selectedTransaction.triggeredRules.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-red-700 uppercase font-mono text-[10px] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Associated Deterministic Rule Flags
                </span>
                <div className="space-y-1.5">
                  {selectedTransaction.triggeredRules.map(r => (
                    <div key={r} className="p-2 rounded bg-red-50 border border-red-200 text-[11px]">
                      <span className="font-mono font-bold text-red-800">{r} Flagged</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
            <button
              onClick={() => onSelectTransaction(null)}
              className="px-4 py-2 bg-[#002B49] text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
