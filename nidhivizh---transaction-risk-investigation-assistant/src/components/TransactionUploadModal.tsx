import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  ArrowRight
} from 'lucide-react';
import { CustomerProfile, RiskEvaluation, Transaction } from '../types';

interface TransactionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (data: {
    customer: CustomerProfile;
    evaluation: RiskEvaluation;
    recentTransactions?: Transaction[];
  }) => void;
}

export const TransactionUploadModal: React.FC<TransactionUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Custom Upload Account');
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const sampleCsv = `transaction_id,date,time,description,payee,amount,channel,location,account_type,payee_status
TXN-UP-001,2026-08-31,09:15,Office Hardware Supplier,Dell India Technologies,28500,NEFT,Bengaluru,Current,Existing
TXN-UP-002,2026-08-31,11:40,Staff Pantry Bulk Grocery,Metro Cash and Carry,8420,UPI,Bengaluru,Current,Existing
TXN-UP-003,2026-08-31,14:20,Cloud Services Billing,Amazon Web Services,14200,Net Banking,Bengaluru,Current,Existing
TXN-UP-004,2026-08-31,02:45,Unscheduled Outbound Split 1,Cryptic Node Gateway Ltd,48000,UPI,Bengaluru,Current,New
TXN-UP-005,2026-08-31,02:51,Unscheduled Outbound Split 2,Cryptic Node Gateway Ltd,52000,UPI,Bengaluru,Current,New`;

  const handleLoadSample = () => {
    setCsvContent(sampleCsv);
    setFileName('sample_banking_transactions.csv');
    parsePreview(sampleCsv);
    setErrorMsg('');
  };

  const parsePreview = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length > 0) {
      const rows = lines.slice(0, 6).map(l => l.split(',').map(c => c.trim()));
      setPreviewRows(rows);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      parsePreview(text);
      validateColumns(text);
    };
    reader.readAsText(file);
  };

  const validateColumns = (text: string): boolean => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setErrorMsg('CSV must contain at least a header row and one transaction record.');
      return false;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const required = ['transaction_id', 'date', 'time', 'amount', 'payee'];
    const missing = required.filter(r => !headers.includes(r));

    if (missing.length > 0) {
      setErrorMsg(`Missing required CSV columns: ${missing.join(', ')}`);
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateColumns(csvContent)) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/transactions/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData: csvContent,
          customerName
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to process CSV');
      }

      const result = await res.json();
      onUploadSuccess({
        customer: result.customer,
        evaluation: result.evaluation,
        recentTransactions: result.recentTransactions || result.transactions
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Server-side upload processing failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#002B49] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#FFC700]" />
            <h3 className="font-extrabold text-sm">
              Upload Transaction CSV for Deterministic Risk Analysis
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Account / Case Label:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0072CE]"
            />
          </div>

          {/* Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-[#0072CE] rounded-xl p-6 text-center space-y-3 bg-[#F8FAFC] transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0072CE] flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-700 block">
                {fileName ? fileName : 'Drag & drop bank transaction CSV, or click to browse'}
              </span>
              <span className="text-[11px] text-slate-400">
                Required columns: transaction_id, date, time, payee, amount, channel
              </span>
            </div>
          </div>

          {/* Load Sample Button */}
          <div className="flex justify-between items-center pt-1">
            <button
              onClick={handleLoadSample}
              className="text-[11px] font-bold text-[#0072CE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Load Realistic Pre-Formatted Sample CSV</span>
            </button>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Preview Table */}
          {previewRows.length > 0 && (
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-700 font-mono text-[10px] uppercase">
                CSV Header & Record Preview ({previewRows.length - 1} sample rows shown):
              </span>
              <div className="overflow-x-auto max-h-36 border border-slate-200 rounded-lg">
                <table className="w-full text-[10px] text-left">
                  <thead className="bg-slate-100 text-slate-600 font-mono">
                    <tr>
                      {previewRows[0]?.map((h, i) => (
                        <th key={i} className="p-1.5 border-b">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(1).map((r, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        {r.map((val, ci) => (
                          <td key={ci} className="p-1.5">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!csvContent || isUploading}
            className="px-4 py-2 bg-[#0072CE] hover:bg-[#005bb5] disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>{isUploading ? 'Executing Risk Analysis...' : 'Process & Analyze Case'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
