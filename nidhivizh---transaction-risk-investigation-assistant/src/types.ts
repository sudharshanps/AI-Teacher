export type RiskLevel = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
export type PayeeStatus = 'Existing' | 'New' | 'Verified Corporate' | 'Flagged';
export type ChannelType = 'UPI' | 'NEFT' | 'IMPS' | 'Debit Card' | 'Net Banking';
export type DecisionStatus =
  | 'PENDING'
  | 'ACTIVE_INVESTIGATION'
  | 'REVIEWED_NO_ACTION'
  | 'ESCALATED'
  | 'INFO_REQUESTED'
  | 'MONITORING';

export type SlaStatus = 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'BREACHED';

export type EvidenceStrength =
  | 'FACTUAL_DIRECT'
  | 'STATISTICAL_DEVIATION'
  | 'BEHAVIORAL_DRIFT'
  | 'CONTEXTUAL';

export interface EvidenceItem {
  id: string;
  title: string;
  strength: EvidenceStrength;
  strengthScore: number; // 0 - 100
  observedValue: string;
  expectedBaseline: string;
  deviationMultiplier?: string;
  verificationSource: string; // e.g. 'UPI Core Switch Logs', 'Customer 90-Day Baseline'
  category: 'TIMING' | 'AMOUNT' | 'BENEFICIARY' | 'CHANNEL' | 'GEOGRAPHY';
}

export interface WhyThisCaseAnalysis {
  headline: string;
  primaryDrivers: {
    ruleId: string;
    ruleName: string;
    mathBreakdown: string;
    pointsContributed: number;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
  }[];
  mathematicalSummary: string;
  zScoreMagnitude: number;
  burstVelocitySummary?: string;
}

export interface WhyNotFlaggedAnalysis {
  isExemptedOrDowngraded: boolean;
  clearedRules: {
    ruleId: string;
    ruleName: string;
    clearedReason: string;
    observedMetric: string;
    thresholdRequired: string;
  }[];
  mitigatingFactors: string[];
  safePatternsIdentified: string[];
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  payee: string;
  amount: number;
  channel: ChannelType;
  location: string;
  accountType: 'Savings' | 'Current' | 'Salary';
  payeeStatus: PayeeStatus;
  riskLevel?: RiskLevel;
  triggeredRules?: string[];
  isOddHours?: boolean;
  isNewPayee?: boolean;
  isExcludedFromRisk?: boolean;
  exemptionNote?: string;
}

export interface CustomerBaseline {
  meanAmount: number;
  medianAmount: number;
  stdDev: number;
  monthlyFrequency: number;
  activeHoursStart: number; // e.g., 8
  activeHoursEnd: number;   // e.g., 22
  commonPayees: string[];
  commonChannels: ChannelType[];
  typicalLocations: string[];
  totalHistoricalTransactions: number;
  largestHistoricalTxn: number;
  regularLargePaymentPattern?: boolean; // For ambiguous legitimate case
  hasSufficientData: boolean;
  circadianHourlyVolumes?: number[]; // 24 entries (0 to 23 hours)
  channelPercentages?: Record<ChannelType, number>;
}

export interface CustomerProfile {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'Savings' | 'Current' | 'Salary';
  customerSince: string;
  kycStatus: 'Verified' | 'Pending Refresh' | 'Re-KYC Required';
  branch: string;
  riskCategory: 'Low Risk' | 'Medium Risk' | 'High Risk';
  scenarioType: 'high_risk' | 'ambiguous' | 'clean' | 'insufficient_data' | 'multi_correlated';
  scenarioLabel: string;
  baseline: CustomerBaseline;
}

export interface RuleFinding {
  ruleId: 'R01' | 'R02' | 'R03' | 'R04';
  ruleName: string;
  status: 'TRIGGERED' | 'CLEARED' | 'INSUFFICIENT_DATA';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'INFO';
  reason: string;
  scoreContribution: number;
  affectedTransactionIds: string[];
  evidence: {
    label: string;
    value: string;
    comparison?: string;
  }[];
}

export interface TransactionCluster {
  id: string;
  title: string;
  timeSpan: string;
  totalAmount: number;
  transactionIds: string[];
  commonPayee: string;
  commonChannel: string;
  triggeredRules: string[];
  description: string;
  intervalMinutes?: number;
  splitStructureDetected?: boolean;
}

export interface RiskEvaluation {
  customerId: string;
  priorityScore: number; // 0 - 100
  priorityCategory: 'NORMAL' | 'LOW ATTENTION' | 'MEDIUM ATTENTION' | 'HIGH PRIORITY';
  status: 'NO ATTENTION REQUIRED' | 'ATTENTION REQUIRED' | 'INVESTIGATION RECOMMENDED' | 'INSUFFICIENT EVIDENCE';
  ruleFindings: RuleFinding[];
  scoreContributors: {
    ruleId: string;
    label: string;
    points: number;
  }[];
  clusters: TransactionCluster[];
  evaluatedAt: string;
  requiresAttention: boolean;
  whyThisCase?: WhyThisCaseAnalysis;
  whyNotFlagged?: WhyNotFlaggedAnalysis;
  evidenceChain?: EvidenceItem[];
}

export interface AIInvestigationBrief {
  summary: string;
  whyAttentionRequired: string[];
  transactionConnections: string;
  behavioralComparison: string;
  investigatorChecklist: string[];
  questionsToAsk: string[];
  recommendedNextSteps: string[];
  observed: string[];
  inferred: string[];
  unknown: string[];
  sourcesCited: {
    title: string;
    section: string;
    snippet: string;
  }[];
  isAiGenerated: boolean;
  generatedAt: string;
}

export interface InvestigationCase {
  id: string;
  customerId: string;
  customerName: string;
  accountNumber: string;
  createdAt: string;
  updatedAt: string;
  priority: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
  priorityScore: number;
  status: DecisionStatus;
  decisionNotes?: string;
  investigatorName?: string;
  decidedAt?: string;
  triggeredRuleCount: number;
  flaggedTxnCount: number;
  totalFlaggedAmount: number;
  evaluation?: RiskEvaluation;
  slaTargetMinutes?: number;
  slaMinutesRemaining?: number;
  slaStatus?: SlaStatus;
  assignedInvestigator?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Rule Handbook' | 'Standard Operating Procedure' | 'Escalation Policy';
  section: string;
  content: string;
  keywords: string[];
}

