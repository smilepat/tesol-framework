import { CsvRow, QuizItem, QuizSettings, QUESTION_TYPE_LABELS } from '../types/quiz.types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class GeminiService {
  /**
   * Check if Gemini API is configured
   */
  static isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  /**
   * Call Gemini API with a prompt
   */
  static async generate(prompt: string, temperature: number = 0.7): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Generate quiz items using Gemini AI
   */
  static async generateQuiz(words: CsvRow[], settings: QuizSettings): Promise<QuizItem[]> {
    const wordList = words
      .slice(0, settings.questionCount * 2)
      .map(w => `- ${w.word}: ${w.meaningKo || w.meaning}${w.example ? ` (예: ${w.example})` : ''}`)
      .join('\n');

    const questionTypes = settings.questionTypes
      .map(t => QUESTION_TYPE_LABELS[t])
      .join(', ');

    const prompt = `당신은 영어교육 전문가입니다. 다음 조건으로 영어 퀴즈를 생성해주세요.

## 조건
- CEFR 레벨: ${settings.cefrLevel}
- 문제 유형: ${questionTypes}
- 문제 수: ${settings.questionCount}개
- 대상: 한국인 영어 학습자

## 단어 데이터
${wordList}

## 출력 형식
반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

[
  {
    "type": "multiple-choice" | "fill-in-blank" | "short-answer",
    "question": "문제 텍스트",
    "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
    "correctAnswer": "정답",
    "explanation": "해설",
    "word": "관련 단어"
  }
]

주의사항:
- multiple-choice는 4개 선택지 필수, 한국어로 작성
- fill-in-blank은 options 없이, 예문에서 단어를 ________로 대체
- short-answer는 options 없이, 한국어 뜻을 주고 영어 단어를 묻기
- explanation은 한국어로 작성
- 정확히 ${settings.questionCount}개 문제 생성`;

    const response = await this.generate(prompt, 0.8);

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const items = JSON.parse(jsonStr);
      return items.map((item: QuizItem, index: number) => ({
        ...item,
        id: `q-${index + 1}`,
      }));
    } catch {
      throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
    }
  }

  /**
   * Generate a general response (for demo-gemini endpoint)
   */
  static async generateResponse(prompt: string, temperature?: number): Promise<{
    response: string;
    metadata: { model: string; tokensUsed: number; latencyMs: number };
  }> {
    const startTime = Date.now();
    const response = await this.generate(prompt, temperature);
    const latencyMs = Date.now() - startTime;

    return {
      response,
      metadata: {
        model: 'gemini-2.0-flash',
        tokensUsed: Math.ceil(response.length / 4),
        latencyMs,
      },
    };
  }
}
