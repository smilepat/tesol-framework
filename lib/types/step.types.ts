export type StepId =
  | "step-1-database"
  | "step-2-user-input"
  | "step-3-orchestrator"
  | "step-4-ai-reasoning"
  | "step-5-feedback";

export interface TaskItem {
  id: string;
  label: string;
}

export interface CodeExample {
  title: string;
  language: "typescript" | "javascript" | "json" | "tsx" | "bash";
  code: string;
  description: string;
}

export interface StepConfig {
  id: StepId;
  number: number;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  color: {
    bg: string;
    bgLight: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  };
  icon: string;
  tasks: TaskItem[];
  codeExamples: CodeExample[];
  learningObjectives: string[];
}

export interface StepProgress {
  tasks: Record<string, boolean>;
  completed: boolean;
  completedAt?: Date;
}
