import { KNOWLEDGE_DOCS } from '../data/mockData';
import { KnowledgeDocument } from '../types';

export const RISK_HANDBOOK_CHUNKS = KNOWLEDGE_DOCS;

export interface RagSearchResult {
  doc: KnowledgeDocument;
  score: number;
  matchedSnippets: string;
}

export class LocalRagService {
  /**
   * Performs semantic / keyword vector similarity matching against local banking handbooks.
   */
  static search(query: string, limit = 3): RagSearchResult[] {
    const queryTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 2);

    const scored = KNOWLEDGE_DOCS.map(doc => {
      let score = 0;
      const text = `${doc.title} ${doc.section} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

      // Keyword boost
      doc.keywords.forEach(kw => {
        if (query.toLowerCase().includes(kw.toLowerCase())) {
          score += 5;
        }
      });

      // Token overlap frequency
      queryTokens.forEach(token => {
        const regex = new RegExp(`\\b${token}`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length * 1.5;
        }
      });

      return {
        doc,
        score,
        matchedSnippets: doc.content.slice(0, 180) + '...'
      };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Retrieves relevant guidance for specific triggered rules.
   */
  static getGuidanceForRules(ruleIds: string[]): KnowledgeDocument[] {
    return KNOWLEDGE_DOCS.filter(doc => {
      return ruleIds.some(rId => doc.keywords.includes(rId) || doc.title.includes(rId));
    });
  }
}
