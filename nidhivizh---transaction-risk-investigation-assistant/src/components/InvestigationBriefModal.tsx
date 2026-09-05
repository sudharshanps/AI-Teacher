import React from 'react';
import {
  X,
  Printer,
  Download,
  Shield,
  FileCheck,
  AlertTriangle,
  Sparkles,
  Clock,
  UserCheck
} from 'lucide-react';
import {
  AIInvestigationBrief,
  CustomerProfile,
  RiskEvaluation,
  Transaction
} from '../types';

interface InvestigationBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerProfile;
  evaluation: RiskEvaluation;
  flaggedTransactions: Transaction[];
  brief: AIInvestigationBrief;
}

export const InvestigationBriefModal: React.FC<InvestigationBriefModalProps> = ({
  isOpen,
  onClose,
  customer,
  evaluation,
  flaggedTransactions,
  brief
}) => {
  if (!isOpen) return null;

  const baseline = customer.baseline;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      title: 'NIDHIVIZH Transaction Risk Investigation Brief',
      generatedAt: new Date().toISOString(),
      customer: {
        id: customer.id,
        name: customer.name,
        accountNumber: customer.accountNumber,
        branch: customer.branch,
        kycStatus: customer.kycStatus
      },
      evaluation: {
        priorityScore: evaluation.priorityScore,
        priorityCategory: evaluation.priorityCategory,
        status: evaluation.status,
        ruleFindings: evaluation.ruleFindings
      },
      flaggedTransactions,
      aiBrief: brief
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NidhiVizh_Investigation_Brief_${customer.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-h-none print:shadow-none print:border-none">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-200 bg-[#002B49] text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FFC700]" />
            <span className="font-extrabold text-sm tracking-wide font-mono">
              OFFICIAL INVESTIGATION BRIEF
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-[#0072CE] hover:bg-[#005bb5] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-800 text-xs font-sans print:overflow-visible">
          {/* Document Letterhead */}
          <div className="border-b-2 border-[#002B49] pb-4 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#002B49]">
                  NIDHI<span className="text-[#0072CE]">VIZH</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 font-bold border border-slate-300">
                  BANKING NOC
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900">
                Transaction Risk Investigation Brief
              </h1>
              <div className="text-[11px] text-slate-500 font-mono">
                Case Reference: NIDHI-{customer.id}-{new Date().getFullYear()}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                Investigation Priority:
              </div>
              <span className={`inline-block px-3 py-1 rounded font-mono font-black text-xs border ${
                evaluation.priorityCategory === 'HIGH PRIORITY'
                  ? 'bg-red-100 text-red-700 border-red-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {evaluation.status} ({evaluation.priorityScore}/100)
              </span>
              <div className="text-[10px] text-slate-400 font-mono">
                Generated: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>1. Executive Summary</span>
            </h2>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {brief.summary}
            </p>
          </section>

          {/* Section 2: Activity Requiring Attention */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>2. Activity Requiring Attention</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {brief.whyAttentionRequired.map((item, idx) => (
                <li key={idx} className="leading-normal">{item}</li>
              ))}
            </ul>
          </section>

          {/* Section 3: Transactions Involved */}
          <section className="space-y-2">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>3. Transactions Involved</span>
            </h2>
            <table className="w-full text-left text-[11px] border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-mono uppercase text-[9px]">
                  <th className="p-2 border-b">Txn ID</th>
                  <th className="p-2 border-b">Date & Time</th>
                  <th className="p-2 border-b">Payee</th>
                  <th className="p-2 border-b">Amount</th>
                  <th className="p-2 border-b">Channel</th>
                  <th className="p-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {flaggedTransactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="p-2 font-mono font-bold">{t.id}</td>
                    <td className="p-2 font-mono">{t.date} {t.time}</td>
                    <td className="p-2 font-medium">{t.payee}</td>
                    <td className="p-2 font-mono font-bold">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="p-2 font-mono">{t.channel}</td>
                    <td className="p-2 font-mono text-red-600">{t.payeeStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section 4: Triggered Risk Rules */}
          <section className="space-y-2">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>4. Triggered Risk Rules (Deterministic Engine)</span>
            </h2>
            <div className="space-y-1.5">
              {evaluation.ruleFindings.filter(r => r.status === 'TRIGGERED').map(r => (
                <div key={r.ruleId} className="p-2.5 rounded bg-red-50/70 border border-red-200 text-[11px]">
                  <div className="flex items-center justify-between font-bold text-red-900">
                    <span>[{r.ruleId}] {r.ruleName}</span>
                    <span className="font-mono text-[10px] text-red-700">Severity: {r.severity}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{r.reason}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Behavioural Comparison */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>5. Behavioural Comparison against Customer Baseline</span>
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {brief.behavioralComparison}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-mono">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">Baseline Mean:</span>
                <span className="font-bold text-slate-800">₹{baseline.meanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">Active Schedule:</span>
                <span className="font-bold text-slate-800">{baseline.activeHoursStart}:00 – {baseline.activeHoursEnd}:00</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">Typical Payees:</span>
                <span className="font-bold text-slate-800">{baseline.commonPayees.length} Verified</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">Historical Records:</span>
                <span className="font-bold text-slate-800">{baseline.totalHistoricalTransactions} txns</span>
              </div>
            </div>
          </section>

          {/* Section 6: Transaction Relationships */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>6. Transaction Relationships</span>
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {brief.transactionConnections}
            </p>
          </section>

          {/* Section 7: Evidence Itemization */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>7. Direct Evidence Record</span>
            </h2>
            <div className="space-y-1 text-slate-700">
              {brief.observed.map((obs, i) => (
                <div key={i} className="flex items-start gap-2 font-mono text-[11px]">
                  <span className="text-[#0072CE] font-bold">•</span>
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: Unknown / Unverified Information */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>8. Unknown / Unverified Information</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              {brief.unknown.map((un, i) => (
                <li key={i}>{un}</li>
              ))}
            </ul>
          </section>

          {/* Section 9: Investigator Checklist */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>9. Investigator Checklist</span>
            </h2>
            <div className="space-y-1">
              {brief.investigatorChecklist.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                  <input type="checkbox" className="mt-0.5 rounded text-[#0072CE]" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 10: Recommended Next Steps */}
          <section className="space-y-1.5">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <span>10. Recommended Next Steps</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              {brief.recommendedNextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </section>

          {/* Section 11: Human Decision */}
          <section className="space-y-2 border-t-2 border-[#002B49] pt-4">
            <h2 className="text-xs font-mono font-bold text-[#002B49] uppercase tracking-wider flex items-center gap-1.5">
              <span>11. Human Investigator Authorization</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 text-[11px] pt-2">
              <div className="space-y-1">
                <span className="text-slate-500 block">Assigned Risk Investigator:</span>
                <span className="font-bold text-slate-900 block">S. Nambiar (ID: #8092)</span>
                <span className="text-slate-400 block font-mono text-[10px]">Cyber Risk & Fraud Operations Unit</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-slate-500 block">Authorization Signature:</span>
                <div className="font-mono text-slate-800 font-bold border-b border-slate-300 inline-block px-4 py-1">
                  Verified In Enclave
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
