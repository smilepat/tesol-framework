import { StepConfig } from "./types";

export const STEPS: StepConfig[] = [
  {
    id: "step-1-database",
    number: 1,
    title: "Database",
    titleKo: "데이터베이스 (구글 시트)",
    description: "Prepare your teaching data in Google Sheets",
    descriptionKo:
      "교사가 준비한 단어, 지문, 정답 데이터셋을 구글 시트에 구조화합니다. 구글 시트는 무료이고, 협업이 쉬우며, API를 통해 앱과 연결할 수 있습니다.",
    color: {
      bg: "bg-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-800",
      accent: "#2563eb",
    },
    icon: "Database",
    tasks: [
      { id: "db-1", label: "구글 시트 데이터 구조 이해하기" },
      { id: "db-2", label: "샘플 단어 데이터 살펴보기" },
      { id: "db-3", label: "시트 연결 테스트 해보기" },
      { id: "db-4", label: "API 코드 예제 확인하기" },
    ],
    learningObjectives: [
      "구글 시트를 데이터베이스로 활용하는 방법을 이해합니다.",
      "교육 데이터(단어, 지문, 정답)를 구조화하는 원칙을 학습합니다.",
      "Google Sheets API를 통한 데이터 연동 방법을 파악합니다.",
    ],
    codeExamples: [
      {
        title: "Google Sheets API 연결",
        language: "typescript",
        code: `import { google } from 'googleapis';

// 구글 시트 API 클라이언트 설정
const sheets = google.sheets({ version: 'v4' });

// 시트에서 데이터 읽기
async function readVocabData(spreadsheetId: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: '단어목록!A1:F100',  // 시트이름!범위
  });

  const rows = response.data.values;
  if (!rows) return [];

  // 헤더와 데이터 분리
  const [headers, ...data] = rows;

  return data.map(row => ({
    word: row[0],
    meaning: row[1],
    meaningKo: row[2],
    example: row[3],
    cefrLevel: row[4],
    domain: row[5],
  }));
}`,
        description: "Google Sheets API를 사용하여 단어 데이터를 읽어오는 기본 코드입니다.",
      },
      {
        title: "시트에 학습 기록 저장",
        language: "typescript",
        code: `// 학생 학습 기록을 시트에 저장
async function saveStudentResponse(
  spreadsheetId: string,
  response: {
    studentId: string;
    word: string;
    answer: string;
    correct: boolean;
    timestamp: string;
  }
) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: '학습기록!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        response.studentId,
        response.word,
        response.answer,
        response.correct ? 'O' : 'X',
        response.timestamp,
      ]],
    },
  });
}`,
        description: "학생의 학습 기록을 구글 시트에 추가하는 코드입니다.",
      },
    ],
  },
  {
    id: "step-2-user-input",
    number: 2,
    title: "User Input",
    titleKo: "사용자 입력 (UI)",
    description: "Build input interfaces for students and teachers",
    descriptionKo:
      "학생과 교사가 앱과 상호작용하는 입력 인터페이스를 만듭니다. 드롭다운, 입력 필드, 모달, 사이드바 등 다양한 UI 패턴을 활용합니다.",
    color: {
      bg: "bg-green-600",
      bgLight: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800",
      accent: "#16a34a",
    },
    icon: "FormInput",
    tasks: [
      { id: "ui-1", label: "기본 입력 컴포넌트 살펴보기" },
      { id: "ui-2", label: "폼 조합 패턴 이해하기" },
      { id: "ui-3", label: "모달/사이드바 패턴 확인하기" },
      { id: "ui-4", label: "실시간 미리보기 체험하기" },
    ],
    learningObjectives: [
      "React 기본 입력 컴포넌트(Input, Select, Textarea)를 사용합니다.",
      "교육 앱에 적합한 UI 패턴(폼, 모달, 사이드바)을 이해합니다.",
      "사용자 입력 데이터를 상태로 관리하는 방법을 학습합니다.",
    ],
    codeExamples: [
      {
        title: "학습 설정 폼",
        language: "tsx",
        code: `'use client';
import { useState } from 'react';

export function LearningSettingsForm() {
  const [settings, setSettings] = useState({
    cefrLevel: 'B1',
    wordCount: 10,
    questionType: 'multiple-choice',
  });

  return (
    <form className="space-y-4">
      {/* CEFR 레벨 선택 */}
      <div>
        <label>CEFR 레벨</label>
        <select
          value={settings.cefrLevel}
          onChange={(e) =>
            setSettings(prev => ({ ...prev, cefrLevel: e.target.value }))
          }
        >
          <option value="A1">A1 - 입문</option>
          <option value="A2">A2 - 초급</option>
          <option value="B1">B1 - 중급</option>
          <option value="B2">B2 - 중상급</option>
        </select>
      </div>

      {/* 단어 수 입력 */}
      <div>
        <label>단어 수</label>
        <input
          type="number"
          min={5} max={30}
          value={settings.wordCount}
          onChange={(e) =>
            setSettings(prev => ({ ...prev, wordCount: Number(e.target.value) }))
          }
        />
      </div>
    </form>
  );
}`,
        description: "학생이 학습 설정을 선택하는 폼 컴포넌트 예제입니다.",
      },
    ],
  },
  {
    id: "step-3-orchestrator",
    number: 3,
    title: "Orchestrator",
    titleKo: "오케스트레이터",
    description: "Combine user input, sheet data, and AI prompt",
    descriptionKo:
      "사용자 입력, 시트 데이터, AI 프롬프트를 하나로 결합하는 핵심 로직입니다. 오케스트레이터는 앱의 '두뇌' 역할을 합니다.",
    color: {
      bg: "bg-purple-600",
      bgLight: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      badge: "bg-purple-100 text-purple-800",
      accent: "#9333ea",
    },
    icon: "Workflow",
    tasks: [
      { id: "orch-1", label: "데이터 결합 흐름 이해하기" },
      { id: "orch-2", label: "프롬프트 템플릿 작성해보기" },
      { id: "orch-3", label: "데이터 결합 결과 확인하기" },
      { id: "orch-4", label: "에러 처리 패턴 살펴보기" },
    ],
    learningObjectives: [
      "[사용자 입력 + 시트 데이터 + 프롬프트]를 하나로 결합하는 로직을 이해합니다.",
      "프롬프트 템플릿에 변수를 삽입하는 방법을 학습합니다.",
      "오케스트레이터 함수를 API 라우트로 구현하는 방법을 파악합니다.",
    ],
    codeExamples: [
      {
        title: "오케스트레이터 함수",
        language: "typescript",
        code: `// 사용자 입력 + 시트 데이터 + 프롬프트 결합
function buildPrompt(
  userInput: { cefrLevel: string; wordCount: number; questionType: string },
  sheetData: { word: string; meaning: string; example: string }[],
  promptTemplate: string
): string {
  // 1. 시트 데이터에서 단어 목록 추출
  const wordList = sheetData
    .map(w => \`- \${w.word}: \${w.meaning} (예: \${w.example})\`)
    .join('\\n');

  // 2. 프롬프트 템플릿에 변수 삽입
  const finalPrompt = promptTemplate
    .replace('{{CEFR_LEVEL}}', userInput.cefrLevel)
    .replace('{{WORD_COUNT}}', String(userInput.wordCount))
    .replace('{{QUESTION_TYPE}}', userInput.questionType)
    .replace('{{WORD_LIST}}', wordList);

  return finalPrompt;
}

// 프롬프트 템플릿 예시
const PROMPT_TEMPLATE = \`
당신은 영어 교육 전문가입니다.

다음 단어 목록을 사용하여 {{QUESTION_TYPE}} 유형의
영어 어휘 문제를 {{WORD_COUNT}}개 만들어주세요.

학생의 수준: CEFR {{CEFR_LEVEL}}

단어 목록:
{{WORD_LIST}}

JSON 형식으로 반환해주세요.
\`;`,
        description: "3가지 데이터 소스를 하나의 프롬프트로 결합하는 오케스트레이터 함수입니다.",
      },
    ],
  },
  {
    id: "step-4-ai-reasoning",
    number: 4,
    title: "AI Reasoning",
    titleKo: "AI 추론 (Gemini API)",
    description: "Use Gemini API to generate results and feedback",
    descriptionKo:
      "결합된 프롬프트를 Gemini API에 전송하여 문제 생성, 채점, 피드백 등 AI 기반 결과를 도출합니다.",
    color: {
      bg: "bg-orange-600",
      bgLight: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-800",
      accent: "#ea580c",
    },
    icon: "Sparkles",
    tasks: [
      { id: "ai-1", label: "Gemini API 기본 사용법 이해하기" },
      { id: "ai-2", label: "API 플레이그라운드에서 테스트하기" },
      { id: "ai-3", label: "파라미터(temperature 등) 조절해보기" },
      { id: "ai-4", label: "응답 파싱 코드 확인하기" },
    ],
    learningObjectives: [
      "Gemini API의 기본 사용법을 이해합니다.",
      "프롬프트 엔지니어링의 기초를 학습합니다.",
      "API 응답을 파싱하고 에러를 처리하는 방법을 파악합니다.",
    ],
    codeExamples: [
      {
        title: "Gemini API 호출 (Vercel AI SDK)",
        language: "typescript",
        code: `import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Next.js API Route
export async function POST(request: Request) {
  const { prompt } = await request.json();

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: prompt,
      // 파라미터 설정
      temperature: 0.7,  // 창의성 (0=정확, 1=창의적)
      maxTokens: 1024,   // 최대 응답 길이
    });

    // JSON 응답 파싱
    const result = JSON.parse(text);

    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    return Response.json(
      { success: false, error: '생성 실패' },
      { status: 500 }
    );
  }
}`,
        description: "Vercel AI SDK를 사용하여 Gemini API를 호출하는 코드입니다.",
      },
    ],
  },
  {
    id: "step-5-feedback",
    number: 5,
    title: "Feedback & Log",
    titleKo: "피드백 & 기록",
    description: "Display results and save learning history",
    descriptionKo:
      "AI가 생성한 결과를 화면에 보여주고, 학습 이력을 구글 시트(DB)에 저장합니다. 학생에게 즉각적인 피드백을 제공하고, 교사에게 학습 데이터를 축적합니다.",
    color: {
      bg: "bg-pink-600",
      bgLight: "bg-pink-50",
      border: "border-pink-200",
      text: "text-pink-700",
      badge: "bg-pink-100 text-pink-800",
      accent: "#db2777",
    },
    icon: "MessageSquareText",
    tasks: [
      { id: "fb-1", label: "결과 표시 패턴 살펴보기" },
      { id: "fb-2", label: "학습 기록 저장 시뮬레이션 해보기" },
      { id: "fb-3", label: "학습 이력 차트 확인하기" },
      { id: "fb-4", label: "피드백 루프 전체 흐름 이해하기" },
    ],
    learningObjectives: [
      "AI 응답을 사용자 친화적으로 화면에 표시하는 방법을 학습합니다.",
      "학습 이력을 구글 시트에 저장하는 로깅 패턴을 이해합니다.",
      "데이터 시각화를 통한 학습 분석 방법을 파악합니다.",
    ],
    codeExamples: [
      {
        title: "결과 표시 및 기록 저장",
        language: "tsx",
        code: `'use client';
import { useState } from 'react';

interface QuizResult {
  word: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export function ResultDisplay({ results }: { results: QuizResult[] }) {
  const score = results.filter(r => r.isCorrect).length;
  const total = results.length;

  // 결과를 시트에 저장
  async function saveToSheet() {
    await fetch('/api/save-result', {
      method: 'POST',
      body: JSON.stringify({
        score,
        total,
        results,
        timestamp: new Date().toISOString(),
      }),
    });
  }

  return (
    <div className="space-y-4">
      {/* 점수 표시 */}
      <div className="text-center text-2xl font-bold">
        {score} / {total} 정답 ({Math.round(score/total*100)}%)
      </div>

      {/* 개별 결과 */}
      {results.map((r, i) => (
        <div key={i} className={r.isCorrect ? 'bg-green-50' : 'bg-red-50'}>
          <p>{r.word}: {r.isCorrect ? '✅ 정답' : '❌ 오답'}</p>
          {!r.isCorrect && <p>정답: {r.correctAnswer}</p>}
        </div>
      ))}

      {/* 저장 버튼 */}
      <button onClick={saveToSheet}>
        📊 학습 기록 저장하기
      </button>
    </div>
  );
}`,
        description: "퀴즈 결과를 표시하고 학습 기록을 시트에 저장하는 컴포넌트입니다.",
      },
    ],
  },
];

export function getStepById(id: string): StepConfig | undefined {
  return STEPS.find((s) => s.id === id);
}

export function getStepByNumber(num: number): StepConfig | undefined {
  return STEPS.find((s) => s.number === num);
}
