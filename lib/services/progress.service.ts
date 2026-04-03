import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore, isFirebaseConfigured } from '../firebase';
import { StepId } from '../types/step.types';
import { UserProgress, ProgressStep } from '../types/progress.types';
import { safeStorage } from '../utils/safe-storage';

export class ProgressService {
  private static readonly STORAGE_KEY = 'app-dev-framework-progress';

  /**
   * Create initial progress structure
   */
  static createInitialProgress(userId?: string): UserProgress {
    const steps: Record<string, ProgressStep> = {};
    const defaultStepIds: StepId[] = [
      "step-1-database",
      "step-2-user-input",
      "step-3-orchestrator",
      "step-4-ai-reasoning",
      "step-5-feedback"
    ];

    for (const stepId of defaultStepIds) {
      const tasks: Record<string, boolean> = {};
      tasks["db-1"] = false;
      tasks["db-2"] = false;
      tasks["db-3"] = false;
      tasks["db-4"] = false;
      tasks["ui-1"] = false;
      tasks["ui-2"] = false;
      tasks["ui-3"] = false;
      tasks["ui-4"] = false;
      tasks["orch-1"] = false;
      tasks["orch-2"] = false;
      tasks["orch-3"] = false;
      tasks["orch-4"] = false;
      tasks["ai-1"] = false;
      tasks["ai-2"] = false;
      tasks["ai-3"] = false;
      tasks["ai-4"] = false;
      tasks["fb-1"] = false;
      tasks["fb-2"] = false;
      tasks["fb-3"] = false;
      tasks["fb-4"] = false;

      steps[stepId] = {
        tasks,
        completed: false,
      };
    }

    const now = new Date();
    return {
      userId: userId || 'anonymous',
      steps: steps as Record<StepId, ProgressStep>,
      lastStep: "step-1-database",
      startedAt: now,
      lastUpdated: now,
    };
  }

  /**
   * Get user progress - tries Firestore first, falls back to localStorage
   */
  static async getUserProgress(userId?: string): Promise<UserProgress | null> {
    // Try Firestore for authenticated users
    if (userId && userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
      try {
        const docRef = doc(firestore, 'progress', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return {
            ...data,
            userId,
            startedAt: data.startedAt?.toDate?.() || new Date(data.startedAt),
            lastUpdated: data.lastUpdated?.toDate?.() || new Date(data.lastUpdated),
          } as UserProgress;
        }
      } catch (error) {
        console.error('Firestore read error, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    try {
      const saved = safeStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startedAt) parsed.startedAt = new Date(parsed.startedAt);
        if (parsed.lastUpdated) parsed.lastUpdated = new Date(parsed.lastUpdated);
        if (userId) parsed.userId = userId;

        // Migrate localStorage data to Firestore if user is authenticated
        if (userId && userId !== 'anonymous' && isFirebaseConfigured() && firestore) {
          this.saveToFirestore(userId, parsed).catch(() => {});
        }

        return parsed;
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }

    return null;
  }

  /**
   * Save user progress - saves to both Firestore and localStorage
   */
  static async saveProgress(progress: UserProgress): Promise<void> {
    // Always save to localStorage
    try {
      const saveable = {
        ...progress,
        startedAt: progress.startedAt instanceof Date ? progress.startedAt.toISOString() : progress.startedAt,
        lastUpdated: progress.lastUpdated instanceof Date ? progress.lastUpdated.toISOString() : progress.lastUpdated,
      };
      safeStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveable));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }

    // Also save to Firestore for authenticated users
    if (progress.userId && progress.userId !== 'anonymous') {
      await this.saveToFirestore(progress.userId, progress).catch(err => {
        console.error('Firestore save error:', err);
      });
    }
  }

  /**
   * Save progress to Firestore
   */
  private static async saveToFirestore(userId: string, progress: UserProgress): Promise<void> {
    if (!isFirebaseConfigured() || !firestore) return;

    try {
      const docRef = doc(firestore, 'progress', userId);
      // Convert steps to plain object for Firestore
      const stepsData: Record<string, unknown> = {};
      for (const [stepId, step] of Object.entries(progress.steps)) {
        stepsData[stepId] = {
          tasks: step.tasks,
          completed: step.completed,
          ...(step.completedAt ? { completedAt: step.completedAt } : {}),
        };
      }

      await setDoc(docRef, {
        userId,
        steps: stepsData,
        lastStep: progress.lastStep,
        startedAt: progress.startedAt,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving to Firestore:', error);
    }
  }

  /**
   * Update a single task status
   */
  static async updateTask(
    userId: string,
    stepId: StepId,
    taskId: string,
    completed: boolean
  ): Promise<void> {
    const progress = await this.getUserProgress(userId) || this.createInitialProgress(userId);
    const step = { ...progress.steps[stepId] };
    step.tasks = { ...step.tasks, [taskId]: completed };

    const allDone = Object.values(step.tasks).every(Boolean);
    step.completed = allDone;
    if (allDone && !step.completedAt) {
      step.completedAt = new Date();
    }

    progress.steps = { ...progress.steps, [stepId]: step };
    progress.lastStep = stepId;
    progress.lastUpdated = new Date();

    await this.saveProgress(progress);
  }

  /**
   * Mark entire step as completed
   */
  static async completeStep(userId: string, stepId: StepId): Promise<void> {
    const progress = await this.getUserProgress(userId) || this.createInitialProgress(userId);
    const step = { ...progress.steps[stepId] };

    step.tasks = Object.fromEntries(
      Object.keys(step.tasks).map(taskId => [taskId, true])
    );
    step.completed = true;
    step.completedAt = new Date();

    progress.steps = { ...progress.steps, [stepId]: step };
    progress.lastStep = stepId;
    progress.lastUpdated = new Date();

    await this.saveProgress(progress);
  }

  /**
   * Reset all progress for a user
   */
  static async resetProgress(userId: string): Promise<void> {
    const initial = this.createInitialProgress(userId);
    await this.saveProgress(initial);
  }

  /**
   * Get overall completion percentage
   */
  static getOverallCompletion(progress: UserProgress): number {
    let done = 0;
    let total = 0;

    for (const stepId of Object.keys(progress.steps) as StepId[]) {
      const step = progress.steps[stepId];
      for (const v of Object.values(step.tasks)) {
        total++;
        if (v) done++;
      }
    }

    return total === 0 ? 0 : Math.round((done / total) * 100);
  }

  /**
   * Get completion percentage for a specific step
   */
  static getStepCompletion(progress: UserProgress, stepId: StepId): number {
    const step = progress.steps[stepId];
    if (!step) return 0;

    const tasks = Object.values(step.tasks);
    const done = tasks.filter(Boolean).length;
    return tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
  }

  /**
   * Get completed steps
   */
  static getCompletedSteps(progress: UserProgress): StepId[] {
    return Object.entries(progress.steps)
      .filter(([_, step]) => step.completed)
      .map(([stepId]) => stepId as StepId);
  }

  /**
   * Get total number of tasks
   */
  static getTotalTasks(progress: UserProgress): number {
    return Object.values(progress.steps).reduce((total, step) => {
      return total + Object.keys(step.tasks).length;
    }, 0);
  }

  /**
   * Get number of completed tasks
   */
  static getCompletedTasks(progress: UserProgress): number {
    return Object.values(progress.steps).reduce((total, step) => {
      return total + Object.values(step.tasks).filter(Boolean).length;
    }, 0);
  }

  /**
   * Check if a task is completed
   */
  static isTaskCompleted(progress: UserProgress, stepId: StepId, taskId: string): boolean {
    return progress.steps[stepId]?.tasks[taskId] ?? false;
  }

  /**
   * Check if a step is completed
   */
  static isStepCompleted(progress: UserProgress, stepId: StepId): boolean {
    return progress.steps[stepId]?.completed ?? false;
  }
}
