import { VocabWord, VocabularyFilters } from '../types/vocabulary.types';

export class VocabularyService {
  // Mock data for development - will be replaced with Firestore in Phase 3
  private static mockData: VocabWord[] = [
    {
      word: "environment",
      meaning: "The surroundings or conditions in which a person lives",
      meaningKo: "환경",
      example: "We must protect the environment for future generations.",
      cefrLevel: "B1",
      domain: "academic",
    },
    {
      word: "significant",
      meaning: "Sufficiently great or important to be worthy of attention",
      meaningKo: "중요한, 의미 있는",
      example: "There has been a significant increase in temperature.",
      cefrLevel: "B2",
      domain: "academic",
    },
    {
      word: "consequence",
      meaning: "A result or effect of an action or condition",
      meaningKo: "결과, 영향",
      example: "Climate change has serious consequences for all of us.",
      cefrLevel: "B2",
      domain: "academic",
    },
    {
      word: "hypothesis",
      meaning: "A proposed explanation made on the basis of limited evidence",
      meaningKo: "가설",
      example: "The scientist tested her hypothesis through experiments.",
      cefrLevel: "C1",
      domain: "academic",
    },
    {
      word: "collaborate",
      meaning: "To work jointly on an activity or project",
      meaningKo: "협력하다",
      example: "Students collaborate on group projects every week.",
      cefrLevel: "B2",
      domain: "academic",
    },
  ];

  /**
   * Get all vocabulary words with optional filtering
   */
  static async getWords(filters?: VocabularyFilters): Promise<VocabWord[]> {
    if (!filters) {
      return this.mockData;
    }

    return this.mockData.filter(word => {
      if (filters.cefrLevel && word.cefrLevel !== filters.cefrLevel) {
        return false;
      }
      if (filters.domain && word.domain !== filters.domain) {
        return false;
      }
      if (filters.word && !word.word.toLowerCase().includes(filters.word.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get a single vocabulary word by ID
   */
  static async getWordById(id: string): Promise<VocabWord | null> {
    return this.mockData.find(word => word.word === id) || null;
  }

  /**
   * Add a new vocabulary word (for teachers)
   */
  static async addWord(word: Omit<VocabWord, 'id'>): Promise<VocabWord> {
    const newWord: VocabWord = {
      ...word,
      id: undefined,
    };
    this.mockData.push(newWord);
    return newWord;
  }

  /**
   * Update an existing vocabulary word (for teachers)
   */
  static async updateWord(id: string, updates: Partial<VocabWord>): Promise<VocabWord | null> {
    const index = this.mockData.findIndex(word => word.word === id);
    if (index === -1) {
      return null;
    }

    this.mockData[index] = { ...this.mockData[index], ...updates };
    return this.mockData[index];
  }

  /**
   * Delete a vocabulary word (for teachers)
   */
  static async deleteWord(id: string): Promise<boolean> {
    const index = this.mockData.findIndex(word => word.word === id);
    if (index === -1) {
      return false;
    }

    this.mockData.splice(index, 1);
    return true;
  }

  /**
   * Get unique CEFR levels from vocabulary
   */
  static getUniqueCEFRLevels(): string[] {
    const levels = [...new Set(this.mockData.map(word => word.cefrLevel))];
    return levels.sort();
  }

  /**
   * Get unique domains from vocabulary
   */
  static getUniqueDomains(): string[] {
    const domains = [...new Set(this.mockData.map(word => word.domain))];
    return domains.sort();
  }

  /**
   * Search vocabulary by keyword
   */
  static async searchWords(keyword: string): Promise<VocabWord[]> {
    const searchTerm = keyword.toLowerCase();
    return this.mockData.filter(word =>
      word.word.toLowerCase().includes(searchTerm) ||
      word.meaning.toLowerCase().includes(searchTerm) ||
      word.meaningKo.toLowerCase().includes(searchTerm) ||
      word.example.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get vocabulary by CEFR level
   */
  static async getByCEFRLevel(level: string): Promise<VocabWord[]> {
    return this.mockData.filter(word => word.cefrLevel === level);
  }

  /**
   * Get vocabulary by domain
   */
  static async getByDomain(domain: string): Promise<VocabWord[]> {
    return this.mockData.filter(word => word.domain === domain);
  }
}
