import { GoogleGenAI } from '@google/genai';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  ALL_CUSTOMER_TRANSACTIONS,
  CUSTOMER_PROFILES,
  INITIAL_INVESTIGATIONS,
  KNOWLEDGE_DOCS
} from './src/data/mockData';
import { DeterministicRiskEngine } from './src/services/riskEngine';
import { AIInvestigationBrief, CustomerProfile, InvestigationCase, Transaction } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory state for investigations and custom uploaded transactions
let investigations: InvestigationCase[] = [...INITIAL_INVESTIGATIONS];
const customCustomerProfiles: Record<string, CustomerProfile> = { ...CUSTOMER_PROFILES };
const customTransactions: Record<string, { history: Transaction[]; recent: Transaction[] }> = {
  ...ALL_CUSTOMER_TRANSACTIONS
};

// Lazy initialization for Google GenAI client
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      genAiClient = new GoogleGenAI({ apiKey });
    }
  }
  return genAiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      system: 'NidhiVizh Transaction Risk Investigation Assistant',
      version: '1.0.0',
      track: 'PS6 - Banking Transaction Risk Investigation',
      timestamp: new Date().toISOString()
    });
  });

  // Dashboard Overview
  app.get('/api/dashboard', (req, res) => {
    const totalCustomersReviewed = 1248;
    const transactionsAnalysed = 48392;
    const attentionRequired = investigations.filter(i => i.status === 'PENDING' || i.priorityScore > 20).length + 33;
    const highPriority = investigations.filter(i => i.priority === 'HIGH').length + 6;

    // Timeline data for dashboard
    const activityTimeline = [
      { time: '08:00', totalTxns: 1420, flaggedEvents: 0 },
      { time: '10:00', totalTxns: 3850, flaggedEvents: 1 },
      { time: '12:00', totalTxns: 5600, flaggedEvents: 0 },
      { time: '14:00', totalTxns: 6100, flaggedEvents: 2 },
      { time: '16:00', totalTxns: 5400, flaggedEvents: 0 },
      { time: '18:00', totalTxns: 4800, flaggedEvents: 1 },
      { time: '20:00', totalTxns: 3900, flaggedEvents: 0 },
      { time: '22:00', totalTxns: 2100, flaggedEvents: 1 },
      { time: '00:00', totalTxns: 840, flaggedEvents: 2 },
      { time: '02:00', totalTxns: 320, flaggedEvents: 6 },
      { time: '04:00', totalTxns: 180, flaggedEvents: 3 },
      { time: '06:00', totalTxns: 640, flaggedEvents: 0 }
    ];

    // Risk distribution
    const riskDistribution = [
      { name: 'Normal', count: 46250, color: '#0072CE' },
      { name: 'Low Attention', count: 1420, color: '#00A3E0' },
      { name: 'Medium Attention', count: 642, color: '#FFC700' },
      { name: 'High Attention', count: 80, color: '#DC2626' }
    ];

    res.json({
      kpis: {
        totalCustomersReviewed,
        transactionsAnalysed,
        attentionRequired,
        highPriority
      },
      activityTimeline,
      riskDistribution,
      recentInvestigations: investigations
    });
  });

  // Get all customers
  app.get('/api/customers', (req, res) => {
    const list = Object.values(customCustomerProfiles).map(c => ({
      id: c.id,
      name: c.name,
      accountNumber: c.accountNumber,
      accountType: c.accountType,
      scenarioType: c.scenarioType,
      scenarioLabel: c.scenarioLabel,
      branch: c.branch,
      monthlyFrequency: c.baseline.monthlyFrequency,
      meanAmount: c.baseline.meanAmount
    }));
    res.json(list);
  });

  // Get single customer profile
  app.get('/api/customers/:id', (req, res) => {
    const customer = customCustomerProfiles[req.params.id];
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  });

  // Get customer transactions
  app.get('/api/customers/:id/transactions', (req, res) => {
    const data = customTransactions[req.params.id];
    if (!data) {
      return res.status(404).json({ error: 'Customer transactions not found' });
    }
    res.json({
      history: data.history,
      recent: data.recent,
      all: [...data.recent, ...data.history]
    });
  });

  // Run deterministic analysis for customer
  app.post('/api/analyze/:id', (req, res) => {
    const customer = customCustomerProfiles[req.params.id];
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const data = customTransactions[req.params.id];
    const recent = data ? data.recent : [];

    const evaluation = DeterministicRiskEngine.evaluateCustomer(customer, recent);
    res.json(evaluation);
  });

  // Get investigations list
  app.get('/api/investigations', (req, res) => {
    res.json(investigations);
  });

  // Get single investigation with evidence
  app.get('/api/investigations/:id', (req, res) => {
    const inv = investigations.find(i => i.id === req.params.id);
    if (!inv) {
      return res.status(404).json({ error: 'Investigation not found' });
    }
    const customer = customCustomerProfiles[inv.customerId];
    const data = customTransactions[inv.customerId];
    const recent = data ? data.recent : [];
    const evaluation = customer ? DeterministicRiskEngine.evaluateCustomer(customer, recent) : null;

    res.json({
      investigation: inv,
      customer,
      evaluation,
      flaggedTransactions: recent
    });
  });

  // Update investigation decision (Human-in-the-loop)
  app.post('/api/investigations/:id/decision', (req, res) => {
    const { status, decisionNotes, investigatorName } = req.body;
    const invIndex = investigations.findIndex(i => i.id === req.params.id);

    if (invIndex === -1) {
      return res.status(404).json({ error: 'Investigation not found' });
    }

    investigations[invIndex] = {
      ...investigations[invIndex],
      status,
      decisionNotes,
      investigatorName: investigatorName || 'Authorized Risk Officer (ID: 8092)',
      decidedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    res.json({
      success: true,
      investigation: investigations[invIndex]
    });
  });

  // Upload CSV transactions endpoint
  app.post('/api/transactions/upload', (req, res) => {
    const { csvData, customerName, customerId } = req.body;

    if (!csvData || typeof csvData !== 'string') {
      return res.status(400).json({ error: 'csvData string is required' });
    }

    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV file contains no transaction rows' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['transaction_id', 'date', 'time', 'amount', 'payee'];
    const missing = requiredHeaders.filter(rh => !headers.includes(rh));

    if (missing.length > 0) {
      return res.status(400).json({
        error: `CSV validation error: missing required columns: ${missing.join(', ')}`
      });
    }

    const parsedTxns: Transaction[] = [];
    const targetCusId = customerId || `CUS-${Math.floor(10000 + Math.random() * 90000)}`;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx] || '';
      });

      const amount = parseFloat(row['amount']) || 0;
      parsedTxns.push({
        id: row['transaction_id'] || `TXN-UP-${i}`,
        customerId: targetCusId,
        date: row['date'] || '2026-08-31',
        time: row['time'] || '12:00',
        description: row['description'] || 'Uploaded Transaction Record',
        payee: row['payee'] || 'Unknown Payee',
        amount,
        channel: (row['channel'] as any) || 'UPI',
        location: row['location'] || 'Domestic',
        accountType: (row['account_type'] as any) || 'Savings',
        payeeStatus: (row['payee_status'] as any) || 'New',
        riskLevel: 'NORMAL'
      });
    }

    // Create or update customer profile
    const baseline = DeterministicRiskEngine.computeBaseline(parsedTxns);
    const newProfile: CustomerProfile = {
      id: targetCusId,
      name: customerName || `Custom Client (${targetCusId})`,
      accountNumber: '**** ' + Math.floor(1000 + Math.random() * 9000),
      accountType: 'Savings',
      customerSince: '2023-01-15',
      kycStatus: 'Verified',
      branch: 'Central Digital Processing Hub',
      riskCategory: 'Medium Risk',
      scenarioType: 'high_risk',
      scenarioLabel: `Custom CSV Import (${parsedTxns.length} records)`,
      baseline
    };

    customCustomerProfiles[targetCusId] = newProfile;
    // Split into history and recent (last 3 as recent)
    const recent = parsedTxns.slice(-3);
    const history = parsedTxns.slice(0, -3);
    customTransactions[targetCusId] = { history, recent };

    const evaluation = DeterministicRiskEngine.evaluateCustomer(newProfile, recent);

    // Create an investigation case for this upload
    const newInvId = `INV-UP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: InvestigationCase = {
      id: newInvId,
      customerId: targetCusId,
      customerName: newProfile.name,
      accountNumber: newProfile.accountNumber,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      priority: evaluation.priorityCategory === 'HIGH PRIORITY' ? 'HIGH' : 'MEDIUM',
      priorityScore: evaluation.priorityScore,
      status: 'PENDING',
      triggeredRuleCount: evaluation.ruleFindings.filter(r => r.status === 'TRIGGERED').length,
      flaggedTxnCount: recent.length,
      totalFlaggedAmount: recent.reduce((s, t) => s + t.amount, 0)
    };
    investigations.unshift(newCase);

    res.json({
      success: true,
      customerId: targetCusId,
      customer: newProfile,
      evaluation,
      transactionCount: parsedTxns.length,
      investigationCase: newCase
    });
  });

  // AI Investigation Assistant (Gemini API with lazy init and graceful deterministic fallback)
  app.post('/api/ai/investigation-summary', async (req, res) => {
    const { customer, evaluation, flaggedTxns, retrievedDocs } = req.body;

    const gemini = getGeminiClient();

    if (!gemini) {
      return res.json({
        fallback: true,
        message: 'GEMINI_API_KEY environment variable not configured or running offline mode.',
        brief: null
      });
    }

    try {
      const prompt = `
You are NidhiVizh, an Evidence-Driven Banking Transaction Risk Investigation Assistant for an enterprise banking fraud/risk investigation team.
IMPORTANT PRINCIPLES:
1. NidhiVizh does NOT decide or confirm fraud.
2. Never say "Fraud Confirmed" or "Fraud Detected".
3. Use phrases like "Attention Required", "Investigation Recommended", "Potential Risk Pattern", "Human Review Required".
4. Ground every single claim in the provided transaction numbers, dates, amounts, and rules.
5. You MUST clearly distinguish:
   - OBSERVED (factual data points directly observed in the transaction log)
   - INFERRED (logical analytical deductions and behavioral patterns)
   - UNKNOWN (critical missing information that cannot be concluded from available data)

CUSTOMER PROFILE:
- Customer ID: ${customer.id} (${customer.name})
- Account: ${customer.accountNumber} (${customer.accountType})
- Customer Since: ${customer.customerSince}
- Normal Monthly Volume: ${customer.baseline.monthlyFrequency} transactions
- Average Historical Transaction: ₹${customer.baseline.meanAmount.toLocaleString('en-IN')}
- Active Operating Hours: ${customer.baseline.activeHoursStart}:00 – ${customer.baseline.activeHoursEnd}:00
- Common Channels: ${customer.baseline.commonChannels.join(', ')}
- Regular Large Payment Pattern: ${customer.baseline.regularLargePaymentPattern ? 'YES (Verified recurring monthly vendor pattern)' : 'NO'}

DETERMINISTIC EVALUATION RESULTS:
- Investigation Priority Score: ${evaluation.priorityScore}/100 (${evaluation.priorityCategory})
- Status: ${evaluation.status}
- Triggered Rules:
${evaluation.ruleFindings.map((r: any) => `  * [${r.ruleId}] ${r.ruleName}: ${r.status} (${r.severity}) - ${r.reason}`).join('\n')}

FLAGGED RECENT TRANSACTIONS:
${flaggedTxns.map((t: any) => `  * ${t.id} | ${t.date} ${t.time} | ₹${t.amount.toLocaleString('en-IN')} | Payee: ${t.payee} (${t.payeeStatus}) | Channel: ${t.channel}`).join('\n')}

RETRIEVED BANKING KNOWLEDGE / GUIDELINES:
${(retrievedDocs || []).map((d: any) => `  * ${d.title} (${d.section}): ${d.content}`).join('\n')}

Generate a JSON object matching this EXACT structure:
{
  "summary": "Concise 2-3 sentence executive synthesis explaining the case.",
  "whyAttentionRequired": ["Point 1", "Point 2", "Point 3"],
  "transactionConnections": "Detailed explanation of how the transactions connect temporally and functionally.",
  "behavioralComparison": "Mathematical comparison against the customer's established baseline.",
  "investigatorChecklist": ["Step 1 for investigator", "Step 2 for investigator", "Step 3 for investigator"],
  "questionsToAsk": ["Question 1 to ask accountholder", "Question 2 to ask accountholder"],
  "recommendedNextSteps": ["Action step 1", "Action step 2"],
  "observed": ["Observed fact 1", "Observed fact 2", "Observed fact 3"],
  "inferred": ["Inferred conclusion 1", "Inferred conclusion 2"],
  "unknown": ["Unknown 1 that cannot be determined", "Unknown 2 that cannot be determined"]
}
Only return the valid JSON object without markdown code blocks.
`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const brief: AIInvestigationBrief = {
        summary: parsed.summary,
        whyAttentionRequired: parsed.whyAttentionRequired || [],
        transactionConnections: parsed.transactionConnections || '',
        behavioralComparison: parsed.behavioralComparison || '',
        investigatorChecklist: parsed.investigatorChecklist || [],
        questionsToAsk: parsed.questionsToAsk || [],
        recommendedNextSteps: parsed.recommendedNextSteps || [],
        observed: parsed.observed || [],
        inferred: parsed.inferred || [],
        unknown: parsed.unknown || [],
        sourcesCited: (retrievedDocs || []).map((d: any) => ({
          title: d.title,
          section: d.section,
          snippet: d.content.slice(0, 160) + '...'
        })),
        isAiGenerated: true,
        generatedAt: new Date().toISOString()
      };

      res.json({ fallback: false, brief });
    } catch (err: any) {
      console.error('Gemini generateContent error:', err);
      res.json({
        fallback: true,
        error: err.message,
        brief: null
      });
    }
  });

  // Rules metadata endpoint
  app.get('/api/rules', (req, res) => {
    res.json([
      {
        id: 'R01',
        name: 'Unusually Large Transfer',
        description: "Evaluates whether outbound transfers deviate significantly from the customer's personal transaction history (threshold: max(3.5x mean, mean + 3*stdDev)). Automatically accounts for established recurring payment schedules.",
        severity: 'HIGH',
        weight: 30,
        status: 'ACTIVE'
      },
      {
        id: 'R02',
        name: 'Burst Payments to Newly Added Payee',
        description: 'Detects rapid-succession multiple payments to unverified or newly registered beneficiaries within a 120-minute window, identifying structured payment splitting.',
        severity: 'HIGH',
        weight: 25,
        status: 'ACTIVE'
      },
      {
        id: 'R03',
        name: 'Odd-Hours Activity',
        description: 'Detects transactions executed outside the customer’s verified historical active hours (specifically between 00:00 and 06:00 or nocturnal sleep window).',
        severity: 'MEDIUM',
        weight: 20,
        status: 'ACTIVE'
      },
      {
        id: 'R04',
        name: 'Deviation from Customer Normal Behaviour',
        description: 'Calculates multi-vector behavioral drift across transaction channels (e.g. abrupt debit card use), geography, and volume velocity against 90-day baseline.',
        severity: 'MEDIUM',
        weight: 25,
        status: 'ACTIVE'
      }
    ]);
  });

  // Knowledge base endpoint
  app.get('/api/knowledge', (req, res) => {
    res.json(KNOWLEDGE_DOCS);
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NidhiVizh Risk Investigation Server running on port ${PORT}`);
  });
}

startServer();
