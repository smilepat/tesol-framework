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
  completedAt?: string;
}

export interface UserProgress {
  steps: Record<StepId, StepProgress>;
  lastStep: StepId;
  startedAt: string;
  lastUpdated: string;
}

export interface VocabWord {
  word: string;
  meaning: string;
  meaningKo: string;
  example: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  domain: string;
}

export interface SheetRow {
  [key: string]: string;
}

export interface MockGeminiResponse {
  success: boolean;
  response: string;
  metadata: {
    model: string;
    tokensUsed: number;
    latencyMs: number;
  };
}
