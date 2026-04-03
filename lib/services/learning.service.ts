import { QuizResult, LearningHistory } from '../types/progress.types';
import { safeStorage } from '../utils/safe-storage';

export class LearningService {
  private static readonly RESULTS_KEY = 'app-dev-framework-quiz-results';
  private static readonly HISTORY_KEY = 'app-dev-framework-learning-history';

  /**
   * Save quiz results (will be replaced with Firestore)
   */
  static async saveQuizResult(userId: string, result: Omit<QuizResult, 'id' | 'completedAt'>): Promise<void> {
    try {
      const quizResult: QuizResult = {
        ...result,
        id: this.generateId(),
        completedAt: new Date(),
      };

      const existingResults = await this.getQuizResults(userId);
      const updatedResults = [...existingResults, quizResult];

      safeStorage.setItem(this.RESULTS_KEY, JSON.stringify(updatedResults));
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }

  /**
   * Get all quiz results for a user
   */
  static async getQuizResults(userId: string): Promise<QuizResult[]> {
    try {
      const saved = safeStorage.getItem(this.RESULTS_KEY);
      if (saved) {
        const results = JSON.parse(saved);
        return results.map((r: QuizResult) => ({
          ...r,
          completedAt: new Date(r.completedAt),
        }));
      }
    } catch (error) {
      console.error('Error loading quiz results:', error);
    }

    return [];
  }

  /**
   * Get learning history for a user
   */
  static async getLearningHistory(userId: string): Promise<LearningHistory[]> {
    try {
      const saved = safeStorage.getItem(this.HISTORY_KEY);
      if (saved) {
        const history = JSON.parse(saved);
        return history.map((h: LearningHistory) => ({
          ...h,
          timestamp: new Date(h.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading learning history:', error);
    }

    return [];
  }

  /**
   * Add learning history entry
   */
  static async addLearningHistory(userId: string, entry: Omit<LearningHistory, 'id' | 'timestamp'>): Promise<void> {
    try {
      const historyEntry: LearningHistory = {
        ...entry,
        id: this.generateId(),
        timestamp: new Date(),
      };

      const existingHistory = await this.getLearningHistory(userId);
      const updatedHistory = [...existingHistory, historyEntry];

      safeStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding learning history:', error);
      throw error;
    }
  }

  /**
   * Get learning analytics for a user
   */
  static async getLearningAnalytics(userId: string): Promise<{
    totalQuizzes: number;
    averageScore: number;
    completedWords: Set<string>;
    accuracyByCEFR: Record<string, { correct: number; total: number }>;
    recentActivity: LearningHistory[];
  }> {
    const quizResults = await this.getQuizResults(userId);
    const history = await this.getLearningHistory(userId);

    const totalQuizzes = quizResults.length;
    const averageScore = totalQuizzes > 0
      ? quizResults.reduce((sum, result) => sum + result.score, 0) / totalQuizzes
      : 0;

    const completedWords = new Set<string>();
    quizResults.forEach(result => {
      result.questions.forEach(question => {
        if (question.isCorrect) {
          completedWords.add(question.word);
        }
      });
    });

    const accuracyByCEFR: Record<string, { correct: number; total: number }> = {};
    quizResults.forEach(result => {
      const cefrLevel = result.settings.cefrLevel;
      if (!accuracyByCEFR[cefrLevel]) {
        accuracyByCEFR[cefrLevel] = { correct: 0, total: 0 };
      }

      result.questions.forEach(question => {
        accuracyByCEFR[cefrLevel].total++;
        if (question.isCorrect) {
          accuracyByCEFR[cefrLevel].correct++;
        }
      });
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = history.filter(entry => entry.timestamp >= thirtyDaysAgo);

    return {
      totalQuizzes,
      averageScore,
      completedWords,
      accuracyByCEFR,
      recentActivity,
    };
  }

  /**
   * Get user's quiz history with pagination
   */
  static async getQuizHistory(userId: string, page: number = 1, limit: number = 10): Promise<{
    quizzes: QuizResult[];
    totalPages: number;
    totalCount: number;
  }> {
    const allQuizzes = await this.getQuizResults(userId);
    const totalCount = allQuizzes.length;
    const totalPages = Math.ceil(totalCount / limit);

    const sortedQuizzes = allQuizzes.sort((a, b) =>
      b.completedAt.getTime() - a.completedAt.getTime()
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const quizzes = sortedQuizzes.slice(startIndex, endIndex);

    return {
      quizzes,
      totalPages,
      totalCount,
    };
  }

  /**
   * Get words that a user has struggled with
   */
  static async getStruggleWords(userId: string, threshold: number = 0.5): Promise<Array<{
    word: string;
    attempts: number;
    correctAnswers: number;
    accuracy: number;
  }>> {
    const quizResults = await this.getQuizResults(userId);

    const wordStats: Record<string, { attempts: number; correctAnswers: number }> = {};

    quizResults.forEach(result => {
      result.questions.forEach(question => {
        if (!wordStats[question.word]) {
          wordStats[question.word] = { attempts: 0, correctAnswers: 0 };
        }
        wordStats[question.word].attempts++;
        if (question.isCorrect) {
          wordStats[question.word].correctAnswers++;
        }
      });
    });

    const struggleWords = Object.entries(wordStats)
      .map(([word, stats]) => ({
        word,
        attempts: stats.attempts,
        correctAnswers: stats.correctAnswers,
        accuracy: stats.correctAnswers / stats.attempts,
      }))
      .filter(wordData => wordData.accuracy < threshold && wordData.attempts >= 2)
      .sort((a, b) => a.accuracy - b.accuracy);

    return struggleWords;
  }

  /**
   * Get learning streak (consecutive days of activity)
   */
  static async getLearningStreak(userId: string): Promise<number> {
    const history = await this.getLearningHistory(userId);
    if (history.length === 0) return 0;

    const entriesByDate: Record<string, LearningHistory[]> = {};
    history.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      if (!entriesByDate[date]) {
        entriesByDate[date] = [];
      }
      entriesByDate[date].push(entry);
    });

    const sortedDates = Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    let currentDate = new Date();

    for (const date of sortedDates) {
      const dateObj = new Date(date);
      const daysDiff = Math.floor((currentDate.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
        currentDate = dateObj;
      } else if (daysDiff === streak + 1) {
        streak++;
        currentDate = dateObj;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Generate a unique ID for local storage entries
   */
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Clear all quiz results and learning history (for testing)
   */
  static async clearAllData(userId: string): Promise<void> {
    safeStorage.removeItem(this.RESULTS_KEY);
    safeStorage.removeItem(this.HISTORY_KEY);
  }
}
