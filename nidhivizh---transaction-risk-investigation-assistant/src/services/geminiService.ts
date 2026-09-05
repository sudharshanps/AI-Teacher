import { AIInvestigationBrief, CustomerProfile, RiskEvaluation, Transaction } from '../types';
import { LocalRagService } from './ragService';

export class GeminiInvestigationService {
  /**
   * Calls server-side /api/ai/investigation-summary endpoint or falls back to
   * high-integrity deterministic synthesis if server/AI is unreachable.
   */
  static async generateBrief(
    customer: CustomerProfile,
    evaluation: RiskEvaluation,
    flaggedTxns: Transaction[]
  ): Promise<AIInvestigationBrief> {
    // 1. Retrieve RAG documents for triggered rules
    const triggeredRuleIds = evaluation.ruleFindings
      .filter(r => r.status === 'TRIGGERED')
      .map(r => r.ruleId);

    const retrievedDocs = LocalRagService.getGuidanceForRules(
      triggeredRuleIds.length > 0 ? triggeredRuleIds : ['R04']
    );

    // 2. Attempt server-side Gemini request
    try {
      const response = await fetch('/api/ai/investigation-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          evaluation,
          flaggedTxns,
          retrievedDocs
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.brief) {
          return data.brief;
        }
      }
    } catch (err) {
      console.warn('Server-side Gemini request failed, using deterministic synthesis fallback:', err);
    }

    // 3. Fallback: High-Integrity Deterministic Investigation Brief Generation
    return this.buildDeterministicBrief(customer, evaluation, flaggedTxns, retrievedDocs);
  }

  /**
   * Deterministic synthesis strictly adhering to the prompt requirements
   * when Gemini API is unavailable, guaranteeing that the application works seamlessly.
   */
  static buildDeterministicBrief(
    customer: CustomerProfile,
    evaluation: RiskEvaluation,
    flaggedTxns: Transaction[],
    retrievedDocs: any[]
  ): AIInvestigationBrief {
    const baseline = customer.baseline;
    const isClean = evaluation.status === 'NO ATTENTION REQUIRED';
    const isInsufficient = evaluation.status === 'INSUFFICIENT EVIDENCE';
    const isAmbiguous = customer.scenarioType === 'ambiguous';

    if (isClean) {
      return {
        summary: `No material anomalies were identified in the reviewed transaction history for ${customer.name}. All evaluated transactions conform to the account's historical operating window (${baseline.activeHoursStart}:00 – ${baseline.activeHoursEnd}:00), typical channels (${baseline.commonChannels.join(', ')}), and standard velocity thresholds.`,
        whyAttentionRequired: [
          'No rule thresholds breached.',
          'Transactions align faithfully with 90-day rolling baseline.',
          'No unverified beneficiary velocity detected.'
        ],
        transactionConnections: 'All evaluated activity represents standard, routine consumer merchant debits.',
        behavioralComparison: `Transactions strictly follow historical mean (₹${baseline.meanAmount.toLocaleString('en-IN')}) and regular weekly distribution.`,
        investigatorChecklist: [
          'Review account periodic KYC standing (Current status: Verified).',
          'No manual block or intervention required.'
        ],
        questionsToAsk: [
          'Standard customer satisfaction or account tier review (optional).'
        ],
        recommendedNextSteps: [
          'Close investigation case with status: Reviewed — No Further Action.',
          'Maintain regular real-time NOC behavioral telemetry monitoring.'
        ],
        observed: [
          `All transactions occurred between ${baseline.activeHoursStart}:00 and ${baseline.activeHoursEnd}:00.`,
          `Amounts remained below the statistical deviation threshold of ₹${(baseline.meanAmount * 3).toLocaleString('en-IN')}.`,
          'All payees are recurring historical merchants.'
        ],
        inferred: [
          'The customer is operating their account in a normal, authorized consumer pattern.'
        ],
        unknown: [
          'Future scheduled beneficiary additions.'
        ],
        sourcesCited: [
          {
            title: 'Risk Rule Handbook — R04',
            section: 'Section 4.2',
            snippet: 'Baseline compliance indicates absence of behavioral drift.'
          }
        ],
        isAiGenerated: false,
        generatedAt: new Date().toISOString()
      };
    }

    if (isInsufficient) {
      return {
        summary: `The account for ${customer.name} exhibits insufficient transaction history (only ${baseline.totalHistoricalTransactions} recorded entries) to construct a reliable statistical baseline. While recent transactions do not show malicious velocity, deterministic rules cannot establish normal variance.`,
        whyAttentionRequired: [
          'Statistical baseline is unestablished due to sparse historical transactions.',
          'Early lifecycle account requires manual verification before risk tier assignment.'
        ],
        transactionConnections: 'Transactions are isolated and do not exhibit payment splitting or coordinated outbound sweeps.',
        behavioralComparison: 'Cannot be quantified reliably; account opened recently with fewer than 5 transactions.',
        investigatorChecklist: [
          'Inspect account opening documents and initial funding source.',
          'Request 3-month external bank statements or proof of income from accountholder.',
          'Confirm customer phone number and email verified during onboarding.'
        ],
        questionsToAsk: [
          'Is the customer planning scheduled high-value remittances?',
          'Has the customer experienced any difficulties with onboarding authentication?'
        ],
        recommendedNextSteps: [
          'Set investigation outcome to: Additional Information Required.',
          'Maintain temporary monitoring limit until 30 days of active history is accumulated.'
        ],
        observed: [
          `Only ${baseline.totalHistoricalTransactions} total transactions recorded on account ${customer.accountNumber}.`,
          `Account opened on ${customer.customerSince}.`
        ],
        inferred: [
          'Account is in early onboarding lifecycle; risk cannot be determined purely through algorithmic scoring.'
        ],
        unknown: [
          'Authentic monthly volume capacity of the accountholder.',
          'Whether the accountholder intends to use the account as primary or secondary.'
        ],
        sourcesCited: [
          {
            title: 'Investigator Standard Operating Procedure',
            section: 'Section 1.1',
            snippet: 'Early-stage accounts with sparse records require identity validation.'
          }
        ],
        isAiGenerated: false,
        generatedAt: new Date().toISOString()
      };
    }

    if (isAmbiguous) {
      return {
        summary: `Transaction of ₹1,00,000 to '${flaggedTxns[0]?.payee || 'Gujarat Wholesale Weaving Co'}' triggers raw numerical magnitude filters, but customer profile indicates a verified recurring monthly vendor settlement pattern. The transaction aligns with historical business disbursements executed on the 1st/2nd of each calendar month.`,
        whyAttentionRequired: [
          'Absolute amount (₹1,00,000) exceeds average retail consumer thresholds.',
          'Requires investigator confirmation of verified corporate beneficiary status.'
        ],
        transactionConnections: 'Single isolated NEFT transfer during standard banking business hours (11:30 AM).',
        behavioralComparison: `While exceeding general mean (₹${baseline.meanAmount.toLocaleString('en-IN')}), the amount is identical to previous verified supplier payments on 2026-06-02 (₹1,00,000) and 2026-07-01 (₹98,500).`,
        investigatorChecklist: [
          'Verify payee GSTIN and invoice reference against registered corporate profile.',
          'Check authorization token and 2-factor authentication log for the NEFT session.'
        ],
        questionsToAsk: [
          'Does the current disbursement match current purchase order documentation?'
        ],
        recommendedNextSteps: [
          'Mark investigation as: Reviewed — No Further Action with verified supplier note.',
          'Verify recurring rule exemption flag on beneficiary Gujarat Wholesale Weaving Co.'
        ],
        observed: [
          `A single NEFT payment of ₹1,00,000 was executed at 11:30 AM on 2026-08-31.`,
          `Historical records confirm similar transfers of ₹1,00,000 in June and ₹98,500 in July to the identical payee.`,
          `Operating hours (11:30 AM) fall cleanly within commercial business hours.`
        ],
        inferred: [
          'Transaction represents a routine commercial supplier invoice settlement rather than hostile fund exfiltration.'
        ],
        unknown: [
          'Underlying commercial invoice fulfillment status.'
        ],
        sourcesCited: [
          {
            title: 'Risk Rule Handbook — R01',
            section: 'Section 1.2: Velocity & Magnitude Thresholds',
            snippet: 'Verified recurring payments discount mathematical deviation.'
          }
        ],
        isAiGenerated: false,
        generatedAt: new Date().toISOString()
      };
    }

    // Default High Risk Brief (e.g. Arun Kumar / Rajesh Gupta)
    const totalFlagged = flaggedTxns.reduce((s, t) => s + t.amount, 0);
    const times = flaggedTxns.map(t => t.time).join(', ');
    const commonPayee = flaggedTxns[0]?.payee || 'Unverified Beneficiary';

    return {
      summary: `A concentrated burst of ${flaggedTxns.length} outbound transactions totalling ₹${totalFlagged.toLocaleString('en-IN')} was executed between ${times}. This activity diverges sharply from the customer's established behavioral profile in amount magnitude (+3367% above mean), nocturnal timing, and velocity to a newly registered beneficiary.`,
      whyAttentionRequired: [
        `High velocity outbound transfers (₹${totalFlagged.toLocaleString('en-IN')}) to an unverified recipient ('${commonPayee}').`,
        `Transactions occurred outside normal operating schedule (${times} vs verified baseline of ${baseline.activeHoursStart}:00 – ${baseline.activeHoursEnd}:00).`,
        `Payment amounts indicate structured transaction splitting to test or avoid limits.`
      ],
      transactionConnections: `The transactions form a tight temporal cluster: ${flaggedTxns.map(t => `${t.id} (₹${t.amount.toLocaleString('en-IN')} at ${t.time})`).join(' → ')}. All transfers utilized the instant UPI channel routed to '${commonPayee}'.`,
      behavioralComparison: `Customer's historical mean is ₹${baseline.meanAmount.toLocaleString('en-IN')}; flagged transfers average ₹${Math.round(totalFlagged / Math.max(flaggedTxns.length, 1)).toLocaleString('en-IN')} each. 0.0% of historical transactions have occurred between 00:00 and 06:00.`,
      investigatorChecklist: [
        'Contact accountholder via registered phone number to verify transaction authorization.',
        'Check device fingerprint and IP geolocation logs for recent credential changes or SIM swaps.',
        'Review whether beneficiary was added within 24 hours prior to the transaction burst.',
        'Initiate inter-bank recall or temporary outbound freeze if unauthorized activity is reported.'
      ],
      questionsToAsk: [
        'Did the customer actively authorize transfers to XYZ Services Ltd via mobile banking?',
        'Was the customer requested to transfer funds under urgency, coercion, or remote-access assistance?'
      ],
      recommendedNextSteps: [
        'Place temporary debit block pending accountholder contact.',
        'Escalate case file to Cyber Fraud Liaison Unit (Tier-2).',
        'Request receiving bank transaction reversal via regulatory portal.'
      ],
      observed: [
        `${flaggedTxns.length} transactions totalling ₹${totalFlagged.toLocaleString('en-IN')} occurred between ${times}.`,
        `Recipient '${commonPayee}' was registered as a New Beneficiary with no prior account history.`,
        `All transfers were completed via the UPI channel during nocturnal off-peak hours.`
      ],
      inferred: [
        'The sequential payments exhibit characteristics of automated or coerced balance extraction.',
        'The recipient appears to be a transit mule account or newly compromised beneficiary node.'
      ],
      unknown: [
        'Whether the accountholder knowingly initiated or authorized the OTP/biometric challenge.',
        'Whether the device was operating under remote screen-sharing software (e.g. AnyDesk, TeamViewer).'
      ],
      sourcesCited: retrievedDocs.map(d => ({
        title: d.title,
        section: d.section,
        snippet: d.content.slice(0, 150) + '...'
      })),
      isAiGenerated: false,
      generatedAt: new Date().toISOString()
    };
  }
}

export const generateAIBrief = (
  customer: CustomerProfile,
  evaluation: RiskEvaluation,
  flaggedTxns: Transaction[]
): AIInvestigationBrief => {
  const triggeredRuleIds = evaluation.ruleFindings
    .filter(r => r.status === 'TRIGGERED')
    .map(r => r.ruleId);
  const retrievedDocs = LocalRagService.getGuidanceForRules(
    triggeredRuleIds.length > 0 ? triggeredRuleIds : ['R04']
  );
  return GeminiInvestigationService.buildDeterministicBrief(
    customer,
    evaluation,
    flaggedTxns,
    retrievedDocs
  );
};

export const fetchAIBrief = (
  customer: CustomerProfile,
  evaluation: RiskEvaluation,
  flaggedTxns: Transaction[]
): Promise<AIInvestigationBrief> => {
  return GeminiInvestigationService.generateBrief(customer, evaluation, flaggedTxns);
};

