import { ChannelType, CustomerProfile, InvestigationCase, KnowledgeDocument, Transaction } from '../types';

export const KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: 'DOC-RULE-01',
    title: 'Risk Rule Handbook — R01: Unusually Large Transfer',
    category: 'Rule Handbook',
    section: 'Section 1.2: Velocity & Magnitude Thresholds',
    content: `Rule R01 evaluates whether an outbound transfer deviates significantly from the customer's personal transaction history. The threshold is defined as max(3.5x customer mean, mean + 3*stdDev). If a customer possesses a verified recurring payment pattern (e.g. regular monthly rent or supplier disbursements), the rule should discount the deviation if the amount and recipient coincide with the established schedule.`,
    keywords: ['large transfer', 'threshold', 'deviation', 'recurring payment', 'R01']
  },
  {
    id: 'DOC-RULE-02',
    title: 'Risk Rule Handbook — R02: Burst Payments to New Payee',
    category: 'Rule Handbook',
    section: 'Section 2.1: Rapid Succession Beneficiary Splitting',
    content: `Rule R02 triggers when 2 or more outbound transactions are routed to an unverified or newly added payee within a 120-minute window. Fraudsters frequently execute payment splitting to circumvent single-transaction limits or probe account ceilings. When accompanied by UPI or instant IMPS channels, this pattern represents an elevated investigation priority.`,
    keywords: ['burst', 'new payee', 'splitting', 'velocity', 'R02', 'beneficiary']
  },
  {
    id: 'DOC-RULE-03',
    title: 'Risk Rule Handbook — R03: Odd-Hours Activity',
    category: 'Rule Handbook',
    section: 'Section 3.4: Nocturnal Anomaly Determination',
    content: `Rule R03 identifies operations occurring between 00:00 and 06:00, or outside the 10th-to-90th percentile of the customer's active hours baseline. Transactions executed during off-peak sleep windows carry increased risk of device compromise, unauthorized credential usage, or coercive transactions.`,
    keywords: ['odd hours', 'night', 'active hours', 'sleep window', 'R03']
  },
  {
    id: 'DOC-RULE-04',
    title: 'Risk Rule Handbook — R04: Behavioural Baseline Deviation',
    category: 'Rule Handbook',
    section: 'Section 4.2: Multi-Vector Behavioral Drift',
    content: `Rule R04 analyzes compound drifts involving transaction channel switches (e.g., sudden debit card use from habitual UPI user), geographic displacement, and high burst frequency. Drift is scored proportionally based on the degree of deviation from the rolling 90-day behavioral baseline.`,
    keywords: ['behaviour', 'drift', 'channel', 'location', 'R04']
  },
  {
    id: 'DOC-SOP-01',
    title: 'Investigator Standard Operating Procedure — Section 2.1',
    category: 'Standard Operating Procedure',
    section: 'Section 2.1: Initial Contact and Account Freeze Verification',
    content: `Upon receiving a High Priority investigation brief, the investigator must first verify the customer's contact record. Never confirm fraud before contacting the accountholder via registered phone number or secure in-app challenge. Inquire if the customer initiated transfers to the newly registered beneficiary. If no response within 30 minutes and funds are still in transit, initiate a temporary debit freeze pursuant to Section 4B of Bank Risk Directives.`,
    keywords: ['procedure', 'freeze', 'contact', 'checklist', 'verification', 'SOP']
  },
  {
    id: 'DOC-ESC-01',
    title: 'Escalation Policy — Section 5.3: Cyber Incident Escalation',
    category: 'Escalation Policy',
    section: 'Section 5.3: Tier-2 Escalation Protocols',
    content: `Cases exhibiting combined R01, R02, and R03 triggers with cumulative amounts exceeding ₹50,000 must be escalated to the Cyber Fraud Liaison Unit within 60 minutes. The investigator must generate a verified Investigation Brief and attach all transaction references.`,
    keywords: ['escalation', 'cyber', 'tier-2', 'policy', 'high priority']
  }
];

// Helper to generate historical transactions
function generateHistoricalTransactions(
  customerId: string,
  count: number,
  avgAmount: number,
  variance: number,
  payees: string[],
  channels: ChannelType[],
  location: string,
  startHour = 9,
  endHour = 21
): Transaction[] {
  const txns: Transaction[] = [];
  const descriptions = [
    'Grocery purchase',
    'Electricity Utility Bill',
    'Mobile Recharge',
    'Dine Out Swiggy',
    'E-Commerce Order Amazon',
    'Pharmacy Medicines',
    'Fuel Station Petrol',
    'Monthly Broadband Bill',
    'Local Merchant QR Payment',
    'Subscription Entertainment'
  ];

  for (let i = count; i >= 1; i--) {
    const dayOffset = Math.floor(i * 0.9);
    const date = new Date(2026, 7, 1); // August 2026
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    const amount = Math.max(120, Math.round(avgAmount + (Math.random() * 2 - 1) * variance));
    const payee = payees[Math.floor(Math.random() * payees.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];

    txns.push({
      id: `TXN-${customerId.slice(-4)}-${i.toString().padStart(4, '0')}`,
      customerId,
      date: dateStr,
      time: timeStr,
      description: desc,
      payee,
      amount,
      channel,
      location,
      accountType: 'Savings',
      payeeStatus: 'Existing',
      riskLevel: 'NORMAL'
    });
  }

  return txns;
}

// 1. Arun Kumar - High Risk Scenario
const arunHistory = generateHistoricalTransactions(
  'CUS-10482',
  140,
  2450,
  850,
  ['FreshMart Groceries', 'Amazon India', 'Swiggy Food Delivery', 'TNEB Electricity Board', 'Rent - Landlord Suresh'],
  ['UPI', 'Debit Card', 'NEFT'],
  'Chennai, TN',
  8,
  22
);

const arunRecent: Transaction[] = [
  {
    id: 'TXN-10482-1842',
    customerId: 'CUS-10482',
    date: '2026-08-31',
    time: '02:41',
    description: 'Instant Immediate Transfer - New Beneficiary',
    payee: 'XYZ Services Ltd',
    amount: 40000,
    channel: 'UPI',
    location: 'Chennai, TN',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'HIGH',
    triggeredRules: ['R01', 'R02', 'R03', 'R04'],
    isOddHours: true,
    isNewPayee: true
  },
  {
    id: 'TXN-10482-1843',
    customerId: 'CUS-10482',
    date: '2026-08-31',
    time: '02:48',
    description: 'Instant Immediate Transfer - Subsequent Split',
    payee: 'XYZ Services Ltd',
    amount: 45000,
    channel: 'UPI',
    location: 'Chennai, TN',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'HIGH',
    triggeredRules: ['R01', 'R02', 'R03', 'R04'],
    isOddHours: true,
    isNewPayee: true
  },
  {
    id: 'TXN-10482-1845',
    customerId: 'CUS-10482',
    date: '2026-08-31',
    time: '03:02',
    description: 'Instant Immediate Transfer - Final Balance Sweep',
    payee: 'XYZ Services Ltd',
    amount: 25000,
    channel: 'UPI',
    location: 'Chennai, TN',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'HIGH',
    triggeredRules: ['R01', 'R02', 'R03', 'R04'],
    isOddHours: true,
    isNewPayee: true
  }
];

// 2. Priya Sharma - Ambiguous / Known Recurring Large Vendor Case
const priyaHistory = generateHistoricalTransactions(
  'CUS-20831',
  160,
  8200,
  3400,
  ['Sharma Textiles Raw Material', 'Logistics Prime', 'HPCL Fuel Depot', 'State GST Portal', 'Office Lease'],
  ['NEFT', 'Net Banking'],
  'Mumbai, MH',
  9,
  20
);
// Add monthly recurring 1,00,000 payments into history
priyaHistory.push(
  {
    id: 'TXN-20831-0810',
    customerId: 'CUS-20831',
    date: '2026-06-02',
    time: '11:15',
    description: 'Monthly Bulk Fabric Supplier Settlement',
    payee: 'Gujarat Wholesale Weaving Co',
    amount: 100000,
    channel: 'NEFT',
    location: 'Mumbai, MH',
    accountType: 'Current',
    payeeStatus: 'Verified Corporate',
    riskLevel: 'NORMAL'
  },
  {
    id: 'TXN-20831-0950',
    customerId: 'CUS-20831',
    date: '2026-07-01',
    time: '14:20',
    description: 'Monthly Bulk Fabric Supplier Settlement',
    payee: 'Gujarat Wholesale Weaving Co',
    amount: 98500,
    channel: 'NEFT',
    location: 'Mumbai, MH',
    accountType: 'Current',
    payeeStatus: 'Verified Corporate',
    riskLevel: 'NORMAL'
  }
);

const priyaRecent: Transaction[] = [
  {
    id: 'TXN-20831-1120',
    customerId: 'CUS-20831',
    date: '2026-08-31',
    time: '11:30',
    description: 'Monthly Bulk Fabric Supplier Settlement',
    payee: 'Gujarat Wholesale Weaving Co',
    amount: 100000,
    channel: 'NEFT',
    location: 'Mumbai, MH',
    accountType: 'Current',
    payeeStatus: 'Verified Corporate',
    riskLevel: 'LOW',
    triggeredRules: []
  }
];

// 3. Vikram Rao - Clean Customer Case
const vikramHistory = generateHistoricalTransactions(
  'CUS-30914',
  120,
  1800,
  450,
  ['Reliance Fresh', 'Metro Rail Recharge', 'Apollo Pharmacy', 'BSNL Telecomm', 'Airtel Payments'],
  ['UPI', 'Debit Card'],
  'Bengaluru, KA',
  8,
  21
);

const vikramRecent: Transaction[] = [
  {
    id: 'TXN-30914-0412',
    customerId: 'CUS-30914',
    date: '2026-08-31',
    time: '10:14',
    description: 'Weekly Supermarket Purchase',
    payee: 'Reliance Fresh',
    amount: 1650,
    channel: 'UPI',
    location: 'Bengaluru, KA',
    accountType: 'Salary',
    payeeStatus: 'Existing',
    riskLevel: 'NORMAL',
    triggeredRules: []
  },
  {
    id: 'TXN-30914-0413',
    customerId: 'CUS-30914',
    date: '2026-08-31',
    time: '18:30',
    description: 'Metro Commute Transit Pass',
    payee: 'Metro Rail Recharge',
    amount: 500,
    channel: 'Debit Card',
    location: 'Bengaluru, KA',
    accountType: 'Salary',
    payeeStatus: 'Existing',
    riskLevel: 'NORMAL',
    triggeredRules: []
  }
];

// 4. Meera Patel - Insufficient Data Case (Newly opened account, 3 txns)
const meeraHistory: Transaction[] = [
  {
    id: 'TXN-41920-0001',
    customerId: 'CUS-41920',
    date: '2026-08-25',
    time: '12:00',
    description: 'Initial Account Funding Deposit',
    payee: 'Self Account Transfer',
    amount: 10000,
    channel: 'NEFT',
    location: 'Pune, MH',
    accountType: 'Savings',
    payeeStatus: 'Existing',
    riskLevel: 'NORMAL'
  },
  {
    id: 'TXN-41920-0002',
    customerId: 'CUS-41920',
    date: '2026-08-27',
    time: '15:20',
    description: 'Welcome Kit Debit Card Test',
    payee: 'Coffee Day Cafe',
    amount: 280,
    channel: 'Debit Card',
    location: 'Pune, MH',
    accountType: 'Savings',
    payeeStatus: 'Existing',
    riskLevel: 'NORMAL'
  },
  {
    id: 'TXN-41920-0003',
    customerId: 'CUS-41920',
    date: '2026-08-31',
    time: '14:10',
    description: 'Online Retail Apparel',
    payee: 'Myntra Fashion',
    amount: 3499,
    channel: 'UPI',
    location: 'Pune, MH',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'LOW'
  }
];

// 5. Rajesh Gupta - Multi-Correlated Anomalies (Odd-hours international merchant + sudden debit card channel switch)
const rajeshHistory = generateHistoricalTransactions(
  'CUS-55102',
  190,
  3100,
  900,
  ['Mother Dairy', 'Tata Power Delhi', 'BigBasket', 'Zomato Foods', 'Apollo Healthcare'],
  ['UPI', 'Net Banking'],
  'Delhi, DL',
  8,
  21
);

const rajeshRecent: Transaction[] = [
  {
    id: 'TXN-55102-2104',
    customerId: 'CUS-55102',
    date: '2026-08-31',
    time: '01:14',
    description: 'Cross-Border Digital Gaming Token Purchase',
    payee: 'Apex Offshore Merchant Ltd',
    amount: 68000,
    channel: 'Debit Card',
    location: 'London, UK (IP Gateway)',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'HIGH',
    triggeredRules: ['R01', 'R03', 'R04'],
    isOddHours: true,
    isNewPayee: true
  },
  {
    id: 'TXN-55102-2105',
    customerId: 'CUS-55102',
    date: '2026-08-31',
    time: '01:22',
    description: 'Cross-Border Digital Gaming Token Purchase',
    payee: 'Apex Offshore Merchant Ltd',
    amount: 72000,
    channel: 'Debit Card',
    location: 'London, UK (IP Gateway)',
    accountType: 'Savings',
    payeeStatus: 'New',
    riskLevel: 'HIGH',
    triggeredRules: ['R01', 'R02', 'R03', 'R04'],
    isOddHours: true,
    isNewPayee: true
  }
];

export const CUSTOMER_PROFILES: Record<string, CustomerProfile> = {
  'CUS-10482': {
    id: 'CUS-10482',
    name: 'Arun Kumar',
    accountNumber: '**** 4821',
    accountType: 'Savings',
    customerSince: '2019-03-14',
    kycStatus: 'Verified',
    branch: 'T. Nagar Branch, Chennai',
    riskCategory: 'Low Risk',
    scenarioType: 'high_risk',
    scenarioLabel: 'High Risk: Rapid Outbound Burst to New Beneficiary',
    baseline: {
      meanAmount: 2450,
      medianAmount: 1850,
      stdDev: 920,
      monthlyFrequency: 42,
      activeHoursStart: 8,
      activeHoursEnd: 22,
      commonPayees: ['FreshMart Groceries', 'Amazon India', 'Swiggy Food Delivery', 'TNEB Electricity Board', 'Rent - Landlord Suresh'],
      commonChannels: ['UPI', 'Debit Card', 'NEFT'],
      typicalLocations: ['Chennai, TN'],
      totalHistoricalTransactions: 140,
      largestHistoricalTxn: 8500,
      hasSufficientData: true
    }
  },
  'CUS-20831': {
    id: 'CUS-20831',
    name: 'Priya Sharma',
    accountNumber: '**** 8319',
    accountType: 'Current',
    customerSince: '2021-06-18',
    kycStatus: 'Verified',
    branch: 'Fort Commercial Branch, Mumbai',
    riskCategory: 'Low Risk',
    scenarioType: 'ambiguous',
    scenarioLabel: 'Ambiguous / Legitimate Recurring Large Vendor Context',
    baseline: {
      meanAmount: 8200,
      medianAmount: 6500,
      stdDev: 14200,
      monthlyFrequency: 55,
      activeHoursStart: 9,
      activeHoursEnd: 20,
      commonPayees: ['Gujarat Wholesale Weaving Co', 'Sharma Textiles Raw Material', 'Logistics Prime', 'State GST Portal'],
      commonChannels: ['NEFT', 'Net Banking'],
      typicalLocations: ['Mumbai, MH'],
      totalHistoricalTransactions: 162,
      largestHistoricalTxn: 100000,
      regularLargePaymentPattern: true,
      hasSufficientData: true
    }
  },
  'CUS-30914': {
    id: 'CUS-30914',
    name: 'Vikram Rao',
    accountNumber: '**** 9140',
    accountType: 'Salary',
    customerSince: '2020-11-05',
    kycStatus: 'Verified',
    branch: 'Indiranagar Branch, Bengaluru',
    riskCategory: 'Low Risk',
    scenarioType: 'clean',
    scenarioLabel: 'Clean / Baseline Compliant: No Material Anomalies',
    baseline: {
      meanAmount: 1800,
      medianAmount: 1450,
      stdDev: 520,
      monthlyFrequency: 38,
      activeHoursStart: 8,
      activeHoursEnd: 21,
      commonPayees: ['Reliance Fresh', 'Metro Rail Recharge', 'Apollo Pharmacy', 'Airtel Payments'],
      commonChannels: ['UPI', 'Debit Card'],
      typicalLocations: ['Bengaluru, KA'],
      totalHistoricalTransactions: 120,
      largestHistoricalTxn: 5200,
      hasSufficientData: true
    }
  },
  'CUS-41920': {
    id: 'CUS-41920',
    name: 'Meera Patel',
    accountNumber: '**** 9204',
    accountType: 'Savings',
    customerSince: '2026-08-20',
    kycStatus: 'Verified',
    branch: 'Shivajinagar Branch, Pune',
    riskCategory: 'Medium Risk',
    scenarioType: 'insufficient_data',
    scenarioLabel: 'Insufficient Evidence / New Account (Sparse Baseline)',
    baseline: {
      meanAmount: 4590,
      medianAmount: 3499,
      stdDev: 3900,
      monthlyFrequency: 3,
      activeHoursStart: 8,
      activeHoursEnd: 22,
      commonPayees: ['Self Account Transfer', 'Coffee Day Cafe', 'Myntra Fashion'],
      commonChannels: ['NEFT', 'Debit Card', 'UPI'],
      typicalLocations: ['Pune, MH'],
      totalHistoricalTransactions: 3,
      largestHistoricalTxn: 10000,
      hasSufficientData: false
    }
  },
  'CUS-55102': {
    id: 'CUS-55102',
    name: 'Rajesh Gupta',
    accountNumber: '**** 5102',
    accountType: 'Savings',
    customerSince: '2018-01-22',
    kycStatus: 'Verified',
    branch: 'Connaught Place Branch, New Delhi',
    riskCategory: 'Low Risk',
    scenarioType: 'multi_correlated',
    scenarioLabel: 'Multi-Correlated: Odd-Hours Offshore & Channel Shift',
    baseline: {
      meanAmount: 3100,
      medianAmount: 2200,
      stdDev: 1100,
      monthlyFrequency: 60,
      activeHoursStart: 8,
      activeHoursEnd: 21,
      commonPayees: ['Mother Dairy', 'Tata Power Delhi', 'BigBasket', 'Zomato Foods'],
      commonChannels: ['UPI', 'Net Banking'],
      typicalLocations: ['Delhi, DL'],
      totalHistoricalTransactions: 190,
      largestHistoricalTxn: 9500,
      hasSufficientData: true
    }
  }
};

export const ALL_CUSTOMER_TRANSACTIONS: Record<string, { history: Transaction[]; recent: Transaction[] }> = {
  'CUS-10482': { history: arunHistory, recent: arunRecent },
  'CUS-20831': { history: priyaHistory, recent: priyaRecent },
  'CUS-30914': { history: vikramHistory, recent: vikramRecent },
  'CUS-41920': { history: meeraHistory, recent: [] },
  'CUS-55102': { history: rajeshHistory, recent: rajeshRecent }
};

export const INITIAL_INVESTIGATIONS: InvestigationCase[] = [
  {
    id: 'INV-2026-0891',
    customerId: 'CUS-10482',
    customerName: 'Arun Kumar',
    accountNumber: '**** 4821',
    createdAt: '2026-08-31 03:05 AM',
    updatedAt: '2026-08-31 03:10 AM',
    priority: 'HIGH',
    priorityScore: 86,
    status: 'PENDING',
    triggeredRuleCount: 4,
    flaggedTxnCount: 3,
    totalFlaggedAmount: 110000,
    slaTargetMinutes: 60,
    slaMinutesRemaining: 18,
    slaStatus: 'CRITICAL',
    assignedInvestigator: 'R. Deshmukh (Lead Triage)'
  },
  {
    id: 'INV-2026-0885',
    customerId: 'CUS-55102',
    customerName: 'Rajesh Gupta',
    accountNumber: '**** 5102',
    createdAt: '2026-08-31 01:30 AM',
    updatedAt: '2026-08-31 01:45 AM',
    priority: 'HIGH',
    priorityScore: 82,
    status: 'ESCALATED',
    investigatorName: 'S. Nambiar (ID: 4402)',
    decisionNotes: 'Escalated to Cyber Fraud Liaison Unit due to cross-border IP and nocturnal card displacement.',
    decidedAt: '2026-08-31 02:00 AM',
    triggeredRuleCount: 3,
    flaggedTxnCount: 2,
    totalFlaggedAmount: 140000,
    slaTargetMinutes: 60,
    slaMinutesRemaining: 34,
    slaStatus: 'WARNING',
    assignedInvestigator: 'S. Nambiar (Cyber Unit)'
  },
  {
    id: 'INV-2026-0879',
    customerId: 'CUS-20831',
    customerName: 'Priya Sharma',
    accountNumber: '**** 8319',
    createdAt: '2026-08-31 11:45 AM',
    updatedAt: '2026-08-31 12:00 PM',
    priority: 'LOW',
    priorityScore: 25,
    status: 'REVIEWED_NO_ACTION',
    investigatorName: 'K. Mehta (ID: 2981)',
    decisionNotes: 'Transfer of ₹1,00,000 matches verified recurring 1st of month fabric supplier invoice. Context reviewed, no fraud indicators.',
    decidedAt: '2026-08-31 12:05 PM',
    triggeredRuleCount: 0,
    flaggedTxnCount: 1,
    totalFlaggedAmount: 100000,
    slaTargetMinutes: 240,
    slaMinutesRemaining: 185,
    slaStatus: 'HEALTHY',
    assignedInvestigator: 'K. Mehta (SME Commercial)'
  },
  {
    id: 'INV-2026-0870',
    customerId: 'CUS-41920',
    customerName: 'Meera Patel',
    accountNumber: '**** 9204',
    createdAt: '2026-08-30 04:00 PM',
    updatedAt: '2026-08-30 04:15 PM',
    priority: 'LOW',
    priorityScore: 25,
    status: 'INFO_REQUESTED',
    investigatorName: 'S. Nambiar (ID: 4402)',
    decisionNotes: 'New account with sparse transaction history. Requested secondary bank statement and verified ID proof before expanding limits.',
    decidedAt: '2026-08-30 04:30 PM',
    triggeredRuleCount: 0,
    flaggedTxnCount: 1,
    totalFlaggedAmount: 3499,
    slaTargetMinutes: 240,
    slaMinutesRemaining: 210,
    slaStatus: 'HEALTHY',
    assignedInvestigator: 'S. Nambiar (ID: 4402)'
  },
  {
    id: 'INV-2026-0865',
    customerId: 'CUS-30914',
    customerName: 'Vikram Rao',
    accountNumber: '**** 9140',
    createdAt: '2026-08-31 10:20 AM',
    updatedAt: '2026-08-31 10:25 AM',
    priority: 'NORMAL',
    priorityScore: 0,
    status: 'REVIEWED_NO_ACTION',
    investigatorName: 'Automated Baseline Filter',
    decisionNotes: 'Clean customer profile. All debits within 1.0x mean; daytime hours and trusted merchants verified.',
    decidedAt: '2026-08-31 10:25 AM',
    triggeredRuleCount: 0,
    flaggedTxnCount: 0,
    totalFlaggedAmount: 0,
    slaTargetMinutes: 480,
    slaMinutesRemaining: 470,
    slaStatus: 'HEALTHY',
    assignedInvestigator: 'System Auto-Audit'
  }
];

export const MOCK_CUSTOMERS: CustomerProfile[] = Object.values(CUSTOMER_PROFILES);

export const MOCK_RECENT_TRANSACTIONS: Record<string, Transaction[]> = Object.fromEntries(
  Object.entries(ALL_CUSTOMER_TRANSACTIONS).map(([id, data]) => [id, data.recent])
);

export const MOCK_HISTORICAL_TRANSACTIONS: Record<string, Transaction[]> = Object.fromEntries(
  Object.entries(ALL_CUSTOMER_TRANSACTIONS).map(([id, data]) => [id, data.history])
);

