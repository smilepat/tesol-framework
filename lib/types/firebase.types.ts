import { Timestamp } from 'firebase/firestore';

// Firebase document types
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'teacher';
  createdAt: Timestamp;
  lastActive: Timestamp;
}

export interface FirestoreProgress extends FirestoreDocument {
  userId: string;
  steps: Record<string, ProgressStep>;
  lastStep: string;
  startedAt: Timestamp;
  lastUpdated: Timestamp;
}

export interface ProgressStep {
  tasks: Record<string, boolean>;
  completed: boolean;
  completedAt?: Timestamp;
}

export interface FirestoreVocabulary extends FirestoreDocument {
  word: string;
  meaning: string;
  meaningKo: string;
  example: string;
  cefrLevel: string;
  domain: string;
  sheetId?: string;
  syncedAt?: Timestamp;
}

export interface FirestoreQuizResult extends FirestoreDocument {
  userId: string;
  settings: {
    cefrLevel: string;
    wordCount: number;
    questionType: string;
  };
  questions: QuizQuestion[];
  score: number;
  total: number;
}

export interface QuizQuestion {
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidence?: number;
  timeTaken?: number;
}

export interface FirestoreLearningHistory extends FirestoreDocument {
  userId: string;
  word: string;
  answer: string;
  correct: boolean;
  score: number;
  context?: string;
}
