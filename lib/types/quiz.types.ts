export interface QuizSettings {
  purpose: "review" | "midterm" | "homework" | "diagnostic" | "custom";
  gradeLevel: string;
  topic: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  questionTypes: ("multiple-choice" | "fill-in-blank" | "short-answer")[];
  questionCount: number;
  learningObjective?: string;
}

export interface QuizItem {
  id: string;
  type: "multiple-choice" | "fill-in-blank" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  word: string;
  teacherNote?: string;
}

export interface GeneratedQuiz {
  id: string;
  settings: QuizSettings;
  items: QuizItem[];
  createdAt: Date;
}

export interface CsvRow {
  word: string;
  meaning: string;
  meaningKo: string;
  example: string;
  cefrLevel: string;
  domain: string;
  [key: string]: string;
}

export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6;

export const PURPOSE_LABELS: Record<QuizSettings["purpose"], string> = {
  review: "수업 복습",
  midterm: "중간/기말 시험",
  homework: "숙제",
  diagnostic: "진단 평가",
  custom: "직접 입력",
};

export const GRADE_LEVELS = [
  { value: "middle-1", label: "중학교 1학년" },
  { value: "middle-2", label: "중학교 2학년" },
  { value: "middle-3", label: "중학교 3학년" },
  { value: "high-1", label: "고등학교 1학년" },
  { value: "high-2", label: "고등학교 2학년" },
  { value: "high-3", label: "고등학교 3학년" },
];

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  "multiple-choice": "객관식",
  "fill-in-blank": "빈칸 채우기",
  "short-answer": "단답형",
};
