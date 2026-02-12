import { VocabWord, SheetRow } from "./types";

export const SAMPLE_VOCAB_DATA: VocabWord[] = [
  {
    word: "environment",
    meaning: "The surroundings or conditions in which a person lives",
    meaningKo: "환경",
    example: "We must protect the environment for future generations.",
    cefrLevel: "B1",
    domain: "academic",
  },
  {
    word: "significant",
    meaning: "Sufficiently great or important to be worthy of attention",
    meaningKo: "중요한, 의미 있는",
    example: "There has been a significant increase in temperature.",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "consequence",
    meaning: "A result or effect of an action or condition",
    meaningKo: "결과, 영향",
    example: "Climate change has serious consequences for all of us.",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "hypothesis",
    meaning: "A proposed explanation made on the basis of limited evidence",
    meaningKo: "가설",
    example: "The scientist tested her hypothesis through experiments.",
    cefrLevel: "C1",
    domain: "academic",
  },
  {
    word: "collaborate",
    meaning: "To work jointly on an activity or project",
    meaningKo: "협력하다",
    example: "Students collaborate on group projects every week.",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "interpret",
    meaning: "To explain the meaning of information or actions",
    meaningKo: "해석하다",
    example: "How do you interpret the results of this survey?",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "perspective",
    meaning: "A particular attitude toward or way of regarding something",
    meaningKo: "관점, 시각",
    example: "Try to see it from a different perspective.",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "sustainable",
    meaning: "Able to be maintained at a certain rate or level",
    meaningKo: "지속 가능한",
    example: "We need to develop sustainable energy sources.",
    cefrLevel: "B2",
    domain: "academic",
  },
  {
    word: "evaluate",
    meaning: "To form an idea of the amount or value of something",
    meaningKo: "평가하다",
    example: "Teachers evaluate student performance regularly.",
    cefrLevel: "B1",
    domain: "academic",
  },
  {
    word: "demonstrate",
    meaning: "To clearly show the existence or truth of something",
    meaningKo: "보여주다, 증명하다",
    example: "The experiment demonstrates the principle of gravity.",
    cefrLevel: "B1",
    domain: "academic",
  },
];

export const SAMPLE_SHEET_HEADERS = [
  "단어(Word)",
  "뜻(Meaning)",
  "한국어뜻",
  "예문(Example)",
  "CEFR",
  "도메인(Domain)",
];

export const SAMPLE_SHEET_ROWS: SheetRow[] = SAMPLE_VOCAB_DATA.map((w) => ({
  "단어(Word)": w.word,
  "뜻(Meaning)": w.meaning,
  "한국어뜻": w.meaningKo,
  "예문(Example)": w.example,
  CEFR: w.cefrLevel,
  "도메인(Domain)": w.domain,
}));

export const SAMPLE_STUDENT_RESPONSES = [
  { studentId: "student-01", name: "김민수", word: "environment", answer: "환경", correct: true, score: 100, timestamp: "2025-03-01T09:15:00" },
  { studentId: "student-01", name: "김민수", word: "significant", answer: "중요한", correct: true, score: 100, timestamp: "2025-03-01T09:16:00" },
  { studentId: "student-02", name: "이서연", word: "environment", answer: "환경", correct: true, score: 100, timestamp: "2025-03-01T09:15:30" },
  { studentId: "student-02", name: "이서연", word: "hypothesis", answer: "가정", correct: false, score: 50, timestamp: "2025-03-01T09:17:00" },
  { studentId: "student-03", name: "박지훈", word: "consequence", answer: "결론", correct: false, score: 30, timestamp: "2025-03-01T09:16:00" },
  { studentId: "student-03", name: "박지훈", word: "collaborate", answer: "협력하다", correct: true, score: 100, timestamp: "2025-03-01T09:18:00" },
];
