import { StepId } from './step.types';

export interface ProgressStep {
  tasks: Record<string, boolean>;
  completed: boolean;
  completedAt?: Date;
}

export interface UserProgress {
  userId: string;
  steps: Record<StepId, ProgressStep>;
  lastStep: StepId;
  startedAt: Date;
  lastUpdated: Date;
}

export interface QuizResult {
  id?: string;
  userId: string;
  settings: {
    cefrLevel: string;
    wordCount: number;
    questionType: string;
  };
  questions: QuizQuestion[];
  score: number;
  total: number;
  completedAt: Date;
}

export interface QuizQuestion {
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidence?: number;
  timeTaken?: number; // in seconds
}

export interface LearningHistory {
  id?: string;
  userId: string;
  word: string;
  answer: string;
  correct: boolean;
  score: number;
  timestamp: Date;
  context?: string; // Additional context about the learning session
}

export interface ProgressAnalytics {
  userId: string;
  overallCompletion: number;
  stepCompletions: Record<StepId, number>;
  totalTasks: number;
  completedTasks: number;
  averageQuizScore: number;
  totalQuizzes: number;
  lastActive: Date;
  streakDays?: number; // Consecutive days of activity
}
