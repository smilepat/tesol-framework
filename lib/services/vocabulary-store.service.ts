import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../firebase';
import { safeStorage } from '../utils/safe-storage';
import { CsvRow } from '../types/quiz.types';

const STORAGE_KEY = 'app-dev-framework-vocabulary';

export class VocabularyStoreService {
  /**
   * Load vocabulary - Firestore first, localStorage fallback
   */
  static async load(userId: string): Promise<CsvRow[]> {
    if (userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        const colRef = collection(firestore, 'users', userId, 'vocabulary');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          return snapshot.docs.map(d => d.data() as CsvRow);
        }
      } catch (error) {
        console.error('Firestore vocabulary load error:', error);
      }
    }

    // localStorage fallback
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  }

  /**
   * Save vocabulary - both Firestore and localStorage
   */
  static async save(userId: string, words: CsvRow[]): Promise<void> {
    // Always save to localStorage
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(words));

    // Save to Firestore for authenticated users
    if (userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        // Clear existing and re-write (simple approach for now)
        const colRef = collection(firestore, 'users', userId, 'vocabulary');
        const existing = await getDocs(colRef);
        const deletePromises = existing.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);

        const writePromises = words.map((word, i) => {
          const docRef = doc(colRef, `word-${i}`);
          return setDoc(docRef, { ...word, updatedAt: serverTimestamp() });
        });
        await Promise.all(writePromises);
      } catch (error) {
        console.error('Firestore vocabulary save error:', error);
      }
    }
  }

  /**
   * Add words (append to existing)
   */
  static async addWords(userId: string, newWords: CsvRow[]): Promise<CsvRow[]> {
    const existing = await this.load(userId);
    const combined = [...existing, ...newWords];
    await this.save(userId, combined);
    return combined;
  }

  /**
   * Delete a word by index
   */
  static async deleteWord(userId: string, words: CsvRow[], index: number): Promise<CsvRow[]> {
    const updated = words.filter((_, i) => i !== index);
    await this.save(userId, updated);
    return updated;
  }
}
