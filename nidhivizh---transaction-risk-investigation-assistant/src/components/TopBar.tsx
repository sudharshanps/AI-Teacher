import React, { useState } from 'react';
import {
  Search,
  Bell,
  UserCheck,
  Shield,
  FileDown,
  Printer,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { CustomerProfile } from '../types';
import { maskCustomerName } from '../utils/privacy';

interface TopBarProps {
  currentCustomer?: CustomerProfile;
  customer?: CustomerProfile;
  allCustomers?: CustomerProfile[];
  onSelectCustomer?: (id: string) => void;
  onOpenBrief?: () => void;
  onOpenBriefModal?: () => void;
  onOpenUploadModal?: () => void;
  activeTab?: string;
  evaluation?: any;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSearchResultSelect?: (result: { type: 'customer' | 'transaction' | 'investigation'; id: string }) => void;
  isPrivacyMode?: boolean;
  onTogglePrivacyMode?: () => void;
  activeSlaMinutes?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCustomer,
  customer,
  allCustomers = [],
  onSelectCustomer,
  onOpenBrief,
  onOpenBriefModal,
  onOpenUploadModal,
  searchQuery,
  setSearchQuery,
  onSearchResultSelect,
  isPrivacyMode = false,
  onTogglePrivacyMode,
  activeSlaMinutes = 18
}) => {
  const [showCustDropdown, setShowCustDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const activeCustomer = currentCustomer || customer || allCustomers[0];
  const searchValue = searchQuery !== undefined ? searchQuery : localSearch;
  const handleSearchChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setLocalSearch(val);
    }
  };

  const handleOpenBrief = () => {
    if (onOpenBrief) onOpenBrief();
    else if (onOpenBriefModal) onOpenBriefModal();
  };

  // Compute live search matches
  const searchMatches = (searchValue.trim().length > 1 && allCustomers)
    ? allCustomers.filter(c =>
        c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.accountNumber.includes(searchValue) ||
        c.branch.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.baseline.commonPayees.some(p => p.toLowerCase().includes(searchValue.toLowerCase()))
      )
    : [];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Security / Trust Banner */}
      <div className="bg-[#002B49] text-white px-6 py-1.5 flex items-center justify-between text-[11px] border-b border-white/10">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#FFC700]" />
          <span className="font-medium text-slate-200">
            NIDHIVIZH NOC POLICY:
          </span>
          <span className="text-slate-300">
            AI-assisted analysis. Final investigation judgement remains with the authorized investigator.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300 font-mono text-[10px]">
          {activeSlaMinutes !== undefined && (
            <span className="flex items-center gap-1.5 text-amber-300 font-bold px-2 py-0.5 rounded bg-white/10">
              <Clock className="w-3 h-3 text-[#FFC700]" />
              HIGH PRIORITY SLA: {activeSlaMinutes}m REMAINING
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SECURE BANK ENCLAVE
          </span>
          <span>SESSION ID: #NIDHI-9842</span>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Customer ID (CUS-10482), Name, Payee, Branch, or Account..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F6F8] border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0072CE] focus:bg-white transition-all font-sans"
          />

          {/* Instant Search Results Dropdown */}
          {searchFocused && searchValue.trim().length > 1 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase font-mono border-b border-slate-100">
                Matched Entities ({searchMatches.length})
              </div>
              {searchMatches.length > 0 ? (
                searchMatches.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={() => {
                      if (onSelectCustomer) onSelectCustomer(c.id);
                      if (onSearchResultSelect) onSearchResultSelect({ type: 'customer', id: c.id });
                      handleSearchChange('');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <div className="font-bold text-[#002B49] flex items-center gap-2">
                        <span>{maskCustomerName(c.name, isPrivacyMode)}</span>
                        <span className="font-mono text-[10px] text-slate-400">({c.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {c.accountType} • {c.branch} • {c.scenarioLabel.slice(0, 45)}...
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0072CE]" />
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-slate-400 text-center">
                  No matching customer or transaction found for &ldquo;{searchValue}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Customer Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCustDropdown(!showCustDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs cursor-pointer transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-[#0072CE]" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase font-mono block leading-tight">Selected Customer</span>
              <span className="font-bold text-[#002B49] block">
                {maskCustomerName(activeCustomer?.name || 'Customer Account', isPrivacyMode)} ({activeCustomer?.id || '—'})
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showCustDropdown && (
            <div className="absolute right-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase font-mono">
                Switch Investigation Target
              </div>
              {(allCustomers || []).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    if (onSelectCustomer) onSelectCustomer(c.id);
                    setShowCustDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors ${
                    c.id === activeCustomer?.id ? 'bg-blue-50/60 font-semibold text-[#0072CE]' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium text-[#1E1E1E]">{maskCustomerName(c.name, isPrivacyMode)}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.id} • {c.branch}</div>
                  </div>
                  {c.id === activeCustomer?.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#0072CE]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Privacy Mode Toggle */}
          {onTogglePrivacyMode && (
            <button
              onClick={onTogglePrivacyMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                isPrivacyMode
                  ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isPrivacyMode ? 'Privacy Mode ON (PII Masked)' : 'Privacy Mode OFF (Click to Mask PII)'}
            >
              {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5 text-purple-600" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden sm:inline">{isPrivacyMode ? 'Privacy ON' : 'Privacy Mode'}</span>
            </button>
          )}

          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer border border-slate-200"
              title="Upload Transaction CSV"
            >
              <span>Upload CSV</span>
            </button>
          )}

          <button
            onClick={handleOpenBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#002B49] hover:bg-[#003860] text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
            title="Generate & View Formal Investigation Brief"
          >
            <FileDown className="w-3.5 h-3.5 text-[#FFC700]" />
            <span>Investigation Brief</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
              title="Recent NOC Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-[#002B49]">Real-Time Risk Alerts</span>
                  <span className="text-[10px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">2 NEW</span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-3 py-2 hover:bg-slate-50">
                    <div className="flex items-center gap-1 text-red-600 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> High Priority Alert
                    </div>
                    <div className="text-slate-800 text-xs mt-0.5">Arun Kumar: 3 nocturnal transfers to new payee XYZ Services Ltd</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Today, 03:02 AM • System Trigger</div>
                  </div>
                  <div className="px-3 py-2 hover:bg-slate-50">
                    <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Multi-Vector Anomaly
                    </div>
                    <div className="text-slate-800 text-xs mt-0.5">Rajesh Gupta: Offshore IP transaction via Debit Card</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Today, 01:22 AM • System Trigger</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Investigator Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/15 text-[#0072CE] border border-[#00A3E0]/30 flex items-center justify-center font-bold text-xs">
              SN
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-[#002B49] leading-tight">S. Nambiar</div>
              <div className="text-[10px] text-slate-500 font-mono leading-tight">Senior Risk Investigator</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

