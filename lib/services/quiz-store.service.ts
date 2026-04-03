import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../firebase';
import { safeStorage } from '../utils/safe-storage';
import { GeneratedQuiz } from '../types/quiz.types';

const STORAGE_KEY = 'app-dev-framework-saved-quizzes';

export class QuizStoreService {
  /**
   * Save a quiz to Firestore + localStorage
   */
  static async save(userId: string, quiz: GeneratedQuiz): Promise<void> {
    // localStorage
    try {
      const existing = this.loadFromLocal();
      const updated = [quiz, ...existing.filter(q => q.id !== quiz.id)];
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Firestore
    if (userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        const docRef = doc(firestore, 'users', userId, 'quizzes', quiz.id);
        await setDoc(docRef, {
          ...quiz,
          createdAt: quiz.createdAt instanceof Date ? quiz.createdAt.toISOString() : quiz.createdAt,
          savedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Firestore quiz save error:', error);
      }
    }
  }

  /**
   * Load saved quizzes
   */
  static async load(userId: string): Promise<GeneratedQuiz[]> {
    if (userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        const colRef = collection(firestore, 'users', userId, 'quizzes');
        const q = query(colRef, orderBy('savedAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(d => {
            const data = d.data();
            return {
              ...data,
              createdAt: new Date(data.createdAt),
            } as GeneratedQuiz;
          });
        }
      } catch (error) {
        console.error('Firestore quiz load error:', error);
      }
    }

    return this.loadFromLocal();
  }

  /**
   * Delete a saved quiz
   */
  static async delete(userId: string, quizId: string): Promise<void> {
    // localStorage
    try {
      const existing = this.loadFromLocal();
      const updated = existing.filter(q => q.id !== quizId);
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Firestore
    if (userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        const docRef = doc(firestore, 'users', userId, 'quizzes', quizId);
        await deleteDoc(docRef);
      } catch (error) {
        console.error('Firestore quiz delete error:', error);
      }
    }
  }

  private static loadFromLocal(): GeneratedQuiz[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).map((q: GeneratedQuiz) => ({
          ...q,
          createdAt: new Date(q.createdAt),
        }));
      }
    } catch {}
    return [];
  }
}
