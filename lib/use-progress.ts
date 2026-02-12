"use client";

import { useState, useEffect, useCallback } from "react";
import { StepId, UserProgress, StepProgress } from "./types";
import { STEPS } from "./constants";

const STORAGE_KEY = "app-dev-framework-progress";

function createInitialProgress(): UserProgress {
  const steps: Record<string, StepProgress> = {};
  for (const step of STEPS) {
    const tasks: Record<string, boolean> = {};
    for (const task of step.tasks) {
      tasks[task.id] = false;
    }
    steps[step.id] = { tasks, completed: false };
  }
  return {
    steps: steps as Record<StepId, StepProgress>,
    lastStep: "step-1-database",
    startedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      } else {
        const initial = createInitialProgress();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        setProgress(initial);
      }
    } catch {
      const initial = createInitialProgress();
      setProgress(initial);
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((updated: UserProgress) => {
    updated.lastUpdated = new Date().toISOString();
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleTask = useCallback(
    (stepId: StepId, taskId: string) => {
      if (!progress) return;
      const updated = { ...progress };
      const step = { ...updated.steps[stepId] };
      step.tasks = { ...step.tasks, [taskId]: !step.tasks[taskId] };

      // Check if all tasks are done
      const allDone = Object.values(step.tasks).every(Boolean);
      step.completed = allDone;
      if (allDone && !step.completedAt) {
        step.completedAt = new Date().toISOString();
      }

      updated.steps = { ...updated.steps, [stepId]: step };
      updated.lastStep = stepId;
      save(updated);
    },
    [progress, save]
  );

  const isTaskCompleted = useCallback(
    (stepId: StepId, taskId: string): boolean => {
      if (!progress) return false;
      return progress.steps[stepId]?.tasks[taskId] ?? false;
    },
    [progress]
  );

  const isStepCompleted = useCallback(
    (stepId: StepId): boolean => {
      if (!progress) return false;
      return progress.steps[stepId]?.completed ?? false;
    },
    [progress]
  );

  const getOverallCompletion = useCallback((): number => {
    if (!progress) return 0;
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
  }, [progress]);

  const getStepCompletion = useCallback(
    (stepId: StepId): number => {
      if (!progress) return 0;
      const step = progress.steps[stepId];
      if (!step) return 0;
      const tasks = Object.values(step.tasks);
      const done = tasks.filter(Boolean).length;
      return tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    const initial = createInitialProgress();
    save(initial);
  }, [save]);

  return {
    progress,
    isLoaded,
    toggleTask,
    isTaskCompleted,
    isStepCompleted,
    getOverallCompletion,
    getStepCompletion,
    resetProgress,
  };
}
