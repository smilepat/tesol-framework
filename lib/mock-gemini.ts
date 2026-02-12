import { SAMPLE_VOCAB_DATA } from "./mock-data";

const MOCK_RESPONSES: Record<string, string> = {
  vocabulary_question: `{
  "question": "다음 중 'environment'의 의미로 가장 적절한 것은?",
  "options": [
    "A) 장비, 도구",
    "B) 주변 환경, 여건",
    "C) 오락, 유흥",
    "D) 건축물, 구조물"
  ],
  "answer": "B",
  "explanation": "'environment'는 사람이나 동식물이 살아가는 주변 환경이나 여건을 의미합니다."
}`,
  fill_blank: `{
  "question": "We must protect the _______ for future generations.",
  "options": [
    "A) entertainment",
    "B) environment",
    "C) equipment",
    "D) establishment"
  ],
  "answer": "B",
  "explanation": "'환경을 보호하다'는 'protect the environment'로 표현합니다."
}`,
  feedback: `## 학습 피드백

### 잘한 점 ✅
- 기본 어휘의 의미를 정확히 이해하고 있습니다.
- B1 레벨 단어에 대한 이해도가 높습니다.

### 개선할 점 📝
- C1 레벨 학술 어휘(hypothesis, consequence)의 정확한 의미를 복습하세요.
- 유사한 의미의 단어들을 혼동하지 않도록 예문과 함께 학습하세요.

### 추천 학습 방향 🎯
1. 틀린 단어를 예문과 함께 3번 이상 반복 학습하세요.
2. 동의어/반의어를 함께 정리해보세요.
3. 다음 평가 전 복습 퀴즈를 풀어보세요.`,
  default: `이것은 Gemini API의 시뮬레이션 응답입니다.

실제 앱에서는 Google의 Gemini API가 여기에 AI 생성 콘텐츠를 반환합니다.

**입력하신 프롬프트를 기반으로:**
- 어휘 문제를 생성하거나
- 학습 피드백을 제공하거나
- 맞춤형 학습 콘텐츠를 만들 수 있습니다.

> 💡 실제 API 키를 설정하면 진짜 AI 응답을 받을 수 있습니다!`,
};

function detectPromptType(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("문제") || lower.includes("question") || lower.includes("퀴즈") || lower.includes("quiz")) {
    return "vocabulary_question";
  }
  if (lower.includes("빈칸") || lower.includes("fill") || lower.includes("blank")) {
    return "fill_blank";
  }
  if (lower.includes("피드백") || lower.includes("feedback") || lower.includes("분석") || lower.includes("평가")) {
    return "feedback";
  }
  return "default";
}

export async function simulateGeminiCall(
  prompt: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  // Simulate network delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const promptType = detectPromptType(prompt);
  let response = MOCK_RESPONSES[promptType] || MOCK_RESPONSES.default;

  // Add some variation based on vocab data
  if (promptType === "vocabulary_question" && prompt.length > 20) {
    const randomWord = SAMPLE_VOCAB_DATA[Math.floor(Math.random() * SAMPLE_VOCAB_DATA.length)];
    response = response.replace(/environment/g, randomWord.word);
    response = response.replace(/주변 환경, 여건/g, randomWord.meaningKo);
  }

  return response;
}

export function getSimulatedMetadata() {
  return {
    model: "gemini-1.5-flash (시뮬레이션)",
    tokensUsed: Math.floor(Math.random() * 500) + 100,
    latencyMs: Math.floor(Math.random() * 2000) + 500,
  };
}
