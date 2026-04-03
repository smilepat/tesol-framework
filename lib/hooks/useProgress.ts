import { useState, useEffect, useCallback } from 'react';
import { StepId } from '../types/step.types';
import { UserProgress } from '../types/user.types';
import { ProgressService } from '../services/progress.service';
import { AuthService } from '../services/auth.service';

export interface UseProgressReturn {
  progress: UserProgress | null;
  isLoaded: boolean;
  loading: boolean;
  error: string | null;
  toggleTask: (stepId: StepId, taskId: string) => Promise<void>;
  updateTask: (stepId: StepId, taskId: string, completed: boolean) => Promise<void>;
  completeStep: (stepId: StepId) => Promise<void>;
  resetProgress: () => Promise<void>;
  refresh: () => Promise<void>;
  // Computed values
  overallCompletion: number;
  stepCompletion: (stepId: StepId) => number;
  isTaskCompleted: (stepId: StepId, taskId: string) => boolean;
  isStepCompleted: (stepId: StepId) => boolean;
  completedSteps: StepId[];
  totalTasks: number;
  completedTasks: number;
}

/**
 * Custom hook for user progress management
 * Replaces the original use-progress.ts with a service-based approach
 */
export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current user ID
  const currentUser = AuthService.getCurrentUser();
  const userId = currentUser?.uid || 'anonymous';

  // Load user progress
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userProgress = await ProgressService.getUserProgress(userId);
      if (!userProgress) {
        // Create initial progress if none exists
        const initial = ProgressService.createInitialProgress(userId);
        await ProgressService.saveProgress(initial);
        setProgress(initial);
      } else {
        setProgress(userProgress);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoaded(true);
      setLoading(false);
    }
  }, [userId]);

  // Load progress on mount and when user changes
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Toggle task completion
  const toggleTask = useCallback(async (stepId: StepId, taskId: string) => {
    if (!progress) return;

    try {
      setLoading(true);
      setError(null);

      const isCurrentlyCompleted = ProgressService.isTaskCompleted(progress, stepId, taskId);
      await ProgressService.updateTask(userId, stepId, taskId, !isCurrentlyCompleted);

      // Refresh progress
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task');
    } finally {
      setLoading(false);
    }
  }, [progress, userId, loadProgress]);

  // Update task completion status
  const updateTask = useCallback(async (stepId: StepId, taskId: string, completed: boolean) => {
    if (!progress) return;

    try {
      setLoading(true);
      setError(null);

      await ProgressService.updateTask(userId, stepId, taskId, completed);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setLoading(false);
    }
  }, [progress, userId, loadProgress]);

  // Mark entire step as completed
  const completeStep = useCallback(async (stepId: StepId) => {
    if (!progress) return;

    try {
      setLoading(true);
      setError(null);

      await ProgressService.completeStep(userId, stepId);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete step');
    } finally {
      setLoading(false);
    }
  }, [progress, userId, loadProgress]);

  // Reset all progress
  const resetProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await ProgressService.resetProgress(userId);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
    } finally {
      setLoading(false);
    }
  }, [userId, loadProgress]);

  // Refresh progress data
  const refresh = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  // Computed values
  const overallCompletion = progress ? ProgressService.getOverallCompletion(progress) : 0;
  const stepCompletion = (stepId: StepId) => progress ? ProgressService.getStepCompletion(progress, stepId) : 0;
  const isTaskCompleted = (stepId: StepId, taskId: string) => progress ? ProgressService.isTaskCompleted(progress, stepId, taskId) : false;
  const isStepCompleted = (stepId: StepId) => progress ? ProgressService.isStepCompleted(progress, stepId) : false;
  const completedSteps = progress ? ProgressService.getCompletedSteps(progress) : [];
  const totalTasks = progress ? ProgressService.getTotalTasks(progress) : 0;
  const completedTasks = progress ? ProgressService.getCompletedTasks(progress) : 0;

  return {
    progress,
    isLoaded,
    loading,
    error,
    toggleTask,
    updateTask,
    completeStep,
    resetProgress,
    refresh,
    overallCompletion,
    stepCompletion,
    isTaskCompleted,
    isStepCompleted,
    completedSteps,
    totalTasks,
    completedTasks,
  };
}

/**
 * Hook for progress analytics
 */
export function useProgressAnalytics() {
  const { progress } = useProgress();

  if (!progress) {
    return {
      overallCompletion: 0,
      stepCompletions: {} as Record<StepId, number>,
      totalTasks: 0,
      completedTasks: 0,
      lastUpdated: new Date(),
    };
  }

  const stepCompletions: Record<StepId, number> = {} as Record<StepId, number>;
  Object.keys(progress.steps).forEach(stepId => {
    stepCompletions[stepId as StepId] = ProgressService.getStepCompletion(progress, stepId as StepId);
  });

  return {
    overallCompletion: ProgressService.getOverallCompletion(progress),
    stepCompletions,
    totalTasks: ProgressService.getTotalTasks(progress),
    completedTasks: ProgressService.getCompletedTasks(progress),
    lastUpdated: progress.lastUpdated,
  };
}
