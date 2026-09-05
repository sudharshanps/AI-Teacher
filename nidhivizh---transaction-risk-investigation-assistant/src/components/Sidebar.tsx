import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  CreditCard,
  Network,
  FileText,
  History,
  Settings,
  Sparkles,
  UploadCloud,
  FileCheck2
} from 'lucide-react';
import { NidhiLogo } from './NidhiLogo';

export type ActiveTab =
  | 'dashboard'
  | 'investigation'
  | 'customers'
  | 'transactions'
  | 'graph'
  | 'evidence'
  | 'history'
  | 'settings';

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  onOpenUpload?: () => void;
  selectedCustomerId?: string;
  currentCustomer?: any;
  allCustomers?: any[];
  onSelectCustomer?: (id: string) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  onOpenUpload,
  selectedCustomerId,
  currentCustomer,
  onSelectCustomer,
  userRole
}) => {
  const changeTab = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    else if (setActiveTab) setActiveTab(tab);
  };

  const effectiveCustomerId = selectedCustomerId || currentCustomer?.id || 'CUS-10482';

  const navItems = [
    { id: 'dashboard', label: 'Investigator Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'investigation', label: 'Investigation Case', icon: ShieldAlert, badge: 'Active' },
    { id: 'explorer', label: 'Transaction Explorer', icon: CreditCard, badge: null },
    { id: 'graph', label: 'Relationship Graph', icon: Network, badge: null },
    { id: 'baseline', label: 'Customer Baseline', icon: Users, badge: null },
    { id: 'settings', label: 'System & Knowledge', icon: Settings, badge: null },
  ];

  const demoPresets = [
    { id: 'CUS-10482', name: 'Arun Kumar', label: 'High Risk (Burst to New Payee)', color: 'bg-red-500' },
    { id: 'CUS-20831', name: 'Priya Sharma', label: 'Ambiguous (Known Recurring ₹1L)', color: 'bg-amber-500' },
    { id: 'CUS-30914', name: 'Vikram Rao', label: 'Clean (Normal Baseline)', color: 'bg-emerald-500' },
    { id: 'CUS-41920', name: 'Meera Patel', label: 'Sparse (Insufficient Records)', color: 'bg-blue-500' },
    { id: 'CUS-55102', name: 'Rajesh Gupta', label: 'Multi-Correlated (Odd Hours)', color: 'bg-purple-500' },
  ];

  return (
    <aside className="w-72 bg-[#002B49] text-white flex flex-col h-screen border-r border-[#002B49]/80 select-none flex-shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 bg-[#00233b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-[#00A3E0]/40 bg-white/5 flex items-center justify-center p-0.5">
            <img
              src="/nidhivizh_logo.png"
              alt="NidhiVizh"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                Nidhi<span className="text-[#00A3E0]">Vizh</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFC700]/20 text-[#FFC700] font-bold border border-[#FFC700]/40">
                PROD
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-tight">
              Evidence-Driven Risk Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Upload CSV Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenUpload}
          className="w-full py-2.5 px-3 bg-[#0072CE] hover:bg-[#00A3E0] active:scale-[0.99] text-white rounded-lg font-semibold text-xs transition-all shadow flex items-center justify-center gap-2 border border-white/10 group cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-[#FFC700] group-hover:scale-110 transition-transform" />
          <span>Upload Transaction CSV</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Investigation Console
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0072CE] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFC700]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Demo Scenarios Quick Switcher */}
        <div className="pt-4 pb-1">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Demo Customer Scenarios</span>
            <span className="text-[9px] text-[#00A3E0] font-normal">TRACK PS6</span>
          </div>
          <div className="space-y-1 mt-1">
            {demoPresets.map(preset => {
              const isSelected = effectiveCustomerId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    if (onSelectCustomer) onSelectCustomer(preset.id);
                    if (activeTab === 'dashboard') {
                      changeTab('investigation');
                    }
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white/15 border-[#00A3E0] text-white font-medium'
                      : 'border-transparent text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">{preset?.name}</span>
                    <span className="text-[9px] font-mono text-slate-400">{preset?.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${preset?.color}`} />
                    <span className="text-[10px] text-slate-300 truncate">{preset?.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-white/10 bg-[#00233b] text-[11px]">
        <div className="flex items-center justify-between text-slate-300 pb-1.5">
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            DETERMINISTIC ENGINE
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFC700]" />
            Gemini Assistant
          </span>
          <span className="text-slate-300">gemini-3.8-flash</span>
        </div>
      </div>
    </aside>
  );
};
