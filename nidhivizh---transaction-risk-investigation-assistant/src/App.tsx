import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { InvestigationHeroView } from './components/InvestigationHeroView';
import { TransactionExplorerView } from './components/TransactionExplorerView';
import { RelationshipGraphView } from './components/RelationshipGraphView';
import { CustomerBaselineView } from './components/CustomerBaselineView';
import { SettingsView } from './components/SettingsView';
import { WelcomeView } from './components/WelcomeView';
import { InvestigationBriefModal } from './components/InvestigationBriefModal';
import { TransactionUploadModal } from './components/TransactionUploadModal';

import {
  MOCK_CUSTOMERS,
  MOCK_RECENT_TRANSACTIONS,
  MOCK_HISTORICAL_TRANSACTIONS
} from './data/mockData';
import { evaluateCustomerRisk } from './services/riskEngine';
import { generateAIBrief } from './services/geminiService';
import {
  AIInvestigationBrief,
  CustomerProfile,
  DecisionStatus,
  InvestigationCase,
  RiskEvaluation,
  Transaction
} from './types';

export default function App() {
  // Authentication & Session
  const [hasEntered, setHasEntered] = useState<boolean>(true); // default true for immediate interactive preview
  const [userRole, setUserRole] = useState<string>('Fraud Investigator');

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUS-10482');
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);

  // Data State
  const [customers, setCustomers] = useState<CustomerProfile[]>(MOCK_CUSTOMERS);
  const [recentTransactionsMap, setRecentTransactionsMap] = useState<Record<string, Transaction[]>>(MOCK_RECENT_TRANSACTIONS);
  const [historicalTransactionsMap, setHistoricalTransactionsMap] = useState<Record<string, Transaction[]>>(MOCK_HISTORICAL_TRANSACTIONS);

  // Modals & Drawers
  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Decisions state map: customerId -> { status, notes, timestamp }
  const [decisions, setDecisions] = useState<Record<string, { status: DecisionStatus; notes: string; timestamp: string }>>({});

  // Active Customer Object
  const currentCustomer: CustomerProfile = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0] || MOCK_CUSTOMERS[0];
  }, [customers, selectedCustomerId]);

  // Active Customer's recent transactions
  const currentTransactions = useMemo(() => {
    return (currentCustomer && recentTransactionsMap[currentCustomer.id]) || [];
  }, [recentTransactionsMap, currentCustomer]);

  // Active Customer's historical transactions
  const currentHistoricalTransactions = useMemo(() => {
    return (currentCustomer && historicalTransactionsMap[currentCustomer.id]) || [];
  }, [historicalTransactionsMap, currentCustomer]);

  // Deterministic Risk Engine Evaluation (Live & Instant)
  const currentEvaluation: RiskEvaluation = useMemo(() => {
    return evaluateCustomerRisk(
      currentCustomer,
      currentTransactions,
      currentHistoricalTransactions
    );
  }, [currentCustomer, currentTransactions, currentHistoricalTransactions]);

  // Flagged Transactions
  const flaggedTransactions = useMemo(() => {
    return currentTransactions.filter(t => t.riskLevel === 'HIGH' || (t.triggeredRules && t.triggeredRules.length > 0));
  }, [currentTransactions]);

  // Gemini AI Brief (Async State with Instant Deterministic Seed)
  const [aiBrief, setAiBrief] = useState<AIInvestigationBrief>(() =>
    generateAIBrief(currentCustomer, currentEvaluation, flaggedTransactions)
  );

  // Recalculate AI brief whenever customer changes
  useEffect(() => {
    // Generate grounded brief (with deterministic fallback guaranteed)
    const freshBrief = generateAIBrief(currentCustomer, currentEvaluation, flaggedTransactions);
    setAiBrief(freshBrief);
  }, [currentCustomer.id, currentEvaluation, flaggedTransactions]);

  // Case dossiers list for dashboard
  const investigations: InvestigationCase[] = useMemo(() => {
    return customers.map(c => {
      const txns = recentTransactionsMap[c.id] || [];
      const hist = historicalTransactionsMap[c.id] || [];
      const evalResult = evaluateCustomerRisk(c, txns, hist);
      const flagged = txns.filter(t => t.riskLevel === 'HIGH' || (t.triggeredRules && t.triggeredRules.length > 0));
      const totalFlagged = flagged.reduce((sum, t) => sum + t.amount, 0);
      const userDecision = decisions[c.id];

      const isHigh = evalResult.priorityCategory === 'HIGH PRIORITY';
      const isElevated = evalResult.priorityCategory === 'MEDIUM ATTENTION';
      const slaStatus = isHigh ? 'BREACH_IMMINENT' : isElevated ? 'APPROACHING' : 'HEALTHY';
      const slaMinutesRemaining = isHigh ? 18 : isElevated ? 65 : 180;

      return {
        id: `INV-${c.id.replace('CUS-', '')}-2026`,
        customerId: c.id,
        customerName: c.name,
        accountNumber: c.accountNumber,
        status: userDecision?.status || (isHigh ? 'IN_PROGRESS' : 'PENDING'),
        priority: isHigh ? 'HIGH' : isElevated ? 'MEDIUM' : 'LOW',
        priorityScore: evalResult.priorityScore,
        totalFlaggedAmount: totalFlagged,
        triggeredRuleCount: evalResult.ruleFindings.filter(r => r.status === 'TRIGGERED').length,
        createdAt: '2026-08-31 03:15 IST',
        updatedAt: userDecision ? userDecision.timestamp : '2026-08-31 03:15 IST',
        slaStatus,
        slaMinutesRemaining,
        evaluation: evalResult
      };
    });
  }, [customers, recentTransactionsMap, historicalTransactionsMap, decisions]);

  const currentInvestigation = useMemo(() => {
    return investigations.find(inv => inv.customerId === currentCustomer.id);
  }, [investigations, currentCustomer.id]);

  // Save Investigator Decision handler
  const handleSaveDecision = (status: DecisionStatus, notes: string) => {
    setDecisions(prev => ({
      ...prev,
      [currentCustomer.id]: {
        status,
        notes,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    }));
  };

  // Handle CSV Upload Success
  const handleUploadSuccess = (data: {
    customer: CustomerProfile;
    evaluation: RiskEvaluation;
    recentTransactions?: Transaction[];
  }) => {
    setCustomers(prev => [data.customer, ...prev]);
    if (data.recentTransactions) {
      setRecentTransactionsMap(prev => ({
        ...prev,
        [data.customer.id]: data.recentTransactions || []
      }));
    }
    setSelectedCustomerId(data.customer.id);
    setActiveTab('investigation');
  };

  // If user hasn't entered the application yet, show welcome view
  if (!hasEntered) {
    return (
      <WelcomeView
        onEnter={(role) => {
          setUserRole(role);
          setHasEntered(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1E1E1E] flex flex-col font-sans antialiased">
      {/* Top Bar Header */}
      <TopBar
        activeTab={activeTab}
        customer={currentCustomer}
        currentCustomer={currentCustomer}
        allCustomers={customers}
        evaluation={currentEvaluation}
        onSelectCustomer={(id) => setSelectedCustomerId(id)}
        onOpenBriefModal={() => setIsBriefModalOpen(true)}
        onOpenBrief={() => setIsBriefModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        isPrivacyMode={isPrivacyMode}
        onTogglePrivacyMode={() => setIsPrivacyMode(prev => !prev)}
        activeSlaMinutes={currentInvestigation?.slaMinutesRemaining || 18}
      />

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab)}
          onTabChange={(tab) => setActiveTab(tab)}
          selectedCustomerId={selectedCustomerId}
          currentCustomer={currentCustomer}
          allCustomers={customers}
          onSelectCustomer={(id) => setSelectedCustomerId(id)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          userRole={userRole}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* View 1: Dashboard View */}
            {activeTab === 'dashboard' && (
              <DashboardView
                investigations={investigations}
                onSelectCustomer={(id) => setSelectedCustomerId(id)}
                onNavigateToInvestigation={(id) => {
                  setSelectedCustomerId(id);
                  setActiveTab('investigation');
                }}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                isPrivacyMode={isPrivacyMode}
              />
            )}

            {/* View 2: Hero Investigation Workspace */}
            {activeTab === 'investigation' && (
              <InvestigationHeroView
                customer={currentCustomer}
                evaluation={currentEvaluation}
                flaggedTransactions={flaggedTransactions}
                brief={aiBrief}
                onOpenBriefModal={() => setIsBriefModalOpen(true)}
                onSaveDecision={handleSaveDecision}
                onSelectTransaction={(txn) => {
                  setSelectedTransaction(txn);
                  setActiveTab('explorer');
                }}
                isPrivacyMode={isPrivacyMode}
                slaRemainingMinutes={currentInvestigation?.slaMinutesRemaining || 18}
              />
            )}

            {/* View 3: Transaction Explorer */}
            {activeTab === 'explorer' && (
              <TransactionExplorerView
                customer={currentCustomer}
                transactions={currentTransactions}
                selectedTransaction={selectedTransaction}
                onSelectTransaction={(txn) => setSelectedTransaction(txn)}
              />
            )}

            {/* View 4: Transaction Relationship Graph */}
            {activeTab === 'graph' && (
              <RelationshipGraphView
                customer={currentCustomer}
                flaggedTransactions={flaggedTransactions}
                onSelectTransaction={(txn) => {
                  setSelectedTransaction(txn);
                  setActiveTab('explorer');
                }}
              />
            )}

            {/* View 5: Customer Baseline Matrix */}
            {activeTab === 'baseline' && (
              <CustomerBaselineView
                customer={currentCustomer}
                allCustomers={customers}
                onSelectCustomer={(id) => setSelectedCustomerId(id)}
                onNavigateToInvestigation={(id) => {
                  setSelectedCustomerId(id);
                  setActiveTab('investigation');
                }}
                historyTransactions={currentHistoricalTransactions}
              />
            )}

            {/* View 6: Settings & Rule Management */}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Printable / Downloadable 11-Section Investigation Brief Modal */}
      <InvestigationBriefModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        customer={currentCustomer}
        evaluation={currentEvaluation}
        flaggedTransactions={flaggedTransactions}
        brief={aiBrief}
      />

      {/* CSV Upload & Live Analysis Modal */}
      <TransactionUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
