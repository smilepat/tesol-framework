import { GeminiService } from "@/lib/services/gemini.service";
import { QuizService } from "@/lib/services/quiz.service";
import { CsvRow, QuizSettings } from "@/lib/types/quiz.types";

export async function POST(request: Request) {
  try {
    const { words, settings } = (await request.json()) as {
      words: CsvRow[];
      settings: QuizSettings;
    };

    if (!words || words.length === 0) {
      return Response.json(
        { success: false, error: "단어 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    // Try real Gemini API first, fallback to mock
    if (GeminiService.isConfigured()) {
      try {
        const items = await GeminiService.generateQuiz(words, settings);
        return Response.json({
          success: true,
          items,
          source: "gemini",
        });
      } catch (err) {
        console.error("Gemini API failed, falling back to mock:", err);
      }
    }

    // Mock fallback
    const quiz = await QuizService.generateQuiz(words, settings);
    return Response.json({
      success: true,
      items: quiz.items,
      source: "mock",
    });
  } catch {
    return Response.json(
      { success: false, error: "퀴즈 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
